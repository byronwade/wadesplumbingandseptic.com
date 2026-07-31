import {
	assertEvidence,
	assertNoUnsupportedServiceArea,
} from "./contracts.mjs";
import { assertMarkdownChangeSet } from "./markdown-change-set.mjs";
import { validateEditorialProposal } from "./editorial-policy.mjs";
import { assessContentProposal } from "./policy.mjs";
import { assessPreviewAudit, assessProductionAudit } from "./quality-gates.mjs";
import { validateProposal } from "./strategy.mjs";

const SAFE_SHA = /^[a-f0-9]{7,64}$/i;
const SAFE_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAFE_BRANCH = /^eve\/seo\/\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_CI_ATTEMPTS = 3;

export const PUBLISHING_STATES = Object.freeze([
	"BLOCKED_MUTATION_MODE",
	"COLLECTING",
	"PATCH_VALIDATED",
	"DRAFT_PR_OPEN",
	"CI_FAILED",
	"PREVIEW_FAILED",
	"HUMAN_REVIEW",
	"PRODUCTION_AUDIT",
	"CLOSED",
	"REJECTED",
]);

function blocked(reason, extra = {}) {
	return Object.freeze({
		classification: "BLOCKED_MISSING_CREDENTIALS",
		state: "BLOCKED_MUTATION_MODE",
		reason,
		...extra,
	});
}

function assertGateway(gateway) {
	const required = [
		"readMainCommit",
		"createIsolatedSandboxCheckout",
		"gatherEvidence",
		"validateLocalPatch",
		"createBranch",
		"commit",
		"openDraftPullRequest",
		"addLabels",
		"waitForSelfHostedCi",
		"findVercelPreview",
		"commentPullRequest",
		"markReadyForReview",
		"getHumanMerge",
		"auditProduction",
		"recordMonthlyOperation",
	];
	for (const name of required) {
		if (typeof gateway?.[name] !== "function") {
			throw new TypeError(`Publishing lifecycle gateway lacks ${name}.`);
		}
	}
	if (typeof gateway.mergePullRequest === "function") {
		throw new Error(
			"Publishing lifecycle gateway must not expose automatic merge.",
		);
	}
	return gateway;
}

export function publicationBranch({ date, slug }) {
	if (!SAFE_DATE.test(date) || !SAFE_SLUG.test(slug)) {
		throw new Error(
			"Publication branch requires a YYYY-MM-DD date and safe slug.",
		);
	}
	return `eve/seo/${date}-${slug}`;
}

export function assertPublicationAuthorization({
	mutationMode = "disabled",
	mutationKillSwitch = true,
	humanApproved = false,
	integrationTestEnabled = false,
} = {}) {
	if (mutationMode !== "enabled") {
		return blocked(
			"Publication is disabled until SEO_AGENT_MUTATION_MODE=enabled.",
		);
	}
	if (mutationKillSwitch !== false) {
		return blocked(
			"Publication is blocked while the mutation kill switch is enabled.",
		);
	}
	if (humanApproved !== true) {
		return blocked("Publication requires an explicit human approval record.");
	}
	if (integrationTestEnabled !== true) {
		return blocked(
			"No real branch, commit, PR, label, comment, or issue write occurs without the explicit publishing integration-test flag.",
		);
	}
	return Object.freeze({ allowed: true });
}

function assertMainCommit(value) {
	if (!SAFE_SHA.test(value?.sha ?? "") || value.branch !== "main") {
		throw new Error(
			"Publishing lifecycle requires the current main commit SHA.",
		);
	}
	return Object.freeze({ sha: value.sha, branch: value.branch });
}

function assertSandboxCheckout(value, mainCommit) {
	if (
		typeof value?.id !== "string" ||
		typeof value?.path !== "string" ||
		value.base_sha !== mainCommit.sha ||
		value.isolated !== true ||
		value.network_policy !== "deny-all"
	) {
		throw new Error(
			"Publishing lifecycle requires an isolated deny-all sandbox checkout pinned to main.",
		);
	}
	return Object.freeze(value);
}

function selectOneOpportunity(opportunities, approvedFacts) {
	if (!Array.isArray(opportunities) || opportunities.length !== 1) {
		throw new Error(
			"Publishing lifecycle must select exactly one cohesive opportunity.",
		);
	}
	const opportunity = opportunities[0];
	if (
		!opportunity?.id ||
		!opportunity.query_cluster ||
		!opportunity.owner_url?.startsWith("/") ||
		!Array.isArray(opportunity.evidence_ids) ||
		opportunity.evidence_ids.length === 0 ||
		!opportunity.existing_page_decision
	) {
		throw new Error("Publishing opportunity is incomplete.");
	}
	assertNoUnsupportedServiceArea(opportunity, approvedFacts);
	return Object.freeze(opportunity);
}

function assertEvidenceSet(evidence) {
	if (!Array.isArray(evidence) || evidence.length === 0) {
		throw new Error("Publishing lifecycle requires gathered evidence.");
	}
	evidence.forEach((item) => assertEvidence(item));
	return Object.freeze([...evidence]);
}

function assertFactCheck({ factCheck, evidence, opportunity }) {
	const evidenceIds = new Set(
		evidence
			.map((item) => item.payload?.id)
			.filter((value) => typeof value === "string"),
	);
	if (!opportunity.evidence_ids.every((id) => evidenceIds.has(id))) {
		throw new Error(
			"Publishing opportunity references evidence that was not gathered.",
		);
	}
	if (
		factCheck?.reviewer_role !== "fact-checking" ||
		factCheck?.decision !== "APPROVED" ||
		!Array.isArray(factCheck.claims) ||
		factCheck.claims.length === 0
	) {
		throw new Error(
			"Publishing lifecycle requires an independent approved fact-check report.",
		);
	}
	for (const claim of factCheck.claims) {
		if (
			typeof claim?.claim !== "string" ||
			!Array.isArray(claim.evidence_ids) ||
			claim.evidence_ids.length === 0 ||
			!claim.evidence_ids.every((id) => evidenceIds.has(id))
		) {
			throw new Error("Fact-check report contains an unlinked factual claim.");
		}
	}
	return Object.freeze({
		...factCheck,
		claims: Object.freeze([...factCheck.claims]),
	});
}

function assertPatchSafe(changeSet, opportunity, inventory) {
	assertMarkdownChangeSet(changeSet);
	if (changeSet.files.some((file) => file.operation === "DELETE")) {
		throw new Error("Publishing lifecycle prohibits unapproved deletion.");
	}
	if (
		!changeSet.files.some((file) => file.path === opportunity.content_path) ||
		changeSet.files.some((file) => file.operation !== opportunity.operation)
	) {
		throw new Error(
			"Publishing lifecycle change set must match the approved editorial target and operation.",
		);
	}
	validateEditorialProposal(opportunity, { inventory });
	const decision = assessContentProposal({
		text: changeSet.files.map((file) => file.content).join("\n"),
		approvedEvidenceIds: opportunity.evidence_ids,
		existingPageDecision: opportunity.existing_page_decision,
	});
	if (decision.decision !== "PROPOSE_FOR_HUMAN_REVIEW") {
		throw new Error(
			`Publishing content gate denied the patch: ${decision.reason ?? decision.decision}`,
		);
	}
	return changeSet;
}

function assertLabels(labels) {
	if (!Array.isArray(labels) || labels.length < 3) {
		throw new Error(
			"Publishing lifecycle requires SEO, risk, and content labels.",
		);
	}
	if (
		!labels.includes("seo-agent") ||
		!labels.some((label) => label.startsWith("risk:")) ||
		!labels.some((label) => label.startsWith("content:"))
	) {
		throw new Error("Publishing lifecycle labels are incomplete.");
	}
	return Object.freeze([...new Set(labels)]);
}

export function derivePublicationLabels({ opportunity, changeSet }) {
	const risk =
		changeSet.changed_files > 3 || changeSet.changed_lines > 300
			? "risk:medium"
			: "risk:low";
	const content =
		opportunity.existing_page_decision === "CONSOLIDATE_EXISTING"
			? "content:consolidate"
			: "content:refresh";
	return assertLabels(["seo-agent", risk, content]);
}

export function buildComprehensivePrBody({
	opportunity,
	evidence,
	changeSet,
	branch,
	mainCommit,
	validation,
	labels,
	preview = "Pending Vercel preview detection",
}) {
	return `# Eve SEO operations draft\n\n## Evidence and sources\n- Main baseline: ${mainCommit.sha}\n- Opportunity: ${opportunity.id}\n- Query cluster: ${opportunity.query_cluster}\n- Canonical owner: ${opportunity.owner_url}\n- Existing-page decision: ${opportunity.existing_page_decision}\n- Evidence IDs: ${opportunity.evidence_ids.join(", ")}\n- Sources: ${evidence.map((item) => item.source_url_or_tool).join(", ")}\n\n## Metrics and expected outcome\n- Baseline metrics: evidence-backed only; no missing metric is inferred.\n- Expected outcome: improve usefulness and intent fit for the existing canonical owner.\n- Observation window: 28 complete days after human merge; exclude incomplete Search Console days.\n\n## Claims and content safety\n- Claims: fact-check against the approved registry before review.\n- Service/location changes: none unless explicitly approved by the attached facts.\n- Prohibited: fake jobs/reviews/prices/availability, unsafe advice, doorway pages, stuffing, hidden links, copied competitor prose, and date-only freshness.\n\n## Files and links\n- Branch: ${branch}\n- Files: ${changeSet.files.map((file) => `${file.operation} ${file.path}`).join(", ")}\n- Internal links: review required from the versioned link graph.\n- Redirect/canonical/robots: no destructive change is permitted by this patch boundary.\n\n## Validation\n- Local patch validation: ${validation.summary}\n- Tests: deterministic sidecar and public-site gates required.\n- Evals: critical content-policy fixtures required.\n- Preview: ${preview}\n\n## Risks, rollback, and reviewer checklist\n- Labels: ${labels.join(", ")}\n- Risk: ${labels.find((label) => label.startsWith("risk:"))}\n- Rollback: revert the human-merged PR; do not use an agent rollback.\n- [ ] Evidence, source access dates, and claims are complete\n- [ ] Fact checker and independent QA approve\n- [ ] Existing-page-first and link-graph review pass\n- [ ] Self-hosted CI passes\n- [ ] Vercel preview is non-indexable and affected URLs pass audit\n- [ ] Human reviewer approves and merges; agent must not merge\n`;
}

async function waitForPassingSelfHostedCi(gateway, input) {
	for (let attempt = 1; attempt <= MAX_CI_ATTEMPTS; attempt += 1) {
		const result = await gateway.waitForSelfHostedCi({ ...input, attempt });
		if (result?.status === "passed" && result.runner === "self-hosted") {
			return Object.freeze({ ...result, attempt });
		}
		if (result?.retryable !== true || attempt === MAX_CI_ATTEMPTS) {
			return Object.freeze({ ...result, attempt, status: "failed" });
		}
	}
	throw new Error("Unreachable CI retry state.");
}

function auditComment(kind, outcome) {
	return `## Eve SEO ${kind} audit\n\n- Result: ${(outcome.ready ?? outcome.verified) ? "PASS" : "BLOCKED"}\n- Classification: ${outcome.classification}\n- Detail: ${outcome.reason ?? "No critical findings."}\n- Agent did not merge, deploy, or change production.\n`;
}

/**
 * Coordinates the only mutable lifecycle. The caller must inject a gateway;
 * this module intentionally owns no credentials and ships with mutation mode
 * disabled. A human merge is observed, never initiated by this code.
 */
export async function runPublishingLifecycle({
	gateway,
	approval,
	date,
	slug,
	opportunities,
	approvedFacts,
	inventory,
	factCheck,
	changeSet,
} = {}) {
	const authorization = assertPublicationAuthorization(approval);
	if (!authorization.allowed) return authorization;
	assertGateway(gateway);
	const branch = publicationBranch({ date, slug });
	if (!SAFE_BRANCH.test(branch))
		throw new Error("Publication branch is unsafe.");
	const mainCommit = assertMainCommit(await gateway.readMainCommit());
	const checkout = assertSandboxCheckout(
		await gateway.createIsolatedSandboxCheckout({ base_sha: mainCommit.sha }),
		mainCommit,
	);
	const evidence = assertEvidenceSet(
		await gateway.gatherEvidence({ checkout, main_commit: mainCommit.sha }),
	);
	const opportunity = validateProposal(
		selectOneOpportunity(opportunities, approvedFacts),
		{ inventory, approvedFacts },
	);
	assertFactCheck({ factCheck, evidence, opportunity });
	assertPatchSafe(changeSet, opportunity, inventory);
	const validation = await gateway.validateLocalPatch({
		checkout,
		change_set: changeSet,
	});
	if (validation?.passed !== true || typeof validation.summary !== "string") {
		throw new Error("Local patch validation did not pass.");
	}
	const labels = derivePublicationLabels({ opportunity, changeSet });
	const body = buildComprehensivePrBody({
		opportunity,
		evidence,
		changeSet,
		branch,
		mainCommit,
		validation,
		labels,
	});
	const created = await gateway.createBranch({
		branch,
		from_sha: mainCommit.sha,
	});
	if (created?.branch !== branch || created?.base_sha !== mainCommit.sha) {
		throw new Error(
			"Publication gateway did not create the requested feature branch.",
		);
	}
	const commit = await gateway.commit({
		checkout,
		branch,
		change_set: changeSet,
		message: `chore(seo): ${opportunity.id} [eve-seo-agent; human-approved lifecycle]`,
		attribution: "eve-seo-agent",
	});
	if (
		!SAFE_SHA.test(commit?.sha ?? "") ||
		commit.branch !== branch ||
		commit.direct_to_main === true ||
		commit.force_push === true
	) {
		throw new Error("Publication gateway returned an unsafe commit result.");
	}
	const pr = await gateway.openDraftPullRequest({
		branch,
		base: "main",
		title: `SEO: ${opportunity.id}`,
		body,
		draft: true,
	});
	if (
		!Number.isInteger(pr?.number) ||
		pr.number < 1 ||
		pr.draft !== true ||
		!String(pr.url).startsWith("https://")
	) {
		throw new Error("Publication gateway did not return a draft PR.");
	}
	await gateway.addLabels({ pr_number: pr.number, labels });
	const ci = await waitForPassingSelfHostedCi(gateway, {
		pr_number: pr.number,
		commit_sha: commit.sha,
	});
	if (ci.status !== "passed") {
		await gateway.commentPullRequest({
			pr_number: pr.number,
			body: auditComment("CI", {
				classification: "MOCK_VERIFIED",
				ready: false,
				reason: "Self-hosted CI did not pass.",
			}),
		});
		return Object.freeze({
			classification: "MOCK_VERIFIED",
			state: "CI_FAILED",
			branch,
			pr,
			ci,
			body,
			labels,
		});
	}
	const previewInput = await gateway.findVercelPreview({
		pr_number: pr.number,
		commit_sha: commit.sha,
	});
	let preview;
	try {
		preview = assessPreviewAudit({ ...previewInput, commit_sha: commit.sha });
	} catch (error) {
		preview = {
			ready: false,
			classification: "MOCK_VERIFIED",
			reason: error instanceof Error ? error.message : "Preview audit failed.",
		};
	}
	await gateway.commentPullRequest({
		pr_number: pr.number,
		body: auditComment("preview", preview),
	});
	if (!preview.ready) {
		return Object.freeze({
			classification: preview.classification,
			state: "PREVIEW_FAILED",
			branch,
			pr,
			ci,
			preview,
			body,
			labels,
		});
	}
	await gateway.markReadyForReview({
		pr_number: pr.number,
		required_gates: ["self-hosted-ci", "preview-audit"],
	});
	const merge = await gateway.getHumanMerge({ pr_number: pr.number });
	if (
		merge?.merged_by_human !== true ||
		!SAFE_SHA.test(merge?.merge_sha ?? "")
	) {
		return Object.freeze({
			classification: "MOCK_VERIFIED",
			state: "HUMAN_REVIEW",
			branch,
			pr,
			ci,
			preview,
			body,
			labels,
			reason: "Awaiting human merge; the agent has no merge capability.",
		});
	}
	const production = assessProductionAudit({
		...(await gateway.auditProduction({ human_merge_sha: merge.merge_sha })),
		human_merge_sha: merge.merge_sha,
		write_attempted: false,
	});
	await gateway.commentPullRequest({
		pr_number: pr.number,
		body: auditComment("production", production),
	});
	const monthlyIssue = await gateway.recordMonthlyOperation({
		month: date.slice(0, 7),
		pr_number: pr.number,
		branch,
		human_merge_sha: merge.merge_sha,
		production_audit: production,
	});
	return Object.freeze({
		classification: production.classification,
		state: production.verified ? "CLOSED" : "PRODUCTION_AUDIT",
		branch,
		pr,
		ci,
		preview,
		production,
		monthly_issue: monthlyIssue,
		body,
		labels,
	});
}
