import { HelpCircle } from "lucide-react";

type GenerationMode = "fast" | "deep";

interface PRGenerationModeSelectorProps {
	mode: GenerationMode;
	setMode: (mode: GenerationMode) => void;
	onHelpClick?: () => void;
}

export const PRGenerationModeSelector = ({
	mode,
	setMode,
	onHelpClick,
}: PRGenerationModeSelectorProps) => {
	return (
		<div className="w-full flex flex-col md:items-center">
			<div
				className="flex justify-between items-center gap-4 w-full p-2 rounded-lg 
        bg-white dark:bg-zinc-950 border border-gray-200 dark:border-gray-800"
			>
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={() => setMode("fast")}
						className={`
              duration-200
							${
								mode === "fast"
									? "font-bold text-gray-700 dark:text-gray-100"
									: "font-medium text-gray-600 dark:text-gray-400 hover:scale-110 cursor-pointer "
							}
						`}
					>
						Fast
					</button>
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							className="sr-only peer"
							checked={mode === "deep"}
							onChange={(e) => setMode(e.target.checked ? "deep" : "fast")}
						/>
						<div
							className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full 
              peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5
              after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
						/>
					</label>
					<button
						type="button"
						onClick={() => setMode("deep")}
						className={`
              duration-200
							${
								mode === "deep"
									? "font-bold text-gray-700 dark:text-gray-100"
									: "font-medium text-gray-600 dark:text-gray-400 hover:scale-110 cursor-pointer "
							}
						`}
					>
						Deep
					</button>
				</div>

				{onHelpClick && (
					<button
						type="button"
						onClick={onHelpClick}
						className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
						title="Help"
					>
						<HelpCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
					</button>
				)}
			</div>
		</div>
	);
};
