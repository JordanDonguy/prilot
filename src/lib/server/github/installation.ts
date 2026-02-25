import { getPrisma } from "@/db";
import { decrypt, encrypt } from "@/lib/server/encryption";
import { BadRequestError } from "@/lib/server/error";
import { redis } from "@/lib/server/redis/client";
import { createGitHubAppJWT } from "./app";

const prisma = getPrisma();

// -----------------------------------------
// ----- Get User Installation From db -----
// -----------------------------------------
export async function getUserInstallation(
  userId: string,
  installationId: string
) {
  const installation = await prisma.providerInstallation.findFirst({
    where: {
      provider: "github",
      installationId,
      createdById: userId,
    },
  });

  if (!installation) {
    throw new BadRequestError("Installation not linked to user");
  }

  return installation;
}

// ------------------------------------------
// ---- Create Installation Access Token ----
// ------------------------------------------
const TOKEN_CACHE_TTL_SECONDS = 55 * 60; // 55 minutes (tokens expire after 1 hour)

export async function createInstallationAccessToken(
	installationId: string,
) {
	// 1. Check Redis cache
	const cacheKey = `github:installation-token:${installationId}`;
	const cached = await redis.get<string>(cacheKey);
	if (cached) {
		return { token: decrypt(cached), expires_at: "", permissions: {} };
	}

	// 2. Create fresh token from GitHub
	const jwt = createGitHubAppJWT();

	const res = await fetch(
		`https://api.github.com/app/installations/${installationId}/access_tokens`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				Accept: "application/vnd.github+json",
			},
		},
	);

	if (!res.ok) {
		throw new BadRequestError("Failed to create installation access token");
	}

	const data = (await res.json()) as {
		token: string;
		expires_at: string;
		permissions: Record<string, string>;
	};

	// 3. Cache encrypted token in Redis
	await redis.set(cacheKey, encrypt(data.token), { ex: TOKEN_CACHE_TTL_SECONDS });

	return data;
}
