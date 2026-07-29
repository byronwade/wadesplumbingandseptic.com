import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import { getCollection } from "@/lib/content"
import { getServiceImage } from "@/lib/service-images"
import type { SearchDocument } from "@/lib/search"
import {
	companyNavigation,
	primaryNavigation,
	resourceNavigation,
	siteConfig,
} from "@/lib/site"

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

export async function getSearchIndex(): Promise<SearchDocument[]> {
	"use cache"
	cacheTag("content:search-index")
	cacheLife("max")

	const [services, posts, pages] = await Promise.all([
		getCollection("services"),
		getCollection("posts"),
		getCollection("pages"),
	])

	const serviceDocs: SearchDocument[] = services.map((service, index) => ({
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
	}))

	const tipDocs: SearchDocument[] = posts.map((post, index) => ({
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
	}))

	const pageAllowlist = new Set([
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
		.filter(
			(page) =>
				pageAllowlist.has(page.slug) || page.slug.startsWith("service-area/"),
		)
		.map((page, index) => ({
			id: `page:${page.slug}`,
			type: "page" as const,
			title: page.title,
			description: page.description,
			href: `/${page.slug}`,
			category: page.eyebrow ?? "Page",
			image: page.image,
			keywords: keywordsFromText(
				page.title,
				page.description,
				page.eyebrow,
				page.slug.replaceAll("-", " ").replaceAll("/", " "),
			),
			popularity: pageAllowlist.has(page.slug) ? 20 - index : 5,
		}))

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
		popularity: 18 - index,
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
				siteConfig.phone,
			),
			popularity: 50,
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

	return [...deduped.values()]
}
