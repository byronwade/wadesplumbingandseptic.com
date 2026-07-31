import { createHash } from "node:crypto";
import { scanForSecrets } from "./policy.mjs";

export const OPERATIONAL_ERROR_CODES = Object.freeze({
	BROWSER_UNAVAILABLE: "BROWSER_UNAVAILABLE",
	BUDGET_EXHAUSTED: "BUDGET_EXHAUSTED",
	GITHUB_UNAVAILABLE: "GITHUB_UNAVAILABLE",
	MALFORMED_RESULT: "MALFORMED_RESULT",
	PREVIEW_REGRESSION: "PREVIEW_REGRESSION",
	PROVIDER_UNAVAILABLE: "PROVIDER_UNAVAILABLE",
	TIMEOUT: "TIMEOUT",
	WORKFLOW_RECOVERY_REQUIRED: "WORKFLOW_RECOVERY_REQUIRED",
});

const SAFE_FIELDS = new Set([
	"correlation_id",
	"run_id",
	"workflow_id",
	"job_type",
	"phase",
	"attempt",
	"status",
	"duration_ms",
	"model",
	"provider",
	"token_usage",
	"cost_usd",
	"source_count",
	"files_changed",
	"branch",
	"pr_number",
	"preview_url",
	"error_code",
	"retryable",
]);
const SENSITIVE_KEY =
	/(?:authorization|cookie|email|phone|secret|token|password|api[_-]?key|prompt|raw|body|content|query)/i;
const SECRET_VALUE =
	/(?:bearer\s+|gh[pousr]_|-----BEGIN [A-Z ]+PRIVATE KEY-----|api[_-]?key\s*[:=]|token\s*[:=]|secret\s*[:=])/i;
const SAFE_ID = /^[a-z0-9][a-z0-9._:/-]{0,127}$/i;
const SAFE_BRANCH = /^(?:eve\/[a-z0-9][a-z0-9-]{0,80}|main)$/;

function hash(value) {
	return createHash("sha256").update(String(value)).digest("hex");
}

function boundedString(value, label, { optional = true, max = 160 } = {}) {
	if (value === undefined || value === null) {
		if (optional) return null;
		throw new Error(`${label} is required`);
	}
	if (
		typeof value !== "string" ||
		!value.trim() ||
		value.length > max ||
		!SAFE_ID.test(value)
	) {
		throw new Error(`${label} is invalid`);
	}
	return value;
}

function boundedNumber(
	value,
	label,
	{ integer = false, min = 0, max = Number.MAX_SAFE_INTEGER } = {},
) {
	if (value === undefined || value === null) return 0;
	if (
		!Number.isFinite(value) ||
		value < min ||
		value > max ||
		(integer && !Number.isInteger(value))
	)
		throw new Error(`${label} is invalid`);
	return value;
}

function safeUrl(value) {
	if (value === undefined || value === null) return null;
	const url = new URL(value);
	if (
		url.protocol !== "https:" ||
		url.username ||
		url.password ||
		url.search ||
		url.hash
	)
		throw new Error("preview_url is invalid");
	return url.toString();
}

/** Remove data that must never enter logs, traces, or Git-backed evidence. */
export function redactOperationalData(value, key = "") {
	if (SENSITIVE_KEY.test(key)) return "[REDACTED]";
	if (typeof value === "string") {
		if (SECRET_VALUE.test(value) || scanForSecrets(value)) return "[REDACTED]";
		return value
			.replace(/\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g, "[REDACTED_EMAIL]")
			.replace(/\+?\d[\d .()-]{7,}\d/g, "[REDACTED_PHONE]");
	}
	if (Array.isArray(value))
		return value.slice(0, 20).map((entry) => redactOperationalData(entry));
	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value)
				.slice(0, 40)
				.map(([entryKey, entryValue]) => [
					entryKey,
					redactOperationalData(entryValue, entryKey),
				]),
		);
	}
	return value;
}

export function createCorrelationId({ runId, workflowId = null } = {}) {
	const run = boundedString(runId, "run_id", { optional: false });
	const workflow =
		workflowId === null ? "none" : boundedString(workflowId, "workflow_id");
	return `eve:${hash(`${run}:${workflow}`).slice(0, 24)}`;
}

/** A deliberately small, schema-checked event that callers may export to a log sink. */
export function createOperationalEvent(input = {}) {
	const rejected = Object.keys(input).filter((key) => !SAFE_FIELDS.has(key));
	if (rejected.length)
		throw new Error(
			`Operational event contains unsafe fields: ${rejected.join(", ")}`,
		);
	const run_id = boundedString(input.run_id, "run_id", { optional: false });
	const workflow_id = boundedString(input.workflow_id, "workflow_id");
	const correlation_id = createCorrelationId({
		runId: run_id,
		workflowId: workflow_id,
	});
	if (
		input.correlation_id !== undefined &&
		input.correlation_id !== correlation_id
	) {
		throw new Error("correlation_id does not match the run and workflow");
	}
	const event = {
		correlation_id,
		run_id,
		workflow_id,
		job_type: boundedString(input.job_type ?? "audit", "job_type", {
			optional: false,
		}),
		phase: boundedString(input.phase ?? "dispatch", "phase", {
			optional: false,
		}),
		attempt: boundedNumber(input.attempt ?? 1, "attempt", {
			integer: true,
			min: 1,
			max: 3,
		}),
		status: boundedString(input.status ?? "STARTED", "status", {
			optional: false,
		}),
		duration_ms: boundedNumber(input.duration_ms, "duration_ms", {
			integer: true,
			max: 300000,
		}),
		model: boundedString(input.model, "model"),
		provider: boundedString(input.provider, "provider"),
		token_usage: boundedNumber(input.token_usage, "token_usage", {
			integer: true,
			max: 16000,
		}),
		cost_usd: boundedNumber(input.cost_usd, "cost_usd", { max: 2 }),
		source_count: boundedNumber(input.source_count, "source_count", {
			integer: true,
			max: 1000,
		}),
		files_changed: boundedNumber(input.files_changed, "files_changed", {
			integer: true,
			max: 12,
		}),
		branch:
			input.branch === undefined || input.branch === null
				? null
				: SAFE_BRANCH.test(input.branch)
					? input.branch
					: (() => {
							throw new Error("branch is invalid");
						})(),
		pr_number: boundedNumber(input.pr_number, "pr_number", {
			integer: true,
			min: 0,
			max: 10000000,
		}),
		preview_url: safeUrl(input.preview_url),
		error_code: boundedString(input.error_code, "error_code"),
		retryable: Boolean(input.retryable),
	};
	if (scanForSecrets(event))
		throw new Error("Operational event contains a secret-like value");
	return Object.freeze(event);
}

export function classifyOperationalError(error) {
	const code = error?.code;
	if (Object.values(OPERATIONAL_ERROR_CODES).includes(code))
		return { code, retryable: Boolean(error.retryable) };
	return {
		code: OPERATIONAL_ERROR_CODES.PROVIDER_UNAVAILABLE,
		retryable: true,
	};
}

export function calculateOperationalMetrics(events = []) {
	const safeEvents = events.map((event) => createOperationalEvent(event));
	return Object.freeze({
		successful_runs: safeEvents.filter((event) => event.status === "SUCCEEDED")
			.length,
		failed_runs: safeEvents.filter((event) => event.status === "FAILED").length,
		retries: safeEvents.filter((event) => event.attempt > 1).length,
		duration_ms: safeEvents.reduce(
			(total, event) => total + event.duration_ms,
			0,
		),
		cost_usd: safeEvents.reduce((total, event) => total + event.cost_usd, 0),
		draft_prs: safeEvents.filter((event) => event.pr_number > 0).length,
		no_op_runs: safeEvents.filter((event) => event.status === "NO_ACTION")
			.length,
		blocked_policy_actions: safeEvents.filter(
			(event) => event.status === "POLICY_BLOCKED",
		).length,
	});
}

export function evaluateOperationalState({
	now,
	expectedCronAt,
	activeRuns = [],
	events = [],
	maxRunAgeMs = 300000,
	repeatedFailureThreshold = 3,
	costThresholdUsd = 1.5,
} = {}) {
	const nowMs = Date.parse(now);
	if (Number.isNaN(nowMs)) throw new Error("now is invalid");
	const alerts = [];
	if (
		expectedCronAt &&
		nowMs - Date.parse(expectedCronAt) > 8 * 24 * 60 * 60 * 1000
	)
		alerts.push({ code: "MISSED_CRON", severity: "high", retryable: true });
	for (const run of activeRuns) {
		if (nowMs - Date.parse(run.started_at) > maxRunAgeMs)
			alerts.push({
				code: "STALE_RUN",
				severity: "high",
				run_id: run.run_id,
				retryable: true,
			});
	}
	const normalized = events.map((event) => createOperationalEvent(event));
	let failures = 0;
	for (const event of [...normalized].reverse()) {
		if (event.status === "FAILED") failures += 1;
		else break;
	}
	if (failures >= repeatedFailureThreshold)
		alerts.push({
			code: "REPEATED_FAILURE",
			severity: "high",
			retryable: true,
		});
	const metrics = calculateOperationalMetrics(normalized);
	if (metrics.cost_usd >= costThresholdUsd)
		alerts.push({ code: "COST_THRESHOLD", severity: "high", retryable: false });
	for (const event of normalized) {
		if (event.error_code === OPERATIONAL_ERROR_CODES.PREVIEW_REGRESSION)
			alerts.push({
				code: "PREVIEW_REGRESSION",
				severity: "high",
				retryable: false,
			});
		if (event.phase === "production_audit" && event.status === "FAILED")
			alerts.push({
				code: "PRODUCTION_REGRESSION",
				severity: "critical",
				retryable: false,
			});
	}
	return Object.freeze({
		classification: "MOCK_VERIFIED",
		health: alerts.some((alert) => alert.severity === "critical")
			? "UNHEALTHY"
			: alerts.length
				? "DEGRADED"
				: "HEALTHY",
		readiness: activeRuns.length ? "NOT_READY" : "READY",
		metrics,
		alerts: Object.freeze(alerts),
	});
}

export function planWorkflowRecovery({
	completedPhases = [],
	failedPhase,
	error,
} = {}) {
	const safeCompleted = completedPhases.map((phase) =>
		boundedString(phase, "completed phase", { optional: false }),
	);
	const nextPhase = boundedString(failedPhase, "failed_phase", {
		optional: false,
	});
	const fault = classifyOperationalError(error);
	return Object.freeze({
		action: fault.retryable
			? "RESUME_FROM_LAST_CHECKPOINT"
			: "REQUIRE_HUMAN_REVIEW",
		completed_phases: Object.freeze(safeCompleted),
		resume_phase: nextPhase,
		error_code: fault.code,
		retryable: fault.retryable,
		mutations_allowed: false,
	});
}

export function createSafeAuditLog(
	event,
	{ observedAt = new Date(0).toISOString() } = {},
) {
	const safeEvent = createOperationalEvent(event);
	if (Number.isNaN(Date.parse(observedAt)))
		throw new Error("observedAt is invalid");
	return Object.freeze({
		observed_at: observedAt,
		classification: "MOCK_VERIFIED",
		redaction: "NO_SECRETS_OR_PERSONAL_DATA",
		event: safeEvent,
	});
}
