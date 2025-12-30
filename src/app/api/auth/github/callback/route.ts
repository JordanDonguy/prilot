import { NextResponse } from "next/server";
import fetch from "node-fetch";
import sanitizeHtml from "sanitize-html";
import z from "zod";
import { getPrisma } from "@/db";
import { config } from "@/lib/server/config";
import {
	generateAccessToken,
	generateRefreshToken,
	setTokensInCookies,
} from "@/lib/server/token";

const prisma = getPrisma();

type GitHubTokenResponse = {
	access_token?: string;
	token_type?: string;
	scope?: string;
	error?: string;
	error_description?: string;
};

type GitHubUser = {
	id?: number;
	login?: string;
	email?: string | null;
};

export async function POST(req: Request) {
	try {
		// Zod schema
		const bodySchema = z.object({
			code: z.string().optional(),
		});

		// Parse and validate request body
		const { code } = await bodySchema.parseAsync(await req.json());
		if (!code) {
			return NextResponse.json({
				success: false,
				message: "Missing code",
			});
		}

		// Sanitize code input
		const safeCode = sanitizeHtml(code);

		// Exchange code for access token
		const tokenRes = await fetch(
			"https://github.com/login/oauth/access_token",
			{
				method: "POST",
				headers: { Accept: "application/json" },
				body: new URLSearchParams({
					client_id: config.github.clientId,
					client_secret: config.github.clientSecret,
					code: safeCode,
				}),
			},
		);

		// Parse token response
		const tokenData: GitHubTokenResponse =
			(await tokenRes.json()) as GitHubTokenResponse;
		if (!tokenData.access_token) {
			return NextResponse.json({
				success: false,
				message: "Failed to get access token",
			});
		}

		// Get GitHub user info
		const ghUserRes = await fetch("https://api.github.com/user", {
			headers: { Authorization: `Bearer ${tokenData.access_token}` },
		});
		const ghUser: GitHubUser = (await ghUserRes.json()) as GitHubUser;

		// If email is null (private), fetch from /user/emails
		let email = ghUser.email;
		if (!email) {
			const ghEmailsRes = await fetch("https://api.github.com/user/emails", {
				headers: { Authorization: `Bearer ${tokenData.access_token}` },
			});

			if (!ghEmailsRes.ok) {
				return NextResponse.json({
					success: false,
					message: "Failed to fetch GitHub emails",
				});
			}

			const emailsData = await ghEmailsRes.json();
			const emails = Array.isArray(emailsData) ? emailsData : [];

			const primaryEmail = emails.find(
				(e: any) => e.primary && e.verified && typeof e.email === "string",
			)?.email;

			if (!primaryEmail) {
				return NextResponse.json({
					success: false,
					message: "No verified GitHub email found",
				});
			}

			email = primaryEmail;
		}

		// Validate essential GitHub user info
		if (!ghUser.id || !ghUser.login || !email) {
			return NextResponse.json({
				success: false,
				message: "Failed to get GitHub user info",
			});
		}

		
    // Step 1: find existing user by providerUserId
    let user = await prisma.user.findFirst({
      where: {
        oauthIds: {
          some: { provider: "github", providerUserId: ghUser.id.toString() },
        },
      },
      include: { oauthIds: true },
    });

    // Step 2: if not found, find by email
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email },
        include: { oauthIds: true },
      });

      if (user) {
        // Attach GitHub OAuth to existing user
        await prisma.userOAuth.create({
          data: {
            userId: user.id,
            provider: "github",
            providerUserId: ghUser.id.toString(),
          },
        });
      }
    }

    // Step 3: create new user if still not found
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          username: ghUser.login, // default username from GitHub
          oauthIds: {
            create: {
              provider: "github",
              providerUserId: ghUser.id.toString(),
            },
          },
        },
        include: { oauthIds: true },
      });
    }


		// Generate JWT session
		const accessToken = generateAccessToken(user);
		const refreshToken = await generateRefreshToken(user);

		// Remove sensitive info
		const { password: _password, oauthIds, ...safeUser } = user;
		const oauthProviders = oauthIds.map((o) => (o.provider));

		// Return response with tokens set in cookies
		const res = NextResponse.json({
			success: true,
			message: "GitHub connected successfully",
			user: {
				...safeUser,
				oauthProviders,
			},
		});

		setTokensInCookies(res, accessToken, refreshToken);

		return res;
	} catch (err) {
		console.error(err);
		return NextResponse.json({
			success: false,
			message: "Internal server error",
		});
	}
}
