import assert from "node:assert/strict"

import {
	bestWordDistance,
	editDistance,
	expandQuery,
	highlightMatches,
	searchDocuments,
	suggestSearches,
	type SearchDocument,
} from "../../lib/search"

const docs: SearchDocument[] = [
	{
		id: "service:drain",
		type: "service",
		title: "Drain Cleaning",
		description: "Clear clogged and slow drains.",
		href: "/service-offerings/drain-cleaning",
		category: "Plumbing",
		keywords: ["drain", "clog", "cleaning", "backup"],
		body: "Hair soap grease roots create similar symptoms.",
		popularity: 48,
		intents: ["service"],
	},
	{
		id: "service:septic-pump",
		type: "service",
		title: "Septic Tank Cleaning and Pumping",
		description: "Pump and clean septic tanks.",
		href: "/service-offerings/septic-tank-cleaning-and-pumping",
		category: "Septic",
		keywords: ["septic", "pumping", "tank", "cleaning"],
		body: "Routine pumping protects the drain field.",
		popularity: 47,
		intents: ["service"],
	},
	{
		id: "service:heater",
		type: "service",
		title: "Water Heater Installation",
		description: "Install tank and tankless water heaters.",
		href: "/service-offerings/water-heater-installation",
		category: "Plumbing",
		keywords: ["water", "heater", "tankless", "hot"],
		popularity: 41,
		intents: ["service"],
	},
	{
		id: "tip:clog",
		type: "tip",
		title: "How to Properly Clear a Clogged Drain",
		description: "Troubleshoot a simple fixture clog.",
		href: "/how-to-clear",
		category: "DIY Projects",
		keywords: ["clogged", "drain", "diy", "guide"],
		body: "Multiple slow drains can indicate a main-line problem.",
		popularity: 20,
		intents: ["tip"],
	},
	{
		id: "action:call",
		type: "action",
		title: "Call 831.225.4344",
		description: "Speak with Wade's during business hours.",
		href: "tel:+18312254344",
		category: "Action",
		keywords: ["call", "phone", "schedule"],
		popularity: 55,
		intents: ["call"],
	},
	{
		id: "action:quote",
		type: "action",
		title: "Get a Free Quote",
		description: "Request an estimate.",
		href: "/contact",
		category: "Action",
		keywords: ["quote", "estimate", "cost", "price"],
		popularity: 50,
		intents: ["quote"],
	},
	{
		id: "page:aptos",
		type: "page",
		title: "Plumbing & Septic in Aptos",
		description: "Local service in Aptos, CA.",
		href: "/service-area/aptos-ca-plumbing-septic-services",
		category: "Service Area",
		keywords: ["aptos", "santa", "cruz", "area"],
		popularity: 12,
		intents: ["area", "service"],
	},
	{
		id: "service:toilet",
		type: "service",
		title: "Toilet Repair and Installation",
		description: "Fix running toilets, wax rings, and replacements.",
		href: "/service-offerings/toilet-repair",
		category: "Plumbing",
		keywords: ["toilet", "toilets", "wax", "ring", "flush"],
		popularity: 38,
		intents: ["service"],
	},
]

function topTitles(query: string, limit = 3) {
	return searchDocuments(docs, query, limit).map((hit) => hit.title)
}

function assertIncludes(actual: string[], expected: string, message: string) {
	assert.ok(
		actual.some((item) => item.toLowerCase().includes(expected.toLowerCase())),
		`${message}\n  got: ${JSON.stringify(actual)}`,
	)
}

function assertFirstIncludes(
	actual: string[],
	expected: string,
	message: string,
) {
	assert.ok(
		actual[0]?.toLowerCase().includes(expected.toLowerCase()),
		`${message}\n  got: ${JSON.stringify(actual)}`,
	)
}

assertFirstIncludes(
	topTitles("clogged drain"),
	"Drain",
	"clogged drain → drain service",
)
assertFirstIncludes(topTitles("drain"), "Drain", "drain → drain service")
assertFirstIncludes(
	topTitles("septic pumping"),
	"Septic",
	"septic pumping → septic",
)
assertFirstIncludes(
	topTitles("no hot water"),
	"Water Heater",
	"no hot water → heater",
)
assertIncludes(topTitles("how much for a quote", 5), "Quote", "quote intent")
assertIncludes(topTitles("call a plumber", 5), "Call", "call intent")
assertIncludes(
	topTitles("how to clear a clog", 5),
	"Clogged",
	"how-to boosts tip",
)
assertIncludes(topTitles("aptos near me", 5), "Aptos", "area query")
assertFirstIncludes(topTitles("heat"), "Water Heater", "prefix heat → heater")

assert.ok(suggestSearches("clog").length > 0, "suggestions for clog")
assert.ok(
	highlightMatches("Drain Cleaning", "drain").some((part) => part.match),
	"highlight matches drain",
)

const expanded = expandQuery("sewage smell")
assert.ok(
	expanded.expanded.includes("septic") || expanded.expanded.includes("odor"),
	"sewage smell expands",
)

assert.equal(editDistance("septic", "septik"), 1, "septik is 1 edit from septic")
assert.ok(
	bestWordDistance("septic tank cleaning", "septik") <= 1,
	"bestWordDistance finds septik ≈ septic",
)

assertFirstIncludes(
	topTitles("septik pumping"),
	"Septic",
	"misspelling septik → septic pumping",
)
assertFirstIncludes(
	topTitles("cloggd drain"),
	"Drain",
	"misspelling cloggd → drain cleaning",
)
assertFirstIncludes(
	topTitles("water heter"),
	"Water Heater",
	"misspelling heter → water heater",
)
assertFirstIncludes(
	topTitles("toilett repair"),
	"Toilet",
	"misspelling toilett → toilet repair",
)

const misspelled = searchDocuments(docs, "septik", 5)
assert.ok(misspelled.length > 0, "misspellings return closest hits")
assert.ok(
	misspelled.some(
		(hit) =>
			hit.matchLabel === "Closest match" ||
			hit.title.toLowerCase().includes("septic"),
	),
	"closest/fuzzy label or septic title for septik",
)

assert.ok(
	suggestSearches("septik").some((item) => item.includes("septic")),
	"suggestions recover from septik typo",
)

console.log("Search quality checks passed ✓")
