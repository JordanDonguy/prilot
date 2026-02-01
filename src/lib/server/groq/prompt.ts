import type { PRLanguage } from "@/types/languages";

export function buildPRPrompt(
	language: PRLanguage,
	compareBranch: string,
) {
	// Map of main PR section headers per language
	const sectionHeaders: Record<
		PRLanguage,
		{ description: string; changes: string; howToTest: string }
	> = {
		English: {
			description: "Description",
			changes: "Changes",
			howToTest: "How to Test",
		},
		French: {
			description: "Résumé",
			changes: "Modifications",
			howToTest: "Comment tester",
		},
		Spanish: {
			description: "Resumen",
			changes: "Cambios",
			howToTest: "Cómo probar",
		},
		German: {
			description: "Zusammenfassung",
			changes: "Änderungen",
			howToTest: "Testanleitung",
		},
		Portuguese: {
			description: "Resumo",
			changes: "Alterações",
			howToTest: "Como testar",
		},
		Italian: {
			description: "Riepilogo",
			changes: "Modifiche",
			howToTest: "Come testare",
		},
	};

	const headers = sectionHeaders[language];

	return `
You are a senior software engineer writing a GitHub Pull Request
for a production codebase.

Compare branch name: ${compareBranch}

The ENTIRE Pull Request MUST be written in ${language}.
This includes the PR TITLE and ALL section headers and content.

All main section headers must be exactly as follows in ${language}:
- Description section: ## ${headers.description}
- Changes section: ## ${headers.changes}
- How to Test section: ## ${headers.howToTest}

Your task is to write a PR based **only on the commit messages below**.
You may NOT add any information that is NOT present in the commit messages.
Do NOT assume or invent filenames, variables, endpoints, or any implementation details.
Do NOT mention commit scopes (e.g., feat(useAuth), fix, chore(deps)).

---

Generate:

1. A concise PR title (max 72 characters, imperative mood)
2. A structured PR description with the following sections:

## ${headers.description}
- 1–2 sentences summarizing the overall goal of the PR **using only information in the commits**

---

## ${headers.changes}
- Split the changes into 1 to 6 numbered sections
- Each section must:
  - Group related commits by intent, not by file or inferred detail
  - Describe **what was done and why**, only using commit message content
- Number the sections from most important to less important
- Do NOT add any specifics that are not in the commits

Example format:

### 1. **<Section title based on commits>**
- Description of changes in this group of commits
- Bulleted explanation summarizing commit intent

### 2. **<Section title based on commits>**
- Description of changes in this group of commits
- Bulleted explanation summarizing commit intent

(continue if relevant)

---

## ${headers.howToTest}
- Suggest testing steps only if they can be **inferred from the commit messages**
- Do NOT assume any file paths, env variables, or APIs not mentioned in the commits
- Use bullet points for clarity

---

### Writing rules
- ONLY use information explicitly present in the commit messages
- Do NOT invent anything (variables, files, API endpoints, environment keys, code behavior)
- Group commits logically, summarize intent clearly
- Avoid filler, boilerplate, or invented details
`;
}
