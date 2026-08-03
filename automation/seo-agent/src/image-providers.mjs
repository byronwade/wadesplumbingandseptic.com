/**
 * Reviewed online image providers for Eve research + draft staging.
 *
 * Providers return normalized candidates with provisional rights metadata.
 * Nothing here authorizes publication until staging + human PR review.
 */
import { classifyUntrustedText } from "./policy.mjs";
import { sha256 } from "./contracts.mjs";

import {
	OPEN_IMAGE_ASSET_HOST_SUFFIXES,
	OPEN_IMAGE_PROVIDER_DOMAINS,
} from "./image-providers-open.mjs";

export const IMAGE_PROVIDER_DOMAINS = Object.freeze([
	"api.unsplash.com",
	"images.unsplash.com",
	"unsplash.com",
	"www.unsplash.com",
	"api.pexels.com",
	"images.pexels.com",
	"pexels.com",
	"www.pexels.com",
	"commons.wikimedia.org",
	"upload.wikimedia.org",
	"ai-gateway.vercel.sh",
	...OPEN_IMAGE_PROVIDER_DOMAINS,
]);

export const IMAGE_ASSET_HOST_SUFFIXES = Object.freeze([
	...OPEN_IMAGE_ASSET_HOST_SUFFIXES,
]);

const MAX_RESULTS_PER_PROVIDER = 8;
const MAX_COMBINED = 40;

export function isAllowedImageHostname(
	hostname,
	allowedDomains = IMAGE_PROVIDER_DOMAINS,
) {
	if (typeof hostname !== "string" || !hostname) return false;
	if (
		allowedDomains.some(
			(domain) => hostname === domain || hostname.endsWith(`.${domain}`),
		)
	) {
		return true;
	}
	return IMAGE_ASSET_HOST_SUFFIXES.some(
		(suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`),
	);
}

const WIKIMEDIA_ALLOWED_LICENSES = Object.freeze([
	"cc0",
	"pd",
	"public domain",
	"cc-by",
	"cc-by-sa",
	"cc by",
	"cc by-sa",
]);

function assertQuery(query) {
	if (typeof query !== "string" || !query.trim() || query.length > 240)
		throw new Error("Image provider query must be a bounded non-empty string.");
	return query.trim();
}

function safeText(value, max) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	if (!trimmed) return null;
	const untrusted = classifyUntrustedText(trimmed);
	if (!untrusted.accepted) return null;
	return trimmed.slice(0, max);
}

function candidateBase(fields) {
	const sourceUrl = new URL(fields.source_url);
	const assetUrl = new URL(fields.asset_url);
	if (sourceUrl.protocol !== "https:" || assetUrl.protocol !== "https:")
		throw new Error("Image provider URLs must use HTTPS.");
	return Object.freeze({
		provider: fields.provider,
		source_url: sourceUrl.toString(),
		asset_url: assetUrl.toString(),
		title: safeText(fields.title, 240),
		description: safeText(fields.description, 600),
		alt: safeText(fields.alt, 300),
		photographer: safeText(fields.photographer, 120),
		license_name: safeText(fields.license_name, 120),
		license_url: fields.license_url
			? new URL(fields.license_url).toString()
			: null,
		usage_rights_provisional: fields.usage_rights_provisional,
		rights_evidence_id: fields.rights_evidence_id,
		attribution_required: fields.attribution_required === true,
		generation_style: fields.generation_style ?? null,
		width: Number.isInteger(fields.width) ? fields.width : null,
		height: Number.isInteger(fields.height) ? fields.height : null,
		publication_eligible: false,
		usage_rights: "UNVERIFIED",
	});
}

async function readJson(response, label) {
	if (!response.ok) {
		throw new Error(`${label} returned HTTP ${response.status}.`);
	}
	return response.json();
}

/**
 * Unsplash Search Photos. Commercial use allowed with attribution.
 */
export function createUnsplashImageClient({
	accessKey,
	fetchImpl = fetch,
	budget = { consume() {} },
} = {}) {
	return Object.freeze({
		id: "unsplash",
		async searchImages({ query, limit = 6 } = {}) {
			if (!accessKey) {
				return Object.freeze({
					classification: "BLOCKED_MISSING_CREDENTIALS",
					provider: "unsplash",
					results: [],
					reason: "Missing UNSPLASH_ACCESS_KEY.",
				});
			}
			const safeQuery = assertQuery(query);
			const capped = Math.min(
				Math.max(1, Number.isInteger(limit) ? limit : 6),
				MAX_RESULTS_PER_PROVIDER,
			);
			budget.consume("maxExternalRequests");
			const url = new URL("https://api.unsplash.com/search/photos");
			url.searchParams.set("query", safeQuery);
			url.searchParams.set("per_page", String(capped));
			url.searchParams.set("orientation", "landscape");
			url.searchParams.set("content_filter", "high");
			const response = await fetchImpl(url, {
				headers: {
					Authorization: `Client-ID ${accessKey}`,
					"Accept-Version": "v1",
				},
			});
			const payload = await readJson(response, "Unsplash");
			const results = (payload.results ?? [])
				.slice(0, capped)
				.map((photo) => {
					const id = String(photo.id ?? "").slice(0, 64);
					if (!id) return null;
					const asset =
						photo.urls?.regular ?? photo.urls?.full ?? photo.urls?.raw;
					const page = photo.links?.html ?? `https://unsplash.com/photos/${id}`;
					if (!asset) return null;
					return candidateBase({
						provider: "unsplash",
						source_url: page,
						asset_url: asset,
						title:
							photo.description ?? photo.alt_description ?? "Unsplash photo",
						description: photo.alt_description ?? photo.description,
						alt: photo.alt_description ?? photo.description,
						photographer: photo.user?.name ?? photo.user?.username,
						license_name: "Unsplash License",
						license_url: "https://unsplash.com/license",
						usage_rights_provisional: "LICENSED",
						rights_evidence_id: `unsplash-license:${id}`,
						attribution_required: true,
						width: photo.width,
						height: photo.height,
					});
				})
				.filter(Boolean);
			return Object.freeze({
				classification: "MOCK_VERIFIED",
				provider: "unsplash",
				results: Object.freeze(results),
			});
		},
	});
}

/**
 * Pexels Search Photos. Free for commercial use with attribution guidance.
 */
export function createPexelsImageClient({
	apiKey,
	fetchImpl = fetch,
	budget = { consume() {} },
} = {}) {
	return Object.freeze({
		id: "pexels",
		async searchImages({ query, limit = 6 } = {}) {
			if (!apiKey) {
				return Object.freeze({
					classification: "BLOCKED_MISSING_CREDENTIALS",
					provider: "pexels",
					results: [],
					reason: "Missing PEXELS_API_KEY.",
				});
			}
			const safeQuery = assertQuery(query);
			const capped = Math.min(
				Math.max(1, Number.isInteger(limit) ? limit : 6),
				MAX_RESULTS_PER_PROVIDER,
			);
			budget.consume("maxExternalRequests");
			const url = new URL("https://api.pexels.com/v1/search");
			url.searchParams.set("query", safeQuery);
			url.searchParams.set("per_page", String(capped));
			url.searchParams.set("orientation", "landscape");
			const response = await fetchImpl(url, {
				headers: { Authorization: apiKey },
			});
			const payload = await readJson(response, "Pexels");
			const results = (payload.photos ?? [])
				.slice(0, capped)
				.map((photo) => {
					const id = String(photo.id ?? "").slice(0, 64);
					if (!id) return null;
					const asset =
						photo.src?.large2x ?? photo.src?.large ?? photo.src?.original;
					if (!asset || !photo.url) return null;
					return candidateBase({
						provider: "pexels",
						source_url: photo.url,
						asset_url: asset,
						title: photo.alt || "Pexels photo",
						description: photo.alt,
						alt: photo.alt,
						photographer: photo.photographer,
						license_name: "Pexels License",
						license_url: "https://www.pexels.com/license/",
						usage_rights_provisional: "LICENSED",
						rights_evidence_id: `pexels-license:${id}`,
						attribution_required: true,
						width: photo.width,
						height: photo.height,
					});
				})
				.filter(Boolean);
			return Object.freeze({
				classification: "MOCK_VERIFIED",
				provider: "pexels",
				results: Object.freeze(results),
			});
		},
	});
}

function wikimediaLicenseAllowed(licenseShortName) {
	if (typeof licenseShortName !== "string") return false;
	const normalized = licenseShortName.trim().toLowerCase();
	// Reject non-commercial / no-derivatives before allowlist matching.
	if (/\bnc\b/.test(normalized) || /\bnd\b/.test(normalized)) return false;
	if (
		normalized.includes("noncommercial") ||
		normalized.includes("no derivatives")
	)
		return false;
	return WIKIMEDIA_ALLOWED_LICENSES.some((allowed) => {
		if (normalized === allowed) return true;
		if (normalized.startsWith(`${allowed} `)) return true;
		// Allow "cc-by-4.0" / "cc by-sa 3.0" but not "cc-by-nc".
		if (allowed === "cc-by" || allowed === "cc by") {
			return (
				/^cc[- ]by(?:\s|-\d|$)/.test(normalized) &&
				!/^cc[- ]by-nc/.test(normalized.replace(/\s+/g, "-"))
			);
		}
		if (allowed === "cc-by-sa" || allowed === "cc by-sa") {
			return /^cc[- ]by[- ]sa(?:\s|-|$)/.test(normalized);
		}
		return (
			normalized.startsWith(`${allowed}-`) ||
			normalized.startsWith(`${allowed} `)
		);
	});
}

function classifyWikimediaRights(licenseShortName) {
	const normalized = String(licenseShortName).trim().toLowerCase();
	if (
		normalized.includes("cc0") ||
		normalized.includes("public domain") ||
		normalized === "pd"
	) {
		return "PUBLIC_DOMAIN";
	}
	return "LICENSED";
}

/**
 * Wikimedia Commons MediaSearch. No API key. Commercial-safe licenses only.
 */
export function createWikimediaImageClient({
	fetchImpl = fetch,
	budget = { consume() {} },
} = {}) {
	return Object.freeze({
		id: "wikimedia",
		async searchImages({ query, limit = 6 } = {}) {
			const safeQuery = assertQuery(query);
			const capped = Math.min(
				Math.max(1, Number.isInteger(limit) ? limit : 6),
				MAX_RESULTS_PER_PROVIDER,
			);
			budget.consume("maxExternalRequests");
			const url = new URL("https://commons.wikimedia.org/w/api.php");
			url.searchParams.set("action", "query");
			url.searchParams.set("format", "json");
			url.searchParams.set("origin", "*");
			url.searchParams.set("generator", "search");
			url.searchParams.set("gsrsearch", `${safeQuery} filetype:bitmap|drawing`);
			url.searchParams.set("gsrlimit", String(capped));
			url.searchParams.set("gsrnamespace", "6");
			url.searchParams.set("prop", "imageinfo");
			url.searchParams.set("iiprop", "url|size|extmetadata|mime|dimensions");
			url.searchParams.set("iiurlwidth", "1600");
			const response = await fetchImpl(url);
			const payload = await readJson(response, "Wikimedia Commons");
			const pages = Object.values(payload.query?.pages ?? {});
			const results = pages
				.map((page) => {
					const info = page.imageinfo?.[0];
					if (!info?.url || !info?.descriptionurl) return null;
					const mime = String(info.mime ?? "");
					if (!/^image\/(jpeg|png|webp|gif)$/i.test(mime)) return null;
					const license =
						info.extmetadata?.LicenseShortName?.value ??
						info.extmetadata?.License?.value ??
						"";
					if (!wikimediaLicenseAllowed(license)) return null;
					const title = String(page.title ?? "")
						.replace(/^File:/i, "")
						.slice(0, 240);
					const artist = safeText(
						String(info.extmetadata?.Artist?.value ?? "")
							.replace(/<[^>]+>/g, " ")
							.replace(/\s+/g, " "),
						120,
					);
					const description = safeText(
						String(
							info.extmetadata?.ImageDescription?.value ??
								info.extmetadata?.ObjectName?.value ??
								title,
						)
							.replace(/<[^>]+>/g, " ")
							.replace(/\s+/g, " "),
						600,
					);
					const pageId = String(page.pageid ?? title)
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, "-")
						.slice(0, 80);
					const rights = classifyWikimediaRights(license);
					return candidateBase({
						provider: "wikimedia",
						source_url: info.descriptionurl,
						asset_url: info.thumburl ?? info.url,
						title,
						description,
						alt: description ?? title,
						photographer: artist,
						license_name: String(license).slice(0, 120),
						license_url:
							info.extmetadata?.LicenseUrl?.value ??
							"https://commons.wikimedia.org/wiki/Commons:Licensing",
						usage_rights_provisional: rights,
						rights_evidence_id: `wikimedia-${rights.toLowerCase()}:${pageId}`,
						attribution_required: rights === "LICENSED",
						width: info.width,
						height: info.height,
					});
				})
				.filter(Boolean)
				.slice(0, capped);
			return Object.freeze({
				classification: "MOCK_VERIFIED",
				provider: "wikimedia",
				results: Object.freeze(results),
			});
		},
	});
}

const LINE_ART_SYSTEM = `You produce professional technical line-art illustrations as SVG only.
Rules:
- Output a single complete SVG document and nothing else.
- Use black strokes on a transparent or white background.
- No photorealism, no gradients that look painted, no fake photography, no watermarks, no logos, no text labels unless essential.
- Prefer clean monoline / blueprint / instructional diagram style suitable for a licensed plumbing contractor website.
- ViewBox 1600x900, landscape.
- Keep paths simple and high-contrast for web use.`;

function extractSvg(text) {
	if (typeof text !== "string") return null;
	const match = text.match(/<svg[\s\S]*?<\/svg>/i);
	if (!match) return null;
	const svg = match[0].trim();
	if (svg.length < 80 || svg.length > 180_000) return null;
	if (/<script|onload=|javascript:/i.test(svg)) return null;
	const untrusted = classifyUntrustedText(svg.replace(/<[^>]+>/g, " "));
	if (!untrusted.accepted) return null;
	return svg;
}

/**
 * AI technical line-art fallback via AI Gateway chat (SVG, not photoreal images).
 * Careful style: instructional blueprint line art to avoid obvious AI photos.
 */
export function createAiLineArtImageClient({
	apiKey = null,
	oidcToken = null,
	fetchImpl = fetch,
	budget = { consume() {} },
	model = "openai/gpt-4o-mini",
} = {}) {
	return Object.freeze({
		id: "ai-lineart",
		async searchImages({ query, limit = 1 } = {}) {
			if (!apiKey && !oidcToken) {
				return Object.freeze({
					classification: "BLOCKED_MISSING_CREDENTIALS",
					provider: "ai-lineart",
					results: [],
					reason:
						"Missing AI Gateway OIDC or AI_GATEWAY_API_KEY for line-art generation.",
				});
			}
			const safeQuery = assertQuery(query);
			const capped = Math.min(
				Math.max(1, Number.isInteger(limit) ? limit : 1),
				2,
			);
			budget.consume("maxExternalRequests");
			const headers = {
				"content-type": "application/json",
			};
			if (oidcToken) headers.Authorization = `Bearer ${oidcToken}`;
			else headers.Authorization = `Bearer ${apiKey}`;
			const response = await fetchImpl(
				"https://ai-gateway.vercel.sh/v1/chat/completions",
				{
					method: "POST",
					headers,
					body: JSON.stringify({
						model,
						temperature: 0.4,
						messages: [
							{ role: "system", content: LINE_ART_SYSTEM },
							{
								role: "user",
								content: `Create one professional technical line-art SVG for: ${safeQuery}. Subject must be clearly about that topic for a Santa Cruz County plumbing and septic contractor blog. No people faces. No brand marks.`,
							},
						],
					}),
				},
			);
			const payload = await readJson(response, "AI Gateway line-art");
			const content = payload.choices?.[0]?.message?.content;
			const svg = extractSvg(content);
			if (!svg) {
				return Object.freeze({
					classification: "FAILED",
					provider: "ai-lineart",
					results: [],
					reason: "AI line-art response did not contain a safe SVG.",
				});
			}
			const digest = sha256(svg).slice(0, 16);
			const dataUrl = `https://ai-gateway.vercel.sh/v1/generated/lineart/${digest}.svg`;
			const results = Array.from({ length: capped }, (_, index) =>
				candidateBase({
					provider: "ai-lineart",
					source_url: dataUrl,
					asset_url: dataUrl,
					title: `Technical line art: ${safeQuery}`.slice(0, 240),
					description:
						"AI-generated professional technical line-art SVG for editorial illustration. Not a photograph.",
					alt: `Technical line-art diagram of ${safeQuery}`.slice(0, 300),
					photographer: null,
					license_name: "AI-generated for Wade owned draft use",
					license_url: null,
					usage_rights_provisional: "EXPLICIT_PERMISSION",
					rights_evidence_id: `ai-lineart:${model.replace(/[^a-z0-9._-]+/gi, "-")}:${digest}${index > 0 ? `-${index}` : ""}`,
					attribution_required: false,
					generation_style: "technical_line_art",
					width: 1600,
					height: 900,
				}),
			).map((candidate, index) =>
				Object.freeze({
					...candidate,
					inline_svg: index === 0 ? svg : svg,
				}),
			);
			return Object.freeze({
				classification: "MOCK_VERIFIED",
				provider: "ai-lineart",
				results: Object.freeze(results),
			});
		},
	});
}

/**
 * Fan out across configured providers in parallel and merge unique HTTPS candidates.
 */
export function createCompositeImageSearchClient({
	clients = [],
	budget = { consume() {} },
} = {}) {
	const active = (Array.isArray(clients) ? clients : []).filter(
		(client) => typeof client?.searchImages === "function",
	);
	return Object.freeze({
		id: "composite",
		clients: Object.freeze(active.map((client) => client.id ?? "unknown")),
		async searchImages({ query, limit = 8 } = {}) {
			if (active.length === 0) {
				return Object.freeze({
					classification: "BLOCKED_MISSING_CREDENTIALS",
					provider: "composite",
					results: [],
					reason: "No image providers are configured.",
				});
			}
			const safeQuery = assertQuery(query);
			const capped = Math.min(
				Math.max(1, Number.isInteger(limit) ? limit : 8),
				MAX_COMBINED,
			);
			const perProvider = Math.max(2, Math.ceil(capped / active.length));
			const settled = await Promise.allSettled(
				active.map((client) =>
					client.searchImages({
						query: safeQuery,
						limit: perProvider,
					}),
				),
			);
			const providerResults = settled.map((entry, index) => {
				if (entry.status === "fulfilled") return entry.value;
				return Object.freeze({
					classification: "FAILED",
					provider: active[index]?.id ?? "unknown",
					results: [],
					reason:
						entry.reason instanceof Error
							? entry.reason.message.slice(0, 240)
							: "Provider failed.",
				});
			});
			const seen = new Set();
			const merged = [];
			// Round-robin merge so one verbose provider cannot crowd out the rest.
			const queues = providerResults.map((result) => [
				...(result.results ?? []),
			]);
			let progressed = true;
			while (merged.length < capped && progressed) {
				progressed = false;
				for (const queue of queues) {
					while (queue.length > 0 && merged.length < capped) {
						const candidate = queue.shift();
						const key = candidate?.asset_url ?? candidate?.source_url;
						if (!key || seen.has(key)) continue;
						seen.add(key);
						merged.push(candidate);
						progressed = true;
						break;
					}
				}
			}
			const anyVerified = providerResults.some(
				(result) =>
					result.classification === "MOCK_VERIFIED" ||
					result.classification === "LIVE_VERIFIED",
			);
			const allBlocked =
				providerResults.length > 0 &&
				providerResults.every(
					(result) => result.classification === "BLOCKED_MISSING_CREDENTIALS",
				);
			return Object.freeze({
				classification: anyVerified
					? "MOCK_VERIFIED"
					: allBlocked
						? "BLOCKED_MISSING_CREDENTIALS"
						: "FAILED",
				provider: "composite",
				results: Object.freeze(merged),
				provider_summaries: Object.freeze(
					providerResults.map((result) =>
						Object.freeze({
							provider: result.provider,
							classification: result.classification,
							count: (result.results ?? []).length,
							reason: result.reason ?? null,
						}),
					),
				),
				budget,
			});
		},
	});
}

/**
 * Build one primary image-search query from an opportunity.
 */
export function buildImageSearchQuery(opportunity) {
	const queries = buildImageSearchQueries(opportunity);
	return queries[0];
}

/**
 * Build diversified image-search queries for broader relevant coverage.
 */
export function buildImageSearchQueries(
	opportunity,
	{ maxQueries = 3, extraTerms = [] } = {},
) {
	if (!opportunity || typeof opportunity !== "object")
		throw new Error("Image search query requires an opportunity.");
	const cluster = String(opportunity.query_cluster ?? "").trim();
	const title = String(opportunity.click_title ?? "").trim();
	const tags = (opportunity.tags ?? [])
		.filter((tag) => typeof tag === "string" && tag.trim())
		.map((tag) => tag.trim())
		.slice(0, 4);
	const extras = (Array.isArray(extraTerms) ? extraTerms : [])
		.filter((term) => typeof term === "string" && term.trim())
		.map((term) => term.trim())
		.slice(0, 3);
	const subjectTokens = tokenizeForQuery(
		[cluster, ...tags, ...extras].filter(Boolean).join(" "),
	).slice(0, 5);
	const variants = [
		[cluster, title, ...tags.slice(0, 2), "plumbing"].filter(Boolean).join(" "),
		[...subjectTokens, "residential plumbing"].join(" "),
		[...subjectTokens.slice(0, 3), "home service equipment"].join(" "),
		extras.length > 0
			? [...extras.slice(0, 2), ...subjectTokens.slice(0, 2), "plumbing"].join(
					" ",
				)
			: null,
	]
		.filter(Boolean)
		.map((value) => value.replace(/\s+/g, " ").trim())
		.filter((value) => value.length >= 8)
		.map((value) => value.slice(0, 240));
	const unique = [...new Set(variants)].slice(
		0,
		Math.min(Math.max(1, maxQueries), 4),
	);
	if (unique.length === 0) {
		return Object.freeze([assertQuery("residential plumbing equipment")]);
	}
	return Object.freeze(unique.map((value) => assertQuery(value)));
}

function tokenizeForQuery(value) {
	return String(value)
		.toLowerCase()
		.split(/[^a-z0-9]+/g)
		.filter(
			(token) =>
				token.length >= 3 &&
				![
					"the",
					"and",
					"for",
					"with",
					"santa",
					"cruz",
					"county",
					"home",
					"homes",
				].includes(token),
		);
}
