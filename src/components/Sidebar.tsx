"use client";

import Link from "next/link";
import {
	ChevronDown,
	ChevronRight,
	Folder,
	Github,
	Gitlab,
	Home,
} from "lucide-react";
import { useState } from "react";

const mockData = {
	githubOwned: [
		{ id: 1, name: "prilot-core", url: "https://github.com/user/prilot-core" },
		{ id: 2, name: "awesome-ui", url: "https://github.com/user/awesome-ui" },
	],
	githubInvited: [
		{ id: 3, name: "team-repo", url: "https://github.com/org/team-repo" },
	],
	gitlabOwned: [
		{
			id: 4,
			name: "prilot-backend",
			url: "https://gitlab.com/user/prilot-backend",
		},
	],
	gitlabInvited: [
		{
			id: 5,
			name: "shared-project",
			url: "https://gitlab.com/org/shared-project",
		},
	],
};

export default function Sidebar() {
	const [showGithub, setShowGithub] = useState(true);
	const [showGitlab, setShowGitlab] = useState(true);

	return (
		<aside className="w-48 lg:w-64 border-r border-gray-400 dark:border-gray-700 p-2 flex flex-col h-screen">
			<h1 className="p-2 mb-2 text-2xl font-bold text-blue-700 dark:text-blue-400">
				PRilot
			</h1>

			<button className="w-full mb-4 pt-2 px-2 rounded-xl hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900 transition-colors">
				<h2 className="flex items-center gap-4 text-lg font-semibold mb-2">
					<Home />
					Dashboard
				</h2>
			</button>

			{/* GitHub Section */}
			<section className="mb-8">
				<button
					onClick={() => setShowGithub(!showGithub)}
					className="flex justify-between items-center w-full pt-2 px-2 rounded-xl hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900 transition-colors"
				>
					<h2 className="flex items-center gap-4 text-lg font-semibold mb-2">
						<Github />
						GitHub
					</h2>
					{showGithub ? (
						<ChevronDown className="mb-2" />
          ) : (
						<ChevronRight className="mb-2" />
					)}
				</button>

				{showGithub && (
					<>
						<div className="mt-2 mb-4 pl-2">
							<h3 className="pl-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
								Owned Repos
							</h3>
							<ul className="space-y-1">
								{mockData.githubOwned.map((repo) => (
									<li key={repo.id}>
										<Link
											href={repo.url}
											target="_blank"
											className="flex gap-4 items-center lg:ml-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-900 transition-colors"
										>
											<Folder size={16} />
											<span className="text-gray-900 dark:text-white text-sm">
												{repo.name}
											</span>
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div className="pl-2">
							<h3 className="pl-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
								Invited Repos
							</h3>
							<ul className="space-y-1">
								{mockData.githubInvited.map((repo) => (
									<li key={repo.id}>
										<Link
											href={repo.url}
											target="_blank"
											className="flex gap-4 items-center lg:ml-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-900 transition-colors"
										>
											<Folder size={16} />
											<span className="text-gray-900 dark:text-white text-sm">
												{repo.name}
											</span>
										</Link>
									</li>
								))}
							</ul>
						</div>
					</>
				)}
			</section>

			{/* GitLab Section */}
			<section>
				<button
					onClick={() => setShowGitlab(!showGitlab)}
					className="flex justify-between items-center w-full pt-2 px-2 rounded-xl hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900 transition-colors"
				>
					<h2 className="flex items-center gap-4 text-lg font-semibold mb-2">
						<Gitlab />
						GitLab
					</h2>
					{showGitlab ? (
						<ChevronDown className="mb-2" />
					) : (
						<ChevronRight className="mb-2" />
					)}
				</button>

				{showGitlab && (
					<>
						<div className="mt-2 mb-4 pl-2">
							<h3 className="pl-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
								Owned Repos
							</h3>
							<ul className="space-y-1">
								{mockData.gitlabOwned.map((repo) => (
									<li key={repo.id}>
										<Link
											href={repo.url}
											target="_blank"
											className="flex gap-4 items-center lg:ml-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-900 transition-colors"
										>
											<Folder size={16} />
											<span className="text-gray-900 dark:text-white text-sm">
												{repo.name}
											</span>
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div className="pl-2">
							<h3 className="pl-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
								Invited Repos
							</h3>
							<ul className="space-y-1">
								{mockData.gitlabInvited.map((repo) => (
									<li key={repo.id}>
										<Link
											href={repo.url}
											target="_blank"
											className="flex gap-4 items-center lg:ml-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-900 transition-colors"
										>
											<Folder size={16} />
											<span className="text-gray-900 dark:text-white text-sm">
												{repo.name}
											</span>
										</Link>
									</li>
								))}
							</ul>
						</div>
					</>
				)}
			</section>
		</aside>
	);
}
