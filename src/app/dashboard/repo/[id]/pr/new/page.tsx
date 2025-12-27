"use client";

import { ArrowBigLeftDash, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/Button";
import { PREditor } from "@/components/PREditor";
import { BranchSelect, LanguageSelect } from "@/components/Select";
import { mockPrDescription } from "@/lib/utils/mockPr";

export default function PREditorPage() {
	const params = useParams();
	const id = params.id;
	const router = useRouter();

	const [baseBranch, setBaseBranch] = useState("main");
	const [compareBranch, setCompareBranch] = useState("feature/auth");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [showEditOrPreview, setShowEditOrPreview] = useState<
		"edit" | "preview"
	>("edit");

	const handleGenerate = () => {
		setIsGenerating(true);
		// Simulate AI generation
		setTimeout(() => {
			setTitle(`feat: Add new feature from ${compareBranch}`);
			setDescription(mockPrDescription);
			setIsGenerating(false);
			setShowEditOrPreview("preview");
		}, 2000);
	};

	const handleSend = () => {
		// Mock sending PR
		router.push(`/dashboard/repo/${id}`);
		toast.success("Pull request sent! 🚀");
	};

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
				<LanguageSelect />
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
							options={["main", "develop", "staging"]}
						/>
						<div className="absolute inset-0 w-full h-full flex justify-center items-center pt-8 pointer-events-none">
							<ArrowBigLeftDash size={28} />
						</div>
						<BranchSelect
							label="Compare Branch"
							value={compareBranch}
							onChange={setCompareBranch}
							options={["feature/auth", "fix/responsive", "chore/deps-update"]}
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
	);
}
