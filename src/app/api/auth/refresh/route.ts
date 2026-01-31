import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getPrisma } from "@/db";
import { handleError } from "@/lib/server/handleError";
import { rateLimitOrThrow } from "@/lib/server/redis/rate-limit";
import { refreshLimiter } from "@/lib/server/redis/rate-limiters"; // new limiter
import { generateAccessToken, setTokensInCookies } from "@/lib/server/token";

const prisma = getPrisma();

export async function GET() {
  try {
    // 1. Get refresh token from cookies
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    // 2. Validate refresh token
    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!stored || stored.expiresAt < new Date()) {
      return NextResponse.json({ error: "Refresh token expired" }, { status: 401 });
    }

    // 3. Rate limit per user
    const limit = await refreshLimiter.limit(`refresh:user:${stored.userId}`);
    rateLimitOrThrow(limit);

    // 4. Generate new access token
    const user = await prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });

    const newAccessToken = generateAccessToken(user);

    // 5. Return response with new tokens in cookies
    const res = NextResponse.json({ success: true });
    setTokensInCookies(res, newAccessToken, refreshToken);

    return res;
  } catch (error) {
    return handleError(error);
  }
}
