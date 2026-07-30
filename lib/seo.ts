import type { Metadata } from "next"

import type { ContentDocument } from "@/lib/content"
import { buildOgImagePath, defaultOgEyebrow } from "@/lib/og"
import { siteConfig } from "@/lib/site"

export function absoluteUrl(pathname: string) {
	if (pathname.startsWith("http")) return pathname
	return `${siteConfig.url}${pathname.startsWith("/") ? pathname : `/${pathname}`}`
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
	const ogImage = buildOgImagePath({
		title,
		eyebrow: eyebrow ?? defaultOgEyebrow(type),
		image: image ?? "/images/work/precision-valve-installation.webp",
	})

	return {
		title,
		description,
		alternates: { canonical: pathname },
		openGraph: {
			title,
			description,
			url,
			type,
			siteName: siteConfig.name,
			locale: "en_US",
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImage],
		},
		robots: noindex ? { index: false, follow: false } : undefined,
	}
}

export function websiteJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${siteConfig.url}/#website`,
		name: siteConfig.name,
		url: siteConfig.url,
		description: siteConfig.description,
		publisher: { "@id": `${siteConfig.url}/#business` },
		inLanguage: "en-US",
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
							provider: { "@id": `${siteConfig.url}/#business` },
						},
					})),
				}
			: undefined

	return {
		"@context": "https://schema.org",
		"@type": ["Plumber", "LocalBusiness", "HomeAndConstructionBusiness"],
		"@id": `${siteConfig.url}/#business`,
		name: siteConfig.name,
		url: siteConfig.url,
		telephone: "+18312254344",
		email: siteConfig.email,
		logo: absoluteUrl("/images/brand/wades-mark.webp"),
		image: absoluteUrl("/images/locations/santa-cruz-plumber.webp"),
		priceRange: "$$",
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
		areaServed: [
			{ "@type": "AdministrativeArea", name: "Santa Cruz County, California" },
			{ "@type": "AdministrativeArea", name: "Santa Clara County, California" },
		],
		openingHoursSpecification: [
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
				opens: "09:00",
				closes: "17:00",
			},
		],
		sameAs: [
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
			name: siteConfig.name,
			url: siteConfig.url,
		},
		publisher: {
			"@type": "Organization",
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
			"@id": `${siteConfig.url}/#website`,
		},
		about: {
			"@id": `${siteConfig.url}/#business`,
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

export function serviceAreaJsonLd(
	document: ContentDocument,
	cityName: string,
) {
	return {
		"@context": "https://schema.org",
		"@type": "Service",
		name: `${document.title}`,
		description: document.description,
		url: absoluteUrl(`/${document.slug}`),
		serviceType: "Plumbing and septic services",
		provider: { "@id": `${siteConfig.url}/#business` },
		areaServed: {
			"@type": "City",
			name: cityName,
			containedInPlace: {
				"@type": "AdministrativeArea",
				name: "Santa Cruz County, California",
			},
		},
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
