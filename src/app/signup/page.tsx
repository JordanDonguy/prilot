import Link from "next/link";
import { Github, Gitlab } from "lucide-react";

export default function SignupPage() {
	return (
		<div className="min-h-screen flex justify-center items-center bg-linear-to-b from-blue-100 to-white dark:from-zinc-950 dark:to-gray-900">
			<div className="max-w-md w-full p-8 border border-gray-300 dark:border-gray-700 rounded-2xl text-center shadow-md bg-white/40 dark:bg-zinc-900/25">
				<h1 className="text-2xl font-semibold mb-2">Welcome to PRilot</h1>
				<h2 className="text-gray-700 dark:text-gray-300 mb-6">
					Register to manage your repositories and PRs
				</h2>

				<section className="grid grid-cols-2 max-w-xs mx-auto rounded-xl mb-6 overflow-hidden border border-gray-200 dark:border-gray-700">
					<Link
						href="/login"
						className="bg-gray-200 dark:bg-gray-800 py-2 font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
					>
						Login
					</Link>
					<Link
						href="/signup"
						className="bg-gray-200 dark:bg-gray-800 py-2 font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition"
					>
						Register
					</Link>
				</section>

				<form className="flex flex-col gap-4 text-left">
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
							className="w-full px-4 py-2 border rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
					</div>

					<div>
						<label
							htmlFor="confirm-password"
							className="block mb-1 text-gray-700 dark:text-gray-300 font-medium"
						>
							Confirm Password
						</label>
						<input
							id="confirm-password"
							type="password"
							placeholder="********"
							className="w-full px-4 py-2 border rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
					</div>

					<button
						type="submit"
						className="mt-2 w-full py-2 bg-blue-500 text-white rounded-xl font-semibold hover:cursor-pointer hover:bg-blue-600 transition"
					>
						Register
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
