import { ArrowRight, FileCode, GitBranch, Send, Sparkles } from "lucide-react";
import AnimatedOpacity from "@/components/animations/AnimatedOpacity";
import AnimatedSlide from "@/components/animations/AnimatedSlide";
import { Card } from "@/components/Card";

const fileChanges = [
	{ name: "auth.ts", additions: 121, deletions: 32 },
	{ name: "login.tsx", additions: 45, deletions: 18 },
	{ name: "session.ts", additions: 67, deletions: 23 },
	{ name: "oauth.ts", additions: 89, deletions: 12 },
	{ name: "utils.ts", additions: 34, deletions: 8 },
	{ name: "types.ts", additions: 28, deletions: 5 },
	{ name: "config.ts", additions: 15, deletions: 3 },
	{ name: "README.md", additions: 42, deletions: 7 },
];

const summarizerCount = 4;

export default function WorkflowSection() {
	return (
		<section className="py-20 bg-linear-to-b from-white to-slate-100 dark:from-[#13131d] dark:to-[#13131d]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<AnimatedOpacity>
					<h2 className="text-4xl md:text-5xl text-center mb-4 text-gray-900 dark:text-white font-bold">
						AI-Powered PR Generation
					</h2>
					<p className="text-center text-gray-500 dark:text-gray-400 mb-16 max-w-2xl mx-auto text-lg">
						See how PRilot analyzes your code changes and transforms them into a
						structured pull request ready to go.
					</p>
				</AnimatedOpacity>

				<div className="max-w-6xl mx-auto">
					{/* Stage 1: Branch Input */}
					<AnimatedSlide y={20} triggerOnView amount={0.2}>
						<div className="flex justify-center mb-8">
							<Card className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-300 dark:border-blue-700 p-4 shadow-lg">
								<div className="flex items-center gap-3">
									<GitBranch className="w-6 h-6 text-blue-600 dark:text-blue-400" />
									<div>
										<p className="font-semibold text-gray-900 dark:text-white">
											feature/auth-refactor
										</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											Compare branch
										</p>
									</div>
								</div>
							</Card>
						</div>
					</AnimatedSlide>

					{/* Arrow down */}
					<div className="flex justify-center mb-8">
						<ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-500 rotate-90" />
					</div>

					{/* Stage 2: File Changes Grid */}
					<AnimatedSlide y={20} triggerOnView amount={0.2}>
						<div className="mb-8">
							<p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
								Analyzing file changes...
							</p>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
								{fileChanges.map((file) => (
									<Card
										key={file.name}
										className="bg-white/70 dark:bg-gray-800/25 border border-gray-200 dark:border-gray-700 p-3 hover:scale-105 transition-transform shadow-sm"
									>
										<div className="flex items-start gap-2">
											<FileCode className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
											<div className="min-w-0 flex-1">
												<p className="text-xs font-mono text-gray-900 dark:text-white truncate">
													{file.name}
												</p>
												<div className="flex gap-2 text-[10px] mt-1">
													<span className="text-green-600 dark:text-green-400">
														+{file.additions}
													</span>
													<span className="text-red-600 dark:text-red-400">
														-{file.deletions}
													</span>
												</div>
											</div>
										</div>
									</Card>
								))}
							</div>
						</div>
					</AnimatedSlide>

					{/* Vertical lines to summarizers */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative h-32">
						{/* Mobile: 2 groups converging */}
						<svg
							className="md:hidden absolute inset-0 w-full h-full"
							style={{ overflow: "visible" }}
							aria-hidden="true"
						>
							{/* Left group - 4 lines converging to 25% */}
							<line
								x1="7.5%"
								y1="0"
								x2="25%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-purple-400 dark:text-purple-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "0s" }}
							/>
							<line
								x1="17.5%"
								y1="0"
								x2="25%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-purple-400 dark:text-purple-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "0.3s" }}
							/>
							<line
								x1="32.5%"
								y1="0"
								x2="25%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-pink-400 dark:text-pink-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "0.6s" }}
							/>
							<line
								x1="42.5%"
								y1="0"
								x2="25%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-pink-400 dark:text-pink-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "0.9s" }}
							/>
							{/* Right group - 4 lines converging to 75% */}
							<line
								x1="57.5%"
								y1="0"
								x2="75%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-purple-400 dark:text-purple-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "0.2s" }}
							/>
							<line
								x1="67.5%"
								y1="0"
								x2="75%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-purple-400 dark:text-purple-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "0.5s" }}
							/>
							<line
								x1="82.5%"
								y1="0"
								x2="75%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-pink-400 dark:text-pink-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "0.8s" }}
							/>
							<line
								x1="92.5%"
								y1="0"
								x2="75%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-pink-400 dark:text-pink-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "1.1s" }}
							/>
						</svg>

						{/* Desktop: 4 groups converging */}
						<svg
							className="hidden md:block absolute inset-0 w-full h-full"
							style={{ overflow: "visible" }}
							aria-hidden="true"
						>
							{/* 8 lines converging to 4 points (2 per AI model) */}
							<line
								x1="7.5%"
								y1="0"
								x2="12.5%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-purple-400 dark:text-purple-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "0s" }}
							/>
							<line
								x1="17.5%"
								y1="0"
								x2="12.5%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-purple-400 dark:text-purple-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "0.3s" }}
							/>
							<line
								x1="32.5%"
								y1="0"
								x2="37.5%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-pink-400 dark:text-pink-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "0.6s" }}
							/>
							<line
								x1="42.5%"
								y1="0"
								x2="37.5%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-pink-400 dark:text-pink-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "0.9s" }}
							/>
							<line
								x1="57.5%"
								y1="0"
								x2="62.5%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-purple-400 dark:text-purple-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "0.2s" }}
							/>
							<line
								x1="67.5%"
								y1="0"
								x2="62.5%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-purple-400 dark:text-purple-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "0.5s" }}
							/>
							<line
								x1="82.5%"
								y1="0"
								x2="87.5%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-pink-400 dark:text-pink-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "0.8s" }}
							/>
							<line
								x1="92.5%"
								y1="0"
								x2="87.5%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-pink-400 dark:text-pink-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "1.1s" }}
							/>
						</svg>
					</div>

					{/* Stage 3: Multiple Summarizing AI Models (Parallel) */}
					<AnimatedSlide y={20} triggerOnView amount={0.2}>
						<div className="mb-8">
							<p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
								Parallel AI summarization...
							</p>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{Array.from({ length: summarizerCount }, (_, i) => i + 1).map(
									(id) => (
										<div key={`summarizer-${id}`}>
											<Card className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-300 dark:border-purple-700 p-4 shadow-lg">
												<div className="flex flex-col gap-2">
													<div className="flex items-center gap-2">
														<div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0">
															<Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
														</div>
														<p className="text-xs font-semibold text-gray-900 dark:text-white">
															AI summarizing model
														</p>
													</div>
													<p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
														Understands file diffs and summarize them
													</p>
												</div>
											</Card>
										</div>
									),
								)}
							</div>
						</div>
					</AnimatedSlide>

					{/* Converging lines from summarizers to PR Writing AI */}
					<div className="flex justify-center mb-8 relative h-48">
						<svg
							className="absolute inset-0 w-full h-full"
							style={{ overflow: "visible" }}
							aria-hidden="true"
						>
							{/* 4 lines converging to center with gentler angles */}
							<line
								x1="17.5%"
								y1="0"
								x2="50%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-cyan-400 dark:text-cyan-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "0.4s" }}
							/>
							<line
								x1="37.5%"
								y1="0"
								x2="50%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-cyan-400 dark:text-cyan-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "1s" }}
							/>
							<line
								x1="62.5%"
								y1="0"
								x2="50%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-cyan-400 dark:text-cyan-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "0.7s" }}
							/>
							<line
								x1="82.5%"
								y1="0"
								x2="50%"
								y2="100%"
								stroke="currentColor"
								strokeWidth="2"
								className="text-cyan-400 dark:text-cyan-700 animate-pulse"
								strokeDasharray="4 4"
								style={{ animationDelay: "1.3s" }}
							/>
						</svg>
					</div>

					{/* Stage 4: PR Writing AI */}
					<AnimatedSlide y={20} triggerOnView amount={0.2}>
						<div className="flex justify-center mb-8">
							<Card className="bg-linear-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-2 border-cyan-300 dark:border-cyan-700 p-5 shadow-lg max-w-md">
								<div className="flex items-center gap-3 mb-2">
									<div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center shrink-0">
										<Sparkles className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
									</div>
									<div>
										<p className="font-semibold text-gray-900 dark:text-white">
											PR Writing AI Model
										</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											Structured generation
										</p>
									</div>
								</div>
								<div className="ml-13 text-xs text-gray-600 dark:text-gray-400 space-y-1">
									<p>• Generating PR title</p>
									<p>• Grouping changes by impact</p>
									<p>• Writing test instructions</p>
								</div>
							</Card>
						</div>
					</AnimatedSlide>

					{/* Arrow down */}
					<div className="flex justify-center mb-8">
						<ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-500 rotate-90" />
					</div>

					{/* Stage 5: Final Output */}
					<AnimatedSlide y={20} triggerOnView amount={0.2}>
						<div className="flex justify-center">
							<Card className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-400 dark:border-green-600 p-5 shadow-xl max-w-md">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
										<Send className="w-6 h-6 text-green-600 dark:text-green-400" />
									</div>
									<div>
										<p className="font-bold text-lg text-gray-900 dark:text-white">
											PR Sent to GitHub
										</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											Ready for review in one click
										</p>
									</div>
								</div>
								<div className="mt-3 ml-15 text-xs text-gray-600 dark:text-gray-400">
									<p className="font-medium">
										✓ Well structured PR title and description in seconds
									</p>
								</div>
							</Card>
						</div>
					</AnimatedSlide>
				</div>
			</div>
		</section>
	);
}
