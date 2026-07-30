import type { ContentDocument } from "@/lib/content"
import {
	companyNavigation,
	resourceNavigation,
} from "@/lib/site"

export type ContentLayout = "marketing" | "article"

/** Pages that should stay as a narrow article even if they sit in nav. */
const ARTICLE_SLUGS = new Set([
	"privacy-policy",
	"terms-of-service",
	"thank-you",
	"contact-call-first",
	"glossary",
])

/**
 * Company / resource / local landing pages that should use home-like section
 * bands instead of a plain prose column.
 */
const MARKETING_SLUGS = new Set([
	...companyNavigation.map((item) => item.href.replace(/^\//, "")),
	...resourceNavigation
		.map((item) => item.href.replace(/^\//, ""))
		.filter((slug) => slug !== "expert-tips" && !slug.startsWith("glossary")),
	"septic-solutions",
	"maintenance-guide",
	"emergency-plumber-santa-cruz-county",
	"engineered-septic-systems-santa-cruz-county",
	"failed-septic-repair-replacement-santa-cruz-county",
	"plumbing-repair-services-santa-cruz-county",
	"septic-replacement-santa-cruz",
	"water-main-sewer-line-repair-santa-cruz-county",
	"insurance-claims",
	"rebates",
	"promotions",
	"franchise",
	"monterey",
	"san-jose",
	"santa-cruz",
	"service-areas",
])

export function resolveContentLayout(
	document: Pick<ContentDocument, "slug">,
	options?: { isPost?: boolean },
): ContentLayout {
	if (options?.isPost) return "article"
	if (ARTICLE_SLUGS.has(document.slug)) return "article"
	if (document.slug.startsWith("service-area/")) return "marketing"
	if (document.slug.startsWith("careers/")) return "marketing"
	if (document.slug.startsWith("santa-cruz/")) return "marketing"
	if (MARKETING_SLUGS.has(document.slug)) return "marketing"
	return "article"
}
