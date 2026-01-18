import { toast } from "react-toastify";
import { useRepoStore } from "@/stores/repoStore";

interface CreatePRPayload {
	prTitle: string;
	prBody: string;
	baseBranch: string;
	compareBranch: string;
	language: string;
}

export function usePullRequestActions(repoId: string) {
	const repo = useRepoStore((s) => s.repos[repoId]);
	const updateDraftPrCount = useRepoStore((s) => s.updateDraftPrCount);

	// ---- Add a PR ----
	const addDraftPR = async (payload: CreatePRPayload) => {
		if (!repo) return null;

		const res = await fetch(`/api/repos/${repo.id}/pull-requests/draft`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		if (!res.ok) {
			toast.error("Failed to create pull request");
			return null;
		}

		updateDraftPrCount(repo.id, +1);
		toast.success("Pull request created ✨");

		return res.json();
	};

	// ---- Delete a PR ----
	const deleteDraftPR = async (prId: string) => {
		if (!repo) return;

		const res = await fetch(`/api/repos/${repo.id}/pull-requests/${prId}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			toast.error("Failed to delete pull request");
			return;
		}

		updateDraftPrCount(repo.id, -1);
		toast.success("Pull request deleted 🗑️");
	};

	return { addDraftPR, deleteDraftPR };
}
