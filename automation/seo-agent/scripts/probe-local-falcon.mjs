/**
 * Task 7 focused live probe: Local Falcon report-list read.
 * Requires Production env, SEO_AGENT_ENABLE_LOCAL_FALCON=true,
 * LOCAL_FALCON_API_KEY, and an exact SEO_AGENT_LIVE_READS_APPROVED_RUN_ID match.
 * Does not open PRs or mutate Git.
 */
import { createIntegrationRegistry } from "../src/adapters.mjs";
import { loadConfig, summarizeConfig } from "../src/config.mjs";
import { probeLocalFalconLive } from "../src/probes.mjs";

const execute = process.argv.includes("--execute");
const runIdArgument = process.argv.find((argument) =>
	argument.startsWith("--run-id="),
);
const runId = runIdArgument
	? runIdArgument.slice("--run-id=".length)
	: "local-falcon-live-probe";

const config = loadConfig();
const summary = summarizeConfig(config);
const evidence = await probeLocalFalconLive({
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
			adapter: "local_falcon",
			config: summary,
			result: {
				classification: evidence.classification,
				scope: evidence.scope,
				source: evidence.source,
				collected_at: evidence.collected_at,
				payload: {
					report_count: evidence.payload?.report_count ?? null,
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
