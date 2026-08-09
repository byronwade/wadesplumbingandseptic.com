import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

import {
	assertBrandContext,
	brandContextBrief,
	lintDraftAgainstBrand,
	loadBrandContext,
	proposeBrandContextPatch,
} from "../src/brand-context.mjs";
import {
	assertPublishableBlogDraft,
	selectBlogOpportunity,
} from "../src/blog-opportunity.mjs";
import { collectPageInventory } from "../src/inventory.mjs";
import { verifyEveDiscovery } from "../scripts/verify-eve-discovery.mjs";

const repoRoot = resolve(import.meta.dirname, "../../..");

test("brand context manifest loads and asserts from Git", () => {
	const registry = loadBrandContext({ repoRoot });
	assert.ok(registry);
	assert.equal(registry.product.name, "Wade's Plumbing & Septic");
	const brief = brandContextBrief(registry);
	assert.match(brief.cta_primary, /831/);
	assert.ok(brief.banned_phrases.includes("delve into"));
});

test("brand context rejects malformed registries", () => {
	assert.throws(
		() => assertBrandContext({ schema_version: "9.0" }),
		/Unsupported brand context schema/,
	);
});

test("lintDraftAgainstBrand catches banned phrases and dash punctuation", () => {
	const registry = loadBrandContext({ repoRoot });
	const phrase = lintDraftAgainstBrand(
		"# Title\n\nIn today's digital age homeowners suffer.\n",
		registry,
	);
	assert.equal(phrase.ok, false);
	assert.equal(phrase.reason, "BANNED_BRAND_PHRASE");

	const dash = lintDraftAgainstBrand(
		"# Title\n\nSanta Cruz work - steep slopes - that is hard.\n",
		registry,
	);
	assert.equal(dash.ok, false);
	assert.equal(dash.reason, "BANNED_DASH_PUNCTUATION");

	const listOk = lintDraftAgainstBrand(
		"# Title\n\nSanta Cruz tips:\n\n- Check the yard\n- Call a pro\n",
		registry,
	);
	assert.equal(listOk.ok, true, listOk.reason);
});

test("proposeBrandContextPatch stages pending human review without writing disk", () => {
	const current = loadBrandContext({ repoRoot });
	const proposed = proposeBrandContextPatch(current, {
		voice: { ...current.voice, tone: ["plain", "direct"] },
	});
	assert.deepEqual(proposed.voice.tone, ["plain", "direct"]);
	assert.ok(
		proposed.pending_review.some(
			(item) => item.review_status === "PENDING_HUMAN_APPROVAL",
		),
	);
	const onDisk = JSON.parse(
		readFileSync(resolve(repoRoot, "seo/manifests/brand-context.json"), "utf8"),
	);
	assert.notDeepEqual(onDisk.voice.tone, ["plain", "direct"]);
});

test("assertPublishableBlogDraft applies brand lint when context is supplied", () => {
	const registry = loadBrandContext({ repoRoot });
	const inventory = collectPageInventory({ repoRoot });
	const selection = selectBlogOpportunity({
		inventory,
		runId: "proposal-2026-08-03",
	});
	const opportunity = selection.opportunity;
	const links = opportunity.internal_links
		.slice(0, 4)
		.map((link) => `Read more about [${link.anchor}](${link.to}).`)
		.join("\n\n");
	const cover = opportunity.must_cover
		.map((point) => {
			const detail = `${point}. Santa Cruz County homeowners should weigh coastal moisture, older housing stock, and septic parcels when this issue shows up. Explain the check, the stop point, and the safer next step without inventing prices or guarantees. Expand with practical cues a careful owner can observe in daylight.`;
			return `## ${point.slice(0, 48)}\n\n${detail}\n\n${detail}`;
		})
		.join("\n\n");
	const faqs = opportunity.people_also_ask
		.map(
			(question) =>
				`### ${question}\n\nAnswer with clear local context for Santa Cruz County and a safe action. Avoid unsupported marketing claims.`,
		)
		.join("\n\n");
	const filler = Array.from({ length: 30 }, (_, index) => {
		return `Practical guidance block ${index + 1}: keep grease out of drains, watch for leaks, document odors, and stop before unsafe DIY work in Santa Cruz County homes with mixed plumbing ages.`;
	}).join("\n\n");
	const draft = `---
title: ${opportunity.click_title}
description: "${opportunity.meta_hook}"
category: ${opportunity.category}
date: "2026-08-03"
tags:
  - santa cruz
  - plumbing
image: ${opportunity.image}
imageAlt: "${opportunity.image_alt}"
canonical: ${opportunity.owner_url}
query_cluster: ${opportunity.query_cluster}
evidence_ids: [${opportunity.evidence_ids.join(", ")}]
---

# ${opportunity.click_title}

Santa Cruz County homeowners need specific guidance for ${opportunity.query_cluster}. ${opportunity.unique_value}

## Quick Answer for Santa Cruz County Homeowners

- Check the issue early with safe visual cues.
- Avoid unsafe DIY shortcuts around gas, sewage, or live electrical.
- Use the right service path when risk rises.
- Keep notes and photos before a professional visit.
- Prefer prevention habits that match local housing and septic patterns.

## What makes this guide different

${opportunity.unique_value} This section exists so the page is not interchangeable with a national blog post.

${cover}

## Prevention habits that help

${filler}

## FAQ

${faqs}

${links}

Visit [contact](/contact) when you are ready to schedule help.
`;
	const ok = assertPublishableBlogDraft(draft, opportunity, registry);
	assert.equal(ok.ok, true, ok.reason);

	const bad = assertPublishableBlogDraft(
		draft.replace(
			"Practical guidance block 1",
			"In today's digital age block 1",
		),
		opportunity,
		registry,
	);
	assert.equal(bad.ok, false);
	assert.equal(bad.reason, "BANNED_BRAND_PHRASE");
});

test("eve discovery gate finds brand skills and tools", () => {
	const surface = verifyEveDiscovery();
	assert.ok(surface.skills.includes("brand-context"));
	assert.ok(surface.skills.includes("writing-quality"));
	assert.ok(surface.skills.includes("seo-evidence-boundaries"));
	assert.ok(surface.tools.includes("get_brand_context"));
	assert.ok(surface.tools.includes("propose_brand_context_patch"));
	assert.equal(surface.skills.length, 17);
});
