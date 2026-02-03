import { prepareFileDiffForAI } from "@/lib/server/github/fileDiffs";
import { groq } from "@/lib/server/groq/client";
import type { IGitHubFile } from "@/types/commits";
import { TooManyRequestsError } from "../error";

/**
 * Call AI to summarize one file diffs
 * Use smaller model (Llama 3) if patch changes are under ~250 tokens length
 * Else use a bigger model (Llama 4 Scout)
 */
async function summarizeFileDiff(patch: string): Promise<string> {
	const completion = await groq.chat.completions.create({
		model:
			patch.length < 1000
				? "llama-3.1-8b-instant"
				: "meta-llama/llama-4-scout-17b-16e-instruct",
		messages: [
			{
				role: "system",
				content:
					"You are a senior software enginner generating a detailled summary of code changes from file diffs",
			},
			{
				role: "user",
				content: `${patch}`,
			},
		],
		max_completion_tokens: 250,
	});

	const content = completion.choices[0].message.content;

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
