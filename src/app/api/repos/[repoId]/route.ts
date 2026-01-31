import { NextResponse } from "next/server";
import { getPrisma } from "@/db";
import { uuidParam } from "@/lib/schemas/id.schema";
import { NotFoundError, UnauthorizedError } from "@/lib/server/error";
import { githubFetch } from "@/lib/server/github/client";
import type { IGitHubBranch } from "@/lib/server/github/types";
import { rateLimitOrThrow } from "@/lib/server/redis/rate-limit";
import { githubRepoLimiter } from "@/lib/server/redis/rate-limiters";
import { getCurrentUser } from "@/lib/server/session";

const prisma = getPrisma();

export async function GET(
	_req: Request,
	context: { params: Promise<{ repoId: string }> },
) {
	// 1. Get current user
	const user = await getCurrentUser();
	if (!user) throw new UnauthorizedError("Unauthenticated");

	const { repoId } = await uuidParam("repoId").parseAsync(await context.params);

	// 2. Rate limit per user
	const limit = await githubRepoLimiter.limit(
		`repo:user:${user.id}`,
	);
	rateLimitOrThrow(limit);

	// 3. Fetch repo with members and installation
	const repo = await prisma.repository.findUnique({
		where: { id: repoId },
		include: { installation: true, members: true },
	});
	if (!repo) throw new NotFoundError("Repository not found");

	// 4. Check membership
	const membership = repo.members.find((m) => m.userId === user.id);
	if (!membership)
		throw new NotFoundError("Repository not found or unauthorized");
	const userRole = membership.role;

	// 5. GitHub branches
	const brancheList = await githubFetch<IGitHubBranch[]>(
		repo.installation.installationId,
		`/repos/${repo.owner}/${repo.name}/branches`,
	);
	const brancheNames = brancheList.data.map((b) => b.name);

	// 6. Commits count
	const { linkHeader } = await githubFetch<string[]>(
		repo.installation.installationId,
		`/repos/${repo.owner}/${repo.name}/commits?sha=${repo.defaultBranch}&per_page=1&page=1`,
		{ returnLinkHeader: true },
	);
	const commitsCount = linkHeader
		? parseInt(linkHeader.match(/&page=(\d+)>; rel="last"/)?.[1] ?? "1", 10)
		: 1;

	// 7. Global PR counts
	const prFilter =
		userRole === "owner"
			? { repositoryId: repo.id }
			: { repositoryId: repo.id, createdById: user.id };
	const [draftPrCount, sentPrCount] = await Promise.all([
		prisma.pullRequest.count({
			where: { ...prFilter, status: "draft", createdById: user.id },
		}),
		prisma.pullRequest.count({
			where: { ...prFilter, status: "sent", createdById: user.id },
		}),
	]);

	// 8. Members count
	const membersCount = await prisma.repositoryMember.count({
		where: { repositoryId: repoId },
	});

	// 9. Return response
	return NextResponse.json({
		repository: {
			id: repo.id,
			name: repo.name,
			provider: repo.provider,
			owner: repo.owner,
			defaultBranch: repo.defaultBranch,
			installationId: repo.installation?.installationId ?? null,
			createdAt: repo.createdAt,
			userRole,
			isPrivate: repo.isPrivate,
			draftPrCount,
			sentPrCount,
			membersCount,
		},
		branches: brancheNames,
		commitsCount,
	});
}
