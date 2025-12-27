import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getPrisma } from "@/db";
import { generateAccessToken, setTokensInCookies } from "@/lib/server/token";

const prisma = getPrisma();

export async function GET() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) return NextResponse.json({ error: "No refresh token" }, { status: 401 });

  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored || stored.expiresAt < new Date()) {
    return NextResponse.json({ error: "Refresh token expired" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });

  const newAccessToken = generateAccessToken(user);

  const res = NextResponse.json({ success: true });
  setTokensInCookies(res, newAccessToken, refreshToken);

  return res;
}
