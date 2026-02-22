import type { ChatCompletion } from "@cerebras/cerebras_cloud_sdk/resources/chat/completions";
import { cerebras } from "@/lib/server/ai/client";
import { prepareFileDiffForAI } from "@/lib/server/github/fileDiffs";
import type { IGitHubFile } from "@/types/commits";
import { TooManyRequestsError } from "../error";

/**
 * Call AI to summarize one file diffs
 * Use smaller model (Llama 3) if patch changes are under ~250 tokens length
 * Else use a bigger model (Llama 4 Scout)
 */
async function summarizeFileDiff(patch: string): Promise<string> {
	const completion = await cerebras.chat.completions.create({
		model:
			patch.length < 2000
				? "llama3.1-8b"
				: "gpt-oss-120b",
		messages: [
			{
				role: "system",
				content:
					"Summarize what changed and why in this file diff (150 tokens max). Write for a non-technical reader. No code specifics (component names, class names, CSS, variables, functions) — only user-facing or architectural impact.",
			},
			{
				role: "user",
				content: `${patch}`,
			},
		],
		max_completion_tokens: 150,
	});

	const content = (completion as ChatCompletion.ChatCompletionResponse).choices[0].message.content;

	return content?.trim() || "";
}

/**
 * Takes an array of GitHub files
 * Call AI API in parallel for every files to summarize changes
 * Merge those summaries into one string
 */
export async function summarizeDiffsForPR(
	files: IGitHubFile[],
): Promise<string> {
	const prepared = files.map(prepareFileDiffForAI);

	try {
		const summaries = await Promise.all(
			prepared.map((f) => summarizeFileDiff(f.patch)),
		);

		return summaries.join("\n");
	} catch {
		throw new TooManyRequestsError(
			"AI models are currently overloaded... Please try again in a few minutes or use fast mode.",
		);
	}
}
