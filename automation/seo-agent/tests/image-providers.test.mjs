import assert from "node:assert/strict";
import test from "node:test";
import {
	buildImageSearchQuery,
	createAiLineArtImageClient,
	createCompositeImageSearchClient,
	createPexelsImageClient,
	createUnsplashImageClient,
	createWikimediaImageClient,
} from "../src/image-providers.mjs";
import { createImageResearchAdapter } from "../src/image-research.mjs";
import { stageImageCandidate } from "../src/image-staging.mjs";
import {
	acceptStagedFeaturedPlan,
	buildBlogImagePackage,
} from "../src/image-selection.mjs";
import { buildMarkdownChangeSet } from "../src/markdown-change-set.mjs";
import {
	BLOG_TOPIC_CATALOG,
	selectBlogOpportunity,
} from "../src/blog-opportunity.mjs";
import { collectPageInventory } from "../src/inventory.mjs";
import { resolve } from "node:path";

const repoRoot = resolve(import.meta.dirname, "../../..");

function tanklessOpportunity() {
	const inventory = collectPageInventory({ repoRoot });
	const selection = selectBlogOpportunity({
		inventory,
		catalog: BLOG_TOPIC_CATALOG,
		runId: "image-providers-2026-08-03",
		preferredTopicId: "tankless-water-heater-maintenance-santa-cruz",
	});
	assert.equal(selection.decision, "PROPOSE_FOR_HUMAN_REVIEW");
	return selection.opportunity;
}

test("buildImageSearchQuery includes topic subject tokens", () => {
	const query = buildImageSearchQuery({
		query_cluster: "tankless water heater maintenance",
		click_title: "Tankless Water Heater Maintenance",
		tags: ["tankless", "water-heater"],
	});
	assert.match(query, /tankless/i);
	assert.match(query, /plumbing/i);
});

test("Unsplash client maps license-safe photos", async () => {
	const client = createUnsplashImageClient({
		accessKey: "test-unsplash-key",
		async fetchImpl(url) {
			assert.match(String(url), /api\.unsplash\.com/);
			return {
				ok: true,
				async json() {
					return {
						results: [
							{
								id: "abc123",
								width: 1600,
								height: 900,
								description: "Tankless water heater on a wall",
								alt_description: "Tankless water heater installation",
								urls: {
									regular: "https://images.unsplash.com/photo-tankless.jpg",
								},
								links: { html: "https://unsplash.com/photos/abc123" },
								user: { name: "Jordan Plumber" },
							},
						],
					};
				},
			};
		},
	});
	const result = await client.searchImages({
		query: "tankless water heater",
		limit: 3,
	});
	assert.equal(result.classification, "MOCK_VERIFIED");
	assert.equal(result.results[0].usage_rights_provisional, "LICENSED");
	assert.equal(result.results[0].rights_evidence_id, "unsplash-license:abc123");
	assert.equal(result.results[0].attribution_required, true);
});

test("Wikimedia client rejects non-commercial licenses", async () => {
	const client = createWikimediaImageClient({
		async fetchImpl() {
			return {
				ok: true,
				async json() {
					return {
						query: {
							pages: {
								1: {
									pageid: 1,
									title: "File:Tankless heater.jpg",
									imageinfo: [
										{
											url: "https://upload.wikimedia.org/wikipedia/commons/t.jpg",
											thumburl:
												"https://upload.wikimedia.org/wikipedia/commons/thumb/t.jpg",
											descriptionurl:
												"https://commons.wikimedia.org/wiki/File:Tankless_heater.jpg",
											mime: "image/jpeg",
											width: 1200,
											height: 800,
											extmetadata: {
												LicenseShortName: { value: "CC BY-NC 4.0" },
												ImageDescription: { value: "Tankless heater" },
											},
										},
									],
								},
								2: {
									pageid: 2,
									title: "File:Tankless diagram.png",
									imageinfo: [
										{
											url: "https://upload.wikimedia.org/wikipedia/commons/d.png",
											descriptionurl:
												"https://commons.wikimedia.org/wiki/File:Tankless_diagram.png",
											mime: "image/png",
											width: 1200,
											height: 800,
											extmetadata: {
												LicenseShortName: { value: "CC0" },
												ImageDescription: {
													value: "Tankless water heater diagram",
												},
												Artist: { value: "Public contributor" },
											},
										},
									],
								},
							},
						},
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
	assert.equal(result.results[0].usage_rights_provisional, "PUBLIC_DOMAIN");
});

test("Pexels client blocks without API key", async () => {
	const client = createPexelsImageClient({});
	const result = await client.searchImages({ query: "septic tank" });
	assert.equal(result.classification, "BLOCKED_MISSING_CREDENTIALS");
});

test("AI line-art client extracts safe SVG only", async () => {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><path d="M10 10h100v40H10z" fill="none" stroke="#111" stroke-width="4"/></svg>`;
	const client = createAiLineArtImageClient({
		apiKey: "test-gateway-key",
		async fetchImpl() {
			return {
				ok: true,
				async json() {
					return {
						choices: [
							{
								message: {
									content: `Here is the diagram:\n${svg}\n`,
								},
							},
						],
					};
				},
			};
		},
	});
	const result = await client.searchImages({
		query: "tankless water heater service valves",
	});
	assert.equal(result.classification, "MOCK_VERIFIED");
	assert.equal(result.results[0].generation_style, "technical_line_art");
	assert.equal(
		result.results[0].usage_rights_provisional,
		"EXPLICIT_PERMISSION",
	);
	assert.match(result.results[0].inline_svg, /<svg/i);
});

test("composite client merges providers and research adapter normalizes", async () => {
	const composite = createCompositeImageSearchClient({
		clients: [
			createUnsplashImageClient({
				accessKey: "k",
				async fetchImpl() {
					return {
						ok: true,
						async json() {
							return {
								results: [
									{
										id: "u1",
										description: "Tankless water heater flush",
										alt_description: "Tankless water heater",
										urls: {
											regular: "https://images.unsplash.com/photo-u1.jpg",
										},
										links: { html: "https://unsplash.com/photos/u1" },
										user: { name: "A" },
									},
								],
							};
						},
					};
				},
			}),
		],
	});
	const adapter = createImageResearchAdapter({
		enabled: true,
		allowedDomains: ["api.unsplash.com", "images.unsplash.com", "unsplash.com"],
		imageSearchClient: composite,
	});
	const opportunity = tanklessOpportunity();
	const researched = await adapter.searchRelevant({
		query: "tankless water heater",
		opportunity,
		limit: 4,
	});
	assert.equal(researched.classification, "MOCK_VERIFIED");
	assert.equal(researched.publication_permitted, false);
	assert.ok(researched.candidates.length >= 1);
});

test("staging AI line-art produces SVG + provenance change-set files", async () => {
	const opportunity = tanklessOpportunity();
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><circle cx="80" cy="80" r="40" fill="none" stroke="#000"/></svg>`;
	const staged = await stageImageCandidate({
		opportunity,
		role: "featured",
		candidate: {
			provider: "ai-lineart",
			source_url: "https://ai-gateway.vercel.sh/v1/generated/lineart/demo.svg",
			asset_url: "https://ai-gateway.vercel.sh/v1/generated/lineart/demo.svg",
			title: "Tankless water heater line art",
			alt: "Technical line-art of a tankless water heater",
			usage_rights_provisional: "EXPLICIT_PERMISSION",
			rights_evidence_id: "ai-lineart:openai-gpt-4o-mini:demo1234",
			generation_style: "technical_line_art",
			inline_svg: svg,
			relevance_score: 16,
			matched_tokens: ["tankless", "heater"],
		},
	});
	assert.equal(staged.classification, "MOCK_VERIFIED");
	assert.match(staged.plan.asset_path, /\.svg$/);
	assert.equal(staged.files.length, 2);
	assert.equal(staged.plan.usage_rights, "EXPLICIT_PERMISSION");

	const accepted = acceptStagedFeaturedPlan({ staged, opportunity });
	assert.equal(accepted.classification, "MOCK_VERIFIED");
	assert.equal(accepted.plan.origin, "ai_lineart");

	const emptyLibrary = [];
	const package_ = buildBlogImagePackage({
		opportunity,
		repoRoot,
		library: emptyLibrary,
		stagedFeatured: staged,
		externalCandidates: [],
	});
	assert.ok(package_.featured.plan);
	assert.equal(package_.staged_files.length, 2);

	const changeSet = buildMarkdownChangeSet({
		proposalId: opportunity.id,
		files: [
			{
				path: opportunity.content_path,
				operation: "CREATE",
				content: [
					"---",
					`title: "${opportunity.click_title}"`,
					`description: "Fixture draft for image staging of ${opportunity.query_cluster}."`,
					`canonical: ${opportunity.owner_url}`,
					`query_cluster: ${opportunity.query_cluster}`,
					"evidence_ids: [fixture-image-evidence]",
					`image: "${package_.featured.plan.public_url}"`,
					`image_alt: "${package_.featured.plan.alt_text}"`,
					"---",
					"",
					"# Fixture",
					"",
					"Body content for change-set validation with enough text for the draft checker path.",
					"",
				].join("\n"),
			},
			...package_.staged_files,
		],
	});
	assert.equal(changeSet.changed_files, 3);
	assert.ok(changeSet.files.some((file) => file.kind === "image_asset"));
	assert.ok(changeSet.files.some((file) => file.kind === "image_provenance"));
});
