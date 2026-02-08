import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRepoStore } from "@/stores/repoStore";
import type { IRepositoryResponse } from "@/types/repos";

export function useRepository(repoId: string) {
	const router = useRouter();
	const repoFromStore = useRepoStore((s) => s.repos[repoId]);
	const setRepo = useRepoStore((s) => s.setRepo);

	const [loading, setLoading] = useState(!repoFromStore);

	// ---- ref to prevent double fetch ----
	const isFetchingRef = useRef(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: repoFromStore excluded to avoid refetch on store updates
	useEffect(() => {
		const fetchRepo = async () => {
			if (isFetchingRef.current || repoFromStore) return;
			isFetchingRef.current = true;

			if (!repoFromStore) setLoading(true); // only show loading on first fetch

			try {
				const res = await fetch(`/api/repos/${repoId}`);

				if (!res.ok) {
					const data = await res.json();
					toast.error(data.error || "Failed to fetch repository");
					isFetchingRef.current = false;
					setLoading(false);
					return router.replace("/dashboard");
				}

				const data: IRepositoryResponse = await res.json();

				setRepo({
					...data.repository,
					branches: data.branches,
					commitsCount: data.commitsCount,
					isAccessible: data.isAccessible,
				});
			} catch (err) {
				console.error(err);
				toast.error("Failed to load repository.");
				router.replace("/dashboard");
			} finally {
				isFetchingRef.current = false;
				setLoading(false);
			}
		};

		fetchRepo();
	}, [repoId, setRepo, router]);

	return {
		repo: repoFromStore,
		loading,
	};
}
