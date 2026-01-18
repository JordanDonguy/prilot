import type { PRLanguage } from "@/types/languages";

export function buildPRPrompt(commits: string[], language: PRLanguage, compareBranch: string) {
	return `
You are a senior software engineer writing a GitHub Pull Request.
Compare branch name is: ${compareBranch}.

The ENTIRE Pull Request MUST be written in ${language}.
This includes the PR TITLE and ALL section headers and content.

Generate:
1. A concise PR title
2. A well-structured PR description using this exact markdown template:

## Summary
<1–2 sentences>

## Changes
- Bullet points

## Why
<optional, short>

## How to Test
- Steps

## Notes
- Optional notes

Rules:
- Title: max 72 characters
- Translate section headers in ${language}
- Use imperative mood ("Add", "Fix", "Improve")
- Be clear, concise, and professional
- Do NOT repeat commit messages verbatim
- Infer intent and group related commits

Commits:
${commits.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Return JSON only:
{
  "title": string,
  "description": string
}
`;
}
