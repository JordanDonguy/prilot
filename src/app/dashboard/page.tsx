"use client";

import { AlertCircle, CheckCircle, Clock, GitPullRequest } from "lucide-react";
import { useEffect, useState } from "react";
import AnimatedOpacity from "@/components/animations/AnimatedOpacity";
import AnimatedSlide from "@/components/animations/AnimatedSlide";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	StatCard,
} from "@/components/Card";
import {
	DashboardListItem,
	DashboardListItemLink,
} from "@/components/ListItem";
import { useRepos } from "@/contexts/ReposContext";
import firstCharUpperCase from "@/lib/utils/firstCharUpperCase";
import { formatDateTime } from "@/lib/utils/formatDateTime";
import { getPercentageChange } from "@/lib/utils/stats";
import type { IPullRequest } from "@/types/pullRequests";
import AnimatedScale from "@/components/animations/AnimatedScale";

interface IRecentPR extends IPullRequest {
	repoName: string;
	repoId: string;
	provider: string;
	providerPrUrl?: string;
}

interface IRecentPRsResponse {
	recentPRs: IRecentPR[];
	stats: {
		thisWeek: number;
		lastWeek: number;
	};
}

export default function DashboardPage() {
	const { repositories, invitations } = useRepos();
	const [recentPRs, setRecentPRs] = useState<IRecentPR[]>([]);
	const [weeklyStats, setWeeklyStats] = useState<{
		thisWeek: number;
		lastWeek: number;
	} | null>(null);
	const [loading, setLoading] = useState(true);

	// Check for pending invitations
	const pendingInvitations = invitations ?? [];

	// Fetch recent PRs
	useEffect(() => {
		const fetchRecentPRs = async () => {
			try {
				const res = await fetch("/api/pull-requests/recent");
				if (!res.ok) throw new Error("Failed to fetch recent PRs");

				const data: IRecentPRsResponse = await res.json();

				setRecentPRs(data.recentPRs);
				setWeeklyStats(data.stats);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchRecentPRs();
	}, []);

	// Compute top 3 repositories by total PRs count
	const topRepos = [...repositories]
		.sort(
			(a, b) =>
				b.draftPrCount + b.sentPrCount - (a.draftPrCount + a.sentPrCount),
		)
		.slice(0, 3);

	// Compute total sent and draft PRs
	const totalDraftPrs = repositories.reduce(
		(sum, repo) => sum + repo.draftPrCount,
		0,
	);

	const totalSentPrs = repositories.reduce(
		(sum, repo) => sum + repo.sentPrCount,
		0,
	);

	// Compute comment message for progression stats card
	const weeklyComparisonLabel = (() => {
		if (!weeklyStats) return undefined;

		if (weeklyStats.lastWeek === 0 && weeklyStats.thisWeek > 0) {
			return "New activity this week";
		}

		if (weeklyStats.lastWeek === 0 && weeklyStats.thisWeek === 0) {
			return "No activity yet";
		}

		const pct = Math.round(
			getPercentageChange(weeklyStats.thisWeek, weeklyStats.lastWeek),
		);

		return `${pct > 0 ? "+" : ""}${pct}% vs last week`;
	})();

	return (
		<div className="p-6 space-y-6 fade-in-fast">
			<AnimatedSlide x={-20} triggerOnView={false}>
				<h1 className="text-3xl mb-2 text-gray-900 dark:text-white">
					Dashboard
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Overview of your repositories and recent activity
				</p>
			</AnimatedSlide>

			{/* ---- Pending Invitations Warning ---- */}
			{pendingInvitations.length > 0 && (
				<AnimatedScale scale={0.97} triggerOnView={false}>
					<div className="bg-orange-100 dark:bg-yellow-900/15 border border-orange-400/50 dark:border-yellow-800/40 rounded-lg p-4 flex items-start gap-3">
						<AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
						<div>
							<h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
								Pending Invitations
							</h3>
							<p className="text-sm text-amber-800 dark:text-amber-200">
								You have {pendingInvitations.length} pending invitation
								{pendingInvitations.length === 1 ? "" : "s"}. Check your sidebar
								to accept or decline them.
							</p>
						</div>
					</div>
				</AnimatedScale>
			)}

			{/* ---- Stats Cards ---- */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Repositories"
					value={repositories.length}
					icon={GitPullRequest}
					comment="Connected to your accounts"
				/>
				<StatCard
					title="PRs Sent With PRilot"
					value={totalSentPrs}
					icon={Clock}
					comment="Across all repos"
				/>
				<StatCard
					title="Drafts"
					value={totalDraftPrs}
					icon={AlertCircle}
					comment="Pending review"
				/>
				<StatCard
					title="Sent This Week"
					value={weeklyStats?.thisWeek ?? 0}
					icon={CheckCircle}
					comment={weeklyComparisonLabel}
				/>
			</div>

			{/* ---- Recent Activity ---- */}
			<div className="grid gap-6 xl:grid-cols-2">
				{/* ---- Recent PRs ---- */}
				<AnimatedSlide x={20} y={-20} triggerOnView={false}>
					<Card className="bg-white/70 flex flex-col h-full dark:bg-gray-800/25 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg">
						<CardHeader>
							<CardTitle>Recent Pull Requests</CardTitle>
							<CardDescription>Your latest PR activity</CardDescription>
						</CardHeader>
						<CardContent
							className={`flex flex-col space-y-4 h-full ${recentPRs.length === 0 && !loading && "justify-center pt-8"}`}
						>
							{loading ? (
								<AnimatedOpacity>
									{/* -- PRs loading skeleton */}
									<div className="h-18 w-full bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
									<div className="h-18 w-full bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
									<div className="h-18 w-full bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
								</AnimatedOpacity>
							) : recentPRs.length > 0 ? (
								recentPRs.map((pr) => (
									<DashboardListItem
										key={pr.id}
										title={pr.title}
										subtitle={`${firstCharUpperCase(pr.repoName)} • ${formatDateTime(pr.updatedAt)}`}
										badge={pr.provider}
										status={pr.status}
										providerUrl={pr.providerPrUrl}
										repoId={pr.repoId}
										prId={pr.id}
									/>
								))
							) : (
								<p className="text-gray-500 text-lg text-center self-center my-4 md:mt-0 fade-in">
									No recent PRs found
								</p>
							)}
						</CardContent>
					</Card>
				</AnimatedSlide>

				{/* ---- Top repositories ---- */}
				<AnimatedSlide x={-20} y={-20} triggerOnView={false}>
					<Card className="bg-white/70 dark:bg-gray-800/25 h-full backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg">
						<CardHeader>
							<CardTitle>Your Repositories</CardTitle>
							<CardDescription>
								Quick access to your most active repos
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4 pt-4">
							{topRepos.length > 0 ? (
								topRepos.map((repo) => (
									<DashboardListItemLink
										key={repo.id}
										href={`/dashboard/repo/${repo.id}`}
										title={firstCharUpperCase(repo.name)}
										subtitle={`${repo.draftPrCount} drafts • ${repo.sentPrCount} PRs sent`}
										badge={repo.provider}
									/>
								))
							) : (
								<p className="text-gray-500 text-lg text-center self-center my-4 fade-in">
									No recent repository found
								</p>
							)}
						</CardContent>
					</Card>
				</AnimatedSlide>
			</div>
		</div>
	);
}
