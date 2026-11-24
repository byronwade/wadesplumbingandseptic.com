import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { CityServiceGuides } from "../../components/city-service-guides"
import { GuideLocalLinks } from "../../components/guide-local-links"
import { RelatedContentSections } from "../../components/related-content"
import { ServiceTownLinks } from "../../components/service-town-links"
import { relatedTownsFor } from "../../lib/related-towns"
import { cityServicePages, cityServicePath } from "../../lib/city-service-pages"
import { serviceAreaLocations } from "../../lib/service-areas"

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
