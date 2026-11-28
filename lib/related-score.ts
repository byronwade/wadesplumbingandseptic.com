export type RelatedSeedDocument = {
	slug: string
	title: string
	description: string
	content: string
	category?: string
	tags?: string[]
}

const STOP_WORDS = new Set([
	"a",
	"an",
	"and",
	"are",
	"as",
	"at",
	"be",
	"by",
	"ca",
	"county",
	"for",
	"from",
	"guide",
	"guides",
	"how",
	"in",
	"into",
	"is",
	"it",
	"local",
	"of",
	"on",
	"or",
	"our",
	"santa",
	"service",
	"services",
	"the",
	"to",
	"with",
	"your",
	"you",
	"cruz",
])

const TOPIC_BRIDGES: Array<{ pattern: RegExp; boost: string[] }> = [
	{
		pattern: /\bseptic|leach|drain.?field|pumping|engineered septic\b/i,
		boost: ["septic", "tank", "leach", "drainfield", "pumping", "engineered"],
	},
	{
		pattern: /\bhydro.?jet|jetting|clog|drain cleaning|slow drain\b/i,
		boost: ["hydro", "jet", "drain", "clog", "clear"],
	},
	{
		pattern: /\bleak|frozen.?pipe|pipe repair|water line\b/i,
		boost: ["leak", "pipe", "water-line", "valve"],
	},
	{
		pattern: /\bwater.?heater|tankless\b/i,
		boost: ["water-heater", "tankless", "heater"],
	},
	{
		pattern: /\btoilet|flange\b/i,
		boost: ["toilet", "fixture"],
	},
	{
		pattern: /\bshower|faucet|fixture\b/i,
		boost: ["shower", "faucet", "fixture"],
	},
	{
		pattern: /\bsoftener|filtration|hard.?water|filter\b/i,
		boost: ["softener", "filtration", "filter", "water"],
	},
	{
		pattern: /\bsewer|trenchless|camera|video.?inspect|smoke\b/i,
		boost: ["sewer", "trenchless", "camera", "video", "smoke", "main-line"],
	},
	{
		pattern: /\bcommercial|grease|backflow\b/i,
		boost: ["commercial", "grease", "backflow"],
	},
]

export function tokenize(value: string) {
	return new Set(
		value
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, " ")
			.split(/[\s-]+/)
			.filter((token) => token.length > 2 && !STOP_WORDS.has(token)),
	)
}

function bridgeTokens(haystack: string) {
	const tokens = new Set<string>()
	for (const bridge of TOPIC_BRIDGES) {
		if (bridge.pattern.test(haystack)) {
			for (const word of bridge.boost) tokens.add(word)
		}
	}
	return tokens
}

function overlapScore(a: Set<string>, b: Set<string>, weight: number) {
	let score = 0
	for (const token of a) {
		if (b.has(token)) score += weight
	}
	return score
}

export function seedFromDocument(document: RelatedSeedDocument) {
	const haystack = [
		document.title,
		document.description,
		document.category ?? "",
		...(document.tags ?? []),
		document.slug.replaceAll("-", " "),
		document.content.slice(0, 1200),
	].join(" ")

	return {
		slug: document.slug,
		category: document.category ?? "",
		tags: new Set((document.tags ?? []).map((tag) => tag.toLowerCase())),
		tokens: tokenize(haystack),
		bridges: bridgeTokens(haystack),
		topics: metadataTopics(document),
	}
}

export function scoreCandidate(
	seed: ReturnType<typeof seedFromDocument>,
	candidate: RelatedSeedDocument,
	kind: "post" | "service",
) {
	if (candidate.slug === seed.slug) return -Infinity

	const candidateHay = [
		candidate.title,
		candidate.description,
		candidate.category ?? "",
		...(candidate.tags ?? []),
		candidate.slug.replaceAll("-", " "),
	].join(" ")
	const tokens = tokenize(candidateHay)
	const bridges = bridgeTokens(candidateHay)

	let score = 0

	if (
		seed.category &&
		candidate.category &&
		seed.category.toLowerCase() === candidate.category.toLowerCase()
	) {
		score += kind === "post" ? 8 : 6
	}

	if (kind === "service" && seed.category) {
		const seedCat = seed.category.toLowerCase()
		const serviceCat = (candidate.category ?? "").toLowerCase()
		if (seedCat.includes("septic") && serviceCat === "septic") score += 7
		if (
			(seedCat.includes("plumbing") || seedCat.includes("diy")) &&
			serviceCat === "plumbing"
		) {
			score += 5
		}
		if (seedCat.includes("commercial") && serviceCat === "commercial") {
			score += 6
		}
	}

	if (kind === "post" && seed.category) {
		const serviceCat = seed.category.toLowerCase()
		const postCat = (candidate.category ?? "").toLowerCase()
		if (serviceCat === "septic" && postCat.includes("septic")) score += 7
		if (serviceCat === "plumbing" && postCat.includes("plumbing")) score += 5
		if (serviceCat === "commercial" && postCat.includes("commercial")) {
			score += 5
		}
	}

	for (const tag of seed.tags) {
		if ((candidate.tags ?? []).some((item) => item.toLowerCase() === tag)) {
			score += 4
		}
	}

	score += overlapScore(seed.tokens, tokens, 2)
	score += overlapScore(seed.bridges, tokens, 3)
	score += overlapScore(seed.bridges, bridges, 2)
	score += overlapScore(seed.tokens, bridges, 2)
	score -= exclusiveTopicPenalty(seed, candidate, bridges)

	return score
}

type TopicFlags = {
	exclusiveHeater: boolean
	exclusiveSeptic: boolean
}

/**
 * Topic flags from title, description, slug, category, and tags only.
 * Body copy is skipped so the company name "Wade's Plumbing & Septic" does
 * not make a water-heater page look mixed, and so town hubs that name both
 * trades stay mixed instead of septic-only.
 */
function metadataTopics(document: {
	slug: string
	title: string
	description: string
	category?: string
	tags?: string[]
}): TopicFlags {
	const haystack = [
		document.slug.replaceAll("-", " "),
		document.title,
		document.description,
		document.category ?? "",
		...(document.tags ?? []),
	].join(" ")
	const hubHaystack = [
		document.slug.replaceAll("-", " "),
		document.title,
		document.description,
		document.category ?? "",
	].join(" ")
	const heater = /\bwater[\s-]?heater\b|\btankless\b/i.test(haystack)
	const septic = /\bseptic\b/i.test(haystack)
	const mixedHub =
		/\bplumbing\b.{0,20}\bseptic\b|\bseptic\b.{0,20}\bplumbing\b/i.test(
			hubHaystack,
		)

	return {
		exclusiveHeater: heater && !septic && !mixedHub,
		exclusiveSeptic: septic && !heater && !mixedHub,
	}
}

/** Keep water-heater-only pages away from septic-only posts, and the reverse. */
function exclusiveTopicPenalty(
	seed: ReturnType<typeof seedFromDocument>,
	candidate: RelatedSeedDocument,
	candidateBridges: Set<string>,
) {
	const candidateTopics = metadataTopics(candidate)

	if (seed.topics.exclusiveHeater && candidateTopics.exclusiveSeptic) {
		return 40
	}
	if (seed.topics.exclusiveSeptic && candidateTopics.exclusiveHeater) {
		return 40
	}
	if (seed.bridges.has("commercial") && !candidateBridges.has("commercial")) {
		return 4
	}
	return 0
}

export function rankDocuments(
	seed: ReturnType<typeof seedFromDocument>,
	candidates: RelatedSeedDocument[],
	kind: "post" | "service",
	limit: number,
	excludeSlugs: Set<string> = new Set(),
) {
	return candidates
		.filter((candidate) => !excludeSlugs.has(candidate.slug))
		.map((candidate) => ({
			candidate,
			score: scoreCandidate(seed, candidate, kind),
		}))
		.filter((row) => row.score > 0)
		.sort(
			(a, b) =>
				b.score - a.score || a.candidate.title.localeCompare(b.candidate.title),
		)
		.slice(0, limit)
		.map((row) => row.candidate)
}
