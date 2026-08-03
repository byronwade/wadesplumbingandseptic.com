/**
 * Task 4 focused live probe: PageSpeed draft/preview QA signal shaping.
 * Requires Production env, SEO_AGENT_ENABLE_PAGESPEED=true, and an exact
 * SEO_AGENT_LIVE_READS_APPROVED_RUN_ID match. Does not open PRs or mutate Git.
 */
import { createIntegrationRegistry } from "../src/adapters.mjs";
import { loadConfig, summarizeConfig } from "../src/config.mjs";
import { probePageSpeedQaLive } from "../src/probes.mjs";

const execute = process.argv.includes("--execute");
const runIdArgument = process.argv.find((argument) =>
	argument.startsWith("--run-id="),
);
const runId = runIdArgument
	? runIdArgument.slice("--run-id=".length)
	: "pagespeed-qa-live-probe";
const strategyArgument = process.argv.find((argument) =>
	argument.startsWith("--strategy="),
);
const strategy = strategyArgument
	? strategyArgument.slice("--strategy=".length)
	: "mobile";
const urlArgument = process.argv.find((argument) =>
	argument.startsWith("--url="),
);
const url = urlArgument ? urlArgument.slice("--url=".length) : undefined;

const config = loadConfig();
const summary = summarizeConfig(config);
const evidence = await probePageSpeedQaLive({
	registry: createIntegrationRegistry({ config }),
	config,
	runId,
	execute,
	url,
	strategy,
});

console.log(
	JSON.stringify(
		{
			mode: execute ? "human-approved-live-read" : "offline-plan-only",
			run_id: runId,
			adapter: "pagespeed_qa",
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
