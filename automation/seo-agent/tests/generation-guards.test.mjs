import test from "node:test";
import assert from "node:assert/strict";
import {
	buildScoreFallbackTopicDecision,
	createProposalGenerationGuard,
	hasRevisionProgress,
	PROPOSAL_GENERATION_LIMITS,
	shouldSkipTopicModelDecision,
	truncateDraftForExpansionPrompt,
} from "../src/generation-guards.mjs";

test("quality-first defaults leave room for a full write plus expands", () => {
	assert.ok(PROPOSAL_GENERATION_LIMITS.writeMaxOutputTokens >= 6_500);
	assert.ok(PROPOSAL_GENERATION_LIMITS.expandMaxOutputTokens >= 4_000);
	assert.ok(PROPOSAL_GENERATION_LIMITS.maxExpandPromptDraftChars >= 20_000);
	assert.ok(
		PROPOSAL_GENERATION_LIMITS.maxReservedOutputTokens >=
			PROPOSAL_GENERATION_LIMITS.writeMaxOutputTokens +
				PROPOSAL_GENERATION_LIMITS.expandMaxOutputTokens * 2,
	);
});

test("generation guard blocks excess calls and reserved output tokens", () => {
	const guard = createProposalGenerationGuard({
		...PROPOSAL_GENERATION_LIMITS,
		maxModelCalls: 2,
		maxReservedOutputTokens: 5_000,
	});
	guard.record({ stage: "write", maxOutputTokens: 4_200 });
	assert.throws(
		() => guard.assertCanReserve({ stage: "expand", maxOutputTokens: 2_800 }),
		/output-token budget exhausted/,
	);
	const tight = createProposalGenerationGuard({
		...PROPOSAL_GENERATION_LIMITS,
		maxModelCalls: 1,
		maxReservedOutputTokens: 20_000,
	});
	tight.record({ stage: "write", maxOutputTokens: 100 });
	assert.throws(
		() => tight.assertCanReserve({ stage: "expand", maxOutputTokens: 100 }),
		/call budget exhausted/,
	);
});

test("skipped topic decisions do not consume the call budget", () => {
	const guard = createProposalGenerationGuard({
		...PROPOSAL_GENERATION_LIMITS,
		maxModelCalls: 1,
	});
	guard.record({
		stage: "topic_decision",
		skipped: true,
		note: "SINGLE_VIABLE_CANDIDATE",
	});
	const snap = guard.record({ stage: "write", maxOutputTokens: 100 });
	assert.equal(snap.calls, 1);
	assert.equal(snap.skips, 1);
	assert.equal(snap.call_log[0].skipped, true);
});

test("topic model is skipped for clear demand-timed score leads", () => {
	const ranked = [
		{
			id: "art-wine",
			publication_timing: { mode: "DEMAND_TIMED" },
			demand_source: { kind: "LOCAL_EVENT", name: "Capitola Art & Wine" },
		},
		{ id: "evergreen-b" },
	];
	const considered = [
		{ id: "art-wine", score: 36 },
		{ id: "evergreen-b", score: 28 },
	];
	const decision = shouldSkipTopicModelDecision({ ranked, considered });
	assert.equal(decision.skip, true);
	assert.equal(decision.reason, "CLEAR_DEMAND_TIMED_SCORE_LEAD");
	assert.equal(decision.score_gap, 8);

	const single = shouldSkipTopicModelDecision({
		ranked: [ranked[0]],
		considered,
	});
	assert.equal(single.skip, true);
	assert.equal(single.reason, "SINGLE_VIABLE_CANDIDATE");

	const close = shouldSkipTopicModelDecision({
		ranked,
		considered: [
			{ id: "art-wine", score: 31 },
			{ id: "evergreen-b", score: 28 },
		],
	});
	assert.equal(close.skip, false);
});

test("score fallback decision explains the skipped model call", () => {
	const decision = buildScoreFallbackTopicDecision({
		topic: {
			id: "hosting-prep",
			click_title: "Hosting Prep for Santa Cruz County",
			demand_source: { name: "Labor Day" },
		},
		considered: [{ id: "hosting-prep", score: 36 }],
		skipReason: "CLEAR_DEMAND_TIMED_SCORE_LEAD",
	});
	assert.equal(decision.mode, "SCORE_FALLBACK_SKIP_MODEL");
	assert.equal(decision.topic_id, "hosting-prep");
	assert.match(decision.reason, /without a topic-model call/);
	assert.equal(decision.reason.includes("\u2014"), false);
});

test("expand prompts keep full normal drafts and preserve structure when truncated", () => {
	const normal = `---
title: Host Prep
description: "Santa Cruz County hosting prep."
canonical: /host-prep
---

# Host Prep

## Quick Answer for Santa Cruz County Homeowners

Useful local bullets.

## FAQ

### Will guests stress plumbing?

Yes.
`;
	const full = truncateDraftForExpansionPrompt(normal);
	assert.equal(full.truncated, false);
	assert.equal(full.text, normal.trim());

	const draft = `---
title: Host Prep
description: "Santa Cruz County hosting prep."
canonical: /host-prep
---

# Host Prep

## Quick Answer for Santa Cruz County Homeowners

${"x".repeat(8_000)}

## FAQ

${"y".repeat(8_000)}
`;
	const sliced = truncateDraftForExpansionPrompt(draft, 6_000);
	assert.equal(sliced.truncated, true);
	assert.match(sliced.text, /TRUNCATED_FOR_TOKEN_BUDGET/);
	assert.match(sliced.text, /H2 outline:/);
	assert.match(sliced.text, /Quick Answer for Santa Cruz County Homeowners/);
	assert.match(sliced.text, /Draft head:/);
	assert.match(sliced.text, /Draft tail:/);
	assert.ok(sliced.text.length < draft.length);
});

test("no-progress detection stops useless expand loops", () => {
	assert.equal(
		hasRevisionProgress({
			reasonBefore: "TOO_THIN",
			reasonAfter: "TOO_THIN",
			okAfter: false,
		}),
		false,
	);
	assert.equal(
		hasRevisionProgress({
			reasonBefore: "TOO_THIN",
			reasonAfter: "INSUFFICIENT_FAQ_DEPTH",
			okAfter: false,
		}),
		true,
	);
	assert.equal(
		hasRevisionProgress({
			reasonBefore: "TOO_THIN",
			reasonAfter: "TOO_THIN",
			okAfter: true,
		}),
		true,
	);
});
