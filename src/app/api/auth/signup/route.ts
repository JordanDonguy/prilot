import { NextResponse } from "next/server";
import { getPrisma } from "@/db";
import { signupSchema } from "@/lib/schemas/auth.schema";
import { BadRequestError } from "@/lib/server/error";
import { handleError } from "@/lib/server/handleError";
import { hashPassword } from "@/lib/server/password";
import { createSession } from "@/lib/server/token";

const prisma = getPrisma();

export async function POST(req: Request) {
	try {
		// Parse + validate body
		const body = await req.json();
		const { email, username, password, confirmPassword } =
			await signupSchema.parseAsync(body);

		// Check password confirmation
		if (password !== confirmPassword) {
			throw new BadRequestError("Passwords do not match");
		}

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			throw new BadRequestError("Email is already in use");
		}

		// Hash password
		const hashedPassword = await hashPassword(password);

		// Create user
		const user = await prisma.user.create({
			data: {
				email,
        username,
				password: hashedPassword,
			},
			include: {
				oauthIds: true,
			},
		});

		// Remove sensitive info
		const { password: _password, oauthIds, ...safeUser } = user;
		const oauthProviders = oauthIds.map((o) => (o.provider));

		// Create response + session
		const response = NextResponse.json(
			{
				message: "Account created successfully",
				user: {
					...safeUser,
					oauthProviders,
				},
			},
			{ status: 201 },
		);

		await createSession(response, user);

		return response;
	} catch (error) {
		return handleError(error);
	}
}
