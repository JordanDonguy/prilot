"use client";

import { ArrowBigLeftDash, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { PREditor } from "@/components/PREditor";
import PREditorSkeleton from "@/components/PREditorSkeleton";
import { BranchSelect, LanguageSelect } from "@/components/Select";
import { useAutoSavePR } from "@/hooks/useAutoSavePR";
import { useFetchPR } from "@/hooks/useFetchPR";
import { useGeneratePR } from "@/hooks/useGeneratePR";
import { useRepository } from "@/hooks/useRepository";
import { useSendPR } from "@/hooks/useSendPR";
import type { PRLanguage } from "@/types/languages";
import AnimatedSlide from "./animations/AnimatedSlide";

interface PREditorProps {
	repoId: string;
	prId?: string;
}

export default function PREditorPageContent({
	repoId,
	prId: initialPrId,
}: PREditorProps) {
	// ----- State -----
	const [prId, setPrId] = useState<string | null>(initialPrId ?? null);
	const [baseBranch, setBaseBranch] = useState("");
	const [compareBranch, setCompareBranch] = useState("");
	const [language, setLanguage] = useState<PRLanguage>("English");
	const [title, setTitle] = useState<string | undefined>();
	const [description, setDescription] = useState<string | undefined>();
	const [showEditOrPreview, setShowEditOrPreview] = useState<
		"edit" | "preview"
	>("edit");

	const startAutoSave = useRef(false); // To start auto saving PR in db when editing manually
	const skipNextFetch = useRef(false); // To prevent fetching PR after generating one
	const editorRef = useRef<HTMLDivElement | null>(null);

	// ----- Hooks -----
	const { repo, loading } = useRepository(repoId);

	const { pullRequest, loading: prFetchLoading } = useFetchPR({
		repoId,
		prId,
		skipNextFetch,
	});

	const { isGenerating, generatePR } = useGeneratePR({
		repoId,
		prId,
		baseBranch,
		compareBranch,
		language,
		setPrId,
	});

	const { isSendingPr, providerPrUrl, sendPR } = useSendPR(repoId, prId);

	useAutoSavePR({ prId, repoId, title, description, startAutoSave });

	// ----- Functions -----
	const handleGenerate = useCallback(async () => {
		startAutoSave.current = false; // suspend auto save
		skipNextFetch.current = true; // prevent fetching PR after prId is modified

		const { success, generatedTitle, generatedDescription } =
			await generatePR();

		if (success) {
			setTitle(generatedTitle);
			setDescription(generatedDescription);
			setShowEditOrPreview("preview");

			// Scroll to pull requests editor
			editorRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}

		startAutoSave.current = true; // restore auto save
	}, [generatePR]);

	// ----- Effects -----
	// Set default and compare branches
	useEffect(() => {
		if (!repo) return;
		setBaseBranch(repo.defaultBranch);
		setCompareBranch(
			repo.branches.length > 1
				? repo.branches[0] !== repo.defaultBranch
					? repo.branches[0]
					: repo.branches[1]
				: repo.branches[0],
		);
	}, [repo]);

	// Set PR infos if editing a draft
	useEffect(() => {
		if (!pullRequest) return;

		// Set PR infos in local state
		setPrId(pullRequest.id);
		setTitle(pullRequest.title);
		setDescription(pullRequest.description);
		setBaseBranch(pullRequest.baseBranch);
		setCompareBranch(pullRequest.compareBranch);
		setLanguage(pullRequest.language);
		setShowEditOrPreview("preview");
	}, [pullRequest]);

	// ----- JSX fallbacks ------
	// Loading fallback
	if (loading || prFetchLoading) return <PREditorSkeleton />;

	// Return null if no repo (redirected to dashboard in hook already if no repo found)
	if (!repo) return null;

	// After a pull-request is sent, show link to provider PR
	if (providerPrUrl)
		return (
			<div className="flex flex-col">
				<h1 className="p-2 md:p-6 text-3xl mb-2 text-gray-900 dark:text-white">
					Generate Pull Request
				</h1>
				<AnimatedSlide
					y={40}
					triggerOnView={false}
					className="my-8 lg:my-16 flex flex-col justify-center text-start w-fit mx-auto text-xl p-4 rounded-xl border bg-white/70 dark:bg-gray-800/25 border-gray-300 dark:border-gray-700 shadow-lg"
				>
					<span className="text-2xl mb-4">
						Your Pull-Request has been successfully sent! 🚀
					</span>
					<span className="text-gray-800 dark:text-gray-200 mb-2">
						You can review it and merge it here:
					</span>
					<div className="flex gap-2">
						👉
						<Link
							href={providerPrUrl}
							className="text-blue-600 dark:text-blue-500 hover:underline underline-offset-2"
						>
							{providerPrUrl}
						</Link>
					</div>
				</AnimatedSlide>
			</div>
		);

	// ----- JSX ------
	return (
		<div className="p-2 md:p-6 space-y-6 fade-in-fast">
			<section className="grid grid-cols-3 mb-8">
				<AnimatedSlide x={-20} triggerOnView={false} className="col-span-2">
					<h1 className="text-3xl mb-2 text-gray-900 dark:text-white">
						Generate Pull Request
					</h1>
					<p className="text-gray-600 dark:text-gray-400 hidden md:inline">
						Select branches and let AI generate a comprehensive PR description
					</p>
				</AnimatedSlide>
				<AnimatedSlide x={20} triggerOnView={false}>
					<LanguageSelect value={language} onChange={setLanguage} />
				</AnimatedSlide>
				<AnimatedSlide x={-20} triggerOnView={false}>
					<p className="text-gray-600 dark:text-gray-400 mt-2 col-span-3 md:hidden">
						Select branches and let AI generate a comprehensive PR description
					</p>
				</AnimatedSlide>
			</section>

			<div className="flex flex-col">
				{/* Configuration */}
				<section>
					<div className="relative grid grid-cols-2 gap-20">
						{/* Branch selectors */}
						<AnimatedSlide x={-20} triggerOnView={false}>
							<BranchSelect
								label="Base Branch"
								value={baseBranch}
								onChange={setBaseBranch}
								options={repo.branches}
							/>
						</AnimatedSlide>
						<div className="absolute inset-0 w-full h-full flex justify-center items-center pt-8 pointer-events-none">
							<ArrowBigLeftDash size={28} />
						</div>
						<AnimatedSlide x={20} triggerOnView={false}>
							<BranchSelect
								label="Compare Branch"
								value={compareBranch}
								onChange={setCompareBranch}
								options={repo.branches}
							/>
						</AnimatedSlide>
					</div>

					<AnimatedSlide y={20} triggerOnView={false}>
						<Button
							onClick={handleGenerate}
							disabled={!compareBranch || isGenerating || isSendingPr}
							className="h-auto w-56 py-2 my-12 mx-auto bg-gray-900 text-white dark:bg-gray-200 dark:text-black hover:bg-gray-700 hover:dark:bg-gray-300 shadow-lg group disabled:animate-pulse"
						>
							<span className="flex items-center group-hover:scale-110 transition">
								<Sparkles className="w-4 h-4 mr-2" />
								{isGenerating ? "Generating..." : "Generate with AI"}
							</span>
						</Button>
					</AnimatedSlide>
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
						onSend={sendPR}
						isSendingPr={isSendingPr}
					/>
				</div>
			</div>
		</div>
	);
}
