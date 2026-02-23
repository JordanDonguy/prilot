import { useEffect, useRef } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const DEBOUNCE_MS = 600;

/**
 * Prefetches GitHub compare data (file diffs + commit messages) when both branches are selected.
 * Serves both fast and deep PR generation modes from a single cache.
 * Fire-and-forget: errors are silently ignored.
 */
export function usePrefetchCompare(
	repoId: string,
	baseBranch: string,
	compareBranch: string,
) {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const lastPrefetchedRef = useRef("");

	useEffect(() => {
		if (!baseBranch || !compareBranch || baseBranch === compareBranch) return;

		const key = `${repoId}:${baseBranch}:${compareBranch}`;
		if (lastPrefetchedRef.current === key) return;

		if (timeoutRef.current) clearTimeout(timeoutRef.current);

		timeoutRef.current = setTimeout(() => {
			lastPrefetchedRef.current = key;

			fetchWithAuth(
				`/api/repos/${repoId}/pull-requests/generate/prefetch`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ baseBranch, compareBranch }),
				},
			).catch(() => {});
		}, DEBOUNCE_MS);

		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [repoId, baseBranch, compareBranch]);
}
