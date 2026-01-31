import { NextResponse } from "next/server";
import { getPrisma } from "@/db";
import { aiPrRequestSchema } from "@/lib/schemas/pr.schema";
import { NotFoundError, UnauthorizedError } from "@/lib/server/error";
import { groq } from "@/lib/server/groq/client";
import { buildPRPrompt } from "@/lib/server/groq/prompt";
import { handleError } from "@/lib/server/handleError";
import { rateLimitOrThrow } from "@/lib/server/redis/rate-limit";
import {
	aiLimiterPerMinute,
	aiLimiterPerWeek,
} from "@/lib/server/redis/rate-limiters";
import { getCurrentUser } from "@/lib/server/session";
import { formatDateTimeForErrors } from "@/lib/utils/formatDateTime";

type PrResponse = {
	title: string;
	body: string;
	// optionally include rateLimit if owner
	rateLimit?: {
		weeklyRemaining: number;
		weeklyReset: number;
	};
};

const prisma = getPrisma();

/*
 * Rate-limiting credits system:
 * If user is owner of the repo, the weekly limit applies to them
 * If user is not owner, the weekly limit applies to the owner of the repo
 * This way we avoid users bypassing limits by using collaborators
 */
export async function POST(req: Request) {
	try {
		// 1. Get current user
		const user = await getCurrentUser();
		if (!user) throw new UnauthorizedError("You must be logged in");

		// 2. Rate limit per minute
		const minuteLimit = await aiLimiterPerMinute.limit(
			`ai:minute:user:${user.id}`,
		);
		rateLimitOrThrow(
			minuteLimit,
			"Too many requests... Please try again in a few minutes.",
		);

		// 3. Parse request body
		const { repoId, commits, compareBranch, language } =
			await aiPrRequestSchema.parseAsync(await req.json());

		// 4. Fetch repo + owner
		const repo = await prisma.repository.findUnique({
			where: { id: repoId },
			include: { members: true },
		});
		if (!repo) throw new NotFoundError("Repository not found");

		const owner = repo.members.find((m) => m.role === "owner");
		if (!owner) throw new Error("No owner found for this repository");

		// 5. Rate limit weekly per repo owner
		const weekLimit = await aiLimiterPerWeek.limit(
			`ai:week:user:${owner.userId}`,
		);
		if (!weekLimit.success) {
			// Only include rateLimit info for owner
			if (user.id === owner.userId) {
				const resetDate = formatDateTimeForErrors(weekLimit.reset);
				return NextResponse.json(
					{
						error: `Weekly pull-request generation limit reached. Resets on ${resetDate}.`,
						rateLimit: {
							weeklyRemaining: weekLimit.remaining,
							weeklyReset: weekLimit.reset,
						},
					},
					{ status: 429 },
				);
			} else {
				// For non-owners, just return generic 429
				return NextResponse.json(
					{
						error:
							"Repository owner weekly PR generation limit has been reached. Please contact the repository owner.",
					},
					{ status: 429 },
				);
			}
		}

		// 6. Send request to Groq AI
		const completion = await groq.chat.completions.create({
			model: "openai/gpt-oss-120b",
			messages: [
				{
					role: "user",
					content: buildPRPrompt(commits, language, compareBranch),
				},
			],
		});

		// 7. Parse Groq response
		const content = completion.choices[0].message.content;
		if (!content) throw new Error("Empty AI response");
		const parsed = JSON.parse(content);

		// 8. Return response
		// Only include weekly remaining if current user is owner to not leak info
		const responseBody: PrResponse = { ...parsed };
		if (user.id === owner.userId) {
			responseBody.rateLimit = {
				weeklyRemaining: weekLimit.remaining,
				weeklyReset: weekLimit.reset,
			};
		}

		return NextResponse.json(responseBody);
	} catch (error) {
		return handleError(error);
	}
}
