import assert from "node:assert/strict";
import test from "node:test";
import { selectEditorialOpportunity } from "../src/editorial-planner.mjs";

const inventory = Object.freeze({
	pages: [{ url: "/septic-pumping" }, { url: "/expert-tips" }],
});

function updateProposal() {
	return {
		operation: "UPDATE",
		content_path: "content/services/septic-pumping.md",
		owner_url: "/septic-pumping",
		editorial_type: "SERVICE_REFRESH",
		existing_page_assessment: "EXISTING_SUFFICIENT",
		evidence_ids: ["gsc-1"],
		internal_links: [
			{
				to: "/expert-tips",
				anchor: "maintenance guidance",
				reader_rationale: "Helps readers find related maintenance guidance.",
			},
		],
	};
}

function blogProposal(overrides = {}) {
	return {
		operation: "CREATE",
		content_path: "content/posts/septic-maintenance-before-holidays.md",
		owner_url: "/septic-maintenance-before-holidays",
		editorial_type: "HOLIDAY_BLOG",
		existing_page_assessment: "EXISTING_INSUFFICIENT",
		evidence_ids: ["gsc-1", "county-1"],
		internal_links: [
			{
				to: "/septic-pumping",
				anchor: "septic pumping service",
				reader_rationale:
					"Connects the reader to the relevant existing service.",
			},
		],
		publication_timing: {
			mode: "DEMAND_TIMED",
			signal_ids: ["gsc-1"],
			holiday_name: "Thanksgiving",
			holiday_date: "2026-11-26",
			lead_time_days: 42,
			local_relevance_evidence_ids: ["county-1"],
		},
		...overrides,
	};
}

test("planner prefers a high-confidence existing-page improvement over a new blog", () => {
	const result = selectEditorialOpportunity({
		inventory,
		now: new Date("2026-09-01T00:00:00Z"),
		candidates: [
			{
				id: "refresh",
				proposal: updateProposal(),
				opportunity_score: 6,
				confidence: 0.9,
			},
			{
				id: "blog",
				proposal: blogProposal(),
				opportunity_score: 20,
				confidence: 0.9,
				distinct_unmet_intent: true,
			},
		],
	});
	assert.equal(result.selected.id, "refresh");
	assert.equal(
		result.selection_reason,
		"HIGHEST_CONFIDENCE_EXISTING_PAGE_OR_LINK_IMPROVEMENT",
	);
});

test("planner selects a distinct demand-timed blog only after no existing improvement is viable", () => {
	const result = selectEditorialOpportunity({
		inventory,
		now: new Date("2026-09-01T00:00:00Z"),
		candidates: [
			{
				id: "blog",
				proposal: blogProposal(),
				opportunity_score: 20,
				confidence: 0.9,
				distinct_unmet_intent: true,
			},
		],
	});
	assert.equal(result.selected.id, "blog");
	assert.match(result.selection_reason, /DISTINCT_UNMET_BLOG_INTENT/);
});

test("planner chooses no action for past holidays or unsupported new intent", () => {
	const result = selectEditorialOpportunity({
		inventory,
		now: new Date("2026-12-01T00:00:00Z"),
		candidates: [
			{
				id: "past",
				proposal: blogProposal(),
				opportunity_score: 20,
				confidence: 0.9,
				distinct_unmet_intent: true,
			},
		],
	});
	assert.equal(result.decision, "NO_ACTION");
	assert.equal(
		selectEditorialOpportunity({
			inventory,
			candidates: [
				{
					id: "not-distinct",
					proposal: blogProposal(),
					opportunity_score: 20,
					confidence: 0.9,
				},
			],
		}).decision,
		"NO_ACTION",
	);
});
