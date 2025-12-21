"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { Github, Gitlab } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { passwordValidationSchema } from "@/lib/schemas/auth.schema";
import z from "zod";

export default function LoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [ready, setReady] = useState(false);

	// Route guard
	useEffect(() => {
		const fetchUser = async () => {
			const res = await fetch("/api/auth/me", {
				credentials: "include",
			});

			if (res.ok) return router.replace("dashboard");
			setReady(true);
		};
		fetchUser();
	}, []);

	// Login fetch
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Check if password is valid
			const validatedPassword =
				await passwordValidationSchema.parseAsync(password);

			// If valid, send request
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password: validatedPassword }),
			});

			const data = await res.json();

			if (!res.ok) {
				toast.error(data.error || "Login failed");
				setLoading(false);
				return;
			}

			router.push("/dashboard");
			toast.success("Welcome back! 🚀");
		} catch (err) {
			if (err instanceof z.ZodError) {
				toast.error(
					"Your password needs at least 8 characters, including a capital letter, a number, and a special symbol 🔒",
				);
			} else {
				toast.error("An unexpected error occurred");
				console.error(err);
			}
			setLoading(false);
		}
	};

	if (!ready)
		return (
			<div className="h-screen flex justify-center items-center bg-linear-to-b from-blue-100 to-white dark:from-zinc-950 dark:to-gray-900">
				<div className="fade-in max-w-md h-148 w-full pt-4 pb-8 px-8 rounded-2xl text-center shadow-md bg-gray-100 dark:bg-zinc-800/25 animate-pulse"></div>
			</div>
		);

	return (
		<div className="flex justify-center items-center min-h-screen bg-linear-to-b from-blue-100 to-white dark:from-zinc-950 dark:to-gray-900">
			<div className="fade-in-fast max-w-md w-full pt-4 pb-8 px-8 border border-gray-300 dark:border-gray-700 rounded-2xl text-center shadow-md bg-white/40 dark:bg-zinc-900/25">
				<div className="flex justify-between items-center w-full max-w-md mb-8">
					<Link href="/" className="hover:underline">
						← Back
					</Link>
					<ThemeSwitcher className="bg-transparent! hover:bg-gray-300! hover:dark:bg-cyan-800!" />
				</div>
				<h1 className="text-2xl font-semibold mb-2">Welcome to PRilot</h1>
				<h2 className="text-gray-700 dark:text-gray-300 mb-6">
					Sign in to manage your repositories and PRs
				</h2>
				<section className="grid grid-cols-2 max-w-xs mx-auto rounded-xl mb-6 overflow-hidden border border-gray-200 dark:border-gray-700">
					<Link
						href="/login"
						className="bg-gray-200 dark:bg-gray-800 py-2 font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition"
					>
						Login
					</Link>
					<Link
						href="/signup"
						className="bg-gray-200 dark:bg-gray-800 py-2 text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition"
					>
						Register
					</Link>
				</section>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
					<div>
						<label
							htmlFor="email"
							className="block mb-1 text-gray-700 dark:text-gray-300 font-medium"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-4 py-2 border rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block mb-1 text-gray-700 dark:text-gray-300 font-medium"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							placeholder="********"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full px-4 py-2 border rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="mt-2 w-full py-2 bg-blue-500 text-white rounded-xl font-semibold hover:cursor-pointer hover:bg-blue-600 disabled:opacity-50 transition"
					>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>
				<div className="my-4 flex items-center gap-2">
					<span className="grow h-px bg-gray-300 dark:bg-gray-600"></span>
					<span className="text-gray-500 dark:text-gray-400 text-sm">
						or continue with
					</span>
					<span className="grow h-px bg-gray-300 dark:bg-gray-600"></span>
				</div>
				<div className="grid md:grid-cols-2 gap-4 justify-center">
					<button
						type="button"
						className="flex justify-center items-center gap-2 px-4 py-2 border border-gray-400 rounded-xl hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
					>
						<Github className="w-5 h-5" />
						GitHub
					</button>
					<button
						type="button"
						className="flex justify-center items-center gap-2 px-4 py-2 border border-gray-400 rounded-xl hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
					>
						<Gitlab className="w-5 h-5" />
						GitLab
					</button>
				</div>
			</div>
		</div>
	);
}
