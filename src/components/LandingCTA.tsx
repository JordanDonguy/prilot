"use client";

import { CustomLink } from "@/components/CustomLink";
import { useUser } from "@/contexts/UserContext";

export default function LandingCTA({
	variants,
}: {
	variants?: "login/signup" | "getStartedFree";
}) {
	const { user, loading } = useUser();

	if (loading) return (
    <div className="mx-auto w-52 h-10 rounded-md bg-gray-300 dark:bg-gray-500 animate-pulse"></div>
  );

	if (variants === "getStartedFree")
		return (
			<CustomLink
				href={user ? "/dashboard" : "/signup"}
				className="w-40 bg-white text-blue-600 hover:bg-gray-200"
			>
				{user ? "Go to dashboard" : "Get Started Free"}
			</CustomLink>
		);

	return user ? (
		<CustomLink
			href="/dashboard"
			className="w-40 bg-linear-to-r from-cyan-50 dark:from-gray-900 to-blue-200 dark:to-blue-900 border border-cyan-300 dark:border-cyan-800 hover:to-blue-400 hover:dark:to-blue-700 transition-colors animate-bounce"
		>
			Go to dashboard
		</CustomLink>
	) : (
		<div className="flex gap-4 justify-center">
			<CustomLink
				href="/login"
				className="bg-gray-200/40 dark:bg-gray-800/40 border border-gray-300 dark:border-gray-700 hover:bg-gray-300/50 hover:dark:bg-gray-600/70"
			>
				Login
			</CustomLink>
			<CustomLink
				href="/signup"
				className="text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
			>
				Sign Up
			</CustomLink>
		</div>
	);
}
