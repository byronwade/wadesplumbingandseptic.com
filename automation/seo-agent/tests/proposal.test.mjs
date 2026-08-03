import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { executeDraftProposal } from "../src/proposal.mjs";
import {
	BLOG_QUALITY_THRESHOLDS,
	selectBlogOpportunity,
} from "../src/blog-opportunity.mjs";
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
		.slice(0, 4)
		.map((link) => `See [${link.anchor}](${link.to}) for next steps.`)
		.join("\n\n");
	const cover = opportunity.must_cover
		.map((point) => {
			const detail = `${point}. In Santa Cruz County, coastal moisture, mixed housing ages, and septic parcels change what a careful homeowner should check first. Give the observation, the safe limit, and the professional handoff without inventing prices.`;
			return `## ${point.slice(0, 48)}\n\n${detail}\n\n${detail}\n\n${detail}`;
		})
		.join("\n\n");
	const faqs = opportunity.people_also_ask
		.map(
			(question) =>
				`### ${question}\n\nProvide a useful Santa Cruz County answer and a safe next action.`,
		)
		.join("\n\n");
	const filler = Array.from({ length: 28 }, (_, index) => {
		return `Depth block ${index + 1}: Santa Cruz County homeowners can use calm checks, keep grease out of drains, watch for leaks, and stop before unsafe DIY work while still getting enough detail to act.`;
	}).join("\n\n");
	return `---
title: ${opportunity.click_title}
description: "${opportunity.meta_hook}"
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

# ${opportunity.click_title}

${opportunity.angle} ${opportunity.unique_value}

## Quick Answer for Santa Cruz County Homeowners

- Inspect early.
- Avoid unsafe shortcuts.
- Use linked service pages when risk rises.
- Keep photos before a visit.
- Match habits to local housing and septic patterns.

## What makes this guide different

${opportunity.unique_value}

${cover}

## Prevention habits that help

${filler}

## FAQ

${faqs}

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
	assert.equal(BLOG_QUALITY_THRESHOLDS.min_body_words >= 1400, true);
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
