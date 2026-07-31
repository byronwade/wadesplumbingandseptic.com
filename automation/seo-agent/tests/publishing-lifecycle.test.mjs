import assert from "node:assert/strict";
import test from "node:test";
import { makeEvidence } from "../src/contracts.mjs";
import { buildMarkdownChangeSet } from "../src/markdown-change-set.mjs";
import {
	assertPublicationAuthorization,
	buildComprehensivePrBody,
	publicationBranch,
	runPublishingLifecycle,
} from "../src/publishing-lifecycle.mjs";

const mainSha = "a".repeat(40);
const branchSha = "b".repeat(40);
const mergeSha = "c".repeat(40);
const approval = Object.freeze({
	mutationMode: "enabled",
	mutationKillSwitch: false,
	humanApproved: true,
	integrationTestEnabled: true,
});
const opportunity = Object.freeze({
	id: "refresh-septic-service-guide",
	query_cluster: "septic service guide",
	owner_url: "/services",
	operation: "UPDATE",
	content_path: "content/services/septic-service-guide.md",
	editorial_type: "SERVICE_REFRESH",
	existing_page_decision: "REFRESH_EXISTING",
	existing_page_assessment: "EXISTING_SUFFICIENT",
	duplicate_cannibalization_assessment: "NO_DUPLICATE_OWNER",
	rollback_target: "revert the human-merged PR",
	evidence_ids: ["evidence-1"],
	internal_links: [
		{
			to: "/services",
			anchor: "septic service guide",
			reader_rationale:
				"Connects readers to the existing canonical service guide.",
		},
	],
	service_areas: [],
});
const approvedFacts = Object.freeze({ facts: [] });
const inventory = Object.freeze({ pages: [{ url: "/services" }] });
const factCheck = Object.freeze({
	reviewer_role: "fact-checking",
	decision: "APPROVED",
	claims: [
		{ claim: "Guidance is evidence-backed.", evidence_ids: ["evidence-1"] },
	],
});
const changeSet = buildMarkdownChangeSet({
	proposalId: opportunity.id,
	files: [
		{
			path: "content/services/septic-service-guide.md",
			operation: "UPDATE",
			content:
				"---\ntitle: Septic service guide\ndescription: Evidence-backed service guidance.\ncanonical: /services\nquery_cluster: septic service guide\nevidence_ids: [evidence-1]\n---\n\n# Septic service guide\n\nUse approved evidence and contact a qualified professional for service.\n",
		},
	],
});

function evidence() {
	return [
		makeEvidence({
			runId: "publish-fixture-001",
			source: "repository-fact",
			scope: "existing-page",
			sourceUrlOrTool: "repo:app/(website)/services",
			collectedAt: new Date(0).toISOString(),
			payload: { id: "evidence-1" },
		}),
	];
}

function createGateway({
	ci = [{ status: "passed", runner: "self-hosted" }],
	preview,
	merge,
	production,
} = {}) {
	const calls = [];
	let ciIndex = 0;
	return {
		calls,
		async readMainCommit() {
			calls.push("read-main");
			return { sha: mainSha, branch: "main" };
		},
		async createIsolatedSandboxCheckout(input) {
			calls.push("checkout");
			return {
				id: "sandbox-fixture",
				path: "/workspace/repo",
				base_sha: input.base_sha,
				isolated: true,
				network_policy: "deny-all",
			};
		},
		async gatherEvidence() {
			calls.push("evidence");
			return evidence();
		},
		async validateLocalPatch() {
			calls.push("validate");
			return {
				passed: true,
				summary: "root lint, sidecar tests, and evals passed",
			};
		},
		async createBranch(input) {
			calls.push("branch");
			return { branch: input.branch, base_sha: input.from_sha };
		},
		async commit(input) {
			calls.push("commit");
			return {
				sha: branchSha,
				branch: input.branch,
				direct_to_main: false,
				force_push: false,
			};
		},
		async openDraftPullRequest() {
			calls.push("pr");
			return {
				number: 42,
				url: "https://github.com/byronwade/wadesplumbingandseptic.com/pull/42",
				draft: true,
			};
		},
		async addLabels() {
			calls.push("labels");
		},
		async waitForSelfHostedCi() {
			calls.push("ci");
			return ci[Math.min(ciIndex++, ci.length - 1)];
		},
		async findVercelPreview() {
			calls.push("preview");
			return (
				preview ?? {
					preview_url: "https://preview.example.test",
					audit_timestamp: new Date(0).toISOString(),
					indexable: false,
					classification: "MOCK_VERIFIED",
					critical_findings: [],
				}
			);
		},
		async commentPullRequest() {
			calls.push("comment");
		},
		async markReadyForReview() {
			calls.push("ready");
		},
		async getHumanMerge() {
			calls.push("human-merge");
			return merge ?? { merged_by_human: true, merge_sha: mergeSha };
		},
		async auditProduction() {
			calls.push("production");
			return (
				production ?? {
					production_url: "https://www.wadesplumbingandseptic.com/services",
					deployment_id: "dpl_fixture",
					deployment_commit_sha: mergeSha,
					classification: "MOCK_VERIFIED",
					critical_findings: [],
				}
			);
		},
		async recordMonthlyOperation() {
			calls.push("monthly-issue");
			return {
				number: 99,
				url: "https://github.com/byronwade/wadesplumbingandseptic.com/issues/99",
			};
		},
	};
}

function input(overrides = {}) {
	return {
		approval,
		date: "2026-07-30",
		slug: "refresh-septic-service-guide",
		opportunities: [opportunity],
		approvedFacts,
		inventory,
		factCheck,
		changeSet,
		...overrides,
	};
}

test("fixture lifecycle reads main, uses an isolated checkout, opens a draft PR, gates CI/preview, observes a human merge, and logs the production result", async () => {
	const gateway = createGateway();
	const result = await runPublishingLifecycle({ ...input(), gateway });
	assert.equal(result.state, "CLOSED");
	assert.equal(result.pr.draft, true);
	assert.equal(result.preview.ready, true);
	assert.equal(result.production.verified, true);
	assert.equal(result.monthly_issue.number, 99);
	assert.deepEqual(gateway.calls, [
		"read-main",
		"checkout",
		"evidence",
		"validate",
		"branch",
		"commit",
		"pr",
		"labels",
		"ci",
		"preview",
		"comment",
		"ready",
		"human-merge",
		"production",
		"comment",
		"monthly-issue",
	]);
	for (const heading of [
		"Evidence and sources",
		"Metrics and expected outcome",
		"Claims and content safety",
		"Files and links",
		"Validation",
		"Risks, rollback, and reviewer checklist",
	]) {
		assert.equal(result.body.includes(`## ${heading}`), true);
	}
	assert.equal(
		result.body.includes("[eve-seo-agent; human-approved lifecycle]"),
		false,
	);
});

test("publication hard-blocks disabled mutation paths before any checkout or remote action", async () => {
	const gateway = createGateway();
	const result = await runPublishingLifecycle({
		...input({ approval: { ...approval, mutationMode: "disabled" } }),
		gateway,
	});
	assert.equal(result.state, "BLOCKED_MUTATION_MODE");
	assert.deepEqual(gateway.calls, []);
	assert.equal(
		assertPublicationAuthorization({ ...approval, mutationKillSwitch: true })
			.allowed,
		undefined,
	);
	assert.equal(
		assertPublicationAuthorization({
			...approval,
			integrationTestEnabled: false,
		}).allowed,
		undefined,
	);
});

test("publication retries a transient self-hosted CI failure once and does not inspect a preview until CI passes", async () => {
	const gateway = createGateway({
		ci: [
			{ status: "failed", runner: "self-hosted", retryable: true },
			{ status: "passed", runner: "self-hosted" },
		],
	});
	const result = await runPublishingLifecycle({ ...input(), gateway });
	assert.equal(result.state, "CLOSED");
	assert.equal(gateway.calls.filter((name) => name === "ci").length, 2);
	assert.equal(
		gateway.calls.indexOf("preview") > gateway.calls.lastIndexOf("ci"),
		true,
	);
});

test("failed CI and failed preview comment findings and never mark the PR ready", async () => {
	const ciGateway = createGateway({
		ci: [{ status: "failed", runner: "self-hosted", retryable: false }],
	});
	const ciResult = await runPublishingLifecycle({
		...input(),
		gateway: ciGateway,
	});
	assert.equal(ciResult.state, "CI_FAILED");
	assert.equal(ciGateway.calls.includes("preview"), false);
	assert.equal(ciGateway.calls.includes("ready"), false);

	const previewGateway = createGateway({
		preview: {
			preview_url: "https://preview.example.test",
			audit_timestamp: new Date(0).toISOString(),
			indexable: true,
			classification: "MOCK_VERIFIED",
			critical_findings: [],
		},
	});
	const previewResult = await runPublishingLifecycle({
		...input(),
		gateway: previewGateway,
	});
	assert.equal(previewResult.state, "PREVIEW_FAILED");
	assert.equal(previewGateway.calls.includes("comment"), true);
	assert.equal(previewGateway.calls.includes("ready"), false);
});

test("the lifecycle awaits a human merge and production audit rejects a deployment SHA mismatch", async () => {
	const waitingGateway = createGateway({ merge: { merged_by_human: false } });
	const waiting = await runPublishingLifecycle({
		...input(),
		gateway: waitingGateway,
	});
	assert.equal(waiting.state, "HUMAN_REVIEW");
	assert.equal(waitingGateway.calls.includes("production"), false);

	const mismatchGateway = createGateway({
		production: {
			production_url: "https://www.wadesplumbingandseptic.com/services",
			deployment_id: "dpl_fixture",
			deployment_commit_sha: branchSha,
			classification: "MOCK_VERIFIED",
			critical_findings: [],
		},
	});
	await assert.rejects(
		runPublishingLifecycle({ ...input(), gateway: mismatchGateway }),
		/must match the human merge SHA/,
	);
});

test("branch shape, exactly-one selection, unsupported areas, and automatic-merge gateways fail closed", async () => {
	assert.equal(
		publicationBranch({
			date: "2026-07-30",
			slug: "refresh-septic-service-guide",
		}),
		"eve/seo/2026-07-30-refresh-septic-service-guide",
	);
	assert.throws(
		() => publicationBranch({ date: "bad", slug: "bad slug" }),
		/safe slug/,
	);
	await assert.rejects(
		runPublishingLifecycle({
			...input({ opportunities: [opportunity, opportunity] }),
			gateway: createGateway(),
		}),
		/exactly one/,
	);
	await assert.rejects(
		runPublishingLifecycle({
			...input({
				opportunities: [
					{ ...opportunity, service_areas: ["Unsupported Place"] },
				],
			}),
			gateway: createGateway(),
		}),
		/Unsupported service area/,
	);
	const unsafeGateway = {
		...createGateway(),
		mergePullRequest: async () => undefined,
	};
	await assert.rejects(
		runPublishingLifecycle({ ...input(), gateway: unsafeGateway }),
		/must not expose automatic merge/,
	);
	const deletion = {
		...changeSet,
		files: [{ ...changeSet.files[0], operation: "DELETE" }],
	};
	await assert.rejects(
		runPublishingLifecycle({
			...input({ changeSet: deletion }),
			gateway: createGateway(),
		}),
		/Unsupported Markdown change operation/,
	);
	const destructiveBoundary = {
		...changeSet,
		files: [{ ...changeSet.files[0], path: "app/robots.ts" }],
	};
	await assert.rejects(
		runPublishingLifecycle({
			...input({ changeSet: destructiveBoundary }),
			gateway: createGateway(),
		}),
		/safe content/,
	);
});

test("publishing blocks unvalidated owners and claim reports before any remote mutation", async () => {
	const gateway = createGateway();
	await assert.rejects(
		runPublishingLifecycle({
			...input({ opportunities: [{ ...opportunity, owner_url: "/missing" }] }),
			gateway,
		}),
		/not in the page inventory/,
	);
	assert.deepEqual(gateway.calls, ["read-main", "checkout", "evidence"]);
	const unlinkedGateway = createGateway();
	await assert.rejects(
		runPublishingLifecycle({
			...input({
				factCheck: {
					...factCheck,
					claims: [
						{
							claim: "unsupported after-hours availability",
							evidence_ids: ["unknown"],
						},
					],
				},
			}),
			gateway: unlinkedGateway,
		}),
		/unlinked factual claim/,
	);
	assert.deepEqual(unlinkedGateway.calls, [
		"read-main",
		"checkout",
		"evidence",
	]);
	const newServiceGateway = createGateway();
	await assert.rejects(
		runPublishingLifecycle({
			...input({
				opportunities: [
					{
						...opportunity,
						operation: "CREATE",
						content_path: "content/services/new-service.md",
					},
				],
				changeSet: {
					...changeSet,
					files: [
						{
							...changeSet.files[0],
							path: "content/services/new-service.md",
							operation: "CREATE",
						},
					],
				},
			}),
			gateway: newServiceGateway,
		}),
		/never create a service page/,
	);
	assert.deepEqual(newServiceGateway.calls, [
		"read-main",
		"checkout",
		"evidence",
	]);
});

test("comprehensive PR bodies preserve evidence, preview, risks, rollback, and reviewer requirements", () => {
	const body = buildComprehensivePrBody({
		opportunity,
		evidence: evidence(),
		changeSet,
		branch: "eve/seo/2026-07-30-refresh-septic-service-guide",
		mainCommit: { sha: mainSha, branch: "main" },
		validation: { summary: "fixture passed" },
		labels: ["seo-agent", "risk:low", "content:refresh"],
	});
	for (const text of [
		"Evidence IDs",
		"Sources",
		"Observation window",
		"Claims",
		"Files",
		"Tests",
		"Evals",
		"Preview",
		"Rollback",
		"Human reviewer",
	]) {
		assert.equal(body.includes(text), true);
	}
});
