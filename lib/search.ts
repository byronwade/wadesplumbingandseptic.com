export type SearchResultType = "service" | "tip" | "page" | "action"

export type SearchIntent =
	"browse" | "service" | "tip" | "call" | "quote" | "area"

export type SearchDocument = {
	id: string
	type: SearchResultType
	title: string
	description: string
	href: string
	category?: string
	image?: string
	keywords: string[]
	/** Extra body/excerpt terms — weighted lower than keywords. */
	body?: string
	popularity?: number
	intents?: SearchIntent[]
}

export type SearchHit = SearchDocument & {
	score: number
	matchedOn: "title" | "category" | "keyword" | "description" | "body"
	matchLabel: string
}

/** Domain synonyms so casual homeowner language finds the right pages. */
export const SEARCH_SYNONYMS: Record<string, string[]> = {
	septic: [
		"septic tank",
		"leach field",
		"drainfield",
		"drain field",
		"atu",
		"engineered septic",
		"septic pumping",
		"septic system",
	],
	clog: [
		"clogged",
		"backup",
		"blockage",
		"slow drain",
		"stopped up",
		"plugged",
	],
	drain: ["drains", "sewer", "cleanout", "hydro jetting", "jetting"],
	"water heater": [
		"tankless",
		"hot water",
		"tankless water heater",
		"boiler",
		"water heaters",
		"no hot water",
	],
	leak: ["drip", "burst pipe", "slab leak", "leak detection", "leaking"],
	toilet: ["toilets", "commode", "wax ring", "running toilet", "flush"],
	sink: ["faucet", "garbage disposal", "disposal", "kitchen sink"],
	urgent: ["emergency", "priority", "same day", "overflow", "flooding"],
	inspection: ["camera inspection", "video inspection", "assessment"],
	pumping: ["septic pumping", "tank pumping", "pump out", "pumpout"],
	hydro: ["jetting", "hydro jetting", "high pressure jetting"],
	commercial: ["business", "restaurant", "grease trap", "multi-unit"],
	backflow: ["backflow prevention", "backflow testing", "rpz"],
	pipe: ["repipe", "pipe replacement", "pipe repair", "trenchless"],
	camera: ["video inspection", "sewer camera", "locate line"],
	"santa cruz": [
		"scotts valley",
		"watsonville",
		"aptos",
		"capitola",
		"soquel",
		"felton",
	],
	garbage: ["disposal", "garbage disposal", "sink disposal"],
	faucet: ["tap", "spigot", "kitchen faucet", "bathroom faucet"],
	sump: ["sump pump", "basement pump"],
	grease: ["grease trap", "interceptor"],
	root: ["rooter", "tree roots", "sewer roots"],
	slab: ["slab leak", "under slab"],
	tankless: ["tankless water heater", "on demand", "instant hot water"],
	odor: ["smell", "sewage smell", "rotten egg", "sulfur"],
	"low pressure": ["weak pressure", "low water pressure", "no pressure"],
	shower: ["shower valve", "shower head", "shower drain"],
	water: ["potable", "drinking water", "water line"],
}

/**
 * Symptom / intent phrases mapped onto search terms.
 * These fire only on phrase presence in the query.
 */
export const INTENT_PHRASES: Array<{
	phrases: string[]
	expand: string[]
	intent: SearchIntent
}> = [
	{
		phrases: ["no hot water", "cold water only", "water not hot"],
		expand: ["water heater", "tankless", "hot water"],
		intent: "service",
	},
	{
		phrases: ["sewage smell", "smells like sewage", "rotten egg smell"],
		expand: ["odor", "septic", "drain", "vent"],
		intent: "service",
	},
	{
		phrases: ["slow drain", "drains slow", "water backing up", "backup"],
		expand: ["clog", "drain", "sewer", "septic"],
		intent: "service",
	},
	{
		phrases: ["gurgling", "bubbling toilet", "toilet bubbles"],
		expand: ["drain", "sewer", "vent", "clog"],
		intent: "service",
	},
	{
		phrases: ["yellow water", "brown water", "rusty water", "hard water"],
		expand: ["water", "softener", "filtration", "heater"],
		intent: "service",
	},
	{
		phrases: ["how to", "diy", "guide", "tips", "what causes", "why is"],
		expand: ["tips", "guide", "maintenance"],
		intent: "tip",
	},
	{
		phrases: ["cost", "price", "how much", "estimate", "quote"],
		expand: ["quote", "estimate", "contact"],
		intent: "quote",
	},
	{
		phrases: ["call", "phone", "schedule", "book appointment"],
		expand: ["call", "phone", "schedule"],
		intent: "call",
	},
	{
		phrases: ["near me", "service area", "do you serve", "in my area"],
		expand: ["service areas", "santa cruz", "area"],
		intent: "area",
	},
]

const STOP_WORDS = new Set([
	"a",
	"an",
	"and",
	"or",
	"the",
	"to",
	"for",
	"of",
	"in",
	"on",
	"with",
	"my",
	"our",
	"your",
	"is",
	"are",
	"how",
	"what",
	"do",
	"i",
	"we",
	"can",
	"you",
	"me",
	"it",
	"this",
	"that",
	"from",
	"get",
	"need",
	"help",
])

const MATCH_LABELS: Record<SearchHit["matchedOn"], string> = {
	title: "Title match",
	category: "Category match",
	keyword: "Related topic",
	description: "Description match",
	body: "In article",
}

function normalize(value: string) {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/&/g, " and ")
		.replace(/[^a-z0-9\s/-]/g, " ")
		.replace(/\s+/g, " ")
		.trim()
}

export function tokenize(query: string) {
	return normalize(query)
		.split(" ")
		.filter((token) => token.length > 1 && !STOP_WORDS.has(token))
}

function familyTerms(canonical: string, aliases: string[]) {
	return [canonical, ...aliases].map(normalize)
}

function lightStem(token: string) {
	if (token.length < 5) return token
	if (token.endsWith("ies") && token.length > 5) return `${token.slice(0, -3)}y`
	if (token.endsWith("ing") && token.length > 6) return token.slice(0, -3)
	if (token.endsWith("ers") && token.length > 5) return token.slice(0, -1)
	if (token.endsWith("ed") && token.length > 5) return token.slice(0, -2)
	if (token.endsWith("es") && token.length > 5) return token.slice(0, -2)
	if (token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1)
	return token
}

function tokenMatchesTerm(token: string, term: string) {
	if (token === term) return true
	if (token.length < 3) return false

	const stemToken = lightStem(token)
	const stemTerm = lightStem(term)
	if (stemToken === stemTerm) return true

	if (token === `${term}s` || term === `${token}s`) return true
	if (token.endsWith("ed") && token.slice(0, -2) === term) return true
	if (term.endsWith("ed") && term.slice(0, -2) === token) return true
	if (token.endsWith("ing") && token.slice(0, -3) === term) return true
	if (term.endsWith("ing") && term.slice(0, -3) === token) return true

	return false
}

function ngrams(tokens: string[], size: number) {
	if (tokens.length < size) return [] as string[]
	const grams: string[] = []
	for (let i = 0; i <= tokens.length - size; i += 1) {
		grams.push(tokens.slice(i, i + size).join(" "))
	}
	return grams
}

export type ParsedQuery = {
	raw: string
	tokens: string[]
	phrase: string
	expanded: string[]
	original: Set<string>
	bigrams: string[]
	intents: Set<SearchIntent>
	prefix: string | null
}

/**
 * Expand query tokens with synonyms + intent phrases.
 * Uses exact/phrase matching — never bare substring includes — so "drain"
 * does not activate the septic "drainfield" family.
 */
export function expandQuery(query: string): ParsedQuery {
	const tokens = tokenize(query)
	const phrase = normalize(query)
	const expanded = new Set(tokens)
	const original = new Set(tokens)
	const intents = new Set<SearchIntent>()

	for (const rule of INTENT_PHRASES) {
		if (rule.phrases.some((item) => phrase.includes(normalize(item)))) {
			intents.add(rule.intent)
			for (const term of rule.expand) {
				for (const part of normalize(term).split(" ")) {
					if (part.length > 2 && !STOP_WORDS.has(part)) expanded.add(part)
				}
			}
		}
	}

	for (const [canonical, aliases] of Object.entries(SEARCH_SYNONYMS)) {
		const family = familyTerms(canonical, aliases)

		const phraseHit = family.some(
			(term) => term.includes(" ") && phrase.includes(term),
		)

		const tokenHit = tokens.some((token) =>
			family.some((term) => {
				if (term.includes(" ")) {
					const parts = term.split(" ").filter((part) => part.length > 1)
					return parts.every(
						(part) =>
							tokens.includes(part) ||
							tokens.some((queryToken) => tokenMatchesTerm(queryToken, part)),
					)
				}
				return tokenMatchesTerm(token, term)
			}),
		)

		if (!phraseHit && !tokenHit) continue

		if (
			canonical === "septic" ||
			canonical === "drain" ||
			canonical === "water heater" ||
			canonical === "clog"
		) {
			intents.add("service")
		}

		for (const term of family) {
			for (const part of term.split(" ")) {
				if (part.length > 2 && !STOP_WORDS.has(part)) expanded.add(part)
			}
		}
	}

	const prefix = tokens.length > 0 ? (tokens[tokens.length - 1] ?? null) : null

	return {
		raw: query,
		tokens,
		phrase,
		expanded: [...expanded],
		original,
		bigrams: ngrams(tokens, 2),
		intents,
		prefix: prefix && prefix.length >= 2 ? prefix : null,
	}
}

function fuzzyIncludes(haystack: string, needle: string) {
	if (!needle) return false
	if (haystack.includes(needle)) return true
	if (needle.length < 4) return false

	const words = haystack.split(" ")
	return words.some((word) => {
		if (Math.abs(word.length - needle.length) > 1) return false
		let misses = 0
		let i = 0
		let j = 0
		while (i < word.length && j < needle.length) {
			if (word[i] === needle[j]) {
				i += 1
				j += 1
				continue
			}
			misses += 1
			if (misses > 1) return false
			if (word.length > needle.length) i += 1
			else if (needle.length > word.length) j += 1
			else {
				i += 1
				j += 1
			}
		}
		return misses + (word.length - i) + (needle.length - j) <= 1
	})
}

function prefixMatchesField(field: string, prefix: string) {
	if (!prefix || prefix.length < 2) return false
	return field.split(" ").some((word) => word.startsWith(prefix))
}

function scoreTokenAgainstDocument(
	token: string,
	fields: {
		title: string
		description: string
		category: string
		keywords: string
		body: string
	},
): { score: number; matchedOn: SearchHit["matchedOn"] } | null {
	const { title, description, category, keywords, body } = fields
	const titleWords = title.split(" ")

	if (title === token) return { score: 130, matchedOn: "title" }
	if (title.startsWith(`${token} `) || title === token) {
		return { score: 100, matchedOn: "title" }
	}
	if (titleWords.includes(token)) return { score: 88, matchedOn: "title" }
	if (titleWords.some((word) => lightStem(word) === lightStem(token))) {
		return { score: 78, matchedOn: "title" }
	}
	if (title.includes(token)) return { score: 68, matchedOn: "title" }
	if (
		category.includes(token) ||
		lightStem(category).includes(lightStem(token))
	) {
		return { score: 58, matchedOn: "category" }
	}
	if (keywords.includes(token) || fuzzyIncludes(keywords, token)) {
		return { score: 48, matchedOn: "keyword" }
	}
	if (description.includes(token) || fuzzyIncludes(description, token)) {
		return { score: 28, matchedOn: "description" }
	}
	if (body.includes(token)) return { score: 14, matchedOn: "body" }
	if (fuzzyIncludes(title, token)) return { score: 52, matchedOn: "title" }

	return null
}

function intentBoost(document: SearchDocument, intents: Set<SearchIntent>) {
	if (intents.size === 0) return 0

	let boost = 0
	const docIntents = new Set(document.intents ?? [])

	if (
		intents.has("call") &&
		document.type === "action" &&
		document.id.includes("call")
	) {
		boost += 80
	}
	if (
		intents.has("quote") &&
		(document.href.includes("contact") || document.id.includes("contact"))
	) {
		boost += 70
	}
	if (intents.has("tip") && document.type === "tip") boost += 36
	if (intents.has("service") && document.type === "service") boost += 28
	if (
		intents.has("area") &&
		(document.category === "Service Area" ||
			document.href.includes("service-area"))
	) {
		boost += 55
	}

	for (const intent of intents) {
		if (docIntents.has(intent)) boost += 18
	}

	return boost
}

function scoreDocument(
	document: SearchDocument,
	query: ParsedQuery,
): SearchHit | null {
	const { tokens, phrase, expanded, original, bigrams, intents, prefix } = query

	if (tokens.length === 0) {
		return {
			...document,
			score: document.popularity ?? 0,
			matchedOn: "title",
			matchLabel: "Popular",
		}
	}

	const fields = {
		title: normalize(document.title),
		description: normalize(document.description),
		category: normalize(document.category ?? ""),
		keywords: normalize(document.keywords.join(" ")),
		body: normalize(document.body ?? ""),
	}

	let score = 0
	let matchedOn: SearchHit["matchedOn"] = "description"
	let matchedOriginal = 0
	let matchedExpanded = 0

	if (phrase.length > 3) {
		if (fields.title.includes(phrase)) {
			score += 180
			matchedOn = "title"
			matchedOriginal += 1
		} else if (fields.keywords.includes(phrase)) {
			score += 90
			matchedOn = "keyword"
			matchedOriginal += 1
		} else if (fields.description.includes(phrase)) {
			score += 50
			matchedOriginal += 1
		} else if (fields.body.includes(phrase)) {
			score += 24
			matchedOn = "body"
			matchedOriginal += 1
		}
	}

	for (const gram of bigrams) {
		if (fields.title.includes(gram)) {
			score += 70
			matchedOn = "title"
			matchedOriginal += 0.5
		} else if (
			fields.keywords.includes(gram) ||
			fields.description.includes(gram)
		) {
			score += 36
			matchedOriginal += 0.25
		}
	}

	for (const token of expanded) {
		const hit = scoreTokenAgainstDocument(token, fields)
		if (!hit) continue

		const isOriginal = original.has(token)
		const weight = isOriginal ? 1 : 0.5
		score += hit.score * weight
		matchedExpanded += 1
		if (isOriginal) matchedOriginal += 1

		const rank: SearchHit["matchedOn"][] = [
			"title",
			"category",
			"keyword",
			"description",
			"body",
		]
		if (rank.indexOf(hit.matchedOn) < rank.indexOf(matchedOn)) {
			matchedOn = hit.matchedOn
		}
	}

	if (prefix && prefixMatchesField(fields.title, prefix)) {
		score += 22
		if (matchedOn === "description" || matchedOn === "body") matchedOn = "title"
	} else if (prefix && prefixMatchesField(fields.keywords, prefix)) {
		score += 10
	}

	if (matchedExpanded === 0 && score === 0) return null

	const originalCoverage = matchedOriginal / Math.max(tokens.length, 1)
	if (originalCoverage === 0 && score < 90 && intents.size === 0) return null

	score *= 0.58 + Math.min(1, originalCoverage) * 0.42
	score += (document.popularity ?? 0) * 1.35
	score += intentBoost(document, intents)

	if (document.type === "service") score += 10
	if (document.type === "tip") score += 5
	if (
		document.type === "action" &&
		!intents.has("call") &&
		!intents.has("quote")
	) {
		score -= 8
	}

	return {
		...document,
		score,
		matchedOn,
		matchLabel: MATCH_LABELS[matchedOn],
	}
}

/** Diversify top results so one type doesn't dominate the first screen. */
function diversifyHits(hits: SearchHit[], limit: number) {
	if (hits.length <= limit) return hits

	const selected: SearchHit[] = []
	const remaining = [...hits]
	const typeCounts: Record<string, number> = {}

	while (selected.length < limit && remaining.length > 0) {
		let pickIndex = 0
		for (let i = 0; i < remaining.length; i += 1) {
			const candidate = remaining[i]
			if (!candidate) continue
			const count = typeCounts[candidate.type] ?? 0
			const leader = remaining[pickIndex]
			if (!leader) {
				pickIndex = i
				continue
			}
			const leaderCount = typeCounts[leader.type] ?? 0
			// Prefer under-represented types when scores are close.
			if (count < leaderCount && candidate.score >= leader.score * 0.82) {
				pickIndex = i
			}
		}

		const [picked] = remaining.splice(pickIndex, 1)
		if (!picked) break
		selected.push(picked)
		typeCounts[picked.type] = (typeCounts[picked.type] ?? 0) + 1
	}

	return selected
}

export function searchDocuments(
	documents: SearchDocument[],
	query: string,
	limit = 24,
): SearchHit[] {
	const parsed = expandQuery(query)

	if (parsed.tokens.length === 0) {
		return documents
			.filter(
				(document) => document.type === "service" || document.type === "tip",
			)
			.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
			.slice(0, limit)
			.map((document) => ({
				...document,
				score: document.popularity ?? 0,
				matchedOn: "title" as const,
				matchLabel: "Popular",
			}))
	}

	const ranked = documents
		.map((document) => scoreDocument(document, parsed))
		.filter((hit): hit is SearchHit => hit !== null)
		.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))

	return diversifyHits(ranked, limit)
}

export function groupSearchHits(hits: SearchHit[]) {
	const groups: Record<SearchResultType, SearchHit[]> = {
		service: [],
		tip: [],
		page: [],
		action: [],
	}

	for (const hit of hits) {
		groups[hit.type].push(hit)
	}

	return groups
}

/** Adaptive suggestion chips from the current query + synonym families. */
export function suggestSearches(query: string, limit = 6): string[] {
	const phrase = normalize(query)
	const tokens = tokenize(query)
	const suggestions = new Set<string>()

	const defaults = [
		"clogged drain",
		"septic pumping",
		"water heater",
		"toilet repair",
		"leak detection",
		"hydro jetting",
	]

	if (!phrase) return defaults.slice(0, limit)

	for (const [canonical, aliases] of Object.entries(SEARCH_SYNONYMS)) {
		const family = familyTerms(canonical, aliases)
		const related = family.some(
			(term) =>
				phrase.includes(term) ||
				term.includes(phrase) ||
				tokens.some((token) =>
					tokenMatchesTerm(token, term.split(" ")[0] ?? ""),
				),
		)
		if (!related) continue
		suggestions.add(canonical)
		for (const alias of aliases.slice(0, 2)) suggestions.add(alias)
	}

	for (const item of defaults) {
		if (item.includes(phrase) || phrase.length < 3) suggestions.add(item)
	}

	return [...suggestions].filter((item) => item !== phrase).slice(0, limit)
}

/** Highlight query terms inside a title for rich results. */
export function highlightMatches(
	text: string,
	query: string,
): Array<{
	text: string
	match: boolean
}> {
	const tokens = [...new Set(expandQuery(query).tokens.map(lightStem))].filter(
		(token) => token.length > 1,
	)
	if (!tokens.length) return [{ text, match: false }]

	const pattern = new RegExp(
		`(${tokens
			.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
			.join("|")})`,
		"ig",
	)

	const parts: Array<{ text: string; match: boolean }> = []
	let lastIndex = 0
	for (const match of text.matchAll(pattern)) {
		const index = match.index ?? 0
		if (index > lastIndex) {
			parts.push({ text: text.slice(lastIndex, index), match: false })
		}
		parts.push({ text: match[0] ?? "", match: true })
		lastIndex = index + (match[0]?.length ?? 0)
	}
	if (lastIndex < text.length) {
		parts.push({ text: text.slice(lastIndex), match: false })
	}
	return parts.length ? parts : [{ text, match: false }]
}
