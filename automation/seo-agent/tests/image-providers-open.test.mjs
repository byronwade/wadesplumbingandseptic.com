import assert from "node:assert/strict";
import test from "node:test";
import {
	createArticImageClient,
	createMetMuseumImageClient,
	createNasaImageClient,
	createOpenverseImageClient,
	createPixabayImageClient,
} from "../src/image-providers-open.mjs";
import { createConfiguredImageResearchAdapter } from "../src/image-research.mjs";
import {
	createGrokipediaResearchClient,
	createNominatimResearchClient,
	createOpenResearchAdapter,
	createWikidataResearchClient,
} from "../src/open-research.mjs";
import { isAllowedImageHostname } from "../src/image-providers.mjs";

test("isAllowedImageHostname accepts aggregator CDN suffixes", () => {
	assert.equal(isAllowedImageHostname("live.staticflickr.com"), true);
	assert.equal(isAllowedImageHostname("cdn.pixabay.com"), true);
	assert.equal(isAllowedImageHostname("evil.example"), false);
});

test("Openverse client keeps commercial CC licenses only", async () => {
	const client = createOpenverseImageClient({
		async fetchImpl(url) {
			assert.match(String(url), /api\.openverse\.org/);
			assert.match(String(url), /license_type=commercial/);
			return {
				ok: true,
				async json() {
					return {
						results: [
							{
								id: "a1",
								title: "Tankless water heater plumbing",
								url: "https://live.staticflickr.com/1/tankless.jpg",
								detail_url: "https://api.openverse.org/v1/images/a1/",
								creator: "Tech",
								license: "by-sa",
								license_version: "2.0",
								license_url: "https://creativecommons.org/licenses/by-sa/2.0/",
								attribution: "by Tech",
								width: 1024,
								height: 768,
							},
							{
								id: "b2",
								title: "Non commercial should be filtered by API",
								url: "https://live.staticflickr.com/1/nc.jpg",
								detail_url: "https://api.openverse.org/v1/images/b2/",
								license: "by-nc",
								license_url: "https://creativecommons.org/licenses/by-nc/2.0/",
							},
						],
					};
				},
			};
		},
	});
	const result = await client.searchImages({
		query: "tankless water heater",
		limit: 4,
	});
	assert.equal(result.results.length, 1);
	assert.equal(result.results[0].usage_rights_provisional, "LICENSED");
	assert.equal(result.results[0].aggregated_asset, true);
});

test("MET client only returns public-domain objects", async () => {
	let objectCalls = 0;
	const client = createMetMuseumImageClient({
		async fetchImpl(url) {
			const href = String(url);
			if (href.includes("/search")) {
				return {
					ok: true,
					async json() {
						return { total: 2, objectIDs: [1, 2] };
					},
				};
			}
			objectCalls += 1;
			const id = href.endsWith("/1") ? 1 : 2;
			return {
				ok: true,
				async json() {
					return {
						objectID: id,
						isPublicDomain: id === 2,
						primaryImage: "https://images.metmuseum.org/CRDImages/x.jpg",
						objectURL: "https://www.metmuseum.org/art/collection/search/2",
						title: id === 2 ? "Public domain pipe motif" : "Restricted",
						artistDisplayName: "Unknown",
					};
				},
			};
		},
	});
	const result = await client.searchImages({ query: "pipe", limit: 2 });
	assert.ok(objectCalls >= 1);
	assert.equal(result.results.length, 1);
	assert.equal(result.results[0].usage_rights_provisional, "PUBLIC_DOMAIN");
});

test("AIC and NASA clients normalize public-domain assets", async () => {
	const artic = createArticImageClient({
		async fetchImpl() {
			return {
				ok: true,
				async json() {
					return {
						data: [
							{
								id: 99,
								title: "Water works drawing",
								artist_title: "Artist",
								is_public_domain: true,
								image_id: "abc-def",
							},
						],
					};
				},
			};
		},
	});
	const nasa = createNasaImageClient({
		async fetchImpl() {
			return {
				ok: true,
				async json() {
					return {
						collection: {
							items: [
								{
									data: [
										{
											nasa_id: "KSC-1",
											title: "Water main repair",
											description: "Pipe repair at Kennedy",
											center: "KSC",
										},
									],
									links: [
										{
											render: "image",
											href: "https://images-assets.nasa.gov/image/KSC-1/KSC-1~medium.jpg",
										},
									],
								},
							],
						},
					};
				},
			};
		},
	});
	const articResult = await artic.searchImages({ query: "water", limit: 2 });
	const nasaResult = await nasa.searchImages({ query: "water pipe", limit: 2 });
	assert.equal(articResult.results[0].provider, "artic");
	assert.equal(nasaResult.results[0].provider, "nasa");
	assert.equal(
		articResult.results[0].usage_rights_provisional,
		"PUBLIC_DOMAIN",
	);
	assert.equal(nasaResult.results[0].usage_rights_provisional, "PUBLIC_DOMAIN");
});

test("Pixabay blocks without key", async () => {
	const client = createPixabayImageClient({});
	const result = await client.searchImages({ query: "septic" });
	assert.equal(result.classification, "BLOCKED_MISSING_CREDENTIALS");
});

test("configured adapter includes keyless open providers", async () => {
	const calls = [];
	const adapter = createConfiguredImageResearchAdapter({
		config: {
			integrationFlags: { imageSourcing: true, imageAiLineArt: false },
			credentials: {},
		},
		budget: { consume: (key) => calls.push(key) },
		fetchImpl: async (url) => {
			const href = String(url);
			if (href.includes("openverse")) {
				return {
					ok: true,
					async json() {
						return {
							results: [
								{
									id: "ov1",
									title: "Septic tank diagram",
									url: "https://live.staticflickr.com/1/septic.jpg",
									detail_url: "https://api.openverse.org/v1/images/ov1/",
									license: "cc0",
									license_url:
										"https://creativecommons.org/publicdomain/zero/1.0/",
									width: 800,
									height: 600,
								},
							],
						};
					},
				};
			}
			if (href.includes("wikimedia") || href.includes("commons")) {
				return {
					ok: true,
					async json() {
						return { query: { pages: {} } };
					},
				};
			}
			if (href.includes("metmuseum") && href.includes("search")) {
				return {
					ok: true,
					async json() {
						return { total: 0, objectIDs: [] };
					},
				};
			}
			if (href.includes("artic.edu")) {
				return {
					ok: true,
					async json() {
						return { data: [] };
					},
				};
			}
			if (href.includes("images-api.nasa.gov")) {
				return {
					ok: true,
					async json() {
						return { collection: { items: [] } };
					},
				};
			}
			return {
				ok: true,
				async json() {
					return {};
				},
			};
		},
	});
	const result = await adapter.search({
		query: "septic tank",
		limit: 8,
	});
	assert.equal(result.classification, "MOCK_VERIFIED");
	assert.ok((result.provider_summaries ?? []).length >= 5);
	assert.ok(calls.includes("maxExternalRequests"));
});

test("Wikidata and Nominatim open research stay soft-context only", async () => {
	const wiki = createWikidataResearchClient({
		async fetchImpl() {
			return {
				ok: true,
				async json() {
					return {
						search: [
							{
								id: "Q386300",
								label: "septic tank",
								description: "on-site wastewater treatment",
								concepturi: "https://www.wikidata.org/entity/Q386300",
							},
						],
					};
				},
			};
		},
	});
	const nominatim = createNominatimResearchClient({
		async fetchImpl() {
			return {
				ok: true,
				async json() {
					return [
						{
							place_id: 1,
							osm_type: "relation",
							osm_id: 7870163,
							display_name: "Santa Cruz County, California, United States",
							lat: "37.05",
							lon: "-121.99",
						},
					];
				},
			};
		},
	});
	const wikiResult = await wiki.search({ query: "septic tank" });
	const placeResult = await nominatim.search({
		query: "Santa Cruz County California",
	});
	assert.equal(wikiResult.results[0].usage, "TOPIC_VOCABULARY_LEAD_ONLY");
	assert.equal(placeResult.results[0].usage, "LOCAL_GEO_GROUNDING_ONLY");

	const open = createOpenResearchAdapter({ enabled: false });
	const blocked = await open.probe({ runId: "open-research-fixture" });
	assert.equal(blocked.classification, "BLOCKED_MISSING_CREDENTIALS");
	assert.match(blocked.payload.next_action, /MANUAL_SETUP/);
});

test("Grokipedia research uses public HTML only and demotes entertainment noise", async () => {
	const urls = [];
	const client = createGrokipediaResearchClient({
		async fetchImpl(url) {
			const href = String(url);
			urls.push(href);
			assert.equal(href.includes("/api/"), false);
			if (href.includes("/search?")) {
				return {
					ok: true,
					async text() {
						return `
<a href="/page/Septic_tank" data-slug="Septic_tank" data-search-result-link="true" data-search-snippet="septic tank is an underground watertight vessel for wastewater and plumbing">
  <span class="min-w-0 truncate text-sm font-medium text-fg-primary">Septic tank</span>
</a>
<a href="/page/The_Woman_in_the_Septic_Tank" data-slug="The_Woman_in_the_Septic_Tank" data-search-result-link="true" data-search-snippet="Filipino comedy film satire about septic tank">
  <span class="min-w-0 truncate text-sm font-medium text-fg-primary">The Woman in the Septic Tank</span>
</a>
<a href="/page/Septic_drain_field" data-slug="Septic_drain_field" data-search-result-link="true" data-search-snippet="drain field for onsite wastewater treatment and residential septic plumbing">
  <span class="min-w-0 truncate text-sm font-medium text-fg-primary">Septic drain field</span>
</a>`;
					},
				};
			}
			if (href.includes("/page/Septic_tank")) {
				return {
					ok: true,
					async text() {
						return `<html><head>
<meta property="og:title" content="Septic tank - Grokipedia">
<meta property="og:description" content="A septic tank is an underground vessel for domestic wastewater.">
</head></html>`;
					},
				};
			}
			return {
				ok: true,
				async text() {
					return "<html></html>";
				},
			};
		},
	});
	const result = await client.search({
		query: "septic tank plumbing",
		limit: 4,
		opportunity: {
			query_cluster: "septic tank maintenance",
			tags: ["septic", "plumbing"],
		},
	});
	assert.equal(result.classification, "MOCK_VERIFIED");
	assert.equal(result.api_used, false);
	assert.equal(result.transport, "public_html");
	assert.ok(result.results.length >= 1);
	assert.equal(result.results[0].usage, "TOPIC_VOCABULARY_LEAD_ONLY");
	assert.ok(
		result.results.every(
			(item) => !/woman in the septic|comedy film/i.test(item.label),
		),
	);
	assert.ok(urls.every((href) => !href.includes("/api/")));
	assert.ok(urls.some((href) => href.includes("grokipedia.com/search")));
});

test("open research adapter includes Grokipedia when enabled", async () => {
	const adapter = createOpenResearchAdapter({
		enabled: true,
		grokipediaEnabled: true,
		async fetchImpl(url) {
			const href = String(url);
			if (href.includes("wikidata.org")) {
				return {
					ok: true,
					async json() {
						return {
							search: [
								{
									id: "Q386300",
									label: "septic tank",
									description: "wastewater vessel",
									concepturi: "https://www.wikidata.org/entity/Q386300",
								},
							],
						};
					},
				};
			}
			if (href.includes("nominatim")) {
				return {
					ok: true,
					async json() {
						return [
							{
								place_id: 1,
								osm_type: "relation",
								osm_id: 1,
								display_name: "Santa Cruz County, California, United States",
								lat: "37",
								lon: "-122",
							},
						];
					},
				};
			}
			if (href.includes("grokipedia.com/search")) {
				return {
					ok: true,
					async text() {
						return `<a href="/page/Plumbing" data-slug="Plumbing" data-search-snippet="plumbing pipes wastewater residential systems"><span class="text-fg-primary">Plumbing</span></a>`;
					},
				};
			}
			if (href.includes("grokipedia.com/page/")) {
				return {
					ok: true,
					async text() {
						return `<meta property="og:title" content="Plumbing - Grokipedia"><meta name="description" content="Plumbing conveys water and wastewater.">`;
					},
				};
			}
			throw new Error(`Unexpected URL ${href}`);
		},
	});
	const researched = await adapter.researchOpportunity({
		opportunity: {
			query_cluster: "plumbing inspection",
			tags: ["plumbing"],
		},
	});
	assert.equal(researched.classification, "MOCK_VERIFIED");
	assert.equal(researched.publication_permitted, false);
	assert.ok((researched.grokipedia?.results ?? []).length >= 1);
	const probe = await adapter.probe({ runId: "grokipedia-fixture" });
	assert.match(probe.scope, /grokipedia/);
	assert.equal(probe.payload.grokipedia_transport, "public_html");
});
