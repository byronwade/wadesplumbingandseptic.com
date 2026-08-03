import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.mjs";
import { makeEvidence } from "../src/contracts.mjs";
import { probeBrowserResearchLive } from "../src/probes.mjs";

test("focused browser research live probe stays offline until approval and enablement", async () => {
	const runId = "browser-research-2026-08-03";
	const offline = await probeBrowserResearchLive({
		registry: {},
		config: loadConfig({}),
		runId,
		execute: false,
	});
	assert.equal(offline.classification, "BLOCKED_MISSING_CREDENTIALS");

	const approved = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_BROWSER_RESEARCH_ENABLED: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: runId,
		SEO_AGENT_SITE_URL: "https://www.wadesplumbingandseptic.com/",
	});
	const live = await probeBrowserResearchLive({
		registry: {
			browser: {
				async probe({ url }) {
					assert.equal(url, "https://www.wadesplumbingandseptic.com/");
					return makeEvidence({
						runId,
						source: "browser-research",
						scope: "public-web-research",
						classification: "LIVE_VERIFIED",
						sourceUrlOrTool: url,
						payload: {
							retrieval_mode: "HTTP_DOCUMENT_FETCH",
							untrusted: true,
							content_hash: "fixture-hash",
							excerpt: "Santa Cruz County fixture excerpt",
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
	assert.equal(live.payload.content_hash, "fixture-hash");
});

test("browser research live probe returns FAILED evidence for upstream adapter errors", async () => {
	const runId = "browser-research-failed-2026-08-03";
	const config = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_BROWSER_RESEARCH_ENABLED: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: runId,
	});
	const failed = await probeBrowserResearchLive({
		registry: {
			browser: {
				async probe() {
					throw new Error(
						"Browser research target is not explicitly approved.",
					);
				},
			},
		},
		config,
		runId,
		execute: true,
	});
	assert.equal(failed.classification, "FAILED");
	assert.match(failed.payload.reason, /not explicitly approved/);
});
