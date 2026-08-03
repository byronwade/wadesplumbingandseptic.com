/**
 * Open research helpers that improve Eve topic/local context without paid SERP APIs.
 * Results are untrusted research leads, never publishable Wade facts alone.
 */
import { classifyUntrustedText } from "./policy.mjs";
import { SOURCE_TIERS, createSourceProvenance } from "./source-policy.mjs";

const USER_AGENT =
	"WadeEveSeoAgent/0.1 (open-research; +https://www.wadesplumbingandseptic.com)";

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
 * Composite open research for proposal context (soft signals only).
 */
export function createOpenResearchAdapter({
	enabled = false,
	fetchImpl = fetch,
	budget = { consume() {} },
} = {}) {
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
	return Object.freeze({
		async probe({ runId } = {}) {
			if (!enabled) {
				return Object.freeze({
					classification: "BLOCKED_MISSING_CREDENTIALS",
					source: "open-research",
					scope: "wikidata-nominatim",
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
				scope: "wikidata-nominatim",
				run_id: runId ?? null,
				payload: Object.freeze({
					reason: "Wikidata and Nominatim research clients are configured.",
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
			const [wiki, places] = await Promise.all([
				wikidata.search({ query: topicQuery || "plumbing", limit: 4 }),
				nominatim.search({ query: placeQuery, limit: 2 }),
			]);
			return Object.freeze({
				classification:
					wiki.classification === "MOCK_VERIFIED" ||
					places.classification === "MOCK_VERIFIED"
						? "MOCK_VERIFIED"
						: "FAILED",
				source: "open-research",
				wikidata: wiki,
				nominatim: places,
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
]);
