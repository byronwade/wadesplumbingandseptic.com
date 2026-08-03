/**
 * Task 1 focused live probe: Search Console only.
 * Requires Production env, SEO_AGENT_ENABLE_SEARCH_CONSOLE=true, and an exact
 * SEO_AGENT_LIVE_READS_APPROVED_RUN_ID match. Does not open PRs or mutate Git.
 */
import { createIntegrationRegistry } from "../src/adapters.mjs";
import { loadConfig, summarizeConfig } from "../src/config.mjs";
import { probeSearchConsoleLive } from "../src/probes.mjs";

const execute = process.argv.includes("--execute");
const runIdArgument = process.argv.find((argument) =>
	argument.startsWith("--run-id="),
);
const runId = runIdArgument
	? runIdArgument.slice("--run-id=".length)
	: "search-console-live-probe";

const config = loadConfig();
const summary = summarizeConfig(config);
const evidence = await probeSearchConsoleLive({
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
			adapter: "search_console",
			config: summary,
			result: {
				classification: evidence.classification,
				scope: evidence.scope,
				source: evidence.source,
				collected_at: evidence.collected_at,
				payload: evidence.payload,
			},
		},
		null,
		2,
	),
);

if (execute && evidence.classification !== "LIVE_VERIFIED") {
	process.exitCode = 1;
}
