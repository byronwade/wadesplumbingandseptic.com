import test from "node:test";
import assert from "node:assert/strict";
import {
	assertEvidence,
	assertIntegrationInventory,
	assertNoUnsupportedServiceArea,
	assertOpportunityBacklog,
	assertPageInventory,
	assertRouteMap,
	assertRunManifest,
	makeEvidence,
	sha256,
} from "../src/contracts.mjs";
import {
	assertArtifactBundle,
	buildRunArtifactBundle,
} from "../src/artifacts.mjs";
import {
	scoreOpportunity,
	validateMarkdownDraft,
	validateProposal,
} from "../src/strategy.mjs";
import {
	assessPreviewAudit,
	assessProductionAudit,
} from "../src/quality-gates.mjs";
import {
	buildRouteMap,
	buildTechnicalSeoReport,
	collectPageInventory,
} from "../src/inventory.mjs";
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

test("native Eve eval timeout remains bounded and agrees with its CLI wrapper", () => {
	const root = resolve(import.meta.dirname, "..");
	const config = readFileSync(join(root, "evals", "evals.config.ts"), "utf8");
	const runner = readFileSync(join(root, "scripts", "run-evals.mjs"), "utf8");
	assert.match(config, /timeoutMs: 30000/);
	assert.match(runner, /"--timeout", "30000"/);
});

test("duplicate canonical routes are rejected", () => {
	assert.throws(
		() =>
			assertPageInventory({
				schema_version: "1.0",
				pages: [
					{
						url: "/",
						source_path: "a",
						canonical_url: "https://example.test/",
						lifecycle: "EXISTING_UNMIGRATED",
					},
					{
						url: "/",
						source_path: "b",
						canonical_url: "https://example.test/",
						lifecycle: "EXISTING_UNMIGRATED",
					},
				],
			}),
		/Duplicate page URL/,
	);
});

test("route map distinguishes Markdown content paths from dynamic fallback patterns", () => {
	const repoRoot = resolve(import.meta.dirname, "../../..");
	const inventory = collectPageInventory({ repoRoot });
	const routeMap = assertRouteMap(buildRouteMap({ repoRoot, inventory }));
	const service = routeMap.routes.find(
		(route) => route.route_pattern === "/service-offerings/hydro-jetting",
	);
	const fallback = routeMap.routes.find((route) => route.parameters.length > 0);
	assert.equal(service.kind, "STATIC_ROUTE");
	assert.deepEqual(service.materialized_routes, [
		"/service-offerings/hydro-jetting",
	]);
	assert.equal(fallback.kind, "DYNAMIC_RUNTIME_DATA");
	assert.deepEqual(fallback.materialized_routes, []);
	assert.equal(fallback.classification, "BLOCKED_MISSING_CREDENTIALS");
	assert.throws(
		() =>
			assertRouteMap({
				...routeMap,
				routes: [{ ...fallback, kind: "STATIC_ROUTE" }],
			}),
		/Static route map record is inconsistent/,
	);
});

test("evidence must be classified and cannot contain a secret", () => {
	assert.throws(
		() =>
			assertEvidence({
				schema_version: "1.0",
				run_id: "x",
				collected_at: "2026-01-01T00:00:00.000Z",
				source: "fixture",
				source_url_or_tool: "fixture",
				scope: "test",
				classification: "MOCK_VERIFIED",
				redaction: "none",
				retention_class: "test",
				sha256: "x",
				payload: { token: "ghp_123456789012345678901234567890" },
			}),
		/secret-like/,
	);
});

test("records reject malformed retrieval timestamps", () => {
	assert.throws(
		() =>
			assertEvidence({
				schema_version: "1.0",
				run_id: "x",
				collected_at: "not-a-time",
				source: "fixture",
				source_url_or_tool: "fixture",
				scope: "test",
				classification: "MOCK_VERIFIED",
				redaction: "none",
				retention_class: "test",
				sha256: sha256({}),
				payload: {},
			}),
		/invalid collected_at/,
	);
});

test("evidence hashes and opportunity backlog publication blocks are enforced", () => {
	const payload = { finding: "fixture" };
	assert.equal(
		assertEvidence({
			schema_version: "1.0",
			run_id: "x",
			collected_at: "2026-01-01T00:00:00.000Z",
			source: "fixture",
			source_url_or_tool: "fixture",
			scope: "test",
			classification: "MOCK_VERIFIED",
			redaction: "none",
			retention_class: "test",
			sha256: sha256(payload),
			payload,
		}).payload.finding,
		"fixture",
	);
	assert.throws(
		() =>
			assertEvidence({
				schema_version: "1.0",
				run_id: "x",
				collected_at: "2026-01-01T00:00:00.000Z",
				source: "fixture",
				source_url_or_tool: "fixture",
				scope: "test",
				classification: "MOCK_VERIFIED",
				redaction: "none",
				retention_class: "test",
				sha256: "wrong",
				payload,
			}),
		/hash/,
	);
	assert.throws(
		() =>
			assertOpportunityBacklog({
				schema_version: "1.0",
				classification: "MOCK_VERIFIED",
				opportunities: [
					{
						id: "x",
						state: "RESEARCH_ONLY_PENDING_HUMAN_APPROVAL",
						intent_hypotheses: ["informational"],
						evidence_ids: ["x"],
						query_owner: "/bad",
						new_url_allowed: true,
						publication_blocker: "",
					},
				],
			}),
		/publication-blocked/,
	);
});

test("run artifact bundles are canonical, Git-path scoped, and reject unsafe paths", () => {
	const manifest = {
		schema_version: "1.0",
		semantic_version: "0.1.0",
		run_id: "fixture-artifact-001",
		collected_at: new Date(0).toISOString(),
		source: "fixture",
		scope: "audit-only",
		classification: "MOCK_VERIFIED",
		redaction: "NO_SECRETS_OR_PERSONAL_DATA",
		retention_class: "VERSIONED_NON_SECRET",
		audit_only: true,
		draft_prs_created: 0,
		content_files_changed: 0,
		tree_hash: "fixture-tree",
		state: "CLOSED",
		observability: {
			correlation_id: "fixture:artifact",
			prompt_hash: sha256("fixture"),
			skill_hash: sha256("fixture-skills"),
			tool_calls: 0,
			model_tokens: 0,
			model_cost_usd: 0,
			model_latency_ms: 0,
			tool_latency_ms: {},
			tool_approvals: [],
			denial_reason: null,
			error_classification: null,
			audit_outcome: "NO_CHANGE",
			draft_pr_url: null,
			preview_url: null,
			budget_usage: {},
			budget_limits: { maxExternalRequests: 30 },
			source_code_sha: "fixture-tree",
		},
		evidence: [
			makeEvidence({
				runId: "fixture-artifact-001",
				source: "fixture-source",
				scope: "fixture",
				payload: { safe: true },
			}),
		],
	};
	const bundle = buildRunArtifactBundle(manifest);
	assert.equal(assertArtifactBundle(bundle).files.length, 2);
	assert.throws(
		() =>
			assertRunManifest({
				...manifest,
				observability: {
					...manifest.observability,
					preview_url: "http://unsafe.test",
				},
			}),
		/preview_url must be null or an HTTPS URL/,
	);
	assert.throws(
		() =>
			assertRunManifest({
				...manifest,
				observability: {
					...manifest.observability,
					tool_approvals: [{ tool: "github", outcome: "BYPASSED" }],
				},
			}),
		/tool approval contains an invalid value/,
	);
	assert.throws(
		() =>
			assertArtifactBundle({
				...bundle,
				files: [{ ...bundle.files[0], path: "seo/runs/../main.json" }],
			}),
		/Unsafe/,
	);
});

test("unapproved service areas are rejected", () => {
	assert.throws(
		() =>
			assertNoUnsupportedServiceArea(
				{ service_areas: ["Santa Cruz County"] },
				{ facts: [] },
			),
		/Unsupported service area/,
	);
});

test("integration inventory accepts an explicit failed live probe and rejects invalid truth states", () => {
	const failed = assertIntegrationInventory({
		schema_version: "1.0",
		classification: "FAILED",
		integrations: [
			{
				id: "sidecar-health",
				category: "required",
				state: "FAILED",
				minimum_scope: "Separate deployed sidecar health endpoint",
				setup_reference:
					"docs/seo-agent/MANUAL_SETUP.md#required-human-actions",
			},
		],
	});
	assert.equal(failed.classification, "FAILED");
	assert.throws(
		() =>
			assertIntegrationInventory({
				schema_version: "1.0",
				classification: "MOCK_VERIFIED",
				integrations: [
					{
						id: "github",
						category: "required",
						state: "MOCK_VERIFIED",
						minimum_scope: "read",
						setup_reference: "docs/seo-agent/MANUAL_SETUP.md",
					},
					{
						id: "github",
						category: "optional",
						state: "UNKNOWN",
						minimum_scope: "read",
						setup_reference: "docs/seo-agent/MANUAL_SETUP.md",
					},
				],
			}),
		/duplicate integration id/,
	);
});

test("opportunity score and Markdown safety checks are deterministic", () => {
	assert.equal(
		scoreOpportunity({
			demand: 2,
			intent_fit: 3,
			business_evidence: 4,
			feasibility: 5,
			cannibalization_risk: 1,
			safety_risk: 2,
		}),
		117,
	);
	assert.throws(() => validateMarkdownDraft("no front matter"), /front matter/);
	assert.throws(
		() =>
			validateMarkdownDraft(
				"---\ntitle: x\ndescription: x\ncanonical: /x\nquery_cluster: x\nevidence_ids: [x]\n---\nFake review",
			),
		/disallowed/,
	);
	assert.throws(
		() =>
			validateMarkdownDraft(
				"---\ntitle: x\ndescription: x\ncanonical: /x\nquery_cluster: x\nevidence_ids: [x]\n---\nTell a homeowner to enter a septic tank alone.",
			),
		/disallowed/,
	);
});

test("new URL proposals fail closed when they duplicate an existing canonical page or lack review evidence", () => {
	const inventory = { pages: [{ url: "/existing" }] };
	const approvedFacts = { facts: [] };
	const proposal = {
		id: "fixture-proposal",
		query_cluster: "fixture plumbing",
		owner_url: "/existing",
		rollback_target: "revert-fixture",
		existing_page_assessment: "EXISTING_INSUFFICIENT",
		duplicate_cannibalization_assessment:
			"No separate canonical page may own this query.",
		evidence_ids: ["fixture-evidence"],
		new_url: "/existing",
		service_areas: [],
	};
	assert.throws(
		() => validateProposal(proposal, { inventory, approvedFacts }),
		/duplicates an existing canonical page/,
	);
	assert.throws(
		() =>
			validateProposal(
				{ ...proposal, new_url: "/new", evidence_ids: [] },
				{ inventory, approvedFacts },
			),
		/requires evidence/,
	);
});

test("preview audit fails closed unless it proves preview crawl protection", () => {
	assert.equal(
		assessPreviewAudit({}).classification,
		"BLOCKED_MISSING_CREDENTIALS",
	);
	assert.throws(
		() =>
			assessPreviewAudit({
				preview_url: "https://preview.test",
				commit_sha: "0123456",
				audit_timestamp: new Date(0).toISOString(),
				indexable: true,
			}),
		/noindex/,
	);
	assert.throws(
		() =>
			assessPreviewAudit({
				preview_url: "http://preview.test",
				commit_sha: "0123456",
				audit_timestamp: new Date(0).toISOString(),
				indexable: false,
			}),
		/HTTPS/,
	);
	assert.equal(
		assessPreviewAudit({
			preview_url: "https://preview.test",
			commit_sha: "0123456",
			audit_timestamp: new Date(0).toISOString(),
			indexable: false,
			classification: "BLOCKED_MISSING_CREDENTIALS",
		}).ready,
		false,
	);
	assert.equal(
		assessPreviewAudit({
			preview_url: "https://preview.test",
			commit_sha: "0123456",
			audit_timestamp: new Date(0).toISOString(),
			indexable: false,
			classification: "MOCK_VERIFIED",
		}).ready,
		true,
	);
});

test("production audit is read-only, commit-bound, and never treats blocked evidence as verified", () => {
	const input = {
		human_merge_sha: "0123456",
		deployment_commit_sha: "0123456",
		production_url: "https://www.wadesplumbingandseptic.com/",
		deployment_id: "dpl_fixture",
		write_attempted: false,
		classification: "MOCK_VERIFIED",
	};
	assert.equal(assessProductionAudit(input).verified, true);
	assert.throws(
		() => assessProductionAudit({ ...input, write_attempted: true }),
		/read-only/,
	);
	assert.throws(
		() => assessProductionAudit({ ...input, deployment_commit_sha: "7654321" }),
		/match the human merge/,
	);
	assert.equal(
		assessProductionAudit({
			...input,
			classification: "BLOCKED_MISSING_CREDENTIALS",
		}).verified,
		false,
	);
});

test("technical audit reflects the root quality gates and detects suppression in an isolated fixture", () => {
	const repoRoot = resolve(import.meta.dirname, "../../..");
	const inventory = collectPageInventory({ repoRoot });
	const report = buildTechnicalSeoReport({ repoRoot, inventory });
	assert.ok(report.sitemap_sources.length > 0);
	assert.ok(report.robots_sources.length > 0);
	assert.ok(report.pages_with_json_ld.length > 0);
	assert.equal(
		report.findings.some(
			(finding) => finding.code === "TYPESCRIPT_BUILD_ERRORS_IGNORED",
		),
		false,
	);
	assert.equal(
		report.findings.some(
			(finding) =>
				finding.severity === "high" || finding.severity === "critical",
		),
		false,
	);

	const fixtureRoot = mkdtempSync(join(tmpdir(), "wades-seo-technical-audit-"));
	try {
		mkdirSync(join(fixtureRoot, "app"), { recursive: true });
		writeFileSync(
			join(fixtureRoot, "next.config.js"),
			"module.exports = { typescript: { ignoreBuildErrors: true }, eslint: { ignoreDuringBuilds: true } };\n",
		);
		writeFileSync(
			join(fixtureRoot, "app", "page.tsx"),
			'export const metadata = { verification: { google: "YOUR_GOOGLE_VERIFICATION" } };\n',
		);
		const suppressionReport = buildTechnicalSeoReport({
			repoRoot: fixtureRoot,
			inventory: { pages: [] },
		});
		assert.ok(
			suppressionReport.findings.some(
				(finding) => finding.code === "TYPESCRIPT_BUILD_ERRORS_IGNORED",
			),
		);
		assert.ok(
			suppressionReport.findings.some(
				(finding) => finding.code === "ESLINT_BUILD_ERRORS_IGNORED",
			),
		);
		assert.ok(
			suppressionReport.findings.some(
				(finding) => finding.code === "PUBLISHABLE_PLACEHOLDER_VALUE",
			),
		);
	} finally {
		rmSync(fixtureRoot, { recursive: true, force: true });
	}
});
