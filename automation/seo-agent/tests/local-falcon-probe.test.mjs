import test from "node:test";
import assert from "node:assert/strict";
import { createLocalFalconAdapter } from "../src/adapters.mjs";
import { loadConfig } from "../src/config.mjs";
import { makeEvidence } from "../src/contracts.mjs";
import { handleLocalFalconLiveProbe } from "../src/live-probe-http.mjs";
import { probeLocalFalconLive } from "../src/probes.mjs";

const cronSecret = "a-very-long-cron-secret-for-fixture-tests";

test("Local Falcon adapter soft-fails missing credentials and upstream errors", async () => {
	const blocked = await createLocalFalconAdapter({
		enabled: true,
	}).probe({ runId: "lf-blocked" });
	assert.equal(blocked.classification, "BLOCKED_MISSING_CREDENTIALS");

	const failed = await createLocalFalconAdapter({
		enabled: true,
		apiKey: "token",
		fetchImpl: async () => {
			throw new Error("upstream refused");
		},
	}).probe({ runId: "lf-failed" });
	assert.equal(failed.classification, "FAILED");
	assert.equal(failed.payload.reason, "External integration request failed.");
	assert.match(failed.payload.next_action, /LOCAL_FALCON_API_KEY/i);
});

test("focused Local Falcon live probe stays offline until approval and enablement", async () => {
	const runId = "local-falcon-2026-08-03";
	const offline = await probeLocalFalconLive({
		registry: {},
		config: loadConfig({}),
		runId,
		execute: false,
	});
	assert.equal(offline.classification, "BLOCKED_MISSING_CREDENTIALS");

	const approved = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_ENABLE_LOCAL_FALCON: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: runId,
		LOCAL_FALCON_API_KEY: "fixture-token",
	});
	const live = await probeLocalFalconLive({
		registry: {
			local_falcon: {
				async probe() {
					return makeEvidence({
						runId,
						source: "local_falcon",
						scope: "report-read",
						classification: "LIVE_VERIFIED",
						sourceUrlOrTool: "https://api.localfalcon.com/v1/reports/",
						payload: { report_count: 2 },
					});
				},
			},
		},
		config: approved,
		runId,
		execute: true,
	});
	assert.equal(live.classification, "LIVE_VERIFIED");
	assert.equal(live.payload.report_count, 2);
});

test("Local Falcon live probe HTTP route returns LIVE_VERIFIED aggregate payload", async () => {
	const runId = "local-falcon-live-http-2026-08-03";
	const config = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_ENABLE_LOCAL_FALCON: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: runId,
		LOCAL_FALCON_API_KEY: "fixture-token",
	});
	const result = await handleLocalFalconLiveProbe({
		request: {
			url: `https://example.test/_internal/eve/api/live-probe/local-falcon?run_id=${runId}`,
			headers: {
				get(name) {
					return name.toLowerCase() === "authorization"
						? `Bearer ${cronSecret}`
						: null;
				},
			},
		},
		config,
		cronSecret,
		registry: {
			local_falcon: {
				async probe() {
					return makeEvidence({
						runId,
						source: "local_falcon",
						scope: "report-read",
						classification: "LIVE_VERIFIED",
						sourceUrlOrTool: "https://api.localfalcon.com/v1/reports/",
						payload: { report_count: 4 },
					});
				},
			},
		},
	});
	assert.equal(result.ok, true);
	assert.equal(result.status, 200);
	assert.equal(result.body.adapter, "local_falcon");
	assert.equal(result.body.result.payload.report_count, 4);
	assert.equal(JSON.stringify(result.body).includes("fixture-token"), false);
});
