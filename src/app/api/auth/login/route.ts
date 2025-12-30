import { NextResponse } from "next/server";
import { getPrisma } from "@/db";
import { loginSchema } from "@/lib/schemas/auth.schema";
import { BadRequestError } from "@/lib/server/error";
import { handleError } from "@/lib/server/handleError";
import { verifyPassword } from "@/lib/server/password";
import { createSession } from "@/lib/server/token";

const prisma = getPrisma();

export async function POST(req: Request) {
	try {
		// Parse + validate body
		const body = await req.json();
		const { email, password } = await loginSchema.parseAsync(body);

		// Find user
		const user = await prisma.user.findUnique({
			where: { email },
			include: { oauthIds: true },
		});

		if (!user || !user.password) {
			throw new BadRequestError("Email and password do not match");
		}

		// Verify password
		await verifyPassword(user.password, password);

		// Remove sensitive info
		const { password: _password, oauthIds, ...safeUser } = user;
		const oauthProviders = oauthIds.map((o) => (o.provider));

		// Create response + session
		const response = NextResponse.json(
			{
				message: "Logged in successfully",
				user: {
					...safeUser,
					oauthProviders,
				},
			},
			{ status: 200 },
		);

		await createSession(response, user);

		return response;
	} catch (error) {
		return handleError(error);
	}
}
