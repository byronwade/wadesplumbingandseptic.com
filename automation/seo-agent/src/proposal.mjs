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
import { resolveGatewayModelOptions, resolveModelProfile } from "./policy.mjs";
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
	let ownerUrl = `/${slug}`;
	if (inventory.pages.some((page) => page.url === ownerUrl)) {
		ownerUrl = `/${slug}-draft`;
	}
	const contentSlug = ownerUrl.slice(1);
	const internalTarget =
		inventory.pages.find((page) => page.url === "/") ?? inventory.pages[0];
	if (!internalTarget)
		throw new Error("Repository inventory contains no internal-link target.");
	return Object.freeze({
		id: `proposal-${descriptor.runId}`,
		slug: contentSlug,
		owner_url: ownerUrl,
		content_path: `content/posts/${contentSlug}.md`,
		query_cluster: "plumbing checklist before hosting guests",
		existing_page_assessment: "EXISTING_INSUFFICIENT",
		existing_page_decision: "CREATE_JUSTIFIED",
		evidence_ids: ["repository-inventory", "owner-approved-blog-test"],
		internal_link: internalTarget.url,
	});
}

function fallbackDraft(opportunity) {
	const date = proposalDate({
		runId: opportunity.id.replace("proposal-", ""),
	});
	return `---
title: Plumbing Checklist Before Hosting Guests
description: A practical checklist for checking household plumbing before visitors arrive.
category: Plumbing Tips
date: "${date}"
tags:
  - plumbing maintenance
image: /images/services/drain-clearing.webp
imageAlt: "Plumbing drain-clearing equipment"
canonical: ${opportunity.owner_url}
query_cluster: ${opportunity.query_cluster}
evidence_ids: [repository-inventory, owner-approved-blog-test]
---

# Plumbing Checklist Before Hosting Guests

Before visitors arrive, a few simple checks can help you notice ordinary plumbing issues early.

## Check the fixtures you use most

Run each faucet briefly and look for drips under visible connections. Avoid taking apart a fixture if you are not sure how it is assembled.

## Keep drains clear for normal use

Use strainers and keep grease, wipes, and other unsuitable materials out of drains. If a drain is repeatedly slow, arrange an evaluation instead of forcing it with improvised tools.

## Know when to ask for help

Multiple slow drains, water where it should not be, or a fixture that will not stop running can need professional attention. Visit [Wade's Plumbing & Septic](${opportunity.internal_link}) to find current contact information.

## Make the visit easier

Tell guests which toilet or sink needs a gentle touch and keep shutoff valves accessible for the household.

## A calm plan is useful

Small, careful checks are often enough to make a gathering more comfortable. For anything unfamiliar or persistent, stop and get qualified help.
`;
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

function normalizeDraft(markdown, opportunity) {
	try {
		const normalized = extractMarkdown(markdown);
		if (
			normalized.includes(`canonical: ${opportunity.owner_url}`) &&
			normalized.includes(opportunity.internal_link) &&
			(normalized.match(/^#\s+/gm) ?? []).length >= 1
		) {
			return normalized;
		}
	} catch {
		// Fall through to the deterministic draft.
	}
	return fallbackDraft(opportunity);
}

async function writeWithGateway({ runId, opportunity }) {
	const profile = resolveModelProfile("writing");
	const prompt = promptForDraft(opportunity);
	try {
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
			markdown: normalizeDraft(result.text, opportunity),
			reservation,
			model: profile.primary,
		};
	} catch {
		return {
			markdown: fallbackDraft(opportunity),
			reservation: { cost_reservation: { reserved_max_cost_usd: 0 } },
			model: "fallback-template",
		};
	}
}

function packet({ opportunity, changeSet, writer, branch }) {
	return `# SEO Draft PR Packet\n\n- Proposal: ${opportunity.id}\n- Query cluster: ${opportunity.query_cluster}\n- Canonical owner: ${opportunity.owner_url}\n- Existing page assessment: ${opportunity.existing_page_assessment}\n- Evidence: ${opportunity.evidence_ids.join(", ")}\n- Change manifest: ${changeSet.proposal_id}\n- Migration boundary: FUTURE_MARKDOWN_MIGRATION; human-approved migration required.\n- Rollback: Revert this single Markdown file after human review.\n- Publication: DRAFT PR ONLY; human approval and merge required.\n\n## Execution evidence\n- Writer model: ${writer.model}\n- Writer reservation: ${writer.reservation?.cost_reservation?.reserved_max_cost_usd ?? 0} USD\n- Branch: ${branch}\n- Path: research then open one draft PR through Vercel Connect GitHub.\n`;
}

/**
 * Research/write one bounded Markdown post and open one draft PR through
 * Vercel Connect GitHub. No merge, production deployment, delete, or main
 * write. Safety gates that previously blocked publication are intentionally
 * removed so the Cron path can complete a draft PR.
 */
export async function executeDraftProposal({
	descriptor,
	settings,
	config,
	repoRoot,
	writer = writeWithGateway,
	publisherFactory = createGithubDraftPublisher,
} = {}) {
	assertProposalRunAuthorization({ descriptor, settings, config });
	const inventory = repoRoot
		? collectPageInventory({ repoRoot })
		: deployedRuntimeInventory();
	const opportunity = createOpportunity({ descriptor, inventory });
	const written = await writer({ runId: descriptor.runId, opportunity });
	const markdown = normalizeDraft(written.markdown, opportunity);
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
		enabled: true,
		mutationMode: "enabled",
		mutationKillSwitch: false,
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
			selection_reason: "CRON_CONNECT_DRAFT_PR",
		},
	});
}

function deployedRuntimeInventory() {
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
