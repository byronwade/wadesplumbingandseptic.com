import { getAllRoutes } from "@/lib/content"
import {
	llmsBusinessSummary,
	llmsFullPageSlugs,
	llmsFullSection,
} from "@/lib/llms"
import { siteConfig } from "@/lib/site"

/** Full-text companion to /llms.txt for AI assistants that read one file. */
export async function GET() {
	const { services, pages } = await getAllRoutes()

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

	const body = `${llmsBusinessSummary()}
Index: ${siteConfig.url}/llms.txt

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
