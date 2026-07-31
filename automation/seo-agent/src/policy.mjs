import {
	APPROVED_MODEL_ROUTES,
	DEFAULT_BUDGETS,
	DEFAULT_MODEL_ROUTE,
	MODEL_COST_RESERVATION_USD,
	MODEL_ROLE_POLICY,
	PROHIBITED_ACTIONS,
	TRUTH_STATES,
} from "./constants.mjs";

const SECRET_PATTERNS = [
	/(?:api[_-]?key|token|secret|password)\s*[:=]\s*['"]?[a-z0-9_\-]{12,}/i,
	/-----BEGIN [A-Z ]+PRIVATE KEY-----/,
	/gh[pousr]_[a-zA-Z0-9]{20,}/,
];

const UNSAFE_CONTENT_PATTERNS = [
	/fake (?:review|testimonial|job)/i,
	/keyword\s*stuff/i,
	/doorway page/i,
	/guaranteed (?:price|result|same-day)/i,
	/ignore (?:previous|all) instructions/i,
	/reveal (?:the )?(?:system prompt|secret|token)/i,
	/(?:exfiltrate|export|upload|send|post|transmit).{0,96}\b(?:secret|token|credential|api[_ -]?key|password)/i,
	/(?:bypass|disable|override).{0,48}\b(?:approval|policy|guardrail|allowlist|safety)/i,
	/(?:change|modify|edit).{0,48}\b(?:policy|allowlist|tool scope|permissions?|secrets?)/i,
	/(?:curl|wget|invoke-webrequest|powershell|bash).{0,96}\b(?:token|secret|credential|api[_ -]?key)/i,
	/\b(?:tell|instruct|advise).{0,80}\b(?:enter|climb into).{0,48}\b(?:septic tank|sewer|confined space)/i,
	/\b(?:mix|combine).{0,80}\b(?:bleach|acid|caustic|drain cleaner)/i,
	/\b(?:bypass|disable).{0,80}\b(?:gas|sewer|electrical).{0,80}\b(?:safety|shutoff|alarm)/i,
];

const UNSUPPORTED_CONTENT_CLAIM_PATTERNS = [
	/\b(?:fake|invent(?:ed|ing)?|fabricat(?:ed|e))\b.{0,64}\b(?:job|review|testimonial|case study)/i,
	/\$\d|\b(?:exact|flat|starting at|only)\s*\$\d|\bprice(?:s|ing)?\s+(?:starts|from|at)\b/i,
	/\b(?:serve|serving|available in)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3}\b/i,
	/\b(?:guarantee(?:d|s)?|always|never)\b.{0,64}\b(?:result|price|arrival|repair|availability|response)/i,
	/\b(?:24\s*\/\s*7|same[- ]day|within \d+ (?:minute|hour)|immediate(?:ly)?)\b/i,
	/\b(?:licensed|insured|bonded|certified|warrant(?:y|ies)|financing)\b/i,
	/\b\d+(?:\.\d+)?%\b|\b(?:thousands|millions) of (?:customers|jobs|repairs)\b/i,
	/\b(?:copy|reuse|paraphrase)\b.{0,80}\bcompetitor\b/i,
	/\b(?:doorway|city[- ]keyword|keyword stuffing|hidden link|invisible link|mass publish)/i,
	/\bdate[- ]only freshness\b|\b(?:updated|fresh|new) (?:today|this year|in \d{4})\b.{0,96}\b(?:date|freshness)\b/i,
];

export function assertTruthState(value) {
	if (!TRUTH_STATES.includes(value))
		throw new Error(`Unknown truth state: ${value}`);
	return value;
}

export function scanForSecrets(value) {
	const text = typeof value === "string" ? value : JSON.stringify(value);
	return SECRET_PATTERNS.some((pattern) => pattern.test(text));
}

export function classifyUntrustedText(text) {
	if (typeof text !== "string") {
		return {
			accepted: false,
			reason: "UNTRUSTED_OR_UNSAFE_INSTRUCTION",
			matches: ["non-string-untrusted-input"],
		};
	}
	const matches = UNSAFE_CONTENT_PATTERNS.filter((pattern) =>
		pattern.test(text),
	).map(String);
	return matches.length
		? { accepted: false, reason: "UNTRUSTED_OR_UNSAFE_INSTRUCTION", matches }
		: { accepted: true, reason: null, matches: [] };
}

/**
 * A separate content gate avoids treating a factual mention in neutral source
 * evidence as a permission to publish the claim. It returns a non-mutating
 * decision that the strategy/orchestrator must preserve in its Git record.
 */
export function assessContentProposal({
	text,
	approvedEvidenceIds = [],
	existingPageDecision = "UNKNOWN",
} = {}) {
	if (typeof text !== "string" || !text.trim()) {
		return Object.freeze({
			decision: "NO_ACTION",
			reason: "EMPTY_OR_MALFORMED_PROPOSAL",
			matches: [],
		});
	}
	const untrusted = classifyUntrustedText(text);
	if (!untrusted.accepted) {
		return Object.freeze({
			decision: "NO_ACTION",
			reason: untrusted.reason,
			matches: untrusted.matches,
		});
	}
	const matches = UNSUPPORTED_CONTENT_CLAIM_PATTERNS.filter((pattern) =>
		pattern.test(text),
	).map(String);
	if (
		matches.length ||
		!Array.isArray(approvedEvidenceIds) ||
		approvedEvidenceIds.length === 0
	) {
		return Object.freeze({
			decision: "REQUEST_FIRST_PARTY_EVIDENCE",
			reason: matches.length
				? "UNSUPPORTED_OR_DECEPTIVE_CONTENT_CLAIM"
				: "MISSING_APPROVED_EVIDENCE",
			matches,
		});
	}
	if (
		![
			"REFRESH_EXISTING",
			"CONSOLIDATE_EXISTING",
			"NO_CHANGE",
			"CREATE_JUSTIFIED",
		].includes(existingPageDecision)
	) {
		return Object.freeze({
			decision: "NO_ACTION",
			reason: "MISSING_EXISTING_PAGE_DECISION",
			matches: [],
		});
	}
	return Object.freeze({
		decision:
			existingPageDecision === "NO_CHANGE"
				? "NO_ACTION"
				: "PROPOSE_FOR_HUMAN_REVIEW",
		reason: null,
		matches: [],
	});
}

export function evaluateAdversarialPolicyFixture(fixture) {
	if (fixture?.schema_version !== "1.0" || !Array.isArray(fixture.cases))
		throw new Error("Invalid adversarial policy fixture");
	const ids = new Set();
	return fixture.cases.map((entry) => {
		if (
			!entry?.id ||
			ids.has(entry.id) ||
			typeof entry.text !== "string" ||
			typeof entry.accepted !== "boolean"
		) {
			throw new Error(
				`Invalid adversarial policy case: ${entry?.id ?? "unknown"}`,
			);
		}
		ids.add(entry.id);
		const result = classifyUntrustedText(entry.text);
		if (result.accepted !== entry.accepted)
			throw new Error(
				`Adversarial policy case did not match expectation: ${entry.id}`,
			);
		return { id: entry.id, accepted: result.accepted, reason: result.reason };
	});
}

export function assertAllowedDomain(target, budgets = DEFAULT_BUDGETS) {
	const hostname = new URL(target).hostname;
	if (!budgets.allowedDomains.includes(hostname)) {
		throw new Error(`Network target is not allowlisted: ${hostname}`);
	}
	return hostname;
}

export function authorizeAction(
	action,
	{ humanApproval = false, draft = false, branch = "" } = {},
) {
	if (PROHIBITED_ACTIONS.includes(action)) {
		throw new Error(`Policy denied prohibited action: ${action}`);
	}
	if (action === "create_draft_pull_request") {
		if (!humanApproval)
			throw new Error("Policy denied draft PR: human approval is required");
		if (!draft)
			throw new Error(
				"Policy denied PR: only draft pull requests are permitted",
			);
		if (
			typeof branch !== "string" ||
			branch !== branch.trim() ||
			branch === "main" ||
			branch.startsWith("refs/") ||
			!branch.includes("/")
		) {
			throw new Error(
				"Policy denied PR: a non-main feature branch is required",
			);
		}
	}
	if (
		action !== "read_only_research" &&
		action !== "create_draft_pull_request"
	) {
		throw new Error(`Policy denied unknown action: ${action}`);
	}
	return true;
}

export function consumeBudget(
	usage,
	key,
	increment = 1,
	budgets = DEFAULT_BUDGETS,
) {
	const limit = budgets[key];
	if (!Number.isFinite(limit)) throw new Error(`Unknown budget: ${key}`);
	const next = (usage[key] ?? 0) + increment;
	if (next > limit)
		throw new Error(`Budget exhausted: ${key} (${next}/${limit})`);
	return { ...usage, [key]: next };
}

export function assertModelRequestBudget(
	{ prompt, maxOutputTokens },
	budgets = DEFAULT_BUDGETS,
) {
	if (typeof prompt !== "string" || !prompt.trim())
		throw new Error("Model prompt must be a non-empty string");
	if (!Number.isInteger(maxOutputTokens) || maxOutputTokens < 1)
		throw new Error("Model maxOutputTokens must be a positive integer");
	const estimatedInputTokens = Math.ceil(
		new TextEncoder().encode(prompt).length / 4,
	);
	const requestedTokens = estimatedInputTokens + maxOutputTokens;
	if (requestedTokens > budgets.maxModelTokens) {
		throw new Error(
			`Model token budget exhausted before request (${requestedTokens}/${budgets.maxModelTokens})`,
		);
	}
	return Object.freeze({
		estimated_input_tokens: estimatedInputTokens,
		requested_max_output_tokens: maxOutputTokens,
		requested_tokens: requestedTokens,
		max_model_tokens: budgets.maxModelTokens,
	});
}

export function resolveApprovedModelRoute(value = DEFAULT_MODEL_ROUTE) {
	if (
		typeof value !== "string" ||
		value !== value.trim() ||
		!APPROVED_MODEL_ROUTES.includes(value)
	) {
		throw new Error("Model route is not approved by versioned policy");
	}
	return value;
}

export function resolveModelProfile(role, env = process.env) {
	const policy = MODEL_ROLE_POLICY[role] ?? MODEL_ROLE_POLICY.orchestration;
	const envKey =
		role === "writing"
			? "SEO_AGENT_WRITER_MODEL"
			: role === "independent_qa"
				? "SEO_AGENT_JUDGE_MODEL"
				: "SEO_AGENT_MODEL";
	const primary = resolveApprovedModelRoute(env[envKey] ?? policy.primary);
	const fallbackValue = env[`${envKey}_FALLBACKS`];
	const fallbacks = (
		fallbackValue ? fallbackValue.split(",") : policy.fallbacks
	)
		.map((value) => value.trim())
		.filter(Boolean)
		.map((value) => resolveApprovedModelRoute(value));
	if (
		new Set(fallbacks).size !== fallbacks.length ||
		fallbacks.includes(primary)
	) {
		throw new Error(
			`Model fallback policy for ${role} must contain unique approved routes distinct from the primary`,
		);
	}
	return Object.freeze({ role, primary, fallbacks: Object.freeze(fallbacks) });
}

export function resolveGatewayModelOptions(role, env = process.env) {
	const profile = resolveModelProfile(role, env);
	return Object.freeze({
		providerOptions: Object.freeze({
			gateway: Object.freeze({ models: profile.fallbacks }),
		}),
	});
}

export function assertModelCostReservation(
	{
		model = DEFAULT_MODEL_ROUTE,
		reservationUsd = MODEL_COST_RESERVATION_USD,
	} = {},
	budgets = DEFAULT_BUDGETS,
) {
	const approvedModel = resolveApprovedModelRoute(model);
	if (!Number.isFinite(reservationUsd) || reservationUsd <= 0)
		throw new Error("Model cost reservation must be a positive number");
	if (reservationUsd > budgets.maxModelCostUsd) {
		throw new Error(
			`Model cost budget exhausted before request (${reservationUsd}/${budgets.maxModelCostUsd})`,
		);
	}
	return Object.freeze({
		model: approvedModel,
		reserved_max_cost_usd: reservationUsd,
		max_model_cost_usd: budgets.maxModelCostUsd,
	});
}
