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
	selectBlogOpportunity,
} from "./blog-opportunity.mjs";
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

function resolveBrowserResearch({ browserResearch, config }) {
	if (browserResearch && typeof browserResearch.read === "function") {
		return browserResearch;
	}
	if (config?.browserResearch?.enabled !== true) return null;
	return createBrowserResearchAdapter({
		enabled: true,
		allowedDomains: config.browserResearch.allowedDomains ?? [],
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
- Selection: demand-timed local calendar plus inventory-aware catalog; thin or claim-heavy drafts are rejected before Connect write.
`;
}

/**
 * Research/write one bounded Markdown post and open one draft PR through
 * Vercel Connect GitHub. No merge, production deployment, delete, or main
 * write. Topic selection and draft quality gates are fail-closed.
 */
export async function executeDraftProposal({
	descriptor,
	settings,
	config,
	repoRoot,
	writer = writeWithGateway,
	publisherFactory = createGithubDraftPublisher,
	now,
	browserResearch = null,
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
	const selection = selectBlogOpportunity({
		inventory,
		catalog: demandContext.catalog,
		runId: descriptor.runId,
	});
	if (selection.decision !== "PROPOSE_FOR_HUMAN_REVIEW") {
		return Object.freeze({
			classification: demandContext.research.classification,
			state: "NO_ACTION",
			reason: selection.reason,
			draft_pr_created: false,
			run_id: descriptor.runId,
			considered: selection.considered,
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
