import { getPrisma } from "@/db";
import { BadRequestError } from "@/lib/server/error";
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
export async function createInstallationAccessToken(
  installationId: string
) {
  const jwt = createGitHubAppJWT();

  const res = await fetch(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!res.ok) {
    throw new BadRequestError("Failed to create installation access token");
  }

  return res.json() as Promise<{
    token: string;
    expires_at: string;
    permissions: Record<string, string>;
  }>;
}
