export const TRUTH_STATES = Object.freeze([
	"LIVE_VERIFIED",
	"MOCK_VERIFIED",
	"BLOCKED_MISSING_CREDENTIALS",
	// A configured or reachable integration can still fail a real probe. Keep
	// that distinct from missing access so operational evidence is truthful.
	"FAILED",
]);

export const AGENT_SEMANTIC_VERSION = "0.1.0";

// Confirmed in the live AI Gateway model catalog on 2026-08-01. Keep this
// route centralized so orchestration and writing never silently diverge.
export const DEFAULT_MODEL_ROUTE = "openai/gpt-5.6-terra";
export const INDEPENDENT_JUDGE_MODEL_ROUTE = "anthropic/claude-sonnet-4.6";
// This route completed an authenticated OIDC probe on 2026-08-01. It is a
// bounded availability fallback only; Terra remains the requested primary.
export const OIDC_VERIFIED_FALLBACK_MODEL_ROUTE = "openai/gpt-4.1-mini";
export const APPROVED_MODEL_ROUTES = Object.freeze([
	DEFAULT_MODEL_ROUTE,
	INDEPENDENT_JUDGE_MODEL_ROUTE,
	OIDC_VERIFIED_FALLBACK_MODEL_ROUTE,
]);
export const MODEL_ROLE_POLICY = Object.freeze({
	orchestration: Object.freeze({
		primary: DEFAULT_MODEL_ROUTE,
		fallbacks: Object.freeze([OIDC_VERIFIED_FALLBACK_MODEL_ROUTE]),
	}),
	writing: Object.freeze({
		primary: DEFAULT_MODEL_ROUTE,
		fallbacks: Object.freeze([OIDC_VERIFIED_FALLBACK_MODEL_ROUTE]),
	}),
	independent_qa: Object.freeze({
		primary: INDEPENDENT_JUDGE_MODEL_ROUTE,
		fallbacks: Object.freeze([
			DEFAULT_MODEL_ROUTE,
			OIDC_VERIFIED_FALLBACK_MODEL_ROUTE,
		]),
	}),
});
// A pre-dispatch per-request reservation, not a provider price assertion.
// Aggregate live billing enforcement requires workflow-run accounting and is
// unavailable until the approved AI Gateway integration is configured.
// A reservation is a deliberately conservative ceiling, not a provider price
// assertion. Nine bounded specialist packets must fit inside one audit run.
export const MODEL_COST_RESERVATION_USD = 0.2;

export const RUN_STATES = Object.freeze([
	"PLANNED",
	"COLLECTING",
	"ANALYZING",
	"AWAITING_HUMAN_APPROVAL",
	"DRAFTING",
	"REVIEWING",
	"QA",
	"DRAFT_PR_OPEN",
	"HUMAN_REVIEW",
	"MERGED_BY_HUMAN",
	"PRODUCTION_AUDIT",
	"CLOSED",
	"REJECTED",
	"BLOCKED_MISSING_CREDENTIALS",
	"BUDGET_EXHAUSTED",
	"SECURITY_ESCALATED",
]);

export const DEFAULT_BUDGETS = Object.freeze({
	maxRunsPerSchedule: 1,
	maxWorkflowSteps: 9,
	maxRunWallSeconds: 300,
	maxModelTokens: 16000,
	maxModelCostUsd: 2,
	maxToolCalls: 24,
	maxBrowserPages: 12,
	maxSandboxWallSeconds: 300,
	maxChangedFiles: 12,
	maxChangedLines: 800,
	maxDraftPrsPerCycle: 1,
	maxProposedUrlsPerCycle: 2,
	maxExternalRequests: 30,
	allowedDomains: [
		"www.wadesplumbingandseptic.com",
		"wadesplumbingandseptic.com",
		"www.googleapis.com",
		"pagespeedonline.googleapis.com",
		"api.github.com",
		"api.vercel.com",
		"ai-gateway.vercel.sh",
		"api.browserbase.com",
		"analyticsdata.googleapis.com",
		"businessprofileperformance.googleapis.com",
		"api.localfalcon.com",
	],
});

export const PROHIBITED_ACTIONS = Object.freeze([
	"direct_main_write",
	"merge_pull_request",
	"deploy_production",
	"promote_deployment",
	"change_repository_settings",
	"change_secrets",
	"create_non_draft_pull_request",
	"auto_rollback",
]);
