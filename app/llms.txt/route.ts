import {
	cityServicePages,
	cityServicePath,
	getCityLocation,
} from "@/lib/city-service-pages"
import { getAllRoutes } from "@/lib/content"
import {
	LLMS_FULL_PATH,
	llmsBusinessSummary,
	llmsLinkLine,
	selectIndexableGuides,
	selectRecentGuides,
} from "@/lib/llms"
import { bestGuides, coreServiceSlugs, keyPages } from "@/lib/public-facts"
import { siteConfig } from "@/lib/site"

export async function GET() {
	const { services, pages, posts } = await getAllRoutes()

	const serviceAreas = pages.filter((page) =>
		page.slug.startsWith("service-area/"),
	)

	const coreServices = coreServiceSlugs.flatMap((slug) => {
		const service = services.find((entry) => entry.slug === slug)
		return service ? [service] : []
	})
	const coreSlugs = new Set(coreServices.map((service) => service.slug))
	const remainingServices = services
		.filter((service) => !coreSlugs.has(service.slug))
		.slice()
		.sort((left, right) => left.title.localeCompare(right.title))

	const serviceLines = [...coreServices, ...remainingServices]
		.map((service) =>
			llmsLinkLine(
				service.title,
				`${siteConfig.url}/service-offerings/${service.slug}`,
				service.description,
			),
		)
		.join("\n")

	const guideLines = bestGuides()
		.map((guide) => llmsLinkLine(guide.title, `${siteConfig.url}${guide.href}`))
		.join("\n")

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

	const areaLines = serviceAreas
		.map((page) =>
			llmsLinkLine(
				page.title,
				`${siteConfig.url}/${page.slug}`,
				page.description,
			),
		)
		.join("\n")

	const cityServiceLines = cityServicePages
		.map((page) => {
			const location = getCityLocation(page.citySlug)!
			return `- [${page.serviceTitle} in ${location.name}, CA](${siteConfig.url}${cityServicePath(page.citySlug, page.serviceSlug)})`
		})
		.join("\n")

	const keyPageLines = keyPages
		.map((page) => llmsLinkLine(page.title, `${siteConfig.url}${page.href}`))
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

## Guides

${allGuideLines}

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
