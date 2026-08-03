import test from "node:test";
import assert from "node:assert/strict";
import {
	buildExpansionPrompt,
	buildPeerReviewReport,
	isExpandableDraftFailure,
	isFatalDraftFailure,
	reviseDraftUntilPublishable,
} from "../src/draft-revision.mjs";

const opportunity = Object.freeze({
	owner_url: "/fixture-expand-santa-cruz",
	query_cluster: "fixture expand Santa Cruz",
	unique_value: "Keep the good local concept and deepen it.",
	must_cover: Object.freeze([
		"guest bathroom checks before hosting",
		"kitchen disposal limits during entertaining",
	]),
	internal_links: Object.freeze([
		{
			to: "/contact",
			anchor: "contact",
			reader_rationale: "Next step",
		},
		{
			to: "/service-offerings/drain-cleaning",
			anchor: "drain cleaning",
			reader_rationale: "Service path",
		},
	]),
	demand_source: Object.freeze({
		name: "Capitola Art & Wine Festival",
	}),
});

test("thin drafts are expandable; claim failures are fatal", () => {
	assert.equal(
		isExpandableDraftFailure({ ok: false, reason: "TOO_THIN" }),
		true,
	);
	assert.equal(
		isExpandableDraftFailure({ ok: false, reason: "INSUFFICIENT_FAQ_DEPTH" }),
		true,
	);
	assert.equal(
		isFatalDraftFailure({ ok: false, reason: "UNSUPPORTED_MARKETING_CLAIM" }),
		true,
	);
	assert.equal(
		isExpandableDraftFailure({
			ok: false,
			reason: "UNSUPPORTED_MARKETING_CLAIM",
		}),
		false,
	);
});

test("peer review keeps good concept and asks only for gap fills", () => {
	const markdown = `---
title: Keep This Concept
description: "Santa Cruz County hosts need practical prep."
canonical: /fixture-expand-santa-cruz
---

# Keep This Concept

Santa Cruz County hosts can prep bathrooms before guests arrive.

## Quick Answer for Santa Cruz County Homeowners

- Check toilets early.

## What makes this guide different

Local hosting context matters.

## FAQ

### Can guests stress plumbing?

Yes.
`;
	const review = buildPeerReviewReport({
		markdown,
		opportunity,
		quality: { ok: false, reason: "TOO_THIN" },
	});
	assert.equal(review.mode, "EXPAND_EXISTING_DRAFT");
	assert.match(review.keep.join(" "), /Keep the existing H1|Quick Answer|FAQ/i);
	assert.match(review.expand.join(" "), /1,400|Expand weak sections/i);
	const prompt = buildExpansionPrompt({
		markdown,
		opportunity,
		peerReview: review,
		date: "2026-08-01",
	});
	assert.match(prompt, /Do NOT rewrite the article from scratch/i);
	assert.match(prompt, /EXISTING_DRAFT/);
	assert.match(prompt, /Keep This Concept/);
	assert.equal(prompt.includes("\u2014"), false);
});

test("revision loop expands an existing draft instead of discarding it", async () => {
	const thin = `---
title: Keep This Concept
description: "Santa Cruz County hosts need practical prep before guests arrive this weekend."
canonical: /fixture-expand-santa-cruz
query_cluster: fixture expand Santa Cruz
evidence_ids: [fixture]
---

# Keep This Concept

Santa Cruz County hosts can prep bathrooms before guests arrive.
`;
	const result = await reviseDraftUntilPublishable({
		markdown: thin,
		opportunity,
		date: "2026-08-01",
		runId: "proposal-2026-08-01",
		quality: { ok: false, reason: "TOO_THIN" },
		assertQuality: (markdown) => {
			if (markdown.includes("## Expanded Depth")) {
				return { ok: true, reason: null, word_count: 1500 };
			}
			return { ok: false, reason: "TOO_THIN" };
		},
		reviser: async ({ markdown, peerReview }) => {
			assert.equal(peerReview.mode, "EXPAND_EXISTING_DRAFT");
			assert.match(markdown, /Keep This Concept/);
			return {
				markdown: `${markdown.trim()}\n\n## Expanded Depth\n\nAdded practical Santa Cruz County hosting detail without changing the concept.\n`,
				model: "expand-fixture",
				reservation: { cost_reservation: { reserved_max_cost_usd: 0.05 } },
			};
		},
	});
	assert.equal(result.publishable, true);
	assert.equal(result.expanded, true);
	assert.equal(result.rounds.length, 1);
	assert.match(result.markdown, /Keep This Concept/);
	assert.match(result.markdown, /Expanded Depth/);
});
