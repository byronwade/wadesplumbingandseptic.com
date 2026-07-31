import assert from "node:assert/strict";
import test from "node:test";
import {
	OPERATIONAL_ERROR_CODES,
	calculateOperationalMetrics,
	createOperationalEvent,
	createSafeAuditLog,
	evaluateOperationalState,
	planWorkflowRecovery,
	redactOperationalData,
} from "../src/operational-observability.mjs";

function event(overrides = {}) {
	return {
		run_id: "audit-2099-01-01",
		workflow_id: "workflow-fixture-001",
		job_type: "audit",
		phase: "workflow",
		status: "SUCCEEDED",
		duration_ms: 5,
		...overrides,
	};
}

test("structured events correlate safe operational fields and reject secret-bearing fields", () => {
	const result = createOperationalEvent(
		event({
			provider: "gateway",
			token_usage: 12,
			cost_usd: 0.02,
			preview_url: "https://preview.example.com/path",
		}),
	);
	assert.match(result.correlation_id, /^eve:/);
	assert.equal(result.preview_url, "https://preview.example.com/path");
	assert.throws(
		() => createOperationalEvent({ ...event(), raw_prompt: "ignore policy" }),
		/unsafe fields/,
	);
	assert.throws(
		() =>
			createOperationalEvent(
				event({ provider: "ghp_abcdefghijklmnopqrstuvwxyz" }),
			),
		/secret-like/,
	);
});

test("redaction removes secrets and PII before a safe audit log is created", () => {
	assert.deepEqual(
		redactOperationalData({
			authorization: "Bearer hidden",
			contact: "person@example.com",
			phone: "+1 831 555 1212",
		}),
		{
			authorization: "[REDACTED]",
			contact: "[REDACTED_EMAIL]",
			phone: "[REDACTED]",
		},
	);
	const log = createSafeAuditLog(event({ status: "NO_ACTION" }));
	assert.equal(log.redaction, "NO_SECRETS_OR_PERSONAL_DATA");
	assert.equal(log.event.status, "NO_ACTION");
});

test("metrics and alerting cover missed cron, stale runs, repeat failures, cost, preview, and production regressions", () => {
	const failures = [
		event({ status: "FAILED", attempt: 1, cost_usd: 0.6 }),
		event({ status: "FAILED", attempt: 2, cost_usd: 0.6 }),
		event({
			status: "FAILED",
			attempt: 3,
			cost_usd: 0.6,
			error_code: OPERATIONAL_ERROR_CODES.PREVIEW_REGRESSION,
		}),
		event({ phase: "production_audit", status: "FAILED" }),
	];
	const state = evaluateOperationalState({
		now: "2099-01-10T00:00:00.000Z",
		expectedCronAt: "2098-12-01T00:00:00.000Z",
		activeRuns: [
			{ run_id: "audit-2099-01-02", started_at: "2099-01-01T00:00:00.000Z" },
		],
		events: failures,
	});
	assert.equal(state.health, "UNHEALTHY");
	assert.deepEqual(
		new Set(state.alerts.map((alert) => alert.code)),
		new Set([
			"MISSED_CRON",
			"STALE_RUN",
			"REPEATED_FAILURE",
			"COST_THRESHOLD",
			"PREVIEW_REGRESSION",
			"PRODUCTION_REGRESSION",
		]),
	);
	assert.equal(calculateOperationalMetrics(failures).retries, 2);
});

test("fault injection plans bounded retry recovery and requires review for cost exhaustion or malformed results", () => {
	const timeout = planWorkflowRecovery({
		completedPhases: ["dispatch", "research"],
		failedPhase: "browser",
		error: { code: OPERATIONAL_ERROR_CODES.TIMEOUT, retryable: true },
	});
	assert.equal(timeout.action, "RESUME_FROM_LAST_CHECKPOINT");
	assert.equal(timeout.resume_phase, "browser");
	for (const code of [
		OPERATIONAL_ERROR_CODES.BROWSER_UNAVAILABLE,
		OPERATIONAL_ERROR_CODES.GITHUB_UNAVAILABLE,
		OPERATIONAL_ERROR_CODES.PROVIDER_UNAVAILABLE,
	]) {
		const recovery = planWorkflowRecovery({
			failedPhase: "adapter",
			error: { code, retryable: true },
		});
		assert.equal(recovery.action, "RESUME_FROM_LAST_CHECKPOINT");
	}
	for (const code of [
		OPERATIONAL_ERROR_CODES.BUDGET_EXHAUSTED,
		OPERATIONAL_ERROR_CODES.MALFORMED_RESULT,
	]) {
		const recovery = planWorkflowRecovery({
			failedPhase: "validation",
			error: { code, retryable: false },
		});
		assert.equal(recovery.action, "REQUIRE_HUMAN_REVIEW");
		assert.equal(recovery.mutations_allowed, false);
	}
});
