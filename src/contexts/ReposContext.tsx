import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import type { IRepository } from "@/types/repos";

type ReposContextType = {
	repositories: IRepository[];
	refreshRepositories: () => Promise<void>;
};

const ReposContext = createContext<ReposContextType | undefined>(undefined);

export function ReposProvider({ children }: { children: ReactNode }) {
	const [repositories, setRepositories] = useState<IRepository[]>([]);

	const refreshRepositories = async () => {
		try {
			const res = await fetch("/api/repos", {
				method: "GET",
				credentials: "include",
			});

			if (!res.ok) throw new Error("Failed to fetch repositories");

			const data = await res.json();
			setRepositories(data.repositories as IRepository[]);
      console.log(data)
		} catch (err) {
			console.error("Error fetching repositories:", err);
			setRepositories([]);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: fetch on mount only
	useEffect(() => {
		refreshRepositories();
	}, []);

	return (
		<ReposContext.Provider value={{ repositories, refreshRepositories }}>
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
