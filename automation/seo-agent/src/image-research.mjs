import { classifyUntrustedText } from "./policy.mjs";

const MAX_RESULTS = 12;

function blocked(reason) {
	return Object.freeze({
		classification: "BLOCKED_MISSING_CREDENTIALS",
		source: "image-research",
		candidates: [],
		reason,
	});
}

function assertQuery(query) {
	if (typeof query !== "string" || !query.trim() || query.length > 240)
		throw new Error("Image-search query must be a bounded non-empty string.");
	return query.trim();
}

function normalizeCandidate(candidate, allowedDomains) {
	if (!candidate || typeof candidate !== "object")
		throw new Error("Image-search result must be an object.");
	const sourceUrl = new URL(candidate.source_url);
	const assetUrl = new URL(candidate.asset_url);
	if (sourceUrl.protocol !== "https:" || assetUrl.protocol !== "https:")
		throw new Error("Image-search results must use HTTPS URLs.");
	if (
		!allowedDomains.includes(sourceUrl.hostname) ||
		!allowedDomains.includes(assetUrl.hostname)
	) {
		throw new Error("Image-search result domain is not explicitly approved.");
	}
	const text = [candidate.title, candidate.description, candidate.alt]
		.filter(Boolean)
		.join("\n");
	const untrusted = classifyUntrustedText(text);
	if (!untrusted.accepted)
		throw new Error("Image-search result contains untrusted instructions.");
	return Object.freeze({
		source_url: sourceUrl.toString(),
		asset_url: assetUrl.toString(),
		title:
			typeof candidate.title === "string"
				? candidate.title.slice(0, 240)
				: null,
		description:
			typeof candidate.description === "string"
				? candidate.description.slice(0, 600)
				: null,
		alt: typeof candidate.alt === "string" ? candidate.alt.slice(0, 300) : null,
		usage_rights: "UNVERIFIED",
		publication_eligible: false,
		required_next_action:
			"Obtain rights evidence, relevance rationale, descriptive alt text, and human approval before a draft can use this asset.",
	});
}

/**
 * Generic injected image-discovery boundary. Search results are untrusted
 * research candidates, never an asset license or publishing permission.
 */
export function createImageResearchAdapter({
	enabled = false,
	allowedDomains = [],
	imageSearchClient,
	budget = { consume() {} },
} = {}) {
	return Object.freeze({
		async search({ query, limit = 8 } = {}) {
			if (!enabled)
				return blocked("No reviewed image-search provider is configured.");
			if (!Array.isArray(allowedDomains) || allowedDomains.length === 0)
				return blocked(
					"Image research requires an explicit source-domain allowlist.",
				);
			if (typeof imageSearchClient?.searchImages !== "function")
				return blocked("No injected image-search client is available.");
			const safeQuery = assertQuery(query);
			if (!Number.isInteger(limit) || limit < 1 || limit > MAX_RESULTS)
				throw new Error(
					`Image-search limit must be between 1 and ${MAX_RESULTS}.`,
				);
			budget.consume("maxExternalRequests");
			const response = await imageSearchClient.searchImages({
				query: safeQuery,
				limit,
			});
			if (!Array.isArray(response?.results))
				throw new Error("Image-search provider returned malformed results.");
			return Object.freeze({
				classification: "MOCK_VERIFIED",
				source: "image-research",
				query: safeQuery,
				candidates: Object.freeze(
					response.results
						.slice(0, limit)
						.map((candidate) => normalizeCandidate(candidate, allowedDomains)),
				),
				publication_permitted: false,
			});
		},
	});
}
