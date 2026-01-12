import { type NextRequest, NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { getPrisma } from "@/db";
import { uuidParam } from "@/lib/schemas/id.schema";
import { pullRequestSchema } from "@/lib/schemas/pr.schema";
import { ForbiddenError, NotFoundError } from "@/lib/server/error";
import { handleError } from "@/lib/server/handleError";
import { getCurrentUser } from "@/lib/server/session";

const prisma = getPrisma();

export async function POST(
	req: NextRequest,
	context: { params: Promise<{ repoId: string }> },
) {
	try {
		// 1. Find user
		const user = await getCurrentUser();
		if (!user) throw new ForbiddenError("Unauthenticated");

		// 2. Get repository ID
		const { repoId } = await uuidParam("repoId").parseAsync(await context.params);

		// 3. Check if user is a member of this repo
		const repo = await prisma.repository.findUnique({
			where: { id: repoId },
			include: { members: true },
		});

		if (!repo) throw new NotFoundError("Repository not found");

		const isMember = repo.members.some((m) => m.userId === user.id);
		if (!isMember) {
			throw new ForbiddenError("You are not a member of this repository");
		}

		// 4. Validate inputs
		const { prTitle, prBody, baseBranch, compareBranch, language } =
			await pullRequestSchema.parseAsync(await req.json());

		// 5. Insert new PR
		const pr = await prisma.pullRequest.create({
			data: {
				repositoryId: repoId,
				title: sanitizeHtml(prTitle),
				description: sanitizeHtml(prBody),
				baseBranch,
				compareBranch,
				createdById: user.id,
				language: language,
			},
		});

		return NextResponse.json({ prId: pr.id }, { status: 201 });
	} catch (error) {
		return handleError(error);
	}
}
