import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const CALENDAR_RELATIVE = "seo/manifests/local-demand-calendar.json";
const TRENDS_RELATIVE = "seo/manifests/trending-local-concepts.json";
const DAY_MS = 24 * 60 * 60 * 1000;

function utcDateOnly(value) {
	const date = value instanceof Date ? value : new Date(value);
	if (!Number.isFinite(date.valueOf()))
		throw new Error("Local demand timing requires a valid date.");
	return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function parseIsoDate(value) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? ""))
		throw new Error(`Invalid calendar ISO date: ${value}`);
	const date = new Date(`${value}T00:00:00Z`);
	if (!Number.isFinite(date.valueOf()))
		throw new Error(`Unparseable calendar ISO date: ${value}`);
	return date;
}

function readManifest(repoRoot, relativePath) {
	if (!repoRoot) return null;
	const path = join(repoRoot, relativePath);
	if (!statSync(path, { throwIfNoEntry: false })?.isFile()) return null;
	return JSON.parse(readFileSync(path, "utf8"));
}

/**
 * Loads the versioned Santa Cruz County demand calendar from the repository
 * snapshot or checkout.
 */
export function loadLocalDemandCalendar({ repoRoot } = {}) {
	const calendar = readManifest(repoRoot, CALENDAR_RELATIVE);
	if (!calendar) return null;
	if (calendar?.schema_version !== "1.0" || !Array.isArray(calendar.entries)) {
		throw new Error("Local demand calendar is malformed.");
	}
	return Object.freeze({
		...calendar,
		entries: Object.freeze(
			calendar.entries.map((entry) => Object.freeze(entry)),
		),
	});
}

/**
 * Loads versioned trending local concepts used when no stronger holiday/event
 * candidate is in window.
 */
export function loadTrendingLocalConcepts({ repoRoot } = {}) {
	const trends = readManifest(repoRoot, TRENDS_RELATIVE);
	if (!trends) return null;
	if (trends?.schema_version !== "1.0" || !Array.isArray(trends.entries)) {
		throw new Error("Trending local concepts manifest is malformed.");
	}
	return Object.freeze({
		...trends,
		entries: Object.freeze(trends.entries.map((entry) => Object.freeze(entry))),
	});
}

/**
 * Returns calendar entries whose event/holiday date is still ahead and inside
 * the configured lead window (useful planning range for a draft PR).
 */
export function selectActiveDemandEntries({ calendar, now = new Date() } = {}) {
	if (!calendar?.entries?.length) return Object.freeze([]);
	const today = utcDateOnly(now);
	const active = [];
	for (const entry of calendar.entries) {
		const eventDate = parseIsoDate(entry.date);
		const eventDay = utcDateOnly(eventDate);
		const leadDays = Math.round((eventDay - today) / DAY_MS);
		const min = entry.lead_window_days?.min ?? 7;
		const max = entry.lead_window_days?.max ?? 120;
		if (leadDays < min || leadDays > max) continue;
		active.push(
			Object.freeze({
				...entry,
				lead_time_days: leadDays,
				publication_timing: Object.freeze({
					mode: "DEMAND_TIMED",
					signal_ids: Object.freeze([
						`local-demand-calendar:${entry.id}`,
						entry.source?.tier === "GOVERNMENT_OR_STANDARD"
							? "government-holiday-calendar"
							: "community-demand-calendar",
					]),
					holiday_name: entry.kind === "HOLIDAY" ? entry.name : undefined,
					holiday_date: entry.kind === "HOLIDAY" ? entry.date : undefined,
					lead_time_days: leadDays,
					local_relevance_evidence_ids: Object.freeze([
						`local-demand-calendar:${entry.id}`,
						`source:${entry.source?.tier ?? "UNKNOWN"}`,
					]),
					event_name: entry.name,
					event_kind: entry.kind,
					date_precision: entry.date_precision ?? "EXACT_DATE",
				}),
			}),
		);
	}
	return Object.freeze(
		active.sort(
			(a, b) => a.lead_time_days - b.lead_time_days || a.id.localeCompare(b.id),
		),
	);
}

/**
 * Returns trending concept entries active for the current UTC month.
 */
export function selectActiveTrendEntries({ trends, now = new Date() } = {}) {
	if (!trends?.entries?.length) return Object.freeze([]);
	const month = (now instanceof Date ? now : new Date(now)).getUTCMonth() + 1;
	const active = [];
	for (const entry of trends.entries) {
		const months = entry.active_months ?? [];
		if (!months.includes(month)) continue;
		const priority = (entry.priority_months ?? []).includes(month);
		active.push(
			Object.freeze({
				...entry,
				in_priority_month: priority,
				publication_timing: Object.freeze({
					mode: "DEMAND_TIMED",
					signal_ids: Object.freeze([
						`trending-local-concepts:${entry.id}`,
						"local-trending-concept",
					]),
					lead_time_days: priority ? 21 : 45,
					local_relevance_evidence_ids: Object.freeze([
						`trending-local-concepts:${entry.id}`,
						`source:${entry.source?.tier ?? "UNKNOWN"}`,
					]),
					event_name: entry.name,
					event_kind: entry.kind,
					date_precision: "MONTH_WINDOW",
				}),
			}),
		);
	}
	return Object.freeze(
		active.sort((a, b) => {
			if (a.in_priority_month !== b.in_priority_month)
				return a.in_priority_month ? -1 : 1;
			return a.id.localeCompare(b.id);
		}),
	);
}

function topicShape(entry, { editorialType, scoreBonus, demandSource } = {}) {
	return Object.freeze({
		id: entry.id,
		slug: entry.slug,
		query_cluster: entry.query_cluster,
		click_title: entry.click_title,
		title_hint: entry.click_title,
		meta_hook: entry.meta_hook,
		search_intent: "informational_to_service",
		unique_value: entry.unique_value,
		angle: entry.angle,
		community_context: entry.community_context,
		must_cover: Object.freeze([...(entry.must_cover ?? [])]),
		people_also_ask: Object.freeze([...(entry.people_also_ask ?? [])]),
		category: entry.category,
		tags: Object.freeze([...(entry.tags ?? [])]),
		image: entry.image,
		image_alt: entry.image_alt,
		preferred_links: Object.freeze([...(entry.preferred_links ?? [])]),
		demand: entry.demand,
		intent_fit: entry.intent_fit,
		cannibalization_risk: entry.cannibalization_risk,
		editorial_type: editorialType,
		publication_timing: entry.publication_timing,
		demand_source: demandSource,
		score_bonus: scoreBonus,
	});
}

/**
 * Converts an active calendar entry into a blog topic shape compatible with
 * the catalog selector.
 */
export function topicFromDemandEntry(entry) {
	const scoreBonus =
		entry.kind === "LOCAL_EVENT" ? 8 : entry.kind === "HOLIDAY" ? 6 : 4;
	return topicShape(entry, {
		editorialType:
			entry.kind === "HOLIDAY"
				? "HOLIDAY_BLOG"
				: entry.kind === "LOCAL_EVENT"
					? "LOCAL_EVENT_BLOG"
					: "SEASONAL_BLOG",
		scoreBonus,
		demandSource: Object.freeze({
			calendar_id: entry.id,
			kind: entry.kind,
			name: entry.name,
			date: entry.date,
			lead_time_days: entry.lead_time_days,
			source_tier: entry.source?.tier ?? null,
			source_url: entry.source?.url ?? null,
		}),
	});
}

/**
 * Converts an active trending concept into a blog topic shape.
 */
export function topicFromTrendEntry(entry) {
	return topicShape(entry, {
		editorialType: "TRENDING_CONCEPT_BLOG",
		scoreBonus: entry.in_priority_month ? 5 : 3,
		demandSource: Object.freeze({
			calendar_id: entry.id,
			kind: entry.kind,
			name: entry.name,
			date: null,
			lead_time_days: entry.publication_timing?.lead_time_days ?? null,
			source_tier: entry.source?.tier ?? null,
			source_url: entry.source?.url ?? null,
		}),
	});
}

/**
 * Automatic live corroboration for active calendar/trend entries. When a
 * browser adapter is absent (offline fixtures), returns calendar-only context.
 */
export async function gatherLocalDemandResearch({
	activeEntries = [],
	browserResearch = null,
	runId = "local-demand-research",
} = {}) {
	if (!browserResearch || typeof browserResearch.read !== "function") {
		return Object.freeze({
			classification: "MOCK_VERIFIED",
			mode: "CALENDAR_ONLY",
			reason:
				"Browser research adapter unavailable in this runtime; using versioned local demand calendar and trending concepts.",
			observations: Object.freeze([]),
		});
	}
	const observations = [];
	for (const entry of activeEntries.slice(0, 2)) {
		const url = entry.source?.url;
		if (typeof url !== "string" || !/^https:\/\//.test(url)) continue;
		try {
			const result = await browserResearch.read({
				runId,
				url,
			});
			observations.push(
				Object.freeze({
					entry_id: entry.id,
					url,
					classification: result?.classification ?? "FAILED",
					tier: "PUBLIC_WEB_UNTRUSTED",
					excerpt_present: Boolean(result?.payload?.excerpt),
				}),
			);
		} catch (error) {
			observations.push(
				Object.freeze({
					entry_id: entry.id,
					url,
					classification: "BLOCKED_MISSING_CREDENTIALS",
					tier: "PUBLIC_WEB_UNTRUSTED",
					reason: error instanceof Error ? error.message : "research failed",
				}),
			);
		}
	}
	const live = observations.some(
		(item) => item.classification === "LIVE_VERIFIED",
	);
	return Object.freeze({
		classification: live ? "LIVE_VERIFIED" : "MOCK_VERIFIED",
		mode: live ? "CALENDAR_PLUS_BROWSER" : "CALENDAR_ONLY",
		reason: live
			? "Calendar timing corroborated with bounded browser research."
			: "Browser research did not yield live corroboration; calendar and trends remain authoritative for timing only.",
		observations: Object.freeze(observations),
	});
}

/**
 * Builds demand-aware topic candidates and research provenance for proposal
 * selection. Calendar timing is automatic and offline-capable. Trending
 * concepts fill gaps when holidays/events are outside their lead windows.
 */
export async function buildDemandAwareTopicCatalog({
	repoRoot,
	now = new Date(),
	baseCatalog = [],
	browserResearch = null,
	runId = "local-demand-research",
} = {}) {
	const calendar = loadLocalDemandCalendar({ repoRoot });
	const trends = loadTrendingLocalConcepts({ repoRoot });
	const activeEntries = selectActiveDemandEntries({ calendar, now });
	const activeTrends = selectActiveTrendEntries({ trends, now });
	const demandTopics = activeEntries.map(topicFromDemandEntry);
	const trendTopics = activeTrends.map(topicFromTrendEntry);
	const research = await gatherLocalDemandResearch({
		activeEntries: [...activeEntries, ...activeTrends],
		browserResearch,
		runId,
	});
	const merged = Object.freeze([
		...demandTopics,
		...trendTopics,
		...baseCatalog.map((topic) =>
			Object.freeze({ ...topic, score_bonus: topic.score_bonus ?? 0 }),
		),
	]);
	return Object.freeze({
		catalog: merged,
		active_demand: Object.freeze(activeEntries),
		active_trends: Object.freeze(activeTrends),
		research,
		calendar_loaded: Boolean(calendar),
		trends_loaded: Boolean(trends),
	});
}
