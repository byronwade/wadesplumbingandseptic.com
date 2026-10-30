import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"

import type { ContentDocument } from "../../lib/content"
import { normalizeConversion } from "../../lib/content-conversion"
import { serviceAreaLocations } from "../../lib/service-areas"
import {
	cityNameFromServiceArea,
	localBusinessJsonLd,
	serviceAreaJsonLd,
} from "../../lib/seo"
import { siteConfig } from "../../lib/site"

function documentFor(href: string): ContentDocument {
	const slug = href.slice(1)
	const title = "Existing service-area page"
	const description = "Existing page description"
	return {
		slug,
		title,
		description,
		content: "",
		conversion: normalizeConversion(null, { slug, title, description }),
	}
}

test("business schema links every existing mapped community exactly once", () => {
	const areas = localBusinessJsonLd().areaServed
	for (const location of serviceAreaLocations) {
		const matches = areas.filter(
			(area) =>
				"@id" in area &&
				area["@id"] === `${siteConfig.url}${location.href}#area`,
		)
		assert.equal(matches.length, 1, location.name)
	}
	// One countywide entry (Santa Cruz) plus every mapped community.
	assert.equal(areas.length, serviceAreaLocations.length + 1)
	assert.ok(
		!areas.some(
			(area) =>
				(area as { name?: string }).name === "Santa Clara County, California",
		),
		"Santa Clara is covered by selected communities, never countywide",
	)
})

test("community schema reuses its existing URL, name and county", () => {
	for (const location of serviceAreaLocations) {
		const document = documentFor(location.href)
		const schema = serviceAreaJsonLd(
			document,
			cityNameFromServiceArea(document),
		)
		const area = schema.areaServed as Record<string, unknown>
		assert.equal(area.name, location.name)
		assert.equal(area.url, `${siteConfig.url}${location.href}`)
		assert.equal(area["@id"], `${siteConfig.url}${location.href}#area`)
		assert.deepEqual(area.containedInPlace, {
			"@type": "AdministrativeArea",
			name: `${location.county}, California`,
		})
		assert.equal(schema.provider["@id"], `${siteConfig.url}/#business`)
	}
})

test("Los Gatos and Saratoga are in the recorded Santa Clara county", () => {
	for (const city of ["los-gatos", "saratoga"]) {
		const document = documentFor(
			`/service-area/${city}-ca-plumbing-septic-services`,
		)
		const schema = serviceAreaJsonLd(
			document,
			cityNameFromServiceArea(document),
		)
		assert.equal(
			(schema.areaServed as { containedInPlace: { name: string } })
				.containedInPlace.name,
			"Santa Clara County, California",
		)
	}
})

test("unmapped pages never acquire an assumed county or registry entity", () => {
	const schema = serviceAreaJsonLd(
		documentFor("/service-area/unmapped"),
		"Unmapped",
	)
	assert.equal(schema.areaServed.name, "Unmapped")
	assert.ok(!("containedInPlace" in schema.areaServed))
	assert.ok(!("@id" in schema.areaServed))
})

test("business references resolve to the community pages' location entities", () => {
	const areas = localBusinessJsonLd().areaServed
	for (const location of serviceAreaLocations) {
		const document = documentFor(location.href)
		const schema = serviceAreaJsonLd(
			document,
			cityNameFromServiceArea(document),
		)
		const area = schema.areaServed as Record<string, unknown>
		assert.ok(
			areas.some((entry) => "@id" in entry && entry["@id"] === area["@id"]),
		)
	}
})

test("every mapped community links to existing content with unique identifiers", () => {
	const ids = new Set<string>()
	const slugs = new Set<string>()
	for (const location of serviceAreaLocations) {
		assert.ok(
			fs.existsSync(path.join("content/pages", `${location.href.slice(1)}.md`)),
		)
		assert.ok(!ids.has(location.href), location.href)
		assert.ok(!slugs.has(location.slug), location.slug)
		ids.add(location.href)
		slugs.add(location.slug)
	}
})

test("only the sitewide business node is typed as a Plumber", () => {
	// Other nodes reference it by @id. A second typed Plumber without an
	// address or phone is reported as a LocalBusiness markup error.
	const offenders = ["app", "lib", "components"]
		.flatMap((root) =>
			fs
				.readdirSync(root, { recursive: true, withFileTypes: true })
				.filter((entry) => entry.isFile() && /\.tsx?$/.test(entry.name))
				.map((entry) => path.join(entry.parentPath, entry.name)),
		)
		.filter((file) => file !== path.join("lib", "seo.ts"))
		.filter((file) =>
			/"@type":\s*(?:\[[^\]]*)?"Plumber"/.test(fs.readFileSync(file, "utf8")),
		)
	assert.deepEqual(offenders, [])
})
