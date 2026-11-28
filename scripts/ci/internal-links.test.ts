import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"
import matter from "gray-matter"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { CityServiceGuides } from "../../components/city-service-guides"
import { ContentCard } from "../../components/content-card"
import { GuideLocalLinks } from "../../components/guide-local-links"
import { RelatedContentSections } from "../../components/related-content"
import { ServiceDirectory } from "../../components/service-directory"
import { ServiceTownLinks } from "../../components/service-town-links"
import { TownPageLinks } from "../../components/town-page-links"
import { freeQuoteCtaLabel, freeQuoteHref } from "../../lib/public-facts"
import { relatedTownsFor } from "../../lib/related-towns"
import {
	rankDocuments,
	scoreCandidate,
	seedFromDocument,
	type RelatedSeedDocument,
} from "../../lib/related-score"
import { cityServicePages, cityServicePath } from "../../lib/city-service-pages"
import { serviceAreaLocations } from "../../lib/service-areas"
import { townGuideLinks } from "../../lib/town-page-links"

const postsDir = path.join("content", "posts")
const servicesDir = path.join("content", "services")

function markdownBody(file: string) {
	return fs
		.readFileSync(file, "utf8")
		.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
}

test("every blog post maps to 1 to 3 town pages for internal links", () => {
	const files = fs.readdirSync(postsDir).filter((name) => name.endsWith(".md"))
	assert.ok(files.length > 0)
	for (const file of files) {
		const towns = relatedTownsFor(markdownBody(path.join(postsDir, file)))
		assert.ok(
			towns.length >= 1 && towns.length <= 3,
			`${file}: ${towns.map((item) => item.slug).join(",")}`,
		)
		for (const town of towns) {
			assert.ok(
				serviceAreaLocations.some((location) => location.slug === town.slug),
				town.slug,
			)
		}
	}
})

test("guide local links use descriptive service and town anchors", () => {
	const html = renderToStaticMarkup(
		createElement(GuideLocalLinks, {
			services: [
				{
					slug: "drain-cleaning",
					title: "Drain Cleaning in Santa Cruz County",
					description: "Drain cleaning",
					category: "Plumbing",
					href: "/service-offerings/drain-cleaning",
				},
			],
			towns: [
				{
					slug: "aptos",
					title: "Aptos plumbing and septic",
					description: "Aptos",
					category: "Santa Cruz County",
					href: "/service-area/aptos-ca-plumbing-septic-services",
				},
			],
		}),
	)
	assert.ok(html.includes("Drain Cleaning in Santa Cruz County"), html)
	assert.ok(html.includes("/service-offerings/drain-cleaning"), html)
	assert.ok(html.includes("Aptos plumbing and septic"), html)
	assert.ok(
		html.includes("/service-area/aptos-ca-plumbing-septic-services"),
		html,
	)
})

test("service pages name towns with descriptive plumbing and septic anchors", () => {
	const html = renderToStaticMarkup(createElement(ServiceTownLinks))
	assert.ok(html.includes("Santa Cruz plumbing and septic"), html)
	assert.ok(
		html.includes("/service-area/santa-cruz-ca-plumbing-septic-services"),
		html,
	)
	assert.ok(html.includes("Santa Cruz County"), html)
})

test("town hubs can exclude themselves from related town chips", () => {
	const slug = "service-area/los-gatos-ca-plumbing-septic-services"
	const towns = relatedTownsFor(
		"Los Gatos, CA Plumbing & Septic Services selected coverage in Los Gatos",
		3,
		[slug],
	)
	assert.ok(towns.length >= 1 && towns.length <= 3)
	assert.ok(
		!towns.some((town) => town.slug === "los-gatos"),
		towns.map((town) => town.slug).join(","),
	)
})

test("related town chips use capped overflow wrap", () => {
	const html = renderToStaticMarkup(
		createElement(RelatedContentSections, {
			related: {
				posts: [],
				services: [],
				towns: [
					{
						slug: "aptos-hills-larkin-valley",
						title: "Aptos Hills-Larkin Valley plumbing and septic",
						description: "Aptos Hills-Larkin Valley",
						category: "Santa Cruz County",
						href: "/service-area/aptos-hills-larkin-valley-ca-plumbing-septic-services",
					},
				],
			},
		}),
	)
	assert.ok(html.includes("[overflow-wrap:anywhere]"), html)
	assert.ok(html.includes("max-w-full"), html)
	assert.ok(
		html.includes("Aptos Hills-Larkin Valley plumbing and septic"),
		html,
	)
})

test("city x service spokes are linked from their town hubs", () => {
	for (const page of cityServicePages) {
		const location = serviceAreaLocations.find(
			(item) => item.slug === page.citySlug,
		)
		assert.ok(location, page.citySlug)
		const html = renderToStaticMarkup(
			createElement(CityServiceGuides, { pathname: location!.href }),
		)
		const pathName = cityServicePath(page.citySlug, page.serviceSlug)
		assert.ok(
			html.includes(pathName),
			`${pathName} missing from ${location!.href}`,
		)
		assert.ok(
			html.includes(`${page.serviceTitle} in ${location!.name}`),
			page.serviceTitle,
		)
	}
})

test("every service markdown file exists for city x service spokes", () => {
	for (const page of cityServicePages) {
		const file = path.join(servicesDir, `${page.serviceSlug}.md`)
		assert.ok(fs.existsSync(file), file)
	}
})

test("service cards name the destination instead of Learn more", () => {
	const html = renderToStaticMarkup(
		createElement(ContentCard, {
			item: {
				slug: "hydro-jetting",
				title: "Hydro Jetting",
				description: "Clear stubborn drains.",
				category: "Plumbing",
				href: "/service-offerings/hydro-jetting",
			},
			variant: "service",
		}),
	)
	assert.doesNotMatch(html, />Learn more</)
	assert.ok(html.includes('aria-label="View Hydro Jetting"'), html)
	assert.ok(html.includes("View service"), html)
})

test("home lists every town and the services directory lists every service", () => {
	const home = fs.readFileSync("components/home-below-fold.tsx", "utf8")
	assert.ok(home.includes("locationsByCounty(county).map((town)"))
	assert.ok(home.includes("town.href"))

	const services = fs
		.readdirSync(servicesDir)
		.filter((name) => name.endsWith(".md"))
		.map((name) => {
			const raw = fs.readFileSync(path.join(servicesDir, name), "utf8")
			return {
				slug: name.replace(/\.md$/, ""),
				title: raw.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1]?.trim() ?? name,
				category: raw.match(/^category:\s*(.+)$/m)?.[1]?.trim(),
			}
		})
	assert.ok(services.length > 20)
	const html = renderToStaticMarkup(
		createElement(ServiceDirectory, { services }),
	)
	for (const service of services)
		assert.ok(html.includes(`/service-offerings/${service.slug}`), service.slug)
})

test("glossary term pages keep the same Call and Free Quote band as glossary hubs", () => {
	const source = fs.readFileSync(
		path.join("components", "glossary-term-page.tsx"),
		"utf8",
	)
	assert.match(source, /<ContactCta/)
	assert.match(source, /Need this explained for your home\?/)
	assert.ok(freeQuoteCtaLabel)
	assert.ok(freeQuoteHref.startsWith("/contact"))
})

function walkMarkdown(dir: string): string[] {
	const files: string[] = []
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name)
		if (entry.isDirectory()) files.push(...walkMarkdown(full))
		else if (entry.name.endsWith(".md")) files.push(full)
	}
	return files
}

function markdownHrefs(file: string) {
	return [...markdownBody(file).matchAll(/\]\((\/(?!\/)[^)\s#?]*)/g)].map(
		(match) => match[1]!.replace(/\/$/, "") || "/",
	)
}

function parseSeed(file: string): RelatedSeedDocument {
	const { data, content } = matter(fs.readFileSync(file, "utf8"))
	return {
		slug: path.basename(file, ".md"),
		title:
			typeof data.title === "string" ? data.title : path.basename(file, ".md"),
		description: typeof data.description === "string" ? data.description : "",
		content,
		category: typeof data.category === "string" ? data.category : undefined,
		tags: Array.isArray(data.tags)
			? data.tags.map((tag) => String(tag))
			: undefined,
	}
}

test("every blog post links a service page and a town or service-areas hub", () => {
	const files = fs.readdirSync(postsDir).filter((name) => name.endsWith(".md"))
	assert.ok(files.length > 0)
	for (const file of files) {
		const hrefs = markdownHrefs(path.join(postsDir, file))
		assert.ok(
			hrefs.some((href) => href.startsWith("/service-offerings/")),
			`${file} has no service page link`,
		)
		assert.ok(
			hrefs.some(
				(href) =>
					href === "/service-areas" || href.startsWith("/service-area/"),
			),
			`${file} has no town or service-areas link`,
		)
	}
})

test("indexable money pages are not markdown orphans", () => {
	const inbound = new Map<string, string[]>()
	function add(href: string, from: string) {
		const list = inbound.get(href) ?? []
		list.push(from)
		inbound.set(href, list)
	}

	for (const file of walkMarkdown("content")) {
		for (const href of markdownHrefs(file)) add(href, file)
	}

	const required = [
		"/facts",
		"/maintenance-guide",
		"/septic-solutions",
		"/compare/conventional-vs-engineered-septic",
		"/compare/hydro-jetting-vs-snaking",
		"/compare/repair-vs-replace-water-heater",
		...fs
			.readdirSync(servicesDir)
			.filter((name) => name.endsWith(".md"))
			.map((name) => `/service-offerings/${name.replace(/\.md$/, "")}`),
	]

	const missing = required.filter(
		(href) => (inbound.get(href) ?? []).length < 1,
	)
	assert.deepEqual(missing, [])
})

test("town hubs keep 2 to 4 homeowner guide links", () => {
	assert.ok(townGuideLinks.length >= 2 && townGuideLinks.length <= 4)
	assert.ok(townGuideLinks.some((guide) => guide.href === "/maintenance-guide"))
	const html = renderToStaticMarkup(
		createElement(TownPageLinks, {
			pathname: "/service-area/felton-ca-plumbing-septic-services",
		}),
	)
	for (const guide of townGuideLinks) {
		assert.ok(html.includes(guide.href), guide.href)
	}
})

test("every service and town topic ranks 2 to 4 related guides", () => {
	const posts = fs
		.readdirSync(postsDir)
		.filter((name) => name.endsWith(".md"))
		.map((name) => parseSeed(path.join(postsDir, name)))
	assert.ok(posts.length > 20)

	const services = fs
		.readdirSync(servicesDir)
		.filter((name) => name.endsWith(".md"))
		.map((name) => parseSeed(path.join(servicesDir, name)))

	for (const service of services) {
		const related = rankDocuments(
			seedFromDocument(service),
			posts,
			"post",
			4,
			new Set([service.slug]),
		)
		assert.ok(
			related.length >= 2 && related.length <= 4,
			`${service.slug}: ${related.length} related guides`,
		)
	}

	for (const location of serviceAreaLocations) {
		const related = rankDocuments(
			seedFromDocument({
				slug: `__topic__${location.slug}`,
				title: `${location.name} plumbing and septic`,
				description: `${location.name} plumbing and septic`,
				content: `${location.name} plumbing septic`,
				tags: ["plumbing", "septic"],
			}),
			posts,
			"post",
			4,
		)
		assert.ok(
			related.length >= 2 && related.length <= 4,
			`${location.slug}: ${related.length} related guides`,
		)
	}
})

test("water heater related guides stay on water heater topics", () => {
	const posts = fs
		.readdirSync(postsDir)
		.filter((name) => name.endsWith(".md"))
		.map((name) => parseSeed(path.join(postsDir, name)))
	const heater = parseSeed(
		path.join(servicesDir, "water-heater-installation.md"),
	)
	const related = rankDocuments(seedFromDocument(heater), posts, "post", 4)
	assert.ok(
		related.some(
			(post) =>
				post.slug.includes("water-heater") || post.slug.includes("tankless"),
		),
		related.map((post) => post.slug).join(", "),
	)
	assert.ok(
		related.every(
			(post) =>
				/water.?heater|tankless/i.test(`${post.slug} ${post.title}`) ||
				!/septic/i.test(post.slug),
		),
		related.map((post) => post.slug).join(", "),
	)
})

test("mixed plumbing and septic hubs keep both heater and septic guides", () => {
	const posts = fs
		.readdirSync(postsDir)
		.filter((name) => name.endsWith(".md"))
		.map((name) => parseSeed(path.join(postsDir, name)))
	const heaterPost = posts.find(
		(post) =>
			post.slug.includes("water-heater") || post.slug.includes("tankless"),
	)
	const septicPost = posts.find(
		(post) =>
			post.slug.includes("septic") && !post.slug.includes("water-heater"),
	)
	assert.ok(heaterPost, "expected a water heater post")
	assert.ok(septicPost, "expected a septic post")

	const townSeed = seedFromDocument({
		slug: "__topic__felton-ca-plumbing-septic-services",
		title: "Felton plumbing and septic",
		description: "Felton plumbing and septic",
		content: "Felton plumbing septic",
		tags: ["plumbing", "septic"],
	})
	const maintenanceSeed = seedFromDocument(
		parseSeed(path.join("content", "pages", "maintenance-guide.md")),
	)

	assert.ok(
		scoreCandidate(townSeed, heaterPost!, "post") > 0,
		"town hub dropped a water heater guide",
	)
	assert.ok(
		scoreCandidate(townSeed, septicPost!, "post") > 0,
		"town hub dropped a septic guide",
	)
	assert.ok(
		scoreCandidate(maintenanceSeed, heaterPost!, "post") > 0,
		"maintenance guide dropped a water heater post",
	)
	assert.ok(
		scoreCandidate(maintenanceSeed, septicPost!, "post") > 0,
		"maintenance guide dropped a septic post",
	)
})
