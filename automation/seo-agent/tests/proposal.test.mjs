import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { executeDraftProposal } from "../src/proposal.mjs";
import { selectBlogOpportunity } from "../src/blog-opportunity.mjs";
import { collectPageInventory } from "../src/inventory.mjs";
import { createRunDescriptor, loadRuntimeSettings } from "../src/runtime.mjs";

const repoRoot = resolve(import.meta.dirname, "../../..");
const env = Object.freeze({
	SEO_AGENT_ENV: "production",
	SEO_AGENT_FORCE_OBSERVE: "true",
	SEO_AGENT_RUN_MODE: "propose",
	SEO_AGENT_MUTATION_KILL_SWITCH: "false",
	CRON_SECRET: "this-is-a-long-fixture-cron-secret-value",
});

function config() {
	return {
		repository: "byronwade/wadesplumbingandseptic.com",
		githubConnectorId: "github/wadesplumbingandseptic-com",
		integrationFlags: { github: true },
		publishing: {
			mutationMode: "enabled",
		},
	};
}

function richDraft(opportunity) {
	const links = opportunity.internal_links
		.slice(0, 3)
		.map((link) => `See [${link.anchor}](${link.to}) for next steps.`)
		.join("\n\n");
	const paragraphs = Array.from({ length: 40 }, (_, index) => {
		return `Section detail ${index + 1}: Santa Cruz County homeowners can use calm checks, keep grease out of drains, watch for leaks, and stop before unsafe DIY work. Useful local context beats generic filler while avoiding prices, licenses, and guarantees.`;
	}).join("\n\n");
	return `---
title: ${opportunity.title_hint}
description: Practical Santa Cruz County guidance for ${opportunity.query_cluster}.
category: ${opportunity.category}
date: "2026-08-01"
tags:
  - santa cruz
  - plumbing maintenance
image: ${opportunity.image}
imageAlt: "${opportunity.image_alt}"
canonical: ${opportunity.owner_url}
query_cluster: ${opportunity.query_cluster}
evidence_ids: [${opportunity.evidence_ids.join(", ")}]
---

# ${opportunity.title_hint}

${paragraphs}

## Quick Answer for Santa Cruz County Homeowners

- Inspect early.
- Avoid unsafe shortcuts.
- Use linked service pages when risk rises.

## Local context

Santa Cruz County homes mix coastal moisture, older plumbing, and septic parcels.

## Safe checks

Look for drips, odors, and weak flow without forcing fittings.

## Prevention

Keep wipes and grease out of plumbing pathways.

## When to get help

Stop if sewage, active flooding, or gas odors appear.

## FAQ

### Is this emergency advice?

No. It is calm maintenance guidance for ordinary issues.

### Can I invent a price?

No. This draft never quotes prices.

### What page should I open next?

Use the contact link after reviewing the service pages below.

${links}

Visit [contact](/contact) when you want professional help.
`;
}

function publisherFactory(calls) {
	return () => ({
		async readMainCommit() {
			calls.push(["main"]);
			return {
				classification: "MOCK_VERIFIED",
				branch: "main",
				sha: "b".repeat(40),
				write_performed: false,
			};
		},
		async createBranch({ branch, fromSha }) {
			calls.push(["branch", branch, fromSha]);
			return {
				classification: "MOCK_VERIFIED",
				branch,
				base_sha: fromSha,
				write_performed: true,
			};
		},
		async stageMarkdownChangeSet({ branch }) {
			calls.push(["stage", branch]);
			return {
				classification: "MOCK_VERIFIED",
				branch,
				commit_sha: "a".repeat(40),
				write_performed: true,
			};
		},
		async createPullRequest({ branch, draft }) {
			calls.push(["pr", branch, draft]);
			return {
				classification: "MOCK_VERIFIED",
				draft,
				number: 101,
				url: "https://github.com/example/repo/pull/101",
			};
		},
	});
}

test("proposal opens one Connect-backed draft PR for a selected local topic", async () => {
	const descriptor = createRunDescriptor({
		job: "proposal",
		now: new Date("2026-08-01T12:00:00.000Z"),
	});
	const inventory = collectPageInventory({ repoRoot });
	const selection = selectBlogOpportunity({
		inventory,
		runId: descriptor.runId,
	});
	assert.equal(selection.decision, "PROPOSE_FOR_HUMAN_REVIEW");
	const calls = [];
	const result = await executeDraftProposal({
		descriptor,
		settings: loadRuntimeSettings(env),
		config: config(),
		repoRoot,
		writer: async ({ opportunity }) => ({
			markdown: richDraft(opportunity),
			reservation: { cost_reservation: { reserved_max_cost_usd: 0.2 } },
			model: "openai/gpt-5.6-terra",
		}),
		publisherFactory: publisherFactory(calls),
	});
	assert.equal(result.state, "DRAFT_PR_OPEN");
	assert.equal(result.draft_pr_created, true);
	assert.equal(calls.filter(([name]) => name === "branch").length, 1);
	assert.equal(calls.filter(([name]) => name === "pr").length, 1);
	assert.equal(calls[1][1], `eve/seo/2026-08-01-${selection.opportunity.slug}`);
	assert.match(result.opportunity.query_cluster, /Santa Cruz/i);
});

test("proposal rejects junk drafts instead of opening a Connect PR", async () => {
	const descriptor = createRunDescriptor({
		job: "proposal",
		now: new Date("2026-08-01T12:00:00.000Z"),
	});
	const calls = [];
	const result = await executeDraftProposal({
		descriptor,
		settings: loadRuntimeSettings(env),
		config: config(),
		repoRoot,
		writer: async () => ({
			markdown: "not a valid draft",
			reservation: { cost_reservation: { reserved_max_cost_usd: 0 } },
			model: "broken",
		}),
		publisherFactory: publisherFactory(calls),
	});
	assert.equal(result.state, "REJECTED_DRAFT_QUALITY");
	assert.equal(result.draft_pr_created, false);
	assert.equal(calls.length, 0);
});

test("non-proposal jobs cannot enter the draft publication workflow", async () => {
	const descriptor = createRunDescriptor({
		job: "audit",
		now: new Date("2026-08-01T12:00:00.000Z"),
	});
	await assert.rejects(
		() =>
			executeDraftProposal({
				descriptor,
				settings: loadRuntimeSettings(env),
				config: config(),
				repoRoot,
			}),
		/Only proposal jobs/,
	);
});
