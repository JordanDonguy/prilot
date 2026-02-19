import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import type { IInvitation, IRepository } from "@/types/repos";

type ReposContextType = {
	repositories: IRepository[];
	invitations: IInvitation[];
	refreshData: () => Promise<void>;
	loading: boolean;
	updateGlobalDraftPrCount: (repoId: string, delta: number) => void;
	updateGlobalSentPrCount: (repoId: string, delta: number) => void;
};

const ReposContext = createContext<ReposContextType | undefined>(undefined);

export function ReposProvider({ children }: { children: ReactNode }) {
	const [repositories, setRepositories] = useState<IRepository[]>([]);
	const [invitations, setInvitations] = useState<IInvitation[]>([]);
	const [loading, setLoading] = useState(true);
	const hasFetchedRef = useRef(false);

	const refreshData = async () => {
		try {
			setLoading(true);

			// Fetch repos and invitations with automatic token refresh
			const res = await fetchWithAuth("/api/repos", {
				method: "GET",
			});

			if (!res.ok) throw new Error("Failed to fetch repositories");

			const data = await res.json();

			setRepositories(data.repositories as IRepository[]);
			setInvitations(data.invitations as IInvitation[]);
		} catch (err) {
			console.error("Error fetching repositories:", err);
			setRepositories([]);
			setInvitations([]);
		} finally {
			setLoading(false);
		}
	};

	// Update draft PR count locally for a repo
	const updateGlobalDraftPrCount = (repoId: string, delta: number) => {
		setRepositories((prev) =>
			prev.map((repo) =>
				repo.id === repoId
					? { ...repo, draftPrCount: repo.draftPrCount + delta }
					: repo,
			),
		);
	};

	// Update sent PR count locally for a repo
	const updateGlobalSentPrCount = (repoId: string, delta: number) => {
		setRepositories((prev) =>
			prev.map((repo) =>
				repo.id === repoId
					? { ...repo, sentPrCount: repo.sentPrCount + delta }
					: repo,
			),
		);
	};

	// Fetch on mount only (ref prevents StrictMode double-fetch)
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only fetch
	useEffect(() => {
		if (hasFetchedRef.current) return;
		hasFetchedRef.current = true;
		refreshData();
	}, []);

	return (
		<ReposContext.Provider
			value={{
				repositories,
				invitations,
				refreshData,
				loading,
				updateGlobalDraftPrCount,
				updateGlobalSentPrCount,
			}}
		>
			{children}
		</ReposContext.Provider>
	);
}

export const useRepos = () => {
	const context = useContext(ReposContext);
	if (!context) {
		throw new Error("useRepos must be used within ReposProvider");
	}
	return context;
};
