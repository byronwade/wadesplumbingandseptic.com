"use client"

import {
	isSearchIndexPayload,
	type SearchIndexPayload,
} from "@/lib/search"

let cachedIndex: SearchIndexPayload | null = null
let inflight: Promise<SearchIndexPayload> | null = null

async function fetchSearchIndex(): Promise<SearchIndexPayload> {
	const response = await fetch("/api/search-index")
	if (!response.ok) {
		throw new Error("Could not load search index")
	}

	const data: unknown = await response.json()

	if (isSearchIndexPayload(data)) {
		return data
	}

	// Backward-compatible: older array-only payloads
	if (Array.isArray(data)) {
		const { buildInvertedIndex } = await import("@/lib/search")
		return {
			documents: data,
			inverted: buildInvertedIndex(data),
		}
	}

	throw new Error("Unexpected search index shape")
}

/** Warm the search index in the background (idle / hover). */
export function prefetchSearchIndex() {
	if (cachedIndex || inflight) return inflight

	inflight = fetchSearchIndex()
		.then((payload) => {
			cachedIndex = payload
			return payload
		})
		.finally(() => {
			inflight = null
		})

	return inflight
}

export function getCachedSearchIndex() {
	return cachedIndex
}

export async function loadSearchIndex() {
	if (cachedIndex) return cachedIndex
	if (inflight) return inflight

	const payload = await fetchSearchIndex()
	cachedIndex = payload
	return payload
}
