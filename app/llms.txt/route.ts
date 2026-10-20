import { getAllRoutes } from "@/lib/content"
import {
	cityServicePages,
	cityServicePath,
	getCityLocation,
} from "@/lib/city-service-pages"
import { siteConfig } from "@/lib/site"

export async function GET() {
	const { services, posts, pages } = await getAllRoutes()

	const serviceAreas = pages.filter((page) =>
		page.slug.startsWith("service-area/"),
	)

	const serviceLines = services
		.map(
			(service) =>
				`- [${service.title}](${siteConfig.url}/service-offerings/${service.slug}): ${service.description}`,
		)
		.join("\n")

	const tipLines = posts
		.slice(0, 40)
		.map(
			(post) =>
				`- [${post.title}](${siteConfig.url}/${post.slug}): ${post.description}`,
		)
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

	const body = `# ${siteConfig.name}

> ${siteConfig.description}

Phone: ${siteConfig.phone}
Email: ${siteConfig.email}
Address: ${siteConfig.address.display}
Hours: ${siteConfig.hours}
Pricing: ${siteConfig.pricing}
License: ${siteConfig.licenses}
Service area: ${siteConfig.serviceArea}

## Services

${serviceLines}

## Expert tips

${tipLines}

## Service areas

${areaLines}

## Local service guides

${cityServiceLines}

## Important pages

- [All Services](${siteConfig.url}/services)
- [Service Areas](${siteConfig.url}/service-areas)
- [About Us](${siteConfig.url}/about-us)
- [Expert Tips](${siteConfig.url}/expert-tips)
- [Plumbing & Septic Glossary](${siteConfig.url}/glossary)
- [Plumbing Glossary](${siteConfig.url}/glossary/plumbing)
- [Septic Glossary](${siteConfig.url}/glossary/septic)
- [Warranties](${siteConfig.url}/warranties)
- [Financing](${siteConfig.url}/financing)
- [Contact](${siteConfig.url}/contact)
`

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=86400",
		},
	})
}
