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

		return NextResponse.json({ repositories });
	} catch (error) {
		return handleError(error);
	}
}
