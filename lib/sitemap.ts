import "server-only"

import type { MetadataRoute } from "next"
import { cacheLife, cacheTag } from "next/cache"

import {
	getAllRoutes,
	taxonomySlug,
	type ContentDocument,
} from "@/lib/content"
import { getAllGlossaryEntries } from "@/lib/glossary"
import { postCategoryAliases } from "@/lib/post-categories"
import { absoluteUrl } from "@/lib/seo"
import {
	serviceCategories,
	serviceCategorySlugs,
} from "@/lib/service-categories"
import { siteConfig } from "@/lib/site"

export const SITEMAP_CHUNK_SIZE = 250

/** Tags with fewer posts than this stay out of the sitemap (thin archives). */
export const SITEMAP_MIN_TAG_POSTS = 2

type SitemapEntry = MetadataRoute.Sitemap[number]
type ChangeFrequency = NonNullable<SitemapEntry["changeFrequency"]>

type EntryInput = {
	pathname: string
	lastModified?: string | Date
	changeFrequency?: ChangeFrequency
	priority: number
	images?: string[]
}

/** Utility / campaign pages that must never be advertised to crawlers. */
export const SITEMAP_EXCLUDED_PATHS = new Set([
	"/thank-you",
	"/contact-call-first",
	"/franchise",
	"/api/search-index",
])

/** Money and hub pages with explicit crawl weight. */
const PATH_PRIORITY: Record<string, number> = {
	"/": 1,
	"/services": 0.95,
	"/service-areas": 0.95,
	"/expert-tips": 0.9,
	"/contact": 0.9,
	"/about-us": 0.8,
	"/financing": 0.75,
	"/warranties": 0.75,
	"/faq": 0.7,
	"/testimonials": 0.7,
	"/careers": 0.65,
	"/maintenance-guide": 0.65,
	"/septic-solutions": 0.7,
	"/glossary": 0.8,
	"/glossary/plumbing": 0.72,
	"/glossary/septic": 0.72,
}

const PATH_CHANGE_FREQUENCY: Record<string, ChangeFrequency> = {
	"/": "weekly",
	"/services": "weekly",
	"/service-areas": "weekly",
	"/expert-tips": "weekly",
	"/contact": "monthly",
}

function normalizePathname(pathname: string) {
	if (!pathname || pathname === "/") return "/"
	const withSlash = pathname.startsWith("/") ? pathname : `/${pathname}`
	return withSlash.replace(/\/+$/, "") || "/"
}

function pathnameToUrl(pathname: string) {
	const path = normalizePathname(pathname)
	return path === "/" ? siteConfig.url : `${siteConfig.url}${path}`
}

function contentLastModified(document: ContentDocument) {
	return document.updated ?? document.date ?? document.sourceModified
}

function absoluteImages(...candidates: Array<string | undefined>) {
	const images: string[] = []
	for (const candidate of candidates) {
		if (!candidate) continue
		const url = absoluteUrl(candidate)
		if (!images.includes(url)) images.push(url)
	}
	return images.length ? images : undefined
}

function maxTimestamp(values: Array<string | Date | undefined>) {
	let best: string | undefined
	for (const value of values) {
		if (!value) continue
		const iso = value instanceof Date ? value.toISOString() : value
		if (!best || iso > best) best = iso
	}
	return best
}

function pagePriority(slug: string) {
	const pathname = normalizePathname(`/${slug}`)
	if (PATH_PRIORITY[pathname] !== undefined) return PATH_PRIORITY[pathname]
	if (slug.startsWith("service-area/")) return 0.85
	if (slug.startsWith("careers/")) return 0.55
	if (slug.startsWith("santa-cruz/")) return 0.7
	return 0.7
}

function upsertEntry(map: Map<string, SitemapEntry>, input: EntryInput) {
	const pathname = normalizePathname(input.pathname)
	if (SITEMAP_EXCLUDED_PATHS.has(pathname)) return

	const url = pathnameToUrl(pathname)
	const next: SitemapEntry = {
		url,
		priority: input.priority,
		changeFrequency:
			input.changeFrequency ??
			PATH_CHANGE_FREQUENCY[pathname] ??
			"monthly",
		...(input.lastModified ? { lastModified: input.lastModified } : {}),
		...(input.images?.length ? { images: input.images } : {}),
	}

	const existing = map.get(url)
	if (!existing) {
		map.set(url, next)
		return
	}

	const mergedImages = [
		...new Set([...(existing.images ?? []), ...(next.images ?? [])]),
	]
	map.set(url, {
		url,
		priority: Math.max(existing.priority ?? 0, next.priority ?? 0),
		changeFrequency: next.changeFrequency ?? existing.changeFrequency,
		lastModified: maxTimestamp([existing.lastModified, next.lastModified]),
		...(mergedImages.length ? { images: mergedImages } : {}),
	})
}

function isIndexable(document: ContentDocument) {
	return !document.noindex
}

/**
 * Full sitemap inventory, sorted so the first chunk is the money pages.
 * Deduped by absolute URL; noindex and utility paths are omitted.
 */
export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
	"use cache"
	cacheTag("content:sitemap", "content:routes")
	cacheLife("max")

	const { pages, services, posts } = await getAllRoutes()
	const indexablePages = pages.filter(isIndexable)
	const indexableServices = services.filter(isIndexable)
	const indexablePosts = posts.filter(isIndexable)
	const entries = new Map<string, SitemapEntry>()

	const newestContent = maxTimestamp([
		...indexablePages.map(contentLastModified),
		...indexableServices.map(contentLastModified),
		...indexablePosts.map(contentLastModified),
	])
	const newestService = maxTimestamp(
		indexableServices.map(contentLastModified),
	)
	const newestPost = maxTimestamp(indexablePosts.map(contentLastModified))
	const newestArea = maxTimestamp(
		indexablePages
			.filter((page) => page.slug.startsWith("service-area/"))
			.map(contentLastModified),
	)

	upsertEntry(entries, {
		pathname: "/",
		priority: 1,
		changeFrequency: "weekly",
		lastModified: newestContent,
		images: absoluteImages("/images/locations/santa-cruz-plumber.webp"),
	})

	upsertEntry(entries, {
		pathname: "/services",
		priority: 0.95,
		changeFrequency: "weekly",
		lastModified: newestService,
		images: absoluteImages("/images/work/precision-valve-installation.webp"),
	})

	upsertEntry(entries, {
		pathname: "/service-areas",
		priority: 0.95,
		changeFrequency: "weekly",
		lastModified: newestArea ?? newestContent,
		images: absoluteImages("/images/locations/santa-cruz-redwoods.webp"),
	})

	upsertEntry(entries, {
		pathname: "/expert-tips",
		priority: 0.9,
		changeFrequency: "weekly",
		lastModified: newestPost,
		images: absoluteImages("/images/team/byron-working.webp"),
	})

	for (const page of indexablePages) {
		upsertEntry(entries, {
			pathname: `/${page.slug}`,
			priority: pagePriority(page.slug),
			lastModified: contentLastModified(page),
			images: absoluteImages(page.image),
		})
	}

	for (const service of indexableServices) {
		upsertEntry(entries, {
			pathname: `/service-offerings/${service.slug}`,
			priority: service.featured ? 0.9 : 0.85,
			lastModified: contentLastModified(service),
			images: absoluteImages(service.image),
		})
	}

	for (const post of indexablePosts) {
		upsertEntry(entries, {
			pathname: `/${post.slug}`,
			priority: 0.7,
			changeFrequency: "monthly",
			lastModified: contentLastModified(post),
			images: absoluteImages(post.image),
		})
	}

	for (const slug of serviceCategorySlugs) {
		const category = serviceCategories[slug]
		upsertEntry(entries, {
			pathname: `/service-category/${slug}`,
			priority: 0.8,
			lastModified: newestService,
			images: absoluteImages(category.image),
		})
	}

	const categorySlugs = new Set<string>()
	for (const post of indexablePosts) {
		categorySlugs.add(taxonomySlug(post.category ?? "Expert Tips"))
	}
	for (const slug of Object.keys(postCategoryAliases)) {
		const aliasLabels = postCategoryAliases[slug] ?? []
		const hasPosts = indexablePosts.some((post) => {
			const category = post.category ?? "Expert Tips"
			return (
				taxonomySlug(category) === slug || aliasLabels.includes(category)
			)
		})
		if (hasPosts) categorySlugs.add(slug)
	}

	for (const slug of categorySlugs) {
		const related = indexablePosts.filter((post) => {
			const category = post.category ?? "Expert Tips"
			const aliases = postCategoryAliases[slug] ?? []
			return (
				taxonomySlug(category) === slug || aliases.includes(category)
			)
		})
		upsertEntry(entries, {
			pathname: `/category/${slug}`,
			priority: 0.6,
			lastModified: maxTimestamp(related.map(contentLastModified)),
		})
	}

	const tagCounts = new Map<string, ContentDocument[]>()
	for (const post of indexablePosts) {
		for (const tag of post.tags ?? []) {
			const slug = taxonomySlug(tag)
			const list = tagCounts.get(slug) ?? []
			list.push(post)
			tagCounts.set(slug, list)
		}
	}

	for (const [slug, taggedPosts] of tagCounts) {
		if (taggedPosts.length < SITEMAP_MIN_TAG_POSTS) continue
		upsertEntry(entries, {
			pathname: `/tag/${slug}`,
			priority: 0.45,
			lastModified: maxTimestamp(taggedPosts.map(contentLastModified)),
		})
	}

	upsertEntry(entries, {
		pathname: "/glossary/plumbing",
		priority: 0.72,
		changeFrequency: "monthly",
	})
	upsertEntry(entries, {
		pathname: "/glossary/septic",
		priority: 0.72,
		changeFrequency: "monthly",
	})

	const glossaryEntries = await getAllGlossaryEntries()
	for (const { topic, term } of glossaryEntries) {
		upsertEntry(entries, {
			pathname: `/glossary/${topic}/${term.slug}`,
			priority: 0.65,
			changeFrequency: "monthly",
		})
	}

	return [...entries.values()].sort((a, b) => {
		const priorityDelta = (b.priority ?? 0) - (a.priority ?? 0)
		if (priorityDelta !== 0) return priorityDelta
		return a.url.localeCompare(b.url)
	})
}

export async function getSitemapChunkCount() {
	const entries = await buildSitemapEntries()
	return Math.max(1, Math.ceil(entries.length / SITEMAP_CHUNK_SIZE))
}

export async function getSitemapChunk(id: number): Promise<MetadataRoute.Sitemap> {
	const entries = await buildSitemapEntries()
	const start = id * SITEMAP_CHUNK_SIZE
	return entries.slice(start, start + SITEMAP_CHUNK_SIZE)
}
