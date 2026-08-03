/**
 * Task 5 focused live probe: allowlisted HTTP browser research only.
 * Requires Production env, browser research enabled, and an exact
 * SEO_AGENT_LIVE_READS_APPROVED_RUN_ID match. Does not open PRs or mutate Git.
 * Browserbase is out of scope for this probe (separate optional credentials).
 */
import { createIntegrationRegistry } from "../src/adapters.mjs";
import { loadConfig, summarizeConfig } from "../src/config.mjs";
import { probeBrowserResearchLive } from "../src/probes.mjs";

const execute = process.argv.includes("--execute");
const runIdArgument = process.argv.find((argument) =>
	argument.startsWith("--run-id="),
);
const runId = runIdArgument
	? runIdArgument.slice("--run-id=".length)
	: "browser-research-live-probe";
const urlArgument = process.argv.find((argument) =>
	argument.startsWith("--url="),
);
const url = urlArgument ? urlArgument.slice("--url=".length) : undefined;

const config = loadConfig();
const summary = summarizeConfig(config);
const evidence = await probeBrowserResearchLive({
	registry: createIntegrationRegistry({ config }),
	config,
	runId,
	execute,
	url,
});

console.log(
	JSON.stringify(
		{
			mode: execute ? "human-approved-live-read" : "offline-plan-only",
			run_id: runId,
			adapter: "browser_research",
			config: summary,
			result: {
				classification: evidence.classification,
				scope: evidence.scope,
				source: evidence.source,
				collected_at: evidence.collected_at,
				payload: {
					retrieval_mode: evidence.payload?.retrieval_mode ?? null,
					untrusted: evidence.payload?.untrusted ?? null,
					content_hash: evidence.payload?.content_hash ?? null,
					excerpt_present: Boolean(evidence.payload?.excerpt),
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
