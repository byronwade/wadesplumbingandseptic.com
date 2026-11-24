import {
	cityServicePages,
	cityServicePath,
	getCityLocation,
} from "@/lib/city-service-pages"
import { getAllRoutes } from "@/lib/content"
import { LLMS_FULL_PATH, llmsBusinessSummary } from "@/lib/llms"
import {
	bestGuides,
	coreServiceSlugs,
	keyPages,
	recentGuides,
} from "@/lib/public-facts"
import { siteConfig } from "@/lib/site"

export async function GET() {
	const { services, pages } = await getAllRoutes()

	const serviceAreas = pages.filter((page) =>
		page.slug.startsWith("service-area/"),
	)

	const coreServices = coreServiceSlugs.flatMap((slug) => {
		const service = services.find((entry) => entry.slug === slug)
		return service ? [service] : []
	})

	const serviceLines = coreServices
		.map(
			(service) =>
				`- [${service.title}](${siteConfig.url}/service-offerings/${service.slug}): ${service.description}`,
		)
		.join("\n")

	const guideLines = bestGuides()
		.map((guide) => `- [${guide.title}](${siteConfig.url}${guide.href})`)
		.join("\n")

	const recentGuideLines = recentGuides
		.map((guide) => `- [${guide.title}](${siteConfig.url}${guide.href})`)
		.join("\n")

	const areaLines = serviceAreas
		.map(
			(page) =>
				`- [${page.title}](${siteConfig.url}/${page.slug}): ${page.description}`,
		)
		.join("\n")

	const cityServiceLines = cityServicePages
		.map((page) => {
			const location = getCityLocation(page.citySlug)!
			return `- [${page.serviceTitle} in ${location.name}, CA](${siteConfig.url}${cityServicePath(page.citySlug, page.serviceSlug)})`
		})
		.join("\n")

	const keyPageLines = keyPages
		.map((page) => `- [${page.title}](${siteConfig.url}${page.href})`)
		.join("\n")

	const body = `${llmsBusinessSummary()}
Full text of every service and key pages: ${siteConfig.url}${LLMS_FULL_PATH}

## Services

${serviceLines}

- [All Services](${siteConfig.url}/services)

## Best guides

${guideLines}

- [Expert Tips](${siteConfig.url}/expert-tips)

## Recent guides

${recentGuideLines}

## Service areas

${areaLines}

## Local service guides

${cityServiceLines}

## Important pages

${keyPageLines}
`

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=86400",
		},
	})
}
