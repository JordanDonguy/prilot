import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getPrisma } from "@/db";
import { emailSchema } from "@/lib/schemas/email.schema";
import { uuidParam } from "@/lib/schemas/id.schema";
import { config } from "@/lib/server/config";
import {
	ConflictError,
	ForbiddenError,
	NotFoundError,
} from "@/lib/server/error";
import { handleError } from "@/lib/server/handleError";
import { sendRepoInviteEmail } from "@/lib/server/resend/emails/repoInvite";
import { getCurrentUser } from "@/lib/server/session";

const prisma = getPrisma();

export async function POST(
	req: Request,
	context: { params: Promise<{ repoId: string }> },
) {
	try {
		// 1. Find user and validate repoId params
		const user = await getCurrentUser();
		if (!user) throw new ForbiddenError("Unauthorized");

		const { repoId } = await uuidParam("repoId").parseAsync(
			await context.params,
		);

		// 2. Validate body
		const { email } = await emailSchema.parseAsync(await req.json());

		// 3. Prevent inviting self
		if (email.toLowerCase() === user.email.toLowerCase()) {
			throw new ConflictError(
				"You cannot invite yourself to your own repository",
			);
		}

		// 4. Fetch repo + permission check
		const repo = await prisma.repository.findUnique({
			where: { id: repoId },
			include: {
				members: {
					where: { userId: user.id },
				},
			},
		});
		if (!repo) throw new NotFoundError("Repository not found");

		const isOwner = repo.members.some(
			(m) => m.userId === user.id && m.role === "owner",
		);
		if (!isOwner) throw new ForbiddenError("Forbidden");

		// 5. Create invitation
		const token = crypto.randomBytes(32).toString("hex");

		await prisma.invitation.upsert({
			where: {
				repositoryId_email: {
					repositoryId: repo.id,
					email,
				},
			},
			update: {
				token,
				status: "pending",
				invitedById: user.id,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			},
			create: {
				repositoryId: repo.id,
				email,
				invitedById: user.id,
				token,
				status: "pending",
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			},
		});

		// 6. Send email
		const inviteUrl = `${config.frontendUrl}/invitations/${token}/accept`;
		const declineUrl = `${config.frontendUrl}/invitations/${token}/decline`;

		const result = await sendRepoInviteEmail({
			to: email,
			repoName: repo.name,
			owner: user.username,
			inviteUrl,
			declineUrl,
		});

		if (result.error) throw new Error("Error sending email");

		return NextResponse.json({ success: true });
	} catch (error) {
		return handleError(error);
	}
}
