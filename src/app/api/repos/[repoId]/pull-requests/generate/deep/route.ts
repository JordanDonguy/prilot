import { type NextRequest, NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { getPrisma } from "@/db";
import { branchSchema } from "@/lib/schemas/branch.schema";
import { uuidParam } from "@/lib/schemas/id.schema";
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from "@/lib/server/error";
import { getFileDiffsAndCommits } from "@/lib/server/github/fileDiffs";
import { groq } from "@/lib/server/groq/client";
import { buildPRFromDiffs } from "@/lib/server/groq/prompt";
import { summarizeDiffsForPR } from "@/lib/server/groq/summarizeFileDiffs";
import { handleError } from "@/lib/server/handleError";
import { rateLimitOrThrow } from "@/lib/server/redis/rate-limit";
import {
	aiLimiterPerMinute,
	aiLimiterPerWeek,
	githubCompareCommitsLimiter,
} from "@/lib/server/redis/rate-limiters";
import { getCurrentUser } from "@/lib/server/session";
import { formatDateTimeForErrors } from "@/lib/utils/formatDateTime";
import type { IPRResponse } from "@/types/pullRequests";

const prisma = getPrisma();

export async function POST(
	req: NextRequest,
	context: { params: Promise<{ repoId: string }> },
) {
	try {
		// 1. Auth
		const user = await getCurrentUser();
		if (!user) throw new UnauthorizedError("You must be logged in");

		// 2. Repo ID
		const { repoId } = await uuidParam("repoId").parseAsync(
			await context.params,
		);

		// 3. Parse body
		const body = await req.json();
		const baseBranch = await branchSchema.parseAsync(body.baseBranch);
		const compareBranch = await branchSchema.parseAsync(body.compareBranch);
		const language = body.language;

		const safeBase = sanitizeHtml(baseBranch);
		const safeCompare = sanitizeHtml(compareBranch);

		if (!safeBase || !safeCompare) {
			throw new BadRequestError("Invalid branch names");
		}

		// 4. Fetch repo + members + installation
		const repo = await prisma.repository.findUnique({
			where: { id: repoId },
			include: {
				installation: true,
				members: true,
			},
		});

		if (!repo) throw new NotFoundError("Repository not found");
		if (!repo.installation?.installationId) {
			throw new BadRequestError("Repository has no linked installation");
		}

		// 5. Membership check
		const isMember = repo.members.some((m) => m.userId === user.id);
		if (!isMember) {
			throw new ForbiddenError("You are not a member of this repository");
		}

		// 6. GitHub rate limit
		const ghLimit = await githubCompareCommitsLimiter.limit(
			`github:compare:user:${user.id}`,
		);
		rateLimitOrThrow(ghLimit);

		// 7. Fetch file diffs, throw if more than 30 files are modified
		const { files, commits } = await getFileDiffsAndCommits(
			repo.installation.installationId,
			repo.owner,
			repo.name,
			safeBase,
			safeCompare,
		);

		if (!files || files.length === 0) {
			throw new BadRequestError("No file changes found between branches");
		}

		const changedFiles = files.filter((f) => f.status !== "deleted");
		if (changedFiles.length > 30) {
			throw new BadRequestError(
				"Too many files have changes, maximum is 30 for deep mode. Please us fast mode instead.",
			);
		}

		// 8. AI per-minute limit
		const minuteLimit = await aiLimiterPerMinute.limit(
			`ai:minute:user:${user.id}`,
		);
		rateLimitOrThrow(minuteLimit);

		// 9. Owner-based weekly limit
		const owner = repo.members.find((m) => m.role === "owner");
		if (!owner) throw new Error("No owner found for repository");

		const weekLimit = await aiLimiterPerWeek.limit(
			`ai:week:user:${owner.userId}`,
		);

		if (!weekLimit.success) {
			if (user.id === owner.userId) {
				const resetDate = formatDateTimeForErrors(weekLimit.reset);
				return NextResponse.json(
					{
						error: `Weekly PR generation limit reached. Resets on ${resetDate}.`,
						rateLimit: {
							weeklyRemaining: weekLimit.remaining,
							weeklyReset: weekLimit.reset,
						},
					},
					{ status: 429 },
				);
			}

			return NextResponse.json(
				{
					error:
						"Repository owner weekly PR generation limit has been reached.",
				},
				{ status: 429 },
			);
		}

		// 10. Summarize diffs (stage 1)
		const diffSummaries = await summarizeDiffsForPR(files);


		console.log("COMMITS: ", commits.map((c, i) => `${i + 1}. ${c}`).join("\n"));

		// 11. PR generation (stage 2)
		const completion = await groq.chat.completions.create({
			model: "meta-llama/llama-4-maverick-17b-128e-instruct",
			messages: [
				{
					role: "system",
					content: buildPRFromDiffs(language, safeCompare),
				},
				{
					role: "user",
					content: `File diffs summary: ${diffSummaries}, commits: ${commits.map((c, i) => `${i + 1}. ${c}`).join("\n")}`,
				},
			],
			response_format: {
				type: "json_schema",
				json_schema: {
					name: "json",
					schema: {
						title: "",
						description: "",
					}
				},
			},
		});

		const content = completion.choices[0].message.content;
		if (!content) throw new Error("Empty AI response");
		const parsed = JSON.parse(content);

		// 12. Response
		const response: IPRResponse = { ...parsed };

		if (user.id === owner.userId) {
			response.rateLimit = {
				weeklyRemaining: weekLimit.remaining,
				weeklyReset: weekLimit.reset,
			};
		}

		return NextResponse.json(response);
	} catch (error) {
		return handleError(error);
	}
}
