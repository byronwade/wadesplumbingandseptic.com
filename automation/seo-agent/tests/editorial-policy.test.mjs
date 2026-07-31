import assert from "node:assert/strict";
import test from "node:test";
import { extractInternalLinks } from "../src/inventory.mjs";
import {
	validateEditorialProposal,
	validateImagePlan,
} from "../src/editorial-policy.mjs";

const inventory = Object.freeze({
	pages: [{ url: "/septic-pumping" }, { url: "/expert-tips" }],
});

function blogProposal(overrides = {}) {
	return {
		operation: "CREATE",
		content_path: "content/posts/septic-maintenance-before-holidays.md",
		owner_url: "/septic-maintenance-before-holidays",
		editorial_type: "HOLIDAY_BLOG",
		existing_page_assessment: "EXISTING_INSUFFICIENT",
		evidence_ids: ["gsc-2026-01", "county-2026-01"],
		internal_links: [
			{
				to: "/septic-pumping",
				anchor: "septic pumping service",
				reader_rationale:
					"Helps readers find the relevant existing service information.",
			},
		],
		publication_timing: {
			mode: "DEMAND_TIMED",
			signal_ids: ["gsc-2026-01"],
			holiday_name: "Thanksgiving",
			holiday_date: "2026-11-26",
			lead_time_days: 42,
			local_relevance_evidence_ids: ["county-2026-01"],
		},
		...overrides,
	};
}

test("Markdown link extraction includes contextual links but excludes images and external targets", () => {
	assert.deepEqual(
		extractInternalLinks(
			"[Read septic help](/septic-pumping#options) ![photo](/photo.jpg) [Elsewhere](https://example.test)",
		),
		[{ target: "/septic-pumping", anchor: "Read septic help" }],
	);
});

test("blog creation requires demand timing, useful links, and an existing-page assessment", () => {
	assert.equal(
		validateEditorialProposal(blogProposal(), { inventory }).editorial_type,
		"HOLIDAY_BLOG",
	);
	assert.throws(
		() =>
			validateEditorialProposal(
				blogProposal({
					publication_timing: {
						mode: "DEMAND_TIMED",
						cadence: "weekly",
						signal_ids: ["x"],
					},
				}),
				{ inventory },
			),
		/fixed publishing cadences/i,
	);
	assert.throws(
		() =>
			validateEditorialProposal(
				blogProposal({ existing_page_assessment: "NOT_REVIEWED" }),
				{ inventory },
			),
		/existing-page insufficiency/i,
	);
});

test("new service URLs and generic-page edits are denied while service refreshes remain bounded", () => {
	assert.throws(
		() =>
			validateEditorialProposal(
				blogProposal({
					content_path: "content/services/new-service.md",
					owner_url: "/service-offerings/new-service",
					editorial_type: "SERVICE_PAGE",
				}),
				{ inventory },
			),
		/never create a service page/i,
	);
	assert.throws(
		() =>
			validateEditorialProposal(
				blogProposal({
					operation: "UPDATE",
					content_path: "content/pages/about-us.md",
					owner_url: "/septic-pumping",
					editorial_type: "PAGE_REFRESH",
				}),
				{ inventory },
			),
		/manual/i,
	);
	assert.equal(
		validateEditorialProposal(
			blogProposal({
				operation: "UPDATE",
				content_path: "content/services/septic-pumping.md",
				owner_url: "/septic-pumping",
				editorial_type: "SERVICE_REFRESH",
			}),
			{ inventory },
		).operation,
		"UPDATE",
	);
});

test("image plans require provenance, rights, relevance, and descriptive alt text", () => {
	assert.equal(
		validateImagePlan({
			asset_path: "public/images/septic-pumping.webp",
			source_url: "https://assets.example.test/septic-pumping.webp",
			usage_rights: "LICENSED",
			rights_evidence_id: "license-123",
			alt_text: "Technician preparing septic pumping equipment",
			relevance_rationale:
				"Shows the equipment discussed in the service explanation.",
		}).usage_rights,
		"LICENSED",
	);
	assert.throws(
		() =>
			validateImagePlan({
				asset_path: "public/images/septic-pumping.webp",
				source_url: "https://assets.example.test/septic-pumping.webp",
				usage_rights: "UNKNOWN",
				rights_evidence_id: "license-123",
				alt_text: "Technician preparing septic pumping equipment",
				relevance_rationale:
					"Shows the equipment discussed in the service explanation.",
			}),
		/usage-rights/i,
	);
});
