import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { assertBrandContext } from "../src/brand-context.mjs";
import {
	assertEvidence,
	assertFactRegistry,
	assertIntegrationInventory,
	assertOpportunityBacklog,
	assertPageInventory,
	assertQueryOwnership,
	assertRouteMap,
} from "../src/contracts.mjs";
import {
	buildLinkGraph,
	buildRedirectManifest,
	buildRouteMap,
	buildTechnicalSeoReport,
	collectPageInventory,
} from "../src/inventory.mjs";

const root = resolve(import.meta.dirname, "../../..");
const required = [
	"automation/seo-agent/package.json",
	"automation/seo-agent/package-lock.json",
	"vercel.json",
	"docs/seo-agent/vercel.services.example.json",
	"automation/seo-agent/.env.example",
	"automation/seo-agent/.prettierignore",
	"automation/seo-agent/eslint.config.mjs",
	"automation/seo-agent/agent/agent.ts",
	"automation/seo-agent/src/workflows/audit.ts",
	"automation/seo-agent/src/runtime.mjs",
	"automation/seo-agent/src/sandbox-integration.mjs",
	"automation/seo-agent/src/work-packets.mjs",
	"automation/seo-agent/evals/evals.config.ts",
	"automation/seo-agent/evals/audit-only.eval.ts",
	"automation/seo-agent/evals/policy-refusals.eval.ts",
	"automation/seo-agent/evals/content-policy.eval.ts",
	"automation/seo-agent/scripts/run-evals.mjs",
	"automation/seo-agent/scripts/run-sandbox-integration.mjs",
	"automation/seo-agent/scripts/record-offline-provenance.mjs",
	"automation/seo-agent/scripts/verify-self-hosted-runner.mjs",
	"automation/seo-agent/ci/self-hosted-runner-policy.json",
	".github/workflows/seo-agent-offline.yml",
	"automation/seo-agent/src/config.mjs",
	"automation/seo-agent/src/source-policy.mjs",
	"automation/seo-agent/src/publishing-lifecycle.mjs",
	"automation/seo-agent/src/probes.mjs",
	"automation/seo-agent/src/security-events.mjs",
	"automation/seo-agent/src/independent-review.mjs",
	"automation/seo-agent/src/rollback.mjs",
	"automation/seo-agent/src/operational-observability.mjs",
	"automation/seo-agent/fixtures/adversarial-policy.json",
	"automation/seo-agent/fixtures/content-policy-evals.json",
	"automation/seo-agent/scripts/run-rollback-drill.mjs",
	"automation/seo-agent/scripts/independent-review.mjs",
	"automation/seo-agent/scripts/probe-integrations.mjs",
	"automation/seo-agent/scripts/run-publishing-lifecycle.mjs",
	"automation/seo-agent/scripts/operational-readiness.mjs",
	"automation/seo-agent/scripts/health-smoke.mjs",
	"automation/seo-agent/scripts/security-scan.mjs",
	"automation/seo-agent/agent/schedules/audit.ts",
	"automation/seo-agent/agent/channels/runtime.ts",
	"automation/seo-agent/agent/tools/orchestrate.ts",
	"seo/manifests/approved-facts.json",
	"seo/manifests/brand-context.json",
	"seo/manifests/integration-inventory.json",
	"seo/manifests/opportunity-backlog.json",
	"seo/manifests/query-ownership.json",
	"seo/manifests/pages.json",
	"seo/manifests/route-map.json",
	"seo/manifests/link-graph.json",
	"seo/manifests/experiments.json",
	"seo/manifests/technical-seo.json",
	"seo/manifests/change-manifest.schema.json",
	"seo/manifests/redirects.json",
	"docs/seo-agent/OPERATIONS.md",
	"docs/seo-agent/THREAT_MODEL.md",
	"docs/seo-agent/SOURCE_POLICY.md",
];
const missing = required.filter((path) => !existsSync(resolve(root, path)));
if (missing.length)
	throw new Error(
		`Missing required sidecar artifact(s): ${missing.join(", ")}`,
	);

const parse = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));
assertFactRegistry(parse("seo/manifests/approved-facts.json"));
assertBrandContext(parse("seo/manifests/brand-context.json"));
assertIntegrationInventory(parse("seo/manifests/integration-inventory.json"));
assertOpportunityBacklog(parse("seo/manifests/opportunity-backlog.json"));
const evidenceRoot = resolve(root, "seo/evidence");
for (const file of readdirSync(evidenceRoot).filter((name) =>
	name.endsWith(".json"),
))
	assertEvidence(JSON.parse(readFileSync(resolve(evidenceRoot, file), "utf8")));
assertQueryOwnership(parse("seo/manifests/query-ownership.json"));
const expectedInventory = collectPageInventory({ repoRoot: root });
assertPageInventory(expectedInventory);
const savedInventory = assertPageInventory(parse("seo/manifests/pages.json"));
if (
	JSON.stringify(savedInventory.pages) !==
	JSON.stringify(expectedInventory.pages)
) {
	throw new Error(
		"seo/manifests/pages.json is stale; run npm run seo-agent:inventory from the repository root.",
	);
}
const expectedRouteMap = buildRouteMap({
	repoRoot: root,
	inventory: expectedInventory,
});
const savedRouteMap = assertRouteMap(parse("seo/manifests/route-map.json"));
if (JSON.stringify(savedRouteMap) !== JSON.stringify(expectedRouteMap))
	throw new Error(
		"seo/manifests/route-map.json is stale; run npm run seo-agent:inventory from the repository root.",
	);
const expectedGraph = buildLinkGraph({
	repoRoot: root,
	inventory: expectedInventory,
});
const savedGraph = parse("seo/manifests/link-graph.json");
if (JSON.stringify(savedGraph) !== JSON.stringify(expectedGraph))
	throw new Error(
		"seo/manifests/link-graph.json is stale; regenerate the inventory.",
	);
const expectedTechnicalSeo = buildTechnicalSeoReport({
	repoRoot: root,
	inventory: expectedInventory,
});
const savedTechnicalSeo = parse("seo/manifests/technical-seo.json");
if (JSON.stringify(savedTechnicalSeo) !== JSON.stringify(expectedTechnicalSeo))
	throw new Error(
		"seo/manifests/technical-seo.json is stale; regenerate the inventory.",
	);
const expectedRedirects = buildRedirectManifest({ repoRoot: root });
const savedRedirects = parse("seo/manifests/redirects.json");
if (JSON.stringify(savedRedirects) !== JSON.stringify(expectedRedirects))
	throw new Error(
		"seo/manifests/redirects.json is stale; regenerate the inventory.",
	);
console.log(
	`Sidecar contracts verified (${savedInventory.pages.length} pages, ${savedRouteMap.routes.filter((route) => route.kind === "DYNAMIC_RUNTIME_DATA").length} dynamic route patterns, ${savedGraph.edges.length} links, ${savedTechnicalSeo.findings.length} technical findings).`,
);
