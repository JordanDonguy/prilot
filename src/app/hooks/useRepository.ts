import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRepoStore } from "@/stores/repoStore";
import type { IPullRequest } from "@/types/pullRequests";
import type { IRepositoryResponse } from "@/types/repos";

export function useRepository(repoId: string) {
	const router = useRouter();
	const repoFromStore = useRepoStore((s) => s.repos[repoId]);
	const setRepo = useRepoStore((s) => s.setRepo);

	const [loading, setLoading] = useState(!repoFromStore);

	useEffect(() => {
		if (repoFromStore) {
			setLoading(false);
			return;
		}

		const fetchRepo = async () => {
			try {
				const res = await fetch(`/api/repos/${repoId}`);
				if (!res.ok) throw new Error("Failed to fetch repository");

				const data: IRepositoryResponse = await res.json();

				setRepo({
					...data.repository,
					branches: data.branches,
					pullRequests: data.pullRequests,
					commitsCount: data.commitsCount,
				});
			} catch (err) {
				console.error(err);
				toast.error("Failed to load repository.");
				router.replace("/dashboard");
			} finally {
				setLoading(false);
			}
		};

		fetchRepo();
	}, [repoId, repoFromStore, router, setRepo]);

	// ---- Delete a PR ----
	const deletePR = useCallback(
		async (prId: string) => {
			if (!repoFromStore) return;

			try {
				// Delete PR from db
				const res = await fetch(
					`/api/repos/${repoFromStore.id}/pull-request/${prId}`,
					{ method: "DELETE" },
				);

				const data = await res.json();

				if (!res.ok || !data.success) {
					throw new Error("Delete failed");
				}

				// Update local state
				setRepo({
					...repoFromStore,
					pullRequests: repoFromStore.pullRequests?.filter(
						(pr) => pr.id !== prId,
					),
				});

				toast.success("Pull-Request deleted 🗑️");
			} catch (error) {
				console.error("Error deleting pull-request:", error);
				toast.error(
					"An error has occurred while deleting your PR. Please try again later.",
				);
			}
		},
		[repoFromStore, setRepo],
	);

	// ---- Add a PR ----
	const addPR = useCallback(
		async (payload: {
			prTitle: string;
			prBody: string;
			baseBranch: string;
			compareBranch: string;
			language: string;
		}) => {
			if (!repoFromStore) return null;

			try {
				// Add PR to db
				const res = await fetch(
					`/api/repos/${repoFromStore.id}/pull-request/draft`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(payload),
					},
				);

				if (!res.ok) {
					throw new Error("Failed to create PR");
				}

				const newPR = (await res.json()) as IPullRequest;

				// Update local state
				setRepo({
					...repoFromStore,
					pullRequests: [...(repoFromStore.pullRequests ?? []), newPR],
				});

				toast.success("Pull-Request created ✨");

				return newPR;
			} catch (error) {
				console.error("Error creating pull-request:", error);
				toast.error(
					"An error occurred while creating your PR. Please try again later.",
				);
				return null;
			}
		},
		[repoFromStore, setRepo],
	);

	return {
		repo: repoFromStore,
		loading,
		deletePR,
		addPR,
	};
}
