import test from "node:test";
import assert from "node:assert/strict";
import {
	authorizeLiveProbeRequest,
	handleSearchConsoleLiveProbe,
} from "../src/live-probe-http.mjs";
import { loadConfig } from "../src/config.mjs";
import { makeEvidence } from "../src/contracts.mjs";

const cronSecret = "a-very-long-cron-secret-for-fixture-tests";

test("live probe HTTP requires cron bearer auth", () => {
	const denied = authorizeLiveProbeRequest({
		authorization: "Bearer wrong",
		cronSecret,
	});
	assert.equal(denied.ok, false);
	assert.equal(denied.status, 401);
	const allowed = authorizeLiveProbeRequest({
		authorization: `Bearer ${cronSecret}`,
		cronSecret,
	});
	assert.equal(allowed.ok, true);
});

test("Search Console live probe route returns LIVE_VERIFIED for an approved run", async () => {
	const runId = "search-console-live-2026-08-03";
	const config = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_ENABLE_SEARCH_CONSOLE: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: runId,
		GOOGLE_SERVICE_ACCOUNT_EMAIL: "eve@example.iam.gserviceaccount.com",
		GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY:
			"-----BEGIN PRIVATE KEY-----\nfixture\n-----END PRIVATE KEY-----",
	});
	const result = await handleSearchConsoleLiveProbe({
		request: {
			url: `https://example.test/_internal/eve/api/live-probe/search-console?run_id=${runId}`,
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
			search_console: {
				async probe() {
					return makeEvidence({
						runId,
						source: "search-console",
						scope: "site-access",
						classification: "LIVE_VERIFIED",
						sourceUrlOrTool: "https://www.googleapis.com/webmasters/v3/sites",
						payload: {
							sites: [
								{
									site_url_hash: "hashed-site",
									permission_level: "siteRestrictedUser",
								},
							],
						},
					});
				},
			},
		},
	});
	assert.equal(result.ok, true);
	assert.equal(result.status, 200);
	assert.equal(result.body.result.classification, "LIVE_VERIFIED");
	assert.equal(
		result.body.result.payload.sites[0].permission_level,
		"siteRestrictedUser",
	);
	assert.equal(
		JSON.stringify(result.body).includes("BEGIN PRIVATE KEY"),
		false,
	);
});

test("Search Console live probe route refuses mismatched run IDs", async () => {
	const config = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_ENABLE_SEARCH_CONSOLE: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: "search-console-live-2026-08-03",
	});
	const result = await handleSearchConsoleLiveProbe({
		request: {
			url: "https://example.test/_internal/eve/api/live-probe/search-console?run_id=other-run",
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
			search_console: {
				async probe() {
					throw new Error("must not dispatch");
				},
			},
		},
	});
	assert.equal(result.ok, false);
	assert.equal(result.status, 403);
	assert.match(result.body.message, /exactly matches/);
});
