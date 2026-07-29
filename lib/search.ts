export type SearchResultType = "service" | "tip" | "page" | "action"

export type SearchDocument = {
	id: string
	type: SearchResultType
	title: string
	description: string
	href: string
	category?: string
	image?: string
	keywords: string[]
	popularity?: number
	/** Plain-text markdown body for full-content search and snippets. */
	body?: string
}

export type SearchIndexPayload = {
	documents: SearchDocument[]
	/** token -> document indices (grep-style inverted index) */
	inverted: Record<string, number[]>
}

export type SearchHit = SearchDocument & {
	score: number
	matchedOn: "title" | "category" | "keyword" | "description" | "body"
	snippet?: string
}

/** Domain synonyms so casual homeowner language finds the right pages. */
export const SEARCH_SYNONYMS: Record<string, string[]> = {
	septic: [
		"septic tank",
		"leach field",
		"drainfield",
		"drain field",
		"atu",
		"ats",
		"engineered septic",
		"septic pumping",
		"septic pump",
	],
	clog: ["clogged", "backup", "blockage", "slow drain", "stopped up"],
	drain: ["drains", "sewer", "cleanout", "hydro jetting", "jetting"],
	"water heater": [
		"tankless",
		"hot water",
		"tankless water heater",
		"boiler",
		"water heaters",
	],
	leak: ["drip", "burst pipe", "slab leak", "leak detection"],
	toilet: ["toilets", "commode", "wax ring", "running toilet"],
	sink: ["faucet", "garbage disposal", "disposal", "kitchen sink"],
	urgent: ["emergency", "priority", "same day", "overflow", "flooding"],
	inspection: ["camera inspection", "video inspection", "assessment"],
	pumping: ["septic pumping", "tank pumping", "pump out", "pumpout"],
	hydro: ["jetting", "hydro jetting", "high pressure jetting"],
	commercial: ["business", "restaurant", "grease trap", "multi-unit"],
	backflow: ["backflow prevention", "backflow testing", "rpz"],
	pipe: ["repipe", "pipe replacement", "pipe repair", "trenchless"],
	camera: ["video inspection", "sewer camera", "locate"],
	"santa cruz": ["scotts valley", "watsonville", "aptos", "capitola"],
	garbage: ["disposal", "garbage disposal", "sink disposal"],
	faucet: ["tap", "spigot", "kitchen faucet", "bathroom faucet"],
	sump: ["sump pump", "basement pump"],
	grease: ["grease trap", "interceptor"],
	root: ["rooter", "tree roots", "sewer roots"],
	slab: ["slab leak", "under slab"],
	tankless: ["tankless water heater", "on demand", "instant hot water"],
}

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
])

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

/** Strip markdown/HTML noise into plain searchable text. */
export function plainTextFromMarkdown(markdown: string) {
	return markdown
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`[^`]*`/g, " ")
		.replace(/!\[[^\]]*]\([^)]*\)/g, " ")
		.replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
		.replace(/<[^>]+>/g, " ")
		.replace(/[#>*_~|]/g, " ")
		.replace(/\{\s*"@context"[\s\S]*$/g, " ")
		.replace(/\s+/g, " ")
		.trim()
}

function familyTerms(canonical: string, aliases: string[]) {
	return [canonical, ...aliases].map(normalize)
}

function tokenMatchesTerm(token: string, term: string) {
	if (token === term) return true
	if (token.length < 3) return false

	// Light plural/stem tolerance without substring false positives
	// (e.g. "drain" must not match "drainfield").
	if (token === `${term}s` || term === `${token}s`) return true
	if (token.endsWith("ed") && token.slice(0, -2) === term) return true
	if (term.endsWith("ed") && term.slice(0, -2) === token) return true
	if (token.endsWith("ing") && token.slice(0, -3) === term) return true
	if (term.endsWith("ing") && term.slice(0, -3) === token) return true

	return false
}

/**
 * Expand query tokens with synonyms.
 * Uses exact/phrase matching — never bare substring includes — so "drain"
 * does not activate the septic "drainfield" family.
 */
export function expandQuery(query: string) {
	const tokens = tokenize(query)
	const phrase = normalize(query)
	const expanded = new Set(tokens)
	const original = new Set(tokens)

	for (const [canonical, aliases] of Object.entries(SEARCH_SYNONYMS)) {
		const family = familyTerms(canonical, aliases)

		const phraseHit = family.some(
			(term) => term.includes(" ") && phrase.includes(term),
		)

		const tokenHit = tokens.some((token) =>
			family.some((term) => {
				if (term.includes(" ")) {
					// Multi-word alias: require all parts present in the query.
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

		for (const term of family) {
			for (const part of term.split(" ")) {
				if (part.length > 2 && !STOP_WORDS.has(part)) expanded.add(part)
			}
		}
	}

	return {
		tokens,
		phrase,
		expanded: [...expanded],
		original,
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

	if (title === token) return { score: 120, matchedOn: "title" }
	if (title.startsWith(`${token} `) || title.startsWith(token)) {
		return { score: 95, matchedOn: "title" }
	}
	if (title.split(" ").includes(token) || title.includes(` ${token} `)) {
		return { score: 80, matchedOn: "title" }
	}
	if (title.includes(token)) return { score: 70, matchedOn: "title" }
	if (category.includes(token)) return { score: 55, matchedOn: "category" }
	if (keywords.includes(token) || fuzzyIncludes(keywords, token)) {
		return { score: 45, matchedOn: "keyword" }
	}
	if (description.includes(token) || fuzzyIncludes(description, token)) {
		return { score: 25, matchedOn: "description" }
	}
	if (body.includes(` ${token} `) || body.startsWith(`${token} `) || body.endsWith(` ${token}`) || body === token) {
		return { score: 18, matchedOn: "body" }
	}
	if (body.includes(token)) return { score: 14, matchedOn: "body" }
	if (fuzzyIncludes(title, token)) return { score: 50, matchedOn: "title" }

	return null
}

function preferMatch(
	current: SearchHit["matchedOn"],
	next: SearchHit["matchedOn"],
): SearchHit["matchedOn"] {
	const rank: Record<SearchHit["matchedOn"], number> = {
		title: 5,
		category: 4,
		keyword: 3,
		description: 2,
		body: 1,
	}
	return rank[next] > rank[current] ? next : current
}

function makeSnippet(body: string, needles: string[], limit = 140): string | undefined {
	if (!body) return undefined
	const lower = body.toLowerCase()
	let at = -1
	let matched = ""
	for (const needle of needles) {
		if (needle.length < 2) continue
		const index = lower.indexOf(needle)
		if (index >= 0 && (at < 0 || index < at)) {
			at = index
			matched = needle
		}
	}
	if (at < 0) return undefined

	const start = Math.max(0, at - 36)
	const end = Math.min(body.length, at + matched.length + 90)
	let snippet = body.slice(start, end).trim()
	if (start > 0) snippet = `…${snippet}`
	if (end < body.length) snippet = `${snippet}…`
	if (snippet.length > limit) {
		snippet = `${snippet.slice(0, limit - 1).trimEnd()}…`
	}
	return snippet
}

function scoreDocument(
	document: SearchDocument,
	query: ReturnType<typeof expandQuery>,
): SearchHit | null {
	const { tokens, phrase, expanded, original } = query

	if (tokens.length === 0) {
		return {
			...document,
			score: document.popularity ?? 0,
			matchedOn: "title",
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
	let matchedOn: SearchHit["matchedOn"] = "body"
	let matchedOriginal = 0
	let matchedExpanded = 0

	if (phrase.length > 3) {
		if (fields.title.includes(phrase)) {
			score += 160
			matchedOn = "title"
			matchedOriginal += 1
		} else if (fields.keywords.includes(phrase)) {
			score += 80
			matchedOn = "keyword"
			matchedOriginal += 1
		} else if (fields.description.includes(phrase)) {
			score += 45
			matchedOn = "description"
			matchedOriginal += 1
		} else if (fields.body.includes(phrase)) {
			score += 30
			matchedOn = "body"
			matchedOriginal += 1
		}
	}

	for (const token of expanded) {
		const hit = scoreTokenAgainstDocument(token, fields)
		if (!hit) continue

		const isOriginal = original.has(token)
		const weight = isOriginal ? 1 : 0.55
		score += hit.score * weight
		matchedExpanded += 1
		if (isOriginal) matchedOriginal += 1
		matchedOn = preferMatch(matchedOn, hit.matchedOn)
	}

	if (matchedExpanded === 0) return null

	// Require at least some original-token or phrase signal when synonyms fire,
	// unless every original token matched through stemming in the expanded set.
	const originalCoverage = matchedOriginal / tokens.length
	if (originalCoverage === 0 && score < 80) return null

	score *= 0.6 + Math.min(1, originalCoverage) * 0.4
	score += (document.popularity ?? 0) * 1.5

	if (document.type === "service") score += 8
	if (document.type === "tip") score += 4

	const snippet =
		matchedOn === "body" || matchedOn === "description"
			? makeSnippet(document.body || document.description, [
					...original,
					...expanded,
				])
			: undefined

	return { ...document, score, matchedOn, snippet }
}

/** Build an inverted index for O(tokens) candidate lookup. */
export function buildInvertedIndex(
	documents: SearchDocument[],
): Record<string, number[]> {
	const inverted: Record<string, number[]> = {}

	documents.forEach((document, index) => {
		const tokens = new Set(
			tokenize(
				[
					document.title,
					document.description,
					document.category ?? "",
					document.keywords.join(" "),
					document.body ?? "",
				].join(" "),
			),
		)

		for (const token of tokens) {
			const bucket = inverted[token]
			if (bucket) bucket.push(index)
			else inverted[token] = [index]
		}
	})

	return inverted
}

function candidateIndices(
	documents: SearchDocument[],
	inverted: Record<string, number[]> | undefined,
	tokens: string[],
): number[] {
	if (!tokens.length) {
		return documents.map((_, index) => index)
	}

	if (!inverted || Object.keys(inverted).length === 0) {
		return documents.map((_, index) => index)
	}

	const sets = tokens
		.map((token) => inverted[token])
		.filter((list): list is number[] => Boolean(list?.length))

	if (!sets.length) {
		// Fall back to full scan when inverted misses (stem/synonym-only tokens)
		return documents.map((_, index) => index)
	}

	// Union of posting lists — scoring enforces relevance afterward
	const seen = new Set<number>()
	for (const list of sets) {
		for (const index of list) seen.add(index)
	}
	return [...seen]
}

export function searchDocuments(
	documents: SearchDocument[],
	query: string,
	limit = 24,
	inverted?: Record<string, number[]>,
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
			}))
	}

	const indices = candidateIndices(documents, inverted, parsed.expanded)

	return indices
		.map((index) => {
			const document = documents[index]
			return document ? scoreDocument(document, parsed) : null
		})
		.filter((hit): hit is SearchHit => hit !== null)
		.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
		.slice(0, limit)
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

export function isSearchIndexPayload(
	value: unknown,
): value is SearchIndexPayload {
	if (!value || typeof value !== "object") return false
	const record = value as SearchIndexPayload
	return Array.isArray(record.documents) && typeof record.inverted === "object"
}
