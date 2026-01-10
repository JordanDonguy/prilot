import { z } from "zod";

export const pullRequestSchema = z.object({
	prTitle: z
		.string()
		.min(3, "Title is too short")
		.max(256, "Title is too long")
		.trim(),

	prBody: z
		.string()
		.min(3, "PR body is too short")
		.max(20_000, "PR body is too long"),

	baseBranch: z
		.string()
		.min(1, "Base branch is required")
		.regex(/^[\w./-]+$/, "Invalid branch name"),

	compareBranch: z
		.string()
		.min(1, "Head branch is required")
		.regex(/^[\w./-]+$/, "Invalid branch name"),

	language: z.string().min(1, "Language is required"),
});
