import test from "node:test";
import assert from "node:assert/strict";
import { createModelRunLedger } from "../src/model-budget.mjs";
import { DEFAULT_BUDGETS } from "../src/constants.mjs";

test("model ledger atomically reserves tool, token, and cost budget per audit run", () => {
	const ledger = createModelRunLedger({
		budgets: { ...DEFAULT_BUDGETS, maxModelCostUsd: 0.3 },
	});
	const first = ledger.reserve({
		runId: "model-budget-fixture-001",
		prompt: "Summarize only the supplied evidence.",
		maxOutputTokens: 1200,
		model: "openai/gpt-5.4",
	});
	assert.equal(first.usage.maxToolCalls, 1);
	assert.equal(
		first.usage.maxModelTokens,
		first.token_reservation.requested_tokens,
	);
	assert.equal(first.usage.maxModelCostUsd, 0.2);

	assert.throws(
		() =>
			ledger.reserve({
				runId: "model-budget-fixture-001",
				prompt: "A second request must not exceed the run reservation.",
				maxOutputTokens: 1,
				model: "openai/gpt-5.4",
			}),
		/Budget exhausted: maxModelCostUsd/,
	);

	assert.deepEqual(ledger.snapshot("model-budget-fixture-001"), first.usage);
	assert.deepEqual(ledger.close("model-budget-fixture-001"), first.usage);
	assert.deepEqual(ledger.snapshot("model-budget-fixture-001"), {});
});

test("model ledger rejects unsafe run IDs and unapproved routes before recording usage", () => {
	const ledger = createModelRunLedger();
	assert.throws(
		() =>
			ledger.reserve({
				runId: "../unsafe",
				prompt: "bounded",
				maxOutputTokens: 1,
				model: "openai/gpt-5.4",
			}),
		/safe audit run ID/,
	);
	assert.throws(
		() =>
			ledger.reserve({
				runId: "model-budget-fixture-002",
				prompt: "bounded",
				maxOutputTokens: 1,
				model: "unapproved/provider-model",
			}),
		/not approved/,
	);
	assert.deepEqual(ledger.snapshot("model-budget-fixture-002"), {});
});
