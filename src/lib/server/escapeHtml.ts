import "server-only";

/**
 * Escape a string for safe interpolation into HTML.
 * Covers the five characters that can break out of HTML text/attribute contexts.
 */
export function escapeHtml(str: string): string {
	return str
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}
