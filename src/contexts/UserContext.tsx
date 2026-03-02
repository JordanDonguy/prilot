"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
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
	const hasFetchedRef = useRef(false);

	const fetchUser = async () => {
		// Fetch user with automatic token refresh on 401
		const res = await fetchWithAuth("/api/auth/me");

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
		try {
			await fetchUser();
		} catch {
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	// Fetch on mount only (ref prevents StrictMode double-fetch)
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only fetch
	useEffect(() => {
		if (hasFetchedRef.current) return;
		hasFetchedRef.current = true;
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
