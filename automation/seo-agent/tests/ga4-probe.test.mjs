import test from "node:test";
import assert from "node:assert/strict";
import { createGa4Adapter, normalizeGa4PropertyId } from "../src/adapters.mjs";
import { loadConfig } from "../src/config.mjs";
import { makeEvidence } from "../src/contracts.mjs";
import { handleGa4LiveProbe } from "../src/live-probe-http.mjs";
import { probeGa4Live } from "../src/probes.mjs";

const cronSecret = "a-very-long-cron-secret-for-fixture-tests";

test("normalizeGa4PropertyId accepts bare and properties/ forms", () => {
	assert.equal(normalizeGa4PropertyId("123456789"), "123456789");
	assert.equal(normalizeGa4PropertyId("properties/123456789"), "123456789");
	assert.equal(normalizeGa4PropertyId(""), null);
	assert.equal(normalizeGa4PropertyId("properties/"), null);
});

test("GA4 adapter soft-fails missing credentials and returns FAILED for upstream errors", async () => {
	const blocked = await createGa4Adapter({
		enabled: true,
		propertyId: "123",
	}).probe({ runId: "ga4-blocked" });
	assert.equal(blocked.classification, "BLOCKED_MISSING_CREDENTIALS");

	const failed = await createGa4Adapter({
		enabled: true,
		accessToken: "token",
		propertyId: "123",
		fetchImpl: async () => {
			throw new Error("upstream refused");
		},
	}).probe({ runId: "ga4-failed" });
	assert.equal(failed.classification, "FAILED");
	// Upstream error text is sanitized; durable next_action steers the owner.
	assert.equal(failed.payload.reason, "External integration request failed.");
	assert.match(
		failed.payload.next_action,
		/Analytics Data API|Viewer|GA4_PROPERTY_ID/i,
	);
});

test("focused GA4 live probe stays offline until approval and enablement", async () => {
	const runId = "ga4-2026-08-03";
	const offline = await probeGa4Live({
		registry: {},
		config: loadConfig({}),
		runId,
		execute: false,
	});
	assert.equal(offline.classification, "BLOCKED_MISSING_CREDENTIALS");

	const approved = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_ENABLE_GA4: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: runId,
		GA4_PROPERTY_ID: "123456789",
		GA4_ACCESS_TOKEN: "fixture-token",
	});
	const live = await probeGa4Live({
		registry: {
			ga4: {
				async probe() {
					return makeEvidence({
						runId,
						source: "ga4",
						scope: "report-read",
						classification: "LIVE_VERIFIED",
						sourceUrlOrTool:
							"https://analyticsdata.googleapis.com/v1beta/properties/123456789:runReport",
						payload: {
							property_id: "123456789",
							metric: "sessions",
							row_count: 3,
							sessions_total: 42,
						},
					});
				},
			},
		},
		config: approved,
		runId,
		execute: true,
	});
	assert.equal(live.classification, "LIVE_VERIFIED");
	assert.equal(live.payload.sessions_total, 42);
});

test("GA4 live probe HTTP route returns LIVE_VERIFIED aggregate payload", async () => {
	const runId = "ga4-live-http-2026-08-03";
	const config = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_ENABLE_GA4: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: runId,
		GA4_PROPERTY_ID: "123456789",
		GA4_ACCESS_TOKEN: "fixture-token",
	});
	const result = await handleGa4LiveProbe({
		request: {
			url: `https://example.test/_internal/eve/api/live-probe/ga4?run_id=${runId}`,
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
			ga4: {
				async probe() {
					return makeEvidence({
						runId,
						source: "ga4",
						scope: "report-read",
						classification: "LIVE_VERIFIED",
						sourceUrlOrTool:
							"https://analyticsdata.googleapis.com/v1beta/properties/123456789:runReport",
						payload: {
							property_id: "123456789",
							metric: "sessions",
							date_range: {
								start_date: "30daysAgo",
								end_date: "4daysAgo",
							},
							row_count: 4,
							sessions_total: 99,
						},
					});
				},
			},
		},
	});
	assert.equal(result.ok, true);
	assert.equal(result.status, 200);
	assert.equal(result.body.adapter, "ga4");
	assert.equal(result.body.result.payload.sessions_total, 99);
	assert.equal(JSON.stringify(result.body).includes("fixture-token"), false);
});
