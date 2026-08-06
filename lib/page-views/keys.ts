import type { PageViewKind } from "@/lib/page-views/types"

export function pageViewKey(kind: PageViewKind, slug: string) {
	return `${kind}:${slug}`
}

export function parsePageViewKey(key: string): {
	kind: PageViewKind
	slug: string
} | null {
	const split = key.indexOf(":")
	if (split <= 0) return null
	const kind = key.slice(0, split)
	const slug = key.slice(split + 1)
	if ((kind !== "service" && kind !== "tip") || !slug) return null
	return { kind, slug }
}

/** Short stable token for the seen-cookie set (not cryptographic). */
export function pageViewCookieToken(kind: PageViewKind, slug: string) {
	const key = pageViewKey(kind, slug)
	let hash = 2_166_136_261
	for (let i = 0; i < key.length; i += 1) {
		hash ^= key.charCodeAt(i)
		hash = Math.imul(hash, 16_777_619)
	}
	return (hash >>> 0).toString(36)
}
