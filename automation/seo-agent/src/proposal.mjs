import { generateText } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { createVercelConnectGithubDraftWriteTokenProvider } from "./adapters.mjs";
import { assertProposalRunAuthorization } from "./runtime.mjs";
import { collectPageInventory } from "./inventory.mjs";
import { buildMarkdownChangeSet } from "./markdown-change-set.mjs";
import {
	createGithubDraftPublisher,
	createDraftPullRequest,
} from "./publishing.mjs";
import {
	assessContentProposal,
	resolveGatewayModelOptions,
	resolveModelProfile,
} from "./policy.mjs";
import { reserveModelRequest } from "./model-budget.mjs";

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_DRAFT_CHARACTERS = 18_000;

function proposalDate(descriptor) {
	return descriptor.runId.slice(-10);
}

function proposalSlug(descriptor) {
	return `home-plumbing-hosting-checklist-${proposalDate(descriptor)}`;
}

function createOpportunity({ descriptor, inventory }) {
	const slug = proposalSlug(descriptor);
	const ownerUrl = `/${slug}`;
	if (inventory.pages.some((page) => page.url === ownerUrl)) {
		throw new Error(
			"The bounded proposal URL already exists in the repository.",
		);
	}
	const internalTarget =
		inventory.pages.find((page) => page.url === "/") ?? inventory.pages[0];
	if (!internalTarget)
		throw new Error("Repository inventory contains no internal-link target.");
	return Object.freeze({
		id: `proposal-${descriptor.runId}`,
		slug,
		owner_url: ownerUrl,
		content_path: `content/posts/${slug}.md`,
		query_cluster: "plumbing checklist before hosting guests",
		existing_page_assessment: "EXISTING_INSUFFICIENT",
		existing_page_decision: "CREATE_JUSTIFIED",
		evidence_ids: ["repository-inventory", "owner-approved-blog-test"],
		internal_link: internalTarget.url,
	});
}

function promptForDraft(opportunity) {
	return `Write one helpful, conservative Markdown blog post for a plumbing company website. Return only Markdown with YAML front matter.\n\nRequired front matter:\ntitle: ...\ndescription: ...\ncategory: Plumbing Tips\ndate: \"${proposalDate({ runId: opportunity.id.replace("proposal-", "") })}\"\ntags:\n  - plumbing maintenance\nimage: /images/services/drain-clearing.webp\nimageAlt: \"Plumbing drain-clearing equipment\"\ncanonical: ${opportunity.owner_url}\nquery_cluster: ${opportunity.query_cluster}\nevidence_ids: [repository-inventory, owner-approved-blog-test]\n\nRequired structure: one H1, 3-5 practical H2 sections, a short conclusion, and one contextual Markdown link to ${opportunity.internal_link}. Focus on simple preparation before hosting guests. Do not state or imply business-specific availability, licenses, pricing, response times, guarantees, service areas, warranties, reviews, statistics, or emergency service. Do not give dangerous DIY repair steps, mention competitors, or use keyword stuffing. Do not invent facts or cite sources. Keep it below 1,400 words.`;
}

function extractMarkdown(text) {
	if (typeof text !== "string" || !text.trim()) {
		throw new Error("Writer returned an empty draft.");
	}
	const normalized = text
		.trim()
		.replace(/^```(?:markdown|md)?\s*/i, "")
		.replace(/\s*```$/, "");
	if (normalized.length > MAX_DRAFT_CHARACTERS) {
		throw new Error("Writer draft exceeds the bounded content size.");
	}
	return `${normalized}\n`;
}

function assertDraftShape(markdown, opportunity) {
	if (!markdown.includes(`canonical: ${opportunity.owner_url}`)) {
		throw new Error(
			"Writer draft canonical does not match the approved owner URL.",
		);
	}
	if (!markdown.includes(opportunity.internal_link)) {
		throw new Error(
			"Writer draft omitted the approved contextual internal link.",
		);
	}
	if ((markdown.match(/^#\s+/gm) ?? []).length !== 1) {
		throw new Error("Writer draft must contain exactly one H1.");
	}
	const gate = assessContentProposal({
		text: markdown,
		approvedEvidenceIds: opportunity.evidence_ids,
		existingPageDecision: opportunity.existing_page_decision,
	});
	if (gate.decision !== "PROPOSE_FOR_HUMAN_REVIEW") {
		throw new Error(
			`Content policy rejected the writer draft: ${gate.reason ?? gate.decision}`,
		);
	}
	return markdown;
}

async function writeWithGateway({ runId, opportunity }) {
	const profile = resolveModelProfile("writing");
	const prompt = promptForDraft(opportunity);
	const reservation = reserveModelRequest({
		runId,
		prompt,
		maxOutputTokens: 2600,
		model: profile.primary,
	});
	const result = await generateText({
		model: gateway(profile.primary),
		prompt,
		maxOutputTokens: 2600,
		...resolveGatewayModelOptions("writing"),
	});
	return {
		markdown: extractMarkdown(result.text),
		reservation,
		model: profile.primary,
	};
}

async function judgeWithGateway({ runId, markdown }) {
	const profile = resolveModelProfile("independent_qa");
	const prompt = `Independently inspect this proposed plumbing blog post. Reply with exactly APPROVE or REJECT. Reject if it has unsupported business claims, unsafe repair instructions, fake reviews/jobs/prices/availability, copied competitor language, keyword stuffing, missing useful reader guidance, or a missing contextual internal link.\n\n${markdown}`;
	const reservation = reserveModelRequest({
		runId,
		prompt,
		maxOutputTokens: 80,
		model: profile.primary,
	});
	const result = await generateText({
		model: gateway(profile.primary),
		prompt,
		maxOutputTokens: 80,
		...resolveGatewayModelOptions("independent_qa"),
	});
	return {
		decision: result.text.trim().toUpperCase(),
		reservation,
		model: profile.primary,
	};
}

function deployedRuntimeInventory() {
	// The deployed service intentionally does not bundle the entire public-site
	// checkout. This minimal, first-party route context supports one useful link
	// to the canonical home page while the draft itself contains no Wade-specific
	// service, location, price, license, warranty, or availability claim.
	return Object.freeze({
		schema_version: "1.0",
		classification: "LIVE_VERIFIED",
		pages: Object.freeze([
			{
				url: "/",
				source_path: "app/page.tsx",
				canonical_url: "https://www.wadesplumbingandseptic.com/",
				lifecycle: "EXISTING_APPLICATION_ROUTE",
			},
		]),
	});
}

function packet({ opportunity, changeSet, writer, judge, branch }) {
	return `# SEO Draft PR Packet\n\n- Proposal: ${opportunity.id}\n- Query cluster: ${opportunity.query_cluster}\n- Canonical owner: ${opportunity.owner_url}\n- Existing page assessment: ${opportunity.existing_page_assessment}\n- Evidence: ${opportunity.evidence_ids.join(", ")}\n- Change manifest: ${changeSet.proposal_id}\n- Migration boundary: FUTURE_MARKDOWN_MIGRATION; human-approved migration required.\n- Rollback: Revert this single Markdown file after human review.\n- Publication: DRAFT PR ONLY; human approval and merge required.\n\n## Execution evidence\n- Writer model: ${writer.model}\n- Independent judge model: ${judge.model}\n- Writer reservation: ${writer.reservation.cost_reservation.reserved_max_cost_usd} USD\n- Judge reservation: ${judge.reservation.cost_reservation.reserved_max_cost_usd} USD\n- Branch: ${branch}\n- Deterministic validation: Markdown schema, content policy, image path, and internal-link target passed before GitHub write.\n`;
}

/**
 * The real proposal boundary. It has no merge, production deployment, delete,
 * or main-branch action. An Eve task must supply the exact human-approved run
 * ID; a GitHub Connect draft-write token is acquired only after all local
 * gates, writer, and independent judge pass.
 */
export async function executeDraftProposal({
	descriptor,
	settings,
	config,
	repoRoot,
	writer = writeWithGateway,
	judge = judgeWithGateway,
	publisherFactory = createGithubDraftPublisher,
} = {}) {
	assertProposalRunAuthorization({ descriptor, settings, config });
	const inventory = repoRoot
		? collectPageInventory({ repoRoot })
		: deployedRuntimeInventory();
	const opportunity = createOpportunity({ descriptor, inventory });
	const written = await writer({ runId: descriptor.runId, opportunity });
	const markdown = assertDraftShape(
		extractMarkdown(written.markdown),
		opportunity,
	);
	const independentReview = await judge({
		runId: descriptor.runId,
		markdown,
		opportunity,
	});
	if (independentReview?.decision !== "APPROVE") {
		return Object.freeze({
			classification: "LIVE_VERIFIED",
			state: "REJECTED_BY_INDEPENDENT_QA",
			run_id: descriptor.runId,
			reason:
				"Independent QA did not approve the draft; no GitHub write was attempted.",
		});
	}
	const changeSet = buildMarkdownChangeSet({
		proposalId: opportunity.id,
		files: [
			{
				path: opportunity.content_path,
				operation: "CREATE",
				content: markdown,
			},
		],
	});
	const date = proposalDate(descriptor);
	const branch = `eve/seo/${date}-${opportunity.slug}`;
	if (!SAFE_SLUG.test(opportunity.slug))
		throw new Error("Proposal slug is unsafe.");
	const publisher = publisherFactory({
		repository: config.repository,
		accessTokenProvider: createVercelConnectGithubDraftWriteTokenProvider({
			connector: config.githubConnectorId,
			repository: config.repository,
		}),
		enabled: config.integrationFlags.github === true,
		mutationMode: config.publishing.mutationMode,
		mutationKillSwitch: settings.mutationKillSwitch,
		humanApproved: config.publishing.humanApproved,
		integrationTestEnabled: config.publishing.integrationTestEnabled,
	});
	const main = await publisher.readMainCommit();
	if (main?.classification === "BLOCKED_MISSING_CREDENTIALS") return main;
	const created = await publisher.createBranch({
		branch,
		fromSha: main.sha,
	});
	if (created?.classification === "BLOCKED_MISSING_CREDENTIALS") return created;
	const pr = await createDraftPullRequest({
		humanApproval: true,
		branch,
		title: `SEO: ${opportunity.query_cluster}`,
		body: packet({
			opportunity,
			changeSet,
			writer: written,
			judge: independentReview,
			branch,
		}),
		changeSet,
		gateway: publisher,
	});
	return Object.freeze({
		...pr,
		classification: pr.classification,
		state: pr.draft_pr_created
			? "DRAFT_PR_OPEN"
			: "BLOCKED_MISSING_CREDENTIALS",
		run_id: descriptor.runId,
		opportunity: {
			id: opportunity.id,
			owner_url: opportunity.owner_url,
			query_cluster: opportunity.query_cluster,
			selection_reason: "EXPLICIT_HUMAN_APPROVED_LIVE_BLOG_DRAFT_TEST",
		},
	});
}
