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

test("expand prompts truncate oversized drafts", () => {
	const draft = `${"x".repeat(13_000)}`;
	const sliced = truncateDraftForExpansionPrompt(draft, 12_000);
	assert.equal(sliced.truncated, true);
	assert.equal(sliced.original_chars, 13_000);
	assert.match(sliced.text, /TRUNCATED_FOR_TOKEN_BUDGET/);
	assert.ok(sliced.text.length < draft.length + 200);
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
