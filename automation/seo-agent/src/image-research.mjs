import { classifyUntrustedText } from "./policy.mjs";
import { rankExternalImageCandidates } from "./image-selection.mjs";
import {
	IMAGE_PROVIDER_DOMAINS,
	buildImageSearchQuery,
	createAiLineArtImageClient,
	createCompositeImageSearchClient,
	createPexelsImageClient,
	createUnsplashImageClient,
	createWikimediaImageClient,
	isAllowedImageHostname,
} from "./image-providers.mjs";
import {
	createArticImageClient,
	createEuropeanaImageClient,
	createFlickrImageClient,
	createMetMuseumImageClient,
	createNasaImageClient,
	createOpenverseImageClient,
	createPixabayImageClient,
} from "./image-providers-open.mjs";

const MAX_RESULTS = 24;

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
	const sourceOk = isAllowedImageHostname(sourceUrl.hostname, allowedDomains);
	const assetOk =
		Boolean(candidate.inline_svg) ||
		isAllowedImageHostname(assetUrl.hostname, allowedDomains) ||
		(candidate.aggregated_asset === true && sourceOk);
	if (!sourceOk || !assetOk) {
		throw new Error("Image-search result domain is not explicitly approved.");
	}
	const text = [candidate.title, candidate.description, candidate.alt]
		.filter(Boolean)
		.join("\n");
	const untrusted = classifyUntrustedText(text);
	if (!untrusted.accepted)
		throw new Error("Image-search result contains untrusted instructions.");
	return Object.freeze({
		provider: candidate.provider ?? null,
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
		photographer: candidate.photographer ?? null,
		license_name: candidate.license_name ?? null,
		license_url: candidate.license_url ?? null,
		usage_rights_provisional: candidate.usage_rights_provisional ?? null,
		rights_evidence_id: candidate.rights_evidence_id ?? null,
		attribution_required: candidate.attribution_required === true,
		generation_style: candidate.generation_style ?? null,
		aggregated_asset: candidate.aggregated_asset === true,
		inline_svg:
			typeof candidate.inline_svg === "string" ? candidate.inline_svg : null,
		usage_rights: "UNVERIFIED",
		publication_eligible: false,
		required_next_action:
			"Obtain rights evidence, stage into public/images/sourced/, write descriptive alt text, and get human PR approval before featured or body use.",
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
		async probe({ runId } = {}) {
			if (!enabled) {
				return Object.freeze({
					classification: "BLOCKED_MISSING_CREDENTIALS",
					source: "image-research",
					scope: "image-search",
					run_id: runId ?? null,
					payload: Object.freeze({
						reason: "Image sourcing is disabled for this environment.",
						next_action:
							"Enable SEO_AGENT_ENABLE_IMAGE_SOURCING (or standing Production propose), optionally add stock API keys, and follow docs/seo-agent/MANUAL_SETUP.md.",
					}),
				});
			}
			if (!Array.isArray(allowedDomains) || allowedDomains.length === 0) {
				return Object.freeze({
					classification: "BLOCKED_MISSING_CREDENTIALS",
					source: "image-research",
					scope: "image-search",
					run_id: runId ?? null,
					payload: Object.freeze({
						reason: "Image research allowlist is empty.",
						next_action:
							"Use the versioned image provider domain allowlist in docs/seo-agent/MANUAL_SETUP.md.",
					}),
				});
			}
			if (typeof imageSearchClient?.searchImages !== "function") {
				return Object.freeze({
					classification: "BLOCKED_MISSING_CREDENTIALS",
					source: "image-research",
					scope: "image-search",
					run_id: runId ?? null,
					payload: Object.freeze({
						reason: "No image-search client is configured.",
						next_action:
							"Configure open image clients per docs/seo-agent/MANUAL_SETUP.md.",
					}),
				});
			}
			return Object.freeze({
				classification: "MOCK_VERIFIED",
				source: "image-research",
				scope: "image-search",
				run_id: runId ?? null,
				payload: Object.freeze({
					reason:
						"Image research adapter is configured for offline/fixture use.",
					next_action:
						"Run a Production propose cycle and review staged assets in the draft PR Images section; see docs/seo-agent/MANUAL_SETUP.md.",
				}),
			});
		},

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
			if (response?.classification === "BLOCKED_MISSING_CREDENTIALS") {
				return blocked(
					response.reason ?? "Image providers reported missing credentials.",
				);
			}
			if (!Array.isArray(response?.results))
				throw new Error("Image-search provider returned malformed results.");
			const normalized = [];
			for (const candidate of response.results.slice(0, limit)) {
				try {
					normalized.push(normalizeCandidate(candidate, allowedDomains));
				} catch (error) {
					const message =
						error instanceof Error ? error.message : "normalize failed";
					// Injection/instruction smuggling must fail closed for the search.
					if (/untrusted instructions/i.test(message)) throw error;
					// Skip rows with unallowlisted aggregated hosts or malformed URLs.
				}
			}
			return Object.freeze({
				classification:
					response.classification === "FAILED" && normalized.length === 0
						? "FAILED"
						: "MOCK_VERIFIED",
				source: "image-research",
				query: safeQuery,
				candidates: Object.freeze(normalized),
				publication_permitted: false,
				provider_summaries: response.provider_summaries ?? null,
			});
		},

		async searchRelevant({ query, limit = 8, opportunity } = {}) {
			const raw = await this.search({ query, limit });
			if (
				raw.classification !== "MOCK_VERIFIED" &&
				raw.classification !== "LIVE_VERIFIED"
			) {
				return raw;
			}
			const ranked = rankExternalImageCandidates({
				opportunity,
				candidates: raw.candidates,
				limit,
			});
			return Object.freeze({
				...raw,
				candidates: ranked.candidates,
				publication_permitted: false,
				relevance_filtered: true,
			});
		},

		async searchForOpportunity({ opportunity, limit = 16 } = {}) {
			const query = buildImageSearchQuery(opportunity);
			return this.searchRelevant({ query, limit, opportunity });
		},
	});
}

/**
 * Build the multi-source adapter from config credentials/flags.
 * Keyless: Wikimedia, Openverse, MET, AIC, NASA.
 * Optional keys: Unsplash, Pexels, Pixabay, Flickr, Europeana.
 * AI line-art needs Gateway + explicit flag.
 */
export function createConfiguredImageResearchAdapter({
	config,
	fetchImpl = fetch,
	budget = { consume() {} },
	includeAiLineArt = false,
} = {}) {
	const flags = config?.integrationFlags ?? {};
	const credentials = config?.credentials ?? {};
	const enabled = flags.imageSourcing === true;
	if (!enabled) {
		return createImageResearchAdapter({ enabled: false, budget });
	}

	const clients = [
		createOpenverseImageClient({ fetchImpl, budget }),
		createWikimediaImageClient({ fetchImpl, budget }),
		createMetMuseumImageClient({ fetchImpl, budget }),
		createArticImageClient({ fetchImpl, budget }),
		createNasaImageClient({ fetchImpl, budget }),
		createUnsplashImageClient({
			accessKey: credentials.unsplashAccessKey,
			fetchImpl,
			budget,
		}),
		createPexelsImageClient({
			apiKey: credentials.pexelsApiKey,
			fetchImpl,
			budget,
		}),
		createPixabayImageClient({
			apiKey: credentials.pixabayApiKey,
			fetchImpl,
			budget,
		}),
		createFlickrImageClient({
			apiKey: credentials.flickrApiKey,
			fetchImpl,
			budget,
		}),
		createEuropeanaImageClient({
			apiKey: credentials.europeanaApiKey,
			fetchImpl,
			budget,
		}),
	];
	if (includeAiLineArt && flags.imageAiLineArt === true) {
		clients.push(
			createAiLineArtImageClient({
				apiKey: credentials.aiGatewayApiKey,
				oidcToken: credentials.vercelOidcToken,
				fetchImpl,
				budget,
			}),
		);
	}

	const imageSearchClient = createCompositeImageSearchClient({
		clients,
		budget,
	});
	return createImageResearchAdapter({
		enabled: true,
		allowedDomains: [...IMAGE_PROVIDER_DOMAINS],
		imageSearchClient,
		budget,
	});
}

export { IMAGE_PROVIDER_DOMAINS, buildImageSearchQuery };
