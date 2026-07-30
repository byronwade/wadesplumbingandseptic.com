import type { MetadataRoute } from "next"

import { siteConfig } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: [
				"/_next/",
				"/api/",
				"/thank-you",
				"/contact-call-first",
				"/franchise",
			],
		},
		sitemap: `${siteConfig.url}/sitemap.xml`,
		host: siteConfig.url,
	}
}
