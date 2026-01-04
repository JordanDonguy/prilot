"use client";

import { Github } from "lucide-react";
import { useEffect, useRef } from "react";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ConnectGitHubLoading() {
	const router = useRouter();
	const { setUser } = useUser();

	const connectOnce = useRef(false);

	useEffect(() => {
		if (connectOnce.current) return;
		connectOnce.current = true;

		const connectGitHub = async () => {
			try {
				// Extract code from URL
				const params = new URLSearchParams(window.location.search);
				const code = params.get("code");
				if (!code)
					throw new Error("GitHub login failed, please try again later.");

				// Call backend to exchange code for token and get user info
				const res = await fetch("/api/auth/github/callback", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ code }),
				});

				// Parse response
				const data = await res.json();
				if (!res.ok || !data.success) {
					throw new Error(
						data.message || "GitHub login failed, please try again later.",
					);
				}

				// Update user context and redirect to dashboard
				toast.success("Successfully logged in using GitHub! 🚀");
				setUser(data.user);
				router.replace("/dashboard");
			} catch (err) {
				console.error(err);
				toast.error("GitHub login failed, please try again later.");
				router.replace("/login");
			}
		};

		connectGitHub();
	}, [router, setUser]);

	return (
		<div className="flex flex-col md:flex-row gap-4 items-center justify-center h-screen px-4 text-center">
			<Github size={40} className="animate-pulse" />
			<p className="text-2xl animate-pulse">Logging you in with GitHub...</p>
		</div>
	);
}
