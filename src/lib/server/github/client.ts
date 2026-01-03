import { createInstallationAccessToken } from "./installation";

// GitHub fetch helper - We use a generic T type parameter to inject expected response types
export async function githubFetch<T = unknown>(
	installationId: string,
	path: string,
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
	body?: object,
): Promise<T> {
	const { token } = await createInstallationAccessToken(installationId);
	const res = await fetch(`https://api.github.com${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/vnd.github+json",
			...(body && { "Content-Type": "application/json" }),
		},
		body:
			method === "GET" ? undefined : body ? JSON.stringify(body) : undefined,
	});

	if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

	const data = await res.json();
	return data as T;
}
