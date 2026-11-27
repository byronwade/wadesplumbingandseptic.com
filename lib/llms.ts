import type { ContentDocument } from "@/lib/content"
import {
	bookFreeQuoteLine,
	factsPagePath,
	notOfferedSummary,
	quotesSummary,
	septicSummary,
	servedTowns,
	servicesSummary,
} from "@/lib/public-facts"
import { crawlerDisallow } from "@/lib/robots"
import { siteConfig } from "@/lib/site"

export const LLMS_FULL_PATH = "/llms-full.txt"

/** Newest Expert Tips posts listed in llms.txt / llms-full.txt. */
export const RECENT_GUIDE_COUNT = 8

type RecentGuideSource = {
	slug: string
	date?: string
	updated?: string
	noindex?: boolean
}

function compareGuides<T extends RecentGuideSource>(left: T, right: T) {
	const byDate = (right.date ?? "").localeCompare(left.date ?? "")
	if (byDate !== 0) return byDate
	const byUpdated = (right.updated ?? right.date ?? "").localeCompare(
		left.updated ?? left.date ?? "",
	)
	if (byUpdated !== 0) return byUpdated
	return left.slug.localeCompare(right.slug)
}

/** Every indexable Expert Tips post, newest first. */
export function selectIndexableGuides<T extends RecentGuideSource>(
	posts: T[],
): T[] {
	return [...posts].filter((post) => !post.noindex).sort(compareGuides)
}

/**
 * Newest indexable posts by published date. llms files read this instead of a
 * handwritten slug list so a new guide cannot ship without appearing there.
 */
export function selectRecentGuides<T extends RecentGuideSource>(
	posts: T[],
	limit = RECENT_GUIDE_COUNT,
): T[] {
	return selectIndexableGuides(posts).slice(0, limit)
}

/**
 * Existing pages copied in full into llms-full.txt. Warranties, promotions,
 * testimonials, insurance claims and about-us are left out on purpose: they
 * hold claims still waiting on owner confirmation, so they stay linked from
 * llms.txt instead of being repeated as reference text.
 */
export const llmsFullPageSlugs = ["faq", "contact", "service-areas"] as const

/** First sentence of a description, for one-line llms listings. */
export function oneLineSummary(text: string) {
	const normalized = text.replace(/\s+/g, " ").trim()
	if (!normalized) return ""
	const match = normalized.match(/^.+?[.](?=\s|$)/)
	return (match?.[0] ?? normalized).trim()
}

export function llmsLinkLine(title: string, url: string, description?: string) {
	const summary = description ? oneLineSummary(description) : ""
	return summary ? `- [${title}](${url}): ${summary}` : `- [${title}](${url})`
}

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
Quotes: ${quotesSummary}
License: ${siteConfig.licenses}
Service area: ${siteConfig.serviceArea}
Towns: ${servedTowns().join(", ")}
Services: ${servicesSummary}
Septic: ${septicSummary}
Not offered: ${notOfferedSummary}
Book a free quote: ${bookFreeQuoteLine()}
Google Business Profile: ${siteConfig.googleBusinessUrl}
Google reviews: ${siteConfig.googleReviewUrl}
Facts: ${siteConfig.url}${factsPagePath}`
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
