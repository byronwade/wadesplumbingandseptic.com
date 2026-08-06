/**
 * Task 7a focused live probe: DataForSEO account/balance read.
 * Requires Production env, SEO_AGENT_ENABLE_DATAFORSEO=true,
 * DATAFORSEO_LOGIN + DATAFORSEO_PASSWORD, and an exact
 * SEO_AGENT_LIVE_READS_APPROVED_RUN_ID match.
 * Does not open PRs or mutate Git.
 */
import { createIntegrationRegistry } from "../src/adapters.mjs";
import { loadConfig, summarizeConfig } from "../src/config.mjs";
import { probeDataForSeoLive } from "../src/probes.mjs";

const execute = process.argv.includes("--execute");
const runIdArgument = process.argv.find((argument) =>
	argument.startsWith("--run-id="),
);
const runId = runIdArgument
	? runIdArgument.slice("--run-id=".length)
	: "dataforseo-live-probe";

const config = loadConfig();
const summary = summarizeConfig(config);
const evidence = await probeDataForSeoLive({
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
			adapter: "dataforseo",
			config: summary,
			result: {
				classification: evidence.classification,
				scope: evidence.scope,
				source: evidence.source,
				collected_at: evidence.collected_at,
				payload: {
					money_left_usd: evidence.payload?.money_left_usd ?? null,
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
