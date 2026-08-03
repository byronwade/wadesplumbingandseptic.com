/**
 * Additional open / low-friction image providers for Eve.
 * Keyless where possible; keyed providers soft-block without credentials.
 */
import { classifyUntrustedText } from "./policy.mjs";

const MAX_RESULTS_PER_PROVIDER = 8;

const OPENVERSE_COMMERCIAL_LICENSES = new Set(["cc0", "pdm", "by", "by-sa"]);

function assertQuery(query) {
	if (typeof query !== "string" || !query.trim() || query.length > 240)
		throw new Error("Image provider query must be a bounded non-empty string.");
	return query.trim();
}

function safeText(value, max) {
	if (typeof value !== "string") return null;
	const trimmed = value
		.trim()
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ");
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
	if (!response.ok)
		throw new Error(`${label} returned HTTP ${response.status}.`);
	return response.json();
}

function openverseRights(license) {
	const normalized = String(license ?? "").toLowerCase();
	if (normalized === "cc0" || normalized === "pdm") return "PUBLIC_DOMAIN";
	return "LICENSED";
}

/**
 * Openverse aggregates CC/PD works. Filter license_type=commercial.
 * No API key required for anonymous low-volume search.
 */
export function createOpenverseImageClient({
	fetchImpl = fetch,
	budget = { consume() {} },
} = {}) {
	return Object.freeze({
		id: "openverse",
		async searchImages({ query, limit = 6 } = {}) {
			const safeQuery = assertQuery(query);
			const capped = Math.min(
				Math.max(1, Number.isInteger(limit) ? limit : 6),
				MAX_RESULTS_PER_PROVIDER,
			);
			budget.consume("maxExternalRequests");
			const url = new URL("https://api.openverse.org/v1/images/");
			url.searchParams.set("q", safeQuery);
			url.searchParams.set("page_size", String(capped));
			url.searchParams.set("license_type", "commercial");
			url.searchParams.set("mature", "false");
			const response = await fetchImpl(url, {
				headers: {
					Accept: "application/json",
					"User-Agent":
						"WadeEveSeoAgent/0.1 (image-research; +https://www.wadesplumbingandseptic.com)",
				},
			});
			const payload = await readJson(response, "Openverse");
			const results = (payload.results ?? [])
				.slice(0, capped)
				.map((item) => {
					const id = String(item.id ?? "").slice(0, 80);
					const license = String(item.license ?? "").toLowerCase();
					if (!id || !OPENVERSE_COMMERCIAL_LICENSES.has(license)) return null;
					if (!item.url || !item.detail_url) return null;
					const rights = openverseRights(license);
					return Object.freeze({
						...candidateBase({
							provider: "openverse",
							source_url: item.detail_url,
							asset_url: item.url,
							title: item.title || "Openverse image",
							description: item.attribution || item.title,
							alt: item.title || item.attribution,
							photographer: item.creator,
							license_name: `CC ${license}${item.license_version ? ` ${item.license_version}` : ""}`,
							license_url: item.license_url,
							usage_rights_provisional: rights,
							rights_evidence_id: `openverse-${rights.toLowerCase()}:${id}`,
							attribution_required: rights === "LICENSED",
							width: item.width,
							height: item.height,
						}),
						aggregated_asset: true,
					});
				})
				.filter(Boolean);
			return Object.freeze({
				classification: "MOCK_VERIFIED",
				provider: "openverse",
				results: Object.freeze(results),
			});
		},
	});
}

/**
 * Pixabay License: free commercial use. Requires API key.
 */
export function createPixabayImageClient({
	apiKey,
	fetchImpl = fetch,
	budget = { consume() {} },
} = {}) {
	return Object.freeze({
		id: "pixabay",
		async searchImages({ query, limit = 6 } = {}) {
			if (!apiKey) {
				return Object.freeze({
					classification: "BLOCKED_MISSING_CREDENTIALS",
					provider: "pixabay",
					results: [],
					reason: "Missing PIXABAY_API_KEY.",
				});
			}
			const safeQuery = assertQuery(query);
			const capped = Math.min(
				Math.max(1, Number.isInteger(limit) ? limit : 6),
				MAX_RESULTS_PER_PROVIDER,
			);
			budget.consume("maxExternalRequests");
			const url = new URL("https://pixabay.com/api/");
			url.searchParams.set("key", apiKey);
			url.searchParams.set("q", safeQuery);
			url.searchParams.set("image_type", "photo");
			url.searchParams.set("safesearch", "true");
			url.searchParams.set("per_page", String(Math.max(3, capped)));
			const response = await fetchImpl(url);
			const payload = await readJson(response, "Pixabay");
			const results = (payload.hits ?? [])
				.slice(0, capped)
				.map((hit) => {
					const id = String(hit.id ?? "");
					const asset = hit.largeImageURL || hit.webformatURL;
					if (!id || !asset || !hit.pageURL) return null;
					return candidateBase({
						provider: "pixabay",
						source_url: hit.pageURL,
						asset_url: asset,
						title: hit.tags || "Pixabay photo",
						description: hit.tags,
						alt: hit.tags,
						photographer: hit.user,
						license_name: "Pixabay License",
						license_url: "https://pixabay.com/service/license-summary/",
						usage_rights_provisional: "LICENSED",
						rights_evidence_id: `pixabay-license:${id}`,
						attribution_required: false,
						width: hit.imageWidth,
						height: hit.imageHeight,
					});
				})
				.filter(Boolean);
			return Object.freeze({
				classification: "MOCK_VERIFIED",
				provider: "pixabay",
				results: Object.freeze(results),
			});
		},
	});
}

/**
 * Metropolitan Museum Collection API. Public-domain objects only. No key.
 */
export function createMetMuseumImageClient({
	fetchImpl = fetch,
	budget = { consume() {} },
} = {}) {
	return Object.freeze({
		id: "metmuseum",
		async searchImages({ query, limit = 4 } = {}) {
			const safeQuery = assertQuery(query);
			const capped = Math.min(
				Math.max(1, Number.isInteger(limit) ? limit : 4),
				6,
			);
			budget.consume("maxExternalRequests");
			const searchUrl = new URL(
				"https://collectionapi.metmuseum.org/public/collection/v1/search",
			);
			searchUrl.searchParams.set("q", safeQuery);
			searchUrl.searchParams.set("hasImages", "true");
			const searchResponse = await fetchImpl(searchUrl);
			const searchPayload = await readJson(searchResponse, "MET search");
			// Bound object detail calls tightly against the run external-request budget.
			const objectIds = (searchPayload.objectIDs ?? []).slice(0, capped + 2);
			const results = [];
			for (const objectId of objectIds) {
				if (results.length >= capped) break;
				budget.consume("maxExternalRequests");
				const objectResponse = await fetchImpl(
					`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`,
				);
				if (!objectResponse.ok) continue;
				const object = await objectResponse.json();
				if (object.isPublicDomain !== true) continue;
				const asset = object.primaryImage || object.primaryImageSmall;
				if (!asset || !/^https:\/\//i.test(asset)) continue;
				results.push(
					candidateBase({
						provider: "metmuseum",
						source_url:
							object.objectURL ||
							`https://www.metmuseum.org/art/collection/search/${objectId}`,
						asset_url: asset,
						title: object.title || "MET collection object",
						description: [object.objectName, object.culture, object.period]
							.filter(Boolean)
							.join(" · "),
						alt: object.title || object.objectName,
						photographer:
							object.artistDisplayName || "Metropolitan Museum of Art",
						license_name: "Public Domain (MET Open Access)",
						license_url:
							"https://www.metmuseum.org/about-the-met/policies-and-documents/open-access",
						usage_rights_provisional: "PUBLIC_DOMAIN",
						rights_evidence_id: `metmuseum-pd:${objectId}`,
						attribution_required: false,
						width: null,
						height: null,
					}),
				);
			}
			return Object.freeze({
				classification: "MOCK_VERIFIED",
				provider: "metmuseum",
				results: Object.freeze(results),
			});
		},
	});
}

/**
 * Art Institute of Chicago API. Public-domain artworks only. No key.
 */
export function createArticImageClient({
	fetchImpl = fetch,
	budget = { consume() {} },
} = {}) {
	return Object.freeze({
		id: "artic",
		async searchImages({ query, limit = 4 } = {}) {
			const safeQuery = assertQuery(query);
			const capped = Math.min(
				Math.max(1, Number.isInteger(limit) ? limit : 4),
				MAX_RESULTS_PER_PROVIDER,
			);
			budget.consume("maxExternalRequests");
			const url = new URL("https://api.artic.edu/api/v1/artworks/search");
			url.searchParams.set("q", safeQuery);
			url.searchParams.set("limit", String(capped * 2));
			url.searchParams.set(
				"fields",
				"id,title,image_id,artist_title,is_public_domain,thumbnail",
			);
			const response = await fetchImpl(url);
			const payload = await readJson(response, "Art Institute of Chicago");
			const results = (payload.data ?? [])
				.filter((item) => item.is_public_domain === true && item.image_id)
				.slice(0, capped)
				.map((item) => {
					const asset = `https://www.artic.edu/iiif/2/${item.image_id}/full/1686,/0/default.jpg`;
					return candidateBase({
						provider: "artic",
						source_url: `https://www.artic.edu/artworks/${item.id}`,
						asset_url: asset,
						title: item.title || "AIC artwork",
						description: item.artist_title
							? `${item.title} by ${item.artist_title}`
							: item.title,
						alt: item.title,
						photographer: item.artist_title || "Art Institute of Chicago",
						license_name: "Public Domain (AIC)",
						license_url: "https://www.artic.edu/image-licensing",
						usage_rights_provisional: "PUBLIC_DOMAIN",
						rights_evidence_id: `artic-pd:${item.id}`,
						attribution_required: false,
						width: null,
						height: null,
					});
				});
			return Object.freeze({
				classification: "MOCK_VERIFIED",
				provider: "artic",
				results: Object.freeze(results),
			});
		},
	});
}

/**
 * NASA Image and Video Library. US government work treated as PUBLIC_DOMAIN.
 */
export function createNasaImageClient({
	fetchImpl = fetch,
	budget = { consume() {} },
} = {}) {
	return Object.freeze({
		id: "nasa",
		async searchImages({ query, limit = 4 } = {}) {
			const safeQuery = assertQuery(query);
			const capped = Math.min(
				Math.max(1, Number.isInteger(limit) ? limit : 4),
				MAX_RESULTS_PER_PROVIDER,
			);
			budget.consume("maxExternalRequests");
			const url = new URL("https://images-api.nasa.gov/search");
			url.searchParams.set("q", safeQuery);
			url.searchParams.set("media_type", "image");
			url.searchParams.set("page_size", String(capped));
			const response = await fetchImpl(url);
			const payload = await readJson(response, "NASA Images");
			const items = payload.collection?.items ?? [];
			const results = items
				.slice(0, capped)
				.map((item) => {
					const data = item.data?.[0];
					const nasaId = String(data?.nasa_id ?? "").slice(0, 80);
					const href = item.links?.find(
						(link) => link.render === "image",
					)?.href;
					if (!nasaId || !href || !/^https:\/\//i.test(href)) return null;
					return candidateBase({
						provider: "nasa",
						source_url: `https://images.nasa.gov/details/${encodeURIComponent(nasaId)}`,
						asset_url: href,
						title: data.title || "NASA image",
						description: data.description,
						alt: data.title,
						photographer: data.photographer || data.center || "NASA",
						license_name: "NASA Media Usage Guidelines (US Government work)",
						license_url:
							"https://www.nasa.gov/nasa-brand-center/images-and-media/",
						usage_rights_provisional: "PUBLIC_DOMAIN",
						rights_evidence_id: `nasa-pd:${nasaId}`,
						attribution_required: false,
						width: null,
						height: null,
					});
				})
				.filter(Boolean);
			return Object.freeze({
				classification: "MOCK_VERIFIED",
				provider: "nasa",
				results: Object.freeze(results),
			});
		},
	});
}

/** Flickr commercial-safe license ids: BY, BY-SA, CC0, Public Domain Mark. */
const FLICKR_COMMERCIAL_LICENSE_IDS = "4,5,9,10";

/**
 * Flickr photo search with commercial-safe Creative Commons licenses.
 */
export function createFlickrImageClient({
	apiKey,
	fetchImpl = fetch,
	budget = { consume() {} },
} = {}) {
	return Object.freeze({
		id: "flickr",
		async searchImages({ query, limit = 6 } = {}) {
			if (!apiKey) {
				return Object.freeze({
					classification: "BLOCKED_MISSING_CREDENTIALS",
					provider: "flickr",
					results: [],
					reason: "Missing FLICKR_API_KEY.",
				});
			}
			const safeQuery = assertQuery(query);
			const capped = Math.min(
				Math.max(1, Number.isInteger(limit) ? limit : 6),
				MAX_RESULTS_PER_PROVIDER,
			);
			budget.consume("maxExternalRequests");
			const url = new URL("https://api.flickr.com/services/rest/");
			url.searchParams.set("method", "flickr.photos.search");
			url.searchParams.set("api_key", apiKey);
			url.searchParams.set("text", safeQuery);
			url.searchParams.set("license", FLICKR_COMMERCIAL_LICENSE_IDS);
			url.searchParams.set("safe_search", "1");
			url.searchParams.set("content_type", "1");
			url.searchParams.set("media", "photos");
			url.searchParams.set(
				"extras",
				"owner_name,license,url_c,url_l,url_o,tags",
			);
			url.searchParams.set("per_page", String(capped));
			url.searchParams.set("format", "json");
			url.searchParams.set("nojsoncallback", "1");
			const response = await fetchImpl(url);
			const payload = await readJson(response, "Flickr");
			if (payload.stat && payload.stat !== "ok") {
				throw new Error(
					`Flickr search failed: ${payload.message ?? payload.stat}`,
				);
			}
			const licenseName = {
				4: "CC BY 2.0",
				5: "CC BY-SA 2.0",
				9: "CC0",
				10: "Public Domain Mark",
			};
			const results = (payload.photos?.photo ?? [])
				.slice(0, capped)
				.map((photo) => {
					const id = String(photo.id ?? "");
					const asset = photo.url_l || photo.url_o || photo.url_c;
					if (!id || !asset) return null;
					const licenseId = String(photo.license ?? "");
					const rights =
						licenseId === "9" || licenseId === "10"
							? "PUBLIC_DOMAIN"
							: "LICENSED";
					return candidateBase({
						provider: "flickr",
						source_url: `https://www.flickr.com/photos/${photo.owner}/${id}`,
						asset_url: asset,
						title: photo.title || "Flickr photo",
						description: photo.tags,
						alt: photo.title || photo.tags,
						photographer: photo.ownername,
						license_name:
							licenseName[licenseId] || `Flickr license ${licenseId}`,
						license_url: "https://www.flickr.com/creativecommons/",
						usage_rights_provisional: rights,
						rights_evidence_id: `flickr-${rights.toLowerCase()}:${id}`,
						attribution_required: rights === "LICENSED",
						width:
							Number(photo.width_l || photo.width_o || photo.width_c) || null,
						height:
							Number(photo.height_l || photo.height_o || photo.height_c) ||
							null,
					});
				})
				.filter(Boolean);
			return Object.freeze({
				classification: "MOCK_VERIFIED",
				provider: "flickr",
				results: Object.freeze(results),
			});
		},
	});
}

/**
 * Europeana Search API with open reusability filter. Requires API key.
 */
export function createEuropeanaImageClient({
	apiKey,
	fetchImpl = fetch,
	budget = { consume() {} },
} = {}) {
	return Object.freeze({
		id: "europeana",
		async searchImages({ query, limit = 4 } = {}) {
			if (!apiKey) {
				return Object.freeze({
					classification: "BLOCKED_MISSING_CREDENTIALS",
					provider: "europeana",
					results: [],
					reason: "Missing EUROPEANA_API_KEY.",
				});
			}
			const safeQuery = assertQuery(query);
			const capped = Math.min(
				Math.max(1, Number.isInteger(limit) ? limit : 4),
				MAX_RESULTS_PER_PROVIDER,
			);
			budget.consume("maxExternalRequests");
			const url = new URL("https://api.europeana.eu/record/v2/search.json");
			url.searchParams.set("wskey", apiKey);
			url.searchParams.set("query", safeQuery);
			url.searchParams.set("reusability", "open");
			url.searchParams.set("media", "true");
			url.searchParams.set("qf", "TYPE:IMAGE");
			url.searchParams.set("rows", String(capped));
			url.searchParams.set("profile", "rich");
			const response = await fetchImpl(url);
			const payload = await readJson(response, "Europeana");
			const results = (payload.items ?? [])
				.slice(0, capped)
				.map((item) => {
					const id = String(item.id ?? "")
						.replace(/[^a-z0-9]+/gi, "-")
						.slice(0, 80);
					const asset = Array.isArray(item.edmIsShownBy)
						? item.edmIsShownBy[0]
						: item.edmIsShownBy;
					const landing = Array.isArray(item.guid) ? item.guid[0] : item.guid;
					if (!id || !asset || !landing) return null;
					if (!/^https:\/\//i.test(asset) || !/^https:\/\//i.test(landing))
						return null;
					const title = Array.isArray(item.title) ? item.title[0] : item.title;
					const rightsStatement = Array.isArray(item.rights)
						? item.rights[0]
						: item.rights;
					const pd =
						typeof rightsStatement === "string" &&
						(/cc0|public.?domain/i.test(rightsStatement) ||
							/publicdomain/i.test(rightsStatement));
					return Object.freeze({
						...candidateBase({
							provider: "europeana",
							source_url: landing,
							asset_url: asset,
							title: title || "Europeana image",
							description: Array.isArray(item.dcDescription)
								? item.dcDescription[0]
								: item.dcDescription,
							alt: title,
							photographer: Array.isArray(item.dataProvider)
								? item.dataProvider[0]
								: item.dataProvider,
							license_name: rightsStatement || "Europeana open reusability",
							license_url:
								typeof rightsStatement === "string" &&
								rightsStatement.startsWith("http")
									? rightsStatement
									: "https://www.europeana.eu/en/rights",
							usage_rights_provisional: pd ? "PUBLIC_DOMAIN" : "LICENSED",
							rights_evidence_id: `europeana-${pd ? "pd" : "licensed"}:${id}`,
							attribution_required: !pd,
							width: null,
							height: null,
						}),
						aggregated_asset: true,
					});
				})
				.filter(Boolean);
			return Object.freeze({
				classification: "MOCK_VERIFIED",
				provider: "europeana",
				results: Object.freeze(results),
			});
		},
	});
}

/**
 * Domains and host suffixes accepted for open-provider asset URLs.
 */
export const OPEN_IMAGE_PROVIDER_DOMAINS = Object.freeze([
	"api.openverse.org",
	"openverse.org",
	"www.openverse.org",
	"pixabay.com",
	"cdn.pixabay.com",
	"www.pixabay.com",
	"collectionapi.metmuseum.org",
	"images.metmuseum.org",
	"www.metmuseum.org",
	"api.artic.edu",
	"www.artic.edu",
	"artic.edu",
	"images-api.nasa.gov",
	"images-assets.nasa.gov",
	"images.nasa.gov",
	"api.flickr.com",
	"www.flickr.com",
	"flickr.com",
	"live.staticflickr.com",
	"staticflickr.com",
	"farm1.staticflickr.com",
	"farm2.staticflickr.com",
	"farm3.staticflickr.com",
	"farm4.staticflickr.com",
	"farm5.staticflickr.com",
	"farm6.staticflickr.com",
	"farm7.staticflickr.com",
	"farm8.staticflickr.com",
	"farm9.staticflickr.com",
	"api.europeana.eu",
	"www.europeana.eu",
	"europeana.eu",
]);

export const OPEN_IMAGE_ASSET_HOST_SUFFIXES = Object.freeze([
	"staticflickr.com",
	"pixabay.com",
	"metmuseum.org",
	"artic.edu",
	"imgix.net",
	"nasa.gov",
	"europeana.eu",
	"wikimedia.org",
	"unsplash.com",
	"pexels.com",
]);
