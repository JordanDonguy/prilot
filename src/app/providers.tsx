// src/app/providers.tsx
"use client"; // client-only because next-themes is client-side

import { ThemeProvider } from "next-themes";
import { type ReactNode, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "@/contexts/UserContext";

type AppProviderProps = {
	children: ReactNode;
};

export default function AppProvider({ children }: AppProviderProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) {
		// Fallback for SSR, prevent hydration mismatch
		return <>{children}</>;
	}

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<UserProvider>{children}</UserProvider>
			<ToastContainer
				position="bottom-center"
				toastClassName="!bg-gray-100 dark:!bg-gray-800 dark:!text-gray-100 !border !border-gray-300 dark:!border-gray-700"
			/>
		</ThemeProvider>
	);
}
