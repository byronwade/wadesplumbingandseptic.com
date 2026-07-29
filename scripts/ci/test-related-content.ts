import assert from "node:assert/strict"

import {
	rankDocuments,
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

console.log("related content ok")
