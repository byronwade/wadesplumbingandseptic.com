import assert from "node:assert/strict";
import test from "node:test";
import { resolve } from "node:path";
import {
	BLOG_TOPIC_CATALOG,
	selectBlogOpportunity,
} from "../src/blog-opportunity.mjs";
import { collectPageInventory } from "../src/inventory.mjs";
import {
	IMAGE_SELECTION_THRESHOLDS,
	applyFeaturedImageToOpportunity,
	buildBlogImagePackage,
	indexFirstPartyImages,
	rankExternalImageCandidates,
	scoreImageRelevance,
	selectFeaturedImagePlan,
	tokenizeImageText,
} from "../src/image-selection.mjs";
import { buildDraftPrBrief } from "../src/proposal.mjs";

const repoRoot = resolve(import.meta.dirname, "../../..");

function tanklessOpportunity() {
	const inventory = collectPageInventory({ repoRoot });
	const selection = selectBlogOpportunity({
		inventory,
		catalog: BLOG_TOPIC_CATALOG,
		runId: "image-selection-2026-08-03",
		preferredTopicId: "tankless-water-heater-maintenance-santa-cruz",
	});
	assert.equal(selection.decision, "PROPOSE_FOR_HUMAN_REVIEW");
	return selection.opportunity;
}

test("tokenizeImageText drops stop words and keeps subject tokens", () => {
	const tokens = tokenizeImageText(
		"Tankless Water Heater Maintenance for Santa Cruz County Homes",
	);
	assert.ok(tokens.includes("tankless"));
	assert.ok(tokens.includes("heater"));
	assert.equal(tokens.includes("for"), false);
	assert.equal(tokens.includes("the"), false);
});

test("first-party index includes work and service libraries", () => {
	const library = indexFirstPartyImages({ repoRoot });
	assert.ok(library.length > 50);
	assert.ok(
		library.some((asset) =>
			asset.asset_path.includes("tankless-water-heater-installation.webp"),
		),
	);
	assert.ok(
		library.some(
			(asset) =>
				asset.featured_blocked === true &&
				asset.asset_path.includes("public/images/brand/"),
		),
	);
});

test("featured selection picks a content-related work photo for tankless", () => {
	const opportunity = tanklessOpportunity();
	const featured = selectFeaturedImagePlan({ opportunity, repoRoot });
	assert.equal(featured.classification, "MOCK_VERIFIED");
	assert.ok(featured.plan);
	assert.ok(
		featured.plan.relevance_score >=
			IMAGE_SELECTION_THRESHOLDS.featured_min_score,
	);
	assert.equal(featured.plan.usage_rights, "OWNED");
	assert.equal(featured.plan.publication_eligible, true);
	assert.match(featured.plan.public_url, /tankless|water-heater|heater/i);
	assert.equal(featured.plan.public_url.includes("/brand/"), false);
	assert.equal(featured.plan.public_url.includes("/partners/"), false);
	assert.ok(featured.plan.alt_text.length >= 8);
	assert.ok(featured.plan.relevance_rationale.length >= 16);
});

test("brand and partner assets cannot win featured selection", () => {
	const opportunity = tanklessOpportunity();
	const library = [
		{
			asset_path: "public/images/brand/wades-mark.webp",
			public_url: "/images/brand/wades-mark.webp",
			tokens: tokenizeImageText("wades mark tankless heater"),
			bytes: 1000,
			featured_blocked: true,
			usage_rights: "OWNED",
			rights_evidence_id:
				"repository-asset:public/images/brand/wades-mark.webp",
			source_url:
				"https://www.wadesplumbingandseptic.com/images/brand/wades-mark.webp",
		},
		{
			asset_path: "public/images/work/tankless-water-heater-installation.webp",
			public_url: "/images/work/tankless-water-heater-installation.webp",
			tokens: tokenizeImageText("work tankless water heater installation"),
			bytes: 1000,
			featured_blocked: false,
			usage_rights: "OWNED",
			rights_evidence_id:
				"repository-asset:public/images/work/tankless-water-heater-installation.webp",
			source_url:
				"https://www.wadesplumbingandseptic.com/images/work/tankless-water-heater-installation.webp",
		},
	];
	const featured = selectFeaturedImagePlan({
		opportunity,
		repoRoot,
		library,
	});
	assert.equal(
		featured.plan.asset_path,
		"public/images/work/tankless-water-heater-installation.webp",
	);
});

test("external candidates stay unverified and need token overlap", () => {
	const opportunity = tanklessOpportunity();
	const ranked = rankExternalImageCandidates({
		opportunity,
		candidates: [
			{
				source_url: "https://source.example.test/license",
				asset_url: "https://images.example.test/random-beach.webp",
				title: "Beach sunset",
			},
			{
				source_url: "https://source.example.test/license",
				asset_url: "https://images.example.test/tankless-water-heater.webp",
				title: "Tankless water heater installation detail",
				description: "Close-up of a tankless heater flue and service valves",
			},
		],
	});
	assert.equal(ranked.publication_permitted, false);
	assert.ok(ranked.candidates.length >= 1);
	assert.equal(ranked.candidates[0].publication_eligible, false);
	assert.equal(ranked.candidates[0].usage_rights, "UNVERIFIED");
	assert.match(ranked.candidates[0].asset_url, /tankless/i);
});

test("applyFeaturedImageToOpportunity overlays plan onto writer fields", () => {
	const opportunity = tanklessOpportunity();
	const package_ = buildBlogImagePackage({ opportunity, repoRoot });
	const next = applyFeaturedImageToOpportunity(opportunity, package_.featured);
	assert.equal(next.image, package_.featured.plan.public_url);
	assert.equal(next.image_alt, package_.featured.plan.alt_text);
	assert.equal(next.image_plan.usage_rights, "OWNED");
});

test("low-relevance assets score below featured threshold", () => {
	const opportunity = tanklessOpportunity();
	const scored = scoreImageRelevance({
		asset: {
			asset_path: "public/images/locations/river-and-redwoods.webp",
			tokens: tokenizeImageText("locations river and redwoods"),
			featured_blocked: false,
		},
		opportunity,
	});
	assert.ok(scored.score < IMAGE_SELECTION_THRESHOLDS.featured_min_score);
});

test("draft PR brief includes fail-closed featured image section", () => {
	const opportunity = tanklessOpportunity();
	const imagePackage = buildBlogImagePackage({ opportunity, repoRoot });
	const brief = buildDraftPrBrief({
		opportunity: applyFeaturedImageToOpportunity(
			opportunity,
			imagePackage.featured,
		),
		changeSet: { proposal_id: "proposal-image-brief" },
		writer: { model: "fixture", reservation: null },
		branch: "eve/seo/2026-08-03-tankless-water-heater-maintenance-santa-cruz",
		quality: {
			word_count: 1500,
			faq_questions: 5,
			internal_links: ["/contact"],
		},
		demandContext: {
			research: { mode: "CATALOG_ONLY", classification: "MOCK_VERIFIED" },
			active_demand: [],
			active_trends: [],
		},
		topicDecision: {
			mode: "SCORE_FALLBACK",
			reason: "Fixture topic",
			why_over_others: "Fixture ranking",
			seo_value: "Fixture SEO value for Santa Cruz County.",
			topic_id: "tankless-water-heater-maintenance-santa-cruz",
		},
		imagePackage,
	});
	assert.match(brief, /Images \(featured is fail-closed\)/);
	assert.match(brief, /first-party OWNED/i);
	assert.match(brief, /external candidates never auto-publish/i);
});
