"use client";

import { ArrowBigLeftDash, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRepository } from "@/app/hooks/useRepository";
import { Button } from "@/components/Button";
import { PREditor } from "@/components/PREditor";
import PREditorSkeleton from "@/components/PREditorSkeleton";
import { BranchSelect, LanguageSelect } from "@/components/Select";
import type { PRLanguage } from "@/types/languages";

export default function PREditorPage() {
	const params = useParams();
	const id = params.id;
	const router = useRouter();

	const { repo, loading } = useRepository(id as string);
	const [prId, setPrId] = useState<string | null>(null);

	const [language, setLanguage] = useState<PRLanguage>("English");

	const [baseBranch, setBaseBranch] = useState("");
	const [compareBranch, setCompareBranch] = useState("");

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const [isGenerating, setIsGenerating] = useState(false);
	const [showEditOrPreview, setShowEditOrPreview] = useState<
		"edit" | "preview"
	>("edit");

	const editorRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (loading) return;
		setBaseBranch(repo.defaultBranch);
		setCompareBranch(repo.branches[0]);
	}, [loading, repo]);

	const handleGenerate = async () => {
		if (!compareBranch) return;

		setIsGenerating(true);
		setTitle("");
		setDescription("");

		try {
			// 1. Fetch commits
			const compareRes = await fetch(
				`/api/repos/${id}/compare-commits/github?base=${baseBranch}&compare=${compareBranch}`,
			);

			if (!compareRes.ok) throw new Error("Failed to fetch commits");

			const { commits }: { commits: string[] } = await compareRes.json();

			if (!commits.length) {
				toast.info(
					"No commit differences found between base and compare branch",
				);
				return;
			}

			// 2. Generate PR via AI
			const aiRes = await fetch("/api/pr/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ commits, language }),
			});

			if (!aiRes.ok) throw new Error("Failed to generate PR with AI");

			const { title: generatedTitle, description: generatedDescription } =
				await aiRes.json();

			// 3. Save/update PR in DB
			let savedPrId = prId;

			if (!prId) {
				// Create new PR
				const createRes = await fetch(`/api/repos/${id}/pull-request/draft`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						prTitle: generatedTitle,
						prBody: generatedDescription,
						baseBranch,
						compareBranch,
						language,
					}),
				});

				if (!createRes.ok) throw new Error("Failed to create PR");

				const data = await createRes.json();
				savedPrId = data.prId;
				setPrId(savedPrId);
			} else {
				// Update existing PR
				const updateRes = await fetch(`/api/repos/${id}/pull-request/${prId}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						prTitle: generatedTitle,
						prBody: generatedDescription,
					}),
				});

				if (!updateRes.ok) throw new Error("Failed to update PR");
			}

			// 4. Update UI
			setTitle(generatedTitle);
			setDescription(generatedDescription);
			setShowEditOrPreview("preview");

			// 5. Scroll to editor
			requestAnimationFrame(() => {
				editorRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			});
		} catch (err) {
			console.error(err);
			toast.error("Failed to generate PR");
		} finally {
			setIsGenerating(false);
		}
	};

	const handleSend = () => {
		// Mock sending PR
		router.push(`/dashboard/repo/${id}`);
		toast.success("Pull request sent! 🚀");
	};

	if (loading) return <PREditorSkeleton />;
	if (!repo) return null;

	return (
		<div className="p-2 md:p-6 space-y-6">
			<section className="grid grid-cols-3 mb-8">
				<div className="col-span-2">
					<h1 className="text-3xl mb-2 text-gray-900 dark:text-white">
						Generate Pull Request
					</h1>
					<p className="text-gray-600 dark:text-gray-400 hidden md:inline">
						Select branches and let AI generate a comprehensive PR description
					</p>
				</div>
				<LanguageSelect value={language} onChange={setLanguage} />
				<p className="text-gray-600 dark:text-gray-400 mt-2 col-span-3 md:hidden">
					Select branches and let AI generate a comprehensive PR description
				</p>
			</section>

			<div className="flex flex-col">
				{/* Configuration */}
				<section>
					<div className="relative grid grid-cols-2 gap-20">
						{/* Branch selectors */}
						<BranchSelect
							label="Base Branch"
							value={baseBranch}
							onChange={setBaseBranch}
							options={repo.branches}
						/>
						<div className="absolute inset-0 w-full h-full flex justify-center items-center pt-8 pointer-events-none">
							<ArrowBigLeftDash size={28} />
						</div>
						<BranchSelect
							label="Compare Branch"
							value={compareBranch}
							onChange={setCompareBranch}
							options={repo.branches}
						/>
					</div>

					<Button
						onClick={handleGenerate}
						disabled={!compareBranch || isGenerating}
						className="h-auto w-56 py-2 my-12 mx-auto bg-gray-900 text-white dark:bg-gray-200 dark:text-black hover:bg-gray-700 hover:dark:bg-gray-300 group disabled:animate-pulse"
					>
						<span className="flex items-center group-hover:scale-110 transition">
							<Sparkles className="w-4 h-4 mr-2" />
							{isGenerating ? "Generating..." : "Generate with AI"}
						</span>
					</Button>
				</section>

				{/* PR Editor */}
				<div ref={editorRef} className="scroll-mt-2">
					<PREditor
						title={title}
						description={description}
						showEditOrPreview={showEditOrPreview}
						setTitle={setTitle}
						setDescription={setDescription}
						setShowEditOrPreview={setShowEditOrPreview}
						onSend={handleSend}
					/>
				</div>
			</div>
		</div>
	);
}
