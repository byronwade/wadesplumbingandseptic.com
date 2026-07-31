import { validateEditorialProposal } from "./editorial-policy.mjs";

function score(candidate) {
	if (!Number.isFinite(candidate?.opportunity_score))
		throw new Error("Editorial candidate requires a finite opportunity score.");
	if (
		!Number.isFinite(candidate?.confidence) ||
		candidate.confidence < 0 ||
		candidate.confidence > 1
	)
		throw new Error("Editorial candidate confidence must be between 0 and 1.");
	return candidate.opportunity_score * candidate.confidence;
}

function holidayIsUpcoming(candidate, now) {
	if (candidate.proposal.editorial_type !== "HOLIDAY_BLOG") return true;
	const date = new Date(
		`${candidate.proposal.publication_timing?.holiday_date}T00:00:00Z`,
	);
	return Number.isFinite(date.valueOf()) && date.valueOf() > now.valueOf();
}

function noAction(reason, considered) {
	return Object.freeze({
		decision: "NO_ACTION",
		reason,
		classification: "MOCK_VERIFIED",
		considered: Object.freeze(considered),
	});
}

/**
 * Selects one evidence-backed, human-review-only editorial opportunity.
 * Existing-page/link work wins when viable. A new blog is considered only
 * when the candidate proves a distinct unmet intent; the selector never
 * invents a weekly cadence or creates service URLs.
 */
export function selectEditorialOpportunity({
	candidates = [],
	inventory,
	now = new Date(),
	minimumScore = 1,
} = {}) {
	if (!Array.isArray(candidates))
		throw new Error("Editorial candidates must be an array.");
	if (!Number.isFinite(minimumScore) || minimumScore < 0)
		throw new Error("Editorial minimum score must be non-negative.");
	const considered = candidates.map((candidate) => {
		const proposal = validateEditorialProposal(candidate?.proposal, {
			inventory,
		});
		return Object.freeze({
			id: candidate.id,
			proposal,
			score: score(candidate),
			distinct_unmet_intent: candidate.distinct_unmet_intent === true,
			upcoming_holiday: holidayIsUpcoming(candidate, now),
		});
	});
	const viable = considered.filter(
		(candidate) =>
			candidate.score >= minimumScore &&
			candidate.upcoming_holiday &&
			candidate.proposal.existing_page_assessment !== "NO_ACTION",
	);
	const existing = viable
		.filter((candidate) => candidate.proposal.operation === "UPDATE")
		.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
	if (existing.length > 0)
		return Object.freeze({
			decision: "PROPOSE_FOR_HUMAN_REVIEW",
			selection_reason: "HIGHEST_CONFIDENCE_EXISTING_PAGE_OR_LINK_IMPROVEMENT",
			classification: "MOCK_VERIFIED",
			selected: existing[0],
			considered: Object.freeze(considered),
		});

	const newBlogs = viable
		.filter(
			(candidate) =>
				candidate.proposal.operation === "CREATE" &&
				candidate.proposal.content_path.startsWith("content/posts/") &&
				candidate.distinct_unmet_intent,
		)
		.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
	if (newBlogs.length === 0)
		return noAction(
			"NO_VIABLE_EXISTING_IMPROVEMENT_OR_DISTINCT_BLOG_INTENT",
			considered,
		);
	return Object.freeze({
		decision: "PROPOSE_FOR_HUMAN_REVIEW",
		selection_reason: "DISTINCT_UNMET_BLOG_INTENT_AFTER_EXISTING_PAGE_REVIEW",
		classification: "MOCK_VERIFIED",
		selected: newBlogs[0],
		considered: Object.freeze(considered),
	});
}
