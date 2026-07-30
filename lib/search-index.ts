import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import { getCollection } from "@/lib/content"
import { getAllGlossaryEntries } from "@/lib/glossary"
import { getServiceImage } from "@/lib/service-images"
import type { SearchDocument, SearchIntent } from "@/lib/search"
import {
	companyNavigation,
	primaryNavigation,
	resourceNavigation,
	siteConfig,
} from "@/lib/site"

const SERVICE_POPULARITY: Record<string, number> = {
	"engineered-septic-system-installation": 52,
	"drain-cleaning": 48,
	"septic-tank-cleaning-and-pumping": 47,
	"hydro-jetting": 45,
	"leak-detection": 44,
	"sewer-camera-inspection": 43,
	"tankless-water-heater-installation": 42,
	"water-heater-installation": 41,
	"toilet-repair": 40,
	"garbage-disposal-installation": 38,
	"septic-tank-inspection-and-assessment": 37,
	"trenchless-sewer-line-replacement": 36,
	"septic-tank-design-and-engineering": 35,
	"backflow-prevention-testing": 34,
}

const CATEGORY_INTENTS: Record<string, SearchIntent[]> = {
	Plumbing: ["service"],
	Septic: ["service"],
	Commercial: ["service"],
}

function keywordsFromText(...parts: Array<string | undefined | null>) {
	const values = parts
		.filter(Boolean)
		.join(" ")
		.toLowerCase()
		.replace(/[^a-z0-9\s/-]/g, " ")
		.split(/\s+/)
		.filter((token) => token.length > 2)

	return [...new Set(values)]
}

function stripMarkdown(value: string) {
	return value
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`[^`]*`/g, " ")
		.replace(/!\[[^\]]*]\([^)]*\)/g, " ")
		.replace(/\[[^\]]*]\([^)]*\)/g, " ")
		.replace(/^#{1,6}\s+/gm, " ")
		.replace(/[*_>~-]+/g, " ")
		.replace(/\s+/g, " ")
		.trim()
}

/** Utility pages that should not appear in site search. */
const SEARCH_EXCLUDE_SLUGS = new Set(["thank-you", "contact-call-first"])

function bodyExcerpt(content: string, maxChars = 2400) {
	const cleaned = stripMarkdown(content)
	if (cleaned.length <= maxChars) return cleaned
	return cleaned.slice(0, maxChars)
}

function cityFromAreaSlug(slug: string) {
	const leaf = slug.split("/").pop() ?? slug
	return leaf
		.replace(/-ca-plumbing-septic-services$/i, "")
		.replace(/-/g, " ")
		.trim()
}

function serviceBoostKeywords(title: string, category?: string) {
	const haystack = `${title} ${category ?? ""}`.toLowerCase()
	const extras: string[] = []

	if (haystack.includes("drain"))
		extras.push("clog", "clogged", "backup", "slow")
	if (haystack.includes("septic"))
		extras.push("tank", "pumping", "leach", "odor")
	if (haystack.includes("heater"))
		extras.push("hot water", "tankless", "no hot water")
	if (haystack.includes("leak")) extras.push("drip", "burst", "slab")
	if (haystack.includes("toilet")) extras.push("flush", "running", "commode")
	if (haystack.includes("camera") || haystack.includes("inspection")) {
		extras.push("video", "diagnose", "locate")
	}
	if (haystack.includes("jetting")) extras.push("hydro", "pressure", "roots")
	if (haystack.includes("grease"))
		extras.push("restaurant", "commercial", "interceptor")
	if (haystack.includes("backflow")) extras.push("testing", "rpz", "prevention")

	return extras
}

export async function getSearchIndex(): Promise<SearchDocument[]> {
	"use cache"
	cacheTag("content:search-index")
	cacheLife("max")

	const [services, posts, pages, glossaryEntries] = await Promise.all([
		getCollection("services"),
		getCollection("posts"),
		getCollection("pages"),
		getAllGlossaryEntries(),
	])

	const serviceDocs: SearchDocument[] = services.map((service, index) => {
		const boost = SERVICE_POPULARITY[service.slug] ?? Math.max(1, 34 - index)
		const featuredBoost = service.featured ? 8 : 0
		const orderBoost =
			service.order !== undefined
				? Math.max(0, 12 - Math.floor(service.order / 5))
				: 0

		return {
			id: `service:${service.slug}`,
			type: "service",
			title: service.title,
			description: service.description,
			href: `/service-offerings/${service.slug}`,
			category: service.category ?? "Service",
			image: getServiceImage(service.category, service.image),
			keywords: keywordsFromText(
				service.title,
				service.description,
				service.category,
				service.slug.replaceAll("-", " "),
				...(service.tags ?? []),
				...serviceBoostKeywords(service.title, service.category),
			),
			body: bodyExcerpt(service.content, 3200),
			popularity: boost + featuredBoost + orderBoost,
			intents: CATEGORY_INTENTS[service.category ?? ""] ?? ["service"],
		}
	})

	const tipDocs: SearchDocument[] = posts.map((post, index) => {
		// Prefer tagged / categorized guides slightly without using Date.now()
		// (keeps the cached index deterministic).
		const topicBoost = (post.tags?.length ?? 0) > 0 ? 3 : 0

		return {
			id: `tip:${post.slug}`,
			type: "tip",
			title: post.title,
			description: post.description,
			href: `/${post.slug}`,
			category: post.category ?? "Expert Tip",
			image: post.image ?? "/images/team/byron-working.webp",
			keywords: keywordsFromText(
				post.title,
				post.description,
				post.category,
				post.slug.replaceAll("-", " "),
				...(post.tags ?? []),
				"guide",
				"tips",
				"how to",
			),
			body: bodyExcerpt(post.content, 3200),
			popularity: Math.max(1, 28 - index) + topicBoost,
			intents: ["tip"],
		}
	})

	const priorityPages = new Set([
		"about-us",
		"contact",
		"service-areas",
		"faq",
		"financing",
		"warranties",
		"careers",
		"septic-solutions",
		"maintenance-guide",
		"testimonials",
		"emergency-plumber-santa-cruz-county",
	])

	const pageDocs: SearchDocument[] = pages
		.filter((page) => !SEARCH_EXCLUDE_SLUGS.has(page.slug))
		.map((page, index) => {
			const isArea = page.slug.startsWith("service-area/")
			const isCareer = page.slug.startsWith("careers/")
			const city = isArea ? cityFromAreaSlug(page.slug) : ""
			const isPriority = priorityPages.has(page.slug)

			return {
				id: `page:${page.slug}`,
				type: "page" as const,
				title: page.title,
				description: page.description,
				href: `/${page.slug}`,
				category: isArea
					? "Service Area"
					: isCareer
						? "Careers"
						: (page.eyebrow ?? "Page"),
				image: page.image,
				keywords: keywordsFromText(
					page.title,
					page.description,
					page.eyebrow,
					page.slug.replaceAll("-", " ").replaceAll("/", " "),
					city,
					isArea ? "near me service area city" : "",
					isCareer ? "job careers hiring" : "",
				),
				body: bodyExcerpt(page.content, 2400),
				popularity: isPriority
					? 22 - Math.min(index, 20)
					: isArea
						? 12
						: isCareer
							? 14
							: 10,
				intents: isArea
					? (["area", "service"] as SearchIntent[])
					: page.slug === "contact"
						? (["quote", "call"] as SearchIntent[])
						: isCareer
							? (["browse"] as SearchIntent[])
							: (["browse"] as SearchIntent[]),
			}
		})

	const categoryDocs: SearchDocument[] = [
		{
			id: "category:plumbing",
			type: "page",
			title: "Plumbing Services",
			description: "Browse residential and commercial plumbing services.",
			href: "/service-category/plumbing",
			category: "Category",
			keywords: keywordsFromText(
				"plumbing",
				"drains",
				"pipes",
				"fixtures",
				"water heater",
			),
			popularity: 32,
			intents: ["service", "browse"],
		},
		{
			id: "category:septic",
			type: "page",
			title: "Septic Services",
			description:
				"Pumping, inspections, repairs, and engineered septic systems.",
			href: "/service-category/septic",
			category: "Category",
			keywords: keywordsFromText(
				"septic",
				"tank",
				"pumping",
				"leach field",
				"drainfield",
			),
			popularity: 31,
			intents: ["service", "browse"],
		},
		{
			id: "category:commercial",
			type: "page",
			title: "Commercial Plumbing",
			description: "Grease traps, backflow, and commercial maintenance.",
			href: "/service-category/commercial",
			category: "Category",
			keywords: keywordsFromText(
				"commercial",
				"restaurant",
				"grease trap",
				"business",
			),
			popularity: 26,
			intents: ["service", "browse"],
		},
	]

	const glossaryDocs: SearchDocument[] = [
		{
			id: "glossary:index",
			type: "page",
			title: "Plumbing & Septic Glossary",
			description:
				"Plain-English plumbing and septic definitions for Santa Cruz County homeowners.",
			href: "/glossary",
			category: "Glossary",
			keywords: keywordsFromText(
				"glossary",
				"plumbing terms",
				"septic terms",
				"definitions",
				"dictionary",
			),
			popularity: 28,
			intents: ["browse", "tip"],
		},
		...glossaryEntries.map(({ topic, term }, index) => ({
			id: `glossary:${topic}:${term.slug}`,
			type: "page" as const,
			title: term.term,
			description: term.shortDefinition,
			href: `/glossary/${topic}/${term.slug}`,
			category: topic === "plumbing" ? "Plumbing Glossary" : "Septic Glossary",
			keywords: keywordsFromText(
				term.term,
				term.shortDefinition,
				topic,
				"glossary",
				"definition",
				...(term.alsoKnownAs ?? []),
				term.slug.replaceAll("-", " "),
			),
			body: [term.definition, term.localContext, term.homeownerTip].join(" "),
			popularity: Math.max(8, 22 - Math.floor(index / 8)),
			intents: ["tip", "browse"] as SearchIntent[],
		})),
	]

	const navDocs: SearchDocument[] = [
		...primaryNavigation,
		...companyNavigation,
		...resourceNavigation,
	].map((item, index) => ({
		id: `nav:${item.href}`,
		type: "page" as const,
		title: item.label,
		description: `Browse ${item.label} on Wade's Plumbing & Septic.`,
		href: item.href,
		category: "Navigation",
		keywords: keywordsFromText(item.label, item.href.replaceAll("/", " ")),
		popularity: 16 - index,
		intents: ["browse"] as SearchIntent[],
	}))

	const actionDocs: SearchDocument[] = [
		{
			id: "action:call",
			type: "action",
			title: `Call ${siteConfig.phone}`,
			description:
				"Speak with Wade's during business hours for scheduling and advice.",
			href: siteConfig.phoneHref,
			category: "Action",
			keywords: keywordsFromText(
				"call",
				"phone",
				"schedule",
				"book",
				"appointment",
				siteConfig.phone,
			),
			popularity: 55,
			intents: ["call"],
		},
		{
			id: "action:contact",
			type: "action",
			title: "Get a Free Quote",
			description: "Send project details and request a clear estimate.",
			href: "/contact",
			category: "Action",
			keywords: keywordsFromText(
				"quote",
				"estimate",
				"contact",
				"message",
				"price",
				"cost",
			),
			popularity: 50,
			intents: ["quote"],
		},
		{
			id: "action:services",
			type: "action",
			title: "Browse all services",
			description: "See the full plumbing and septic service menu.",
			href: "/services",
			category: "Action",
			keywords: keywordsFromText("services", "menu", "plumbing", "septic"),
			popularity: 44,
			intents: ["browse", "service"],
		},
		{
			id: "action:tips",
			type: "action",
			title: "Browse expert tips",
			description: "Homeowner guides for plumbing and septic care.",
			href: "/expert-tips",
			category: "Action",
			keywords: keywordsFromText(
				"tips",
				"blog",
				"guides",
				"advice",
				"articles",
				"how to",
				"diy",
			),
			popularity: 42,
			intents: ["tip", "browse"],
		},
		{
			id: "action:areas",
			type: "action",
			title: "View service areas",
			description: "See the Central Coast communities we serve on the map.",
			href: "/service-areas",
			category: "Action",
			keywords: keywordsFromText(
				"service areas",
				"near me",
				"santa cruz",
				"coverage",
			),
			popularity: 40,
			intents: ["area", "browse"],
		},
	]

	const deduped = new Map<string, SearchDocument>()
	for (const document of [
		...actionDocs,
		...categoryDocs,
		...glossaryDocs,
		...serviceDocs,
		...tipDocs,
		...pageDocs,
		...navDocs,
	]) {
		const existing = deduped.get(document.href)
		if (!existing || (document.popularity ?? 0) > (existing.popularity ?? 0)) {
			deduped.set(document.href, document)
		}
	}

	return [...deduped.values()]
}
