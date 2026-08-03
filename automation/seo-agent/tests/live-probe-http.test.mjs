import test from "node:test";
import assert from "node:assert/strict";
import {
	authorizeLiveProbeRequest,
	handleBrowserResearchLiveProbe,
	handlePageSpeedLiveProbe,
	handlePageSpeedQaLiveProbe,
	handleSearchConsoleLiveProbe,
	handleSearchConsoleTopicsLiveProbe,
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

test("Search Console live probe can use the approved run ID when query is omitted", async () => {
	const runId = "search-console-live-2026-08-03";
	const config = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_ENABLE_SEARCH_CONSOLE: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: runId,
	});
	const result = await handleSearchConsoleLiveProbe({
		request: {
			url: "https://example.test/_internal/eve/api/live-probe/search-console",
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
				async probe({ runId: requested }) {
					assert.equal(requested, runId);
					return makeEvidence({
						runId,
						source: "search-console",
						scope: "site-access",
						classification: "LIVE_VERIFIED",
						sourceUrlOrTool: "https://www.googleapis.com/webmasters/v3/sites",
						payload: { sites: [] },
					});
				},
			},
		},
	});
	assert.equal(result.ok, true);
	assert.equal(result.body.run_id, runId);
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

test("PageSpeed live probe route returns LIVE_VERIFIED for an approved run", async () => {
	const runId = "pagespeed-live-2026-08-03";
	const config = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_ENABLE_PAGESPEED: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: runId,
		PAGESPEED_API_KEY: "fixture-pagespeed-key",
	});
	const result = await handlePageSpeedLiveProbe({
		request: {
			url: `https://example.test/_internal/eve/api/live-probe/pagespeed?run_id=${runId}`,
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
			pagespeed: {
				async probe({ url, strategy }) {
					assert.equal(url, "https://www.wadesplumbingandseptic.com/");
					assert.equal(strategy, "mobile");
					return makeEvidence({
						runId,
						source: "pagespeed",
						scope: "performance-audit:mobile",
						classification: "LIVE_VERIFIED",
						sourceUrlOrTool:
							"https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
						payload: {
							id: url,
							categories: { performance: { score: 0.88 } },
						},
					});
				},
			},
		},
	});
	assert.equal(result.ok, true);
	assert.equal(result.status, 200);
	assert.equal(result.body.adapter, "pagespeed");
	assert.equal(result.body.result.classification, "LIVE_VERIFIED");
	assert.equal(result.body.result.payload.categories.performance.score, 0.88);
	assert.equal(
		JSON.stringify(result.body).includes("fixture-pagespeed-key"),
		false,
	);
});

test("PageSpeed live probe can use the approved run ID when query is omitted", async () => {
	const runId = "pagespeed-live-2026-08-03";
	const config = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_ENABLE_PAGESPEED: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: runId,
		PAGESPEED_API_KEY: "fixture-pagespeed-key",
	});
	const result = await handlePageSpeedLiveProbe({
		request: {
			url: "https://example.test/_internal/eve/api/live-probe/pagespeed",
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
			pagespeed: {
				async probe({ runId: requested }) {
					assert.equal(requested, runId);
					return makeEvidence({
						runId,
						source: "pagespeed",
						scope: "performance-audit:mobile",
						classification: "LIVE_VERIFIED",
						sourceUrlOrTool:
							"https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
						payload: { categories: { performance: { score: 0.7 } } },
					});
				},
			},
		},
	});
	assert.equal(result.ok, true);
	assert.equal(result.body.run_id, runId);
});

test("PageSpeed live probe route refuses mismatched run IDs", async () => {
	const config = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_ENABLE_PAGESPEED: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: "pagespeed-live-2026-08-03",
	});
	const result = await handlePageSpeedLiveProbe({
		request: {
			url: "https://example.test/_internal/eve/api/live-probe/pagespeed?run_id=other-run",
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
			pagespeed: {
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

test("Search Console topics live probe route returns LIVE_VERIFIED for an approved run", async () => {
	const runId = "search-console-topics-live-http-2026-08-03";
	const config = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_ENABLE_SEARCH_CONSOLE: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: runId,
		GOOGLE_SERVICE_ACCOUNT_EMAIL: "eve@example.iam.gserviceaccount.com",
		GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY:
			"-----BEGIN PRIVATE KEY-----\nfixture\n-----END PRIVATE KEY-----",
	});
	const result = await handleSearchConsoleTopicsLiveProbe({
		request: {
			url: `https://example.test/_internal/eve/api/live-probe/search-console-topics?run_id=${runId}`,
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
				async queryTopicSignals() {
					return {
						classification: "LIVE_VERIFIED",
						signals: Object.freeze([]),
						evidence: makeEvidence({
							runId,
							source: "search-console",
							scope: "topic-signals",
							classification: "LIVE_VERIFIED",
							sourceUrlOrTool: "https://www.googleapis.com/webmasters/v3/sites",
							payload: { matched_topic_count: 0, signals: [] },
						}),
					};
				},
			},
		},
	});
	assert.equal(result.ok, true);
	assert.equal(result.status, 200);
	assert.equal(result.body.adapter, "search_console_topics");
	assert.equal(result.body.result.classification, "LIVE_VERIFIED");
});

test("PageSpeed QA live probe route returns LIVE_VERIFIED for an approved run", async () => {
	const runId = "pagespeed-qa-live-http-2026-08-03";
	const config = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_ENABLE_PAGESPEED: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: runId,
		PAGESPEED_API_KEY: "fixture-pagespeed-key",
		SEO_AGENT_SITE_URL: "https://www.wadesplumbingandseptic.com/",
	});
	const result = await handlePageSpeedQaLiveProbe({
		request: {
			url: `https://example.test/_internal/eve/api/live-probe/pagespeed-qa?run_id=${runId}`,
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
							categories: { performance: { score: 0.8 } },
							audits: {
								"largest-contentful-paint": {
									score: 0.9,
									numeric_value: 1_900,
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
		},
	});
	assert.equal(result.ok, true);
	assert.equal(result.status, 200);
	assert.equal(result.body.adapter, "pagespeed_qa");
	assert.equal(result.body.result.classification, "LIVE_VERIFIED");
	assert.equal(result.body.result.payload.status, "PASS");
	assert.equal(
		JSON.stringify(result.body).includes("largest-contentful-paint"),
		false,
	);
});

test("Browser research live probe route returns LIVE_VERIFIED without HTML excerpt", async () => {
	const runId = "browser-research-live-2026-08-03";
	const config = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_BROWSER_RESEARCH_ENABLED: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: runId,
		SEO_AGENT_SITE_URL: "https://www.wadesplumbingandseptic.com/",
	});
	const result = await handleBrowserResearchLiveProbe({
		request: {
			url: `https://example.test/_internal/eve/api/live-probe/browser-research?run_id=${runId}`,
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
							content_hash: "abc123",
							excerpt: "<html>secret-fixture-body</html>",
						},
					});
				},
			},
		},
	});
	assert.equal(result.ok, true);
	assert.equal(result.status, 200);
	assert.equal(result.body.adapter, "browser_research");
	assert.equal(result.body.result.payload.excerpt_present, true);
	assert.equal(result.body.result.payload.content_hash, "abc123");
	assert.equal(
		JSON.stringify(result.body).includes("secret-fixture-body"),
		false,
	);
});
