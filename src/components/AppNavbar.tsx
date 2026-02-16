"use client";

import { AnimatePresence } from "framer-motion";
import {
	ChevronDown,
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
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useInstallations } from "@/contexts/InstallationContext";
import { useRepos } from "@/contexts/ReposContext";
import { config } from "@/lib/client/config";
import firstCharUpperCase from "@/lib/utils/firstCharUpperCase";
import type { IInvitation } from "@/types/repos";
import AnimatedSlide from "./animations/AnimatedSlide";
import GithubAppButton from "./GithubAppButton";
import LogoutButton from "./LogoutButton";
import { PendingInviteModal } from "./PendingInviteModal";
import ThemeSwitcher from "./ThemeSwitcher";

export default function AppNavbar() {
	const pathname = usePathname();
	const { installations } = useInstallations();
	const { repositories, invitations } = useRepos();

	const [mobileOpen, setMobileOpen] = useState(false);
	const [githubOpen, setGithubOpen] = useState(false);
	const [gitlabOpen, setGitlabOpen] = useState(false);

	const githubRef = useRef<HTMLDivElement>(null);
	const gitlabRef = useRef<HTMLDivElement>(null);

	const [selectedInvitation, setSelectedInvitation] =
		useState<IInvitation | null>(null);

	// Close dropdowns on outside click
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (githubRef.current && !githubRef.current.contains(e.target as Node)) {
				setGithubOpen(false);
			}
			if (gitlabRef.current && !gitlabRef.current.contains(e.target as Node)) {
				setGitlabOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	// Close mobile menu on route change
	useEffect(() => {
		if (!pathname) return;
		setMobileOpen(false);
	}, [pathname]);

	// Provider installations
	const githubInstall = installations.find(
		(inst) => inst.provider === "github",
	);
	const gitlabInstall = installations.find(
		(inst) => inst.provider === "gitlab",
	);

	// Repos by provider & role
	const githubOwned = repositories.filter(
		(r) => r.provider === "github" && r.userRole === "owner",
	);
	const gitlabOwned = repositories.filter(
		(r) => r.provider === "gitlab" && r.userRole === "owner",
	);
	const githubMemberRepos = repositories.filter(
		(r) => r.provider === "github" && r.userRole === "member",
	);
	const gitlabMemberRepos = repositories.filter(
		(r) => r.provider === "gitlab" && r.userRole === "member",
	);
	const githubPendingInvites = invitations.filter(
		(i) => i.repositoryProvider === "github",
	);
	const gitlabPendingInvites = invitations.filter(
		(i) => i.repositoryProvider === "gitlab",
	);

	const githubRepoCount =
		githubOwned.length + githubMemberRepos.length + githubPendingInvites.length;
	const gitlabRepoCount =
		gitlabOwned.length + gitlabMemberRepos.length + gitlabPendingInvites.length;

	// Shared repo list renderer
	const renderRepoList = (
		provider: "github" | "gitlab",
		install: boolean,
		owned: typeof repositories,
		memberRepos: typeof repositories,
		pendingInvites: typeof invitations,
	) => (
		<div className="py-2 min-w-56 max-h-80 overflow-y-auto hide-scrollbar">
			{/* No installation */}
			{!install && provider === "github" && (
				<div className="px-3 py-2">
					<GithubAppButton
						appName={config.github.appName}
						redirectUri={`${config.frontendUrl}/github/callback`}
					/>
				</div>
			)}
			{!install && provider === "gitlab" && (
				<div className="px-3 py-2">
					<button
						type="button"
						onClick={() =>
							toast.info("GitLab integration isn't available yet.")
						}
						className="flex items-center gap-2 text-blue-700 dark:text-blue-400 cursor-pointer hover:underline text-sm"
					>
						<CirclePlus size={14} /> Connect GitLab
					</button>
				</div>
			)}

			{/* Installed but no repos */}
			{install && owned.length === 0 && memberRepos.length === 0 && (
				<p className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
					Connected, but no repos found
				</p>
			)}

			{/* Owned repos */}
			{owned.length > 0 && (
				<>
					<p className="px-3 pt-1 pb-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
						Owned
					</p>
					{owned.map((repo) => (
						<Link
							key={repo.id}
							href={`/dashboard/repo/${repo.id}`}
							onClick={() => setGithubOpen(false)}
							className={`flex items-center gap-2 pl-6 pr-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
								pathname.includes(repo.id)
									? "text-blue-600 dark:text-blue-400"
									: "text-gray-800 dark:text-gray-200"
							}`}
						>
							<Folder size={14} />
							{firstCharUpperCase(repo.name)}
						</Link>
					))}
				</>
			)}

			{/* Member / Invited repos */}
			{(memberRepos.length > 0 || pendingInvites.length > 0) && (
				<>
					<p className="px-3 pt-2 pb-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
						Invited
					</p>
					{memberRepos.map((repo) => (
						<Link
							key={repo.id}
							href={`/dashboard/repo/${repo.id}`}
							onClick={() => setGithubOpen(false)}
							className={`flex items-center gap-2 pl-6 pr-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
								pathname.includes(repo.id)
									? "text-blue-600 dark:text-blue-400"
									: "text-gray-800 dark:text-gray-200"
							}`}
						>
							<Folder size={14} />
							{firstCharUpperCase(repo.name)}
						</Link>
					))}
					{pendingInvites.map((inv) => (
						<button
							key={inv.id}
							type="button"
							onClick={() => {
								setGithubOpen(false);
								setSelectedInvitation(inv)
							}}
							className="flex items-center gap-2 w-full pl-6 pr-3 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
						>
							<Folder size={14} />
							⚠️ {firstCharUpperCase(inv.repositoryName)}
						</button>
					))}
				</>
			)}
		</div>
	);

	return (
		<>
			<nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Left: Logo */}
						<Link
							href="/"
							className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
						>
							PRilot
						</Link>

						{/* Center: nav items */}
						<div className="hidden md:flex items-center gap-1">
							<Link
								href="/dashboard"
								className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
									pathname === "/dashboard"
										? "text-blue-600 dark:text-blue-400"
										: "text-gray-600 dark:text-gray-400"
								}`}
							>
								<Home size={16} />
								Dashboard
							</Link>

							<Link
								href="/dashboard/settings"
								className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
									pathname === "/dashboard/settings"
										? "text-blue-600 dark:text-blue-400"
										: "text-gray-600 dark:text-gray-400"
								}`}
							>
								<Settings size={16} />
								Settings
							</Link>

							{/* GitHub dropdown */}
							<div ref={githubRef} className="relative">
								<button
									type="button"
									onClick={() => {
										setGithubOpen(!githubOpen);
										setGitlabOpen(false);
									}}
									className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
										githubOpen
											? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
											: "text-gray-600 dark:text-gray-400"
									}`}
								>
									<Github size={16} />
									GitHub
									{githubRepoCount > 0 && (
										<span className="text-xs bg-gray-200 dark:bg-gray-700 px-1.5 rounded-full">
											{githubRepoCount}
										</span>
									)}
									<ChevronDown
										size={14}
										className={`transition-transform ${githubOpen ? "rotate-180" : ""}`}
									/>
								</button>

								{githubOpen && (
									<div className="absolute top-full left-0 mt-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
										{renderRepoList(
											"github",
											!!githubInstall,
											githubOwned,
											githubMemberRepos,
											githubPendingInvites,
										)}
									</div>
								)}
							</div>

							{/* GitLab dropdown */}
							<div ref={gitlabRef} className="relative">
								<button
									type="button"
									onClick={() => {
										setGitlabOpen(!gitlabOpen);
										setGithubOpen(false);
									}}
									className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
										gitlabOpen
											? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
											: "text-gray-600 dark:text-gray-400"
									}`}
								>
									<Gitlab size={16} />
									GitLab
									{gitlabRepoCount > 0 && (
										<span className="text-xs bg-gray-200 dark:bg-gray-700 px-1.5 rounded-full">
											{gitlabRepoCount}
										</span>
									)}
									<ChevronDown
										size={14}
										className={`transition-transform ${gitlabOpen ? "rotate-180" : ""}`}
									/>
								</button>

								{gitlabOpen && (
									<div className="absolute top-full left-0 mt-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
										{renderRepoList(
											"gitlab",
											!!gitlabInstall,
											gitlabOwned,
											gitlabMemberRepos,
											gitlabPendingInvites,
										)}
									</div>
								)}
							</div>
						</div>

						{/* Right: theme + logout */}
						<div className="hidden md:flex items-center gap-4">
							<ThemeSwitcher className="bg-gray-200/90 dark:bg-gray-800 hover:bg-gray-300 hover:dark:bg-gray-700" />
							<LogoutButton />
						</div>

						{/* Mobile: theme + hamburger */}
						<div className="flex md:hidden items-center gap-3">
							<ThemeSwitcher className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 hover:dark:bg-gray-700" />
							<button
								type="button"
								onClick={() => setMobileOpen(!mobileOpen)}
								className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
							>
								{mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
							</button>
						</div>
					</div>

				</div>
			</nav>

			{/* Mobile menu - full screen slide from right */}
			<AnimatePresence>
				{mobileOpen && (
					<AnimatedSlide key="mobile-menu" x={400} damping={14} mass={0.7} className="md:hidden fixed right-0 top-16 bottom-0 w-full bg-white dark:bg-zinc-950 z-40 overflow-y-auto">
					<div className="flex flex-col gap-6 px-4 py-8 min-h-full">
							<Link
								href="/dashboard"
								onClick={() => setMobileOpen(false)}
								className={`flex items-center gap-4 py-4 rounded-lg text-lg font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
									pathname === "/dashboard"
										? "text-blue-600 dark:text-blue-400"
										: "text-gray-600 dark:text-gray-400"
								}`}
							>
								<Home size={24} />
								Dashboard
							</Link>

							<Link
								href="/dashboard/settings"
								onClick={() => setMobileOpen(false)}
								className={`flex items-center gap-4 rounded-lg text-lg font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
									pathname === "/dashboard/settings"
										? "text-blue-600 dark:text-blue-400"
										: "text-gray-600 dark:text-gray-400"
								}`}
							>
								<Settings size={24} />
								Settings
							</Link>

							{/* GitHub section */}
							<div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-800">
								<p className="flex items-center gap-3 py-2 text-base font-semibold text-gray-800 dark:text-gray-200">
									<Github size={20} />
									GitHub
								</p>
								{renderRepoList(
									"github",
									!!githubInstall,
									githubOwned,
									githubMemberRepos,
									githubPendingInvites,
								)}
							</div>

							{/* GitLab section */}
							<div className="pt-4 mt-2 border-y border-gray-200 dark:border-gray-800">
								<p className="flex items-center gap-3 py-2 text-base font-semibold text-gray-800 dark:text-gray-200">
									<Gitlab size={20} />
									GitLab
								</p>
								{renderRepoList(
									"gitlab",
									!!gitlabInstall,
									gitlabOwned,
									gitlabMemberRepos,
									gitlabPendingInvites,
								)}
							</div>

							{/* Logout in mobile menu */}
							<div className="flex items-center mx-auto pt-4 mt-2">
								<LogoutButton variant="icon" size={20} showText />
							</div>
						</div>
					</AnimatedSlide>
				)}
			</AnimatePresence>

			<PendingInviteModal
				isOpen={!!selectedInvitation}
				invitation={selectedInvitation}
				onClose={() => setSelectedInvitation(null)}
			/>
		</>
	);
}
