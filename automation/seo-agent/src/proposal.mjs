import { generateText } from "ai";
import { gateway } from "@ai-sdk/gateway";
import {
	createBrowserResearchAdapter,
	createVercelConnectGithubDraftWriteTokenProvider,
} from "./adapters.mjs";
import {
	assertPublishableBlogDraft,
	BLOG_TOPIC_CATALOG,
	buildWriterPrompt,
	rankViableBlogTopics,
	selectBlogOpportunity,
} from "./blog-opportunity.mjs";
import { COMMUNITY_RESEARCH_DOMAINS } from "./constants.mjs";
import { buildDemandAwareTopicCatalog } from "./local-demand.mjs";
import { assertProposalRunAuthorization } from "./runtime.mjs";
import { collectPageInventory } from "./inventory.mjs";
import { buildMarkdownChangeSet } from "./markdown-change-set.mjs";
import {
	createGithubDraftPublisher,
	createDraftPullRequest,
} from "./publishing.mjs";
import { resolveGatewayModelOptions, resolveModelProfile } from "./policy.mjs";
import { reserveModelRequest } from "./model-budget.mjs";

function resolveProposalNow(descriptor, now) {
	if (now instanceof Date && Number.isFinite(now.valueOf())) return now;
	if (typeof descriptor?.scheduledAt === "string") {
		const scheduled = new Date(descriptor.scheduledAt);
		if (Number.isFinite(scheduled.valueOf())) return scheduled;
	}
	return new Date();
}

/**
 * Proposal runs always attach community research capability. Tests may pass
 * `browserResearch: null` to stay offline. Owners do not toggle this.
 */
function resolveBrowserResearch({ browserResearch, config }) {
	if (browserResearch !== undefined) return browserResearch;
	const domains = [
		...new Set([
			...COMMUNITY_RESEARCH_DOMAINS,
			...(config?.browserResearch?.allowedDomains ?? []),
		]),
	];
	return createBrowserResearchAdapter({
		enabled: true,
		allowedDomains: domains,
	});
}

function formatResearchNotes(research) {
	if (!research) return null;
	const lines = [
		`Research mode: ${research.mode} (${research.classification}).`,
		research.reason,
	];
	for (const observation of research.observations ?? []) {
		lines.push(
			`- ${observation.entry_id}: ${observation.classification} from ${observation.url}${
				observation.excerpt_present ? " (excerpt captured)" : ""
			}`,
		);
	}
	return lines.filter(Boolean).join("\n");
}

function parseTopicDecision(text, candidateIds) {
	if (typeof text !== "string" || !text.trim()) return null;
	const fenced = text
		.trim()
		.replace(/^```(?:json)?\s*/i, "")
		.replace(/\s*```$/, "");
	try {
		const parsed = JSON.parse(fenced);
		if (
			typeof parsed?.topic_id === "string" &&
			candidateIds.includes(parsed.topic_id)
		) {
			return Object.freeze({
				topic_id: parsed.topic_id,
				reason:
					typeof parsed.reason === "string" && parsed.reason.trim()
						? parsed.reason.trim().slice(0, 500)
						: "Model selected the strongest local click opportunity.",
			});
		}
	} catch {
		// Fall through to id scan.
	}
	for (const id of candidateIds) {
		if (text.includes(id)) {
			return Object.freeze({
				topic_id: id,
				reason: "Model named a viable topic id in free-form output.",
			});
		}
	}
	return null;
}

/**
 * Eve chooses which viable topic to draft. Deterministic score ranking is only
 * the fallback when the model cannot return a valid choice.
 */
async function decideTopicWithGateway({
	runId,
	candidates,
	research,
	considered,
}) {
	const profile = resolveModelProfile("writing");
	const payload = candidates.map((topic) => ({
		id: topic.id,
		slug: topic.slug,
		click_title: topic.click_title,
		query_cluster: topic.query_cluster,
		demand_kind: topic.demand_source?.kind ?? null,
		demand_name: topic.demand_source?.name ?? null,
		lead_time_days: topic.demand_source?.lead_time_days ?? null,
		unique_value: topic.unique_value,
		score_hint: considered.find((item) => item.id === topic.id)?.score ?? null,
	}));
	const prompt = `You are Eve, the autonomous SEO strategist for Wade's Plumbing & Septic in Santa Cruz County.

Choose exactly ONE blog topic to draft next. Prefer community-timed local events, holidays, and trending local concepts when they can earn clicks from neighbors. Prefer distinct helpful intent over generic checklists. Never invent sponsorship, prices, licenses, or service-area claims.

Research context:
${formatResearchNotes(research) ?? "Calendar and inventory only."}

Candidate topics (JSON):
${JSON.stringify(payload, null, 2)}

Return ONLY JSON:
{"topic_id":"<exact id>","reason":"<one or two sentences>"}`;
	const maxOutputTokens = 400;
	const reservation = reserveModelRequest({
		runId,
		prompt,
		maxOutputTokens,
		model: profile.primary,
	});
	const result = await generateText({
		model: gateway(profile.primary),
		prompt,
		maxOutputTokens,
		...resolveGatewayModelOptions("writing"),
	});
	const decision = parseTopicDecision(
		result.text,
		candidates.map((topic) => topic.id),
	);
	if (!decision) {
		throw new Error("Topic decision model did not return a viable topic_id.");
	}
	return Object.freeze({
		...decision,
		model: profile.primary,
		reservation,
		mode: "MODEL_DECIDED",
	});
}

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_DRAFT_CHARACTERS = 18_000;

function proposalDate(descriptor) {
	return descriptor.runId.slice(-10);
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

async function writeWithGateway({ runId, opportunity, date }) {
	const profile = resolveModelProfile("writing");
	const prompt = buildWriterPrompt({ opportunity, date });
	const maxOutputTokens = 6_500;
	const reservation = reserveModelRequest({
		runId,
		prompt,
		maxOutputTokens,
		model: profile.primary,
	});
	try {
		const result = await generateText({
			model: gateway(profile.primary),
			prompt,
			maxOutputTokens,
			...resolveGatewayModelOptions("writing"),
		});
		return {
			markdown: extractMarkdown(result.text),
			reservation,
			model: profile.primary,
		};
	} catch (error) {
		const secondary = profile.fallbacks?.[0];
		if (!secondary) throw error;
		const fallbackReservation = reserveModelRequest({
			runId,
			prompt,
			maxOutputTokens,
			model: secondary,
		});
		const result = await generateText({
			model: gateway(secondary),
			prompt,
			maxOutputTokens,
			...resolveGatewayModelOptions("writing"),
		});
		return {
			markdown: extractMarkdown(result.text),
			reservation: fallbackReservation,
			model: secondary,
		};
	}
}

function packet({
	opportunity,
	changeSet,
	writer,
	branch,
	quality,
	demandContext,
	topicDecision,
}) {
	const links = opportunity.internal_links
		.map((link) => `${link.to} (${link.anchor})`)
		.join("; ");
	const demand = opportunity.demand_source
		? `${opportunity.demand_source.kind}: ${opportunity.demand_source.name} on ${opportunity.demand_source.date} (${opportunity.demand_source.lead_time_days} days lead)`
		: "standard catalog topic";
	return `# SEO Draft PR Packet

- Proposal: ${opportunity.id}
- Query cluster: ${opportunity.query_cluster}
- Canonical owner: ${opportunity.owner_url}
- Existing page assessment: ${opportunity.existing_page_assessment}
- Demand timing: ${demand}
- Topic decision: ${topicDecision?.mode ?? "SCORE_FALLBACK"} (${topicDecision?.reason ?? "highest inventory-aware score"})
- Research mode: ${demandContext?.research?.mode ?? "CATALOG_ONLY"} (${demandContext?.research?.classification ?? "MOCK_VERIFIED"})
- Evidence: ${opportunity.evidence_ids.join(", ")}
- Change manifest: ${changeSet.proposal_id}
- Planned internal links: ${links}
- Draft quality: ${quality.word_count} words; links ${quality.internal_links.join(", ")}
- Migration boundary: FUTURE_MARKDOWN_MIGRATION; human-approved migration required.
- Rollback: Revert this single Markdown file after human review.
- Publication: DRAFT PR ONLY; human approval and merge required.

## Execution evidence
- Writer model: ${writer.model}
- Writer reservation: ${writer.reservation?.cost_reservation?.reserved_max_cost_usd ?? 0} USD
- Branch: ${branch}
- Selection: Eve autonomously researched local demand and chose the topic; thin or claim-heavy drafts are rejected before Connect write.
`;
}

async function resolveTopicSelection({
	inventory,
	catalog,
	runId,
	research,
	topicDecider,
}) {
	const ranking = rankViableBlogTopics({ inventory, catalog });
	if (rankedEmpty(ranking)) {
		return Object.freeze({
			decision: "NO_ACTION",
			reason: "NO_VIABLE_DISTINCT_BLOG_TOPIC",
			considered: ranking.considered,
			topicDecision: Object.freeze({
				mode: "NO_CANDIDATES",
				reason: "No viable distinct blog topics remained.",
			}),
		});
	}
	const researchNotes = formatResearchNotes(research);
	let topicDecision = Object.freeze({
		mode: "SCORE_FALLBACK",
		reason: "Using inventory-aware score ranking.",
		topic_id: ranking.ranked[0].id,
	});
	try {
		const decided = await topicDecider({
			runId,
			candidates: ranking.ranked.slice(0, 8),
			research,
			considered: ranking.considered,
		});
		if (decided?.topic_id) {
			topicDecision = Object.freeze({
				mode: decided.mode ?? "MODEL_DECIDED",
				reason: decided.reason,
				topic_id: decided.topic_id,
				model: decided.model ?? null,
			});
		}
	} catch {
		// Autonomous path continues with score fallback when the model is unavailable.
	}
	const chosenTopic =
		ranking.ranked.find((topic) => topic.id === topicDecision.topic_id) ??
		ranking.ranked[0];
	const selection = selectBlogOpportunity({
		inventory,
		catalog,
		runId,
		preferredTopicId: chosenTopic.id,
		selectionReason:
			chosenTopic.publication_timing?.mode === "DEMAND_TIMED"
				? "DEMAND_TIMED_LOCAL_EVENT_OR_HOLIDAY"
				: "DISTINCT_LOCAL_BLOG_INTENT",
		decisionNotes: topicDecision.reason,
		researchNotes,
	});
	return Object.freeze({
		...selection,
		topicDecision: Object.freeze({
			...topicDecision,
			topic_id: chosenTopic.id,
		}),
	});
}

function rankedEmpty(ranking) {
	return !ranking?.ranked?.length;
}

/**
 * Research/write one bounded Markdown post and open one draft PR through
 * Vercel Connect GitHub. No merge, production deployment, delete, or main
 * write. Topic selection and draft quality gates are fail-closed.
 *
 * Eve decides research targets and topic choice automatically. Owners do not
 * configure per-run options for this path.
 */
export async function executeDraftProposal({
	descriptor,
	settings,
	config,
	repoRoot,
	writer = writeWithGateway,
	publisherFactory = createGithubDraftPublisher,
	now,
	browserResearch,
	topicDecider = decideTopicWithGateway,
} = {}) {
	assertProposalRunAuthorization({ descriptor, settings, config });
	const effectiveNow = resolveProposalNow(descriptor, now);
	const researchAdapter = resolveBrowserResearch({ browserResearch, config });
	const inventory = repoRoot
		? collectPageInventory({ repoRoot })
		: deployedRuntimeInventory();
	const demandContext = await buildDemandAwareTopicCatalog({
		repoRoot,
		now: effectiveNow,
		baseCatalog: BLOG_TOPIC_CATALOG,
		browserResearch: researchAdapter,
		runId: descriptor.runId,
	});
	const selection = await resolveTopicSelection({
		inventory,
		catalog: demandContext.catalog,
		runId: descriptor.runId,
		research: demandContext.research,
		topicDecider,
	});
	if (selection.decision !== "PROPOSE_FOR_HUMAN_REVIEW") {
		return Object.freeze({
			classification: demandContext.research.classification,
			state: "NO_ACTION",
			reason: selection.reason,
			draft_pr_created: false,
			run_id: descriptor.runId,
			considered: selection.considered,
			topic_decision: selection.topicDecision,
			demand: Object.freeze({
				calendar_loaded: demandContext.calendar_loaded,
				trends_loaded: demandContext.trends_loaded,
				active_count: demandContext.active_demand.length,
				active_trend_count: demandContext.active_trends.length,
				research_mode: demandContext.research.mode,
			}),
		});
	}
	const opportunity = selection.opportunity;
	const date = proposalDate(descriptor);
	const written = await writer({
		runId: descriptor.runId,
		opportunity,
		date,
	});
	const markdown = extractMarkdown(written.markdown);
	const quality = assertPublishableBlogDraft(markdown, opportunity);
	if (!quality.ok) {
		return Object.freeze({
			classification: demandContext.research.classification,
			state: "REJECTED_DRAFT_QUALITY",
			reason: quality.reason,
			draft_pr_created: false,
			run_id: descriptor.runId,
			opportunity: {
				id: opportunity.id,
				owner_url: opportunity.owner_url,
				query_cluster: opportunity.query_cluster,
				selection_reason: selection.selection_reason,
			},
			topic_decision: selection.topicDecision,
			writer_model: written.model,
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
			quality,
			demandContext,
			topicDecision: selection.topicDecision,
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
			selection_reason: selection.selection_reason,
			demand_source: opportunity.demand_source,
		},
		topic_decision: selection.topicDecision,
		demand: Object.freeze({
			calendar_loaded: demandContext.calendar_loaded,
			trends_loaded: demandContext.trends_loaded,
			active_count: demandContext.active_demand.length,
			active_trend_count: demandContext.active_trends.length,
			research_mode: demandContext.research.mode,
		}),
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
