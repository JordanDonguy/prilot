import { Clock, GitBranch, GitPullRequest, Plus, Users } from "lucide-react";
import Link from "next/link";
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

const mockRepo = {
	id: "1",
	name: "frontend-app",
	provider: "github",
	stars: 245,
	forks: 38,
	openPRs: 3,
	totalCommits: 1234,
};

const mockPRs = [
	{
		id: 1,
		title: "Add user authentication flow",
		status: "sent",
		baseBranch: "main",
		compareBranch: "feature/auth",
		createdAt: "2 hours ago",
	},
	{
		id: 2,
		title: "Update dependencies to latest versions",
		status: "draft",
		baseBranch: "develop",
		compareBranch: "chore/deps-update",
		createdAt: "1 day ago",
	},
	{
		id: 3,
		title: "Fix responsive layout issues",
		status: "sent",
		baseBranch: "main",
		compareBranch: "fix/responsive",
		createdAt: "3 days ago",
	},
];

type RepositoryPageProps = {
	params: {
		id: string;
	};
};

export default async function RepositoryPage({ params }: RepositoryPageProps) {
	const { id } = await params;

	return (
		<div className="p-6 space-y-6">
			{/* Repository Header */}
			<div className="flex flex-col md:flex-row items-start justify-between">
				<div>
					<div className="flex items-center gap-3 mb-2">
						<h1 className="text-3xl text-gray-900 dark:text-white">
							{mockRepo.name}
						</h1>
						<Badge>{mockRepo.provider}</Badge>
					</div>
					<p className="text-gray-600 dark:text-gray-400">
						{mockRepo.stars} stars • {mockRepo.forks} forks •{" "}
						{mockRepo.totalCommits} commits
					</p>
				</div>
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

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<StatCard
					title="PRs Sent With PRilot"
					value={mockRepo.openPRs}
					icon={GitPullRequest}
				/>
				<StatCard title="Draft PRs" value="1" icon={Clock} />
				<StatCard title="Active Branches" value="12" icon={GitBranch} />
				<StatCard title="Contributors" value="8" icon={Users} />
			</div>

			{/* Pull Requests List */}
			<Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-sm">
				<CardHeader>
					<CardTitle>Recent Pull Requests</CardTitle>
					<CardDescription>View and manage your PRs</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{mockPRs.map((pr) => (
							<PRListItem
								key={pr.id}
								href={`/dashboard/repo/${id}/pr/${pr.id}`}
								title={pr.title}
								status={pr.status}
								compareBranch={pr.compareBranch}
								baseBranch={pr.baseBranch}
								createdAt={pr.createdAt}
							/>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
