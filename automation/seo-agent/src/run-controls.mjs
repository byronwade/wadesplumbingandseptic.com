import { DEFAULT_BUDGETS } from "./constants.mjs";
import { consumeBudget } from "./policy.mjs";

export function createRunBudget({ budgets = DEFAULT_BUDGETS } = {}) {
	let usage = Object.freeze({});
	return Object.freeze({
		consume(key, increment = 1) {
			usage = Object.freeze(consumeBudget(usage, key, increment, budgets));
			return usage;
		},
		snapshot() {
			return Object.freeze({ ...usage });
		},
	});
}

export function deterministicRunId({ schedule = "audit", date }) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
		throw new Error("Run date must be YYYY-MM-DD");
	return `${schedule}-${date}`;
}

export function assertIdempotentRun({ runId, completedRunIds = [] }) {
	if (typeof runId !== "string" || !/^[a-z0-9][a-z0-9-]{2,79}$/.test(runId))
		throw new Error("Run ID must be a safe, non-empty identifier");
	if (!Array.isArray(completedRunIds))
		throw new Error("Completed run IDs must be an array");
	if (completedRunIds.includes(runId))
		throw new Error(`Duplicate run denied: ${runId}`);
	return true;
}

export function isRetryableReadOnlyError(error) {
	const status = Number(error?.status);
	return status === 408 || status === 429 || (status >= 500 && status <= 599);
}

export async function retryReadOnly(
	operation,
	{ attempts = 3, shouldRetry = isRetryableReadOnlyError } = {},
) {
	if (typeof operation !== "function")
		throw new Error("Read-only retry operation must be a function");
	if (!Number.isInteger(attempts) || attempts < 1 || attempts > 3)
		throw new Error("Read-only retry attempts must be an integer from 1 to 3");
	let lastError;
	for (let attempt = 1; attempt <= attempts; attempt += 1) {
		try {
			return await operation(attempt);
		} catch (error) {
			lastError = error;
			if (attempt === attempts || !shouldRetry(error)) throw error;
		}
	}
	throw lastError;
}
