import { NextResponse } from "next/server";
import { getPrisma } from "@/db";
import { loginSchema } from "@/lib/schemas/auth.schema";
import { verifyPassword } from "@/lib/server/password";
import { createSession } from "@/lib/server/token";
import { handleError } from "@/lib/server/handleError";
import { BadRequestError } from "@/lib/server/error";

const prisma = getPrisma();

export async function POST(req: Request) {
  try {
    // Parse + validate body
    const body = await req.json();
    const { email, password } = await loginSchema.parseAsync(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new BadRequestError("Email and password do not match");
    }

    // Verify password
    await verifyPassword(user.password, password);

    // Create response + session
    const response = NextResponse.json(
      { message: "Logged in successfully" },
      { status: 200 }
    );

    await createSession(response, user);

    return response;
  } catch (error) {
    return handleError(error);
  }
}
