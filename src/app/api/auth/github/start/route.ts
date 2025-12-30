import { NextResponse } from "next/server";
import { config } from "@/lib/server/config";

export async function GET() {
  try {
    // Construct GitHub OAuth URL
    const url = new URL("https://github.com/login/oauth/authorize");
    url.searchParams.set("client_id", config.github.clientId);
    url.searchParams.set("redirect_uri", `${config.frontendUrl}/login/github/callback`);
    url.searchParams.set("scope", "read:user user:email");
    url.searchParams.set("allow_signup", "false");

    // Redirect to GitHub OAuth page
    return NextResponse.redirect(url.toString());
  } catch (err) {
    console.error("GitHub OAuth start error:", err);
    // If an error occurs, redirect to github callback page without code, so it can handle the error properly
    return NextResponse.redirect("/login/github/callback")
  }
}

