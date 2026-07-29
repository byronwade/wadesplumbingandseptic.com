import type { MetadataRoute } from "next"

import { getAllRoutes, taxonomySlug } from "@/lib/content"
import { siteConfig } from "@/lib/site"

const CHUNK_SIZE = 100

type SitemapEntry = MetadataRoute.Sitemap[number]

function entry(
	route: string,
	lastModified?: string,
	priority = 0.7,
): SitemapEntry {
	return {
		url: `${siteConfig.url}${route}`,
		lastModified: lastModified ?? "2026-07-29",
		changeFrequency: route === "" ? "weekly" : "monthly",
		priority: route === "" ? 1 : priority,
	}
}

async function buildSitemapEntries(): Promise<SitemapEntry[]> {
	"use cache"

	const { pages, services, posts } = await getAllRoutes()

	const fixed = [
		entry("", undefined, 1),
		entry("/services", undefined, 0.9),
		entry("/expert-tips", undefined, 0.9),
	]

	const pageEntries = pages
		.filter((page) => !page.noindex)
		.map((page) => entry(`/${page.slug}`, page.updated ?? page.date, 0.75))

	const serviceEntries = services.map((service) =>
		entry(
			`/service-offerings/${service.slug}`,
			service.updated ?? service.date,
			0.85,
		),
	)

	const postEntries = posts.map((post) =>
		entry(`/${post.slug}`, post.updated ?? post.date, 0.7),
	)

	const categories = [
		...new Set(
			posts.map((post) => taxonomySlug(post.category ?? "Expert Tips")),
		),
	].map((slug) => entry(`/category/${slug}`, undefined, 0.6))

	const tags = [
		...new Set(
			posts.flatMap((post) => post.tags?.map((tag) => taxonomySlug(tag)) ?? []),
		),
	].map((slug) => entry(`/tag/${slug}`, undefined, 0.5))

	const serviceCategories = [
		"/service-category/plumbing",
		"/service-category/residential-plumbing",
		"/service-category/commercial",
		"/service-category/commercial-plumbing",
		"/service-category/septic",
		"/service-category/septic-services",
		"/service-category/emergency-services",
		"/service-category/specialty-services",
	].map((route) => entry(route, undefined, 0.8))

	return [
		...fixed,
		...pageEntries,
		...serviceEntries,
		...postEntries,
		...categories,
		...tags,
		...serviceCategories,
	]
}

export async function generateSitemaps() {
	const entries = await buildSitemapEntries()
	const count = Math.max(1, Math.ceil(entries.length / CHUNK_SIZE))
	return Array.from({ length: count }, (_, id) => ({ id }))
}

export default async function sitemap(props: {
	id: Promise<string> | string
}): Promise<MetadataRoute.Sitemap> {
	const idValue = await props.id
	const id = Number(idValue)
	const entries = await buildSitemapEntries()
	const start = id * CHUNK_SIZE
	return entries.slice(start, start + CHUNK_SIZE)
}
