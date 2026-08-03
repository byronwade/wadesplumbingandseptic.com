import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { collectPageInventory } from "../src/inventory.mjs";
import {
	BLOG_TOPIC_CATALOG,
	selectBlogOpportunity,
} from "../src/blog-opportunity.mjs";
import {
	buildDemandAwareTopicCatalog,
	gatherLocalDemandResearch,
	loadLocalDemandCalendar,
	loadTrendingLocalConcepts,
	selectActiveDemandEntries,
	selectActiveTrendEntries,
	topicFromDemandEntry,
} from "../src/local-demand.mjs";

const repoRoot = resolve(import.meta.dirname, "../../..");

test("local demand calendar loads holidays and Santa Cruz community events", () => {
	const calendar = loadLocalDemandCalendar({ repoRoot });
	assert.equal(calendar.schema_version, "1.0");
	assert.equal(calendar.entries.length >= 8, true);
	assert.equal(
		calendar.entries.some((entry) => entry.name.includes("Art & Wine")),
		true,
	);
	assert.equal(
		calendar.entries.some((entry) =>
			entry.name.includes("Watsonville Strawberry Festival"),
		),
		true,
	);
	assert.equal(
		calendar.entries.some((entry) => entry.kind === "HOLIDAY"),
		true,
	);
	assert.equal(
		calendar.entries.some((entry) => entry.kind === "SEASONAL_TREND"),
		true,
	);
});

test("trending local concepts load with month windows", () => {
	const trends = loadTrendingLocalConcepts({ repoRoot });
	assert.equal(trends.schema_version, "1.0");
	assert.equal(trends.entries.length >= 4, true);
	const active = selectActiveTrendEntries({
		trends,
		now: new Date("2026-08-01T12:00:00.000Z"),
	});
	assert.equal(active.length >= 1, true);
	assert.equal(
		active.every((entry) => entry.publication_timing.mode === "DEMAND_TIMED"),
		true,
	);
});

test("active demand entries respect lead windows around Labor Day and Art & Wine", () => {
	const calendar = loadLocalDemandCalendar({ repoRoot });
	const active = selectActiveDemandEntries({
		calendar,
		now: new Date("2026-08-01T12:00:00.000Z"),
	});
	assert.equal(
		active.some((entry) => entry.id === "holiday-labor-day-2026"),
		true,
	);
	assert.equal(
		active.some((entry) => entry.id === "event-capitola-art-wine-2026"),
		true,
	);
	assert.equal(
		active.some((entry) => entry.id === "event-santa-cruz-county-fair-2026"),
		true,
	);
	for (const entry of active) {
		assert.equal(entry.lead_time_days >= entry.lead_window_days.min, true);
		assert.equal(entry.lead_time_days <= entry.lead_window_days.max, true);
		assert.equal(entry.publication_timing.mode, "DEMAND_TIMED");
	}
});

test("demand-timed community topics outrank the evergreen catalog when in window", async () => {
	const inventory = collectPageInventory({ repoRoot });
	const demand = await buildDemandAwareTopicCatalog({
		repoRoot,
		now: new Date("2026-08-01T12:00:00.000Z"),
		baseCatalog: BLOG_TOPIC_CATALOG,
	});
	assert.equal(demand.calendar_loaded, true);
	assert.equal(demand.trends_loaded, true);
	assert.equal(demand.research.mode, "CALENDAR_ONLY");
	assert.equal(demand.active_demand.length >= 2, true);
	const selection = selectBlogOpportunity({
		inventory,
		catalog: demand.catalog,
		runId: "proposal-2026-08-01",
	});
	assert.equal(selection.decision, "PROPOSE_FOR_HUMAN_REVIEW");
	assert.equal(
		selection.selection_reason,
		"DEMAND_TIMED_LOCAL_EVENT_OR_HOLIDAY",
	);
	assert.equal(Boolean(selection.opportunity.demand_source?.name), true);
	assert.match(
		selection.opportunity.community_context ?? "",
		/Santa Cruz County|Capitola|Labor Day|Fair|Festival|Open Studios|hard water|vacation|ADU|storm/i,
	);
	const topic = topicFromDemandEntry(demand.active_demand[0]);
	assert.equal(topic.score_bonus >= 4, true);
});

test("optional browser research can mark calendar-plus-browser when live", async () => {
	const research = await gatherLocalDemandResearch({
		activeEntries: [
			{
				id: "event-capitola-art-wine-2026",
				source: { url: "https://capitolaartandwine.com/" },
			},
		],
		browserResearch: {
			async read() {
				return {
					classification: "LIVE_VERIFIED",
					payload: { excerpt: "Capitola Art & Wine Festival September 2026" },
				};
			},
		},
		runId: "proposal-2026-08-01",
	});
	assert.equal(research.mode, "CALENDAR_PLUS_BROWSER");
	assert.equal(research.classification, "LIVE_VERIFIED");
	assert.equal(research.observations.length, 1);
});
