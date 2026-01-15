import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { IPagination } from "@/types/pullRequests";
import type { IPullRequest } from "@/types/pullRequests";
import { useRepoStore } from "@/stores/repoStore";

interface UsePullRequestsOptions {
	repoId: string;
	initialPage?: number;
	perPage?: number;
}

export function usePullRequests({ repoId, initialPage = 1, perPage = 5 }: UsePullRequestsOptions) {
	const repoFromStore = useRepoStore((s) => s.repos[repoId]);

	const [pullRequests, setPullRequests] = useState<IPullRequest[]>([]);
	const [pagination, setPagination] = useState<IPagination>({
		page: initialPage,
		perPage,
		total: 0,
		totalPages: 1,
	});
	const [loading, setLoading] = useState(false);

	const isFetchingRef = useRef(false);

	const fetchPRs = useCallback(async (page = initialPage) => {
		if (!repoFromStore || isFetchingRef.current) return;
		isFetchingRef.current = true;
		setLoading(true);

		try {
			const res = await fetch(`/api/repos/${repoId}/pull-requests?page=${page}&per_page=${perPage}`);
			if (!res.ok) throw new Error("Failed to fetch pull requests");

			const data = await res.json() as { pullRequests: IPullRequest[]; pagination: IPagination };

			setPullRequests(data.pullRequests);
			setPagination(data.pagination);
		} catch (err) {
			console.error(err);
			toast.error("Failed to load pull requests.");
		} finally {
			setLoading(false);
			isFetchingRef.current = false;
		}
	}, [repoFromStore, repoId, perPage, initialPage]);

	// Fetch on mount and page change
	useEffect(() => {
		fetchPRs(pagination.page);
	}, [fetchPRs, pagination.page]);

	// ---- Delete a PR ----
	const deletePR = useCallback(async (prId: string) => {
		if (!repoFromStore) return;

		try {
			const res = await fetch(`/api/repos/${repoFromStore.id}/pull-requests/${prId}`, { method: "DELETE" });
			const data = await res.json();
			if (!res.ok || !data.success) throw new Error("Delete failed");

			setPullRequests((prs) => prs.filter((pr) => pr.id !== prId));
			toast.success("Pull request deleted 🗑️");
		} catch (err) {
			console.error(err);
			toast.error("Failed to delete pull request.");
		}
	}, [repoFromStore]);

	// ---- Add a PR ----
	const addPR = useCallback(async (payload: {
		prTitle: string;
		prBody: string;
		baseBranch: string;
		compareBranch: string;
		language: string;
	}) => {
		if (!repoFromStore) return null;

		try {
			const res = await fetch(`/api/repos/${repoFromStore.id}/pull-requests/draft`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) throw new Error("Failed to create PR");

			const newPR = await res.json() as IPullRequest;
			setPullRequests((prs) => [newPR, ...prs]);
			toast.success("Pull request created ✨");
			return newPR;
		} catch (err) {
			console.error(err);
			toast.error("Failed to create pull request.");
			return null;
		}
	}, [repoFromStore]);

	// ---- Pagination controls ----
	const loadPage = (newPage: number) => {
		if (newPage < 1 || newPage > pagination.totalPages) return;
		setPagination((p) => ({ ...p, page: newPage }));
	};
	const loadNextPage = () => loadPage(pagination.page + 1);
	const loadPrevPage = () => loadPage(pagination.page - 1);

	return {
		pullRequests,
		loading,
		pagination,
		loadPage,
		loadNextPage,
		loadPrevPage,
		deletePR,
		addPR,
	};
}
