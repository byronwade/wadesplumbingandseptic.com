import type { MetadataRoute } from "next"

import { buildSitemapEntries } from "@/lib/sitemap"

/**
 * Single sitemap at /sitemap.xml.
 * Inventory is well under the 50k URL limit, so chunked generateSitemaps
 * is unnecessary and would leave /sitemap.xml without a working index
 * (footer and robots.txt both point at the root URL).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	return buildSitemapEntries()
}
