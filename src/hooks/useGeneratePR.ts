import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { usePullRequestActions } from "@/hooks/usePullRequestActions";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

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
	mode: "fast" | "deep";
	setPrId: (id: string) => void;
}

export function useGeneratePR({
	repoId,
	prId,
	baseBranch,
	compareBranch,
	language,
	mode,
	setPrId,
}: useGeneratePRProps) {
	const { addDraftPR } = usePullRequestActions(repoId ?? "");

	const [isGenerating, setIsGenerating] = useState(false);

	// Get commit differences and generate a PR with AI
	const generatePR = useCallback(async () => {
		if (!compareBranch) throw new Error("Compare branch is needed");
		setIsGenerating(true);

		try {
			// 1. Generate PR with AI
			const aiRes = await fetchWithAuth(
				`/api/repos/${repoId}/pull-requests/generate/${mode}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ language, baseBranch, compareBranch }),
				},
			);

			if (!aiRes.ok) {
				const data = await aiRes.json();
				toast.error(data.error || "Failed to generate PR");
				return { success: false };
			}

			const data = (await aiRes.json()) as GeneratePRResponse;
			const { title, description } = data;

			// 2. Ensure description is always a string (handle inconsistent AI res format)
			function normalizeDescription(
				desc: string | { description: string },
			): string {
				if (typeof desc === "string") return desc;
				if (desc && typeof desc.description === "string")
					return desc.description;
				return "";
			}

			const safeDescription = normalizeDescription(description);

			// 3.a. If the PR is new, save it in db
			if (!prId) {
				const newPR = await addDraftPR({
					prTitle: title,
					prBody: safeDescription,
					baseBranch,
					compareBranch,
					language,
					mode,
				});
				if (newPR) setPrId(newPR.id);
			} else {
				// 3.b. If generating over an existing PR, update it in db
				const updateRes = await fetchWithAuth(
					`/api/repos/${repoId}/pull-requests/${prId}`,
					{
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							prTitle: title,
							prBody: safeDescription,
							baseBranch,
							compareBranch,
							language,
							mode,
						}),
					},
				);
				if (!updateRes.ok) throw new Error("Failed to update PR");
			}

			return { success: true, title, description: safeDescription };
		} catch (err) {
			console.error(err);
			toast.error("Failed to generate PR");
			return { success: false };
		} finally {
			setIsGenerating(false);
		}
	}, [
		repoId,
		addDraftPR,
		baseBranch,
		compareBranch,
		mode,
		language,
		prId,
		setPrId,
	]);

	return { isGenerating, generatePR };
}
