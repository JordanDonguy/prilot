"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { InstallationsProvider } from "@/contexts/InstallationContext";
import { ReposProvider } from "@/contexts/ReposContext";
import { useUser } from "@/contexts/UserContext";

interface DashboardLayoutProps {
	children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const router = useRouter();
	const { user, loading } = useUser();

	// Redirect to login if not authenticated
	useEffect(() => {
		if (!loading && !user) {
			router.replace("/login");
		}
	}, [loading, user, router]);

	// Show skeleton until user data is ready
	if (loading || !user) return <DashboardSkeleton />;

	return (
		<InstallationsProvider>
			<ReposProvider>
				<div className="flex h-screen bg-linear-to-b from-blue-50 to-white dark:from-zinc-950 dark:to-[#13131d]">
					<Sidebar />
					<div className="flex-1 flex flex-col overflow-y-auto">
						<Header />
						<main className="flex-1 ">{children}</main>
					</div>
				</div>
			</ReposProvider>
		</InstallationsProvider>
	);
}
