import type { MetadataRoute } from "next"

import { robotsRules } from "@/lib/robots"
import { siteConfig } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
	return {
		rules: robotsRules(),
		sitemap: `${siteConfig.url}/sitemap.xml`,
		host: siteConfig.url,
	}
}
