import { NextResponse } from "next/server";
import { getPrisma, Provider } from "@/db";
import {
  BadRequestError,
  UnauthorizedError,
} from "@/lib/server/error";
import { verifyInstallation } from "@/lib/server/github/app";
import { githubFetch } from "@/lib/server/github/client";
import type {
  IGitHubRepo,
  IGitHubReposResponse,
} from "@/lib/server/github/types";
import { handleError } from "@/lib/server/handleError";
import { getCurrentUser } from "@/lib/server/session";

const prisma = getPrisma();

export async function POST(req: Request) {
	try {
		// 1. Parse request
		const { installationId } = await req.json();
		const user = await getCurrentUser();

		if (!user || !installationId) {
			throw new UnauthorizedError("You must be logged in to connect GitHub");
		}

		// 2. Verify installation via GitHub
		const installation = await verifyInstallation(installationId);

		// 3. Upsert installation in DB
		const dbInstallation = await prisma.providerInstallation.upsert({
			where: {
				provider_createdById: {
					provider: "github",
					createdById: user.id,
				},
			},
			update: {
				installationId,
				accountLogin: installation.account.login,
				accountType: installation.account.type.toLowerCase(),
			},
			create: {
				provider: "github",
				installationId,
				accountLogin: installation.account.login,
				accountType: installation.account.type.toLowerCase(),
				createdById: user.id,
			},
		});

		// 4. Fetch repos from GitHub
		const reposList = await githubFetch<IGitHubReposResponse>(
			installationId,
			"/installation/repositories",
		);

		if (!reposList.data.repositories) {
			throw new BadRequestError("No repositories found for this installation");
		}

		const repos = reposList.data.repositories.map((r: IGitHubRepo) => ({
			provider: Provider.github,
			providerRepoId: r.id.toString(),
			name: r.name,
			isPrivate: r.private,
			defaultBranch: r.default_branch || "main",
			owner: r.owner.login,
		}));

		// 5. Upsert repos in DB
		for (const repo of repos) {
			await prisma.repository.upsert({
				where: {
					provider_providerRepoId: {
						provider: repo.provider,
						providerRepoId: repo.providerRepoId,
					},
				},
				update: { ...repo, installationId: dbInstallation.id },
				create: { ...repo, installationId: dbInstallation.id },
			});
		}

		// 6. Respond with installation + repo info
		return NextResponse.json({
			success: true,
			installationId: dbInstallation.id,
			repos,
		});
	} catch (err) {
		return handleError(err);
	}
}
