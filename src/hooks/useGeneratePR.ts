import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { usePullRequestActions } from "@/hooks/usePullRequestActions";

export function useGeneratePR(repoId: string) {
	const { addDraftPR } = usePullRequestActions(repoId);
	const [isGenerating, setIsGenerating] = useState(false);

	const generatePR = useCallback(
		async ({
			prId,
			baseBranch,
			compareBranch,
			language,
			setPrId,
			setTitle,
			setDescription,
			startAutoSave,
		}: {
			prId: string | null;
			baseBranch: string;
			compareBranch: string;
			language: string;
			setPrId: (id: string) => void;
			setTitle: (v: string) => void;
			setDescription: (v: string) => void;
			startAutoSave: React.RefObject<boolean>;
		}) => {
			if (!compareBranch) return;
			setIsGenerating(true);

			// Reset state and stop auto saving
			setTitle("");
			setDescription("");
			startAutoSave.current = false;

			try {
				// Fetch commit differences between branches
				const compareRes = await fetch(
					`/api/repos/${repoId}/compare-commits/github?base=${baseBranch}&compare=${compareBranch}`,
				);
				if (!compareRes.ok) throw new Error("Failed to fetch commits");

				const { commits }: { commits: string[] } = await compareRes.json();
				if (!commits.length) {
					toast.info("No commit differences found");
					return;
				}

				// Generate PR with AI
				const aiRes = await fetch("/api/pr/generate", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ commits, language, compareBranch }),
				});
				if (!aiRes.ok) throw new Error("Failed to generate PR with AI");
				const { title: generatedTitle, description: generatedDescription } =
					await aiRes.json();

				// If the PR is new, save it in db
				if (!prId) {
					const newPR = await addDraftPR({
						prTitle: generatedTitle,
						prBody: generatedDescription,
						baseBranch,
						compareBranch,
						language,
					});
					if (newPR) setPrId(newPR.id);
				} else {
					// If generating over an existing PR, update it in db
					const updateRes = await fetch(
						`/api/repos/${repoId}/pull-requests/${prId}`,
						{
							method: "PATCH",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								prTitle: generatedTitle,
								prBody: generatedDescription,
							}),
						},
					);
					if (!updateRes.ok) throw new Error("Failed to update PR");
				}

        // Update local state
				setTitle(generatedTitle);
				setDescription(generatedDescription);
			} catch (err) {
				console.error(err);
				toast.error("Failed to generate PR");
			} finally {
				setIsGenerating(false);
			}
		},
		[repoId, addDraftPR],
	);

	return { isGenerating, generatePR };
}
