import { createPrivateKey, type KeyObject } from "node:crypto";
import { SignJWT } from "jose";
import { config } from "../config";
import { BadRequestError } from "../error";
import type { IGitHubInstallation } from "./types";

let privateKey: KeyObject | null = null;

function getPrivateKey() {
  if (!privateKey) {
    privateKey = createPrivateKey(config.github.appPrivateKey);
  }
  return privateKey;
}

// -------------------------------
// ----- Create GitHub JWT -------
// -------------------------------
export async function createGitHubAppJWT() {
  const key = await getPrivateKey();
  return new SignJWT()
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt(Math.floor(Date.now() / 1000) - 60)
    .setExpirationTime(Math.floor(Date.now() / 1000) + 600)
    .setIssuer(config.github.appId)
    .sign(key);
}

// --------------------------------
// -- Verify GitHub Installation --
// --------------------------------
export async function verifyInstallation(
  installationId: string,
): Promise<IGitHubInstallation> {
  const jwt = await createGitHubAppJWT();

  const res = await fetch(
    `https://api.github.com/app/installations/${installationId}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!res.ok) {
    throw new BadRequestError("Invalid GitHub installation");
  }

  const data = (await res.json()) as IGitHubInstallation;
  return data;
}
