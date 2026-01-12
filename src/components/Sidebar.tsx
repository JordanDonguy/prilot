"use client";

import {
	ChevronDown,
	ChevronRight,
	CirclePlus,
	Folder,
	Github,
	Gitlab,
	Home,
	Menu,
	Settings,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useInstallations } from "@/contexts/InstallationContext";
import { useRepos } from "@/contexts/ReposContext";
import { config } from "@/lib/client/config";
import GithubAppButton from "./GithubAppButton";

export default function Sidebar() {
	const pathname = usePathname();
	const { installations } = useInstallations();
	const { repositories } = useRepos();

	const [showGithub, setShowGithub] = useState(true);
	const [showGitlab, setShowGitlab] = useState(true);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// provider installations
	const githubInstall = installations.find((inst) => inst.provider === "github");
	const gitlabInstall = installations.find((inst) => inst.provider === "gitlab");

	// Owned repos
	const githubOwned = repositories.filter(
		(r) => r.provider === "github" && r.userRole === "owner"
	);
	const gitlabOwned = repositories.filter(
		(r) => r.provider === "gitlab" && r.userRole === "owner"
	);

	// Invited repos
	const githubInvited = repositories.filter(
		(r) => r.provider === "github" && r.userRole === "member"
	);
	const gitlabInvited = repositories.filter(
		(r) => r.provider === "gitlab" && r.userRole === "member"
	);

	return (
		<>
			{/* Mobile hamburger button */}
			<button
				type="button"
				className="md:hidden fixed top-2 left-4 z-50 p-2 rounded-md transition-colors
				hover:cursor-pointer hover:bg-gray-400/70 hover:dark:bg-cyan-500/70"
				onClick={() => setSidebarOpen(!sidebarOpen)}
			>
				{sidebarOpen ? <X /> : <Menu />}
			</button>

			<aside
				className={`
					fixed md:relative z-30 top-14 md:top-0 left-0 h-screen w-64 border-r border-gray-400 dark:border-gray-700 p-2 pt-6
					backdrop-blur-md bg-gray-50/40 dark:bg-zinc-950/80 md:bg-transparent md:dark:bg-transparent
					transform transition-transform duration-300 ease-in-out overflow-y-scroll hide-scrollbar
					${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
				`}
			>
				{/* Logo */}
				<Link
					href="/"
					onClick={() => setSidebarOpen(false)}
					className="p-2 mb-2 text-2xl font-bold text-blue-700 dark:text-blue-400"
				>
					PRilot
				</Link>

				{/* Dashboard */}
				<Link
					href="/dashboard"
					onClick={() => setSidebarOpen(false)}
					className="w-full flex mt-4 pt-2 px-2 rounded-xl hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
				>
					<h2 className="flex items-center gap-4 text-lg font-semibold mb-2">
						<Home
							className={`${pathname === "/dashboard" && "text-blue-600 dark:text-blue-400"}`}
						/>
						Dashboard
					</h2>
				</Link>

				{/* Settings */}
				<Link
					href="/dashboard/settings"
					onClick={() => setSidebarOpen(false)}
					className="w-full flex my-2 pt-2 px-2 rounded-xl hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
				>
					<h2 className="flex items-center gap-4 text-lg font-semibold mb-2">
						<Settings
							className={`${pathname === "/dashboard/settings" && "text-blue-600 dark:text-blue-400"}`}
						/>
						Settings
					</h2>
				</Link>

				{/* ---------------- GitHub ---------------- */}
				<section className={`${showGithub ? "mb-8" : "mb-2"}`}>
					<button
						type="button"
						onClick={() => setShowGithub(!showGithub)}
						className="flex justify-between items-center w-full pt-2 px-2 rounded-xl hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
					>
						<h2 className="flex items-center gap-4 text-lg font-semibold mb-2">
							<Github />
							GitHub
						</h2>
						{showGithub ? <ChevronDown className="mb-2" /> : <ChevronRight className="mb-2" />}
					</button>

					{showGithub && (
						<div className="pl-2 mt-2 mb-4">
							{/* No installation */}
							{!githubInstall && (
								<GithubAppButton
									appName={config.github.appName}
									redirectUri={`${config.frontendUrl}/github/callback`}
								/>
							)}

							{/* Installation exists but no repos */}
							{githubInstall && githubOwned.length === 0 && githubInvited.length === 0 && (
								<div className="pl-4 mt-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
									GitHub connected, but no repos found
								</div>
							)}

							{/* Owned repos */}
							{githubOwned.length > 0 && (
								<>
									<h3 className="pl-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
										Owned Repos
									</h3>
									<ul className="space-y-1">
										{githubOwned.map((repo) => (
											<li key={repo.id}>
												<Link
													onClick={() => setSidebarOpen(false)}
													href={`/dashboard/repo/${repo.id}`}
													className="flex gap-4 items-center lg:ml-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
												>
													<Folder
														size={16}
														className={`${pathname.includes(repo.id) && "text-blue-600 dark:text-blue-400 scale-120"}`}
													/>
													<span className="text-gray-900 dark:text-white text-sm">
														{repo.name.charAt(0).toUpperCase() + repo.name.slice(1)}
													</span>
												</Link>
											</li>
										))}
									</ul>
								</>
							)}

							{/* Invited repos */}
							{githubInvited.length > 0 && (
								<>
									<h3 className="pl-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 mt-2">
										Invited Repos
									</h3>
									<ul className="space-y-1">
										{githubInvited.map((repo) => (
											<li key={repo.id}>
												<Link
													onClick={() => setSidebarOpen(false)}
													href={`/dashboard/repo/${repo.id}`}
													className="flex gap-4 items-center lg:ml-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
												>
													<Folder
														size={16}
														className={`${pathname.includes(repo.id) && "text-blue-600 dark:text-blue-400 scale-120"}`}
													/>
													<span className="text-gray-900 dark:text-white text-sm">
														{repo.name.charAt(0).toUpperCase() + repo.name.slice(1)}
													</span>
												</Link>
											</li>
										))}
									</ul>
								</>
							)}
						</div>
					)}
				</section>

				{/* ---------------- GitLab ---------------- */}
				<section className={`${showGitlab ? "mb-8" : "mb-2"}`}>
					<button
						type="button"
						onClick={() => setShowGitlab(!showGitlab)}
						className="flex justify-between items-center w-full pt-2 px-2 rounded-xl hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
					>
						<h2 className="flex items-center gap-4 text-lg font-semibold mb-2">
							<Gitlab />
							GitLab
						</h2>
						{showGitlab ? <ChevronDown className="mb-2" /> : <ChevronRight className="mb-2" />}
					</button>

					{showGitlab && (
						<div className="pl-2 mt-2 mb-4">
							{/* No installation */}
							{!gitlabInstall && (
								<button
									type="button"
									onClick={() => toast.info("GitLab integration isn't available yet.")}
									className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mt-2 cursor-pointer hover:underline"
								>
									<CirclePlus size={16} /> Connect GitLab
								</button>
							)}

							{/* Installation exists but no repos */}
							{gitlabInstall && gitlabOwned.length === 0 && gitlabInvited.length === 0 && (
								<div className="pl-4 mt-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
									GitLab connected, but no repos found
								</div>
							)}

							{/* Owned repos */}
							{gitlabOwned.length > 0 && (
								<>
									<h3 className="pl-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
										Owned Repos
									</h3>
									<ul className="space-y-1">
										{gitlabOwned.map((repo) => (
											<li key={repo.id}>
												<Link
													onClick={() => setSidebarOpen(false)}
													href={`/dashboard/repo/${repo.id}`}
													className="flex gap-4 items-center lg:ml-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
												>
													<Folder
														size={16}
														className={`${pathname.includes(repo.id) && "text-blue-600 dark:text-blue-400 scale-120"}`}
													/>
													<span className="text-gray-900 dark:text-white text-sm">
														{repo.name.charAt(0).toUpperCase() + repo.name.slice(1)}
													</span>
												</Link>
											</li>
										))}
									</ul>
								</>
							)}

							{/* Invited repos */}
							{gitlabInvited.length > 0 && (
								<>
									<h3 className="pl-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 mt-2">
										Invited Repos
									</h3>
									<ul className="space-y-1">
										{gitlabInvited.map((repo) => (
											<li key={repo.id}>
												<Link
													onClick={() => setSidebarOpen(false)}
													href={`/dashboard/repo/${repo.id}`}
													className="flex gap-4 items-center lg:ml-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
												>
													<Folder
														size={16}
														className={`${pathname.includes(repo.id) && "text-blue-600 dark:text-blue-400 scale-120"}`}
													/>
													<span className="text-gray-900 dark:text-white text-sm">
														{repo.name.charAt(0).toUpperCase() + repo.name.slice(1)}
													</span>
												</Link>
											</li>
										))}
									</ul>
								</>
							)}
						</div>
					)}
				</section>
			</aside>
		</>
	);
}
