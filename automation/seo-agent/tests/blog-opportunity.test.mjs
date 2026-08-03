import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { collectPageInventory } from "../src/inventory.mjs";
import {
	assertPublishableBlogDraft,
	buildWriterPrompt,
	selectBlogOpportunity,
} from "../src/blog-opportunity.mjs";

const repoRoot = resolve(import.meta.dirname, "../../..");

function richDraft(opportunity) {
	const links = opportunity.internal_links
		.slice(0, 3)
		.map((link) => `Read more about [${link.anchor}](${link.to}).`)
		.join("\n\n");
	const body = Array.from({ length: 120 }, (_, index) => {
		if (index === 0) {
			return "Santa Cruz County homeowners deal with coastal moisture, mixed housing ages, and many septic parcels.";
		}
		return `Practical guidance point ${index + 1} keeps this draft useful without inventing prices or guarantees.`;
	}).join(" ");
	return `---
title: ${opportunity.title_hint}
description: Practical Santa Cruz County guidance for ${opportunity.query_cluster}.
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

# ${opportunity.title_hint}

${body}

## Quick Answer for Santa Cruz County Homeowners

- Check the issue early.
- Avoid unsafe DIY shortcuts.
- Use the right service path when risk rises.

## Why this matters locally

Santa Cruz County homes benefit from clear maintenance habits.

## What you can check safely

Look, listen, and stop before forcing parts.

## When to pause and get help

Persistent leaks, sewage odors, or no hot water need a professional evaluation.

## Prevention habits that help

Small weekly habits reduce surprise failures.

## FAQ

### Why mention Santa Cruz County?

Local housing and septic conditions shape practical advice.

### Can I force a stuck part?

No. Stop and get qualified help.

### Where do I go next?

Use the contact page after you review the linked service guides.

${links}

Visit [contact](/contact) when you are ready to schedule help.
`;
}

test("selects a distinct unused local blog topic with inventory links", () => {
	const inventory = collectPageInventory({ repoRoot });
	const selection = selectBlogOpportunity({
		inventory,
		runId: "proposal-2026-08-03",
	});
	assert.equal(selection.decision, "PROPOSE_FOR_HUMAN_REVIEW");
	assert.equal(selection.opportunity.slug.includes("santa-cruz"), true);
	assert.equal(selection.opportunity.internal_links.length >= 3, true);
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
		{
			url: "/garbage-disposal-care-santa-cruz",
			source_path: "content/posts/garbage-disposal-care-santa-cruz.md",
		},
		{
			url: "/tankless-water-heater-maintenance-santa-cruz",
			source_path:
				"content/posts/tankless-water-heater-maintenance-santa-cruz.md",
		},
		{
			url: "/hose-bib-winterizing-santa-cruz",
			source_path: "content/posts/hose-bib-winterizing-santa-cruz.md",
		},
		{
			url: "/backflow-prevention-homeowners-santa-cruz",
			source_path: "content/posts/backflow-prevention-homeowners-santa-cruz.md",
		},
		{
			url: "/washing-machine-hose-failures-santa-cruz",
			source_path: "content/posts/washing-machine-hose-failures-santa-cruz.md",
		},
		{
			url: "/septic-friendly-kitchen-habits-santa-cruz",
			source_path: "content/posts/septic-friendly-kitchen-habits-santa-cruz.md",
		},
	];
	const selection = selectBlogOpportunity({
		inventory: { pages },
		runId: "proposal-2026-08-03",
	});
	assert.equal(selection.decision, "NO_ACTION");
	assert.equal(selection.reason, "NO_VIABLE_DISTINCT_BLOG_TOPIC");
});

test("publishable draft requires local context, FAQ, and planned links", () => {
	const inventory = collectPageInventory({ repoRoot });
	const selection = selectBlogOpportunity({
		inventory,
		runId: "proposal-2026-08-03",
	});
	const opportunity = selection.opportunity;
	assert.equal(
		assertPublishableBlogDraft(richDraft(opportunity), opportunity).ok,
		true,
	);
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
	assert.match(prompt, /Santa Cruz County/);
	assert.match(prompt, /FAQ/);
	assert.equal(prompt.includes("\u2014"), false);
});
