import { NextResponse } from "next/server";
import { getPrisma } from "@/db";
import { NotFoundError, UnauthorizedError } from "@/lib/server/error";
import { githubFetch } from "@/lib/server/github/client";
import type { IGitHubBranch } from "@/lib/server/github/types";
import { getCurrentUser } from "@/lib/server/session";
import { uuidParam } from "@/lib/schemas/id.schema";

const prisma = getPrisma();

export async function GET(
	_req: Request,
	context: { params: Promise<{ repoId: string }> },
) {
	const user = await getCurrentUser();
	if (!user) throw new UnauthorizedError("Unauthenticated");

	const { repoId } = await uuidParam("repoId").parseAsync(await context.params);

	// 1. Fetch repo with members and PRs
	const repo = await prisma.repository.findUnique({
		where: { id: repoId },
		include: { installation: true, members: true, pullRequests: true },
	});

	if (!repo) throw new NotFoundError("Repository not found");

	// 2. Check membership
	const membership = repo.members.find((m) => m.userId === user.id);
	if (!membership)
		throw new NotFoundError("Repository not found or unauthorized");
	const userRole = membership.role;

	// 3. Fetch GitHub branches
	const brancheList = await githubFetch<IGitHubBranch[]>(
		repo.installation.installationId,
		`/repos/${repo.owner}/${repo.name}/branches`,
	);
	const brancheNames = brancheList.data.map((b) => b.name);

	// 4. Fetch commits count for default branch
	const { linkHeader } = await githubFetch<string[]>(
		repo.installation.installationId,
		`/repos/${repo.owner}/${repo.name}/commits?sha=${repo.defaultBranch}&per_page=1&page=1`,
		{ returnLinkHeader: true },
	);
	const commitsCount = linkHeader
		? parseInt(linkHeader.match(/&page=(\d+)>; rel="last"/)?.[1] ?? "1", 10)
		: 1;

	// 5. Filter PRs based on role
	const pullRequests = repo.pullRequests
		.filter((pr) => userRole === "owner" || pr.createdById === user.id)
		.map((pr) => ({
			id: pr.id,
			title: pr.title,
			status: pr.status,
			baseBranch: pr.baseBranch,
			compareBranch: pr.compareBranch,
			createdAt: pr.createdAt,
		}));

	// 6. Return unified repo data
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
			draftPrCount: pullRequests.filter((pr) => pr.status === "draft").length,
			sentPrCount: pullRequests.filter((pr) => pr.status === "sent").length,
		},
		branches: brancheNames,
		pullRequests,
		commitsCount,
	});
}
