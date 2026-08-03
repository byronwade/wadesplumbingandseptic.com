import assert from "node:assert/strict";
import test from "node:test";
import { resolve } from "node:path";
import {
	collectProposalMediaContext,
	formatAttributionLine,
} from "../src/image-orchestration.mjs";
import { buildImageSearchQueries } from "../src/image-providers.mjs";
import {
	BLOG_TOPIC_CATALOG,
	selectBlogOpportunity,
} from "../src/blog-opportunity.mjs";
import { collectPageInventory } from "../src/inventory.mjs";

const repoRoot = resolve(import.meta.dirname, "../../..");

function tanklessOpportunity() {
	const inventory = collectPageInventory({ repoRoot });
	const selection = selectBlogOpportunity({
		inventory,
		catalog: BLOG_TOPIC_CATALOG,
		runId: "image-orchestration-2026-08-03",
		preferredTopicId: "tankless-water-heater-maintenance-santa-cruz",
	});
	assert.equal(selection.decision, "PROPOSE_FOR_HUMAN_REVIEW");
	return selection.opportunity;
}

test("buildImageSearchQueries returns diversified trade-focused variants", () => {
	const queries = buildImageSearchQueries({
		query_cluster: "tankless water heater maintenance",
		click_title: "Tankless Water Heater Maintenance",
		tags: ["tankless", "water-heater"],
	});
	assert.ok(queries.length >= 2);
	assert.ok(queries.every((query) => query.length >= 8));
	assert.ok(queries.some((query) => /tankless/i.test(query)));
	assert.ok(queries.some((query) => /plumbing/i.test(query)));
});

test("formatAttributionLine summarizes rights for reviewers", () => {
	assert.match(
		formatAttributionLine({
			usage_rights: "OWNED",
		}),
		/first-party/i,
	);
	assert.match(
		formatAttributionLine({
			usage_rights: "LICENSED",
			photographer: "Jordan",
			provider: "unsplash",
			license_name: "Unsplash License",
			attribution_required: true,
		}),
		/Jordan/,
	);
	assert.match(
		formatAttributionLine({
			usage_rights: "EXPLICIT_PERMISSION",
			provider: "ai-lineart",
			generation_style: "technical_line_art",
		}),
		/technical line art/i,
	);
});

test("collectProposalMediaContext keeps first-party featured when available", async () => {
	const opportunity = tanklessOpportunity();
	const media = await collectProposalMediaContext({
		opportunity,
		repoRoot,
		config: {
			integrationFlags: {
				imageSourcing: false,
				openResearch: false,
				imageAiLineArt: false,
			},
			credentials: {},
		},
	});
	assert.ok(media.imagePackage.featured.plan);
	assert.equal(media.imagePackage.featured.plan.usage_rights, "OWNED");
	assert.match(media.imagePackage.attribution_line ?? "", /first-party/i);
});

test("collectProposalMediaContext searches diversified queries when sourcing is on", async () => {
	const opportunity = tanklessOpportunity();
	const seenQueries = [];
	const media = await collectProposalMediaContext({
		opportunity,
		repoRoot,
		config: {
			integrationFlags: {
				imageSourcing: true,
				openResearch: false,
				imageAiLineArt: false,
			},
			credentials: {},
		},
		fetchImpl: async (url) => {
			const href = String(url);
			if (href.includes("openverse")) {
				const query = new URL(href).searchParams.get("q") ?? "";
				seenQueries.push(query);
				return {
					ok: true,
					async json() {
						return {
							results: [
								{
									id: `ov-${seenQueries.length}`,
									title: "Tankless water heater plumbing detail",
									url: `https://live.staticflickr.com/1/tankless-${seenQueries.length}.jpg`,
									detail_url: `https://api.openverse.org/v1/images/ov-${seenQueries.length}/`,
									license: "by",
									license_version: "2.0",
									license_url: "https://creativecommons.org/licenses/by/2.0/",
									width: 1200,
									height: 800,
								},
							],
						};
					},
				};
			}
			if (href.includes("commons.wikimedia.org")) {
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
	assert.equal(media.onlineResearchSummary?.classification, "MOCK_VERIFIED");
	assert.ok((media.onlineResearchSummary?.queries ?? []).length >= 2);
	assert.ok(seenQueries.length >= 1);
	assert.ok(media.imagePackage.featured.plan);
});
