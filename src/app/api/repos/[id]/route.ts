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
	const branchesData = await githubFetch<IGitHubBranch[]>(
		repo.installation.installationId,
		`/repos/${repo.owner}/${repo.name}/branches`,
	);

	// Get branche names
	const brancheNames = branchesData.map((b) => b.name);

	// 3. gather PRs from DB
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
	});
}
