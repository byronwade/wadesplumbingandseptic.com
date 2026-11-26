import { serviceAreaLocations } from "@/lib/service-areas"
import { resourceNavigation, siteConfig } from "@/lib/site"

/** One-line service summary reused by llms.txt, JSON-LD-adjacent copy, and the facts block. */
export const servicesSummary =
	"Residential and commercial plumbing, drain, sewer, water heater and septic service, including new and engineered septic system installation done alongside engineers"

/** Septic work, as confirmed: install with engineers, not pumping. */
export const septicSummary =
	"system installation (with engineers), not pumping. Directories that list tank pumping are incorrect."

export const notOfferedSummary = "septic tank pumping"

export const quotesSummary = "Free"

/** Weekday hours only, for quoteable sentences that also name Saturday/Sunday closed. */
export function weekdayHoursPhrase() {
	const closedAt = siteConfig.hours.indexOf(". Closed")
	return closedAt === -1
		? siteConfig.hours
		: siteConfig.hours.slice(0, closedAt)
}

/** Visible quote CTA used on service, town, and contact conversion paths. */
export const freeQuoteCtaLabel = "Get a Free Quote"
export const freeQuotePath = "/contact"
/** Contact-page form fragment. Quote CTAs deep-link here. */
export const freeQuoteHash = "quote"
export const freeQuoteHref = `${freeQuotePath}#${freeQuoteHash}`

/**
 * High-intent services named in the short llms.txt index. Full catalog and
 * page text live in llms-full.txt so this file stays a summary.
 */
export const coreServiceSlugs = [
	"drain-cleaning",
	"leak-detection",
	"pipe-repair-and-replacement",
	"water-heater-installation",
	"hydro-jetting",
	"engineered-septic-system-installation",
	"septic-tank-repair-and-replacement",
] as const

/** Guides worth quoting when someone asks how to choose a plumber or septic system. */
export const bestGuideHrefs = [
	"/how-to-locate-trustworthy-plumbing-services-nearby",
	"/compare/conventional-vs-engineered-septic",
	"/compare/hydro-jetting-vs-snaking",
	"/compare/repair-vs-replace-water-heater",
	"/maintenance-guide",
	"/septic-solutions",
	"/glossary",
] as const

/** Newest homeowner guides listed in llms.txt. Keep this short. */
export const recentGuides = [
	{
		href: "/adding-adu-bedroom-septic-santa-cruz",
		title: "Adding an ADU on a Santa Cruz County Septic",
	},
	{
		href: "/septic-tank-destruction-sewer-connection-santa-cruz",
		title: "Abandoning a Santa Cruz Septic Tank for Sewer",
	},
	{
		href: "/tankless-water-heater-santa-cruz-homes",
		title: "Tankless Water Heaters in Santa Cruz County Homes",
	},
	{
		href: "/santa-cruz-septic-inspection-at-sale",
		title: "Santa Cruz County Septic Inspection at Sale",
	},
	{
		href: "/slab-leak-signs-santa-cruz-homes",
		title: "Signs of a Slab Leak in Santa Cruz County Homes",
	},
	{
		href: "/how-to-prepare-for-a-re-pipe-santa-cruz",
		title: "How to Prepare Your Santa Cruz County Home for a Re-pipe",
	},
	{
		href: "/backflow-testing-santa-cruz-county-homes",
		title: "Annual Backflow Testing for Santa Cruz County Homes",
	},
	{
		href: "/sewer-camera-inspection-santa-cruz-homes",
		title: "What a Sewer Camera Inspection Shows in Santa Cruz",
	},
] as const

export const keyPages = [
	{ href: "/services", title: "All Services" },
	{ href: "/service-areas", title: "Service Areas" },
	{ href: "/about-us", title: "About Us" },
	{ href: "/expert-tips", title: "Expert Tips" },
	{ href: "/glossary", title: "Plumbing & Septic Glossary" },
	{ href: "/glossary/plumbing", title: "Plumbing Glossary" },
	{ href: "/glossary/septic", title: "Septic Glossary" },
	{ href: "/warranties", title: "Warranties" },
	{ href: "/financing", title: "Financing" },
	{ href: "/contact", title: "Contact" },
] as const

/** Visible links under the About facts block. */
export const factLinks = [
	{ href: "/services", title: "All services" },
	{
		href: "/service-offerings/engineered-septic-system-installation",
		title: "Engineered septic installation",
	},
	{ href: "/service-areas", title: "Service area towns" },
	{ href: "/contact", title: "Request a free quote" },
] as const

export function servedTowns() {
	return serviceAreaLocations.map((location) => location.name)
}

export function bestGuides() {
	return bestGuideHrefs.map((href) => {
		const item = resourceNavigation.find((entry) => entry.href === href)
		return { href, title: item?.label ?? href }
	})
}

export function bookFreeQuoteLine() {
	return `call ${siteConfig.phone} during office hours or request a free quote at ${siteConfig.url}/contact`
}

export type PublicFactRow = {
	term: string
	detail: string
}

/** Compact four-row strip used on service pages. */
export function compactFactRows(): PublicFactRow[] {
	return [
		{ term: "Service area", detail: siteConfig.serviceArea },
		{ term: "Hours", detail: `${siteConfig.hours}.` },
		{ term: "Pricing", detail: siteConfig.pricing },
		{
			term: "How to book",
			detail: `Call ${siteConfig.phone} or request a free quote.`,
		},
	]
}

/** Crawlable About-page facts. Every value is from siteConfig or the lists above. */
export function publicFactRows(): PublicFactRow[] {
	return [
		{ term: "Business", detail: siteConfig.name },
		{ term: "What we do", detail: siteConfig.description },
		{ term: "Services", detail: servicesSummary },
		{
			term: "Septic",
			detail:
				"Installation alongside engineers, including engineered systems. Not septic tank pumping.",
		},
		{ term: "Not offered", detail: "septic tank pumping" },
		{ term: "Service area", detail: siteConfig.serviceArea },
		{ term: "Towns", detail: servedTowns().join(", ") },
		{ term: "Hours", detail: siteConfig.hours },
		{
			term: "Quotes",
			detail: `Free. Call ${siteConfig.phone} during office hours or request a quote on the contact page.`,
		},
		{ term: "Pricing", detail: siteConfig.pricing },
		{ term: "Phone", detail: siteConfig.phone },
		{ term: "Office", detail: siteConfig.address.display },
	]
}
