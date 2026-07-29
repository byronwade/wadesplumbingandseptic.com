import type { MetadataRoute } from "next"

import { getCollection, taxonomySlug } from "@/lib/content"
import { siteConfig } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
	const fixed = ["", "/services", "/expert-tips"]
	const pages = getCollection("pages")
		.filter((page) => !page.noindex)
		.map((page) => `/${page.slug}`)
	const services = getCollection("services").map(
		(service) => `/service-offerings/${service.slug}`,
	)
	const posts = getCollection("posts").map((post) => `/${post.slug}`)
	const postDocuments = getCollection("posts")
	const categories = [
		...new Set(
			postDocuments.map(
				(post) => `/category/${taxonomySlug(post.category ?? "Expert Tips")}`,
			),
		),
	]
	const tags = [
		...new Set(
			postDocuments.flatMap(
				(post) => post.tags?.map((tag) => `/tag/${taxonomySlug(tag)}`) ?? [],
			),
		),
	]
	const serviceCategories = [
		"/service-category/plumbing",
		"/service-category/residential-plumbing",
		"/service-category/commercial",
		"/service-category/commercial-plumbing",
		"/service-category/septic",
		"/service-category/septic-services",
		"/service-category/emergency-services",
		"/service-category/specialty-services",
	]

	return [
		...fixed,
		...pages,
		...services,
		...posts,
		...categories,
		...tags,
		...serviceCategories,
	].map((route) => ({
		url: `${siteConfig.url}${route}`,
		lastModified: "2026-07-29",
		changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
		priority:
			route === "" ? 1 : route.startsWith("/service-offerings") ? 0.8 : 0.7,
	}))
}
