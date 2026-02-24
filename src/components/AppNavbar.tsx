"use client";

import { AnimatePresence } from "framer-motion";
import {
	BookOpen,
	ChevronDown,
	CirclePlus,
	Folder,
	Github,
	Gitlab,
	Home,
	Menu,
	Scale,
	Settings,
	X,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useInstallations } from "@/contexts/InstallationContext";
import { useRepos } from "@/contexts/ReposContext";
import { useUser } from "@/contexts/UserContext";
import { config } from "@/lib/client/config";
import firstCharUpperCase from "@/lib/utils/firstCharUpperCase";
import { useCreditsStore } from "@/stores/creditsStore";
import type { IInvitation } from "@/types/repos";
import AnimatedSlide from "./animations/AnimatedSlide";
import GithubAppButton from "./GithubAppButton";
import LogoutButton from "./LogoutButton";
import { PendingInviteModal } from "./PendingInviteModal";
import ThemeSwitcher from "./ThemeSwitcher";

export default function AppNavbar() {
	const pathname = usePathname();
	const { user } = useUser();
	const { installations } = useInstallations();
	const { repositories, invitations } = useRepos();

	const { remaining: creditsRemaining, total: creditsTotal, loading: creditsLoading, fetchCredits } = useCreditsStore();

	const [mobileOpen, setMobileOpen] = useState(false);
	const [githubOpen, setGithubOpen] = useState(false);
	const [gitlabOpen, setGitlabOpen] = useState(false);
	const [userOpen, setUserOpen] = useState(false);

	const githubRef = useRef<HTMLDivElement>(null);
	const gitlabRef = useRef<HTMLDivElement>(null);
	const userRef = useRef<HTMLDivElement>(null);

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
			if (userRef.current && !userRef.current.contains(e.target as Node)) {
				setUserOpen(false);
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

	// Fetch credits when user dropdown or mobile menu opens
	useEffect(() => {
		if (!userOpen && !mobileOpen) return;
		fetchCredits();
	}, [userOpen, mobileOpen, fetchCredits]);

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

	const userInitial = user?.username?.charAt(0).toUpperCase() ?? "?";

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
							className={`flex items-center gap-2 pl-6 pr-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors ${
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
							className={`flex items-center gap-2 pl-6 pr-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-md ${
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
								setSelectedInvitation(inv);
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
			<nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-300/70 dark:border-gray-800 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Left: Logo */}
						<Link
							href="/"
							className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
						>
							PRilot
						</Link>

						{/* Center: Dashboard + GitHub + GitLab */}
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

							{/* GitHub dropdown */}
							<div ref={githubRef} className="relative">
								<button
									type="button"
									onClick={() => {
										setGithubOpen(!githubOpen);
										setGitlabOpen(false);
										setUserOpen(false);
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
									<div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-[#09090B] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg">
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
										setUserOpen(false);
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
									<div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-[#09090B] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg">
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

						{/* Right: User button with dropdown */}
						<div className="hidden md:flex items-center">
							<div ref={userRef} className="relative">
								<button
									type="button"
									onClick={() => {
										setUserOpen(!userOpen);
										setGithubOpen(false);
										setGitlabOpen(false);
									}}
									className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
										userOpen
											? "bg-gray-100 dark:bg-gray-800"
											: ""
									}`}
								>
									<div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
										{userInitial}
									</div>
									<span className="text-gray-700 dark:text-gray-300">
										{user?.username}
									</span>
									<ChevronDown
										size={14}
										className={`text-gray-500 transition-transform ${userOpen ? "rotate-180" : ""}`}
									/>
								</button>

								{userOpen && (
									<div className="absolute top-full right-0 mt-1 w-60 bg-white dark:bg-[#09090B] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg py-1">
										{/* Account header */}
										<div className="px-3 py-2.5 border-b border-gray-100 dark:border-gray-800 mb-1">
											<p className="text-xs text-gray-500 dark:text-gray-400">
												Signed in as
											</p>
											<p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
												{user?.username}
											</p>
										</div>

										{/* Settings */}
										<Link
											href="/dashboard/settings"
											onClick={() => setUserOpen(false)}
											className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
										>
											<Settings size={15} />
											Settings
										</Link>

										{/* Credits */}
										<div className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
											<Zap size={15} className="text-yellow-500 shrink-0" />
											<span className="flex-1">Credits left</span>
											{creditsLoading ? (
												<span className="text-xs text-gray-400">…</span>
											) : (
												<span className="text-xs font-semibold tabular-nums text-gray-900 dark:text-white">
													{creditsRemaining !== null
														? `${creditsRemaining} / ${creditsTotal}`
														: "—"}
												</span>
											)}
										</div>

										{/* Theme switcher */}
										<div className="flex items-center justify-between px-3 py-1.5">
											<span className="text-sm text-gray-700 dark:text-gray-300">
												Theme
											</span>
											<ThemeSwitcher
												size={15}
												className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
											/>
										</div>

										<div className="border-t border-gray-100 dark:border-gray-800 my-1" />

										{/* Docs */}
										<Link
											href="/docs"
											onClick={() => setUserOpen(false)}
											className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
										>
											<BookOpen size={15} />
											Documentation
										</Link>

										{/* Legal */}
										<Link
											href="/legal"
											onClick={() => setUserOpen(false)}
											className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
										>
											<Scale size={15} />
											Legal
										</Link>

										<div className="border-t border-gray-100 dark:border-gray-800 my-1" />

										{/* Logout */}
										<div className="px-1 pb-1">
											<LogoutButton
												variant="icon"
												size={15}
												showText
												text="Sign out"
												className="w-full px-2.5 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400"
											/>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Mobile: hamburger */}
						<div className="flex md:hidden items-center gap-3">
							<button
								type="button"
								onClick={() => setMobileOpen(!mobileOpen)}
								className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
							>
								{mobileOpen ? (
									<X className="w-5 h-5" />
								) : (
									<Menu className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* Mobile menu - full screen slide from right */}
			<AnimatePresence>
				{mobileOpen && (
					<AnimatedSlide
						key="mobile-menu"
						x={400}
						damping={14}
						mass={0.7}
						className="md:hidden fixed right-0 top-16 bottom-0 w-full bg-white dark:bg-zinc-950 z-40 overflow-y-auto"
					>
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
							<div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-800">
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

							{/* Account section */}
							<div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-1">
								<p className="py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
									Account
								</p>

								<Link
									href="/dashboard/settings"
									onClick={() => setMobileOpen(false)}
									className={`flex items-center gap-4 px-2 py-3 rounded-lg text-base font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
										pathname === "/dashboard/settings"
											? "text-blue-600 dark:text-blue-400"
											: "text-gray-600 dark:text-gray-400"
									}`}
								>
									<Settings size={20} />
									Settings
								</Link>

								{/* Credits */}
								<div className="flex items-center gap-4 px-2 py-3 text-base font-medium text-gray-600 dark:text-gray-400">
									<Zap size={20} className="text-yellow-500 shrink-0" />
									<span className="flex-1">Credits left</span>
									{creditsLoading ? (
										<span className="text-sm text-gray-400">…</span>
									) : (
										<span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-white">
											{creditsRemaining !== null
												? `${creditsRemaining} / ${creditsTotal}`
												: "—"}
										</span>
									)}
								</div>

								{/* Theme */}
								<div className="flex items-center justify-between px-2 py-3">
									<span className="text-base font-medium text-gray-600 dark:text-gray-400">
										Theme
									</span>
									<ThemeSwitcher
										size={20}
										className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
									/>
								</div>

								<Link
									href="/docs"
									onClick={() => setMobileOpen(false)}
									className="flex items-center gap-4 px-2 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
								>
									<BookOpen size={20} />
									Documentation
								</Link>

								<Link
									href="/legal"
									onClick={() => setMobileOpen(false)}
									className="flex items-center gap-4 px-2 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
								>
									<Scale size={20} />
									Legal
								</Link>

								<div className="flex items-center mx-auto pt-4 mt-2">
									<LogoutButton variant="icon" size={20} showText />
								</div>
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
