import type { SearchDocument } from "@/lib/search"

let cachedIndex: SearchDocument[] | null = null
let inflight: Promise<SearchDocument[]> | null = null

export function getCachedSearchIndex() {
	return cachedIndex
}

export function prefetchSearchIndex() {
	if (cachedIndex) return Promise.resolve(cachedIndex)
	if (inflight) return inflight

	inflight = fetch("/api/search-index")
		.then(async (response) => {
			if (!response.ok) throw new Error("Could not load search index")
			const data = (await response.json()) as SearchDocument[]
			cachedIndex = Array.isArray(data) ? data : []
			return cachedIndex
		})
		.finally(() => {
			inflight = null
		})

	return inflight
}

export async function loadSearchIndex() {
	try {
		return await prefetchSearchIndex()
	} catch {
		return null
	}
}
