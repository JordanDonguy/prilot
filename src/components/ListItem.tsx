"use client";

import { Edit, GitPullRequest, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { MemberRoleSelect } from "@/components/Select";
import { formatDateTime } from "@/lib/utils/formatDateTime";
import AnimatedSlide from "./animations/AnimatedSlide";

// ------------------------------
// ------ Simple List item ------
// ------------------------------
type DashboardListItemProps = {
	title: string;
	subtitle: string;
	badge?: string;
	className?: string;
	status?: string;
	providerUrl?: string;
	repoId?: string;
	prId?: string;
};

export function DashboardListItem({
	title,
	subtitle,
	badge,
	className = "",
	status,
	providerUrl,
	repoId,
	prId,
}: DashboardListItemProps) {
	return (
		<AnimatedSlide
			y={20}
			triggerOnView={false}
			className={`flex items-center justify-between gap-6 h-18 p-3 rounded-lg
        border border-gray-200 dark:border-gray-700/70
        bg-gray-100 dark:bg-zinc-950/90
        ${className}`}
		>
			<div className="flex flex-col justify-between h-full w-0 flex-1">
				{/* -------- Title and badge -------- */}
				<div className="flex items-center gap-2">
					<p className="text-sm text-gray-900 dark:text-white truncate lg:max-w-xs">
						{title}
					</p>
					{badge && <Badge className="text-xs">{badge}</Badge>}
				</div>

				{/* -------- Subtitle -------- */}
				<p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
			</div>

			{/* -------- Status and action link -------- */}
			<div className="flex flex-col justify-between items-end h-full">
				{status && (
					<span className="flex items-center text-sm text-gray-700 dark:text-gray-400">
						{status.slice(0, 1).toUpperCase() + status.slice(1)}
						{status === "draft" ? (
							<Edit size={16} className="inline-block ml-1" />
						) : (
							<Send size={16} className="inline-block ml-1 mt-0.5" />
						)}
					</span>
				)}
				{status === "draft" && (
					<Link
						href={`/dashboard/repo/${repoId}/pr/edit/${prId}`}
						className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline self-end"
					>
						Edit
					</Link>
				)}
				{status === "sent" && (
					<Link
						href={providerUrl ?? "https://github.com"}
						target="blank"
						className="flex gap-2 items-center text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline self-end"
					>
						View on {providerUrl?.includes("gitlab") ? "GitLab" : "GitHub"}
					</Link>
				)}
			</div>
		</AnimatedSlide>
	);
}

// ------------------------------
// ---- Link wrapper version ----
// ------------------------------
type DashboardListItemLinkProps = DashboardListItemProps & {
	href: string;
};

export function DashboardListItemLink({
	href,
	...props
}: DashboardListItemLinkProps) {
	return (
		<Link href={href} className="block">
			<DashboardListItem
				{...props}
				className="hover:bg-white dark:hover:bg-gray-800 transition-colors"
			/>
		</Link>
	);
}

// ------------------------------
// -------- PR List Item --------
// ------------------------------
type PRListItemProps = {
	href: string;
	title: string;
	status: string;
	compareBranch: string;
	baseBranch: string;
	updatedAt: string;
	onDelete: () => void;
	provider: string;
};

export function PRListItem({
	href,
	title,
	status,
	compareBranch,
	baseBranch,
	updatedAt,
	onDelete,
	provider,
}: PRListItemProps) {
	return (
		<AnimatedSlide
			y={20}
			triggerOnView={false}
			className="flex flex-col lg:h-22 p-4 rounded-lg bg-gray-50 dark:bg-zinc-950/90
        border border-gray-200 dark:border-gray-700/70"
		>
			<div className="flex flex-col lg:flex-row items-start justify-between h-full">
				<div className="h-full flex flex-col justify-between w-full lg:w-fit">
					{/* -------- Title and badge -------- */}
					<div className="w-full flex justify-between gap-3 mb-2">
						<p className="text-gray-900 dark:text-white">{title}</p>
						<Badge className="h-fit">{status}</Badge>
					</div>

					{/* -------- Branches -------- */}
					<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<GitPullRequest className="w-4 h-4" />
						<span className="font-mono text-xs truncate">{compareBranch}</span>
						<span>→</span>
						<span className="font-mono text-xs truncate">{baseBranch}</span>
					</div>
				</div>

				{/* -------- Created at and action link -------- */}
				<div className="flex lg:flex-col justify-between items-end h-full w-full lg:w-fit">
					{/* ---- Date and time (desktop) ---- */}
					<span className="text-sm text-gray-500 dark:text-gray-400 lg:block">
						{formatDateTime(updatedAt)}
					</span>
					<div className="flex items-center justify-between gap-4">
						{/* Delete PR draft button */}
						{status === "draft" && (
							<button
								type="button"
								onClick={onDelete}
								className="text-red-500 font-medium text-base cursor-pointer underline-offset-2 hover:underline"
							>
								Delete
							</button>
						)}
						{/* Edit / View PR button */}
						<Link
							href={href}
							target={status === "sent" ? "_blank" : "_self"}
							className="block text-blue-600 dark:text-blue-400 font-medium underline-offset-2 hover:underline"
						>
							{status === "draft" ? "Edit" : `View on ${provider}`}
						</Link>
					</div>
				</div>
			</div>
		</AnimatedSlide>
	);
}

// ------------------------------
// ------ Member List Item ------
// ------------------------------
export type Member = {
	email: string;
	first_name: string;
	last_name: string;
	role: string;
};

type MemberListItemProps = {
	member: Member;
	updateMemberRole: (email: string, role: string) => void;
	onDelete: (member: Member) => void;
	className?: string;
};

export function MemberListItem({
	member,
	updateMemberRole,
	onDelete,
	className = "",
}: MemberListItemProps) {
	return (
		<article
			className={`flex justify-between p-4 rounded-lg bg-gray-50 dark:bg-zinc-950/90 border border-gray-200 dark:border-gray-700/70 ${className}`}
		>
			<div className="flex gap-4 items-center">
				{/* -------- Avatar -------- */}
				<div className="flex items-start justify-between">
					<span className="w-10 h-10 flex justify-center items-center rounded-full bg-blue-200 dark:bg-blue-900 text-sm font-semibold">
						{member.first_name.slice(0, 1).toUpperCase()}
						{member.last_name.slice(0, 1).toUpperCase()}
					</span>
				</div>

				{/* -------- Name and email -------- */}
				<div className="flex flex-col h-full">
					<span>
						{member.first_name} {member.last_name}
					</span>
					<span className="text-sm text-gray-600 dark:text-gray-400">
						{member.email}
					</span>
				</div>
			</div>

			{/* -------- Role select and delete button -------- */}
			<div className="flex gap-4 items-center">
				<MemberRoleSelect
					value={member.role}
					onChange={(value) => updateMemberRole(member.email, value)}
				/>
				<button
					type="button"
					onClick={() => onDelete(member)}
					className="hover:scale-105 hover:cursor-pointer transition-transform"
				>
					<Trash2 size={20} className="text-red-500" />
				</button>
			</div>
		</article>
	);
}
