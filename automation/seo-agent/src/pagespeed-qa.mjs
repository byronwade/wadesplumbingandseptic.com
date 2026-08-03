/**
 * Task 4: PageSpeed Insights signals for draft/preview QA briefs.
 * Soft budgets annotate human review; they do not fail-close draft publication.
 */
import { makeEvidence } from "./contracts.mjs";

export const PAGESPEED_QA_BUDGETS = Object.freeze({
	performance_score_warn: 0.5,
	performance_score_fail: 0.3,
	lcp_ms_warn: 4_000,
	lcp_ms_fail: 6_000,
	cls_warn: 0.25,
	cls_fail: 0.4,
});

const KEY_AUDITS = Object.freeze([
	"largest-contentful-paint",
	"cumulative-layout-shift",
	"total-blocking-time",
	"first-contentful-paint",
	"speed-index",
	"interactive",
]);

/**
 * Redact a measured URL to origin + pathname only (no query/fragment).
 * @param {string | null | undefined} url
 */
export function redactMeasuredUrl(url) {
	if (typeof url !== "string" || !url.startsWith("https://")) return null;
	try {
		const parsed = new URL(url);
		return `${parsed.origin}${parsed.pathname}`;
	} catch {
		return null;
	}
}

function auditNumeric(audits, id) {
	const value = audits?.[id]?.numeric_value;
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function auditScore(audits, id) {
	const value = audits?.[id]?.score;
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * @param {object} signal
 * @param {typeof PAGESPEED_QA_BUDGETS} [budgets]
 */
export function gradePageSpeedQa(signal, budgets = PAGESPEED_QA_BUDGETS) {
	const notes = [];
	let status = "PASS";
	const score = signal?.performance_score;
	if (typeof score === "number") {
		if (score < budgets.performance_score_fail) {
			status = "FAIL";
			notes.push(
				`Performance score ${score.toFixed(2)} is below the fail budget ${budgets.performance_score_fail}.`,
			);
		} else if (score < budgets.performance_score_warn) {
			status = "WARN";
			notes.push(
				`Performance score ${score.toFixed(2)} is below the warn budget ${budgets.performance_score_warn}.`,
			);
		}
	} else {
		status = "UNAVAILABLE";
		notes.push("Performance score was not present in the PageSpeed payload.");
	}

	const lcp = signal?.lcp_ms;
	if (typeof lcp === "number") {
		if (lcp > budgets.lcp_ms_fail) {
			status = "FAIL";
			notes.push(
				`LCP ${Math.round(lcp)}ms exceeds fail budget ${budgets.lcp_ms_fail}ms.`,
			);
		} else if (lcp > budgets.lcp_ms_warn && status !== "FAIL") {
			status = "WARN";
			notes.push(
				`LCP ${Math.round(lcp)}ms exceeds warn budget ${budgets.lcp_ms_warn}ms.`,
			);
		}
	}

	const cls = signal?.cls;
	if (typeof cls === "number") {
		if (cls > budgets.cls_fail) {
			status = "FAIL";
			notes.push(
				`CLS ${cls.toFixed(3)} exceeds fail budget ${budgets.cls_fail}.`,
			);
		} else if (cls > budgets.cls_warn && status !== "FAIL") {
			status = "WARN";
			notes.push(
				`CLS ${cls.toFixed(3)} exceeds warn budget ${budgets.cls_warn}.`,
			);
		}
	}

	return Object.freeze({ status, notes: Object.freeze(notes) });
}

/**
 * Shape compact PageSpeed adapter evidence into a draft/preview QA signal.
 * @param {object} evidence
 * @param {{ strategy?: string, url?: string }} [context]
 */
export function extractPageSpeedQaSignal(evidence, context = {}) {
	const payload = evidence?.payload ?? {};
	const categories = payload.categories ?? {};
	const audits = payload.audits ?? {};
	const performanceScore = categories.performance?.score ?? null;
	const signal = {
		strategy: context.strategy ?? "mobile",
		measured_url: redactMeasuredUrl(context.url ?? payload.id),
		performance_score:
			typeof performanceScore === "number" ? performanceScore : null,
		lcp_ms: auditNumeric(audits, "largest-contentful-paint"),
		cls: auditNumeric(audits, "cumulative-layout-shift"),
		tbt_ms: auditNumeric(audits, "total-blocking-time"),
		fcp_ms: auditNumeric(audits, "first-contentful-paint"),
		speed_index_ms: auditNumeric(audits, "speed-index"),
		tti_ms: auditNumeric(audits, "interactive"),
		audit_scores: Object.freeze(
			Object.fromEntries(
				KEY_AUDITS.map((id) => [id, auditScore(audits, id)]).filter(
					([, score]) => score !== null,
				),
			),
		),
		lighthouse_version: payload.lighthouse_version ?? null,
	};
	const grade = gradePageSpeedQa(signal);
	return Object.freeze({
		...signal,
		status: grade.status,
		notes: grade.notes,
	});
}

/**
 * @param {object} input
 */
function emptyResult({
	runId,
	classification,
	reason,
	nextAction,
	collectedAt = new Date().toISOString(),
}) {
	const evidence = makeEvidence({
		runId,
		source: "pagespeed",
		scope: "draft-preview-qa",
		classification,
		sourceUrlOrTool: "pagespeed-qa-wiring",
		collectedAt,
		payload: {
			reason,
			next_action: nextAction,
			signal: null,
		},
	});
	return Object.freeze({
		classification,
		signal: null,
		evidence,
		reason,
	});
}

/**
 * Collect a redacted PageSpeed QA signal for draft/preview briefs.
 * Soft-fails: never throws for disabled/blocked/upstream failures.
 */
export async function collectPageSpeedQaSignals({
	pagespeed,
	siteUrl,
	runId,
	strategy = "mobile",
} = {}) {
	if (!pagespeed || typeof pagespeed.probe !== "function") {
		return emptyResult({
			runId,
			classification: "BLOCKED_MISSING_CREDENTIALS",
			reason: "PageSpeed QA wiring requires an adapter with probe().",
			nextAction:
				"Enable SEO_AGENT_ENABLE_PAGESPEED with PAGESPEED_API_KEY when a live draft/preview QA read is needed.",
		});
	}
	if (typeof siteUrl !== "string" || !siteUrl.startsWith("https://")) {
		return emptyResult({
			runId,
			classification: "BLOCKED_MISSING_CREDENTIALS",
			reason: "PageSpeed QA wiring needs an https site URL.",
			nextAction: "Set SEO_AGENT_SITE_URL to the canonical Production site.",
		});
	}

	try {
		const evidence = await pagespeed.probe({
			runId,
			url: siteUrl,
			strategy,
		});
		if (!evidence || typeof evidence !== "object") {
			return emptyResult({
				runId,
				classification: "FAILED",
				reason: "Empty PageSpeed QA response.",
				nextAction:
					"Confirm PAGESPEED_API_KEY and that pagespeedonline.googleapis.com is reachable.",
			});
		}
		if (evidence.classification === "BLOCKED_MISSING_CREDENTIALS") {
			return Object.freeze({
				classification: "BLOCKED_MISSING_CREDENTIALS",
				signal: null,
				evidence,
				reason: evidence.payload?.reason ?? null,
			});
		}
		if (evidence.classification === "LIVE_VERIFIED") {
			const signal = extractPageSpeedQaSignal(evidence, {
				strategy,
				url: siteUrl,
			});
			return Object.freeze({
				classification: "LIVE_VERIFIED",
				signal,
				evidence: makeEvidence({
					runId,
					source: "pagespeed",
					scope: "draft-preview-qa",
					classification: "LIVE_VERIFIED",
					sourceUrlOrTool:
						evidence.source_url_or_tool ??
						"https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
					collectedAt: evidence.collected_at,
					payload: {
						strategy,
						measured_url: signal.measured_url,
						status: signal.status,
						performance_score: signal.performance_score,
						lcp_ms: signal.lcp_ms,
						cls: signal.cls,
						tbt_ms: signal.tbt_ms,
						fcp_ms: signal.fcp_ms,
						notes: signal.notes,
						// Keep raw lighthouse audit dumps out of durable QA evidence.
						raw_audit_count: Object.keys(evidence.payload?.audits ?? {}).length,
					},
				}),
				reason: null,
			});
		}
		return emptyResult({
			runId,
			classification:
				evidence.classification === "FAILED" ? "FAILED" : "FAILED",
			reason:
				evidence.payload?.reason ??
				"PageSpeed QA probe did not return LIVE_VERIFIED evidence.",
			nextAction:
				"Confirm PAGESPEED_API_KEY in Production and rerun with SEO_AGENT_ENABLE_PAGESPEED=true.",
		});
	} catch (error) {
		return emptyResult({
			runId,
			classification: "FAILED",
			reason: error instanceof Error ? error.message : "PageSpeed QA failed.",
			nextAction:
				"Confirm PAGESPEED_API_KEY in Production and that pagespeedonline.googleapis.com is reachable.",
		});
	}
}

/**
 * Markdown section for draft PR briefs (human-facing; no dash punctuation).
 * @param {object | null} pagespeedQa
 */
export function formatPageSpeedQaForBrief(pagespeedQa) {
	if (!pagespeedQa) {
		return `- PageSpeed QA: not collected for this run.`;
	}
	const classification =
		pagespeedQa.classification ?? "BLOCKED_MISSING_CREDENTIALS";
	if (classification !== "LIVE_VERIFIED" || !pagespeedQa.signal) {
		return `- PageSpeed QA: ${classification}${
			pagespeedQa.reason ? ` (${pagespeedQa.reason})` : ""
		}. Soft-fail only; draft publication is not blocked.`;
	}
	const signal = pagespeedQa.signal;
	const score =
		typeof signal.performance_score === "number"
			? signal.performance_score.toFixed(2)
			: "n/a";
	const lcp =
		typeof signal.lcp_ms === "number"
			? `${Math.round(signal.lcp_ms)}ms`
			: "n/a";
	const cls = typeof signal.cls === "number" ? signal.cls.toFixed(3) : "n/a";
	const noteLines =
		signal.notes?.length > 0
			? signal.notes.map((note) => `  - ${note}`).join("\n")
			: "  - Within soft budgets for this baseline URL.";
	return `- PageSpeed QA (${signal.strategy}): status \`${signal.status}\`; performance ${score}; LCP ${lcp}; CLS ${cls}; URL \`${signal.measured_url ?? "n/a"}\`.
${noteLines}
- Soft budgets annotate human review only. They do not fail-close Connect draft PRs.`;
}
