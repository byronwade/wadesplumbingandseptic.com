import { getAllRoutes } from "@/lib/content"
import { useLogger, withEvlog } from "@/lib/evlog"
import { siteConfig } from "@/lib/site"

export const GET = withEvlog(async () => {
	const log = useLogger()
	const { services, posts, pages } = await getAllRoutes()

	const serviceAreas = pages.filter((page) =>
		page.slug.startsWith("service-area/"),
	)

	log.set({
		llmsTxt: {
			serviceCount: services.length,
			tipCount: Math.min(posts.length, 40),
			serviceAreaCount: serviceAreas.length,
		},
	})

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

	const body = `# ${siteConfig.name}

> ${siteConfig.description}

Phone: ${siteConfig.phone}
Email: ${siteConfig.email}
Address: ${siteConfig.address.display}
Hours: ${siteConfig.hours}
License: ${siteConfig.licenses}
Service area: ${siteConfig.serviceArea}

## Services

${serviceLines}

## Expert tips

${tipLines}

## Service areas

${areaLines}

## Important pages

- [All Services](${siteConfig.url}/services)
- [Service Areas](${siteConfig.url}/service-areas)
- [About Us](${siteConfig.url}/about-us)
- [Expert Tips](${siteConfig.url}/expert-tips)
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
})
