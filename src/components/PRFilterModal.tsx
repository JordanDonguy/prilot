"use client";

import { X } from "lucide-react";
import { motion } from "motion/react";

export type PRFilter = "all" | "draft" | "sent";

type PRFilterModalProps = {
	isOpen: boolean;
	value: PRFilter;
	onClose: () => void;
	onSelect: (value: PRFilter) => void;
};

export function PRFilterModal({
	isOpen,
	value,
	onClose,
	onSelect,
}: PRFilterModalProps) {
	if (!isOpen) return null;

	return (
		<>
			{/* ---- Backdrop ---- */}
			<button
				type="button"
				className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
				onClick={onClose}
			/>

			<motion.div
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.5 }}
				className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
			>
				<div className="pointer-events-auto w-full max-w-sm rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
					{/* ---- Header ---- */}
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold">Filter Pull Requests</h3>
						<button
							type="button"
							onClick={onClose}
							className="opacity-70 hover:opacity-100 transition cursor-pointer"
						>
							<X />
						</button>
					</div>

					{/* ---- Options ---- */}
					<div className="space-y-2">
						{(["all", "draft", "sent"] as const).map((option) => (
							<button
								key={option}
								type="button"
								onClick={() => onSelect(option)}
								className={`
									w-full rounded-lg px-4 py-2 text-left transition-colors cursor-pointer
									${
										value === option
											? "bg-gray-200 dark:bg-gray-700 font-medium"
											: "hover:bg-gray-200/60 dark:hover:bg-gray-700/60"
									}
								`}
							>
								{option === "all"
									? "All PRs"
									: option === "draft"
									? "Draft PRs"
									: "Sent PRs"}
							</button>
						))}
					</div>
				</div>
			</motion.div>
		</>
	);
}
