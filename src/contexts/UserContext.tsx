"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import type { IUser } from "@/types/user";

interface UserContextType {
	user: IUser | null;
	loading: boolean;
	setUser: (user: IUser | null) => void;
	refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
	children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
	const [user, setUser] = useState<IUser | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchUser = async () => {
    // Initial fetch
		let res = await fetch("/api/auth/me", { credentials: "include" });

    // If unauthorized, try refreshing token
		if (res.status === 401) {
			const refreshRes = await fetch("/api/auth/refresh", {
				credentials: "include",
			});

      // If refresh fails, set user to null
			if (!refreshRes.ok) {
				setUser(null);
				return;
			}

      // Retry fetching user
			res = await fetch("/api/auth/me", { credentials: "include" });
		}

    // Set user if fetch successful
		if (res.ok) {
			const data = await res.json();
			setUser(data);
		} else {
			setUser(null);
		}
	};

  // Function to refresh user data
	const refreshUser = async () => {
		setLoading(true);
		await fetchUser();
		setLoading(false);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: we only want to run this on mount
	useEffect(() => {
		refreshUser();
	}, []);

	return (
		<UserContext.Provider value={{ user, loading, refreshUser, setUser }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
}
