import test from "node:test";
import assert from "node:assert/strict";
import {
	RUNTIME_ERROR_CODES,
	assertRunDescriptor,
	createCircuitBreaker,
	createDispatchLockStore,
	createRunDescriptor,
	deterministicRunId,
	dispatchCronRequest,
	executeOrchestratedAudit,
	loadRuntimeSettings,
	planRun,
	retryRuntimeOperation,
	runtimeHealth,
	selectScheduledJob,
	verifyCronSecret,
	withTimeout,
} from "../src/runtime.mjs";
import { resolve } from "node:path";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { createIntegrationRegistry } from "../src/adapters.mjs";

const productionEnv = Object.freeze({
	SEO_AGENT_ENV: "production",
	SEO_AGENT_RUN_MODE: "observe",
	SEO_AGENT_MUTATION_KILL_SWITCH: "true",
	CRON_SECRET: "this-is-a-long-fixture-cron-secret-value",
});

function cronRequest(path = "/api/cron", secret = productionEnv.CRON_SECRET) {
	return new Request(`https://sidecar.example.test${path}`, {
		headers: secret ? { authorization: `Bearer ${secret}` } : {},
	});
}

test("cron authentication is timing-safe in behavior and rejects malformed requests", async () => {
	assert.equal(
		verifyCronSecret(
			`Bearer ${productionEnv.CRON_SECRET}`,
			productionEnv.CRON_SECRET,
		),
		true,
	);
	assert.equal(
		verifyCronSecret(
			"Bearer wrong-value-with-same-visible-shape",
			productionEnv.CRON_SECRET,
		),
		false,
	);
	assert.equal(
		verifyCronSecret(
			`Token ${productionEnv.CRON_SECRET}`,
			productionEnv.CRON_SECRET,
		),
		false,
	);
	const unauthorized = await dispatchCronRequest({
		request: cronRequest("/api/cron", null),
		env: productionEnv,
	});
	assert.equal(
		unauthorized.error.code,
		RUNTIME_ERROR_CODES.AUTHENTICATION_FAILED,
	);
	const previewUnauthorized = await dispatchCronRequest({
		request: cronRequest("/api/cron", null),
		env: { ...productionEnv, SEO_AGENT_ENV: "preview" },
	});
	assert.equal(
		previewUnauthorized.error.code,
		RUNTIME_ERROR_CODES.AUTHENTICATION_FAILED,
	);
	const malformed = await dispatchCronRequest({
		request: cronRequest("/api/cron?mode=propose"),
		env: productionEnv,
	});
	assert.equal(malformed.error.code, RUNTIME_ERROR_CODES.MALFORMED_REQUEST);
	const unsupported = await dispatchCronRequest({
		request: cronRequest("/api/cron?job=write-main"),
		env: productionEnv,
	});
	assert.equal(unsupported.error.code, RUNTIME_ERROR_CODES.UNSUPPORTED_JOB);
});

test("schedule selection and stable run identity are deterministic", () => {
	const now = new Date("2026-07-30T16:17:00.000Z");
	assert.deepEqual(selectScheduledJob(), {
		name: "audit",
		cron: "17 16 * * 1",
	});
	assert.equal(deterministicRunId({ now }), "audit-2026-07-30");
	const first = createRunDescriptor({ now });
	const second = createRunDescriptor({ now });
	assert.equal(first.runId, second.runId);
	assert.equal(first.idempotencyKey, second.idempotencyKey);
	assert.equal(first.continuationToken, "seo-runtime:audit-2026-07-30");
	assert.deepEqual(
		assertRunDescriptor({
			runId: first.runId,
			idempotencyKey: first.idempotencyKey,
		}),
		{
			job: "audit",
			runId: first.runId,
			idempotencyKey: first.idempotencyKey,
			continuationToken: first.continuationToken,
			cron: "17 16 * * 1",
		},
	);
	assert.throws(
		() =>
			assertRunDescriptor({
				runId: first.runId,
				idempotencyKey: "0".repeat(64),
			}),
		/does not match/,
	);
	const proposal = createRunDescriptor({ job: "proposal", now });
	assert.equal(proposal.runId, "proposal-2026-07-30");
	assert.equal(proposal.cron, null);
	assert.equal(
		assertRunDescriptor({
			runId: proposal.runId,
			idempotencyKey: proposal.idempotencyKey,
			job: "proposal",
		}).job,
		"proposal",
	);
});

test("duplicate dispatches are denied by an active durable session and local lock", async () => {
	const now = new Date("2026-07-30T16:17:00.000Z");
	const descriptor = createRunDescriptor({ now });
	const active = await dispatchCronRequest({
		request: cronRequest(),
		env: productionEnv,
		now,
		activeRun: async (token) =>
			token === descriptor.continuationToken
				? { sessionId: "eve-existing" }
				: undefined,
		startRun: async () => {
			throw new Error("must not start");
		},
	});
	assert.equal(active.status, "DUPLICATE");

	const locks = createDispatchLockStore();
	assert.equal(locks.acquire(descriptor.idempotencyKey), true);
	const locked = await dispatchCronRequest({
		request: cronRequest(),
		env: productionEnv,
		now,
		locks,
		startRun: async () => ({ sessionId: "must-not-run" }),
	});
	assert.equal(locked.status, "DUPLICATE");
	locks.release(descriptor.idempotencyKey);
});

test("dispatcher starts durable work promptly and never executes long work inline", async () => {
	const accepted = await dispatchCronRequest({
		request: cronRequest(),
		env: productionEnv,
		now: new Date("2026-07-30T16:17:00.000Z"),
		startRun: async (descriptor, settings) => ({
			sessionId: `eve-${descriptor.runId}-${settings.mode}`,
		}),
	});
	assert.equal(accepted.status, "ACCEPTED");
	assert.equal(accepted.audit_only, true);
	assert.equal(accepted.mutation_kill_switch, true);
	assert.match(accepted.durable_session_id, /^eve-audit-2026-07-30-observe$/);
});

test("paused, disabled, mutation kill switch, and first-run policy fail closed", async () => {
	const paused = await dispatchCronRequest({
		request: cronRequest(),
		env: { ...productionEnv, SEO_AGENT_RUN_MODE: "paused" },
	});
	assert.equal(paused.status, "PAUSED");
	const disabled = await dispatchCronRequest({
		request: cronRequest(),
		env: { ...productionEnv, SEO_AGENT_RUN_MODE: "disabled" },
	});
	assert.equal(disabled.status, "DISABLED");
	const firstPlan = planRun({
		descriptor: createRunDescriptor({
			now: new Date("2026-07-30T00:00:00.000Z"),
		}),
		settings: loadRuntimeSettings(productionEnv),
		recordedRunIds: [],
	});
	assert.equal(firstPlan.firstRunAuditOnly, true);
	assert.equal(firstPlan.auditOnly, true);
	assert.equal(firstPlan.mutationsAllowed, false);
	assert.equal(firstPlan.mutationKillSwitch, true);
	const laterPlan = planRun({
		descriptor: createRunDescriptor({
			now: new Date("2026-08-06T00:00:00.000Z"),
		}),
		settings: loadRuntimeSettings({
			...productionEnv,
			SEO_AGENT_RUN_MODE: "propose",
			SEO_AGENT_MUTATION_KILL_SWITCH: "false",
		}),
		recordedRunIds: ["audit-2026-07-30"],
	});
	assert.equal(laterPlan.firstRunAuditOnly, false);
	assert.equal(laterPlan.mutationsAllowed, false);
});

test("retries, timeouts, and the circuit breaker have bounded degraded behavior", async () => {
	let attempts = 0;
	const value = await retryRuntimeOperation(async () => {
		attempts += 1;
		if (attempts < 3)
			throw Object.assign(new Error("transient"), { retryable: true });
		return "recovered";
	});
	assert.equal(value, "recovered");
	assert.equal(attempts, 3);
	await assert.rejects(
		withTimeout(() => new Promise(() => {}), {
			timeoutMs: 5,
			label: "fixture",
		}),
		(error) => error.code === RUNTIME_ERROR_CODES.DISPATCH_TIMEOUT,
	);
	assert.equal(
		await withTimeout(async () => "completed", {
			timeoutMs: 5,
			label: "successful fixture",
		}),
		"completed",
	);
	let tick = 0;
	const circuit = createCircuitBreaker({
		failureThreshold: 2,
		cooldownMs: 50,
		now: () => tick,
	});
	circuit.recordFailure();
	circuit.recordFailure();
	assert.equal(circuit.allow(), false);
	tick = 51;
	assert.equal(circuit.allow(), true);
	const broken = await dispatchCronRequest({
		request: cronRequest(),
		env: productionEnv,
		circuit: createCircuitBreaker({ failureThreshold: 1 }),
		startRun: async () => {
			throw new Error("eve is down");
		},
	});
	assert.equal(broken.error.code, RUNTIME_ERROR_CODES.EVE_UNAVAILABLE);
});

test("health and readiness are redacted and recognize Vercel OIDC", () => {
	const development = runtimeHealth({ env: { SEO_AGENT_ENV: "development" } });
	assert.equal(development.status, "degraded");
	assert.equal(development.ready, true);
	assert.equal(
		development.integration_classification,
		"BLOCKED_MISSING_CREDENTIALS",
	);
	const production = runtimeHealth({
		env: productionEnv,
		oidcTokenPresent: true,
	});
	assert.equal(production.status, "configured_unverified");
	assert.equal(production.ready, true);
	assert.equal(
		JSON.stringify(production).includes("x-vercel-oidc-token"),
		false,
	);
	const placeholderKeyFallsBackToOidc = runtimeHealth({
		env: { ...productionEnv, AI_GATEWAY_API_KEY: "placeholder" },
		oidcTokenPresent: true,
	});
	assert.equal(placeholderKeyFallsBackToOidc.status, "configured_unverified");
});

test("orchestrated dry runs remain local, audit-only, and credential-free", async () => {
	const result = await executeOrchestratedAudit({
		descriptor: createRunDescriptor({
			now: new Date("2026-07-30T00:00:00.000Z"),
		}),
		settings: loadRuntimeSettings({ SEO_AGENT_ENV: "development" }),
		repoRoot: resolve(import.meta.dirname, "../../.."),
	});
	assert.equal(result.classification, "MOCK_VERIFIED");
	assert.equal(result.audit_only, true);
	assert.equal(result.draft_prs_created, 0);
	assert.equal(result.runtime_plan.mutationsAllowed, false);
	assert.equal(result.runtime_plan.workPackets.length, 9);
	assert.equal(
		result.runtime_plan.workPackets.every(
			(packet) => packet.idempotency_key === result.runtime_plan.idempotencyKey,
		),
		true,
	);
});

test("approved configured observation performs bounded reads but remains audit-only", async () => {
	const descriptor = createRunDescriptor({
		now: new Date("2026-07-30T00:00:00.000Z"),
	});
	const config = {
		environment: "production",
		repository: "byronwade/wadesplumbingandseptic.com",
		siteUrl: "https://www.wadesplumbingandseptic.com/",
		browserResearch: { enabled: false, allowedDomains: [] },
		githubConnectorId: "github/wadesplumbingandseptic-com",
		integrationFlags: {
			aiGateway: true,
			github: false,
			vercel: false,
			searchConsole: false,
			pageSpeed: false,
			browserbase: false,
			ga4: false,
			businessProfile: false,
			localFalcon: false,
			similarweb: false,
			googleTrends: false,
		},
		liveReads: { humanApproved: true, approvedRunId: descriptor.runId },
		credentials: { vercelOidcToken: "oidc-fixture-token" },
		blob: { enabled: false, archiveApproved: false, prefix: "fixtures" },
	};
	const registry = createIntegrationRegistry({
		config,
		fetchImpl: async () =>
			new Response(JSON.stringify({ data: [{ id: "openai/gpt-5.6-terra" }] }), {
				headers: { "content-type": "application/json" },
			}),
	});
	const result = await executeOrchestratedAudit({
		descriptor,
		settings: loadRuntimeSettings(productionEnv),
		repoRoot: resolve(import.meta.dirname, "../../.."),
		executeLiveReads: true,
		config,
		registry,
		treeHash: "runtime-fixture-tree",
	});
	assert.equal(result.classification, "LIVE_VERIFIED");
	assert.equal(result.audit_only, true);
	assert.equal(result.content_files_changed, 0);
	assert.equal(result.draft_prs_created, 0);
	assert.equal(result.artifact_proposal.write_performed, false);
	assert.equal(result.integration_status.ai_gateway, "LIVE_VERIFIED");
});

test("Git-backed completed history rejects a duplicate runtime run without a database", async () => {
	const root = mkdtempSync(resolve(tmpdir(), "eve-runtime-history-"));
	try {
		const source = resolve(import.meta.dirname, "../../..");
		const run = await executeOrchestratedAudit({
			descriptor: createRunDescriptor({
				now: new Date("2026-07-30T00:00:00.000Z"),
			}),
			settings: loadRuntimeSettings({ SEO_AGENT_ENV: "development" }),
			repoRoot: source,
		});
		const destination = resolve(root, "seo", "runs", run.run_id);
		mkdirSync(destination, { recursive: true });
		writeFileSync(
			resolve(destination, "manifest.json"),
			`${JSON.stringify(run, null, 2)}\n`,
		);
		const duplicate = await executeOrchestratedAudit({
			descriptor: createRunDescriptor({
				now: new Date("2026-07-30T00:00:00.000Z"),
			}),
			settings: loadRuntimeSettings({ SEO_AGENT_ENV: "development" }),
			repoRoot: root,
		});
		assert.equal(duplicate.state, "DUPLICATE_RUN");
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
