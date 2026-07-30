import type { MetadataRoute } from "next"
import { cacheLife, cacheTag } from "next/cache"

import { cityServicePages, cityServicePath } from "@/lib/city-service-pages"
import { getAllRoutes, taxonomySlug } from "@/lib/content"
import { siteConfig } from "@/lib/site"

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

/**
 * Single sitemap at /sitemap.xml (no generateSitemaps chunks).
 * Tag archives are intentionally omitted: thin taxonomy URLs dilute crawl budget.
 * Category hubs stay; they are few and map to real content groupings.
 */
async function buildSitemapEntries(): Promise<SitemapEntry[]> {
	"use cache"
	cacheTag(
		"content:routes",
		"content:pages",
		"content:services",
		"content:posts",
		"content:city-service",
	)
	cacheLife("max")

	const { pages, services, posts } = await getAllRoutes()

	const fixed = [
		entry("", undefined, 1),
		entry("/services", undefined, 0.9),
		entry("/service-areas", undefined, 0.9),
		entry("/expert-tips", undefined, 0.9),
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

	const cityServiceEntries = cityServicePages.map((page) =>
		entry(cityServicePath(page.citySlug, page.serviceSlug), undefined, 0.7),
	)

	return [
		...fixed,
		...pageEntries,
		...serviceEntries,
		...postEntries,
		...categories,
		...serviceCategories,
		...cityServiceEntries,
	]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	return buildSitemapEntries()
}
