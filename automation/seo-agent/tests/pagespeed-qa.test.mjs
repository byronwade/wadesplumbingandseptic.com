import test from "node:test";
import assert from "node:assert/strict";
import { makeEvidence } from "../src/contracts.mjs";
import { loadConfig } from "../src/config.mjs";
import { probePageSpeedQaLive } from "../src/probes.mjs";
import {
	collectPageSpeedQaSignals,
	extractPageSpeedQaSignal,
	formatPageSpeedQaForBrief,
	gradePageSpeedQa,
	redactMeasuredUrl,
} from "../src/pagespeed-qa.mjs";

test("redactMeasuredUrl drops query and fragment", () => {
	assert.equal(
		redactMeasuredUrl("https://www.example.com/path?x=1#frag"),
		"https://www.example.com/path",
	);
	assert.equal(redactMeasuredUrl("http://insecure.example/"), null);
});

test("extractPageSpeedQaSignal grades performance and core audits", () => {
	const evidence = makeEvidence({
		runId: "fixture-pagespeed-qa",
		source: "pagespeed",
		scope: "performance-audit:mobile",
		classification: "LIVE_VERIFIED",
		sourceUrlOrTool:
			"https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
		payload: {
			id: "https://www.wadesplumbingandseptic.com/?utm=1",
			lighthouse_version: "12",
			categories: { performance: { score: 0.42 } },
			audits: {
				"largest-contentful-paint": {
					score: 0.4,
					numeric_value: 4_500,
					display_value: "4.5 s",
				},
				"cumulative-layout-shift": {
					score: 0.9,
					numeric_value: 0.05,
					display_value: "0.05",
				},
				"total-blocking-time": {
					score: 0.7,
					numeric_value: 200,
					display_value: "200 ms",
				},
			},
		},
	});
	const signal = extractPageSpeedQaSignal(evidence, {
		strategy: "mobile",
		url: "https://www.wadesplumbingandseptic.com/",
	});
	assert.equal(signal.status, "WARN");
	assert.equal(signal.performance_score, 0.42);
	assert.equal(signal.lcp_ms, 4_500);
	assert.equal(signal.measured_url, "https://www.wadesplumbingandseptic.com/");
	assert.ok(signal.notes.length >= 1);
});

test("gradePageSpeedQa marks severe scores FAIL", () => {
	const grade = gradePageSpeedQa({
		performance_score: 0.2,
		lcp_ms: 7_000,
		cls: 0.5,
	});
	assert.equal(grade.status, "FAIL");
	assert.ok(grade.notes.length >= 2);
});

test("collectPageSpeedQaSignals soft-fails without an adapter", async () => {
	const result = await collectPageSpeedQaSignals({
		pagespeed: null,
		siteUrl: "https://www.wadesplumbingandseptic.com/",
		runId: "pagespeed-qa-soft-fail",
	});
	assert.equal(result.classification, "BLOCKED_MISSING_CREDENTIALS");
	assert.equal(result.signal, null);
});

test("collectPageSpeedQaSignals shapes LIVE_VERIFIED evidence without raw audits", async () => {
	const result = await collectPageSpeedQaSignals({
		pagespeed: {
			async probe() {
				return makeEvidence({
					runId: "pagespeed-qa-live",
					source: "pagespeed",
					scope: "performance-audit:mobile",
					classification: "LIVE_VERIFIED",
					sourceUrlOrTool:
						"https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
					payload: {
						id: "https://www.wadesplumbingandseptic.com/",
						lighthouse_version: "12",
						categories: { performance: { score: 0.81 } },
						audits: {
							"largest-contentful-paint": {
								score: 0.9,
								numeric_value: 1_800,
							},
							"cumulative-layout-shift": {
								score: 1,
								numeric_value: 0.01,
							},
						},
					},
				});
			},
		},
		siteUrl: "https://www.wadesplumbingandseptic.com/",
		runId: "pagespeed-qa-live",
	});
	assert.equal(result.classification, "LIVE_VERIFIED");
	assert.equal(result.signal.status, "PASS");
	assert.equal(result.signal.performance_score, 0.81);
	assert.equal(
		JSON.stringify(result.evidence).includes("largest-contentful-paint"),
		false,
	);
	assert.match(formatPageSpeedQaForBrief(result), /PageSpeed QA \(mobile\)/);
});

test("focused PageSpeed QA live probe stays offline until approval and enablement", async () => {
	const runId = "pagespeed-qa-2026-08-03";
	const offline = await probePageSpeedQaLive({
		registry: {},
		config: loadConfig({}),
		runId,
		execute: false,
	});
	assert.equal(offline.classification, "BLOCKED_MISSING_CREDENTIALS");

	const approved = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_ENABLE_PAGESPEED: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: runId,
		SEO_AGENT_SITE_URL: "https://www.wadesplumbingandseptic.com/",
		PAGESPEED_API_KEY: "fixture-key",
	});
	const live = await probePageSpeedQaLive({
		registry: {
			pagespeed: {
				async probe() {
					return makeEvidence({
						runId,
						source: "pagespeed",
						scope: "performance-audit:mobile",
						classification: "LIVE_VERIFIED",
						sourceUrlOrTool:
							"https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
						payload: {
							id: "https://www.wadesplumbingandseptic.com/",
							categories: { performance: { score: 0.77 } },
							audits: {
								"largest-contentful-paint": {
									score: 0.8,
									numeric_value: 2_200,
								},
								"cumulative-layout-shift": {
									score: 1,
									numeric_value: 0.02,
								},
							},
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
	assert.equal(live.payload.status, "PASS");
	assert.equal(live.payload.performance_score, 0.77);
});
