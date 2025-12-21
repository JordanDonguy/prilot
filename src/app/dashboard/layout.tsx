import { ReactNode } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/server/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
}: {
	children: ReactNode;
}) {
	const user = await getCurrentUser();

	if (!user) redirect("/login");

	return (
		<div className="flex h-screen bg-linear-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900">
			<Sidebar />
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header />
				<main className="flex-1 overflow-y-auto">{children}</main>
			</div>
		</div>
	);
}
