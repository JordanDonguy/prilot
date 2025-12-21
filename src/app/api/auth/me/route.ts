import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { handleError } from "@/lib/server/handleError";
import { UnauthorizedError } from "@/lib/server/error";

export async function GET() {
	try {
		const user = await getCurrentUser();

		if (!user) {
			throw new UnauthorizedError("Unauthenticated");
		}

		// Remove sensitive fields
		const { password, ...safeUser } = user;

		return NextResponse.json({ user: safeUser });
	} catch (error) {
		return handleError(error);
	}
}
