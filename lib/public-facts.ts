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
/** Shown when quote email cannot be delivered, so Call stays the conversion path. */
export const callForFreeQuoteLabel = "Call for a free quote"
export const freeQuotePath = "/contact"
/** Contact-page quote section fragment. Quote CTAs deep-link here. */
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

export const factsPagePath = "/facts"
export const factsPageTitle = "Wade's Plumbing & Septic Facts"
export const factsPageEyebrow = "Confirmed facts"
export const factsUpdated = "2026-11-27"
export const factsPageDescription =
	"Confirmed facts for Wade's Plumbing & Septic: hours, phone, license, Santa Cruz County service area, septic installation with engineers, and free quotes."

export const keyPages = [
	{ href: factsPagePath, title: "Company Facts" },
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
	{ href: factsPagePath, title: "Company facts" },
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

/** Crawlable facts. Every value is from siteConfig or the lists above. */
export function publicFactRows(): PublicFactRow[] {
	return [
		{ term: "Business", detail: siteConfig.name },
		{ term: "What we do", detail: siteConfig.description },
		{ term: "Services", detail: servicesSummary },
		{
			term: "Septic",
			detail:
				"Installation alongside engineers, including engineered systems. Does not pump septic tanks.",
		},
		{ term: "Not offered", detail: "Does not pump septic tanks." },
		{ term: "Service area", detail: siteConfig.serviceArea },
		{ term: "Towns", detail: servedTowns().join(", ") },
		{ term: "Hours", detail: siteConfig.hours },
		{
			term: "Quotes",
			detail: `Free. Call ${siteConfig.phone} during office hours or request a quote on the contact page.`,
		},
		{ term: "Pricing", detail: siteConfig.pricing },
		{ term: "Phone", detail: siteConfig.phone },
		{ term: "Email", detail: siteConfig.email },
		{ term: "License", detail: siteConfig.licenses },
		{ term: "Office", detail: siteConfig.address.display },
	]
}

/** Plain-text facts block for /llms-full.txt and assistants that skip HTML. */
export function factsPlainText() {
	return publicFactRows()
		.map((row) => `${row.term}: ${row.detail}`)
		.join("\n")
}

/**
 * Visible FAQs on /facts, also published as FAQPage schema. Answers stay
 * inside siteConfig so they cannot drift from the definition list.
 */
export function factsFaqs() {
	return [
		{
			question: "What does Wade's Plumbing & Septic do?",
			answer: `${siteConfig.name} is a family-owned plumbing and septic company in ${siteConfig.address.city}, California. ${servicesSummary}.`,
		},
		{
			question: "Does Wade's pump septic tanks?",
			answer:
				"No. Wade's Plumbing & Septic does not offer septic tank pumping. Septic work is installation alongside engineers, including engineered systems. For routine pumping, contact a septic pumping company.",
		},
		{
			question: "Are quotes free, and how is pricing set?",
			answer: `Yes, quotes are free. ${siteConfig.pricing}`,
		},
		{
			question: "What are your hours?",
			answer: `Office hours are ${siteConfig.hours}. Call ${siteConfig.phone} during those hours or email ${siteConfig.email}.`,
		},
		{
			question: "What areas do you serve?",
			answer: `We serve ${siteConfig.serviceArea}. Call with the street address if you are unsure.`,
		},
		{
			question: "What contractor license does Wade's hold?",
			answer: `Wade's holds ${siteConfig.licenses}.`,
		},
	]
}
