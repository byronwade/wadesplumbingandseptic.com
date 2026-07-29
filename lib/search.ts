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
}

export type SearchHit = SearchDocument & {
	score: number
	matchedOn: "title" | "category" | "keyword" | "description"
}

/** Domain synonyms so casual homeowner language finds the right pages. */
export const SEARCH_SYNONYMS: Record<string, string[]> = {
	septic: [
		"tank",
		"leach",
		"drainfield",
		"drain field",
		"atua",
		"ats",
		"engineered",
		"pumping",
		"pump",
	],
	clog: ["drain", "backup", "blockage", "slow drain", "stopped up"],
	drain: ["clog", "sewer", "cleanout", "hydro jetting", "jetting"],
	"water heater": ["tankless", "hot water", "heater", "boiler"],
	leak: ["drip", "burst", "pipe", "slab leak", "detection"],
	toilet: ["commode", "fixture", "wax ring"],
	sink: ["faucet", "fixture", "garbage disposal", "disposal"],
	emergency: ["urgent", "burst", "backup", "overflow", "flooding"],
	urgent: ["emergency", "priority", "same day", "backup"],
	inspection: ["camera", "video", "assess", "assessment"],
	pumping: ["pump", "clean", "cleanout", "empty"],
	hydro: ["jetting", "hydro jetting", "pressure washing", "high pressure"],
	commercial: ["business", "restaurant", "grease trap", "multi-unit"],
	backflow: ["prevention", "testing", "rpz"],
	pipe: ["repipe", "replacement", "repair", "trenchless"],
	camera: ["video inspection", "inspection", "locate"],
	santa: ["santa cruz", "scotts valley", "watsonville", "aptos", "capitola"],
	garbage: ["disposal", "garbage disposal", "sink disposal"],
	faucet: ["tap", "spigot", "fixture", "sink"],
	sump: ["sump pump", "basement", "flood"],
	grease: ["grease trap", "interceptor", "restaurant"],
	root: ["rooter", "roots", "sewer line", "tree roots"],
	slab: ["slab leak", "under slab", "foundation"],
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

function expandTokens(tokens: string[]) {
	const expanded = new Set(tokens)

	for (const token of tokens) {
		for (const [canonical, aliases] of Object.entries(SEARCH_SYNONYMS)) {
			const family = [canonical, ...aliases].map(normalize)
			if (family.some((item) => item.includes(token) || token.includes(item))) {
				for (const item of family) {
					for (const part of item.split(" ")) {
						if (part.length > 1) expanded.add(part)
					}
				}
			}
		}
	}

	return [...expanded]
}

function fuzzyIncludes(haystack: string, needle: string) {
	if (!needle) return false
	if (haystack.includes(needle)) return true
	if (needle.length < 4) return false

	// Light typo tolerance for short homeowner queries.
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

function scoreDocument(
	document: SearchDocument,
	tokens: string[],
	phrase = "",
): SearchHit | null {
	if (tokens.length === 0) {
		return {
			...document,
			score: document.popularity ?? 0,
			matchedOn: "title",
		}
	}

	const title = normalize(document.title)
	const description = normalize(document.description)
	const category = normalize(document.category ?? "")
	const keywords = normalize(document.keywords.join(" "))
	const expanded = expandTokens(tokens)

	let score = 0
	let matchedOn: SearchHit["matchedOn"] = "description"
	let matchedTokens = 0

	// Reward full-phrase matches ("water heater", "septic pumping").
	if (phrase.length > 3) {
		if (title.includes(phrase)) {
			score += 140
			matchedOn = "title"
			matchedTokens += 1
		} else if (keywords.includes(phrase)) {
			score += 70
			matchedOn = "keyword"
			matchedTokens += 1
		} else if (description.includes(phrase)) {
			score += 40
			matchedTokens += 1
		}
	}

	for (const token of expanded) {
		let tokenScore = 0

		if (title === token) {
			tokenScore = 120
			matchedOn = "title"
		} else if (title.startsWith(token)) {
			tokenScore = 95
			matchedOn = "title"
		} else if (title.includes(token)) {
			tokenScore = 80
			matchedOn = "title"
		} else if (category.includes(token)) {
			tokenScore = 55
			if (matchedOn === "description") matchedOn = "category"
		} else if (keywords.includes(token) || fuzzyIncludes(keywords, token)) {
			tokenScore = 45
			if (matchedOn === "description") matchedOn = "keyword"
		} else if (
			description.includes(token) ||
			fuzzyIncludes(description, token)
		) {
			tokenScore = 25
		} else if (fuzzyIncludes(title, token)) {
			tokenScore = 50
			matchedOn = "title"
		}

		if (tokenScore > 0) {
			matchedTokens += 1
			score += tokenScore
		}
	}

	// Prefer documents that cover more of the query intent.
	const coverage = matchedTokens / expanded.length
	if (coverage === 0) return null

	score *= 0.55 + coverage * 0.45
	score += (document.popularity ?? 0) * 2

	if (document.type === "service") score += 8
	if (document.type === "tip") score += 4

	return { ...document, score, matchedOn }
}

export function searchDocuments(
	documents: SearchDocument[],
	query: string,
	limit = 24,
): SearchHit[] {
	const tokens = tokenize(query)

	if (tokens.length === 0) {
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

	const phrase = normalize(query)

	return documents
		.map((document) => scoreDocument(document, tokens, phrase))
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
