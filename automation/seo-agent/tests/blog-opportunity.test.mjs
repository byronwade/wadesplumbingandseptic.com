import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { collectPageInventory } from "../src/inventory.mjs";
import {
	assertPublishableBlogDraft,
	BLOG_QUALITY_THRESHOLDS,
	BLOG_TOPIC_CATALOG,
	buildWriterPrompt,
	selectBlogOpportunity,
} from "../src/blog-opportunity.mjs";

const repoRoot = resolve(import.meta.dirname, "../../..");

function richDraft(opportunity) {
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
	return `---
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
}

test("catalog is large enough for ongoing unique local SEO drafts", () => {
	assert.equal(BLOG_TOPIC_CATALOG.length >= 10, true);
	assert.equal(BLOG_QUALITY_THRESHOLDS.min_body_words >= 1400, true);
	assert.equal(BLOG_QUALITY_THRESHOLDS.min_faq_questions >= 5, true);
});

test("selects a distinct unused local blog topic with inventory links", () => {
	const inventory = collectPageInventory({ repoRoot });
	const selection = selectBlogOpportunity({
		inventory,
		runId: "proposal-2026-08-03",
	});
	assert.equal(selection.decision, "PROPOSE_FOR_HUMAN_REVIEW");
	assert.equal(selection.opportunity.slug.includes("santa-cruz"), true);
	assert.equal(selection.opportunity.internal_links.length >= 4, true);
	assert.equal(selection.opportunity.must_cover.length >= 4, true);
	assert.equal(selection.opportunity.people_also_ask.length >= 5, true);
	assert.equal(
		inventory.pages.some(
			(page) => page.url === `/${selection.opportunity.slug}`,
		),
		false,
	);
});

test("returns NO_ACTION when every catalog slug already exists", () => {
	const inventory = collectPageInventory({ repoRoot });
	const pages = [
		...inventory.pages,
		...BLOG_TOPIC_CATALOG.map((topic) => ({
			url: `/${topic.slug}`,
			source_path: `content/posts/${topic.slug}.md`,
		})),
	];
	const selection = selectBlogOpportunity({
		inventory: { pages },
		runId: "proposal-2026-08-03",
	});
	assert.equal(selection.decision, "NO_ACTION");
	assert.equal(selection.reason, "NO_VIABLE_DISTINCT_BLOG_TOPIC");
});

test("publishable draft requires depth, unique value, FAQ, and CTR meta", () => {
	const inventory = collectPageInventory({ repoRoot });
	const selection = selectBlogOpportunity({
		inventory,
		runId: "proposal-2026-08-03",
	});
	const opportunity = selection.opportunity;
	const ok = assertPublishableBlogDraft(richDraft(opportunity), opportunity);
	assert.equal(ok.ok, true);
	assert.equal(ok.word_count >= BLOG_QUALITY_THRESHOLDS.min_body_words, true);
	assert.equal(
		assertPublishableBlogDraft(
			"# Thin\n\nToo short and generic.\n",
			opportunity,
		).ok,
		false,
	);
	const prompt = buildWriterPrompt({
		opportunity,
		date: "2026-08-03",
	});
	assert.match(prompt, /people-first/i);
	assert.match(prompt, /What makes this guide different/);
	assert.match(prompt, /Santa Cruz County/);
	assert.equal(prompt.includes("\u2014"), false);
});
