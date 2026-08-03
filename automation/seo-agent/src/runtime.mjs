import { timingSafeEqual, createHash } from "node:crypto";
import { resolve } from "node:path";
import { createAuditOnlyRun, createConfiguredAuditOnlyRun } from "./audit.mjs";
import { createIntegrationRegistry } from "./adapters.mjs";
import { loadConfig } from "./config.mjs";
import { DEFAULT_BUDGETS } from "./constants.mjs";
import { isStandingProductionPropose } from "./production-mode.mjs";
import {
	isRepositoryRoot,
	readRepositorySnapshotMetadata,
} from "./repository-snapshot.mjs";
import { collectRecordedRunIds } from "./run-history.mjs";
import {
	assertAuditWorkPackets,
	createAuditWorkPackets,
} from "./work-packets.mjs";

export const RUNTIME_MODES = Object.freeze([
	"observe",
	"propose",
	"dry-run",
	"paused",
	"disabled",
]);
export const RUNTIME_ERROR_CODES = Object.freeze({
	AUTHENTICATION_FAILED: "AUTHENTICATION_FAILED",
	CIRCUIT_OPEN: "CIRCUIT_OPEN",
	DISPATCH_TIMEOUT: "DISPATCH_TIMEOUT",
	DUPLICATE_RUN: "DUPLICATE_RUN",
	EVE_UNAVAILABLE: "EVE_UNAVAILABLE",
	INTEGRATION_UNAVAILABLE: "INTEGRATION_UNAVAILABLE",
	MALFORMED_REQUEST: "MALFORMED_REQUEST",
	RUNTIME_DISABLED: "RUNTIME_DISABLED",
	RUNTIME_PAUSED: "RUNTIME_PAUSED",
	UNSUPPORTED_JOB: "UNSUPPORTED_JOB",
});

const AUDIT_JOB = Object.freeze({ name: "audit", cron: "17 16 * * 1" });
const PROPOSAL_JOB = Object.freeze({ name: "proposal", cron: AUDIT_JOB.cron });
const NATIVE_SCHEDULE_SOURCE = "EVE_NATIVE_CRON";
const SAFE_RUN_ID = /^[a-z0-9][a-z0-9-]{2,79}$/;

export class RuntimeError extends Error {
	constructor(code, message, { retryable = false, status = 500 } = {}) {
		super(message);
		this.name = "RuntimeError";
		this.code = code;
		this.retryable = retryable;
		this.status = status;
	}

	toJSON() {
		return {
			code: this.code,
			message: this.message,
			retryable: this.retryable,
		};
	}
}

export function verifyCronSecret(authorization, expectedSecret) {
	if (typeof expectedSecret !== "string" || expectedSecret.length < 24)
		return false;
	if (typeof authorization !== "string") return false;
	const match = /^Bearer\s+(.+)$/i.exec(authorization.trim());
	if (!match) return false;
	const supplied = Buffer.from(match[1], "utf8");
	const expected = Buffer.from(expectedSecret, "utf8");
	return (
		supplied.length === expected.length && timingSafeEqual(supplied, expected)
	);
}

/** @param {{ job?: "audit" | "proposal" }} [input] */
export function selectScheduledJob({ job } = {}) {
	if (job === undefined || job === "" || job === AUDIT_JOB.name)
		return AUDIT_JOB;
	if (job === PROPOSAL_JOB.name) return PROPOSAL_JOB;
	throw new RuntimeError(
		RUNTIME_ERROR_CODES.UNSUPPORTED_JOB,
		`Unsupported scheduled job: ${String(job)}`,
		{ status: 400 },
	);
}

export function deterministicRunId({
	job = AUDIT_JOB.name,
	now = new Date(),
} = {}) {
	const date = now.toISOString().slice(0, 10);
	return `${job}-${date}`;
}

export function createRunDescriptor({ job, now = new Date() } = {}) {
	const selected = selectScheduledJob({ job });
	const runId = deterministicRunId({ job: selected.name, now });
	if (!SAFE_RUN_ID.test(runId))
		throw new RuntimeError(
			RUNTIME_ERROR_CODES.MALFORMED_REQUEST,
			"Derived run ID is unsafe.",
		);
	const idempotencyKey = createHash("sha256")
		.update(`wades-eve-seo-agent:v1:${selected.name}:${runId}`)
		.digest("hex");
	return Object.freeze({
		job: selected.name,
		cron: selected.cron,
		runId,
		idempotencyKey,
		continuationToken: `seo-runtime:${runId}`,
		scheduledAt: now.toISOString(),
	});
}

/**
 * Accept only the single compiled Eve schedule target. Observe mode selects
 * audit. Propose mode selects the Connect-backed draft proposal job.
 * @param {{ source?: string, job?: "audit" | "proposal", now?: Date }} input
 */
export function createNativeScheduleDescriptor({
	source,
	job = AUDIT_JOB.name,
	now = new Date(),
}) {
	if (source !== NATIVE_SCHEDULE_SOURCE)
		throw new RuntimeError(
			RUNTIME_ERROR_CODES.MALFORMED_REQUEST,
			"Runtime channel accepts only the compiled native schedule target.",
			{ status: 400 },
		);
	return createRunDescriptor({ job, now });
}

/** @param {{ runId: string, idempotencyKey: string, job?: "audit" | "proposal" }} input */
export function assertRunDescriptor({
	runId,
	idempotencyKey,
	job = AUDIT_JOB.name,
}) {
	if (typeof runId !== "string" || !SAFE_RUN_ID.test(runId))
		throw new RuntimeError(
			RUNTIME_ERROR_CODES.MALFORMED_REQUEST,
			"Runtime run ID is invalid.",
			{ status: 400 },
		);
	const selected = selectScheduledJob({ job });
	const expected = createHash("sha256")
		.update(`wades-eve-seo-agent:v1:${selected.name}:${runId}`)
		.digest("hex");
	if (
		typeof idempotencyKey !== "string" ||
		idempotencyKey.length !== expected.length ||
		!timingSafeEqual(
			Buffer.from(idempotencyKey, "utf8"),
			Buffer.from(expected, "utf8"),
		)
	)
		throw new RuntimeError(
			RUNTIME_ERROR_CODES.MALFORMED_REQUEST,
			"Runtime idempotency key does not match its run ID.",
			{ status: 400 },
		);
	return Object.freeze({
		job: selected.name,
		runId,
		idempotencyKey,
		continuationToken: `seo-runtime:${runId}`,
		cron: selected.cron,
	});
}

export { isStandingProductionPropose } from "./production-mode.mjs";

export function loadRuntimeSettings(env = process.env) {
	const standingPropose = isStandingProductionPropose(env);
	const mode = standingPropose
		? "propose"
		: (env.SEO_AGENT_RUN_MODE ??
			(env.SEO_AGENT_ENV === "production" ? "observe" : "dry-run"));
	if (!RUNTIME_MODES.includes(mode))
		throw new RuntimeError(
			RUNTIME_ERROR_CODES.MALFORMED_REQUEST,
			`Unsupported SEO_AGENT_RUN_MODE: ${mode}`,
			{ status: 503 },
		);
	const killSwitch = standingPropose
		? "false"
		: (env.SEO_AGENT_MUTATION_KILL_SWITCH ?? "true");
	if (!["true", "false"].includes(killSwitch))
		throw new RuntimeError(
			RUNTIME_ERROR_CODES.MALFORMED_REQUEST,
			"SEO_AGENT_MUTATION_KILL_SWITCH must be true or false.",
			{ status: 503 },
		);
	const rawDispatchTimeout = env.SEO_AGENT_DISPATCH_TIMEOUT_MS ?? "8000";
	const dispatchTimeoutMs = Number(rawDispatchTimeout);
	if (
		!Number.isInteger(dispatchTimeoutMs) ||
		dispatchTimeoutMs < 100 ||
		dispatchTimeoutMs > 15000
	) {
		throw new RuntimeError(
			RUNTIME_ERROR_CODES.MALFORMED_REQUEST,
			"SEO_AGENT_DISPATCH_TIMEOUT_MS must be an integer from 100 through 15000.",
			{ status: 503 },
		);
	}
	return Object.freeze({
		mode,
		mutationKillSwitch: killSwitch === "true",
		cronSecret: env.CRON_SECRET,
		// Public preview deployments are reachable too; only local development may
		// use the credential-free fixture dispatcher.
		requiresCronSecret:
			env.SEO_AGENT_ENV === "production" || env.SEO_AGENT_ENV === "preview",
		dispatchTimeoutMs,
		limits: Object.freeze({ ...DEFAULT_BUDGETS }),
	});
}

export function createDispatchLockStore() {
	const locks = new Set();
	return Object.freeze({
		acquire(key) {
			if (locks.has(key)) return false;
			locks.add(key);
			return true;
		},
		release(key) {
			locks.delete(key);
		},
		has(key) {
			return locks.has(key);
		},
	});
}

export function createCircuitBreaker({
	failureThreshold = 3,
	cooldownMs = 300000,
	now = () => Date.now(),
} = {}) {
	let failures = 0;
	let openedAt = null;
	return Object.freeze({
		allow() {
			if (openedAt === null) return true;
			if (now() - openedAt >= cooldownMs) {
				failures = 0;
				openedAt = null;
				return true;
			}
			return false;
		},
		recordSuccess() {
			failures = 0;
			openedAt = null;
		},
		recordFailure() {
			failures += 1;
			if (failures >= failureThreshold) openedAt = now();
		},
		snapshot() {
			return Object.freeze({
				failures,
				state: openedAt === null ? "CLOSED" : "OPEN",
			});
		},
	});
}

export function withTimeout(operation, { timeoutMs, label = "operation" }) {
	let timer;
	const timeout = new Promise((_, reject) => {
		timer = setTimeout(
			() =>
				reject(
					new RuntimeError(
						RUNTIME_ERROR_CODES.DISPATCH_TIMEOUT,
						`${label} timed out.`,
						{ retryable: true, status: 503 },
					),
				),
			timeoutMs,
		);
	});
	return Promise.race([Promise.resolve().then(operation), timeout]).finally(
		() => clearTimeout(timer),
	);
}

export async function retryRuntimeOperation(
	operation,
	{ attempts = 3, shouldRetry = (error) => error?.retryable === true } = {},
) {
	if (
		typeof operation !== "function" ||
		!Number.isInteger(attempts) ||
		attempts < 1 ||
		attempts > 3
	)
		throw new TypeError("Runtime retry configuration is invalid.");
	let failure;
	for (let attempt = 1; attempt <= attempts; attempt += 1) {
		try {
			return await operation(attempt);
		} catch (error) {
			failure = error;
			if (attempt === attempts || !shouldRetry(error)) throw error;
		}
	}
	throw failure;
}

function cronPayload(status, descriptor, extra = {}) {
	return {
		status,
		run_id: descriptor.runId,
		idempotency_key: descriptor.idempotencyKey,
		job: descriptor.job,
		...extra,
	};
}

/**
 * @typedef {Object} CronDispatchInput
 * @property {Request} request
 * @property {NodeJS.ProcessEnv} [env]
 * @property {Date} [now]
 * @property {(continuationToken: string) => Promise<unknown>} [activeRun]
 * @property {(descriptor: ReturnType<typeof createRunDescriptor>, settings: ReturnType<typeof loadRuntimeSettings>) => Promise<unknown>} [startRun]
 * @property {{ acquire(key: string): boolean, release(key: string): void }} [locks]
 * @property {{ allow(): boolean, recordSuccess(): void, recordFailure(): void }} [circuit]
 */

/** @param {CronDispatchInput} input */
export async function dispatchCronRequest({
	request,
	env = process.env,
	now = new Date(),
	activeRun = async (_continuationToken) => undefined,
	startRun = async (_descriptor, _settings) => {
		throw new RuntimeError(
			RUNTIME_ERROR_CODES.EVE_UNAVAILABLE,
			"Eve dispatch is unavailable.",
			{ retryable: true, status: 503 },
		);
	},
	locks = createDispatchLockStore(),
	circuit = createCircuitBreaker(),
}) {
	let settings;
	try {
		settings = loadRuntimeSettings(env);
	} catch (error) {
		return runtimeFailure(error);
	}
	if (!(request instanceof Request) || request.method !== "GET")
		return runtimeFailure(
			new RuntimeError(
				RUNTIME_ERROR_CODES.MALFORMED_REQUEST,
				"Cron dispatcher accepts GET only.",
				{ status: 405 },
			),
		);
	if (
		settings.requiresCronSecret &&
		!verifyCronSecret(request.headers.get("authorization"), settings.cronSecret)
	) {
		return runtimeFailure(
			new RuntimeError(
				RUNTIME_ERROR_CODES.AUTHENTICATION_FAILED,
				"Cron authentication failed.",
				{ status: 401 },
			),
		);
	}
	let descriptor;
	try {
		const url = new URL(request.url);
		if ([...url.searchParams.keys()].some((key) => key !== "job"))
			throw new RuntimeError(
				RUNTIME_ERROR_CODES.MALFORMED_REQUEST,
				"Cron dispatcher accepts only the optional job query parameter.",
				{ status: 400 },
			);
		descriptor = createRunDescriptor({
			job: url.searchParams.get("job") ?? undefined,
			now,
		});
	} catch (error) {
		return runtimeFailure(error);
	}
	if (settings.mode === "disabled")
		return cronPayload("DISABLED", descriptor, {
			audit_only: descriptor.job === AUDIT_JOB.name,
			mutation_kill_switch: settings.mutationKillSwitch,
		});
	if (settings.mode === "paused")
		return cronPayload("PAUSED", descriptor, {
			audit_only: descriptor.job === AUDIT_JOB.name,
			mutation_kill_switch: settings.mutationKillSwitch,
		});
	if (!circuit.allow())
		return runtimeFailure(
			new RuntimeError(
				RUNTIME_ERROR_CODES.CIRCUIT_OPEN,
				"Cron dispatch circuit is open after repeated start failures.",
				{ retryable: true, status: 503 },
			),
			descriptor,
		);
	if (!locks.acquire(descriptor.idempotencyKey))
		return cronPayload("DUPLICATE", descriptor, {
			reason: "A matching dispatch is already being started.",
		});
	try {
		if (await activeRun(descriptor.continuationToken))
			return cronPayload("DUPLICATE", descriptor, {
				reason: "A durable Eve session already owns this run.",
			});
		if (typeof startRun !== "function")
			throw new RuntimeError(
				RUNTIME_ERROR_CODES.EVE_UNAVAILABLE,
				"Eve dispatch is unavailable.",
				{ retryable: true, status: 503 },
			);
		const result = await withTimeout(() => startRun(descriptor, settings), {
			timeoutMs: settings.dispatchTimeoutMs,
			label: "Eve session start",
		});
		circuit.recordSuccess();
		return cronPayload("ACCEPTED", descriptor, {
			audit_only: descriptor.job === AUDIT_JOB.name,
			mutation_kill_switch: settings.mutationKillSwitch,
			durable_session_id: result?.sessionId ?? null,
		});
	} catch (error) {
		circuit.recordFailure();
		const normalized =
			error instanceof RuntimeError
				? error
				: new RuntimeError(
						RUNTIME_ERROR_CODES.EVE_UNAVAILABLE,
						"Eve dispatch failed before durable work started.",
						{ retryable: true, status: 503 },
					);
		return runtimeFailure(normalized, descriptor);
	} finally {
		locks.release(descriptor.idempotencyKey);
	}
}

export function runtimeFailure(error, descriptor) {
	const normalized =
		error instanceof RuntimeError
			? error
			: new RuntimeError(
					RUNTIME_ERROR_CODES.EVE_UNAVAILABLE,
					"Runtime dispatch failed.",
					{ retryable: true, status: 503 },
				);
	return {
		status: "ERROR",
		...(descriptor ? cronPayload("ERROR", descriptor) : {}),
		error: normalized.toJSON(),
		http_status: normalized.status,
	};
}

export function resolveRepositoryState(env = process.env) {
	const configured = env.SEO_AGENT_REPOSITORY_ROOT?.trim();
	const candidates = [
		configured ? resolve(configured) : null,
		resolve(process.cwd(), "repository-snapshot"),
		resolve(import.meta.dirname, "repository-snapshot"),
		resolve(import.meta.dirname, "../repository-snapshot"),
		resolve(import.meta.dirname, "../../.."),
	].filter(Boolean);
	for (const root of [...new Set(candidates)]) {
		if (!isRepositoryRoot(root)) continue;
		const snapshot = readRepositorySnapshotMetadata(root);
		return Object.freeze({
			repoRoot: root,
			source: snapshot ? "BUNDLED_GIT_SNAPSHOT" : "LOCAL_CHECKOUT",
			commitSha:
				snapshot?.commit_sha ??
				env.VERCEL_GIT_COMMIT_SHA ??
				"VERCEL_RUNTIME_UNAVAILABLE",
			contentSha256: snapshot?.content_sha256 ?? null,
		});
	}
	return null;
}

export function resolveRepositoryRoot(env = process.env) {
	return resolveRepositoryState(env)?.repoRoot ?? null;
}

export function planRun({ descriptor, settings, recordedRunIds = [] }) {
	const firstRun = recordedRunIds.length === 0;
	const inactive = settings.mode === "paused" || settings.mode === "disabled";
	const plan = {
		...descriptor,
		mode: settings.mode,
		auditOnly: descriptor.job === AUDIT_JOB.name,
		firstRunAuditOnly: firstRun,
		mutationsAllowed: false,
		mutationKillSwitch: settings.mutationKillSwitch,
		inactive,
		limits: settings.limits,
	};
	const workPackets =
		inactive || descriptor.job !== AUDIT_JOB.name
			? []
			: createAuditWorkPackets({
					descriptor,
					mode: settings.mode,
					firstRunAuditOnly: firstRun,
					budgets: settings.limits,
				});
	if (!inactive)
		assertAuditWorkPackets(workPackets, { budgets: settings.limits });
	return Object.freeze({ ...plan, workPackets });
}

/**
 * Standing draft-proposal gate. Cron may research and open one draft PR through
 * Vercel Connect GitHub when propose mode is on, mutation is enabled, the kill
 * switch is off, and the GitHub adapter is enabled. It never merges, deploys,
 * force-pushes, or writes main.
 */
export function assertProposalRunAuthorization({
	descriptor,
	settings,
	config,
}) {
	if (descriptor?.job !== PROPOSAL_JOB.name) {
		throw new RuntimeError(
			RUNTIME_ERROR_CODES.UNSUPPORTED_JOB,
			"Only proposal jobs may enter the draft publication workflow.",
			{ status: 400 },
		);
	}
	if (settings?.mode !== "propose") {
		throw new RuntimeError(
			RUNTIME_ERROR_CODES.RUNTIME_PAUSED,
			"Proposal execution requires SEO_AGENT_RUN_MODE=propose.",
			{ status: 409 },
		);
	}
	if (config?.publishing?.mutationMode !== "enabled") {
		throw new RuntimeError(
			RUNTIME_ERROR_CODES.RUNTIME_DISABLED,
			"Proposal execution requires SEO_AGENT_MUTATION_MODE=enabled.",
			{ status: 409 },
		);
	}
	if (settings?.mutationKillSwitch !== false) {
		throw new RuntimeError(
			RUNTIME_ERROR_CODES.RUNTIME_DISABLED,
			"Proposal execution requires SEO_AGENT_MUTATION_KILL_SWITCH=false.",
			{ status: 409 },
		);
	}
	if (config?.integrationFlags?.github !== true) {
		throw new RuntimeError(
			RUNTIME_ERROR_CODES.RUNTIME_DISABLED,
			"Proposal execution requires SEO_AGENT_ENABLE_GITHUB=true so Vercel Connect can open the draft PR.",
			{ status: 409 },
		);
	}
	return true;
}

export async function executeOrchestratedAudit({
	descriptor,
	settings = loadRuntimeSettings(),
	repoRoot = resolveRepositoryRoot(),
	executeLiveReads = false,
	config = loadConfig(),
	registry = undefined,
	treeHash = resolveRepositoryState()?.commitSha ??
		process.env.VERCEL_GIT_COMMIT_SHA ??
		"VERCEL_RUNTIME_UNAVAILABLE",
}) {
	if (!repoRoot)
		return {
			classification: "BLOCKED_MISSING_CREDENTIALS",
			state: "BLOCKED_MISSING_CREDENTIALS",
			run_id: descriptor.runId,
			reason:
				"Git-backed repository state is unavailable in this sidecar runtime.",
		};
	const recordedRunIds = collectRecordedRunIds({ repoRoot });
	const plan = planRun({ descriptor, settings, recordedRunIds });
	if (recordedRunIds.includes(plan.runId))
		return {
			classification: "MOCK_VERIFIED",
			state: "DUPLICATE_RUN",
			run_id: plan.runId,
			audit_only: true,
			reason:
				"Git-backed completed run history already contains this deterministic run ID.",
			runtime_plan: plan,
		};
	if (plan.inactive)
		return {
			classification: "MOCK_VERIFIED",
			state: plan.mode === "paused" ? "PAUSED" : "DISABLED",
			run_id: plan.runId,
			audit_only: true,
			plan,
		};
	if (settings.mode === "dry-run")
		return {
			...createAuditOnlyRun({
				repoRoot,
				runId: plan.runId,
				treeHash: "DRY_RUN_RUNTIME",
				fixtures: true,
			}),
			runtime_plan: plan,
		};
	// The first production audit may read only configured integrations. It builds
	// a redacted immutable artifact proposal but performs no Git write, content
	// change, PR creation, merge, deployment, or Blob archive. Persisting that
	// proposal is a distinct, human-approved Git artifact step.
	const run = await createConfiguredAuditOnlyRun({
		repoRoot,
		runId: plan.runId,
		treeHash,
		config,
		registry: registry ?? createIntegrationRegistry({ config }),
		executeLiveReads,
		completedRunIds: recordedRunIds,
	});
	return Object.freeze({ ...run, runtime_plan: plan });
}

function hasGatewayApiKey(env) {
	return (
		typeof env.AI_GATEWAY_API_KEY === "string" &&
		env.AI_GATEWAY_API_KEY.trim().length >= 24
	);
}

export function gatewayAuthenticationAvailable({
	env = process.env,
	oidcTokenPresent = false,
} = {}) {
	return (
		hasGatewayApiKey(env) || Boolean(env.VERCEL_OIDC_TOKEN) || oidcTokenPresent
	);
}

export function runtimeHealth({
	env = process.env,
	circuit = createCircuitBreaker(),
	oidcTokenPresent = false,
} = {}) {
	try {
		const settings = loadRuntimeSettings(env);
		const integrationAvailable = gatewayAuthenticationAvailable({
			env,
			oidcTokenPresent,
		});
		const configurationReady =
			!settings.requiresCronSecret ||
			(typeof settings.cronSecret === "string" &&
				settings.cronSecret.length >= 24);
		const status =
			settings.mode === "disabled"
				? "disabled"
				: settings.mode === "paused"
					? "paused"
					: integrationAvailable
						? "configured_unverified"
						: "degraded";
		return Object.freeze({
			status,
			ready: configurationReady && settings.mode !== "disabled",
			mode: settings.mode,
			cron_secret_required: settings.requiresCronSecret,
			integration_classification: integrationAvailable
				? "CONFIGURED_UNVERIFIED"
				: "BLOCKED_MISSING_CREDENTIALS",
			circuit: circuit.snapshot(),
			mutation_kill_switch: settings.mutationKillSwitch,
		});
	} catch (error) {
		return Object.freeze({
			status: "degraded",
			ready: false,
			error: runtimeFailure(error).error,
			integration_classification: "BLOCKED_MISSING_CREDENTIALS",
		});
	}
}
