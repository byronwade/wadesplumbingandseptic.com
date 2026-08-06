import test from "node:test";
import assert from "node:assert/strict";
import { createDataForSeoAdapter } from "../src/adapters.mjs";
import { loadConfig } from "../src/config.mjs";
import { makeEvidence } from "../src/contracts.mjs";
import { handleDataForSeoLiveProbe } from "../src/live-probe-http.mjs";
import { probeDataForSeoLive } from "../src/probes.mjs";

const cronSecret = "a-very-long-cron-secret-for-fixture-tests";

function taskResponse(result) {
	return {
		tasks: [{ status_code: 20_000, status_message: "Ok.", result: [result] }],
	};
}

test("DataForSEO adapter soft-fails missing credentials and upstream errors", async () => {
	const blocked = await createDataForSeoAdapter({
		enabled: true,
	}).probe({ runId: "dfs-blocked" });
	assert.equal(blocked.classification, "BLOCKED_MISSING_CREDENTIALS");

	const failed = await createDataForSeoAdapter({
		enabled: true,
		login: "eve@example.com",
		password: "token",
		fetchImpl: async () => {
			throw new Error("upstream refused");
		},
	}).probe({ runId: "dfs-failed" });
	assert.equal(failed.classification, "FAILED");
	assert.equal(failed.payload.reason, "External integration request failed.");
	assert.match(failed.payload.next_action, /DATAFORSEO_LOGIN/i);
});

test("DataForSEO adapter reports a task-level failure as FAILED, not a thrown error", async () => {
	const adapter = createDataForSeoAdapter({
		enabled: true,
		login: "eve@example.com",
		password: "token",
		fetchImpl: async () =>
			new Response(
				JSON.stringify({
					tasks: [{ status_code: 40_202, status_message: "Insufficient funds." }],
				}),
				{ headers: { "content-type": "application/json" } },
			),
	});
	const result = await adapter.probe({ runId: "dfs-task-failed" });
	assert.equal(result.classification, "FAILED");
	assert.equal(result.payload.reason, "Insufficient funds.");
});

test("DataForSEO search volume and backlinks summary shape their payloads", async () => {
	const adapter = createDataForSeoAdapter({
		enabled: true,
		login: "eve@example.com",
		password: "token",
		fetchImpl: async (url) => {
			if (String(url).includes("search_volume")) {
				return new Response(
					JSON.stringify(
						taskResponse({
							keyword: "septic tank pumping santa cruz",
							search_volume: 90,
							competition: "LOW",
							competition_index: 12,
							cpc: 4.5,
						}),
					),
					{ headers: { "content-type": "application/json" } },
				);
			}
			return new Response(
				JSON.stringify(
					taskResponse({
						target: "wadesplumbingandseptic.com",
						backlinks: 120,
						referring_domains: 40,
						referring_main_domains: 38,
						rank: 210,
					}),
				),
				{ headers: { "content-type": "application/json" } },
			);
		},
	});
	const volume = await adapter.searchVolume({
		runId: "dfs-volume",
		keywords: ["septic tank pumping santa cruz"],
	});
	assert.equal(volume.classification, "LIVE_VERIFIED");
	assert.equal(volume.payload.keywords[0].search_volume, 90);

	const backlinks = await adapter.backlinksSummary({
		runId: "dfs-backlinks",
		target: "wadesplumbingandseptic.com",
	});
	assert.equal(backlinks.classification, "LIVE_VERIFIED");
	assert.equal(backlinks.payload.referring_domains, 40);
});

test("focused DataForSEO live probe stays offline until approval and enablement", async () => {
	const runId = "dataforseo-2026-08-06";
	const offline = await probeDataForSeoLive({
		registry: {},
		config: loadConfig({}),
		runId,
		execute: false,
	});
	assert.equal(offline.classification, "BLOCKED_MISSING_CREDENTIALS");

	const approved = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_ENABLE_DATAFORSEO: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: runId,
		DATAFORSEO_LOGIN: "eve@example.com",
		DATAFORSEO_PASSWORD: "fixture-password",
	});
	const live = await probeDataForSeoLive({
		registry: {
			dataforseo: {
				async probe() {
					return makeEvidence({
						runId,
						source: "dataforseo",
						scope: "account-read",
						classification: "LIVE_VERIFIED",
						sourceUrlOrTool: "https://api.dataforseo.com/v3/appendix/user_data",
						payload: { money_left_usd: 42.5 },
					});
				},
			},
		},
		config: approved,
		runId,
		execute: true,
	});
	assert.equal(live.classification, "LIVE_VERIFIED");
	assert.equal(live.payload.money_left_usd, 42.5);
});

test("DataForSEO live probe HTTP route returns LIVE_VERIFIED aggregate payload", async () => {
	const runId = "dataforseo-live-http-2026-08-06";
	const config = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_ENABLE_DATAFORSEO: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: runId,
		DATAFORSEO_LOGIN: "eve@example.com",
		DATAFORSEO_PASSWORD: "fixture-password",
	});
	const result = await handleDataForSeoLiveProbe({
		request: {
			url: `https://example.test/_internal/eve/api/live-probe/dataforseo?run_id=${runId}`,
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
			dataforseo: {
				async probe() {
					return makeEvidence({
						runId,
						source: "dataforseo",
						scope: "account-read",
						classification: "LIVE_VERIFIED",
						sourceUrlOrTool: "https://api.dataforseo.com/v3/appendix/user_data",
						payload: { money_left_usd: 17.25 },
					});
				},
			},
		},
	});
	assert.equal(result.ok, true);
	assert.equal(result.status, 200);
	assert.equal(result.body.adapter, "dataforseo");
	assert.equal(result.body.result.payload.money_left_usd, 17.25);
	assert.equal(
		JSON.stringify(result.body).includes("fixture-password"),
		false,
	);
});
