import { NextResponse } from "next/server";
import { getPrisma } from "@/db";
import { UnauthorizedError } from "@/lib/server/error";
import { handleError } from "@/lib/server/handleError";
import { getCurrentUser } from "@/lib/server/session";

const prisma = getPrisma();

export async function GET() {
	try {
		const user = await getCurrentUser();
		if (!user) throw new UnauthorizedError("Unauthenticated");

		// 1. Fetch installations created by this user
		const installations = await prisma.providerInstallation.findMany({
			where: { createdById: user.id },
			select: { id: true },
		});

		if (installations.length === 0) {
			return NextResponse.json({ repositories: [] });
		}

		const installationIds = installations.map((i) => i.id);

		// 2. Fetch repositories linked to these installations
		const repositories = await prisma.repository.findMany({
			where: {
				installationId: { in: installationIds },
			},
			select: {
				id: true,
				provider: true,
				owner: true,
				name: true,
				defaultBranch: true,
				installationId: true,
				createdAt: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		// 3. Get PR counts for each repos and by status (draft, sent)
		const prCounts = await prisma.pullRequest.groupBy({
			by: ["repositoryId", "status"],
			where: {
				repositoryId: {
					in: repositories.map((r) => r.id),
				},
				status: {
					in: ["draft", "sent"],
				},
			},
			_count: {
				_all: true,
			},
		});

		// 4. Merge PR counts with repos
		const repositoriesWithPrCounts = repositories.map((repo) => {
			const draftCount =
				prCounts.find((c) => c.repositoryId === repo.id && c.status === "draft")
					?._count._all ?? 0;

			const sentCount =
				prCounts.find((c) => c.repositoryId === repo.id && c.status === "sent")
					?._count._all ?? 0;

			return {
				...repo,
				draftPrCount: draftCount,
				sentPrCount: sentCount,
			};
		});

		return NextResponse.json({ repositories: repositoriesWithPrCounts });
	} catch (error) {
		return handleError(error);
	}
}
