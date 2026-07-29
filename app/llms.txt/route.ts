import { getCollection } from "@/lib/content"
import { siteConfig } from "@/lib/site"

export function GET() {
	const services = getCollection("services")
		.map(
			(service) =>
				`- [${service.title}](${siteConfig.url}/service-offerings/${service.slug}): ${service.description}`,
		)
		.join("\n")

	const body = `# ${siteConfig.name}

> ${siteConfig.description}

Phone: ${siteConfig.phone}
Hours: ${siteConfig.hours}
Service area: ${siteConfig.serviceArea}

## Services

${services}

## Important pages

- [All Services](${siteConfig.url}/services)
- [Service Areas](${siteConfig.url}/service-areas)
- [About Us](${siteConfig.url}/about-us)
- [Expert Tips](${siteConfig.url}/expert-tips)
- [Contact](${siteConfig.url}/contact)
`

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=86400",
		},
	})
}
