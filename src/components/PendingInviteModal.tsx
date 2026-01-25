"use client";

import { X } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import { useRepos } from "@/contexts/ReposContext";
import type { IInvitation } from "@/types/repos";
import { Button } from "./Button";

type PendingInviteModalProps = {
	isOpen: boolean;
	invitation?: IInvitation | null;
	onClose: () => void;
};

export function PendingInviteModal({
	isOpen,
	invitation,
	onClose,
}: PendingInviteModalProps) {
	const { refreshData } = useRepos();

	if (!isOpen || !invitation) return null;

	const handleAction = async (action: "accept" | "decline") => {
		try {
			const res = await fetch(`/api/invitations/${action}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: invitation.token }),
				credentials: "include",
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error);
			}

			toast.success(
				action === "accept"
					? `You joined ${invitation.repositoryName}!`
					: `You declined the invitation to ${invitation.repositoryName}`,
			);

			// Refresh repositories/invitations
			await refreshData();
			onClose();
		} catch (err) {
			console.error(err);
			toast.error(
				(err instanceof Error && err.message) || "Failed to process invitation",
			);
		}
	};

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
				className="fixed mx-2 inset-0 z-50 flex items-center justify-center pointer-events-none"
			>
				<div className="pointer-events-auto w-full max-w-sm rounded-xl bg-white dark:bg-zinc-950/90 border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
					{/* ---- Header ---- */}
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold">Repository Invitation</h3>
						<button
							type="button"
							onClick={onClose}
							className="opacity-70 hover:opacity-100 transition cursor-pointer"
						>
							<X />
						</button>
					</div>

					{/* ---- Body ---- */}
					<p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
						You have been invited to join{" "}
						<span className="font-medium text-gray-900 dark:text-gray-100">{invitation.repositoryName}</span> by{" "}
						<span className="font-medium text-gray-900 dark:text-gray-100">{invitation.invitedBy}</span>
						.
					</p>

					{/* ---- Actions ---- */}
					<div className="flex flex-col md:flex-row w-full gap-4 mt-6">
						<Button
							onClick={() => handleAction("accept")}
							className="flex-1 w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 transition-colors"
						>
							Accept
						</Button>
						<Button
							onClick={() => handleAction("decline")}
							className="flex-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 transition-colors"
						>
							Decline
						</Button>
					</div>
				</div>
			</motion.div>
		</>
	);
}
