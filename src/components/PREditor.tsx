"use client";

import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AutoResizeTextarea } from "./AutoResizeTextArea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./Card";

type PREditorProps = {
	title: string;
	description: string;
	showEditOrPreview: "edit" | "preview";
	setTitle: (val: string) => void;
	setDescription: (val: string) => void;
	setShowEditOrPreview: (val: "edit" | "preview") => void;
	onSend: () => void;
};

export function PREditor({
	title,
	description,
	showEditOrPreview,
	setTitle,
	setDescription,
	setShowEditOrPreview,
	onSend,
}: PREditorProps) {
	return (
		<Card className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-100 dark:border-gray-800 shadow-sm">
			<CardHeader>
				<CardTitle className="text-xl">Pull Request Details</CardTitle>
				<CardDescription className="text-lg">
					Edit title and description
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Title */}
				<div className="flex flex-col gap-2">
					<label htmlFor="pr-title" className="text-lg">
						Title
					</label>
					<input
						id="pr-title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Brief description of changes"
						className="rounded-md w-1/2 py-2 px-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-950 focus:outline-none"
					/>
				</div>

				{/* Description with Edit/Preview toggle */}
				<div className="flex flex-col gap-4">
					<label htmlFor="description" className="text-lg">
						Description
					</label>
					<div className="w-full rounded-xl shadow-sm">
						<div className="grid w-full grid-cols-2 border-t border-x border-gray-200 dark:border-gray-800 rounded-t-lg">
							<button
								type="button"
								onClick={() => setShowEditOrPreview("edit")}
								className={`py-2 border-r border-gray-300 dark:border-gray-800 rounded-tl-lg hover:bg-gray-300 hover:dark:bg-gray-700 hover:cursor-pointer
								${showEditOrPreview === "edit" ? "bg-gray-200/80 dark:bg-gray-800" : "dark:bg-zinc-950/30"}`}
							>
								Edit
							</button>
							<button
								type="button"
								onClick={() => setShowEditOrPreview("preview")}
								className={`rounded-tr-lg hover:bg-gray-300 hover:dark:bg-gray-700 hover:cursor-pointer
								${showEditOrPreview === "preview" ? "bg-gray-200/80 dark:bg-gray-800" : "dark:bg-zinc-950/30"}`}
							>
								Preview
							</button>
						</div>

						{showEditOrPreview === "edit" ? (
							<AutoResizeTextarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Detailed description in Markdown..."
								className="w-full block min-h-75 rounded-b-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-950 p-4 resize-none focus:outline-none"
							/>
						) : (
							<div className="min-h-75 markdown p-4 rounded-b-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-950">
								<ReactMarkdown>{description}</ReactMarkdown>
							</div>
						)}
					</div>
				</div>

				{/* Send button */}
				<button
					type="button"
					onClick={onSend}
					disabled={!title || !description}
					title={
						!title || !description
							? "Please enter title and description to send PR"
							: ""
					}
					className={`w-56 h-10 my-8 mx-auto flex justify-center items-center rounded-lg
            shadow-sm bg-gray-100 dark:bg-zinc-950/60 border border-gray-300 dark:border-gray-800
            ${!title || !description ? "cursor-not-allowed opacity-60" : "hover:bg-gray-200 hover:dark:bg-gray-800 hover:cursor-pointer"}
          `}
				>
					<Send className="w-4 h-4 mr-2" />
					Send Pull Request
				</button>
			</CardContent>
		</Card>
	);
}
