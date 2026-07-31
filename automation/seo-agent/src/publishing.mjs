import { assertTruthState, authorizeAction } from "./policy.mjs";
import { assertMarkdownChangeSet } from "./markdown-change-set.mjs";

const REQUIRED_PACKET_MARKERS = Object.freeze([
	"# SEO Draft PR Packet",
	"- Proposal:",
	"- Query cluster:",
	"- Canonical owner:",
	"- Existing page assessment:",
	"- Evidence:",
	"- Change manifest:",
	"- Migration boundary: FUTURE_MARKDOWN_MIGRATION; human-approved migration required.",
	"- Rollback:",
	"- Publication: DRAFT PR ONLY; human approval and merge required.",
]);

export function assertDraftPrPacket({ title, body, changeSet }) {
	if (typeof title !== "string" || !title.trim() || title.length > 120)
		throw new Error(
			"Draft PR title must be a non-empty string of at most 120 characters",
		);
	if (typeof body !== "string")
		throw new Error("Draft PR body must be a string");
	assertMarkdownChangeSet(changeSet);
	for (const marker of REQUIRED_PACKET_MARKERS) {
		if (!body.includes(marker))
			throw new Error(`Draft PR packet missing required marker: ${marker}`);
	}
	if (!body.includes(`- Change manifest: ${changeSet.proposal_id}`))
		throw new Error("Draft PR packet does not reference its change manifest");
	return true;
}

export async function createDraftPullRequest({
	humanApproval,
	branch,
	title,
	body,
	changeSet,
	gateway,
}) {
	authorizeAction("create_draft_pull_request", {
		humanApproval,
		draft: true,
		branch,
	});
	assertDraftPrPacket({ title, body, changeSet });
	if (!gateway) {
		return {
			classification: "BLOCKED_MISSING_CREDENTIALS",
			reason: "No human-approved GitHub draft-PR gateway is configured.",
			draft_pr_created: false,
		};
	}
	if (typeof gateway.stageMarkdownChangeSet !== "function") {
		return {
			classification: "BLOCKED_MISSING_CREDENTIALS",
			reason:
				"GitHub gateway cannot stage the approved Markdown change set on a feature branch.",
			draft_pr_created: false,
		};
	}
	const staged = await gateway.stageMarkdownChangeSet({ branch, changeSet });
	const stagingClassification =
		staged?.classification ?? gateway.classification;
	if (!stagingClassification)
		throw new Error(
			"Publication adapter must provide an explicit truth classification",
		);
	assertTruthState(stagingClassification);
	if (stagingClassification === "BLOCKED_MISSING_CREDENTIALS") {
		return {
			classification: stagingClassification,
			reason: staged?.reason ?? "Markdown branch staging is blocked.",
			draft_pr_created: false,
		};
	}
	if (
		staged?.branch !== branch ||
		!/^[a-f0-9]{7,64}$/.test(staged?.commit_sha ?? "") ||
		staged?.write_performed !== true
	) {
		throw new Error(
			"Publication adapter returned invalid staged feature-branch metadata",
		);
	}
	const result = await gateway.createPullRequest({
		branch,
		title,
		body,
		draft: true,
	});
	if (!result?.draft)
		throw new Error(
			"Publication adapter violated policy: expected a draft pull request",
		);
	if (
		!Number.isInteger(result.number) ||
		result.number < 1 ||
		typeof result.url !== "string" ||
		!result.url.startsWith("https://")
	) {
		throw new Error(
			"Publication adapter returned invalid draft pull request metadata",
		);
	}
	const classification = result.classification ?? gateway.classification;
	if (!classification)
		throw new Error(
			"Publication adapter must provide an explicit truth classification",
		);
	assertTruthState(classification);
	return Object.freeze({
		classification,
		draft_pr_created: true,
		url: result.url,
		number: result.number,
		branch: staged.branch,
		commit_sha: staged.commit_sha,
	});
}
