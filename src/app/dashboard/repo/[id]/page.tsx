"use client";

import {
	ChevronLeft,
	ChevronRight,
	Clock,
	Filter,
	GitBranch,
	GitPullRequest,
	Plus,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	StatCard,
} from "@/components/Card";
import { PRListItem } from "@/components/ListItem";
import { type PRFilter, PRFilterModal } from "@/components/PRFilterModal";
import RepoSkeleton from "@/components/RepoSkeleton";
import { usePullRequests } from "@/hooks/usePullRequest";
import { useRepository } from "@/hooks/useRepository";

export default function RepositoryPage() {
	const params = useParams();
	const id = params.id;

	const { repo, loading } = useRepository(id as string);
	const {
		pullRequests,
		loading: prLoading,
		pagination,
		loadNextPage,
		loadPrevPage,
		deletePR,
	} = usePullRequests({
		repoId: id as string,
		initialPage: 1,
		perPage: 5,
	});

	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filter, setFilter] = useState<PRFilter>("all");

	// Filter PRs by status and sort by date (descending - new ones first)
	const filteredAndSortedPRs = useMemo(() => {
		const filtered =
			filter === "all"
				? pullRequests
				: pullRequests.filter((pr) => pr.status === filter);

		return [...filtered].sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);
	}, [pullRequests, filter]);

	if (loading) return <RepoSkeleton />;
	if (!repo) return null;

	const draftPRs = repo.draftPrCount;
	const sentPRs = repo.sentPrCount;

	return (
		<div className="p-6 flex flex-col gap-6">
			{/* ---- Repository Header ---- */}
			<div className="flex flex-col md:flex-row items-start justify-between">
				<div>
					<div className="flex items-center gap-3 mb-2">
						<h1 className="text-3xl text-gray-900 dark:text-white">
							{repo.name.slice(0, 1).toUpperCase() + repo.name.slice(1)}
						</h1>
						<Badge>{repo.provider}</Badge>
					</div>
					<p className="text-gray-600 dark:text-gray-400">
						{repo.commitsCount} commits on default branch{" "}
						<span className="font-mono">({repo.defaultBranch})</span>
					</p>
				</div>

				{/* ---- Members and Generate a PR buttons ---- */}
				<div className="grid grid-cols-2 md:flex gap-3 mt-4 md:mt-0 w-full md:w-fit">
					<Link href={`/dashboard/repo/${id}/members`} className="w-full">
						<Button className="w-full md:w-28 bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 hover:bg-gray-300 hover:dark:bg-gray-700">
							<Users className="w-4 h-4 mr-2" />
							Members
						</Button>
					</Link>
					<Link href={`/dashboard/repo/${id}/pr/new`} className="w-full">
						<Button className="w-full md:w-30 bg-gray-900 text-white dark:bg-gray-200 dark:text-black hover:bg-gray-700 hover:dark:bg-gray-400 group">
							<Plus className="w-4 h-4 mr-2 group-hover:rotate-90 duration-250" />
							Generate PR
						</Button>
					</Link>
				</div>
			</div>

			{/* ---- Stats Cards ---- */}
			<div className="grid gap-4 md:grid-cols-4">
				<StatCard
					title="PRs Sent With PRilot"
					value={sentPRs}
					icon={GitPullRequest}
				/>
				<StatCard title="Draft PRs" value={draftPRs} icon={Clock} />
				<StatCard
					title="Active Branches"
					value={repo.branches.length}
					icon={GitBranch}
				/>
				<StatCard title="Contributors" value="8" icon={Users} />
			</div>

			{/* ---- Pull Requests List ---- */}
			<Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-sm">
				<CardHeader className="flex justify-between">
					<div>
						<CardTitle>Recent Pull Requests</CardTitle>
						<CardDescription>View and manage your PRs</CardDescription>
					</div>

					{/* ---- Open filter modal button ---- */}
					<Button
						size="sm"
						onClick={() => setIsFilterOpen(true)}
						className="w-fit px-4 flex items-center gap-2 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 shadow-sm hover:bg-gray-200 hover:dark:bg-gray-800 transition-colors"
					>
						<Filter className="w-4 h-4" />
						Filter • {filter.slice(0, 1).toUpperCase() + filter.slice(1)} PRs
					</Button>
				</CardHeader>

				{/* ---- Pull Requests items ---- */}
				<CardContent>
					<div className="space-y-3">
						{prLoading ? (
							<div className="space-y-3 fade-in-fast">
								{/* -- Pull requests loading skeleton -- */}
								<div className="block h-22 p-4 rounded-lg bg-gray-200 dark:bg-zinc-950/90 animate-pulse"></div>
								<div className="block h-22 p-4 rounded-lg bg-gray-200 dark:bg-zinc-950/90 animate-pulse"></div>
								<div className="block h-22 p-4 rounded-lg bg-gray-200 dark:bg-zinc-950/90 animate-pulse"></div>
								<div className="block h-22 p-4 rounded-lg bg-gray-200 dark:bg-zinc-950/90 animate-pulse"></div>
								<div className="block h-22 p-4 rounded-lg bg-gray-200 dark:bg-zinc-950/90 animate-pulse"></div>
							</div>
						) : filteredAndSortedPRs.length > 0 ? (
							filteredAndSortedPRs.map((pr) => (
								<PRListItem
									key={pr.id}
									href={`/dashboard/repo/${id}/pr/edit/${pr.id}`}
									title={pr.title}
									status={pr.status}
									compareBranch={pr.compareBranch}
									baseBranch={pr.baseBranch}
									createdAt={pr.createdAt}
									onDelete={() => deletePR(pr.id)}
								/>
							))
						) : (
							<div className="flex flex-col pl-4 text-lg pt-4 gap-2">
								{/* -- PNo Prs found fallback -- */}
								<span className="text-gray-600 dark:text-gray-400">
									No PRs available yet...
								</span>
								<Link
									className="text-blue-600 dark:text-blue-400 group w-fit"
									href={`/dashboard/repo/${id}/pr/new`}
								>
									👉{" "}
									<span className="group-hover:underline underline-offset-2 pl-1">
										Create one
									</span>
								</Link>
							</div>
						)}
					</div>

					{/* ---- Pagination Controls ---- */}
					{pagination.totalPages > 1 && (
						<div className="flex justify-center gap-2 mt-4">
							<Button
								disabled={pagination.page === 1}
								onClick={loadPrevPage}
								className="hover:bg-gray-200 hover:dark:bg-gray-600 w-fit px-2"
							>
								<ChevronLeft />
							</Button>
							<span className="flex items-center px-2 text-gray-700 dark:text-gray-300">
								Page {pagination.page} / {pagination.totalPages}
							</span>
							<Button
								disabled={pagination.page === pagination.totalPages}
								onClick={loadNextPage}
								className="hover:bg-gray-200 hover:dark:bg-gray-600 w-fit px-2"
							>
								<ChevronRight />
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* ---- PR filter modal ---- */}
			<PRFilterModal
				isOpen={isFilterOpen}
				value={filter}
				onClose={() => setIsFilterOpen(false)}
				onSelect={(value) => {
					setFilter(value);
					setIsFilterOpen(false);
				}}
			/>
		</div>
	);
}
