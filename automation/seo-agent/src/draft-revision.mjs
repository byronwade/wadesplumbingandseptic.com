/**
 * Peer-review and expand existing drafts instead of rewriting from scratch.
 * Saves tokens when the concept is good but depth, FAQ, links, or sections
 * still need work.
 */

import {
	hasRevisionProgress,
	PROPOSAL_GENERATION_LIMITS,
	truncateDraftForExpansionPrompt,
} from "./generation-guards.mjs";

export const EXPANDABLE_QUALITY_REASONS = Object.freeze([
	"TOO_THIN",
	"INSUFFICIENT_SECTIONS",
	"INSUFFICIENT_FAQ_DEPTH",
	"MISSING_MUST_COVER_DEPTH",
	"INSUFFICIENT_INTERNAL_LINKS",
	"MISSING_QUICK_ANSWER",
	"MISSING_UNIQUE_VALUE_SECTION",
	"MISSING_FAQ",
	"WEAK_META_DESCRIPTION",
	"META_MISSING_LOCAL_HOOK",
	"MISSING_LOCAL_CONTEXT",
	"MISSING_COMMUNITY_CONTEXT",
]);

export const FATAL_QUALITY_REASONS = Object.freeze([
	"EMPTY_DRAFT",
	"MISSING_FRONTMATTER",
	"CANONICAL_MISMATCH",
	"INVALID_H1_COUNT",
	"GENERIC_FILLER",
	"UNSUPPORTED_MARKETING_CLAIM",
	"EVENT_SPONSORSHIP_CLAIM",
	"UNBOUNDEDLY_LONG",
]);

export const MAX_DRAFT_EXPANSION_ROUNDS = 2;

export function isExpandableDraftFailure(quality) {
	return (
		Boolean(quality) &&
		quality.ok === false &&
		EXPANDABLE_QUALITY_REASONS.includes(quality.reason)
	);
}

export function isFatalDraftFailure(quality) {
	return (
		Boolean(quality) &&
		quality.ok === false &&
		FATAL_QUALITY_REASONS.includes(quality.reason)
	);
}

function wordCount(text) {
	return (text.trim().match(/\b[\w'-]+\b/g) ?? []).length;
}

function h2Count(text) {
	return (text.match(/^##\s+/gm) ?? []).length;
}

function faqCount(text) {
	const faqBlock = text.split(/^##\s+FAQ\b/im)[1] ?? "";
	return (faqBlock.match(/^###\s+.+/gm) ?? []).length;
}

/**
 * Deterministic peer review: what to keep, what to expand, no full rewrite.
 */
export function buildPeerReviewReport({ markdown, opportunity, quality } = {}) {
	if (!quality || quality.ok) {
		return Object.freeze({
			mode: "NO_REVISION_NEEDED",
			quality_reason: null,
			keep: Object.freeze(["Draft already meets publishable quality gates."]),
			expand: Object.freeze([]),
			instruction: "No expansion needed. Preserve the draft as written.",
		});
	}
	const text = typeof markdown === "string" ? markdown : "";
	const keep = [];
	const expand = [];
	if (text.startsWith("---"))
		keep.push("Keep the existing YAML front matter keys and canonical URL.");
	if (/^#\s+/m.test(text))
		keep.push(
			"Keep the existing H1/title concept unless a tiny clarity edit is required.",
		);
	if (/santa cruz/i.test(text))
		keep.push("Keep Santa Cruz County local framing already present.");
	if (/^##\s+Quick Answer/im.test(text))
		keep.push("Keep the Quick Answer section; deepen bullets only if thin.");
	if (/^##\s+What makes this guide different/im.test(text))
		keep.push(
			"Keep the unique-value section; expand only if it is too shallow.",
		);
	if (/^##\s+FAQ\b/im.test(text))
		keep.push("Keep existing FAQ questions that are already useful.");
	if (keep.length === 0) {
		keep.push(
			"Keep the core topic concept and any accurate local guidance already drafted.",
		);
	}

	switch (quality.reason) {
		case "TOO_THIN":
			expand.push(
				`Add practical depth until the draft reaches about 1,400+ words (currently about ${wordCount(text)}). Expand weak sections; do not invent a new article.`,
			);
			break;
		case "INSUFFICIENT_SECTIONS":
			expand.push(
				`Add missing H2 sections until there are at least 7 (currently ${h2Count(text)}). Prefer new useful sections over rewriting old ones.`,
			);
			break;
		case "INSUFFICIENT_FAQ_DEPTH":
		case "MISSING_FAQ":
			expand.push(
				`Expand the FAQ to at least 5 ### questions (currently ${faqCount(text)}). Keep good answers; add only what is missing.`,
			);
			break;
		case "MISSING_MUST_COVER_DEPTH":
			expand.push(
				`Deepen coverage for unmet must-cover points: ${(opportunity?.must_cover ?? []).join("; ")}.`,
			);
			break;
		case "INSUFFICIENT_INTERNAL_LINKS":
			expand.push(
				`Add contextual internal links to these planned paths without stripping existing good links: ${(
					opportunity?.internal_links ?? []
				)
					.map((link) => link.to)
					.join(", ")}.`,
			);
			break;
		case "MISSING_QUICK_ANSWER":
			expand.push(
				'Add an H2 "Quick Answer for Santa Cruz County Homeowners" with 4 to 6 concrete bullets. Keep the rest of the draft.',
			);
			break;
		case "MISSING_UNIQUE_VALUE_SECTION":
			expand.push(
				'Add an H2 "What makes this guide different" that states the local unique value. Keep surrounding sections.',
			);
			break;
		case "WEAK_META_DESCRIPTION":
		case "META_MISSING_LOCAL_HOOK":
			expand.push(
				"Rewrite only the front-matter description for CTR and Santa Cruz County specificity (70 to 155 characters).",
			);
			break;
		case "MISSING_LOCAL_CONTEXT":
			expand.push(
				"Add concrete Santa Cruz County context in the intro and at least one body section. Do not rewrite unrelated sections.",
			);
			break;
		case "MISSING_COMMUNITY_CONTEXT":
			expand.push(
				`Mention the community timing label naturally once or twice: ${
					opportunity?.demand_source?.name ??
					"Santa Cruz County community timing"
				}.`,
			);
			break;
		default:
			expand.push(
				`Repair the specific quality gap (${quality.reason}) with the smallest useful edit set.`,
			);
	}

	return Object.freeze({
		mode: "EXPAND_EXISTING_DRAFT",
		quality_reason: quality.reason,
		keep: Object.freeze(keep),
		expand: Object.freeze(expand),
		instruction:
			"Peer review result: preserve the good concept and expand only the weak parts. Do not start over.",
	});
}

/**
 * Token-conscious expansion prompt. Returns a full updated Markdown file, but
 * instructs the model to preserve good sections and only expand gaps.
 */
export function buildExpansionPrompt({
	markdown,
	opportunity,
	peerReview,
	date,
} = {}) {
	if (typeof markdown !== "string" || !markdown.trim()) {
		throw new Error("Expansion requires an existing Markdown draft.");
	}
	if (!opportunity?.owner_url) {
		throw new Error("Expansion requires the selected opportunity.");
	}
	const review =
		peerReview ??
		buildPeerReviewReport({
			markdown,
			opportunity,
			quality: { ok: false, reason: "TOO_THIN" },
		});
	const keepLines = review.keep.map((item) => `- ${item}`).join("\n");
	const expandLines = review.expand.map((item) => `- ${item}`).join("\n");
	const linkLines = (opportunity.internal_links ?? [])
		.map((link) => `- [${link.anchor}](${link.to})`)
		.join("\n");
	const draftSlice = truncateDraftForExpansionPrompt(
		markdown,
		PROPOSAL_GENERATION_LIMITS.maxExpandPromptDraftChars,
	);

	return `You are peer-reviewing an existing Wade's Plumbing & Septic SEO draft for Santa Cruz County.

Mission: improve the draft by EXPANDING and REVISING portions. Do NOT rewrite the article from scratch. The concept is already chosen. Save tokens and preserve good work.

Date for front matter if needed: "${date}"
Query cluster: ${opportunity.query_cluster}
Canonical: ${opportunity.owner_url}
Unique value to preserve: ${opportunity.unique_value}

Peer-review keep list:
${keepLines}

Peer-review expand list:
${expandLines}

Planned internal links that may still need contextual placement:
${linkLines}

Rules:
1. Return ONLY the full updated Markdown with YAML front matter. No code fences.
2. Preserve the title concept, structure, and any accurate local guidance already present.
3. Add depth, missing sections, FAQ answers, or links only where the peer review requires it.
4. Do not invent prices, licensed/insured claims, 24/7, sponsorship, or "serving City" claims.
5. Prefer new paragraphs under existing H2s over replacing whole sections.
6. Target people-first helpful content that can compete in Google Search.
7. Do not restate unchanged sections at length; keep good prose and only grow the gaps.

Existing draft to improve:
<<<EXISTING_DRAFT
${draftSlice.text}
EXISTING_DRAFT<<<`;
}

/**
 * Runs bounded expand/revise rounds for expandable quality failures.
 */
export async function reviseDraftUntilPublishable({
	markdown,
	opportunity,
	date,
	runId,
	quality,
	reviser,
	assertQuality,
	maxRounds = MAX_DRAFT_EXPANSION_ROUNDS,
	generationGuard = null,
} = {}) {
	if (typeof reviser !== "function") {
		throw new Error("Draft revision requires a reviser function.");
	}
	if (typeof assertQuality !== "function") {
		throw new Error("Draft revision requires assertQuality.");
	}
	let currentMarkdown = markdown;
	let currentQuality = quality;
	let currentModel = null;
	let reservation = null;
	let stopReason = null;
	const rounds = [];
	for (let round = 1; round <= maxRounds; round += 1) {
		if (!isExpandableDraftFailure(currentQuality)) break;
		const peerReview = buildPeerReviewReport({
			markdown: currentMarkdown,
			opportunity,
			quality: currentQuality,
		});
		const reasonBefore = currentQuality.reason;
		const revised = await reviser({
			runId,
			opportunity,
			date,
			markdown: currentMarkdown,
			peerReview,
			quality: currentQuality,
			round,
			generationGuard,
		});
		currentMarkdown = revised.markdown;
		currentModel = revised.model ?? currentModel;
		reservation = revised.reservation ?? reservation;
		currentQuality = assertQuality(currentMarkdown, opportunity);
		const progressed = hasRevisionProgress({
			reasonBefore,
			reasonAfter: currentQuality.reason,
			okAfter: currentQuality.ok,
		});
		rounds.push(
			Object.freeze({
				round,
				quality_reason_before: peerReview.quality_reason,
				quality_ok_after: currentQuality.ok,
				quality_reason_after: currentQuality.reason,
				progressed,
				mode: peerReview.mode,
				expand: peerReview.expand,
			}),
		);
		if (currentQuality.ok) break;
		if (isFatalDraftFailure(currentQuality)) break;
		if (!progressed) {
			stopReason = "NO_REVISION_PROGRESS";
			break;
		}
	}
	return Object.freeze({
		markdown: currentMarkdown,
		quality: currentQuality,
		model: currentModel,
		reservation,
		rounds: Object.freeze(rounds),
		expanded: rounds.length > 0,
		publishable: currentQuality.ok === true,
		stop_reason: stopReason,
	});
}
