import type { IGitHubCompareResponse } from "@/types/commits";
import { githubFetch } from "./client";

export async function getCommitMessages(
  installationId: string,
  owner: string,
  repoName: string,
  baseBranch: string,
  compareBranch: string,
): Promise<string[]> {
  const compare = await githubFetch<IGitHubCompareResponse>(
    installationId,
    `/repos/${owner}/${repoName}/compare/${baseBranch}...${compareBranch}`,
  );

  // Only single-parent commits (skip merges)
  return compare.data.commits
    .filter(c => c.parents.length === 1)
    .map(c => c.commit.message);
}
