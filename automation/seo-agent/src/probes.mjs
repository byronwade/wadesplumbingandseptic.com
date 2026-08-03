import { assertEvidence, makeEvidence } from "./contracts.mjs";
import { retryReadOnly } from "./run-controls.mjs";

const READ_ONLY_PROBES = Object.freeze([
	"ai_gateway",
	"github",
	"vercel",
	"search_console",
	"pagespeed",
	"browser",
	"web_search",
	"browser_automation",
	"browserbase",
	"ga4",
	"local_falcon",
	"similarweb",
	"google_trends",
	"business_profile",
	"tracing",
]);

export function assertAuthorizedLiveRead({ config, runId, execute }) {
	if (!execute) return false;
	if (config?.environment !== "production") {
		throw new Error(
			"Refusing live reads outside the production sidecar environment.",
		);
	}
	if (config?.liveReads?.humanApproved !== true) {
		throw new Error(
			"Refusing live reads without SEO_AGENT_LIVE_READS_APPROVED=true set by an authorized human.",
		);
	}
	if (config.liveReads.approvedRunId !== runId) {
		throw new Error(
			"Refusing live reads unless the audit run ID exactly matches SEO_AGENT_LIVE_READS_APPROVED_RUN_ID.",
		);
	}
	return true;
}

/**
 * Focused Search Console live probe used by Task 1. Does not dispatch other
 * adapters, so a Search Console proof cannot be confused with PageSpeed/GA4.
 */
export async function probeSearchConsoleLive({
	registry,
	config,
	runId = "search-console-live-probe",
	execute = false,
} = {}) {
	if (!execute) {
		return makeEvidence({
			runId,
			source: "search-console",
			scope: "site-access",
			classification: "BLOCKED_MISSING_CREDENTIALS",
			sourceUrlOrTool: "search-console-live-probe-disabled",
			payload: {
				reason:
					"Search Console live reads require --execute plus SEO_AGENT_LIVE_READS_APPROVED=true and a matching run ID.",
				next_action:
					"Approve one Production run ID, enable SEO_AGENT_ENABLE_SEARCH_CONSOLE, then rerun with --execute.",
			},
			collectedAt: new Date(0).toISOString(),
		});
	}
	assertAuthorizedLiveRead({ config, runId, execute });
	if (!config?.integrationFlags?.searchConsole) {
		throw new Error(
			"Search Console probe refused because SEO_AGENT_ENABLE_SEARCH_CONSOLE is not true.",
		);
	}
	if (typeof registry?.search_console?.probe !== "function") {
		throw new Error("Search Console probe requires a registry adapter.");
	}
	return assertEvidence(
		await retryReadOnly(() => registry.search_console.probe({ runId })),
	);
}

export async function probeReadOnlyIntegrations({
	registry,
	config,
	runId = "manual-live-probe",
	execute = false,
}) {
	const inputs = {
		ai_gateway: { runId },
		github: { runId },
		vercel: { runId },
		search_console: { runId },
		pagespeed: { runId, url: config.siteUrl },
		browser: { runId, url: config.siteUrl },
		web_search: { runId },
		browser_automation: { runId, url: config.siteUrl },
		browserbase: { runId },
		ga4: { runId },
		local_falcon: { runId },
		similarweb: { runId },
		google_trends: { runId },
		business_profile: { runId },
		tracing: { runId },
	};
	if (!execute) {
		return Object.fromEntries(
			READ_ONLY_PROBES.map((name) => [
				name,
				makeEvidence({
					runId,
					source: name.replace("_", "-"),
					scope: "read-only-probe",
					classification: "BLOCKED_MISSING_CREDENTIALS",
					sourceUrlOrTool: "manual-live-probe-disabled",
					payload: {
						reason:
							"Live reads require the explicit --execute flag and SEO_AGENT_LIVE_READS_APPROVED=true.",
						next_action:
							"Complete MANUAL_SETUP.md and rerun with human approval.",
					},
					collectedAt: new Date(0).toISOString(),
				}),
			]),
		);
	}
	assertAuthorizedLiveRead({ config, runId, execute });
	const results = await Promise.all(
		READ_ONLY_PROBES.map(async (name) => {
			const result = await retryReadOnly(() =>
				registry[name].probe(inputs[name]),
			);
			return [name, assertEvidence(result)];
		}),
	);
	return Object.fromEntries(results);
}
