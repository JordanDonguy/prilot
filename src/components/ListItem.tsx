import { GitBranch, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { MemberRoleSelect } from "@/components/Select";

// ------------------------------
// ------ Simple List item ------
// ------------------------------
type DashboardListItemProps = {
	title: string;
	subtitle: string;
	badge?: string;
	className?: string;
};

export function DashboardListItem({
	title,
	subtitle,
	badge,
	className = "",
}: DashboardListItemProps) {
	return (
		<div
			className={`flex items-center justify-between p-3 rounded-lg border
        border-gray-200 dark:border-gray-700/70
        bg-gray-100 dark:bg-zinc-950/90
        ${className}`}
		>
			<div className="flex-1">
				<div className="flex items-center gap-2">
					<p className="text-sm text-gray-900 dark:text-white">
						{title}
					</p>
					{badge && <Badge className="text-xs">{badge}</Badge>}
				</div>

				<p className="text-xs text-gray-500 dark:text-gray-400">
					{subtitle}
				</p>
			</div>
		</div>
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
		<Link
			href={href}
			className="block"
		>
			<DashboardListItem {...props} className="hover:bg-white dark:hover:bg-gray-800 transition-colors" />
		</Link>
	);
}


// -------------------------------
// ------ PR List Item Link ------
// -------------------------------
type PRListItemLinkProps = {
	href: string;
	title: string;
	status: string;
	compareBranch: string;
	baseBranch: string;
	createdAt: string;
};

export function PRListItemLink({
	href,
	title,
	status,
	compareBranch,
	baseBranch,
	createdAt,
}: PRListItemLinkProps) {
	return (
		<Link
			href={href}
			className="block p-4 rounded-lg bg-gray-50 dark:bg-zinc-950/90
        border border-gray-200 dark:border-gray-700/70
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition-colors"
		>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<div className="flex items-center gap-3 mb-2">
						<p className="text-gray-900 dark:text-white">
							{title}
						</p>
						<Badge>{status}</Badge>
					</div>

					<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<GitBranch className="w-4 h-4" />
						<span className="font-mono text-xs">
							{compareBranch}
						</span>
						<span>→</span>
						<span className="font-mono text-xs">
							{baseBranch}
						</span>
					</div>
				</div>

				<span className="text-sm text-gray-500 dark:text-gray-400">
					{createdAt}
				</span>
			</div>
		</Link>
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
        <div className="flex items-start justify-between">
          <span className="w-10 h-10 flex justify-center items-center rounded-full bg-blue-200 dark:bg-blue-900 text-sm font-semibold">
            {member.first_name.slice(0, 1).toUpperCase()}
            {member.last_name.slice(0, 1).toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col h-full">
          <span>
            {member.first_name} {member.last_name}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {member.email}
          </span>
        </div>
      </div>

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
