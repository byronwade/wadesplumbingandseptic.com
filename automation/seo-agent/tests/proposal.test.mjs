import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { buildDraftPrBrief, executeDraftProposal } from "../src/proposal.mjs";
import { BLOG_QUALITY_THRESHOLDS } from "../src/blog-opportunity.mjs";
import { assertDraftPrPacket } from "../src/publishing.mjs";
import { buildMarkdownChangeSet } from "../src/markdown-change-set.mjs";
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
	const demandName = opportunity.demand_source?.name
		? `Community timing context: ${opportunity.demand_source.name} helps neighbors plan home prep.`
		: "";
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

${opportunity.angle} ${opportunity.unique_value} ${demandName}

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

async function fixtureTopicDecider({ candidates }) {
	return {
		topic_id: candidates[0].id,
		reason:
			"Fixture chooses the top ranked community-timed topic because local festival or holiday hosting demand is active and neighbors are searching for practical prep help.",
		why_over_others:
			"Other viable topics were evergreen or farther from the current lead window, so this one had a clearer near-term click reason for Santa Cruz County hosts.",
		seo_value:
			"The post can capture informational queries around a timed local event, then pass readers into drain cleaning, leak detection, and contact pages through contextual internal links.",
		mode: "MODEL_DECIDED",
	};
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
		async createPullRequest({ branch, draft, body, title }) {
			calls.push(["pr", branch, draft, body, title]);
			return {
				classification: "MOCK_VERIFIED",
				draft,
				number: 101,
				url: "https://github.com/example/repo/pull/101",
			};
		},
	});
}

test("proposal opens one Connect-backed draft PR for a demand-timed local topic", async () => {
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
		now: new Date("2026-08-01T12:00:00.000Z"),
		browserResearch: null,
		topicDecider: fixtureTopicDecider,
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
	assert.match(
		calls.find(([name]) => name === "branch")[1],
		/^eve\/seo\/2026-08-01-/,
	);
	assert.equal(
		result.opportunity.selection_reason,
		"DEMAND_TIMED_LOCAL_EVENT_OR_HOLIDAY",
	);
	assert.equal(result.topic_decision.mode, "MODEL_DECIDED");
	assert.equal(result.demand.calendar_loaded, true);
	assert.equal(result.demand.trends_loaded, true);
	assert.equal(result.demand.research_mode, "CALENDAR_ONLY");
	assert.equal(Boolean(result.opportunity.demand_source?.name), true);
	assert.match(
		result.opportunity.query_cluster,
		/Santa Cruz|Capitola|Labor Day|Fair|Festival|Open Studios|hard water|vacation|ADU|storm/i,
	);
	assert.equal(BLOG_QUALITY_THRESHOLDS.min_body_words >= 1400, true);
	const prBody = calls.find(([name]) => name === "pr")[3];
	assert.match(prBody, /## What Eve did this run/);
	assert.match(prBody, /## Why this blog post matters now/);
	assert.match(prBody, /## Why Eve chose this over the other options/);
	assert.match(prBody, /## How this helps SEO/);
	assert.match(prBody, /Other viable topics Eve could have drafted instead/);
	assert.match(prBody, /Expected outcome after human merge/);
	assert.match(prBody, /near-term click reason|community-timed|lead window/i);
});

test("draft PR brief is detailed and keeps required packet markers", () => {
	const changeSet = buildMarkdownChangeSet({
		proposalId: "proposal-brief-fixture",
		files: [
			{
				path: "content/posts/fixture-brief.md",
				operation: "CREATE",
				content: `---
title: Fixture Brief
description: "Santa Cruz County fixture brief for packet marker coverage."
category: Plumbing Tips
date: "2026-08-01"
canonical: /fixture-brief
query_cluster: fixture brief Santa Cruz
evidence_ids: [fixture]
---

# Fixture Brief

Santa Cruz County fixture body for packet tests.
`,
			},
		],
	});
	const body = buildDraftPrBrief({
		opportunity: {
			id: "proposal-brief-fixture",
			slug: "capitola-art-wine-weekend-home-plumbing-prep",
			owner_url: "/capitola-art-wine-weekend-home-plumbing-prep",
			content_path:
				"content/posts/capitola-art-wine-weekend-home-plumbing-prep.md",
			query_cluster: "Capitola Art and Wine Festival weekend plumbing prep",
			click_title:
				"Art & Wine Weekend Home Prep for Capitola and Santa Cruz Hosts",
			search_intent: "informational_to_service",
			unique_value:
				"Connect festival weekend hosting to practical plumbing prep.",
			angle: "Help hosts prep bathrooms and kitchens before guests arrive.",
			community_context:
				"Capitola Art & Wine Festival is a local community weekend.",
			must_cover: ["guest bathroom checks", "kitchen disposal limits"],
			people_also_ask: [
				"How can festival weekend guests stress home plumbing?",
			],
			existing_page_assessment: "EXISTING_INSUFFICIENT",
			existing_page_decision: "CREATE_JUSTIFIED",
			evidence_ids: ["repository-inventory", "local-demand-calendar"],
			internal_links: [
				{
					to: "/service-area/capitola-ca-plumbing-septic-services",
					anchor: "capitola service area",
					reader_rationale: "Local next step for Capitola hosts.",
				},
				{
					to: "/service-offerings/drain-cleaning",
					anchor: "drain cleaning",
					reader_rationale: "Helps readers act on clog risk.",
				},
				{
					to: "/contact",
					anchor: "contact",
					reader_rationale: "Clear path to request help.",
				},
				{
					to: "/how-to-avoid-common-holiday-plumbing-disasters",
					anchor: "holiday plumbing",
					reader_rationale: "Related hosting guidance.",
				},
			],
			decision_notes: "Chose Art & Wine because the lead window is active.",
			research_notes: "Calendar-only research for this fixture.",
			demand_source: {
				kind: "LOCAL_EVENT",
				name: "Capitola Art & Wine Festival",
				date: "2026-09-12",
				lead_time_days: 42,
			},
		},
		changeSet,
		writer: {
			model: "openai/gpt-5.6-terra",
			reservation: { cost_reservation: { reserved_max_cost_usd: 0.2 } },
		},
		branch: "eve/seo/2026-08-01-capitola-art-wine-weekend-home-plumbing-prep",
		quality: {
			word_count: 1600,
			faq_questions: 5,
			internal_links: [
				"/service-area/capitola-ca-plumbing-septic-services",
				"/service-offerings/drain-cleaning",
				"/contact",
				"/how-to-avoid-common-holiday-plumbing-disasters",
			],
		},
		demandContext: {
			research: {
				mode: "CALENDAR_ONLY",
				classification: "MOCK_VERIFIED",
			},
			active_demand: [
				{
					name: "Capitola Art & Wine Festival",
					kind: "LOCAL_EVENT",
					lead_time_days: 42,
				},
				{ name: "Labor Day", kind: "HOLIDAY", lead_time_days: 37 },
			],
			active_trends: [
				{
					name: "hard water and coastal mineral scale",
					kind: "TRENDING_CONCEPT",
				},
			],
		},
		topicDecision: {
			mode: "MODEL_DECIDED",
			topic_id: "event-capitola-art-wine-2026",
			reason:
				"Art & Wine weekend is an active Santa Cruz County community moment with hosting load.",
			why_over_others:
				"Labor Day was close, but Art & Wine had a stronger local-event click hook for Capitola and nearby hosts.",
			seo_value:
				"The post can win informational festival-weekend queries and route readers into Capitola service and drain pages.",
			model: "openai/gpt-5.6-terra",
		},
		considered: [
			{
				id: "event-capitola-art-wine-2026",
				viable: true,
				score: 32,
				click_title: "Art & Wine Weekend Home Prep",
				demand_kind: "LOCAL_EVENT",
				demand_name: "Capitola Art & Wine Festival",
			},
			{
				id: "holiday-labor-day-2026",
				viable: true,
				score: 29,
				click_title: "Labor Day Weekend Plumbing Prep",
				demand_kind: "HOLIDAY",
				demand_name: "Labor Day",
			},
			{
				id: "tankless-water-heater-maintenance-santa-cruz",
				viable: false,
				score: 24,
				click_title: "Tankless Water Heater Maintenance",
				conflict: null,
				link_count: 2,
			},
		],
		selectionReason: "DEMAND_TIMED_LOCAL_EVENT_OR_HOLIDAY",
	});
	assertDraftPrPacket({
		title: "SEO: Capitola Art and Wine Festival weekend plumbing prep",
		body,
		changeSet,
	});
	assert.match(body, /Why Eve chose this over the other options/);
	assert.match(body, /holiday-labor-day-2026/);
	assert.match(body, /How this helps SEO/);
	assert.match(body, /stronger local-event click hook/);
	assert.equal(body.includes("\u2014"), false);
	assert.equal(body.includes("\u2013"), false);
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
		now: new Date("2026-08-01T12:00:00.000Z"),
		browserResearch: null,
		topicDecider: fixtureTopicDecider,
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

test("proposal expands a good thin draft instead of rewriting from scratch", async () => {
	const descriptor = createRunDescriptor({
		job: "proposal",
		now: new Date("2026-08-01T12:00:00.000Z"),
	});
	const calls = [];
	let reviserCalls = 0;
	const result = await executeDraftProposal({
		descriptor,
		settings: loadRuntimeSettings(env),
		config: config(),
		repoRoot,
		now: new Date("2026-08-01T12:00:00.000Z"),
		browserResearch: null,
		topicDecider: fixtureTopicDecider,
		writer: async ({ opportunity }) => {
			const links = opportunity.internal_links
				.slice(0, 4)
				.map((link) => `See [${link.anchor}](${link.to}) for next steps.`)
				.join("\n\n");
			const faqs = opportunity.people_also_ask
				.map((question) => `### ${question}\n\nShort Santa Cruz County answer.`)
				.join("\n\n");
			// Good concept and structure, intentionally too thin for the SEO depth bar.
			const thin = `---
title: ${opportunity.click_title}
description: "${opportunity.meta_hook}"
category: ${opportunity.category}
date: "2026-08-01"
tags:
  - santa cruz
image: ${opportunity.image}
imageAlt: "${opportunity.image_alt}"
canonical: ${opportunity.owner_url}
query_cluster: ${opportunity.query_cluster}
evidence_ids: [${opportunity.evidence_ids.join(", ")}]
---

# ${opportunity.click_title}

${opportunity.angle} ${opportunity.unique_value}
Community timing context: ${opportunity.demand_source?.name ?? "Santa Cruz County"}.

## Quick Answer for Santa Cruz County Homeowners

- Inspect early.
- Avoid unsafe shortcuts.
- Use linked service pages when risk rises.
- Keep photos before a visit.

## What makes this guide different

${opportunity.unique_value}

## Prep notes

Keep the concept. Add more later.

## Hosting checks

Check bathrooms before guests arrive in Santa Cruz County.

## Kitchen habits

Watch grease and disposals.

## When to stop DIY

Stop before unsafe work.

## FAQ

${faqs}

${links}

Visit [contact](/contact) when you want professional help.
`;
			return {
				markdown: thin,
				reservation: { cost_reservation: { reserved_max_cost_usd: 0.1 } },
				model: "thin-writer",
			};
		},
		reviser: async ({ markdown, peerReview, opportunity }) => {
			reviserCalls += 1;
			assert.equal(peerReview.mode, "EXPAND_EXISTING_DRAFT");
			assert.match(
				markdown,
				new RegExp(
					opportunity.click_title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
				),
			);
			assert.match(markdown, /Keep the concept/);
			return {
				markdown: richDraft(opportunity),
				reservation: { cost_reservation: { reserved_max_cost_usd: 0.05 } },
				model: "expand-reviser",
			};
		},
		publisherFactory: publisherFactory(calls),
	});
	assert.equal(result.state, "DRAFT_PR_OPEN");
	assert.equal(reviserCalls >= 1, true);
	assert.equal(result.revision.expanded, true);
	assert.equal(result.revision.publishable, true);
	const prBody = calls.find(([name]) => name === "pr")[3];
	assert.match(prBody, /expanded weak portions instead of rewriting/i);
	assert.match(prBody, /Peer-review \/ expansion rounds/);
	assert.match(prBody, /Round 1/);
});

test("fatal claim failures do not enter the expand path", async () => {
	const descriptor = createRunDescriptor({
		job: "proposal",
		now: new Date("2026-08-01T12:00:00.000Z"),
	});
	let reviserCalls = 0;
	const result = await executeDraftProposal({
		descriptor,
		settings: loadRuntimeSettings(env),
		config: config(),
		repoRoot,
		now: new Date("2026-08-01T12:00:00.000Z"),
		browserResearch: null,
		topicDecider: fixtureTopicDecider,
		writer: async ({ opportunity }) => ({
			markdown: `${richDraft(opportunity)}\n\nWe are licensed insured and available 24/7 for $99.\n`,
			reservation: { cost_reservation: { reserved_max_cost_usd: 0.1 } },
			model: "claim-writer",
		}),
		reviser: async () => {
			reviserCalls += 1;
			throw new Error("reviser should not run for fatal claim failures");
		},
		publisherFactory: publisherFactory([]),
	});
	assert.equal(result.state, "REJECTED_DRAFT_QUALITY");
	assert.equal(result.reason, "UNSUPPORTED_MARKETING_CLAIM");
	assert.equal(reviserCalls, 0);
});

test("proposal honors Eve topic decisions over score order", async () => {
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
		now: new Date("2026-08-01T12:00:00.000Z"),
		browserResearch: null,
		topicDecider: async ({ candidates }) => {
			const labor = candidates.find((topic) => topic.id.includes("labor-day"));
			assert.equal(Boolean(labor), true);
			return {
				topic_id: labor.id,
				reason: "Labor Day hosting prep is the stronger near-term click path.",
				why_over_others:
					"Eve preferred Labor Day over the higher-scoring festival topic for this fixture because end-of-summer hosting is immediate.",
				seo_value:
					"A Labor Day prep post can capture late-summer hosting queries and link into drain and septic service pages.",
				mode: "MODEL_DECIDED",
			};
		},
		writer: async ({ opportunity }) => ({
			markdown: richDraft(opportunity),
			reservation: { cost_reservation: { reserved_max_cost_usd: 0.2 } },
			model: "openai/gpt-5.6-terra",
		}),
		publisherFactory: publisherFactory(calls),
	});
	assert.equal(result.state, "DRAFT_PR_OPEN");
	assert.match(result.opportunity.query_cluster, /Labor Day/i);
	assert.equal(result.topic_decision.mode, "MODEL_DECIDED");
	assert.match(result.topic_decision.reason, /Labor Day/i);
	const prBody = calls.find(([name]) => name === "pr")[3];
	assert.match(prBody, /Why Eve chose this over the other options/);
	assert.match(prBody, /end-of-summer hosting is immediate/);
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

test("proposal soft-fails Search Console topic wiring when adapter is absent", async () => {
	const descriptor = createRunDescriptor({
		job: "proposal",
		scheduledAt: "2026-08-03T12:00:00.000Z",
		runId: "proposal-gsc-soft-fail",
	});
	const settings = loadRuntimeSettings(env);
	const result = await executeDraftProposal({
		descriptor,
		settings,
		config: config(),
		repoRoot,
		browserResearch: null,
		searchConsole: null,
		topicDecider: async ({ candidates }) => ({
			topic_id: candidates[0].id,
			reason: "Fixture chooses the first viable topic.",
			why_over_others: "Offline fixture path.",
			seo_value: "Keeps proposal tests deterministic.",
		}),
		writer: async ({ opportunity }) => ({
			markdown: richDraft(opportunity),
			model: "fixture-writer",
			reservation: { reserved: 1 },
		}),
		publisherFactory: () => ({
			async readMainCommit() {
				return { sha: "a".repeat(40), classification: "LIVE_VERIFIED" };
			},
			async createBranch() {
				return { classification: "LIVE_VERIFIED" };
			},
			async commitFiles() {
				return { classification: "LIVE_VERIFIED" };
			},
			async openDraftPullRequest() {
				return {
					classification: "LIVE_VERIFIED",
					draft_pr_created: true,
					pull_request: { number: 1, html_url: "https://example.test/pr/1" },
				};
			},
		}),
	});
	assert.equal(
		result.search_console_topics.classification,
		"BLOCKED_MISSING_CREDENTIALS",
	);
	assert.equal(result.search_console_topics.matched_topic_count, 0);
	assert.equal(
		result.pagespeed_qa.classification,
		"BLOCKED_MISSING_CREDENTIALS",
	);
	assert.equal(result.pagespeed_qa.status, null);
});

test("proposal soft-fails PageSpeed QA wiring when adapter is absent", async () => {
	const descriptor = createRunDescriptor({
		job: "proposal",
		scheduledAt: "2026-08-03T12:00:00.000Z",
		runId: "proposal-pagespeed-qa-soft-fail",
	});
	const settings = loadRuntimeSettings(env);
	const calls = [];
	const result = await executeDraftProposal({
		descriptor,
		settings,
		config: config(),
		repoRoot,
		browserResearch: null,
		searchConsole: null,
		pagespeed: null,
		topicDecider: async ({ candidates }) => ({
			topic_id: candidates[0].id,
			reason: "Fixture chooses the first viable topic.",
			why_over_others: "Offline fixture path.",
			seo_value: "Keeps proposal tests deterministic.",
		}),
		writer: async ({ opportunity }) => ({
			markdown: richDraft(opportunity),
			model: "fixture-writer",
			reservation: { reserved: 1 },
		}),
		publisherFactory: publisherFactory(calls),
	});
	assert.equal(
		result.pagespeed_qa.classification,
		"BLOCKED_MISSING_CREDENTIALS",
	);
	assert.equal(result.draft_pr_created, true);
	const prBody = calls.find(([name]) => name === "pr")[3];
	assert.match(prBody, /Preview \/ performance QA/);
	assert.match(prBody, /PageSpeed QA/);
});
