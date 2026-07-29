import type { MetadataRoute } from "next"

import { getCollection } from "@/lib/content"
import { siteConfig } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
	const fixed = ["", "/services", "/expert-tips"]
	const pages = getCollection("pages").map((page) => `/${page.slug}`)
	const services = getCollection("services").map(
		(service) => `/service-offerings/${service.slug}`,
	)
	const posts = getCollection("posts").map((post) => `/${post.slug}`)

	return [...fixed, ...pages, ...services, ...posts].map((route) => ({
		url: `${siteConfig.url}${route}`,
		lastModified: "2026-07-29",
		changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
		priority:
			route === "" ? 1 : route.startsWith("/service-offerings") ? 0.8 : 0.7,
	}))
}
