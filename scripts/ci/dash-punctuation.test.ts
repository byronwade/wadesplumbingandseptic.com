import assert from "node:assert/strict"
import fs from "node:fs"
import Module from "node:module"
import path from "node:path"
import test from "node:test"

import {
	dashIssues,
	jsonDashIssues,
	sourceDashIssues,
} from "./dash-punctuation"

// The llms routes read content through Next server modules; stub runtime-only imports.
type Loader = (
	request: string,
	parent: NodeModule | null,
	isMain: boolean,
) => unknown
const moduleWithLoad = Module as typeof Module & { _load: Loader }
const load = moduleWithLoad._load
moduleWithLoad._load = function patchedLoad(request, parent, isMain) {
	if (request === "server-only") return {}
	if (request === "next/cache") return { cacheLife() {}, cacheTag() {} }
	return load(request, parent, isMain)
}

for (const text of [
	"Drain cleaning — done right",
	"Monday–Friday",
	"Call to Schedule &mdash; 831.225.4344",
	"3&ndash;5 years",
	"Septic &#8212; installation",
	"9am &#8211; 5pm",
	"work - steep slopes - that is",
	'"Great work!" - Sarah, Aptos',
	"Monday - Friday",
]) {
	test(`rejects dash punctuation: ${text}`, () => {
		assert.ok(dashIssues(text).length > 0)
	})
}

for (const text of [
	"family-owned drain-field work",
	"Monday to Friday, 9:00 AM to 5:00 PM",
	"- Septic system installation\n- Drain cleaning",
	"## Services\n\n- [Drain cleaning](https://example.com)",
	"Call to Schedule: 831.225.4344",
	"a-b",
	"-1",
]) {
	test(`allows real punctuation and list markers: ${JSON.stringify(text)}`, () => {
		assert.deepEqual(dashIssues(text), [])
	})
}

for (const source of [
	"const c = <p>Drain cleaning - Santa Cruz</p>",
	"const c = <p>{city} - {service}</p>",
	'const c = <p>\n\t<strong>Septic</strong>{" "}\n\t- installed with engineers\n</p>',
	'const c = <img alt="Wade\'s team — on site" />',
	"const title = `${service} - ${city}`",
	'const title = [a, b].join(" - ")',
	'const title = a + " - " + b',
	'const c = { name: "Mon–Fri" }',
	'const c = <p>{"Open 9am – 5pm"}</p>',
]) {
	test(`source guard rejects UI copy: ${source}`, () => {
		assert.ok(sourceDashIssues(source, "fixture.tsx").length > 0)
	})
}

for (const source of [
	"// Dash in a comment — not shown to anyone\nconst a = 1",
	"/** JSDoc - also a comment */\nconst a = 1",
	"const n = items.length - 1",
	'const slug = title.replaceAll("-", " ")',
	"const re = /\\s[-–]\\s/g",
	'const re = new RegExp("a - b")',
	'console.warn("cache miss - refetching")',
	"const md = `## Services\\n\\n- ${name}\\n- ${other}`",
	'const md = ["- one", "- two"].join("\\n")',
	"const c = <p>Monday to Friday, 9:00 AM to 5:00 PM</p>",
	"const c = <p>\n\t<strong>Septic</strong>\n\t<span>installed</span>\n</p>",
	'const c = <div className="-mt-2 w-[calc(100%-2rem)]" />',
	'import x from "./a-b"',
]) {
	test(`source guard allows code and comments: ${JSON.stringify(source)}`, () => {
		assert.deepEqual(sourceDashIssues(source, "fixture.tsx"), [])
	})
}

test("JSON string values are checked, keys and numbers are not", () => {
	assert.deepEqual(jsonDashIssues({ "a-b": 1, name: "Ben Lomond" }), [])
	assert.deepEqual(jsonDashIssues({ features: [{ name: "Felton – north" }] }), [
		"$.features[0].name: en dash",
	])
})

function files(root: string, pattern: RegExp) {
	return fs
		.readdirSync(root, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile() && pattern.test(entry.name))
		.map((entry) => path.join(entry.parentPath, entry.name))
}

test("UI copy in app, components and lib has no dash punctuation", () => {
	const sources = ["app", "components", "lib"].flatMap((root) =>
		files(root, /\.[cm]?[jt]sx?$/),
	)
	assert.ok(sources.length > 100, `only ${sources.length} source files found`)
	const problems = sources.flatMap((file) =>
		sourceDashIssues(fs.readFileSync(file, "utf8"), file),
	)
	assert.deepEqual(problems, [])
})

test("GeoJSON labels have no dash punctuation", () => {
	const geojson = files("public", /\.geojson$/)
	assert.ok(geojson.length > 0)
	for (const file of geojson)
		assert.deepEqual(
			jsonDashIssues(JSON.parse(fs.readFileSync(file, "utf8"))),
			[],
			file,
		)
})

test("generated llms.txt and llms-full.txt have no dash punctuation", async () => {
	for (const route of [
		"../../app/llms.txt/route",
		"../../app/llms-full.txt/route",
	]) {
		const { GET } = await import(route)
		const body = await (await GET()).text()
		assert.ok(body.length > 1000, route)
		const problems = body
			.split("\n")
			.filter((line: string) => dashIssues(line).length > 0)
		assert.deepEqual(problems, [], route)
	}
})

test("business and site JSON-LD have no dash punctuation", async () => {
	const {
		localBusinessJsonLd,
		openingHoursJsonLd,
		serviceAreasJsonLd,
		websiteJsonLd,
	} = await import("../../lib/seo")
	const { getAllRoutes } = await import("../../lib/content")
	const { services } = await getAllRoutes()
	assert.ok(services.length > 0)
	for (const [name, value] of Object.entries({
		localBusinessJsonLd: localBusinessJsonLd(services),
		openingHoursJsonLd: openingHoursJsonLd(),
		serviceAreasJsonLd: serviceAreasJsonLd(),
		websiteJsonLd: websiteJsonLd(),
	}))
		assert.deepEqual(jsonDashIssues(value), [], name)
})
