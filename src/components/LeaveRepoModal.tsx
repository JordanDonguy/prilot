"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import firstCharUpperCase from "@/lib/utils/firstCharUpperCase";

type LeaveRepoModalProps = {
	isOpen: boolean;
	repoName: string | null;
	onClose: () => void;
	onConfirm: () => void;
	disabled?: boolean;
};

export function LeaveRepoModal({
	isOpen,
	repoName,
	onClose,
	onConfirm,
	disabled,
}: LeaveRepoModalProps) {
	if (!repoName || !isOpen) return null;

	return (
		<div className="fixed backdrop-blur-sm inset-0 z-50 flex items-center justify-center bg-black/50">
			<motion.div
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.5 }}
				className="pointer-events-auto w-full max-w-sm rounded-xl bg-white dark:bg-zinc-950/90 border border-gray-200 dark:border-gray-800 p-6 shadow-lg"
			>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold text-red-600">
						Leave repository
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="hover:opacity-70 hover:cursor-pointer transition"
					>
						<X />
					</button>
				</div>

				<p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
					Are you sure you want to leave{" "}
					<strong>{firstCharUpperCase(repoName)}</strong>?
					<br />
					You will lose access to this repository and its resources.
				</p>

				<div className="flex justify-end gap-3">
					<button
						type="button"
						onClick={onClose}
						className="px-4 h-9 rounded-lg border border-gray-400 dark:border-gray-600 hover:cursor-pointer hover:opacity-80"
					>
						Cancel
					</button>

					<button
						disabled={disabled}
						type="button"
						onClick={onConfirm}
						className="px-4 h-9 rounded-lg bg-red-600 text-white hover:cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Leave
					</button>
				</div>
			</motion.div>
		</div>
	);
}
