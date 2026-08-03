import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { executeDraftProposal } from "../src/proposal.mjs";
import { createRunDescriptor, loadRuntimeSettings } from "../src/runtime.mjs";

const repoRoot = resolve(import.meta.dirname, "../../..");
const env = Object.freeze({
	SEO_AGENT_ENV: "production",
	// Keep explicit env control for gate tests; standing Production propose is
	// covered in runtime tests.
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

function draft({ opportunity }) {
	return `---
title: Plumbing Checklist Before Hosting Guests
description: A practical checklist for checking household plumbing before visitors arrive.
category: Plumbing Tips
date: "2026-08-01"
tags:
  - plumbing maintenance
image: /images/services/drain-clearing.webp
imageAlt: "Plumbing drain-clearing equipment"
canonical: ${opportunity.owner_url}
query_cluster: plumbing checklist before hosting guests
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

test("proposal opens one Connect-backed draft PR when propose mode is armed", async () => {
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
		writer: async (input) => ({
			markdown: draft(input),
			reservation: { cost_reservation: { reserved_max_cost_usd: 0.2 } },
			model: "openai/gpt-5.6-terra",
		}),
		judge: async () => ({
			decision: "APPROVE",
			reservation: { cost_reservation: { reserved_max_cost_usd: 0.2 } },
			model: "anthropic/claude-sonnet-4.6",
		}),
		publisherFactory: publisherFactory(calls),
	});
	assert.equal(result.state, "DRAFT_PR_OPEN");
	assert.equal(result.draft_pr_created, true);
	assert.equal(calls.filter(([name]) => name === "branch").length, 1);
	assert.equal(calls.filter(([name]) => name === "pr").length, 1);
	assert.equal(
		calls[1][1],
		"eve/seo/2026-08-01-home-plumbing-hosting-checklist-2026-08-01",
	);
});

test("proposal cannot write when GitHub Connect is disabled, mutation is off, or QA rejects", async () => {
	const descriptor = createRunDescriptor({
		job: "proposal",
		now: new Date("2026-08-01T12:00:00.000Z"),
	});
	await assert.rejects(
		() =>
			executeDraftProposal({
				descriptor,
				settings: loadRuntimeSettings(env),
				config: {
					...config(),
					integrationFlags: { github: false },
				},
				repoRoot,
			}),
		/SEO_AGENT_ENABLE_GITHUB=true/,
	);
	await assert.rejects(
		() =>
			executeDraftProposal({
				descriptor,
				settings: loadRuntimeSettings(env),
				config: {
					...config(),
					publishing: { mutationMode: "disabled" },
				},
				repoRoot,
			}),
		/SEO_AGENT_MUTATION_MODE=enabled/,
	);
	await assert.rejects(
		() =>
			executeDraftProposal({
				descriptor,
				settings: loadRuntimeSettings({
					...env,
					SEO_AGENT_MUTATION_KILL_SWITCH: "true",
				}),
				config: config(),
				repoRoot,
			}),
		/SEO_AGENT_MUTATION_KILL_SWITCH=false/,
	);
	const calls = [];
	const result = await executeDraftProposal({
		descriptor,
		settings: loadRuntimeSettings(env),
		config: config(),
		repoRoot,
		writer: async (input) => ({
			markdown: draft(input),
			reservation: { cost_reservation: { reserved_max_cost_usd: 0.2 } },
			model: "openai/gpt-5.6-terra",
		}),
		judge: async () => ({
			decision: "REJECT",
			reservation: {},
			model: "anthropic/claude-sonnet-4.6",
		}),
		publisherFactory: publisherFactory(calls),
	});
	assert.equal(result.state, "REJECTED_BY_INDEPENDENT_QA");
	assert.equal(calls.length, 0);
});
