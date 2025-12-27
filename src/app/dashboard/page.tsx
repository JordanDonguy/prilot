import { AlertCircle, CheckCircle, Clock, GitPullRequest } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	StatCard
} from "@/components/Card";
import { DashboardListItem, DashboardListItemLink } from "@/components/ListItem";

const mockRepos = [
	{
		id: 1,
		name: "frontend-app",
		provider: "github",
		openPRs: 3,
		lastActivity: "2 hours ago",
	},
	{
		id: 2,
		name: "api-service",
		provider: "gitlab",
		openPRs: 1,
		lastActivity: "1 day ago",
	},
	{
		id: 3,
		name: "mobile-app",
		provider: "github",
		openPRs: 5,
		lastActivity: "3 hours ago",
	},
];

const recentPRs = [
	{
		id: 1,
		title: "Add user authentication",
		repo: "frontend-app",
		status: "sent",
		time: "2 hours ago",
	},
	{
		id: 2,
		title: "Fix API endpoint bug",
		repo: "api-service",
		status: "draft",
		time: "5 hours ago",
	},
	{
		id: 3,
		title: "Update dependencies",
		repo: "mobile-app",
		status: "sent",
		time: "1 day ago",
	},
];

export default async function DashboardPage() {
	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-3xl mb-2 text-gray-900 dark:text-white">
					Dashboard
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Overview of your repositories and recent activity
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Repositories"
					value="12"
					icon={GitPullRequest}
					comment="Connected to your accounts"
				/>
				<StatCard
					title="PRs Sent With PRilot"
					value="9"
					icon={Clock}
					comment="Accross all repos"
				/>
				<StatCard
					title="Drafts"
					value="3"
					icon={AlertCircle}
					comment="Pending review"
				/>
				<StatCard
					title="Sent This Week"
					value="15"
					icon={CheckCircle}
					comment="+20% from last week"
				/>
			</div>

			{/* Recent Activity */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Recent PRs */}
				<Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-sm">
					<CardHeader>
						<CardTitle>Recent Pull Requests</CardTitle>
						<CardDescription>Your latest PR activity</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{recentPRs.map((pr) => (
							<DashboardListItem
								key={pr.id}
								title={pr.title}
								subtitle={`${pr.repo} • ${pr.time}`}
								badge={pr.status}
							/>
						))}
					</CardContent>
				</Card>

				{/* Repositories */}
				<Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-sm">
					<CardHeader>
						<CardTitle>Your Repositories</CardTitle>
						<CardDescription>
							Quick access to your most active repos
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{mockRepos.map((repo) => (
							<DashboardListItemLink
								key={repo.id}
								href={`/dashboard/repo/${repo.id}`}
								title={repo.name}
								subtitle={`${repo.openPRs} open PRs • ${repo.lastActivity}`}
								badge={repo.provider}
							/>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
