import { getAllRoutes } from "@/lib/content"
import {
	llmsBusinessSummary,
	llmsFullPageSlugs,
	llmsFullSection,
	llmsLinkLine,
	selectIndexableGuides,
	selectRecentGuides,
} from "@/lib/llms"
import {
	factsPagePath,
	factsPageTitle,
	factsPlainText,
} from "@/lib/public-facts"
import { siteConfig } from "@/lib/site"

/** Full-text companion to /llms.txt for AI assistants that read one file. */
export async function GET() {
	const { services, pages, posts } = await getAllRoutes()

	const pageSections = llmsFullPageSlugs.flatMap((slug) => {
		const page = pages.find((entry) => entry.slug === slug)
		return page ? [llmsFullSection(page, `${siteConfig.url}/${slug}`)] : []
	})

	const serviceSections = services.map((service) =>
		llmsFullSection(
			service,
			`${siteConfig.url}/service-offerings/${service.slug}`,
		),
	)

	const recentGuideLines = selectRecentGuides(posts)
		.map((post) =>
			llmsLinkLine(
				post.title,
				`${siteConfig.url}/${post.slug}`,
				post.description,
			),
		)
		.join("\n")

	const allGuideLines = selectIndexableGuides(posts)
		.map((post) =>
			llmsLinkLine(
				post.title,
				`${siteConfig.url}/${post.slug}`,
				post.description,
			),
		)
		.join("\n")

	const areaLines = pages
		.filter((page) => page.slug.startsWith("service-area/"))
		.map((page) =>
			llmsLinkLine(
				page.title,
				`${siteConfig.url}/${page.slug}`,
				page.description,
			),
		)
		.join("\n")

	const body = `${llmsBusinessSummary()}
Index: ${siteConfig.url}/llms.txt

# ${factsPageTitle}

Source: ${siteConfig.url}${factsPagePath}

${factsPlainText()}

# Recent guides

${recentGuideLines}

# Guides

${allGuideLines}

# Service areas

${areaLines}

# Key pages

${pageSections.join("\n\n")}

# Services

${serviceSections.join("\n\n")}
`

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=86400",
		},
	})
}
