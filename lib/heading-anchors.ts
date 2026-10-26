/** Plain text of a markdown heading line: no emphasis, links, or code ticks. */
export function plainHeadingText(text: string) {
	return text
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/[*_`]/g, "")
		.trim()
}

/** Stable fragment id for a section heading, shared by the body and the guide list. */
export function headingAnchor(text: string) {
	return plainHeadingText(text)
		.toLowerCase()
		.replace(/&/g, " and ")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
}

/** Top-level section headings (# and ##, outside code fences) for an article guide. */
export function extractSectionHeadings(markdown: string) {
	const headings: Array<{ id: string; text: string }> = []
	let inFence = false
	for (const line of markdown.split("\n")) {
		if (/^\s*(```|~~~)/.test(line)) inFence = !inFence
		if (inFence) continue
		const match = line.match(/^#{1,2}\s+(.+?)\s*#*\s*$/)
		if (!match?.[1]) continue
		const text = plainHeadingText(match[1])
		const id = headingAnchor(text)
		if (id) headings.push({ id, text })
	}
	return headings
}
