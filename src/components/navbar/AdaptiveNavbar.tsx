"use client";

import { AnimatePresence } from "framer-motion";
import {
	BookOpen,
	Home as HomeIcon,
	Menu,
	Scale,
	ShieldCheck,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import AnimatedSlide from "../animations/AnimatedSlide";
import LandingCTA from "../landing/LandingCTA";
import NavbarUserButton from "./NavbarUserButton";
import ThemeSwitcher from "./ThemeSwitcher";

const navLinks: { href: string; label: string; icon: ReactNode }[] = [
	{ href: "/docs", label: "Docs", icon: <BookOpen size={16} /> },
	{ href: "/privacy", label: "Privacy", icon: <ShieldCheck size={16} /> },
	{ href: "/terms", label: "Terms", icon: <Scale size={16} /> },
];

export default function AdaptiveNavbar() {
	const pathname = usePathname();
	const { user, loading } = useUser();
	const [mobileOpen, setMobileOpen] = useState(false);

	// Close mobile menu on route change
	// biome-ignore lint/correctness/useExhaustiveDependencies: close menu when pathname changes
	useEffect(() => {
		setMobileOpen(false);
	}, [pathname]);

	return (
		<>
			<nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Left: Logo */}
						<Link
							href="/"
							className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
						>
							PRilot
						</Link>

						{/* Center: nav links (desktop) */}
						<div className="hidden sm:flex items-center gap-1">
							{!loading && user && (
								<Link
									href="/dashboard"
									className="md:ml-16 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
								>
									<HomeIcon size={16} />
									Dashboard
								</Link>
							)}
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
										pathname === link.href
											? "text-blue-600 dark:text-blue-400"
											: "text-gray-600 dark:text-gray-400"
									}`}
								>
									{link.icon}
									{link.label}
								</Link>
							))}
						</div>

						{/* Right: user button or CTA (desktop) */}
						<div className="hidden sm:flex items-center gap-3">
							{loading ? null : user ? (
								<NavbarUserButton />
							) : (
								<>
									<ThemeSwitcher className="bg-white/70 dark:bg-gray-800 border border-blue-200 dark:border-cyan-800 hover:bg-gray-200 hover:dark:bg-gray-700" />
									<LandingCTA animated={false} />
								</>
							)}
						</div>

						{/* Mobile: hamburger */}
						<div className="flex sm:hidden items-center gap-3">
							<ThemeSwitcher className="bg-blue-100 dark:bg-gray-800 hover:bg-gray-200 hover:dark:bg-gray-700" />
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

			{/* Mobile menu */}
			<AnimatePresence>
				{mobileOpen && (
					<AnimatedSlide
						key="adaptive-mobile-menu"
						x={400}
						damping={14}
						mass={0.7}
						className="sm:hidden fixed right-0 top-16 bottom-0 w-full bg-white dark:bg-zinc-950 z-40 overflow-y-auto"
					>
						<div className="flex flex-col gap-2 p-6 min-h-full">
							{!loading && user && (
								<Link
									href="/dashboard"
									className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
								>
									<HomeIcon size={18} />
									Dashboard
								</Link>
							)}
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={`flex items-center gap-3 px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
										pathname === link.href
											? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30"
											: "text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
									}`}
								>
									{link.icon}
									{link.label}
								</Link>
							))}

							{!loading && !user && (
								<div className="pt-4 mt-2 px-4">
									<LandingCTA animated={false} />
								</div>
							)}
						</div>
					</AnimatedSlide>
				)}
			</AnimatePresence>
		</>
	);
}
