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

		// Fetch installations created by this user
		const installations = await prisma.providerInstallation.findMany({
			where: { createdById: user.id },
			select: {
				id: true,
				provider: true,
				installationId: true,
				accountLogin: true,
				accountType: true,
			},
		});

		return NextResponse.json({ installations });
	} catch (error) {
		return handleError(error);
	}
}
