import { generateText } from "ai";
import { gateway } from "@ai-sdk/gateway";
import {
	createBrowserResearchAdapter,
	createIntegrationRegistry,
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
import {
	buildExpansionPrompt,
	isExpandableDraftFailure,
	reviseDraftUntilPublishable,
} from "./draft-revision.mjs";
import {
	buildScoreFallbackTopicDecision,
	createProposalGenerationGuard,
	PROPOSAL_GENERATION_LIMITS,
	shouldSkipTopicModelDecision,
} from "./generation-guards.mjs";
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
import {
	applySearchConsoleSignalsToCatalog,
	collectSearchConsoleTopicSignals,
} from "./search-console-topics.mjs";
import {
	collectPageSpeedQaSignals,
	formatPageSpeedQaForBrief,
} from "./pagespeed-qa.mjs";

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

function cleanBriefText(value, fallback, max = 800) {
	if (typeof value !== "string" || !value.trim()) return fallback;
	return value
		.trim()
		.replace(/\u2014|\u2013/g, ", ")
		.replace(/\s+-\s+/g, ", ")
		.slice(0, max);
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
				reason: cleanBriefText(
					parsed.reason,
					"Model selected the strongest local click opportunity.",
				),
				why_over_others: cleanBriefText(
					parsed.why_over_others,
					"This topic beat the other viable candidates on local timing, click appeal, and distinct intent.",
				),
				seo_value: cleanBriefText(
					parsed.seo_value,
					"This post targets a specific Santa Cruz County query with helpful depth and internal links into service pages.",
				),
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
				why_over_others:
					"The model named this topic among the viable candidates.",
				seo_value:
					"This post targets a specific Santa Cruz County query with helpful depth and internal links into service pages.",
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
	generationGuard = null,
}) {
	const skip = shouldSkipTopicModelDecision({
		ranked: candidates,
		considered,
	});
	if (skip.skip) {
		generationGuard?.record({
			stage: "topic_decision",
			skipped: true,
			note: skip.reason,
		});
		return buildScoreFallbackTopicDecision({
			topic: candidates[0],
			considered,
			skipReason: skip.reason,
		});
	}

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
		gsc_signal: topic.gsc_signal ?? null,
	}));
	const prompt = `You are Eve, the autonomous SEO strategist for Wade's Plumbing & Septic in Santa Cruz County.

Choose exactly ONE blog topic to draft next. Prefer community-timed local events, holidays, and trending local concepts when they can earn clicks from neighbors. When Search Console signals are present (gsc_signal), prefer topics with proven local query demand unless a timed community opportunity is clearly stronger. Prefer distinct helpful intent over generic checklists. Never invent sponsorship, prices, licenses, or service-area claims.

Research context:
${formatResearchNotes(research) ?? "Calendar and inventory only."}

Candidate topics (JSON):
${JSON.stringify(payload, null, 2)}

Return ONLY JSON with detailed reviewer-facing rationale:
{
  "topic_id": "<exact id>",
  "reason": "<2 to 4 sentences: what you chose and why it matters now>",
  "why_over_others": "<2 to 4 sentences: why this beat the other viable candidates>",
  "seo_value": "<2 to 4 sentences: how this helps search visibility, clicks, and internal linking>"
}`;
	const maxOutputTokens =
		PROPOSAL_GENERATION_LIMITS.topicDecisionMaxOutputTokens;
	generationGuard?.assertCanReserve({
		stage: "topic_decision",
		maxOutputTokens,
	});
	const reservation = reserveModelRequest({
		runId,
		prompt,
		maxOutputTokens,
		model: profile.primary,
	});
	generationGuard?.record({
		stage: "topic_decision",
		maxOutputTokens,
		note: `score_gap=${skip.score_gap ?? "n/a"}`,
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

async function generateMarkdownWithGateway({
	runId,
	prompt,
	maxOutputTokens,
	stage = "write",
	generationGuard = null,
	allowFallback = true,
}) {
	const profile = resolveModelProfile("writing");
	generationGuard?.assertCanReserve({ stage, maxOutputTokens });
	const reservation = reserveModelRequest({
		runId,
		prompt,
		maxOutputTokens,
		model: profile.primary,
	});
	generationGuard?.record({ stage, maxOutputTokens });
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
		if (!allowFallback || !secondary) throw error;
		// Fallback re-reserves against the same proposal guard so a failed
		// primary cannot silently double the generation budget.
		generationGuard?.assertCanReserve({
			stage: `${stage}_fallback`,
			maxOutputTokens,
		});
		const fallbackReservation = reserveModelRequest({
			runId,
			prompt,
			maxOutputTokens,
			model: secondary,
		});
		generationGuard?.record({
			stage: `${stage}_fallback`,
			maxOutputTokens,
			note: "primary_failed",
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

async function writeWithGateway({
	runId,
	opportunity,
	date,
	generationGuard = null,
}) {
	return generateMarkdownWithGateway({
		runId,
		prompt: buildWriterPrompt({ opportunity, date }),
		maxOutputTokens: PROPOSAL_GENERATION_LIMITS.writeMaxOutputTokens,
		stage: "write",
		generationGuard,
		allowFallback: true,
	});
}

/**
 * Expand/revise an existing draft. Uses a smaller token budget than a cold
 * rewrite because the model is instructed to preserve good sections.
 */
async function expandWithGateway({
	runId,
	opportunity,
	date,
	markdown,
	peerReview,
	round = 1,
	generationGuard = null,
}) {
	return generateMarkdownWithGateway({
		runId,
		prompt: buildExpansionPrompt({
			markdown,
			opportunity,
			peerReview,
			date,
		}),
		maxOutputTokens: PROPOSAL_GENERATION_LIMITS.expandMaxOutputTokens,
		stage: `expand_round_${round}`,
		generationGuard,
		// Quality first: allow fallback on every expand round. The proposal
		// generation guard still bills each fallback against the same ceiling.
		allowFallback: true,
	});
}

function formatAlternatives(considered = [], chosenId) {
	const viable = considered
		.filter((item) => item.viable && item.id !== chosenId)
		.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
		.slice(0, 6);
	if (viable.length === 0) {
		return "- No other viable distinct blog topics remained in this run.";
	}
	return viable
		.map((item) => {
			const demand = item.demand_name
				? `${item.demand_kind ?? "DEMAND"}: ${item.demand_name}`
				: "evergreen catalog";
			return `- \`${item.id}\` (score ${item.score}, ${demand}): ${item.click_title}`;
		})
		.join("\n");
}

function formatSkipped(considered = []) {
	const skipped = considered
		.filter((item) => !item.viable)
		.slice(0, 8)
		.map((item) => {
			const why = item.conflict
				? `near-duplicate or existing coverage at ${item.conflict}`
				: `only ${item.link_count} resolvable internal links`;
			return `- \`${item.id}\`: skipped because ${why}`;
		});
	return skipped.length > 0
		? skipped.join("\n")
		: "- No candidates were skipped for conflict or link shortages.";
}

/**
 * Detailed reviewer-facing brief for the Connect draft PR.
 * Exported for deterministic packet tests.
 */
function formatRevisionRounds(revision = null) {
	if (!revision?.expanded || !revision.rounds?.length) {
		return "- No expansion rounds needed; the first draft passed quality gates.";
	}
	const lines = revision.rounds.map((round) => {
		const progress =
			round.progressed === false ? "; stopped for no progress" : "";
		return `- Round ${round.round}: peer-reviewed \`${round.quality_reason_before}\` via \`${round.mode}\`; after expand => ${
			round.quality_ok_after ? "publishable" : round.quality_reason_after
		}${progress}`;
	});
	if (revision.stop_reason) {
		lines.push(`- Expansion stop reason: \`${revision.stop_reason}\`.`);
	}
	return lines.join("\n");
}

function formatGenerationSpend(generation = null) {
	if (!generation) {
		return "- Generation spend was not recorded for this packet.";
	}
	const callLines = (generation.call_log ?? [])
		.map((call) =>
			call.skipped
				? `- Skipped \`${call.stage}\` (${call.note ?? "token_save"})`
				: `- Called \`${call.stage}\` with max output ${call.max_output_tokens}`,
		)
		.join("\n");
	return `- Model calls used: ${generation.calls}/${generation.max_model_calls}
- Reserved output tokens: ${generation.reserved_output_tokens}/${generation.max_reserved_output_tokens}
${callLines || "- No generation stages recorded."}`;
}

export function buildDraftPrBrief({
	opportunity,
	changeSet,
	writer,
	branch,
	quality,
	demandContext,
	topicDecision,
	considered = [],
	selectionReason = null,
	revision = null,
	generation = null,
	pagespeedQa = null,
}) {
	const linkLines = opportunity.internal_links
		.map((link) => `- [${link.anchor}](${link.to}): ${link.reader_rationale}`)
		.join("\n");
	const demand = opportunity.demand_source
		? `${opportunity.demand_source.kind}: ${opportunity.demand_source.name} on ${opportunity.demand_source.date} (${opportunity.demand_source.lead_time_days} days of useful lead time)`
		: "evergreen catalog topic (no active holiday/event window forced this choice)";
	const decisionMode = topicDecision?.mode ?? "SCORE_FALLBACK";
	const whyChosen = cleanBriefText(
		topicDecision?.reason ?? opportunity.decision_notes,
		"Eve selected the strongest inventory-aware local topic for this run.",
	);
	const whyOverOthers = cleanBriefText(
		topicDecision?.why_over_others,
		"Eve preferred this topic over other viable candidates because it had stronger local timing, clearer click appeal, and a distinct query cluster.",
	);
	const seoValue = cleanBriefText(
		topicDecision?.seo_value,
		"This draft targets a specific Santa Cruz County search intent with people-first depth and contextual links into owned service pages.",
	);
	const researchMode = demandContext?.research?.mode ?? "CATALOG_ONLY";
	const researchClass =
		demandContext?.research?.classification ?? "MOCK_VERIFIED";
	const activeDemand = (demandContext?.active_demand ?? [])
		.slice(0, 6)
		.map(
			(entry) =>
				`- ${entry.name} (${entry.kind}, ${entry.lead_time_days} days lead)`,
		);
	const activeTrends = (demandContext?.active_trends ?? [])
		.slice(0, 4)
		.map((entry) => `- ${entry.name} (${entry.kind})`);
	const mustCover = (opportunity.must_cover ?? [])
		.map((item) => `- ${item}`)
		.join("\n");
	const faqPreview = (opportunity.people_also_ask ?? [])
		.slice(0, 5)
		.map((item) => `- ${item}`)
		.join("\n");

	return `# SEO Draft PR Packet

## What Eve did this run
- Autonomously researched Santa Cruz County demand timing from the versioned holiday/event calendar and trending-concept windows.
- Compared viable unused blog topics against the live Markdown inventory and link graph.
- Chose **${opportunity.click_title}** (\`${opportunity.slug}\`) using decision mode \`${decisionMode}\`.
- Wrote a people-first draft, peer-reviewed it, and expanded weak portions instead of rewriting the whole article when the concept was already good.
- Ran fail-closed quality gates, then opened this draft-only Connect PR.
- Token-efficiency safeguards:
${formatGenerationSpend(generation)}
- Peer-review / expansion rounds:
${formatRevisionRounds(revision)}
- Research mode: ${researchMode} (${researchClass}).
- Active demand signals considered:
${activeDemand.length > 0 ? activeDemand.join("\n") : "- None inside a lead window for this run."}
- Active trending concepts considered:
${activeTrends.length > 0 ? activeTrends.join("\n") : "- None active for the current month window."}

## Why this blog post matters now
${whyChosen}

Demand timing: ${demand}
Selection reason: ${selectionReason ?? "DISTINCT_LOCAL_BLOG_INTENT"}
Unique value Eve is trying to own: ${opportunity.unique_value}
Angle: ${opportunity.angle}
Community context: ${opportunity.community_context ?? "Santa Cruz County homeowners and local hosts."}

## Why Eve chose this over the other options
${whyOverOthers}

Other viable topics Eve could have drafted instead:
${formatAlternatives(considered, topicDecision?.topic_id ?? opportunity.slug)}

Topics Eve skipped before ranking:
${formatSkipped(considered)}

## How this helps SEO
${seoValue}

Concrete SEO mechanics in this draft:
- Query cluster targeted: ${opportunity.query_cluster}
- Search intent: ${opportunity.search_intent}
- Canonical owner URL: ${opportunity.owner_url}
- Existing page assessment: ${opportunity.existing_page_assessment} (${opportunity.existing_page_decision})
- Click title and CTR-oriented meta are Santa Cruz County specific, so the result can earn the click instead of looking like a national filler post.
- Draft depth gate passed at about **${quality.word_count} words**, with Quick Answer, unique-value section, FAQ depth, and ${quality.faq_questions ?? "5+"} FAQ answers.
- Internal links create paths from this informational post into money/service pages readers need next:
${linkLines}
- Must-cover local points Eve had to satisfy:
${mustCover}
- People-also-ask coverage baked into the FAQ:
${faqPreview}

Expected outcome after human merge (observation only, not a guaranteed ranking claim):
- Earn impressions/clicks for the query cluster from Santa Cruz County homeowners preparing around the same local timing.
- Strengthen topical relevance and internal PageRank flow into the linked service and related posts.
- Observe Search Console for this URL and its linked service pages over a 28 complete-day window after merge (excluding incomplete recent days).

## Draft contents and controls
- Proposal: ${opportunity.id}
- Query cluster: ${opportunity.query_cluster}
- Canonical owner: ${opportunity.owner_url}
- Existing page assessment: ${opportunity.existing_page_assessment}
- Evidence: ${opportunity.evidence_ids.join(", ")}
- Change manifest: ${changeSet.proposal_id}
- Content path: \`${opportunity.content_path}\`
- Planned internal links: ${opportunity.internal_links.map((link) => link.to).join("; ")}
- Draft quality: ${quality.word_count} words; FAQ ${quality.faq_questions ?? "n/a"}; matched links ${quality.internal_links.join(", ")}
- Migration boundary: FUTURE_MARKDOWN_MIGRATION; human-approved migration required.
- Rollback: Revert this single Markdown file after human review.
- Publication: DRAFT PR ONLY; human approval and merge required.

## Preview / performance QA
${formatPageSpeedQaForBrief(pagespeedQa)}

## Execution evidence
- Writer model: ${writer.model}
- Topic decision model: ${topicDecision?.model ?? "score-fallback / fixture"}
- Writer reservation: ${writer.reservation?.cost_reservation?.reserved_max_cost_usd ?? 0} USD
- Branch: ${branch}
- Decision notes passed into the writer: ${opportunity.decision_notes ?? whyChosen}
- Research notes passed into the writer: ${opportunity.research_notes ?? "Calendar and inventory only for this run."}
`;
}

/** @deprecated Prefer buildDraftPrBrief; kept as an alias for local call sites. */
function packet(input) {
	return buildDraftPrBrief(input);
}

async function resolveTopicSelection({
	inventory,
	catalog,
	runId,
	research,
	topicDecider,
	generationGuard = null,
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
		reason:
			"Eve used inventory-aware score ranking because the model decision step was unavailable.",
		why_over_others:
			"The top-scoring viable topic won on demand timing bonus, intent fit, and distinct slug coverage versus the other ranked candidates.",
		seo_value:
			"This draft still targets a distinct Santa Cruz County query cluster with people-first depth and contextual internal links into owned service pages.",
		topic_id: ranking.ranked[0].id,
	});
	try {
		const decided = await topicDecider({
			runId,
			candidates: ranking.ranked.slice(0, 8),
			research,
			considered: ranking.considered,
			generationGuard,
		});
		if (decided?.topic_id) {
			topicDecision = Object.freeze({
				mode: decided.mode ?? "MODEL_DECIDED",
				reason: decided.reason,
				why_over_others: decided.why_over_others,
				seo_value: decided.seo_value,
				topic_id: decided.topic_id,
				model: decided.model ?? null,
				skip_reason: decided.skip_reason ?? null,
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
		considered: ranking.considered,
		topicDecision: Object.freeze({
			...topicDecision,
			topic_id: chosenTopic.id,
			why_over_others:
				topicDecision.why_over_others ??
				"Eve preferred this topic over other viable candidates on local timing, click appeal, and distinct intent.",
			seo_value:
				topicDecision.seo_value ??
				"This draft targets a specific Santa Cruz County intent with helpful depth and internal links into service pages.",
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
	reviser = expandWithGateway,
	publisherFactory = createGithubDraftPublisher,
	now,
	browserResearch,
	searchConsole,
	pagespeed,
	topicDecider = decideTopicWithGateway,
	generationGuard = null,
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
	const searchConsoleAdapter =
		searchConsole === undefined
			? config?.integrationFlags?.searchConsole === true
				? createIntegrationRegistry({ config }).search_console
				: null
			: searchConsole;
	const searchConsoleTopics = await collectSearchConsoleTopicSignals({
		searchConsole: searchConsoleAdapter,
		siteUrl: config?.siteUrl,
		runId: descriptor.runId,
		catalog: demandContext.catalog,
		now: effectiveNow,
	});
	const scoredCatalog = applySearchConsoleSignalsToCatalog(
		demandContext.catalog,
		searchConsoleTopics.signals,
	);
	const pagespeedAdapter =
		pagespeed === undefined
			? config?.integrationFlags?.pageSpeed === true
				? createIntegrationRegistry({ config }).pagespeed
				: null
			: pagespeed;
	const pagespeedQa = await collectPageSpeedQaSignals({
		pagespeed: pagespeedAdapter,
		siteUrl: config?.siteUrl,
		runId: descriptor.runId,
		strategy: "mobile",
	});
	const pagespeedQaSummary = Object.freeze({
		classification: pagespeedQa.classification,
		status: pagespeedQa.signal?.status ?? null,
		performance_score: pagespeedQa.signal?.performance_score ?? null,
		measured_url: pagespeedQa.signal?.measured_url ?? null,
		reason: pagespeedQa.reason ?? null,
		evidence_id:
			pagespeedQa.classification === "LIVE_VERIFIED"
				? "pagespeed:draft-preview-qa"
				: null,
	});
	const guard = generationGuard ?? createProposalGenerationGuard();
	const selection = await resolveTopicSelection({
		inventory,
		catalog: scoredCatalog,
		runId: descriptor.runId,
		research: demandContext.research,
		topicDecider,
		generationGuard: guard,
	});
	const searchConsoleSummary = Object.freeze({
		classification: searchConsoleTopics.classification,
		matched_topic_count: searchConsoleTopics.signals.length,
		evidence_id:
			searchConsoleTopics.classification === "LIVE_VERIFIED"
				? "search-console:topic-signals"
				: null,
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
			generation: guard.snapshot(),
			demand: Object.freeze({
				calendar_loaded: demandContext.calendar_loaded,
				trends_loaded: demandContext.trends_loaded,
				active_count: demandContext.active_demand.length,
				active_trend_count: demandContext.active_trends.length,
				research_mode: demandContext.research.mode,
			}),
			search_console_topics: searchConsoleSummary,
			pagespeed_qa: pagespeedQaSummary,
		});
	}
	const opportunity = selection.opportunity;
	const date = proposalDate(descriptor);
	const written = await writer({
		runId: descriptor.runId,
		opportunity,
		date,
		generationGuard: guard,
	});
	let markdown = extractMarkdown(written.markdown);
	let quality = assertPublishableBlogDraft(markdown, opportunity);
	let writerModel = written.model;
	let writerReservation = written.reservation;
	let revision = Object.freeze({
		expanded: false,
		rounds: Object.freeze([]),
		publishable: quality.ok === true,
		stop_reason: null,
	});
	if (!quality.ok && isExpandableDraftFailure(quality)) {
		const revised = await reviseDraftUntilPublishable({
			markdown,
			opportunity,
			date,
			runId: descriptor.runId,
			quality,
			reviser,
			assertQuality: assertPublishableBlogDraft,
			generationGuard: guard,
		});
		markdown = revised.markdown;
		quality = revised.quality;
		revision = revised;
		if (revised.model) writerModel = revised.model;
		if (revised.reservation) writerReservation = revised.reservation;
	}
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
			writer_model: writerModel,
			generation: guard.snapshot(),
			revision: Object.freeze({
				expanded: revision.expanded,
				rounds: revision.rounds,
				publishable: false,
				stop_reason: revision.stop_reason ?? null,
			}),
			search_console_topics: searchConsoleSummary,
			pagespeed_qa: pagespeedQaSummary,
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
	const writerEvidence = {
		model: writerModel,
		reservation: writerReservation,
	};
	const pagespeedQaForBrief = Object.freeze({
		classification: pagespeedQa.classification,
		signal: pagespeedQa.signal,
		reason: pagespeedQa.reason,
	});
	const pr = await createDraftPullRequest({
		humanApproval: true,
		branch,
		title: `SEO: ${opportunity.query_cluster}`,
		body: packet({
			opportunity,
			changeSet,
			writer: writerEvidence,
			branch,
			quality,
			demandContext,
			topicDecision: selection.topicDecision,
			considered: selection.considered,
			selectionReason: selection.selection_reason,
			revision,
			generation: guard.snapshot(),
			pagespeedQa: pagespeedQaForBrief,
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
		generation: guard.snapshot(),
		revision: Object.freeze({
			expanded: revision.expanded,
			rounds: revision.rounds,
			publishable: true,
			stop_reason: revision.stop_reason ?? null,
		}),
		pr_brief_preview: {
			why_chosen: selection.topicDecision?.reason ?? null,
			why_over_others: selection.topicDecision?.why_over_others ?? null,
			seo_value: selection.topicDecision?.seo_value ?? null,
		},
		demand: Object.freeze({
			calendar_loaded: demandContext.calendar_loaded,
			trends_loaded: demandContext.trends_loaded,
			active_count: demandContext.active_demand.length,
			active_trend_count: demandContext.active_trends.length,
			research_mode: demandContext.research.mode,
		}),
		search_console_topics: searchConsoleSummary,
		pagespeed_qa: pagespeedQaSummary,
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
