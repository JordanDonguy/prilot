"use client";

import { AlertCircle, ExternalLink, LogOut, Trash2 } from "lucide-react";
import { config } from "@/lib/client/config";
import AnimatedSlide from "./animations/AnimatedSlide";

interface RepoAccessWarningProps {
	userRole: "owner" | "member";
	onDeleteRepo: () => void;
	onLeaveRepo: () => void;
}

export function RepoAccessWarning({
	userRole,
	onDeleteRepo,
	onLeaveRepo,
}: RepoAccessWarningProps) {
	const handleReauthorize = () => {
		const url = `https://github.com/apps/${config.github.appName}/installations/new`;
		window.location.href = url;
	};

	return (
		<AnimatedSlide y={20} className="bg-orange-100 dark:bg-yellow-900/15 border border-orange-400/50 dark:border-yellow-800/40 rounded-lg p-4 flex flex-col gap-4">
			<div className="flex items-start gap-3">
				<AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
				<div>
					<h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
						Repository access lost
					</h3>
					<p className="text-sm text-amber-800 dark:text-amber-200">
						{userRole === "owner"
							? "The GitHub App authorization for this repository has been removed. You can re-authorize it or delete it."
							: "The GitHub App authorization for this repository has been removed. Please contact the repository owner to re-authorize it, or leave the repository."}
					</p>
				</div>
			</div>

			<div className="flex flex-col md:flex-row gap-3 ml-8">
				{userRole === "owner" ? (
					<>
						<button
							type="button"
							onClick={handleReauthorize}
							className="flex items-center gap-2 px-4 h-9 rounded-lg bg-amber-600 text-white hover:cursor-pointer hover:opacity-90 text-sm font-medium"
						>
							<ExternalLink size={16} />
							Re-authorize
						</button>
						<button
							type="button"
							onClick={onDeleteRepo}
							className="flex items-center gap-2 px-4 h-9 rounded-lg border border-red-400 dark:border-red-600 text-red-600 dark:text-red-400 hover:cursor-pointer hover:bg-red-200 dark:hover:bg-red-700/20 text-sm font-medium"
						>
							<Trash2 size={16} />
							Delete repository
						</button>
					</>
				) : (
					<button
						type="button"
						onClick={onLeaveRepo}
						className="flex items-center gap-2 px-4 h-9 rounded-lg border border-red-400 dark:border-red-600 text-red-600 dark:text-red-400 hover:cursor-pointer hover:bg-red-200 dark:hover:bg-red-700/20 text-sm font-medium"
					>
						<LogOut size={16} />
						Leave repository
					</button>
				)}
			</div>
		</AnimatedSlide>
	);
}
