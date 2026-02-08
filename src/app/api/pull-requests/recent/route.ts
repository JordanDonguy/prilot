import { type NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/db";
import { ForbiddenError } from "@/lib/server/error";
import { handleError } from "@/lib/server/handleError";
import { getCurrentUser } from "@/lib/server/session";

const prisma = getPrisma();

export async function GET(_req: NextRequest) {
	try {
		// 1. Auth
		const user = await getCurrentUser();
		if (!user) throw new ForbiddenError("Unauthenticated");

		// 2. Calculate start dates for this week and previous week
		const now = new Date();
		const startOfWeek = (date: Date) => {
			const d = new Date(date);
			const day = d.getDay() || 7;
			if (day !== 1) d.setHours(-24 * (day - 1));
			d.setHours(0, 0, 0, 0);
			return d;
		};

		const startThisWeek = startOfWeek(now);
		const startLastWeek = new Date(startThisWeek);
		startLastWeek.setDate(startLastWeek.getDate() - 7);

		// 3. Fetch last 3 PRs and PR counts for this week and previous week
		const [recentPRs, thisWeekCount, lastWeekCount] = await Promise.all([
			prisma.pullRequest.findMany({
				where: {
					createdById: user.id,
					repository: {
						status: { not: "deleted" },
						members: {
							some: { userId: user.id }, // user must still be a member or the repo
						},
					},
				},
				orderBy: { updatedAt: "desc" },
				take: 3,
				select: {
					id: true,
					title: true,
					status: true,
					baseBranch: true,
					compareBranch: true,
					updatedAt: true,
					providerPrUrl: true,
					mode: true,
					repository: {
						select: {
							id: true,
							name: true,
							provider: true,
						},
					},
				},
			}),
			prisma.pullRequest.count({
				where: {
					createdById: user.id,
					status: "sent",
					updatedAt: { gte: startThisWeek },
				},
			}),
			prisma.pullRequest.count({
				where: {
					createdById: user.id,
					status: "sent",
					updatedAt: {
						gte: startLastWeek,
						lt: startThisWeek,
					},
				},
			}),
		]);

		// 4. Map repository fields to provider + repoName
		const mappedPRs = recentPRs.map((pr) => ({
			id: pr.id,
			title: pr.title,
			status: pr.status,
			baseBranch: pr.baseBranch,
			compareBranch: pr.compareBranch,
			updatedAt: pr.updatedAt,
			providerPrUrl: pr.providerPrUrl,
			repoName: pr.repository.name,
			repoId: pr.repository.id,
			provider: pr.repository.provider,
		}));

		// 5. Return mapped PRs and weekly counts
		return NextResponse.json({
			recentPRs: mappedPRs,
			stats: {
				thisWeek: thisWeekCount,
				lastWeek: lastWeekCount,
			},
		});
	} catch (error) {
		return handleError(error);
	}
}
