/**
 * Task 3 focused live probe: Search Console topic signals only.
 */
import { createIntegrationRegistry } from "../src/adapters.mjs";
import { loadConfig, summarizeConfig } from "../src/config.mjs";
import { probeSearchConsoleTopicsLive } from "../src/probes.mjs";

const execute = process.argv.includes("--execute");
const runIdArgument = process.argv.find((argument) =>
	argument.startsWith("--run-id="),
);
const runId = runIdArgument
	? runIdArgument.slice("--run-id=".length)
	: "search-console-topics-live-probe";

const config = loadConfig();
const summary = summarizeConfig(config);
const evidence = await probeSearchConsoleTopicsLive({
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
			adapter: "search_console_topics",
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
