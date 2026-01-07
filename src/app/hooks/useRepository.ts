import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRepoStore } from "@/stores/repoStore";
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
					commitsCount: data.commitsCount
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

	return {
		repo: repoFromStore,
		loading,
	};
}
