import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createIntegrationRegistry } from "./adapters.mjs";
import { loadConfig } from "./config.mjs";
import {
	assertBrandContext,
	loadBrandContext,
} from "./brand-context.mjs";
import {
	assertEvidence,
	assertFactRegistry,
	assertPageInventory,
	assertQueryOwnership,
	assertRunManifest,
	assertStateTransition,
	makeEvidence,
	sha256,
} from "./contracts.mjs";
import {
	createNoChangeDecision,
	buildLinkGraph,
	buildTechnicalSeoReport,
	collectPageInventory,
} from "./inventory.mjs";
import { probeReadOnlyIntegrations } from "./probes.mjs";
import { createArtifactProposal } from "./artifacts.mjs";
import { createBlobArtifactArchivePlan } from "./blob-artifacts.mjs";
import { assertIdempotentRun, createRunBudget } from "./run-controls.mjs";
import { collectRecordedRunIds } from "./run-history.mjs";
import { AGENT_SEMANTIC_VERSION, DEFAULT_BUDGETS } from "./constants.mjs";
import { assertSecurityEvent } from "./security-events.mjs";

function fixture(path) {
	return JSON.parse(readFileSync(path, "utf8"));
}

export function createAuditOnlyRun({
	repoRoot,
	runId = "fixture-audit-0001",
	treeHash = "UNCOMMITTED_FIXTURE",
	fixtures = true,
	externalEvidence,
	integrationStatus,
	classification,
	budgetUsage = {},
	budgetLimits = DEFAULT_BUDGETS,
	collectedAt = fixtures ? new Date(0).toISOString() : new Date().toISOString(),
}) {
	const inventory = assertPageInventory(collectPageInventory({ repoRoot }));
	const linkGraph = buildLinkGraph({ repoRoot, inventory });
	const technicalSeo = buildTechnicalSeoReport({ repoRoot, inventory });
	const facts = assertFactRegistry(
		fixture(join(repoRoot, "seo/manifests/approved-facts.json")),
	);
	const brandContext = assertBrandContext(
		loadBrandContext({ repoRoot }) ??
			fixture(join(repoRoot, "seo/manifests/brand-context.json")),
	);
	const ownership = assertQueryOwnership(
		fixture(join(repoRoot, "seo/manifests/query-ownership.json")),
	);
	const evidence =
		externalEvidence ??
		(fixtures
			? fixture(
					join(
						repoRoot,
						"automation/seo-agent/fixtures/research.evidence.json",
					),
				).map((item) => makeEvidence({ ...item, runId, collectedAt }))
			: [
					makeEvidence({
						runId,
						source: "search-console",
						scope: "query-performance",
						classification: "BLOCKED_MISSING_CREDENTIALS",
						sourceUrlOrTool: "configuration-check",
						payload: {
							reason: "No live connector is configured.",
							next_action: "Follow MANUAL_SETUP.md.",
						},
						collectedAt,
					}),
				]);
	evidence.forEach((item) => {
		assertEvidence(item);
		if (item.payload?.event_type === "security_event")
			assertSecurityEvent(item);
	});
	const securityEscalated = evidence.some(
		(item) => item.payload?.event_type === "security_event",
	);
	assertStateTransition("PLANNED", "COLLECTING");
	if (securityEscalated) {
		assertStateTransition("COLLECTING", "SECURITY_ESCALATED");
	} else {
		assertStateTransition("COLLECTING", "ANALYZING");
		assertStateTransition("ANALYZING", "CLOSED");
	}
	const noChange = createNoChangeDecision(inventory);
	const integrationRegistry = createIntegrationRegistry();
	const manifest = {
		schema_version: "1.0",
		semantic_version: AGENT_SEMANTIC_VERSION,
		run_id: runId,
		collected_at: collectedAt,
		source: "eve-seo-agent",
		source_url_or_tool: fixtures ? "fixture:audit-only" : "configuration-check",
		scope: "audit-only",
		redaction: "NO_SECRETS_OR_PERSONAL_DATA",
		retention_class: "VERSIONED_NON_SECRET",
		audit_only: true,
		draft_prs_created: 0,
		content_files_changed: 0,
		tree_hash: treeHash,
		state: securityEscalated ? "SECURITY_ESCALATED" : "CLOSED",
		classification:
			classification ??
			(fixtures ? "MOCK_VERIFIED" : "BLOCKED_MISSING_CREDENTIALS"),
		inventory,
		link_graph: linkGraph,
		technical_seo: technicalSeo,
		query_ownership: ownership,
		approved_facts: facts,
		brand_context: brandContext,
		evidence,
		integration_status:
			integrationStatus ??
			Object.fromEntries(
				Object.keys(integrationRegistry).map((name) => [
					name,
					"BLOCKED_MISSING_CREDENTIALS",
				]),
			),
		decisions: [noChange],
		observability: {
			correlation_id: `audit:${runId}`,
			prompt_hash: sha256("audit-only:no-model-call"),
			skill_hash: sha256("no-skills-loaded"),
			tool_calls: 0,
			model_tokens: 0,
			model_cost_usd: 0,
			model_latency_ms: 0,
			tool_latency_ms: {},
			tool_approvals: [],
			denial_reason: securityEscalated
				? "Untrusted research triggered a security escalation."
				: null,
			error_classification: securityEscalated ? "SECURITY_ESCALATED" : null,
			audit_outcome: securityEscalated ? "SECURITY_ESCALATED" : "NO_CHANGE",
			draft_pr_url: null,
			preview_url: null,
			budget_usage: { ...budgetUsage },
			budget_limits: { ...budgetLimits },
			source_code_sha: treeHash,
			model_identifier: null,
			provider_route: null,
			sandbox_image: null,
			wall_time_ms: 0,
		},
	};
	const validatedManifest = assertRunManifest(manifest);
	return {
		...validatedManifest,
		artifact_proposal: createArtifactProposal(validatedManifest),
	};
}

export async function createConfiguredAuditOnlyRun({
	repoRoot,
	runId = "configured-audit-0001",
	treeHash = "UNCOMMITTED_CONFIGURED",
	config = loadConfig(),
	budget = createRunBudget(),
	registry = createIntegrationRegistry({ config, budget }),
	executeLiveReads = false,
	completedRunIds = [],
}) {
	assertIdempotentRun({ runId, completedRunIds });
	const recordedRunIds = collectRecordedRunIds({ repoRoot });
	assertIdempotentRun({
		runId,
		completedRunIds: [...completedRunIds, ...recordedRunIds],
	});
	budget.consume("maxRunsPerSchedule");
	const integrations = await probeReadOnlyIntegrations({
		registry,
		config,
		runId,
		execute: executeLiveReads,
	});
	const externalEvidence = Object.values(integrations);
	const anyLiveEvidence = externalEvidence.some(
		(item) => item.classification === "LIVE_VERIFIED",
	);
	const run = createAuditOnlyRun({
		repoRoot,
		runId,
		treeHash,
		fixtures: false,
		externalEvidence,
		integrationStatus: Object.fromEntries(
			Object.entries(integrations).map(([name, item]) => [
				name,
				item.classification,
			]),
		),
		classification: anyLiveEvidence
			? "LIVE_VERIFIED"
			: "BLOCKED_MISSING_CREDENTIALS",
		budgetUsage: budget.snapshot(),
	});
	return {
		...run,
		artifact_proposal: {
			...run.artifact_proposal,
			blob_archive: createBlobArtifactArchivePlan({
				bundle: run.artifact_proposal.artifact_bundle,
				config,
			}),
		},
	};
}
