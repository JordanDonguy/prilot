"use client";

import { Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/Button";

type ConfirmDeletePRModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
};

export function ConfirmDeletePRModal({
	isOpen,
	onClose,
	onConfirm,
}: ConfirmDeletePRModalProps) {
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
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold">Delete draft PR</h3>
						<button
							type="button"
							onClick={onClose}
							className="opacity-70 cursor-pointer hover:opacity-100 transition"
						>
							<X />
						</button>
					</div>

					{/* ---- Content ---- */}
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
						This action is irreversible. Are you sure you want to delete this
						draft pull request?
					</p>

					{/* ---- Actions ---- */}
					<div className="flex justify-end gap-2">
						<Button
							variant="ghost"
							onClick={onClose}
						>
							Cancel
						</Button>

						<Button
							onClick={onConfirm}
							className="bg-red-600 hover:bg-red-700 text-white"
						>
							<Trash2 className="w-4 h-4 mr-2" />
							Delete
						</Button>
					</div>
				</div>
			</motion.div>
		</>
	);
}
