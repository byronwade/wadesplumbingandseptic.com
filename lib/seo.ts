import type { Metadata } from "next"

import type { ContentDocument } from "@/lib/content"
import { buildOgImagePath, defaultOgEyebrow } from "@/lib/og"
import {
	serviceAreaLocations,
	type ServiceAreaLocation,
} from "@/lib/service-areas"
import { siteConfig } from "@/lib/site"

/** Google often truncates meta descriptions near this length. */
export const META_DESCRIPTION_MAX = 155
/** Social previews (and opengraph.xyz) prefer ~125 characters. */
export const OG_DESCRIPTION_MAX = 125

/** Stable schema.org node IDs: every page references the same business entity. */
export const businessId = `${siteConfig.url}/#business`
export const websiteId = `${siteConfig.url}/#website`

export function absoluteUrl(pathname: string) {
	if (pathname.startsWith("http")) return pathname
	return `${siteConfig.url}${pathname.startsWith("/") ? pathname : `/${pathname}`}`
}

/**
 * Trim copy for meta/OG slots at a word boundary. Keeps previews readable
 * instead of cutting mid-word when content descriptions run long.
 */
export function clampDescription(text: string, max: number): string {
	const normalized = text.replace(/\s+/g, " ").trim()
	if (normalized.length <= max) return normalized

	const budget = Math.max(1, max - 1)
	const slice = normalized.slice(0, budget)
	const boundary = Math.max(
		slice.lastIndexOf(" "),
		slice.lastIndexOf(","),
		slice.lastIndexOf(";"),
	)
	const cut = boundary > budget * 0.55 ? slice.slice(0, boundary) : slice
	return `${cut.replace(/[.,;:\s]+$/u, "")}…`
}

export function buildPageMetadata({
	title,
	description,
	pathname,
	image,
	eyebrow,
	type = "website",
	noindex = false,
}: {
	title: string
	description: string
	pathname: string
	image?: string
	/** Short label above the title on the generated OG card. */
	eyebrow?: string
	type?: "website" | "article"
	noindex?: boolean
}): Metadata {
	const url = absoluteUrl(pathname)
	const metaDescription = clampDescription(description, META_DESCRIPTION_MAX)
	const socialDescription = clampDescription(description, OG_DESCRIPTION_MAX)
	const ogImage = buildOgImagePath({
		title,
		eyebrow: eyebrow ?? defaultOgEyebrow(type),
		image: image ?? "/images/work/precision-valve-installation.webp",
	})
	const ogAlt = `${title}. Call ${siteConfig.phone} for service.`

	return {
		title,
		description: metaDescription,
		alternates: { canonical: pathname },
		openGraph: {
			title,
			description: socialDescription,
			url,
			type,
			siteName: siteConfig.name,
			locale: "en_US",
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: ogAlt,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: socialDescription,
			images: [ogImage],
		},
		robots: noindex ? { index: false, follow: false } : undefined,
	}
}

export function websiteJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": websiteId,
		name: siteConfig.name,
		url: siteConfig.url,
		description: siteConfig.description,
		publisher: { "@id": businessId },
		inLanguage: "en-US",
	}
}

export function openingHoursJsonLd() {
	return {
		"@type": "OpeningHoursSpecification",
		dayOfWeek: [...siteConfig.openingHours.days],
		opens: siteConfig.openingHours.opens,
		closes: siteConfig.openingHours.closes,
	}
}

export function localBusinessJsonLd(
	services: Array<{ slug: string; title: string; description: string }> = [],
) {
	const offerCatalog =
		services.length > 0
			? {
					"@type": "OfferCatalog",
					name: "Plumbing and septic services",
					itemListElement: services.slice(0, 48).map((service) => ({
						"@type": "Offer",
						itemOffered: {
							"@type": "Service",
							name: service.title,
							description: service.description,
							url: absoluteUrl(`/service-offerings/${service.slug}`),
							provider: { "@id": businessId },
						},
					})),
				}
			: undefined

	return {
		"@context": "https://schema.org",
		"@type": ["Plumber", "LocalBusiness", "HomeAndConstructionBusiness"],
		"@id": businessId,
		name: siteConfig.name,
		url: siteConfig.url,
		telephone: siteConfig.phoneE164,
		email: siteConfig.email,
		logo: absoluteUrl("/images/brand/wades-mark.webp"),
		image: absoluteUrl("/images/locations/santa-cruz-plumber.webp"),
		description: siteConfig.description,
		address: {
			"@type": "PostalAddress",
			streetAddress: siteConfig.address.street,
			addressLocality: siteConfig.address.city,
			addressRegion: siteConfig.address.region,
			postalCode: siteConfig.address.postalCode,
			addressCountry: "US",
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: siteConfig.geo.latitude,
			longitude: siteConfig.geo.longitude,
		},
		hasMap: siteConfig.googleMapsUrl,
		identifier: {
			"@type": "PropertyValue",
			name: "CA CSLB License",
			value: siteConfig.licenseNumber,
		},
		areaServed: serviceAreasJsonLd().map((area) =>
			"@id" in area ? { "@id": area["@id"] } : area,
		),
		openingHoursSpecification: [openingHoursJsonLd()],
		sameAs: [
			siteConfig.googleBusinessUrl,
			siteConfig.social.facebook,
			siteConfig.social.instagram,
			siteConfig.social.linkedin,
		],
		knowsAbout: [
			"Plumbing repair",
			"Septic systems",
			"Drain cleaning",
			"Water heaters",
			"Engineered septic systems",
		],
		...(offerCatalog ? { hasOfferCatalog: offerCatalog } : {}),
	}
}

export function articleJsonLd(document: ContentDocument) {
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: document.title,
		description: document.description,
		datePublished: document.date,
		dateModified: document.updated ?? document.date,
		image: absoluteUrl(
			document.image ?? "/images/work/precision-valve-installation.webp",
		),
		author: {
			"@type": "Organization",
			"@id": businessId,
			name: siteConfig.name,
			url: siteConfig.url,
		},
		publisher: {
			"@type": "Organization",
			"@id": businessId,
			name: siteConfig.name,
			logo: {
				"@type": "ImageObject",
				url: absoluteUrl("/images/brand/wades-mark.webp"),
			},
		},
		mainEntityOfPage: absoluteUrl(`/${document.slug}`),
	}
}

export function webPageJsonLd(document: ContentDocument) {
	return {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: document.title,
		description: document.description,
		url: absoluteUrl(`/${document.slug}`),
		isPartOf: {
			"@id": websiteId,
		},
		about: {
			"@id": businessId,
		},
	}
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: absoluteUrl(item.path),
		})),
	}
}

export function faqPageJsonLd(
	faqs: Array<{ question: string; answer: string }>,
) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	}
}

/**
 * Service page node: what the service is, where it is offered and how to book
 * it, all from siteConfig. No offers or prices (flat rate, quoted on site).
 */
export function serviceJsonLd(service: ContentDocument) {
	const url = absoluteUrl(`/service-offerings/${service.slug}`)
	const hours = openingHoursJsonLd()
	return {
		"@context": "https://schema.org",
		"@type": "Service",
		"@id": `${url}#service`,
		name: service.title,
		description: service.description,
		url,
		serviceType: service.category ?? "Service",
		category: service.category,
		areaServed: [
			{ "@type": "AdministrativeArea", name: "Santa Cruz County, California" },
			{ "@type": "AdministrativeArea", name: "Santa Clara County, California" },
		],
		provider: { "@id": businessId },
		brand: { "@type": "Brand", name: siteConfig.name },
		hoursAvailable: hours,
		availableChannel: {
			"@type": "ServiceChannel",
			serviceUrl: absoluteUrl("/contact"),
			servicePhone: {
				"@type": "ContactPoint",
				telephone: siteConfig.phoneE164,
				contactType: "customer service",
				hoursAvailable: hours,
			},
		},
	}
}

/**
 * FAQ answers that repeat claims still waiting on Byron's confirmation
 * (guarantees, insurance, certification, length of experience). They stay
 * visible on the page as written but are not amplified into structured data.
 */
const heldFaqClaim = /guarantee|warrant|insured|certified|years of experience/i

/** FAQPage for a service page, built from the same pairs the page shows. */
export function serviceFaqJsonLd(
	faqs: Array<{ question: string; answer: string }>,
) {
	const eligible = faqs.filter(
		(faq) =>
			faq.question.trim().endsWith("?") &&
			!heldFaqClaim.test(`${faq.question} ${faq.answer}`),
	)
	return eligible.length ? faqPageJsonLd(eligible) : null
}

/** Pull ### Question / answer pairs from markdown for FAQPage schema. */
export function extractFaqPairs(markdown: string) {
	const pairs: Array<{ question: string; answer: string }> = []
	const blocks = markdown.split(/^###\s+/m).slice(1)

	for (const block of blocks) {
		const newline = block.indexOf("\n")
		if (newline === -1) continue
		const question = block.slice(0, newline).trim()
		const answer = block
			.slice(newline + 1)
			.split(/\n##\s+/)[0]
			?.replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
			.replace(/[#>*_`]/g, "")
			.replace(/\s+/g, " ")
			.trim()
		if (question && answer && answer.length > 20) {
			pairs.push({ question, answer })
		}
	}

	return pairs
}

/** Reuse only the communities and counties already shown in the coverage map. */
export function serviceAreaPlaceJsonLd(location: ServiceAreaLocation) {
	return {
		"@type": "Place",
		"@id": `${absoluteUrl(location.href)}#area`,
		name: location.name,
		url: absoluteUrl(location.href),
		containedInPlace: {
			"@type": "AdministrativeArea",
			name: `${location.county}, California`,
		},
	}
}

export function serviceAreasJsonLd() {
	return [
		{ "@type": "AdministrativeArea", name: "Santa Cruz County, California" },
		{ "@type": "AdministrativeArea", name: "Santa Clara County, California" },
		...serviceAreaLocations.map(serviceAreaPlaceJsonLd),
	]
}

export function serviceAreaJsonLd(document: ContentDocument, cityName: string) {
	const location = serviceAreaLocations.find(
		(area) => area.href === `/${document.slug}`,
	)
	return {
		"@context": "https://schema.org",
		"@type": "Service",
		name: `${document.title}`,
		description: document.description,
		url: absoluteUrl(`/${document.slug}`),
		serviceType: "Plumbing and septic services",
		provider: { "@id": businessId },
		areaServed: location
			? serviceAreaPlaceJsonLd(location)
			: { "@type": "Place", name: cityName },
	}
}

export function definedTermJsonLd({
	name,
	description,
	url,
	inDefinedTermSet,
}: {
	name: string
	description: string
	url: string
	inDefinedTermSet: string
}) {
	return {
		"@context": "https://schema.org",
		"@type": "DefinedTerm",
		name,
		description,
		url: absoluteUrl(url),
		inDefinedTermSet: absoluteUrl(inDefinedTermSet),
	}
}

export function definedTermSetJsonLd({
	name,
	description,
	url,
	terms,
}: {
	name: string
	description: string
	url: string
	terms: Array<{ name: string; description: string; url: string }>
}) {
	return {
		"@context": "https://schema.org",
		"@type": "DefinedTermSet",
		name,
		description,
		url: absoluteUrl(url),
		hasDefinedTerm: terms.map((term) => ({
			"@type": "DefinedTerm",
			name: term.name,
			description: term.description,
			url: absoluteUrl(term.url),
			inDefinedTermSet: absoluteUrl(url),
		})),
	}
}

/** Best-effort city label from service-area slug or title. */
export function cityNameFromServiceArea(document: ContentDocument) {
	const location = serviceAreaLocations.find(
		(area) => area.href === `/${document.slug}`,
	)
	if (location) return location.name

	const fromSlug = document.slug
		.replace(/^service-area\//, "")
		.replace(/-ca-plumbing-septic-services$/, "")
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ")
	if (fromSlug && fromSlug.length > 2) return fromSlug

	const titleMatch = document.title.match(
		/^(.+?)\s+(?:Plumbing|CA|California)/i,
	)
	return titleMatch?.[1]?.trim() || document.title
}
