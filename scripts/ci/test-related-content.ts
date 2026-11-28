import assert from "node:assert/strict"

import {
	rankDocuments,
	scoreCandidate,
	seedFromDocument,
	type RelatedSeedDocument,
} from "../../lib/related-score"

const tip: RelatedSeedDocument = {
	slug: "the-benefits-of-hydro-jetting",
	title: "The Benefits of Hydro Jetting",
	description: "Clear stubborn drain clogs with high-pressure jetting.",
	content: "Hydro jetting clears grease and roots from sewer lines.",
	category: "Plumbing Tips",
	tags: ["hydro jetting", "drain cleaning"],
}

const posts: RelatedSeedDocument[] = [
	tip,
	{
		slug: "slow-drains-solutions-santa-cruz",
		title: "Slow Drain Solutions",
		description: "What to do about slow drains.",
		content: "Slow drains often need professional cleaning.",
		category: "Plumbing Tips",
		tags: ["drain cleaning"],
	},
	{
		slug: "septic-pumping-essentials-santa-cruz",
		title: "Septic Pumping Essentials",
		description: "When to pump your septic tank.",
		content: "Pump septic tanks on a regular schedule.",
		category: "Septic Maintenance",
		tags: ["septic"],
	},
	{
		slug: "should-you-repair-or-replace-your-water-heater",
		title: "Should You Repair or Replace Your Water Heater?",
		description: "Repair or replace a water heater.",
		content: "Tankless and tank water heater replacement.",
		category: "Plumbing Tips",
		tags: ["water heater"],
	},
]

const services: RelatedSeedDocument[] = [
	{
		slug: "hydro-jetting",
		title: "Hydro Jetting",
		description: "High-pressure drain clearing.",
		content: "Hydro jetting for clogged drains and sewer lines.",
		category: "Plumbing",
	},
	{
		slug: "drain-cleaning",
		title: "Drain Cleaning",
		description: "Professional drain cleaning.",
		content: "Clear household drains.",
		category: "Plumbing",
	},
	{
		slug: "septic-tank-cleaning-and-pumping",
		title: "Septic Tank Cleaning and Pumping",
		description: "Pump and clean septic tanks.",
		content: "Routine septic pumping.",
		category: "Septic",
	},
]

const seed = seedFromDocument(tip)
const relatedServices = rankDocuments(seed, services, "service", 3)
const relatedPosts = rankDocuments(seed, posts, "post", 3, new Set([tip.slug]))

assert.ok(relatedServices.length > 0)
assert.ok(
	relatedServices.some(
		(service) =>
			service.slug.includes("hydro") || service.slug.includes("drain"),
	),
	`expected drain/hydro service, got ${relatedServices.map((item) => item.slug).join(", ")}`,
)
assert.ok(relatedPosts.every((post) => post.slug !== tip.slug))
assert.equal(relatedPosts[0]?.slug, "slow-drains-solutions-santa-cruz")

const septicSeed = seedFromDocument(services[2]!)
const septicTips = rankDocuments(septicSeed, posts, "post", 3)
assert.ok(
	septicTips.some((post) => post.slug.includes("septic")),
	`expected septic tip, got ${septicTips.map((item) => item.slug).join(", ")}`,
)

const heater: RelatedSeedDocument = {
	slug: "water-heater-installation",
	title: "Water Heater Installation",
	description: "Tank and tankless water heater installation.",
	content: "Install a tank or tankless water heater to code.",
	category: "Plumbing",
}

const heaterPosts = rankDocuments(seedFromDocument(heater), posts, "post", 3)
assert.ok(
	heaterPosts.every((post) => !post.slug.includes("septic")),
	`water heater related leaked septic posts: ${heaterPosts.map((item) => item.slug).join(", ")}`,
)

const townHub: RelatedSeedDocument = {
	slug: "__topic__Santa Cruz plumbing and septic",
	title: "Santa Cruz plumbing and septic",
	description: "Santa Cruz plumbing and septic",
	content: "Santa Cruz plumbing septic",
	tags: ["plumbing", "septic"],
}

const maintenanceHub: RelatedSeedDocument = {
	slug: "maintenance-guide",
	title: "Plumbing & Septic Maintenance Guide",
	description:
		"A practical homeowner maintenance schedule for drains, water heaters, water pressure, fixtures, sewer lines, and septic systems.",
	content: "Inspect the water heater. Review septic alarms.",
}

const heaterPost = posts[3]!
const septicPost = posts[2]!
const townSeed = seedFromDocument(townHub)
const maintenanceSeed = seedFromDocument(maintenanceHub)

assert.ok(
	scoreCandidate(townSeed, heaterPost, "post") > 0,
	"town hubs should still rank water heater guides",
)
assert.ok(
	scoreCandidate(townSeed, septicPost, "post") > 0,
	"town hubs should still rank septic guides",
)
assert.ok(
	scoreCandidate(maintenanceSeed, heaterPost, "post") > 0,
	"mixed maintenance guides should still rank water heater posts",
)
assert.ok(
	scoreCandidate(maintenanceSeed, septicPost, "post") > 0,
	"mixed maintenance guides should still rank septic posts",
)
assert.ok(
	scoreCandidate(seedFromDocument(heater), septicPost, "post") <= 0,
	"water heater pages should not rank septic-only posts",
)
assert.ok(
	scoreCandidate(septicSeed, heaterPost, "post") <= 0,
	"septic pages should not rank water-heater-only posts",
)

console.log("related content ok")
