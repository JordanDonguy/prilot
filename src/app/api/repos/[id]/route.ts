import { NextResponse } from "next/server";
import { getPrisma } from "@/db";
import { NotFoundError, UnauthorizedError } from "@/lib/server/error";
import { githubFetch } from "@/lib/server/github/client";
import type { IGitHubBranch } from "@/lib/server/github/types";
import { getCurrentUser } from "@/lib/server/session";

const prisma = getPrisma();

export async function GET(
	// biome-ignore lint/correctness/noUnusedFunctionParameters: req is required to then access params
	req: Request,
	context: { params: Promise<{ id: string }> },
) {
	const user = await getCurrentUser();
	if (!user) throw new UnauthorizedError("Unauthenticated");

	// unwrap params
	const { id } = await context.params;

	// 1. fetch repo + installation
	const repo = await prisma.repository.findUnique({
		where: { id },
		include: { installation: true, pullRequests: true },
	});

	if (!repo || repo.installation.createdById !== user.id) {
		throw new NotFoundError("Repository not found or unauthorized");
	}

	// 2. fetch branches from GitHub
	const brancheList = await githubFetch<IGitHubBranch[]>(
		repo.installation.installationId,
		`/repos/${repo.owner}/${repo.name}/branches`,
	);

	// Get branche names
	const brancheNames = brancheList.data.map((b) => b.name);

	// 3. Fetches commits count for default branch on GitHub
	const { linkHeader } = await githubFetch<string[]>(
		repo.installation.installationId,
		`/repos/${repo.owner}/${repo.name}/commits?sha=${repo.defaultBranch}&per_page=1&page=1`,
		{ returnLinkHeader: true },
	);

	// Calculate commits count using link header
	let commitsCount = 0;

	if (linkHeader) {
		// match the page number just before rel="last"
		const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
		if (match) {
			commitsCount = parseInt(match[1], 10);
		} else {
			commitsCount = 1; // only 1 commit if no last page
		}
	}

	// 4. gather PRs from DB
	const pullRequests = repo.pullRequests.map((pr) => ({
		id: pr.id,
		title: pr.title,
		status: pr.status,
		baseBranch: pr.baseBranch,
		compareBranch: pr.compareBranch,
		createdAt: pr.createdAt,
	}));

	return NextResponse.json({
		repository: {
			id: repo.id,
			name: repo.name,
			provider: repo.provider,
			owner: repo.owner,
			isPrivate: repo.isPrivate,
			defaultBranch: repo.defaultBranch,
		},
		branches: brancheNames,
		pullRequests,
		commitsCount
	});
}
