import { z } from "zod";

// Pull Request database item creation schema
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

	language: z
		.enum(["English", "French", "Spanish", "German", "Portuguese", "Italian"])
		.default("English"),
});

// Each commit should be a string (commit message)
export const commitSchema = z.string().min(1, "Commit message cannot be empty");

// AI PR generation request body schema
export const aiPrRequestSchema = z.object({
	repoId: z.string().uuid("Invalid repository ID"),
	commits: z.array(commitSchema).min(1, "At least one commit is required"),
	compareBranch: z
		.string()
		.min(1, "Compare branch is required")
		.regex(/^[\w./-]+$/, "Invalid branch name"),
	language: z
		.enum(["English", "French", "Spanish", "German", "Portuguese", "Italian"])
		.default("English"),
	mode: z.enum(["fast", "deep"]).default("fast"),
});
