/**
 * Proposal-stage token and call safeguards.
 *
 * Quality is the primary goal: budgets are sized so a full people-first draft
 * (about 1,400 to 2,200 words) plus bounded expands can finish. Safeguards only
 * stop wasteful repeats (no-progress expands, obvious topic re-ranks, runaway
 * loops). Never starve a publishable draft to save tokens.
 *
 * Global model-budget accounting still applies on top of these ceilings.
 */

export const PROPOSAL_GENERATION_LIMITS = Object.freeze({
	/** topic (optional) + write + write fallback + up to two expands */
	maxModelCalls: 5,
	/**
	 * Sum of reserved maxOutputTokens across proposal model calls.
	 * Sized for one full write (or primary+fallback) plus quality expands.
	 */
	maxReservedOutputTokens: 20_000,
	topicDecisionMaxOutputTokens: 500,
	/** Enough headroom for a complete 1,400 to 2,200 word Markdown draft */
	writeMaxOutputTokens: 6_500,
	/** Enough to deepen thin sections to publishable depth, not a stub patch */
	expandMaxOutputTokens: 4_000,
	/**
	 * Keep nearly full drafts in expand prompts. Truncation is a last resort
	 * for runaway input, not a thrift cut on normal posts.
	 */
	maxExpandPromptDraftChars: 28_000,
	/** Skip the topic LLM when the top score beats #2 by this much */
	topicScoreGapToSkipModel: 8,
	/** Larger gap skips even without demand timing */
	topicScoreGapHardSkip: 12,
});

/**
 * Tracks proposal generation spend before each model dispatch.
 */
export function createProposalGenerationGuard(
	limits = PROPOSAL_GENERATION_LIMITS,
) {
	const calls = [];
	const skips = [];
	let reservedOutputTokens = 0;

	function snapshot() {
		return Object.freeze({
			calls: calls.length,
			skips: skips.length,
			reserved_output_tokens: reservedOutputTokens,
			max_model_calls: limits.maxModelCalls,
			max_reserved_output_tokens: limits.maxReservedOutputTokens,
			call_log: Object.freeze([
				...skips.map((item) => Object.freeze({ ...item })),
				...calls.map((item) => Object.freeze({ ...item })),
			]),
		});
	}

	function assertCanReserve({ stage, maxOutputTokens } = {}) {
		if (typeof stage !== "string" || !stage.trim()) {
			throw new Error("Generation guard requires a stage label.");
		}
		if (!Number.isInteger(maxOutputTokens) || maxOutputTokens < 1) {
			throw new Error(
				"Generation guard maxOutputTokens must be a positive integer.",
			);
		}
		if (calls.length >= limits.maxModelCalls) {
			throw new Error(
				`Proposal generation call budget exhausted (${calls.length}/${limits.maxModelCalls}).`,
			);
		}
		const nextOutput = reservedOutputTokens + maxOutputTokens;
		if (nextOutput > limits.maxReservedOutputTokens) {
			throw new Error(
				`Proposal generation output-token budget exhausted (${nextOutput}/${limits.maxReservedOutputTokens}).`,
			);
		}
		return true;
	}

	function record({
		stage,
		maxOutputTokens,
		skipped = false,
		note = null,
	} = {}) {
		if (skipped) {
			skips.push({
				stage,
				max_output_tokens: 0,
				skipped: true,
				note,
			});
			return snapshot();
		}
		assertCanReserve({ stage, maxOutputTokens });
		reservedOutputTokens += maxOutputTokens;
		calls.push({
			stage,
			max_output_tokens: maxOutputTokens,
			skipped: false,
			note,
		});
		return snapshot();
	}

	return Object.freeze({
		limits: Object.freeze({ ...limits }),
		assertCanReserve,
		record,
		snapshot,
	});
}

/**
 * Decide whether the topic-selection model call is worth the tokens.
 * Score ranking is already inventory-aware and demand-timed.
 */
export function shouldSkipTopicModelDecision({
	ranked,
	considered,
	limits = PROPOSAL_GENERATION_LIMITS,
} = {}) {
	if (!Array.isArray(ranked) || ranked.length === 0) {
		return Object.freeze({
			skip: true,
			reason: "NO_CANDIDATES",
		});
	}
	if (ranked.length === 1) {
		return Object.freeze({
			skip: true,
			reason: "SINGLE_VIABLE_CANDIDATE",
		});
	}
	const scoreById = new Map(
		(considered ?? []).map((item) => [item.id, item.score]),
	);
	const top = ranked[0];
	const second = ranked[1];
	const topScore = scoreById.get(top.id);
	const secondScore = scoreById.get(second.id);
	if (!Number.isFinite(topScore) || !Number.isFinite(secondScore)) {
		return Object.freeze({ skip: false, reason: null, score_gap: null });
	}
	const gap = topScore - secondScore;
	const demandTimed =
		top.publication_timing?.mode === "DEMAND_TIMED" ||
		Boolean(top.demand_source?.kind);
	if (gap >= limits.topicScoreGapHardSkip) {
		return Object.freeze({
			skip: true,
			reason: "CLEAR_SCORE_LEAD",
			score_gap: gap,
		});
	}
	if (gap >= limits.topicScoreGapToSkipModel && demandTimed) {
		return Object.freeze({
			skip: true,
			reason: "CLEAR_DEMAND_TIMED_SCORE_LEAD",
			score_gap: gap,
		});
	}
	return Object.freeze({
		skip: false,
		reason: null,
		score_gap: gap,
	});
}

/**
 * Deterministic topic decision text when the model call is skipped.
 */
export function buildScoreFallbackTopicDecision({
	topic,
	considered,
	skipReason,
} = {}) {
	const score =
		considered?.find((item) => item.id === topic?.id)?.score ?? null;
	const demandName = topic?.demand_source?.name;
	const reasonParts = [
		`Eve selected ${topic?.click_title ?? topic?.id} from inventory-aware score ranking without a topic-model call (${skipReason}).`,
		Number.isFinite(score)
			? `Its ranking score was ${score}.`
			: "Its ranking score led the viable set.",
		demandName
			? `Local demand timing for ${demandName} contributed to the choice.`
			: "Distinct local intent and link coverage contributed to the choice.",
	];
	return Object.freeze({
		topic_id: topic.id,
		mode: "SCORE_FALLBACK_SKIP_MODEL",
		reason: reasonParts.join(" "),
		why_over_others:
			"Other viable candidates scored lower on demand timing, inventory uniqueness, or intended click appeal, so spending tokens on a model re-rank was unnecessary.",
		seo_value:
			"This draft still targets a distinct Santa Cruz County query cluster with people-first depth and contextual internal links into owned service pages.",
		skip_reason: skipReason,
	});
}

/**
 * Prepare a draft for an expand prompt. Prefer the full draft. Only when the
 * draft exceeds the runaway-input ceiling, keep front matter, the H2 outline,
 * and head/tail body so the model can still expand gaps with quality.
 */
export function truncateDraftForExpansionPrompt(
	markdown,
	maxChars = PROPOSAL_GENERATION_LIMITS.maxExpandPromptDraftChars,
) {
	if (typeof markdown !== "string") {
		throw new Error("Expansion draft must be a string.");
	}
	const trimmed = markdown.trim();
	if (trimmed.length <= maxChars) {
		return Object.freeze({
			text: trimmed,
			truncated: false,
			original_chars: trimmed.length,
		});
	}

	let frontMatter = "";
	let body = trimmed;
	if (trimmed.startsWith("---")) {
		const end = trimmed.indexOf("\n---", 3);
		if (end !== -1) {
			frontMatter = trimmed.slice(0, end + 4).trim();
			body = trimmed.slice(end + 4).trim();
		}
	}
	const outline = (body.match(/^##\s+.+$/gm) ?? [])
		.slice(0, 20)
		.map((line) => line.trim())
		.join("\n");
	const note = `[TRUNCATED_FOR_TOKEN_BUDGET: original ${trimmed.length} characters. Quality still required: expand every peer-review gap thoroughly. Preserve front matter, title concept, and listed H2s. Middle body omitted only to avoid runaway input.]`;
	const reserved = frontMatter.length + outline.length + note.length + 120;
	const bodyBudget = Math.max(2_000, maxChars - reserved);
	const headLen = Math.floor(bodyBudget * 0.65);
	const tailLen = Math.max(400, bodyBudget - headLen);
	const head = body.slice(0, headLen);
	const tail = body.slice(Math.max(headLen, body.length - tailLen));
	const text = [
		frontMatter,
		"",
		note,
		"",
		"H2 outline:",
		outline || "(no H2 headings found)",
		"",
		"Draft head:",
		head,
		"",
		"...[middle omitted for input ceiling]...",
		"",
		"Draft tail:",
		tail,
	]
		.join("\n")
		.trim();

	return Object.freeze({
		text,
		truncated: true,
		original_chars: trimmed.length,
	});
}

/**
 * Stop expanding when a round did not change the failing quality reason.
 */
export function hasRevisionProgress({
	reasonBefore,
	reasonAfter,
	okAfter,
} = {}) {
	if (okAfter === true) return true;
	if (typeof reasonBefore !== "string" || typeof reasonAfter !== "string") {
		return false;
	}
	return reasonBefore !== reasonAfter;
}
