import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"

import matter from "gray-matter"

import { cityServicePages, getCityLocation } from "../../lib/city-service-pages"
import { serviceAreaLocations } from "../../lib/service-areas"
import {
	OG_DESCRIPTION_MAX,
	META_DESCRIPTION_MAX,
	TITLE_MAX,
	TITLE_SUFFIX,
	buildPageMetadata,
	clampDescription,
	documentTitle,
} from "../../lib/seo"

const long =
	"Licensed plumbing and engineered septic service in Santa Cruz County and selected Santa Clara County communities. Clear pricing, no upselling. Call 831.225.4344."

assert.equal(long.length, 161)

const og = clampDescription(long, OG_DESCRIPTION_MAX)
const meta = clampDescription(long, META_DESCRIPTION_MAX)
assert.ok(og.length <= OG_DESCRIPTION_MAX, `og too long: ${og.length}`)
assert.ok(meta.length <= META_DESCRIPTION_MAX, `meta too long: ${meta.length}`)
assert.ok(og.endsWith("…"))
assert.ok(!og.includes("  "))

const short = "Clear pricing, no upselling."
assert.equal(clampDescription(short, OG_DESCRIPTION_MAX), short)

const metadata = buildPageMetadata({
	title: "Santa Cruz Plumbing & Septic",
	description: long,
	pathname: "/",
})

assert.equal(typeof metadata.description, "string")
assert.ok(
	String(metadata.description).length <= META_DESCRIPTION_MAX,
	"meta description must stay within Google-safe length",
)
assert.ok(
	String(metadata.openGraph?.description).length <= OG_DESCRIPTION_MAX,
	"og:description must stay within social-safe length",
)
assert.ok(
	String(metadata.twitter?.description).length <= OG_DESCRIPTION_MAX,
	"twitter:description must stay within social-safe length",
)
const ogImages = metadata.openGraph?.images
const firstImage = Array.isArray(ogImages) ? ogImages[0] : ogImages
const imageAlt =
	firstImage && typeof firstImage === "object" && "alt" in firstImage
		? String(firstImage.alt ?? "")
		: ""
assert.ok(
	imageAlt.toLowerCase().includes("call"),
	"og:image alt should include conversion language",
)

const home = buildPageMetadata({
	title: "Santa Cruz Plumbing & Septic",
	description:
		"Licensed plumbing and septic for Santa Cruz County. Clear pricing, no upselling. Call 831.225.4344.",
	pathname: "/",
})
assert.ok(
	String(home.description).length <= OG_DESCRIPTION_MAX,
	"homepage source copy should already fit social length",
)

// Short titles get the brand from the layout template.
assert.equal(documentTitle("Drain Cleaning"), "Drain Cleaning")
assert.ok(`Drain Cleaning${TITLE_SUFFIX}`.length <= TITLE_MAX)
// Long titles stand alone instead of having the brand cut off mid-word.
const longTitle = "Tankless Water Heater Installation in Santa Cruz County"
assert.deepEqual(documentTitle(longTitle), { absolute: longTitle })
// A title that already names the business is not branded twice.
const named = "Careers at Wade's Plumbing & Septic"
assert.deepEqual(documentTitle(named), { absolute: named })
assert.deepEqual(home.title, "Santa Cruz Plumbing & Septic")

// Guide titles are the search result headline, so they must fit what Google shows.
const postTitles = new Map<string, string>()
for (const file of readdirSync("content/posts")) {
	if (!file.endsWith(".md")) continue
	const { data } = matter(readFileSync(`content/posts/${file}`, "utf8"))
	const title = String(data.title ?? "")
	assert.ok(
		title.length <= TITLE_MAX,
		`content/posts/${file}: title is ${title.length} characters, over ${TITLE_MAX}: ${title}`,
	)
	const key = title
		.replaceAll("&", "and")
		.replace(/\s+/g, " ")
		.trim()
		.toLowerCase()
	const previous = postTitles.get(key)
	assert.equal(
		previous,
		undefined,
		`duplicate post title "${title}": content/posts/${file} and ${previous}`,
	)
	postTitles.set(key, `content/posts/${file}`)
}

function collectFrontmatter(dir: string) {
	return readdirSync(dir)
		.filter((file) => file.endsWith(".md"))
		.map((file) => {
			const { data } = matter(readFileSync(`${dir}/${file}`, "utf8"))
			return {
				file: `${dir}/${file}`,
				title: String(data.title ?? "").trim(),
				description: String(data.description ?? "")
					.replace(/\s+/g, " ")
					.trim(),
			}
		})
}

function assertUnique(
	items: Array<{ file: string; value: string }>,
	label: string,
) {
	const seen = new Map<string, string>()
	for (const item of items) {
		assert.ok(item.value, `${item.file}: missing ${label}`)
		const key = item.value.toLowerCase()
		const previous = seen.get(key)
		assert.equal(
			previous,
			undefined,
			`duplicate ${label} "${item.value}": ${item.file} and ${previous}`,
		)
		seen.set(key, item.file)
	}
}

const services = collectFrontmatter("content/services")
const towns = collectFrontmatter("content/pages/service-area")
assertUnique(
	services.map((item) => ({ file: item.file, value: item.title })),
	"service title",
)
assertUnique(
	services.map((item) => ({ file: item.file, value: item.description })),
	"service description",
)
assertUnique(
	towns.map((item) => ({ file: item.file, value: item.title })),
	"town title",
)
assertUnique(
	towns.map((item) => ({ file: item.file, value: item.description })),
	"town description",
)

const cityServiceTitles = cityServicePages.map((page) => {
	const location = getCityLocation(page.citySlug)
	assert.ok(location, page.citySlug)
	return {
		file: `${page.citySlug}/${page.serviceSlug}`,
		value: `${page.serviceTitle} in ${location!.name}, CA`,
	}
})
assertUnique(cityServiceTitles, "city-service title")

for (const service of services) {
	const slug = service.file
		.replace(/^content\/services\//, "")
		.replace(/\.md$/, "")
	const tokens = slug.split("-").filter((part) => part.length >= 4)
	assert.ok(
		tokens.some((token) => service.title.toLowerCase().includes(token)),
		`${service.file} title "${service.title}" should name the service`,
	)
}

for (const town of towns) {
	const location = serviceAreaLocations.find((item) =>
		town.file.endsWith(`${item.slug}-ca-plumbing-septic-services.md`),
	)
	assert.ok(location, town.file)
	assert.ok(
		town.title.includes(location!.name),
		`${town.file} title "${town.title}" should name ${location!.name}`,
	)
}

for (const page of cityServicePages) {
	const location = getCityLocation(page.citySlug)
	assert.ok(location, page.citySlug)
	const title = `${page.serviceTitle} in ${location!.name}, CA`
	assert.ok(title.includes(location!.name), title)
	assert.ok(
		title
			.toLowerCase()
			.includes(page.serviceTitle.split(" ")[0]!.toLowerCase()),
		title,
	)
}

console.log("seo meta helpers ok")
