import test from "node:test";
import assert from "node:assert/strict";
import { createSearchConsoleAdapter } from "../src/adapters.mjs";
import { BLOG_TOPIC_CATALOG } from "../src/blog-opportunity.mjs";
import { makeEvidence } from "../src/contracts.mjs";
import {
	applySearchConsoleSignalsToCatalog,
	buildTopicSignalsFromRawRows,
	candidateSearchConsoleSiteUrls,
	collectSearchConsoleTopicSignals,
	matchTopicToSearchConsoleQuery,
	searchConsoleScoreBonus,
} from "../src/search-console-topics.mjs";
import { probeSearchConsoleTopicsLive } from "../src/probes.mjs";
import { loadConfig } from "../src/config.mjs";

const topic = BLOG_TOPIC_CATALOG[0];

test("Search Console site URL candidates cover domain and www forms", () => {
	const urls = candidateSearchConsoleSiteUrls(
		"https://www.wadesplumbingandseptic.com/",
	);
	assert.ok(urls.includes("sc-domain:wadesplumbingandseptic.com"));
	assert.ok(urls.includes("https://wadesplumbingandseptic.com/"));
});

test("topic matching prefers exact query clusters and local partial overlaps", () => {
	const exact = matchTopicToSearchConsoleQuery(topic, topic.query_cluster);
	assert.equal(exact?.strength, "exact");
	const strong = matchTopicToSearchConsoleQuery(
		topic,
		"tankless water heater maintenance santa cruz county",
	);
	assert.ok(["strong", "partial", "exact"].includes(strong?.strength));
	assert.equal(
		matchTopicToSearchConsoleQuery(topic, "unrelated national plumbing tip"),
		null,
	);
});

test("raw row matching builds redacted score bonuses without retaining query text", () => {
	const signals = buildTopicSignalsFromRawRows(BLOG_TOPIC_CATALOG, [
		{
			keys: [topic.query_cluster],
			clicks: 8,
			impressions: 120,
			ctr: 0.06,
			position: 12,
		},
	]);
	const matched = signals.find((signal) => signal.topic_id === topic.id);
	assert.ok(matched);
	assert.equal(matched.strength, "exact");
	assert.ok(matched.score_bonus >= 3);
	assert.equal(JSON.stringify(signals).includes(topic.query_cluster), false);
	assert.ok(searchConsoleScoreBonus(matched) <= 6);
});

test("catalog application soft-boosts matched topics only", () => {
	const boosted = applySearchConsoleSignalsToCatalog(BLOG_TOPIC_CATALOG, [
		{
			topic_id: topic.id,
			strength: "exact",
			clicks: 8,
			impressions: 120,
			position: 12,
			score_bonus: 5,
		},
	]);
	const matched = boosted.find((entry) => entry.id === topic.id);
	const other = boosted.find((entry) => entry.id !== topic.id);
	assert.equal(matched.score_bonus, 5);
	assert.equal(matched.gsc_signal.clicks, 8);
	assert.equal(other.gsc_signal, undefined);
});

test("collectSearchConsoleTopicSignals soft-fails without an adapter", async () => {
	const result = await collectSearchConsoleTopicSignals({
		searchConsole: null,
		siteUrl: "https://www.wadesplumbingandseptic.com/",
		runId: "gsc-topics-offline",
		catalog: BLOG_TOPIC_CATALOG,
	});
	assert.equal(result.classification, "BLOCKED_MISSING_CREDENTIALS");
	assert.equal(result.signals.length, 0);
});

test("Search Console adapter queryTopicSignals matches then redacts", async () => {
	const adapter = createSearchConsoleAdapter({
		apiKey: undefined,
		accessToken: "fixture-token",
		fetchImpl: async () => ({
			ok: true,
			status: 200,
			headers: { get: () => null },
			async json() {
				return {
					rows: [
						{
							keys: [topic.query_cluster],
							clicks: 4,
							impressions: 40,
							ctr: 0.1,
							position: 9,
						},
					],
				};
			},
		}),
	});
	const result = await adapter.queryTopicSignals({
		runId: "gsc-topic-adapter",
		siteUrl: "https://www.wadesplumbingandseptic.com/",
		catalog: BLOG_TOPIC_CATALOG,
		request: {
			startDate: "2026-07-01",
			endDate: "2026-07-28",
			dimensions: ["query"],
			rowLimit: 100,
		},
		now: new Date("2026-08-01T00:00:00.000Z"),
	});
	assert.equal(result.classification, "LIVE_VERIFIED");
	assert.equal(result.signals[0].topic_id, topic.id);
	assert.equal(
		JSON.stringify(result.evidence).includes(topic.query_cluster),
		false,
	);
	assert.equal(
		JSON.stringify(result.evidence).includes("fixture-token"),
		false,
	);
});

test("focused topic live probe stays offline until approval and enablement", async () => {
	const runId = "search-console-topics-2026-08-03";
	const offline = await probeSearchConsoleTopicsLive({
		registry: {},
		config: loadConfig({}),
		runId,
		execute: false,
	});
	assert.equal(offline.classification, "BLOCKED_MISSING_CREDENTIALS");

	const approved = loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_ENABLE_SEARCH_CONSOLE: "true",
		SEO_AGENT_LIVE_READS_APPROVED: "true",
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: runId,
		GOOGLE_SERVICE_ACCOUNT_EMAIL: "eve@example.iam.gserviceaccount.com",
		GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY:
			"-----BEGIN PRIVATE KEY-----\nfixture\n-----END PRIVATE KEY-----",
		SEARCH_CONSOLE_ACCESS_TOKEN: "fixture-token",
	});
	const live = await probeSearchConsoleTopicsLive({
		registry: {
			search_console: {
				async queryTopicSignals() {
					return {
						classification: "LIVE_VERIFIED",
						signals: [
							{
								topic_id: topic.id,
								strength: "exact",
								clicks: 2,
								impressions: 20,
								score_bonus: 3,
							},
						],
						evidence: makeEvidence({
							runId,
							source: "search-console",
							scope: "topic-signals",
							classification: "LIVE_VERIFIED",
							sourceUrlOrTool: "https://www.googleapis.com/webmasters/v3/sites",
							payload: {
								matched_topic_count: 1,
								signals: [{ topic_id: topic.id, score_bonus: 3 }],
							},
						}),
					};
				},
			},
		},
		config: approved,
		runId,
		execute: true,
	});
	assert.equal(live.classification, "LIVE_VERIFIED");
	assert.equal(live.payload.matched_topic_count, 1);
});
