import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { usePullRequestActions } from "@/hooks/usePullRequestActions";

interface GeneratePRResponse {
	title: string;
	description: string;
	rateLimit?: {
		weeklyRemaining: number;
		weeklyReset: number;
	};
}

interface useGeneratePRProps {
	repoId: string;
	prId: string | null;
	baseBranch: string;
	compareBranch: string;
	language: string;
	setPrId: (id: string) => void;
}

export function useGeneratePR({
	repoId,
	prId,
	baseBranch,
	compareBranch,
	language,
	setPrId,
}: useGeneratePRProps) {
	const { addDraftPR } = usePullRequestActions(repoId ?? "");

	const [isGenerating, setIsGenerating] = useState(false);

	// Get commit differences and generate a PR with AI
	const generatePR = useCallback(async () => {
		if (!compareBranch) throw new Error("Compare branch is needed");
		setIsGenerating(true);

		try {
			// 1. Fetch commit differences between branches
			const compareRes = await fetch(
				`/api/repos/${repoId}/compare-commits/github?base=${baseBranch}&compare=${compareBranch}`,
			);

			if (!compareRes.ok) {
				const data = await compareRes.json();
				toast.error(data.error || "Failed to fetch commits");
				return { success: false };
			}

			const { commits }: { commits: string[] } = await compareRes.json();
			if (!commits.length) {
				toast.info("No commit differences found between branches.");
				return { success: false };
			}

			// 2. Generate PR with AI
			const aiRes = await fetch("/api/pr/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ repoId, commits, language, compareBranch }),
			});

			if (!aiRes.ok) {
				// Rate limit handling
				if (aiRes.status === 429) {
					const data = await aiRes.json();
					toast.error(
						data.error || "Weekly pull-request generation limit reached.",
					);
					return { success: false };
				}
				// Other errors
				throw new Error("Failed to generate PR with AI");
			}

			const data = (await aiRes.json()) as GeneratePRResponse;
			const { title: generatedTitle, description: generatedDescription } = data;

			// 3.a. If the PR is new, save it in db
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
				// 3.b. If generating over an existing PR, update it in db
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

			return { success: true, generatedTitle, generatedDescription };
		} catch (err) {
			console.error(err);
			toast.error("Failed to generate PR");
			return { success: false };
		} finally {
			setIsGenerating(false);
		}
	}, [repoId, addDraftPR, baseBranch, compareBranch, language, prId, setPrId]);

	return { isGenerating, generatePR };
}
