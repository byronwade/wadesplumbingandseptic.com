import { DEFAULT_BUDGETS } from "./constants.mjs";
import {
	assertModelCostReservation,
	assertModelRequestBudget,
	consumeBudget,
	resolveApprovedModelRoute,
} from "./policy.mjs";

const SAFE_RUN_ID = /^[a-z0-9][a-z0-9-]{2,79}$/;

function assertRunId(runId) {
	if (typeof runId !== "string" || !SAFE_RUN_ID.test(runId)) {
		throw new Error("Model request requires a safe audit run ID");
	}
	return runId;
}

function reserve(usage, { prompt, maxOutputTokens, model }, budgets) {
	const approvedModel = resolveApprovedModelRoute(model);
	const tokenReservation = assertModelRequestBudget(
		{ prompt, maxOutputTokens },
		budgets,
	);
	const costReservation = assertModelCostReservation(
		{ model: approvedModel },
		budgets,
	);

	// Calculate all limits before committing usage so a rejected request cannot
	// partially consume a run budget.
	let nextUsage = consumeBudget(usage, "maxToolCalls", 1, budgets);
	nextUsage = consumeBudget(
		nextUsage,
		"maxModelTokens",
		tokenReservation.requested_tokens,
		budgets,
	);
	nextUsage = consumeBudget(
		nextUsage,
		"maxModelCostUsd",
		costReservation.reserved_max_cost_usd,
		budgets,
	);

	return Object.freeze({
		model: approvedModel,
		token_reservation: tokenReservation,
		cost_reservation: costReservation,
		usage: Object.freeze(nextUsage),
	});
}

/**
 * Ephemeral execution accounting. Git manifests remain the only persistent
 * state; callers must copy the returned usage into their terminal run record.
 */
export function createModelRunLedger({ budgets = DEFAULT_BUDGETS } = {}) {
	const runUsage = new Map();

	return Object.freeze({
		reserve({ runId, prompt, maxOutputTokens, model }) {
			const safeRunId = assertRunId(runId);
			const result = reserve(
				runUsage.get(safeRunId) ?? {},
				{ prompt, maxOutputTokens, model },
				budgets,
			);
			runUsage.set(safeRunId, result.usage);
			return Object.freeze({ run_id: safeRunId, ...result });
		},
		snapshot(runId) {
			const safeRunId = assertRunId(runId);
			return Object.freeze({ ...(runUsage.get(safeRunId) ?? {}) });
		},
		close(runId) {
			const safeRunId = assertRunId(runId);
			const finalUsage = Object.freeze({ ...(runUsage.get(safeRunId) ?? {}) });
			runUsage.delete(safeRunId);
			return finalUsage;
		},
	});
}

// Eve tool modules are long-lived only for the worker process. A process
// restart loses this cache safely; durable records remain Git artifacts.
const workerLedger = createModelRunLedger();

export function reserveModelRequest(input) {
	return workerLedger.reserve(input);
}

export function closeModelRunBudget(runId) {
	return workerLedger.close(runId);
}
