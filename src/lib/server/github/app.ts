import jwt from "jsonwebtoken";
import { config } from "../config";
import { BadRequestError } from "../error";
import type { IGitHubInstallation } from "./types";

// -------------------------------
// ----- Create GitHub JWT -------
// -------------------------------
export function createGitHubAppJWT() {
	return jwt.sign(
		{
			iat: Math.floor(Date.now() / 1000) - 60,
			exp: Math.floor(Date.now() / 1000) + 600,
			iss: config.github.appId,
		},
		config.github.appPrivateKey.replace(/\\n/g, "\n"),
		{ algorithm: "RS256" },
	);
}

// --------------------------------
// -- Verify GitHub Installation --
// --------------------------------
export async function verifyInstallation(
	installationId: string,
): Promise<IGitHubInstallation> {
	const jwt = createGitHubAppJWT();

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
