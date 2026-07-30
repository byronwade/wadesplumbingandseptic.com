import type { MetadataRoute } from "next"
import { cacheLife, cacheTag } from "next/cache"

import { getAllRoutes, taxonomySlug } from "@/lib/content"
import { getAllGlossaryEntries } from "@/lib/glossary"
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
	cacheTag(
		"content:routes",
		"content:pages",
		"content:services",
		"content:posts",
		"glossary:plumbing",
		"glossary:septic",
	)
	cacheLife("max")

	const [{ pages, services, posts }, glossaryEntries] = await Promise.all([
		getAllRoutes(),
		getAllGlossaryEntries(),
	])

	const fixed = [
		entry("", undefined, 1),
		entry("/services", undefined, 0.9),
		entry("/service-areas", undefined, 0.9),
		entry("/expert-tips", undefined, 0.9),
		entry("/glossary", undefined, 0.85),
		entry("/glossary/plumbing", undefined, 0.84),
		entry("/glossary/septic", undefined, 0.84),
		entry("/faq", undefined, 0.75),
		entry("/contact", undefined, 0.8),
	]

	const fixedPaths = new Set(
		fixed.map((item) => item.url.replace(siteConfig.url, "")),
	)

	const pageEntries = pages
		.filter((page) => !page.noindex)
		.filter((page) => !fixedPaths.has(`/${page.slug}`) && page.slug !== "")
		.map((page) => {
			const isServiceArea = page.slug.startsWith("service-area/")
			const isCityService = page.slug.startsWith("santa-cruz/")
			const priority = isServiceArea ? 0.85 : isCityService ? 0.8 : 0.72
			return entry(`/${page.slug}`, page.updated ?? page.date, priority)
		})

	const serviceEntries = services
		.filter((service) => !service.noindex)
		.map((service) =>
			entry(
				`/service-offerings/${service.slug}`,
				service.updated ?? service.date,
				0.85,
			),
		)

	const postEntries = posts
		.filter((post) => !post.noindex)
		.map((post) => entry(`/${post.slug}`, post.updated ?? post.date, 0.7))

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

	const glossaryTermEntries = glossaryEntries.map(({ topic, term }) =>
		entry(`/glossary/${topic}/${term.slug}`, undefined, 0.65),
	)

	return [
		...fixed,
		...pageEntries,
		...serviceEntries,
		...postEntries,
		...categories,
		...tags,
		...serviceCategories,
		...glossaryTermEntries,
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
