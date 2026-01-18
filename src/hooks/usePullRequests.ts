import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRepoStore } from "@/stores/repoStore";
import type { IPagination, IPullRequest, PRFilter } from "@/types/pullRequests";

interface UsePullRequestsOptions {
	repoId: string;
	initialPage?: number;
	perPage?: number;
	initialFilter?: PRFilter;
}

export function usePullRequests({
	repoId,
	initialPage = 1,
	perPage = 5,
	initialFilter = "all"
}: UsePullRequestsOptions) {
	const repoFromStore = useRepoStore((s) => s.repos[repoId]);

	const [pullRequests, setPullRequests] = useState<IPullRequest[]>([]);
	const [pagination, setPagination] = useState<IPagination>({
		page: initialPage,
		perPage,
		total: 0,
		totalPages: 1,
	});
	const [filter, setFilter] = useState<PRFilter>(initialFilter);
	const [loading, setLoading] = useState(false);

	const isFetchingRef = useRef(false);

	const fetchPRs = useCallback(
		async (page = initialPage) => {
			if (!repoFromStore || isFetchingRef.current) return;
			isFetchingRef.current = true;
			setLoading(true);

			try {
				const res = await fetch(
					`/api/repos/${repoId}/pull-requests?page=${page}&per_page=${perPage}&status=${filter}`,
				);
				if (!res.ok) throw new Error("Failed to fetch pull requests");

				const data = (await res.json()) as {
					pullRequests: IPullRequest[];
					pagination: IPagination;
				};

				// Edge case: empty page (can happen after a draft PR delete)
				if (data.pullRequests.length === 0 && page > 1) {
					// go to previous page
					setPagination((p) => ({ ...p, page: page - 1 }));
					// fetch previous page
					fetchPRs(page - 1);
					return; // stop current fetch
				}

				setPullRequests(data.pullRequests);
				setPagination(data.pagination);
			} catch (err) {
				console.error(err);
				toast.error("Failed to load pull requests.");
			} finally {
				setLoading(false);
				isFetchingRef.current = false;
			}
		},
		[repoFromStore, repoId, perPage, initialPage, filter],
	);

	// Fetch on mount and page change
	useEffect(() => {
		fetchPRs(pagination.page);
	}, [fetchPRs, pagination.page]);

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
		filter,
		setFilter
	};
}
