import type { IGitHubCompareResponse, IGitHubFile } from "@/types/commits";
import { githubFetch } from "./client";

interface Response {
	files: IGitHubFile[] | undefined,
	commits: string[],
}

/**
 * Returns an array of files between two branches, ready for summarization
 */
export async function getFileDiffsAndCommits(
	installationId: string,
	owner: string,
	repoName: string,
	baseBranch: string,
	compareBranch: string,
): Promise<Response> {
	const compare = await githubFetch<IGitHubCompareResponse>(
		installationId,
		`/repos/${owner}/${repoName}/compare/${baseBranch}...${compareBranch}`,
	);

	// Flatten all files across commits
	const files = compare.data.files;

	// Only single-parent commits (skip merges)
	const commits = compare.data.commits
		.filter((c) => c.parents.length === 1)
		.map((c) => c.commit.message);

	return { files, commits };
}

/**
 * Prepares a file diff for AI summarization.
 *
 * Returns an object:
 * {
 *   file: string;       // path + filename
 *   changes: number;    // number of lines changed (from GitHub)
 *   patch: string;      // AI-ready patch content
 * }
 *
 * Patch formatting rules:
 * - Modified file:
 *   Only lines starting with '+' or '-' are included, preserving the prefix.
 *   Example:
 *     +  text?: string;
 *     -  className={`p-2 text-[var(--blue-1)] ...`}
 *
 * - Added file:
 *   Only lines starting with '+' are included, '+' removed (entire content is new).
 *   Example:
 *     export const NewButton = () => { return <button /> }
 *
 * - Deleted file:
 *   Single line indicating the file was deleted.
 *   Example:
 *     File src/components/OldButton.tsx was deleted.
 */
export function prepareFileDiffForAI(file: IGitHubFile): {
	filename: string;
	status: string;
	changes: number;
	patch: string;
} {
	let patch = "";

	if (file.status === "deleted") {
		patch = `File ${file.filename} was deleted.`;
	} else if (!file.patch) {
		// Rare case: new file without a patch
		patch = `File ${file.filename} was added.`;
	} else if (file.status === "modified") {
		patch = file.patch
			.split("\n")
			.filter((line) => line.startsWith("+") || line.startsWith("-"))
			.join("\n");
	} else if (file.status === "added") {
		patch = file.patch
			.split("\n")
			.filter((line) => line.startsWith("+"))
			.map((line) => line.slice(1))
			.join("\n");
	}

	return {
		filename: file.filename,
		status: file.status,
		changes: file.changes,
		patch,
	};
}
