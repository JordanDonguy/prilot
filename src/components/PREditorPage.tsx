"use client";

import debounce from "lodash.debounce";
import { ArrowBigLeftDash, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/Button";
import { PREditor } from "@/components/PREditor";
import PREditorSkeleton from "@/components/PREditorSkeleton";
import { BranchSelect, LanguageSelect } from "@/components/Select";
import { usePullRequestActions } from "@/hooks/usePullRequestActions";
import { useRepository } from "@/hooks/useRepository";
import type { PRLanguage } from "@/types/languages";

interface PREditorProps {
	repoId: string;
	prId?: string;
}

export default function PREditorPageContent({
	repoId,
	prId: initialPrId,
}: PREditorProps) {
	const router = useRouter();
	const { repo, loading } = useRepository(repoId);
	const { addDraftPR } = usePullRequestActions(repoId);

	const [prId, setPrId] = useState<string | null>(initialPrId ?? null);
	const [prFetchLoading, setPrFetchLoading] = useState(!!initialPrId);

	const [baseBranch, setBaseBranch] = useState("");
	const [compareBranch, setCompareBranch] = useState("");
	const [language, setLanguage] = useState<PRLanguage>("English");

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const [isGenerating, setIsGenerating] = useState(false);
	const [showEditOrPreview, setShowEditOrPreview] = useState<
		"edit" | "preview"
	>("edit");
	const editorRef = useRef<HTMLDivElement | null>(null);

	const startAutoSave = useRef(false); // To start auto saving changes
	const skipNextFetch = useRef(false); // To prevent fetching PR when generating a new one

	// initialize branches
	useEffect(() => {
		if (loading || prId) return;
		setBaseBranch(repo.defaultBranch);
		setCompareBranch(repo.branches[0]);
	}, [loading, repo, prId]);

	// fetch PR if editing
	useEffect(() => {
		const fetchDraftPR = async () => {
			if (!prId) return;

			// Skip fetch if PR was just created
			if (skipNextFetch.current) {
				skipNextFetch.current = false;
				return;
			};

			setPrFetchLoading(true);

			try {
				const res = await fetch(`/api/repos/${repoId}/pull-requests/${prId}`);
				if (!res.ok) throw new Error("Failed to fetch PR");

				const data = await res.json();

				setLanguage(data.language);
				setBaseBranch(data.baseBranch);
				setCompareBranch(data.compareBranch);
				setTitle(data.title);
				setDescription(data.description);
				setShowEditOrPreview("preview");
			} catch (err) {
				console.error(err);
				toast.error("Failed to load draft PR");
			} finally {
				setPrFetchLoading(false);
			}
		};
		fetchDraftPR();
	}, [prId, repoId]);

	// generate/update PR
	const handleGenerate = async () => {
		if (!compareBranch) return;
		setIsGenerating(true);
		setTitle("");
		setDescription("");
		startAutoSave.current = false;

		try {
			const compareRes = await fetch(
				`/api/repos/${repoId}/compare-commits/github?base=${baseBranch}&compare=${compareBranch}`,
			);
			if (!compareRes.ok) throw new Error("Failed to fetch commits");

			const { commits }: { commits: string[] } = await compareRes.json();
			if (!commits.length) {
				toast.info("No commit differences found");
				return;
			}

			const aiRes = await fetch("/api/pr/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ commits, language, compareBranch }),
			});
			if (!aiRes.ok) throw new Error("Failed to generate PR with AI");
			const { title: generatedTitle, description: generatedDescription } =
				await aiRes.json();

			// create or update
			if (!prId) {
				const newPR = await addDraftPR({
					prTitle: generatedTitle,
					prBody: generatedDescription,
					baseBranch,
					compareBranch,
					language,
				});

				if (newPR) {
					skipNextFetch.current = true;
					setPrId(newPR.id);
				}
			} else {
				const updateRes = await fetch(
					`/api/repos/${repoId}/pull-requests/${prId}`,
					{
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							prTitle: generatedTitle,
							prBody: generatedDescription,
						}),
					},
				);
				if (!updateRes.ok) throw new Error("Failed to update PR");
			}

			setTitle(generatedTitle);
			setDescription(generatedDescription);
			setShowEditOrPreview("preview");
			requestAnimationFrame(() =>
				editorRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				}),
			);
		} catch (err) {
			console.error(err);
			toast.error("Failed to generate PR");
		} finally {
			setIsGenerating(false);
		}
	};

	// Debounced save function
	const saveDraft = useMemo(
		() =>
			debounce(async (title: string, description: string) => {
				if (!prId || !startAutoSave.current) return;

				try {
					await fetch(`/api/repos/${repoId}/pull-requests/${prId}`, {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ prTitle: title, prBody: description }),
					});
					console.log("Draft saved");
				} catch (err) {
					console.error("Failed to save draft", err);
				}
			}, 1000),
		[prId, repoId],
	);

	// Watch for changes
	useEffect(() => {
		if (!startAutoSave.current) return;
		saveDraft(title, description);
	}, [title, description, saveDraft]);

	// Cancel auto-save on unmount
	useEffect(() => {
		return () => {
			saveDraft.cancel();
		};
	}, [saveDraft]);

	const handleSend = () => {
		router.push(`/dashboard/repo/${repoId}`);
		toast.success("Pull request sent! 🚀");
	};

	if (loading || prFetchLoading) return <PREditorSkeleton />;
	if (!repo) return null;

	return (
		<div className="p-2 md:p-6 space-y-6 fade-in-fast">
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
						className="h-auto w-56 py-2 my-12 mx-auto bg-gray-900 text-white dark:bg-gray-200 dark:text-black hover:bg-gray-700 hover:dark:bg-gray-300 shadow-lg group disabled:animate-pulse"
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
						setTitle={(v) => {
							startAutoSave.current = true;
							setTitle(v);
						}}
						setDescription={(v) => {
							startAutoSave.current = true;
							setDescription(v);
						}}
						setShowEditOrPreview={setShowEditOrPreview}
						onSend={handleSend}
					/>
				</div>
			</div>
		</div>
	);
}
