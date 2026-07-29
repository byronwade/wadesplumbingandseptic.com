import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import { getCollection } from "@/lib/content"
import { getServiceImage } from "@/lib/service-images"
import {
	buildInvertedIndex,
	plainTextFromMarkdown,
	type SearchDocument,
	type SearchIndexPayload,
} from "@/lib/search"
import {
	companyNavigation,
	primaryNavigation,
	resourceNavigation,
	siteConfig,
} from "@/lib/site"

/** Utility pages that should not appear in site search. */
const SEARCH_EXCLUDE_SLUGS = new Set(["thank-you", "contact-call-first"])

function keywordsFromText(...parts: Array<string | undefined>) {
	const values = parts
		.filter(Boolean)
		.join(" ")
		.toLowerCase()
		.replace(/[^a-z0-9\s/-]/g, " ")
		.split(/\s+/)
		.filter((token) => token.length > 2)

	return [...new Set(values)]
}

function withBody(
	document: Omit<SearchDocument, "body">,
	markdown?: string,
): SearchDocument {
	return {
		...document,
		body: markdown ? plainTextFromMarkdown(markdown) : "",
	}
}

export async function getSearchIndex(): Promise<SearchIndexPayload> {
	"use cache"
	cacheTag("content:search-index")
	cacheLife("max")

	const [services, posts, pages] = await Promise.all([
		getCollection("services"),
		getCollection("posts"),
		getCollection("pages"),
	])

	const serviceDocs: SearchDocument[] = services.map((service, index) =>
		withBody(
			{
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
				),
				popularity: Math.max(1, 40 - index),
			},
			service.content,
		),
	)

	const tipDocs: SearchDocument[] = posts.map((post, index) =>
		withBody(
			{
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
				),
				popularity: Math.max(1, 30 - index),
			},
			post.content,
		),
	)

	const pageDocs: SearchDocument[] = pages
		.filter((page) => !SEARCH_EXCLUDE_SLUGS.has(page.slug))
		.map((page, index) => {
			const isServiceArea = page.slug.startsWith("service-area/")
			const isCareer = page.slug.startsWith("careers/")
			const isPriority =
				!isServiceArea &&
				!isCareer &&
				[
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
				].includes(page.slug)

			return withBody(
				{
					id: `page:${page.slug}`,
					type: "page" as const,
					title: page.title,
					description: page.description,
					href: `/${page.slug}`,
					category: page.eyebrow ?? (isServiceArea ? "Service Area" : isCareer ? "Careers" : "Page"),
					image: page.image,
					keywords: keywordsFromText(
						page.title,
						page.description,
						page.eyebrow,
						page.slug.replaceAll("-", " ").replaceAll("/", " "),
					),
					popularity: isPriority ? 22 - Math.min(index, 20) : isServiceArea ? 8 : 10,
				},
				page.content,
			)
		})

	const navDocs: SearchDocument[] = [
		...primaryNavigation,
		...companyNavigation,
		...resourceNavigation,
	].map((item, index) =>
		withBody({
			id: `nav:${item.href}`,
			type: "page" as const,
			title: item.label,
			description: `Browse ${item.label} on Wade's Plumbing & Septic.`,
			href: item.href,
			category: "Navigation",
			keywords: keywordsFromText(item.label, item.href.replaceAll("/", " ")),
			popularity: 18 - index,
		}),
	)

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
				siteConfig.phone,
			),
			popularity: 50,
			body: "call phone schedule book appointment speak with dispatcher",
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
			),
			popularity: 45,
			body: "free quote estimate contact message pricing request proposal",
		},
		{
			id: "action:services",
			type: "action",
			title: "Browse all services",
			description: "See the full plumbing and septic service menu.",
			href: "/services",
			category: "Action",
			keywords: keywordsFromText("services", "menu", "plumbing", "septic"),
			popularity: 42,
			body: "all services plumbing septic commercial menu offerings",
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
			),
			popularity: 40,
			body: "expert tips blog guides articles homeowner advice",
		},
	]

	const deduped = new Map<string, SearchDocument>()
	for (const document of [
		...actionDocs,
		...serviceDocs,
		...tipDocs,
		...pageDocs,
		...navDocs,
	]) {
		if (!deduped.has(document.href)) {
			deduped.set(document.href, document)
		}
	}

	const documents = [...deduped.values()]
	return {
		documents,
		inverted: buildInvertedIndex(documents),
	}
}
