import type { MetadataRoute } from "next"

import {
	getSitemapChunk,
	getSitemapChunkCount,
} from "@/lib/sitemap"

export async function generateSitemaps() {
	const count = await getSitemapChunkCount()
	return Array.from({ length: count }, (_, id) => ({ id }))
}

export default async function sitemap(props: {
	id: Promise<string> | string
}): Promise<MetadataRoute.Sitemap> {
	const idValue = await props.id
	const id = Number(idValue)

	if (!Number.isInteger(id) || id < 0) return []

	return getSitemapChunk(id)
}
