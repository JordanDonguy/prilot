import { Code, GitBranch, Zap } from "lucide-react";
import { CustomLink } from "@/components/CustomLink";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function LandingPage() {
	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative overflow-hidden bg-linear-to-b from-blue-100 to-white dark:from-zinc-950 dark:to-gray-900">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
					<div className="text-center">
						<h1 className="font-semibold text-5xl md:text-6xl mb-6 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
							PRilot
						</h1>
						<p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300">
							AI-powered pull request generation for your repositories
						</p>
						<p className="text-lg mb-12 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
							Compare branches, generate comprehensive PR descriptions, and
							streamline your workflow with intelligent AI assistance.
						</p>
						<div className="flex gap-4 justify-center">
							<CustomLink
								href="/login"
								className="bg-gray-200/40 dark:bg-gray-800/40 border border-gray-300 dark:border-gray-700 hover:bg-gray-300/50 hover:dark:bg-gray-600/70"
							>
								Login
							</CustomLink>
							<CustomLink
								href="/signup"
								className="text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
							>
								Sign Up
							</CustomLink>
						</div>
						<ThemeSwitcher className="mt-8 mx-auto bg-gray-300 dark:bg-cyan-700 hover:bg-gray-400/70 hover:dark:bg-cyan-500/70" />
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 bg-white dark:bg-gray-900">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl text-center mb-16 text-gray-900 dark:text-white">
						Why PRilot?
					</h2>
					<div className="grid md:grid-cols-3 gap-12">
						<div className="text-center">
							<div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
								<Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
							</div>
							<h3 className="text-xl mb-4 text-gray-900 dark:text-white">
								AI-Powered Generation
							</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Automatically generate comprehensive PR descriptions by
								analyzing code changes between branches.
							</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
								<GitBranch className="w-8 h-8 text-purple-600 dark:text-purple-400" />
							</div>
							<h3 className="text-xl mb-4 text-gray-900 dark:text-white">
								Multi-Platform Support
							</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Works seamlessly with both GitHub and GitLab repositories.
							</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
								<Code className="w-8 h-8 text-green-600 dark:text-green-400" />
							</div>
							<h3 className="text-xl mb-4 text-gray-900 dark:text-white">
								Smart Templates
							</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Choose from various templates or create custom ones tailored to
								your workflow.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section className="py-20 bg-gray-100 dark:bg-gray-950">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl text-center mb-16 text-gray-900 dark:text-white">
						How It Works
					</h2>
					<div className="grid md:grid-cols-4 gap-8">
						{[
							{
								num: "1",
								title: "Connect",
								desc: "Link your GitHub or GitLab account",
							},
							{
								num: "2",
								title: "Select",
								desc: "Choose repository and branches to compare",
							},
							{
								num: "3",
								title: "Generate",
								desc: "AI analyzes changes and creates PR description",
							},
							{
								num: "4",
								title: "Review & Send",
								desc: "Edit if needed and submit your PR",
							},
						].map((step) => (
							<div key={step.num} className="text-center">
								<div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white">
									{step.num}
								</div>
								<h3 className="text-lg mb-2 text-gray-900 dark:text-white">
									{step.title}
								</h3>
								<p className="text-gray-600 dark:text-gray-400 text-sm">
									{step.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-linear-to-r from-cyan-400 to-blue-500 dark:from-cyan-800 dark:to-blue-800">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl md:text-4xl mb-6 text-white">
						Ready to streamline your PR workflow?
					</h2>
					<p className="text-xl mb-8 text-blue-100">
						Join developers who are saving hours every week with PRilot.
					</p>

					<CustomLink
						href="/signup"
						className="w-40 bg-white text-blue-600 hover:bg-gray-100"
					>
						Get Started Free
					</CustomLink>
				</div>
			</section>
		</div>
	);
}
