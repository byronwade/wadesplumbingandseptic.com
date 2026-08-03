/**
 * Open research helpers that improve Eve topic/local context without paid SERP APIs.
 * Results are untrusted research leads, never publishable Wade facts alone.
 *
 * Grokipedia (xAI / x.com encyclopedia at grokipedia.com) is included as soft
 * context via robots-allowed public HTML only (`/search`, `/page/*`). Eve never
 * calls Grokipedia `/api/*` (disallowed by their robots.txt).
 */
import { classifyUntrustedText } from "./policy.mjs";
import { SOURCE_TIERS, createSourceProvenance } from "./source-policy.mjs";

const USER_AGENT =
	"WadeEveSeoAgent/0.1 (open-research; +https://www.wadesplumbingandseptic.com)";

const GROKIPEDIA_TRADE_TOKENS = Object.freeze([
	"plumbing",
	"septic",
	"drain",
	"wastewater",
	"sewage",
	"pipe",
	"pipes",
	"heater",
	"backflow",
	"toilet",
	"valve",
	"faucet",
	"sump",
	"cistern",
	"sewer",
	"potable",
	"residential",
	"onsite",
	"treatment",
	"tank",
	"field",
	"hydrojet",
	"excavation",
]);

const GROKIPEDIA_NOISE_TOKENS = Object.freeze([
	"film",
	"comedy",
	"movie",
	"band",
	"punk",
	"album",
	"abortion",
	"arthritis",
	"algebraic",
	"projective",
	"foreverisnotenough",
	"babae",
	"filipino",
	"satire",
	"novel",
	"book",
	"grass is always greener",
	"woman in the septic",
	"septic death",
]);

function blocked(source, reason) {
	return Object.freeze({
		classification: "BLOCKED_MISSING_CREDENTIALS",
		source,
		results: [],
		reason,
	});
}

function assertQuery(query) {
	if (typeof query !== "string" || !query.trim() || query.length > 240)
		throw new Error("Open research query must be a bounded non-empty string.");
	return query.trim();
}

function decodeHtmlEntities(value) {
	return String(value ?? "")
		.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
		.replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
			String.fromCharCode(Number.parseInt(hex, 16)),
		)
		.replace(/&quot;/g, '"')
		.replace(/&#34;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">");
}

function extractMetaContent(html, property) {
	const patterns = [
		new RegExp(
			`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
			"i",
		),
		new RegExp(
			`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
			"i",
		),
	];
	for (const pattern of patterns) {
		const match = html.match(pattern);
		if (match?.[1]) return decodeHtmlEntities(match[1]).trim();
	}
	return null;
}

function scoreGrokipediaLead({ title, slug, snippet, opportunity }) {
	const haystack = `${title} ${slug.replaceAll("_", " ")} ${snippet}`.toLowerCase();
	let score = 0;
	for (const token of GROKIPEDIA_TRADE_TOKENS) {
		if (haystack.includes(token)) score += 3;
	}
	const needed = [
		opportunity?.query_cluster,
		...(opportunity?.tags ?? []),
	]
		.filter(Boolean)
		.join(" ")
		.toLowerCase()
		.split(/[^a-z0-9]+/g)
		.filter((token) => token.length >= 4);
	for (const token of needed) {
		if (haystack.includes(token)) score += 4;
	}
	for (const noise of GROKIPEDIA_NOISE_TOKENS) {
		if (haystack.includes(noise)) score -= 8;
	}
	return score;
}

function parseGrokipediaSearchHtml(html) {
	const results = [];
	const seen = new Set();
	const linkRe =
		/<a[^>]+href="(\/page\/([^"]+))"[^>]*data-slug="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
	let match;
	while ((match = linkRe.exec(html)) !== null) {
		const slug = decodeHtmlEntities(match[3] || match[2]).trim();
		if (!slug || seen.has(slug)) continue;
		const block = match[0];
		const snippetMatch = block.match(/data-search-snippet="([^"]*)"/i);
		const titleMatch = block.match(
			/<span[^>]*text-fg-primary[^>]*>\s*([^<]+?)\s*<\/span>/i,
		);
		const title = decodeHtmlEntities(
			titleMatch?.[1] ?? slug.replaceAll("_", " "),
		).slice(0, 160);
		const snippet = decodeHtmlEntities(snippetMatch?.[1] ?? "").slice(0, 300);
		seen.add(slug);
		results.push(
			Object.freeze({
				slug,
				title,
				snippet,
				url: `https://grokipedia.com/page/${encodeURIComponent(slug)}`,
			}),
		);
	}
	return results;
}

/**
 * Wikidata entity search for topic vocabulary / definition leads.
 */
export function createWikidataResearchClient({
	fetchImpl = fetch,
	budget = { consume() {} },
	enabled = true,
} = {}) {
	return Object.freeze({
		id: "wikidata",
		async search({ query, limit = 5 } = {}) {
			if (!enabled)
				return blocked("wikidata", "Wikidata research is disabled.");
			const safeQuery = assertQuery(query);
			const capped = Math.min(
				Math.max(1, Number.isInteger(limit) ? limit : 5),
				8,
			);
			budget.consume("maxExternalRequests");
			const url = new URL("https://www.wikidata.org/w/api.php");
			url.searchParams.set("action", "wbsearchentities");
			url.searchParams.set("search", safeQuery);
			url.searchParams.set("language", "en");
			url.searchParams.set("format", "json");
			url.searchParams.set("limit", String(capped));
			url.searchParams.set("origin", "*");
			const response = await fetchImpl(url, {
				headers: { Accept: "application/json", "User-Agent": USER_AGENT },
			});
			if (!response.ok)
				throw new Error(`Wikidata returned HTTP ${response.status}.`);
			const payload = await response.json();
			const results = (payload.search ?? [])
				.slice(0, capped)
				.map((item) => {
					const label = String(item.label ?? "").slice(0, 160);
					const description = String(item.description ?? "").slice(0, 300);
					const text = `${label}\n${description}`;
					if (!classifyUntrustedText(text).accepted) return null;
					const conceptUri = item.concepturi?.startsWith("http://")
						? item.concepturi.replace("http://", "https://")
						: item.concepturi;
					if (!conceptUri || !conceptUri.startsWith("https://")) return null;
					return Object.freeze({
						id: item.id,
						label,
						description,
						url: conceptUri,
						provenance: createSourceProvenance({
							url: conceptUri,
							tier: SOURCE_TIERS.PUBLIC_WEB,
						}),
						usage: "TOPIC_VOCABULARY_LEAD_ONLY",
					});
				})
				.filter(Boolean);
			return Object.freeze({
				classification: "MOCK_VERIFIED",
				source: "wikidata",
				query: safeQuery,
				results: Object.freeze(results),
			});
		},
	});
}

/**
 * OpenStreetMap Nominatim for Santa Cruz County place grounding.
 */
export function createNominatimResearchClient({
	fetchImpl = fetch,
	budget = { consume() {} },
	enabled = true,
} = {}) {
	return Object.freeze({
		id: "nominatim",
		async search({ query, limit = 3 } = {}) {
			if (!enabled)
				return blocked("nominatim", "Nominatim research is disabled.");
			const safeQuery = assertQuery(query);
			const capped = Math.min(
				Math.max(1, Number.isInteger(limit) ? limit : 3),
				5,
			);
			budget.consume("maxExternalRequests");
			const url = new URL("https://nominatim.openstreetmap.org/search");
			url.searchParams.set("q", safeQuery);
			url.searchParams.set("format", "json");
			url.searchParams.set("limit", String(capped));
			url.searchParams.set("addressdetails", "0");
			const response = await fetchImpl(url, {
				headers: { Accept: "application/json", "User-Agent": USER_AGENT },
			});
			if (!response.ok)
				throw new Error(`Nominatim returned HTTP ${response.status}.`);
			const payload = await response.json();
			if (!Array.isArray(payload))
				throw new Error("Nominatim returned malformed results.");
			const results = payload.slice(0, capped).map((item) => {
				const display = String(item.display_name ?? "").slice(0, 300);
				if (!classifyUntrustedText(display).accepted) {
					throw new Error("Nominatim result contains untrusted instructions.");
				}
				const osmUrl = `https://www.openstreetmap.org/${item.osm_type}/${item.osm_id}`;
				return Object.freeze({
					place_id: item.place_id,
					display_name: display,
					lat: item.lat,
					lon: item.lon,
					url: osmUrl,
					provenance: createSourceProvenance({
						url: osmUrl,
						tier: SOURCE_TIERS.PUBLIC_WEB,
					}),
					usage: "LOCAL_GEO_GROUNDING_ONLY",
				});
			});
			return Object.freeze({
				classification: "MOCK_VERIFIED",
				source: "nominatim",
				query: safeQuery,
				results: Object.freeze(results),
			});
		},
	});
}

/**
 * Grokipedia soft research via robots-allowed public HTML (never `/api/`).
 */
export function createGrokipediaResearchClient({
	fetchImpl = fetch,
	budget = { consume() {} },
	enabled = true,
} = {}) {
	return Object.freeze({
		id: "grokipedia",
		async search({ query, limit = 4, opportunity = null } = {}) {
			if (!enabled)
				return blocked("grokipedia", "Grokipedia research is disabled.");
			const safeQuery = assertQuery(query);
			const capped = Math.min(
				Math.max(1, Number.isInteger(limit) ? limit : 4),
				6,
			);
			budget.consume("maxExternalRequests");
			const searchUrl = new URL("https://grokipedia.com/search");
			searchUrl.searchParams.set("q", safeQuery);
			const response = await fetchImpl(searchUrl, {
				headers: {
					Accept: "text/html",
					"User-Agent": USER_AGENT,
				},
			});
			if (!response.ok)
				throw new Error(`Grokipedia search returned HTTP ${response.status}.`);
			const html =
				typeof response.text === "function"
					? await response.text()
					: String(response.body ?? "");
			const parsed = parseGrokipediaSearchHtml(html)
				.map((item) => {
					const relevance = scoreGrokipediaLead({
						title: item.title,
						slug: item.slug,
						snippet: item.snippet,
						opportunity,
					});
					return { ...item, relevance };
				})
				.filter((item) => item.relevance > 0)
				.sort((left, right) => right.relevance - left.relevance)
				.slice(0, capped);

			const results = [];
			for (const item of parsed) {
				let description = item.snippet;
				let title = item.title;
				// Optional page meta enrich (public /page HTML only; never /api/).
				if (results.length < 2) {
					try {
						budget.consume("maxExternalRequests");
						const pageResponse = await fetchImpl(item.url, {
							headers: {
								Accept: "text/html",
								"User-Agent": USER_AGENT,
							},
						});
						if (pageResponse.ok && typeof pageResponse.text === "function") {
							const pageHtml = await pageResponse.text();
							const ogTitle = extractMetaContent(pageHtml, "og:title");
							const ogDescription =
								extractMetaContent(pageHtml, "og:description") ||
								extractMetaContent(pageHtml, "description");
							if (ogTitle) {
								title = ogTitle
									.replace(/\s+[\u2014\u2013-]\s+Grokipedia$/i, "")
									.trim();
							}
							if (ogDescription) description = ogDescription.slice(0, 300);
						}
					} catch {
						// Keep search snippet when page meta fetch fails.
					}
				}
				const text = `${title}\n${description}`;
				if (!classifyUntrustedText(text).accepted) continue;
				if (!item.url.startsWith("https://grokipedia.com/page/")) continue;
				results.push(
					Object.freeze({
						slug: item.slug,
						label: title.slice(0, 160),
						description: String(description ?? "").slice(0, 300),
						url: item.url,
						relevance: item.relevance,
						provenance: createSourceProvenance({
							url: item.url,
							tier: SOURCE_TIERS.PUBLIC_WEB,
						}),
						usage: "TOPIC_VOCABULARY_LEAD_ONLY",
						provider: "grokipedia",
						notes:
							"xAI Grokipedia public page lead; AI-generated encyclopedia context; never Wade facts alone; robots-safe HTML only.",
					}),
				);
			}

			return Object.freeze({
				classification: "MOCK_VERIFIED",
				source: "grokipedia",
				query: safeQuery,
				results: Object.freeze(results),
				transport: "public_html",
				api_used: false,
			});
		},
	});
}

/**
 * Composite open research for proposal context (soft signals only).
 */
export function createOpenResearchAdapter({
	enabled = false,
	grokipediaEnabled = null,
	fetchImpl = fetch,
	budget = { consume() {} },
} = {}) {
	const useGrokipedia =
		grokipediaEnabled === null ? enabled : grokipediaEnabled === true;
	const wikidata = createWikidataResearchClient({
		fetchImpl,
		budget,
		enabled,
	});
	const nominatim = createNominatimResearchClient({
		fetchImpl,
		budget,
		enabled,
	});
	const grokipedia = createGrokipediaResearchClient({
		fetchImpl,
		budget,
		enabled: useGrokipedia,
	});
	return Object.freeze({
		async probe({ runId } = {}) {
			if (!enabled) {
				return Object.freeze({
					classification: "BLOCKED_MISSING_CREDENTIALS",
					source: "open-research",
					scope: "wikidata-nominatim-grokipedia",
					run_id: runId ?? null,
					payload: Object.freeze({
						reason: "Open research helpers are disabled.",
						next_action:
							"Enable SEO_AGENT_ENABLE_OPEN_RESEARCH (or standing Production propose) per docs/seo-agent/MANUAL_SETUP.md.",
					}),
				});
			}
			return Object.freeze({
				classification: "MOCK_VERIFIED",
				source: "open-research",
				scope: "wikidata-nominatim-grokipedia",
				run_id: runId ?? null,
				payload: Object.freeze({
					reason:
						"Wikidata, Nominatim, and robots-safe Grokipedia HTML research clients are configured.",
					grokipedia_enabled: useGrokipedia,
					grokipedia_transport: "public_html",
					next_action:
						"Review soft research leads in draft PR context; never treat them as Wade facts. See docs/seo-agent/MANUAL_SETUP.md.",
				}),
			});
		},

		async researchOpportunity({ opportunity } = {}) {
			if (!enabled) {
				return blocked(
					"open-research",
					"Open research helpers are disabled for this environment.",
				);
			}
			if (!opportunity || typeof opportunity !== "object")
				throw new Error("Open research requires an opportunity.");
			const topicQuery = [
				opportunity.query_cluster,
				...(opportunity.tags ?? []).slice(0, 2),
			]
				.filter(Boolean)
				.join(" ")
				.slice(0, 240);
			const placeQuery = "Santa Cruz County California";
			const [wiki, places, grok] = await Promise.all([
				wikidata.search({ query: topicQuery || "plumbing", limit: 4 }),
				nominatim.search({ query: placeQuery, limit: 2 }),
				useGrokipedia
					? grokipedia.search({
							query: topicQuery || "plumbing",
							limit: 4,
							opportunity,
						})
					: Promise.resolve(
							blocked("grokipedia", "Grokipedia research is disabled."),
						),
			]);
			const anyOk =
				wiki.classification === "MOCK_VERIFIED" ||
				places.classification === "MOCK_VERIFIED" ||
				grok.classification === "MOCK_VERIFIED";
			return Object.freeze({
				classification: anyOk ? "MOCK_VERIFIED" : "FAILED",
				source: "open-research",
				wikidata: wiki,
				nominatim: places,
				grokipedia: grok,
				publication_permitted: false,
				usage: "SOFT_CONTEXT_ONLY",
			});
		},
	});
}

export const OPEN_RESEARCH_DOMAINS = Object.freeze([
	"www.wikidata.org",
	"wikidata.org",
	"nominatim.openstreetmap.org",
	"www.openstreetmap.org",
	"openstreetmap.org",
	"grokipedia.com",
	"www.grokipedia.com",
]);
