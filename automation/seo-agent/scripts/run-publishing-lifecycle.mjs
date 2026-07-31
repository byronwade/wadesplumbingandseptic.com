import { makeEvidence } from "../src/contracts.mjs";
import { buildMarkdownChangeSet } from "../src/markdown-change-set.mjs";
import { runPublishingLifecycle } from "../src/publishing-lifecycle.mjs";

// Deterministic lifecycle fixture. It has no process credentials, network
// client, local Git mutation, or real GitHub/Vercel implementation.
const sha = (character) => character.repeat(40);
const opportunity = {
	id: "fixture-existing-page-refresh",
	query_cluster: "fixture service guidance",
	owner_url: "/services",
	existing_page_decision: "REFRESH_EXISTING",
	existing_page_assessment: "EXISTING_SUFFICIENT",
	duplicate_cannibalization_assessment: "NO_DUPLICATE_OWNER",
	rollback_target: "revert the human-merged fixture PR",
	evidence_ids: ["fixture-evidence"],
	service_areas: [],
};
const changeSet = buildMarkdownChangeSet({
	proposalId: opportunity.id,
	files: [
		{
			path: "content/pages/fixture-service-guidance.md",
			operation: "UPDATE",
			content:
				"---\ntitle: Fixture service guidance\ndescription: Evidence-backed fixture.\ncanonical: /services\nquery_cluster: fixture service guidance\nevidence_ids: [fixture-evidence]\n---\n\n# Fixture service guidance\n\nUse only approved evidence.\n",
		},
	],
});
const gateway = {
	async readMainCommit() {
		return { sha: sha("a"), branch: "main" };
	},
	async createIsolatedSandboxCheckout({ base_sha }) {
		return {
			id: "fixture",
			path: "/workspace/fixture",
			base_sha,
			isolated: true,
			network_policy: "deny-all",
		};
	},
	async gatherEvidence() {
		return [
			makeEvidence({
				runId: "publish-fixture-001",
				source: "fixture",
				scope: "lifecycle",
				sourceUrlOrTool: "fixture:lifecycle",
				collectedAt: new Date(0).toISOString(),
				payload: { id: "fixture-evidence" },
			}),
		];
	},
	async validateLocalPatch() {
		return { passed: true, summary: "fixture validation passed" };
	},
	async createBranch({ branch, from_sha }) {
		return { branch, base_sha: from_sha };
	},
	async commit({ branch }) {
		return { sha: sha("b"), branch, direct_to_main: false, force_push: false };
	},
	async openDraftPullRequest() {
		return { number: 1, draft: true, url: "https://example.test/pull/1" };
	},
	async addLabels() {},
	async waitForSelfHostedCi() {
		return { status: "passed", runner: "self-hosted" };
	},
	async findVercelPreview() {
		return {
			preview_url: "https://preview.example.test",
			audit_timestamp: new Date(0).toISOString(),
			indexable: false,
			classification: "MOCK_VERIFIED",
			critical_findings: [],
		};
	},
	async commentPullRequest() {},
	async markReadyForReview() {},
	async getHumanMerge() {
		return { merged_by_human: true, merge_sha: sha("c") };
	},
	async auditProduction() {
		return {
			production_url: "https://www.wadesplumbingandseptic.com/services",
			deployment_id: "fixture",
			deployment_commit_sha: sha("c"),
			classification: "MOCK_VERIFIED",
			critical_findings: [],
		};
	},
	async recordMonthlyOperation() {
		return { number: 2, url: "https://example.test/issues/2" };
	},
};

const result = await runPublishingLifecycle({
	gateway,
	approval: {
		mutationMode: "enabled",
		mutationKillSwitch: false,
		humanApproved: true,
		integrationTestEnabled: true,
	},
	date: "2026-07-30",
	slug: "fixture-existing-page-refresh",
	opportunities: [opportunity],
	approvedFacts: { facts: [] },
	inventory: { pages: [{ url: "/services" }] },
	factCheck: {
		reviewer_role: "fact-checking",
		decision: "APPROVED",
		claims: [
			{
				claim: "Fixture guidance is evidence-backed.",
				evidence_ids: ["fixture-evidence"],
			},
		],
	},
	changeSet,
});
console.log(
	JSON.stringify({
		verification: "MOCK_VERIFIED",
		state: result.state,
		draft_pr: result.pr?.draft ?? false,
		production_verified: result.production?.verified ?? false,
	}),
);
