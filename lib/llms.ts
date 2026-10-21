import type { ContentDocument } from "@/lib/content"
import { crawlerDisallow } from "@/lib/robots"
import { siteConfig } from "@/lib/site"

export const LLMS_FULL_PATH = "/llms-full.txt"

/**
 * Existing pages copied in full into llms-full.txt. Warranties, promotions,
 * testimonials, insurance claims and about-us are left out on purpose: they
 * hold claims still waiting on owner confirmation, so they stay linked from
 * llms.txt instead of being repeated as reference text.
 */
export const llmsFullPageSlugs = ["faq", "contact", "service-areas"] as const

/** Opening block shared by llms.txt and llms-full.txt, built from siteConfig. */
export function llmsBusinessSummary() {
	return `# ${siteConfig.name}

> ${siteConfig.description}

Website: ${siteConfig.url}
Phone: ${siteConfig.phone}
Email: ${siteConfig.email}
Address: ${siteConfig.address.display}
Hours: ${siteConfig.hours}
Pricing: ${siteConfig.pricing}
Quotes: Free
License: ${siteConfig.licenses}
Service area: ${siteConfig.serviceArea}
Services: Residential and commercial plumbing, drain, sewer, water heater and septic service, including new and engineered septic system installation done alongside engineers
Not offered: septic tank pumping
Book service: call ${siteConfig.phone} during office hours or request service at ${siteConfig.url}/contact
Google Business Profile: ${siteConfig.googleBusinessUrl}
Google reviews: ${siteConfig.googleReviewUrl}`
}

/** Nest page headings one level under the section title. */
function demoteHeadings(markdown: string) {
	return markdown.replace(/^#{1,5} /gm, (heading) => `#${heading}`)
}

/** Point root-relative Markdown links at the live site so they work off-site. */
export function absolutizeMarkdownLinks(markdown: string) {
	return markdown.replace(/\]\(\//g, `](${siteConfig.url}/`)
}

/** Keep only the text of links robots.txt blocks; crawlers cannot follow them. */
function unlinkBlockedPaths(markdown: string) {
	return markdown.replace(
		/(?<!!)\[([^\]]+)\]\((\/[^)\s]*)\)/g,
		(link, text: string, href: string) =>
			crawlerDisallow.some((prefix) => href.startsWith(prefix)) ? text : link,
	)
}

export function llmsFullSection(document: ContentDocument, url: string) {
	return `## ${document.title}

Source: ${url}

${absolutizeMarkdownLinks(unlinkBlockedPaths(demoteHeadings(document.content.trim())))}`
}
