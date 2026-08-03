/**
 * Task 3: Search Console query signals for blog topic scoring.
 * Raw query strings are matched in process only; persisted evidence stays redacted.
 */
import { makeEvidence, sha256 } from "./contracts.mjs";

const MAX_GSC_SCORE_BONUS = 6;
const DEFAULT_ROW_LIMIT = 100;

/**
 * @param {string} siteUrl
 * @returns {readonly string[]}
 */
export function candidateSearchConsoleSiteUrls(siteUrl) {
	if (typeof siteUrl !== "string" || !siteUrl.startsWith("https://")) {
		return Object.freeze([]);
	}
	/** @type {string[]} */
	const urls = [siteUrl];
	try {
		const host = new URL(siteUrl).hostname.replace(/^www\./i, "");
		urls.push(`sc-domain:${host}`);
		urls.push(`https://${host}/`);
		urls.push(`https://www.${host}/`);
	} catch {
		return Object.freeze([siteUrl]);
	}
	return Object.freeze([...new Set(urls)]);
}

/**
 * @param {Date} [now]
 */
export function defaultSearchConsoleTopicWindow(now = new Date()) {
	const end = new Date(now);
	end.setUTCDate(end.getUTCDate() - 3);
	const start = new Date(end);
	start.setUTCDate(start.getUTCDate() - 27);
	return Object.freeze({
		startDate: start.toISOString().slice(0, 10),
		endDate: end.toISOString().slice(0, 10),
		dimensions: Object.freeze(["query"]),
		rowLimit: DEFAULT_ROW_LIMIT,
	});
}

const GEO_STOPWORDS = new Set([
	"santa",
	"cruz",
	"county",
	"home",
	"homes",
	"homeowner",
	"homeowners",
]);

function tokenize(value) {
	return new Set(
		String(value)
			.toLowerCase()
			.split(/[^a-z0-9]+/)
			.filter((token) => token.length > 2),
	);
}

function contentTokens(value) {
	return new Set(
		[...tokenize(value)].filter((token) => !GEO_STOPWORDS.has(token)),
	);
}

/**
 * Match a raw Search Console query key to a catalog topic in process memory.
 * @param {object} topic
 * @param {string} queryKey
 */
export function matchTopicToSearchConsoleQuery(topic, queryKey) {
	if (!topic?.id || typeof queryKey !== "string" || !queryKey.trim()) {
		return null;
	}
	const query = queryKey.trim().toLowerCase();
	const cluster = String(topic.query_cluster ?? "").toLowerCase();
	if (cluster && query === cluster) {
		return Object.freeze({
			topic_id: topic.id,
			strength: "exact",
			query_hash: sha256(queryKey),
		});
	}
	const queryContent = contentTokens(query);
	const clusterContent = contentTokens(cluster);
	const tagContent = contentTokens((topic.tags ?? []).join(" "));
	const catalogContent = new Set([...clusterContent, ...tagContent]);
	const contentOverlap = [...queryContent].filter((token) =>
		catalogContent.has(token),
	);
	const local =
		query.includes("santa cruz") ||
		(tokenize(query).has("santa") && tokenize(query).has("cruz"));
	if (!local || contentOverlap.length < 2) return null;
	if (contentOverlap.length >= 3) {
		return Object.freeze({
			topic_id: topic.id,
			strength: "strong",
			query_hash: sha256(queryKey),
			overlap_count: contentOverlap.length,
		});
	}
	return Object.freeze({
		topic_id: topic.id,
		strength: "partial",
		query_hash: sha256(queryKey),
		overlap_count: contentOverlap.length,
	});
}

/**
 * @param {{ clicks?: number, impressions?: number, position?: number, strength?: string }} signal
 */
export function searchConsoleScoreBonus(signal) {
	let bonus = 0;
	const clicks = Number(signal?.clicks ?? 0);
	const impressions = Number(signal?.impressions ?? 0);
	const position = Number(signal?.position ?? 100);
	if (impressions >= 50) bonus += 2;
	else if (impressions >= 10) bonus += 1;
	if (clicks >= 5) bonus += 3;
	else if (clicks >= 1) bonus += 1;
	if (position > 0 && position <= 20) bonus += 1;
	if (signal?.strength === "exact") bonus += 1;
	return Math.min(MAX_GSC_SCORE_BONUS, bonus);
}

/**
 * Build redacted topic signals from raw Search Analytics rows (in process).
 * @param {object[]} catalog
 * @param {object[]} rows
 */
export function buildTopicSignalsFromRawRows(catalog, rows = []) {
	/** @type {Map<string, object>} */
	const byTopic = new Map();
	for (const row of rows) {
		const queryKey = Array.isArray(row?.keys) ? String(row.keys[0] ?? "") : "";
		if (!queryKey) continue;
		for (const topic of catalog ?? []) {
			const match = matchTopicToSearchConsoleQuery(topic, queryKey);
			if (!match) continue;
			const prior = byTopic.get(topic.id);
			const strengthRank = { exact: 3, strong: 2, partial: 1 };
			const nextStrength =
				(strengthRank[match.strength] ?? 0) >=
				(strengthRank[prior?.strength] ?? 0)
					? match.strength
					: prior.strength;
			byTopic.set(topic.id, {
				topic_id: topic.id,
				strength: nextStrength,
				clicks: Number(row.clicks ?? 0) + Number(prior?.clicks ?? 0),
				impressions:
					Number(row.impressions ?? 0) + Number(prior?.impressions ?? 0),
				ctr: Number(row.ctr ?? prior?.ctr ?? 0),
				position: Number(row.position ?? prior?.position ?? 0),
				matched_query_hashes: Object.freeze([
					...(prior?.matched_query_hashes ?? []),
					match.query_hash,
				]).slice(0, 20),
			});
		}
	}
	return Object.freeze(
		[...byTopic.values()]
			.map((signal) =>
				Object.freeze({
					...signal,
					matched_query_hashes: Object.freeze(signal.matched_query_hashes),
					score_bonus: searchConsoleScoreBonus(signal),
				}),
			)
			.sort(
				(left, right) =>
					right.score_bonus - left.score_bonus ||
					right.clicks - left.clicks ||
					right.impressions - left.impressions,
			),
	);
}

function emptyResult({
	runId,
	classification,
	reason,
	nextAction,
	collectedAt = new Date().toISOString(),
}) {
	const evidence = makeEvidence({
		runId,
		source: "search-console",
		scope: "topic-signals",
		classification,
		sourceUrlOrTool: "search-console-topic-wiring",
		collectedAt,
		payload: {
			reason,
			next_action: nextAction,
			matched_topic_count: 0,
			signals: [],
		},
	});
	return Object.freeze({
		classification,
		signals: Object.freeze([]),
		evidence,
		reason,
	});
}

/**
 * Collect redacted topic signals from Search Console when available.
 * Soft-fails: never throws for disabled/blocked/upstream failures.
 */
export async function collectSearchConsoleTopicSignals({
	searchConsole,
	siteUrl,
	runId,
	catalog = [],
	now = new Date(),
	window = defaultSearchConsoleTopicWindow(now),
} = {}) {
	if (!searchConsole || typeof searchConsole.queryTopicSignals !== "function") {
		return emptyResult({
			runId,
			classification: "BLOCKED_MISSING_CREDENTIALS",
			reason:
				"Search Console topic wiring requires an adapter with queryTopicSignals.",
			nextAction:
				"Enable SEO_AGENT_ENABLE_SEARCH_CONSOLE with service-account credentials when a live topic-signal read is needed.",
		});
	}
	const sites = candidateSearchConsoleSiteUrls(siteUrl);
	if (sites.length === 0) {
		return emptyResult({
			runId,
			classification: "BLOCKED_MISSING_CREDENTIALS",
			reason: "Search Console topic wiring needs an https site URL.",
			nextAction: "Set SEO_AGENT_SITE_URL to the canonical Production site.",
		});
	}

	let lastFailure = null;
	for (const candidate of sites) {
		try {
			const result = await searchConsole.queryTopicSignals({
				runId,
				siteUrl: candidate,
				catalog,
				request: window,
				now,
			});
			if (!result || typeof result !== "object") {
				lastFailure = new Error("Empty Search Console topic-signal response.");
				continue;
			}
			if (result.classification === "BLOCKED_MISSING_CREDENTIALS") {
				return Object.freeze({
					classification: "BLOCKED_MISSING_CREDENTIALS",
					signals: Object.freeze([]),
					evidence: result.evidence ?? result,
					reason: result.reason ?? result.payload?.reason ?? null,
				});
			}
			if (result.classification === "LIVE_VERIFIED") {
				return Object.freeze({
					classification: "LIVE_VERIFIED",
					signals: Object.freeze(result.signals ?? []),
					evidence: result.evidence,
					reason: null,
				});
			}
			lastFailure = result;
		} catch (error) {
			lastFailure = error;
		}
	}

	return emptyResult({
		runId,
		classification: "FAILED",
		reason:
			lastFailure instanceof Error
				? lastFailure.message
				: lastFailure?.payload?.reason ||
					"Search Console topic query did not return usable rows.",
		nextAction:
			"Confirm the service account can read Search Analytics for the property, then rerun with SEO_AGENT_ENABLE_SEARCH_CONSOLE=true.",
	});
}

/**
 * Apply GSC topic signals onto a catalog via score_bonus (soft boost only).
 */
export function applySearchConsoleSignalsToCatalog(catalog, signals = []) {
	const bonusById = new Map(
		(signals ?? []).map((signal) => [signal.topic_id, signal]),
	);
	return Object.freeze(
		(catalog ?? []).map((topic) => {
			const signal = bonusById.get(topic.id);
			if (!signal) return topic;
			const nextBonus =
				Number(topic.score_bonus ?? 0) + Number(signal.score_bonus ?? 0);
			return Object.freeze({
				...topic,
				score_bonus: nextBonus,
				gsc_signal: Object.freeze({
					strength: signal.strength,
					clicks: signal.clicks,
					impressions: signal.impressions,
					position: signal.position,
					score_bonus: signal.score_bonus,
				}),
			});
		}),
	);
}
