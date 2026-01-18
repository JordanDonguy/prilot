import { NextResponse } from "next/server";
import { groq } from "@/lib/server/groq/client";
import { buildPRPrompt } from "@/lib/server/groq/prompt";

export async function POST(req: Request) {
	try {
		// 1. Get commit messages list and PR language
		const { commits, language = "English", compareBranch } = await req.json();

		if (!Array.isArray(commits) || commits.length === 0) {
			return NextResponse.json(
				{ error: "Commits are required" },
				{ status: 400 }
			);
		}

		// 2. Send req to Groq AI
		const completion = await groq.chat.completions.create({
			model: "openai/gpt-oss-120b",
			messages: [
				{
					role: "user",
					content: buildPRPrompt(commits, language, compareBranch),
				},
			],
		});

		// 3. Check returned content
		const content = completion.choices[0].message.content;

		if (!content) {
			throw new Error("Empty AI response");
		}

		const parsed = JSON.parse(content);

		return NextResponse.json(parsed);
	} catch (error) {
		console.error("[PR_GENERATION_ERROR]", error);
		return NextResponse.json(
			{ error: "Failed to generate PR" },
			{ status: 500 }
		);
	}
}
