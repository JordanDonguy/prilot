import { NextResponse } from "next/server";
import { UnauthorizedError } from "@/lib/server/error";
import { handleError } from "@/lib/server/handleError";
import { getCurrentUser } from "@/lib/server/session";

export async function GET() {
	try {
		const user = await getCurrentUser();

		if (!user) {
			throw new UnauthorizedError("Unauthenticated");
		}

		return NextResponse.json(user);
	} catch (error) {
		return handleError(error);
	}
}
