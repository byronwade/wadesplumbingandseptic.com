/** Average adult reading speed for practical homeowner guides. */
const WORDS_PER_MINUTE = 200

/**
 * Estimate whole-minute read time from markdown body copy.
 * Strips code fences, images, and link URLs so media chrome does not inflate the count.
 */
export function estimateReadingMinutes(markdown: string): number {
	const text = markdown
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/!\[[^\]]*]\([^)]*\)/g, " ")
		.replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
		.replace(/<[^>]+>/g, " ")
		.replace(/[#>*_`~|]/g, " ")
		.replace(/\s+/g, " ")
		.trim()

	const words = text ? text.split(" ").length : 0
	return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

export function formatReadingTime(minutes: number): string {
	return minutes === 1 ? "1 min read" : `${minutes} min read`
}
