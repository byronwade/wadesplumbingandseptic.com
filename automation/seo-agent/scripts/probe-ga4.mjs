/**
 * Task 6 focused live probe: GA4 Analytics Data API aggregate sessions read.
 * Requires Production env, SEO_AGENT_ENABLE_GA4=true, GA4_PROPERTY_ID, and an
 * exact SEO_AGENT_LIVE_READS_APPROVED_RUN_ID match. Uses the Google service
 * account when GA4_ACCESS_TOKEN is absent. Does not open PRs or mutate Git.
 */
import { createIntegrationRegistry } from "../src/adapters.mjs";
import { loadConfig, summarizeConfig } from "../src/config.mjs";
import { probeGa4Live } from "../src/probes.mjs";

const execute = process.argv.includes("--execute");
const runIdArgument = process.argv.find((argument) =>
	argument.startsWith("--run-id="),
);
const runId = runIdArgument
	? runIdArgument.slice("--run-id=".length)
	: "ga4-live-probe";

const config = loadConfig();
const summary = summarizeConfig(config);
const evidence = await probeGa4Live({
	registry: createIntegrationRegistry({ config }),
	config,
	runId,
	execute,
});

console.log(
	JSON.stringify(
		{
			mode: execute ? "human-approved-live-read" : "offline-plan-only",
			run_id: runId,
			adapter: "ga4",
			config: summary,
			result: {
				classification: evidence.classification,
				scope: evidence.scope,
				source: evidence.source,
				collected_at: evidence.collected_at,
				payload: {
					property_id: evidence.payload?.property_id ?? null,
					metric: evidence.payload?.metric ?? null,
					date_range: evidence.payload?.date_range ?? null,
					row_count: evidence.payload?.row_count ?? null,
					sessions_total: evidence.payload?.sessions_total ?? null,
					reason: evidence.payload?.reason ?? null,
					next_action: evidence.payload?.next_action ?? null,
				},
			},
		},
		null,
		2,
	),
);

if (execute && evidence.classification !== "LIVE_VERIFIED") {
	process.exitCode = 1;
}
