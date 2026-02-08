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
import { getCommitMessages } from "@/lib/server/github/commits";
import { groq } from "@/lib/server/groq/client";
import { buildPRFromCommits } from "@/lib/server/groq/prompt";
import { handleError } from "@/lib/server/handleError";
import { rateLimitOrThrow } from "@/lib/server/redis/rate-limit";
import {
	aiLimiterPerMinute,
	aiLimiterPerWeek,
	githubCompareCommitsLimiter,
} from "@/lib/server/redis/rate-limiters";
import { getCurrentUser } from "@/lib/server/session";
import type { IPRResponse } from "@/types/pullRequests";
import { formatDateTimeForErrors } from "@/lib/utils/formatDateTime";

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

		if (!repo || repo.status === "deleted")
			throw new NotFoundError("Repository not found");
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

		// 7. Fetch commit messages
		const commits = await getCommitMessages(
			repo.installation.installationId,
			repo.owner,
			repo.name,
			safeBase,
			safeCompare,
		);

		if (!commits.length) {
			throw new BadRequestError("No commits found between branches");
		}

		// 8. AI per-minute limit
		const minuteLimit = await aiLimiterPerMinute.limit(
			`ai:minute:user:${user.id}`,
		);
		rateLimitOrThrow(minuteLimit);

		// 9. Owner-based weekly limit (check only, increment on success)
		const owner = repo.members.find((m) => m.role === "owner");
		if (!owner) throw new Error("No owner found for repository");

		const weeklyLimitKey = `ai:week:user:${owner.userId}`;
		const weeklyCheck = await aiLimiterPerWeek.getRemaining(weeklyLimitKey);

		if (weeklyCheck.remaining <= 0) {
			if (user.id === owner.userId) {
				return NextResponse.json(
					{
						error: `Weekly PR generation limit reached. Resets on ${formatDateTimeForErrors(weeklyCheck.reset)}`,
						rateLimit: {
							weeklyRemaining: 0,
							weeklyReset: weeklyCheck.reset,
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

		// 10. AI call
		const completion = await groq.chat.completions.create({
			model: "meta-llama/llama-4-maverick-17b-128e-instruct",
			messages: [
				{
					role: "system",
					content: buildPRFromCommits(language, safeCompare),
				},
				{
					role: "user",
					content: commits.map((c, i) => `${i + 1}. ${c}`).join("\n"),
				},
			],
			response_format: {
				type: "json_schema",
				json_schema: {
					name: "json",
					schema: {
						title: "",
						description: "",
					},
				},
			},
		});

		const content = completion.choices[0].message.content;
		if (!content) throw new Error("Empty AI response");

		const parsed = JSON.parse(content);

		// 11. Success - now consume weekly rate limit credit
		const weeklyLimit = await aiLimiterPerWeek.limit(weeklyLimitKey);

		// 12. Response
		const response: IPRResponse = { ...parsed };
		if (user.id === owner.userId) {
			response.rateLimit = {
				weeklyRemaining: weeklyLimit.remaining,
				weeklyReset: weeklyLimit.reset,
			};
		}

		return NextResponse.json(response);
	} catch (error) {
		return handleError(error);
	}
}
