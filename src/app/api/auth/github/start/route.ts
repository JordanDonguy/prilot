import { NextResponse } from "next/server";
import { config } from "@/lib/server/config";
import { handleError } from "@/lib/server/handleError";
import { getClientIp } from "@/lib/server/ip";
import { rateLimitOrThrow } from "@/lib/server/redis/rate-limit";
import { githubOAuthStartLimiter } from "@/lib/server/redis/rate-limiters";

export async function GET(req: Request) {
  try {
    // 1. Get client IP
    const ip = getClientIp(req);

    // 2. Rate limit per IP
    const limit = await githubOAuthStartLimiter.limit(`github:start:ip:${ip}`);
    rateLimitOrThrow(limit);

    // 3. Construct GitHub OAuth URL
    const url = new URL("https://github.com/login/oauth/authorize");
    url.searchParams.set("client_id", config.github.clientId);
    url.searchParams.set(
      "redirect_uri",
      `${config.frontendUrl}/login/github/callback`
    );
    url.searchParams.set("scope", "read:user user:email");
    url.searchParams.set("allow_signup", "false");

    // 4. Redirect to GitHub OAuth page
    return NextResponse.redirect(url.toString());
  } catch (err) {
    return handleError(err);
  }
}
