/**
 * When a post already has a featured hero image, drop a leading markdown image
 * so the article does not open with two photos stacked back to back.
 */
export function stripLeadingMarkdownImage(content: string): string {
	return content
		.replace(/^\s*!\[[^\]]*]\([^)]+\)\s*/, "")
		.replace(/^\n+/, "")
}

/**
 * Strip WordPress-era guide chrome that still leaks into migrated markdown:
 * glued "In This Guide4 min read" lines, empty TOC headings, and double-numbered
 * outline lists (`1. 1. Section title`).
 */
export function sanitizeArticleContent(content: string): string {
	const lines = content.replace(/\r\n/g, "\n").split("\n")
	const out: string[] = []
	let i = 0

	while (i < lines.length) {
		const line = lines[i] ?? ""
		const trimmed = line.trim()

		if (/^In This Guide\d+\s*min read$/i.test(trimmed)) {
			i += 1
			continue
		}

		if (/^\*\*Estimated reading time:\*\*/i.test(trimmed)) {
			i += 1
			continue
		}

		if (/^Estimated reading time:/i.test(trimmed)) {
			i += 1
			continue
		}

		if (/^##\s+In This Guide\s*$/i.test(trimmed)) {
			i += 1
			while (i < lines.length && !(lines[i] ?? "").trim()) i += 1
			continue
		}

		if (/^\d+\.\s+\d+\\?\.\s+/.test(trimmed)) {
			while (i < lines.length) {
				const next = (lines[i] ?? "").trim()
				if (!next) {
					i += 1
					break
				}
				if (!/^\d+\.\s+\d+\\?\.\s+/.test(next)) break
				i += 1
			}
			continue
		}

		out.push(line)
		i += 1
	}

	return out
		.join("\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim()
}
