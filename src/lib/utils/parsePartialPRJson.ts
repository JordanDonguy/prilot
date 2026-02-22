/**
 * Extracts title and description from a partially-streamed JSON string.
 * Handles the known schema: {"title":"...","description":"..."}
 *
 * Used for progressive display during SSE streaming — the authoritative
 * values come from the server's `done` event.
 */
export function parsePartialPRJson(raw: string): {
	title: string;
	description: string;
} {
	// Try full parse first (stream complete)
	try {
		const parsed = JSON.parse(raw);
		return {
			title: parsed.title ?? "",
			description: parsed.description ?? "",
		};
	} catch {
		// Partial JSON — extract what we can
	}

	return {
		title: extractFieldValue(raw, "title"),
		description: extractFieldValue(raw, "description"),
	};
}

/**
 * Extracts the string value for a given field from partial JSON.
 * Handles optional whitespace after colon (e.g. "key": "value" or "key":"value").
 */
function extractFieldValue(raw: string, field: string): string {
	// Find "field" then : then optional whitespace then opening "
	const fieldMarker = `"${field}"`;
	const fieldIdx = raw.indexOf(fieldMarker);
	if (fieldIdx === -1) return "";

	// Scan past the closing quote of the field name, then find : and opening "
	let i = fieldIdx + fieldMarker.length;

	// Skip whitespace
	while (i < raw.length && raw[i] === " ") i++;

	// Expect ':'
	if (i >= raw.length || raw[i] !== ":") return "";
	i++;

	// Skip whitespace
	while (i < raw.length && raw[i] === " ") i++;

	// Expect opening '"'
	if (i >= raw.length || raw[i] !== '"') return "";
	i++;

	// Walk characters, handling escape sequences
	let value = "";
	while (i < raw.length) {
		if (raw[i] === "\\" && i + 1 < raw.length) {
			value += raw[i] + raw[i + 1];
			i += 2;
			continue;
		}
		if (raw[i] === '"') break;
		value += raw[i];
		i++;
	}

	if (!value) return "";

	// Unescape via JSON.parse
	try {
		return JSON.parse(`"${value}"`);
	} catch {
		// Incomplete escape sequence at end — trim it and retry
		const trimmed = value.replace(/\\[^"\\\/bfnrtu]?$/, "");
		try {
			return JSON.parse(`"${trimmed}"`);
		} catch {
			return value
				.replace(/\\n/g, "\n")
				.replace(/\\t/g, "\t")
				.replace(/\\"/g, '"')
				.replace(/\\\\/g, "\\");
		}
	}
}
