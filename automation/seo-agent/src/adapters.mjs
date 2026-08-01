import { makeEvidence, sha256 } from "./contracts.mjs";
import { getToken } from "@vercel/connect";
import { JWT } from "google-auth-library";
import { assertAllowedDomain, classifyUntrustedText } from "./policy.mjs";
import { createRunBudget } from "./run-controls.mjs";
import {
	assessUntrustedWebContent,
	createSourceProvenance,
	SOURCE_TIERS,
} from "./source-policy.mjs";
import { createSecurityEvent } from "./security-events.mjs";

const DEFAULT_REQUEST_POLICY = Object.freeze({
	timeoutMs: 8_000,
	maxAttempts: 3,
	maxResponseBytes: 256_000,
	maxRetryAfterMs: 2_000,
});

const MAX_UNTRUSTED_DOCUMENT_BYTES = 256_000;
const DEFAULT_GITHUB_CONNECTOR_ID = "github/wadesplumbingandseptic-com";
const SEARCH_CONSOLE_READ_SCOPE =
	"https://www.googleapis.com/auth/webmasters.readonly";

export function createVercelConnectGithubTokenProvider({
	connector = DEFAULT_GITHUB_CONNECTOR_ID,
	getTokenImpl = getToken,
} = {}) {
	if (!/^github\/[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/.test(connector)) {
		throw new Error("GitHub Connect connector ID is invalid.");
	}
	return async () => {
		const token = await getTokenImpl(connector, {
			subject: { type: "app" },
		});
		if (typeof token !== "string" || token.length === 0) {
			throw new IntegrationError(
				"CREDENTIAL_REJECTED",
				"Vercel Connect did not return a GitHub app token.",
			);
		}
		return token;
	};
}

/**
 * Returns a short-lived Google access-token provider for a service account.
 * The service account is the background job identity. A user-scoped OAuth
 * connector is intentionally not used for scheduled, non-interactive runs.
 */
export function createGoogleServiceAccountTokenProvider({
	clientEmail,
	privateKey,
	scopes = [SEARCH_CONSOLE_READ_SCOPE],
	jwtFactory = (options) => new JWT(options),
} = {}) {
	if (
		typeof clientEmail !== "string" ||
		!/^[^@\s]+@[^@\s]+\.iam\.gserviceaccount\.com$/.test(clientEmail)
	) {
		throw new Error("Google service account email is invalid.");
	}
	const normalizedPrivateKey = String(privateKey ?? "").replace(/\\n/g, "\n");
	if (
		!normalizedPrivateKey.startsWith("-----BEGIN PRIVATE KEY-----") ||
		!normalizedPrivateKey.includes("-----END PRIVATE KEY-----")
	) {
		throw new Error("Google service account private key is invalid.");
	}
	if (!Array.isArray(scopes) || scopes.length === 0)
		throw new Error("Google service account scopes are required.");

	let client;
	return async () => {
		client ??= jwtFactory({
			email: clientEmail,
			key: normalizedPrivateKey,
			scopes,
		});
		const result = await client.getAccessToken();
		const token = typeof result === "string" ? result : result?.token;
		if (typeof token !== "string" || token.length === 0) {
			throw new IntegrationError(
				"CREDENTIAL_REJECTED",
				"Google service account did not return an access token.",
			);
		}
		return token;
	};
}

async function withAdapterTimeout(operation, { timeoutMs = 8_000, source }) {
	let timer;
	const timeout = new Promise((_, reject) => {
		timer = setTimeout(
			() =>
				reject(
					new IntegrationError("TIMEOUT", `${source} timed out.`, {
						retryable: true,
					}),
				),
			timeoutMs,
		);
	});
	return Promise.race([Promise.resolve().then(operation), timeout]).finally(
		() => clearTimeout(timer),
	);
}

async function readBoundedText(response, { source, maxBytes }) {
	const declared = Number(response.headers?.get?.("content-length"));
	if (Number.isFinite(declared) && declared > maxBytes) {
		throw new IntegrationError(
			"RESPONSE_TOO_LARGE",
			`${source} response exceeds its byte limit.`,
		);
	}
	const text = await response.text();
	if (Buffer.byteLength(text, "utf8") > maxBytes) {
		throw new IntegrationError(
			"RESPONSE_TOO_LARGE",
			`${source} response exceeds its byte limit.`,
		);
	}
	return text;
}

export class IntegrationError extends Error {
	constructor(code, message, { status, retryable = false } = {}) {
		super(message);
		this.name = "IntegrationError";
		this.code = code;
		this.status = status;
		this.retryable = retryable;
	}
}

function blocked(runId, source, scope, reason) {
	return makeEvidence({
		runId,
		source,
		scope,
		classification: "BLOCKED_MISSING_CREDENTIALS",
		sourceUrlOrTool: "configuration-check",
		payload: {
			reason,
			next_action:
				"Follow docs/seo-agent/MANUAL_SETUP.md; do not add credentials to Git.",
		},
	});
}

function authorization(token) {
	return { authorization: `Bearer ${token}` };
}

async function resolveAccessToken({
	accessToken,
	accessTokenProvider,
	source,
	timeoutMs,
}) {
	if (!accessTokenProvider) return accessToken;
	try {
		const token = await withAdapterTimeout(accessTokenProvider, {
			timeoutMs,
			source,
		});
		if (typeof token !== "string" || token.length === 0) {
			throw new IntegrationError(
				"CREDENTIAL_REJECTED",
				`${source} did not return an access token.`,
			);
		}
		return token;
	} catch (error) {
		if (error instanceof IntegrationError) throw error;
		throw new IntegrationError(
			"CREDENTIAL_REJECTED",
			`${source} credential exchange failed.`,
		);
	}
}

function clamp(value, maximum) {
	return Math.min(Math.max(value, 1), maximum);
}

function retryAfterMs(response, maximum) {
	const value = response?.headers?.get?.("retry-after");
	const seconds = Number(value);
	return Number.isFinite(seconds)
		? Math.min(Math.max(0, seconds * 1000), maximum)
		: Math.min(100, maximum);
}

function sanitizeError(error) {
	return error instanceof IntegrationError
		? error
		: new IntegrationError(
				"NETWORK_FAILURE",
				"External integration request failed.",
				{
					retryable: true,
				},
			);
}

/** Bounded retry/timeout wrapper shared by every HTTP adapter. */
export async function requestJson({
	fetchImpl = fetch,
	budget = createRunBudget(),
	url,
	init = {},
	source,
	policy = {},
	sleep = async () => {},
}) {
	const settings = { ...DEFAULT_REQUEST_POLICY, ...policy };
	assertAllowedDomain(url);
	let latestError;
	for (let attempt = 1; attempt <= settings.maxAttempts; attempt += 1) {
		budget.consume("maxExternalRequests");
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), settings.timeoutMs);
		try {
			const response = await fetchImpl(url, {
				...init,
				signal: controller.signal,
			});
			if (!response?.ok) {
				const status = response?.status ?? 0;
				const retryable = status === 408 || status === 429 || status >= 500;
				latestError = new IntegrationError(
					status === 401 || status === 403
						? "CREDENTIAL_REJECTED"
						: status === 429
							? "RATE_LIMITED"
							: "UPSTREAM_HTTP_ERROR",
					`${source} request failed with HTTP ${status}.`,
					{ status, retryable },
				);
				if (!retryable || attempt === settings.maxAttempts) throw latestError;
				await sleep(retryAfterMs(response, settings.maxRetryAfterMs));
				continue;
			}
			const length = Number(response.headers?.get?.("content-length"));
			if (Number.isFinite(length) && length > settings.maxResponseBytes) {
				throw new IntegrationError(
					"RESPONSE_TOO_LARGE",
					`${source} response exceeds its byte limit.`,
				);
			}
			const payload = await response.json();
			if (JSON.stringify(payload).length > settings.maxResponseBytes) {
				throw new IntegrationError(
					"RESPONSE_TOO_LARGE",
					`${source} response exceeds its byte limit.`,
				);
			}
			return payload;
		} catch (error) {
			const normalized = controller.signal.aborted
				? new IntegrationError("TIMEOUT", `${source} request timed out.`, {
						retryable: true,
					})
				: sanitizeError(error);
			latestError = normalized;
			if (!normalized.retryable || attempt === settings.maxAttempts)
				throw normalized;
			await sleep(50);
		} finally {
			clearTimeout(timer);
		}
	}
	throw latestError;
}

function evidence({ runId, source, scope, endpoint, payload, tier }) {
	return makeEvidence({
		runId,
		source,
		scope,
		classification: "LIVE_VERIFIED",
		sourceUrlOrTool: endpoint,
		payload: {
			...(endpoint.startsWith("https://")
				? { provenance: createSourceProvenance({ url: endpoint, tier }) }
				: {}),
			...payload,
		},
	});
}

function requireEnabled(enabled, runId, source, scope) {
	return enabled
		? null
		: blocked(
				runId,
				source,
				scope,
				"Integration is feature-flagged off by default.",
			);
}

function redactedSearchConsolePayload(payload, limit = 100) {
	return {
		response_aggregation_type: payload.responseAggregationType ?? null,
		rows: (payload.rows ?? []).slice(0, limit).map((row) => ({
			dimension_hashes: (row.keys ?? []).map((key) => sha256(String(key))),
			clicks: Number(row.clicks ?? 0),
			impressions: Number(row.impressions ?? 0),
			ctr: Number(row.ctr ?? 0),
			position: Number(row.position ?? 0),
		})),
	};
}

function compactPageSpeedPayload(payload) {
	const lighthouse = payload.lighthouseResult ?? {};
	return {
		id: payload.id ?? null,
		lighthouse_version: lighthouse.lighthouseVersion ?? null,
		categories: Object.fromEntries(
			Object.entries(lighthouse.categories ?? {})
				.slice(0, 8)
				.map(([key, value]) => [key, { score: value?.score ?? null }]),
		),
		audits: Object.fromEntries(
			Object.entries(lighthouse.audits ?? {})
				.slice(0, 40)
				.map(([key, value]) => [
					key,
					{
						score: value?.score ?? null,
						numeric_value: value?.numericValue ?? null,
						display_value: value?.displayValue ?? null,
					},
				]),
		),
	};
}

export function assertCompleteSearchConsoleWindow(request, now = new Date()) {
	if (
		!/^\d{4}-\d{2}-\d{2}$/.test(request?.startDate ?? "") ||
		!/^\d{4}-\d{2}-\d{2}$/.test(request?.endDate ?? "")
	) {
		throw new Error(
			"Search Console requests require YYYY-MM-DD inclusive dates.",
		);
	}
	if (request.startDate > request.endDate)
		throw new Error("Search Console startDate must not be after endDate.");
	const latestComplete = new Date(now);
	latestComplete.setUTCDate(latestComplete.getUTCDate() - 3);
	const latest = latestComplete.toISOString().slice(0, 10);
	if (request.endDate > latest) {
		throw new Error(
			`Search Console endDate is too recent to treat as complete; latest eligible date is ${latest}.`,
		);
	}
	return { ...request, rowLimit: clamp(request.rowLimit ?? 100, 1_000) };
}

export function createAiGatewayAdapter({
	enabled = true,
	accessToken,
	fetchImpl = fetch,
	budget,
	requestPolicy,
} = {}) {
	const endpoint = "https://ai-gateway.vercel.sh/v1/models";
	return {
		async probe({ runId }) {
			const disabled = requireEnabled(
				enabled,
				runId,
				"ai-gateway",
				"model-catalog-read",
			);
			if (disabled) return disabled;
			const payload = await requestJson({
				fetchImpl,
				budget,
				url: endpoint,
				source: "AI Gateway model catalog",
				policy: requestPolicy,
				init:
					typeof accessToken === "string" && accessToken.length > 0
						? { headers: { authorization: `Bearer ${accessToken}` } }
						: undefined,
			});
			return evidence({
				runId,
				source: "ai-gateway",
				scope: "model-catalog-read",
				endpoint,
				tier: SOURCE_TIERS.OFFICIAL_PROVIDER,
				payload: {
					models: (payload.data ?? []).slice(0, 100).map((model) => ({
						id: model.id ?? null,
						type: model.type ?? null,
						context_window: model.context_window ?? null,
						max_tokens: model.max_tokens ?? null,
					})),
				},
			});
		},
	};
}

export function createSearchConsoleAdapter({
	accessToken,
	accessTokenProvider,
	enabled = true,
	fetchImpl = fetch,
	budget,
	requestPolicy,
	now,
} = {}) {
	const sitesEndpoint = "https://www.googleapis.com/webmasters/v3/sites";
	return {
		async probe({ runId }) {
			const disabled = requireEnabled(
				enabled,
				runId,
				"search-console",
				"site-access",
			);
			if (disabled) return disabled;
			const resolvedAccessToken = await resolveAccessToken({
				accessToken,
				accessTokenProvider,
				source: "Search Console service account",
				timeoutMs: requestPolicy?.timeoutMs,
			});
			if (!resolvedAccessToken)
				return blocked(
					runId,
					"search-console",
					"site-access",
					"Missing read-only Search Console service-account credential.",
				);
			const payload = await requestJson({
				fetchImpl,
				budget,
				url: sitesEndpoint,
				init: { headers: authorization(resolvedAccessToken) },
				source: "Search Console site list",
				policy: requestPolicy,
			});
			return evidence({
				runId,
				source: "search-console",
				scope: "site-access",
				endpoint: sitesEndpoint,
				tier: SOURCE_TIERS.FIRST_PARTY_ANALYTICS,
				payload: {
					sites: (payload.siteEntry ?? []).slice(0, 100).map((site) => ({
						site_url_hash: sha256(site.siteUrl),
						permission_level: site.permissionLevel ?? null,
					})),
				},
			});
		},
		async query({ runId, siteUrl, request }) {
			const disabled = requireEnabled(
				enabled,
				runId,
				"search-console",
				"query-performance",
			);
			if (disabled) return disabled;
			const resolvedAccessToken = await resolveAccessToken({
				accessToken,
				accessTokenProvider,
				source: "Search Console service account",
				timeoutMs: requestPolicy?.timeoutMs,
			});
			if (!resolvedAccessToken)
				return blocked(
					runId,
					"search-console",
					"query-performance",
					"Missing read-only Search Console service-account credential.",
				);
			const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
			const payload = await requestJson({
				fetchImpl,
				budget,
				url: endpoint,
				init: {
					method: "POST",
					headers: {
						...authorization(resolvedAccessToken),
						"content-type": "application/json",
					},
					body: JSON.stringify(assertCompleteSearchConsoleWindow(request, now)),
				},
				source: "Search Console query",
				policy: requestPolicy,
			});
			return evidence({
				runId,
				source: "search-console",
				scope: "query-performance",
				endpoint,
				tier: SOURCE_TIERS.FIRST_PARTY_ANALYTICS,
				payload: redactedSearchConsolePayload(payload),
			});
		},
	};
}

export function createPageSpeedAdapter({
	apiKey,
	enabled = true,
	fetchImpl = fetch,
	budget,
	requestPolicy,
} = {}) {
	return {
		async probe(input) {
			return this.analyze(input);
		},
		async analyze({ runId, url, strategy = "mobile" }) {
			const disabled = requireEnabled(
				enabled,
				runId,
				"pagespeed",
				"performance-audit",
			);
			if (disabled) return disabled;
			if (!apiKey)
				return blocked(
					runId,
					"pagespeed",
					"performance-audit",
					"Missing approved PageSpeed API key for automated requests.",
				);
			if (!["mobile", "desktop"].includes(strategy))
				throw new Error("PageSpeed strategy must be mobile or desktop.");
			const endpoint = new URL(
				"https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
			);
			endpoint.searchParams.set("url", url);
			endpoint.searchParams.set("strategy", strategy);
			endpoint.searchParams.set("key", apiKey);
			const payload = await requestJson({
				fetchImpl,
				budget,
				url: endpoint,
				source: "PageSpeed request",
				policy: requestPolicy,
			});
			return evidence({
				runId,
				source: "pagespeed",
				scope: `performance-audit:${strategy}`,
				endpoint: endpoint.origin + endpoint.pathname,
				tier: SOURCE_TIERS.FIRST_PARTY_ANALYTICS,
				payload: compactPageSpeedPayload(payload),
			});
		},
	};
}

export function createBrowserResearchAdapter({
	enabled = false,
	allowedDomains = [],
	fetchImpl = fetch,
	budget = createRunBudget(),
	maxExcerptChars = 4_000,
	timeoutMs = DEFAULT_REQUEST_POLICY.timeoutMs,
	maxResponseBytes = MAX_UNTRUSTED_DOCUMENT_BYTES,
} = {}) {
	return {
		async probe(input) {
			return this.read(input);
		},
		async read({ runId, url }) {
			const disabled = requireEnabled(
				enabled,
				runId,
				"browser-research",
				"public-web-research",
			);
			if (disabled) return disabled;
			assertAllowedDomain(url);
			if (!allowedDomains.includes(new URL(url).hostname))
				throw new Error(
					`Browser research target is not explicitly approved: ${new URL(url).hostname}`,
				);
			budget.consume("maxBrowserPages");
			budget.consume("maxExternalRequests");
			const controller = new AbortController();
			const response = await withAdapterTimeout(
				() =>
					fetchImpl(url, {
						headers: {
							"user-agent": "WadesSeoAgent/0.1 (+human-approved research)",
						},
						signal: controller.signal,
					}),
				{ timeoutMs, source: "Browser research request" },
			).catch((error) => {
				controller.abort();
				throw error;
			});
			if (!response.ok)
				throw new IntegrationError(
					"UPSTREAM_HTTP_ERROR",
					`Browser research request failed: ${response.status}`,
					{ status: response.status, retryable: response.status >= 500 },
				);
			const html = await withAdapterTimeout(
				() =>
					readBoundedText(response, {
						source: "Browser research",
						maxBytes: maxResponseBytes,
					}),
				{ timeoutMs, source: "Browser research response" },
			);
			const provenance = createSourceProvenance({
				url,
				tier: SOURCE_TIERS.PUBLIC_WEB,
			});
			const assessment = assessUntrustedWebContent(html, provenance);
			if (assessment.security_state === "ESCALATED")
				return createSecurityEvent({
					runId,
					source: "browser-research",
					scope: "public-web-research",
					sourceUrlOrTool: url,
					text: html,
					classification: "LIVE_VERIFIED",
				});
			return evidence({
				runId,
				source: "browser-research",
				scope: "public-web-research",
				endpoint: url,
				tier: SOURCE_TIERS.PUBLIC_WEB,
				payload: {
					retrieval_mode: "HTTP_DOCUMENT_FETCH",
					untrusted: true,
					content_hash: assessment.content_hash,
					excerpt: html
						.replace(/<script[\s\S]*?<\/script>/gi, "")
						.replace(/<style[\s\S]*?<\/style>/gi, "")
						.replace(/\s+/g, " ")
						.slice(0, maxExcerptChars),
				},
			});
		},
	};
}

/**
 * Search is an injected, reviewed provider boundary. It never treats snippets
 * as instructions or facts, and each result must be within the caller's
 * explicit research-domain allowlist before it enters an evidence packet.
 */
export function createWebSearchAdapter({
	enabled = false,
	allowedDomains = [],
	searchClient,
	budget = createRunBudget(),
} = {}) {
	return {
		async probe({
			runId,
			query = "Wade's Plumbing & Septic Santa Cruz County",
		}) {
			return this.search({ runId, query });
		},
		async search({ runId, query, limit = 10 }) {
			if (!enabled || !searchClient)
				return blocked(
					runId,
					"web-search",
					"public-web-search",
					"No approved web-search provider is configured.",
				);
			if (typeof query !== "string" || !query.trim() || query.length > 300)
				throw new Error("Search query must be a non-empty bounded string.");
			budget.consume("maxExternalRequests");
			const results = await searchClient.search({
				query,
				limit: clamp(limit, 20),
			});
			if (!Array.isArray(results))
				throw new IntegrationError(
					"MALFORMED_RESPONSE",
					"Web search provider returned invalid results.",
				);
			for (const item of results.slice(0, 20)) {
				if (
					!item ||
					typeof item.url !== "string" ||
					typeof item.text !== "string"
				)
					continue;
				const provenance = createSourceProvenance({
					url: item.url,
					tier: SOURCE_TIERS.PUBLIC_WEB,
				});
				if (
					assessUntrustedWebContent(
						`${item.title ?? ""}\n${item.text}`,
						provenance,
					).security_state === "ESCALATED"
				) {
					return createSecurityEvent({
						runId,
						source: "web-search",
						scope: "public-web-search",
						sourceUrlOrTool: item.url,
						text: `${item.title ?? ""}\n${item.text}`,
						classification: "LIVE_VERIFIED",
					});
				}
			}
			const normalized = results.slice(0, 20).map((item) => {
				if (
					!item ||
					typeof item.url !== "string" ||
					typeof item.text !== "string"
				)
					throw new IntegrationError(
						"MALFORMED_RESPONSE",
						"Web search result was malformed.",
					);
				assertAllowedDomain(item.url);
				if (!allowedDomains.includes(new URL(item.url).hostname))
					throw new Error(
						`Web search result domain is not explicitly approved: ${new URL(item.url).hostname}`,
					);
				const provenance = createSourceProvenance({
					url: item.url,
					tier: SOURCE_TIERS.PUBLIC_WEB,
				});
				const assessment = assessUntrustedWebContent(
					`${item.title ?? ""}\n${item.text}`,
					provenance,
				);
				return {
					url: item.url,
					provenance,
					title:
						typeof item.title === "string" ? item.title.slice(0, 240) : null,
					content_hash: assessment.content_hash,
					security_state: assessment.security_state,
				};
			});
			return evidence({
				runId,
				source: "web-search",
				scope: "public-web-search",
				endpoint: "approved-search-provider",
				tier: SOURCE_TIERS.PUBLIC_WEB,
				payload: {
					untrusted: true,
					query_hash: sha256(query),
					results: normalized,
				},
			});
		},
	};
}

export function createBrowserAutomationAdapter({
	enabled = false,
	allowedDomains = [],
	browserClient,
	budget = createRunBudget(),
	timeoutMs = DEFAULT_REQUEST_POLICY.timeoutMs,
	maxResponseBytes = MAX_UNTRUSTED_DOCUMENT_BYTES,
} = {}) {
	return {
		async probe(input) {
			return this.read(input);
		},
		async read({ runId, url }) {
			if (!enabled || !browserClient)
				return blocked(
					runId,
					"browser-automation",
					"public-browser-automation",
					"No approved browser-automation provider is configured; HTTP document retrieval is not a substitute.",
				);
			assertAllowedDomain(url);
			if (!allowedDomains.includes(new URL(url).hostname))
				throw new Error(
					`Browser automation target is not explicitly approved: ${new URL(url).hostname}`,
				);
			budget.consume("maxBrowserPages");
			budget.consume("maxExternalRequests");
			const result = await withAdapterTimeout(
				() => browserClient.openPage({ url }),
				{ timeoutMs, source: "Browser automation provider" },
			);
			if (
				!result ||
				typeof result.text !== "string" ||
				typeof result.url !== "string"
			)
				throw new IntegrationError(
					"MALFORMED_RESPONSE",
					"Browser automation provider returned invalid page data.",
				);
			if (Buffer.byteLength(result.text, "utf8") > maxResponseBytes)
				throw new IntegrationError(
					"RESPONSE_TOO_LARGE",
					"Browser automation response exceeds its byte limit.",
				);
			assertAllowedDomain(result.url);
			if (!allowedDomains.includes(new URL(result.url).hostname))
				throw new Error(
					`Browser automation redirect target is not explicitly approved: ${new URL(result.url).hostname}`,
				);
			const provenance = createSourceProvenance({
				url: result.url,
				tier: SOURCE_TIERS.PUBLIC_WEB,
			});
			const assessment = assessUntrustedWebContent(result.text, provenance);
			if (assessment.security_state === "ESCALATED")
				return createSecurityEvent({
					runId,
					source: "browser-automation",
					scope: "public-browser-automation",
					sourceUrlOrTool: result.url,
					text: result.text,
					classification: "LIVE_VERIFIED",
				});
			return evidence({
				runId,
				source: "browser-automation",
				scope: "public-browser-automation",
				endpoint: result.url,
				tier: SOURCE_TIERS.PUBLIC_WEB,
				payload: {
					retrieval_mode: "BROWSER_AUTOMATION",
					untrusted: true,
					content_hash: assessment.content_hash,
					title:
						typeof result.title === "string"
							? result.title.slice(0, 240)
							: null,
					excerpt: result.text.replace(/\s+/g, " ").slice(0, 4_000),
				},
			});
		},
	};
}

export function createBrowserbaseAdapter({
	apiKey,
	projectId,
	enabled = false,
	fetchImpl = fetch,
	budget,
	requestPolicy,
} = {}) {
	const endpoint = "https://api.browserbase.com/v1/sessions";
	return {
		async probe({ runId }) {
			const disabled = requireEnabled(
				enabled,
				runId,
				"browserbase",
				"session-create",
			);
			if (disabled) return disabled;
			if (!apiKey || !projectId)
				return blocked(
					runId,
					"browserbase",
					"session-create",
					"Missing Browserbase project ID or API key.",
				);
			const payload = await requestJson({
				fetchImpl,
				budget,
				url: endpoint,
				init: {
					method: "POST",
					headers: {
						"content-type": "application/json",
						"x-bb-api-key": apiKey,
					},
					body: JSON.stringify({
						projectId,
						timeout: 60,
						keepAlive: false,
						userMetadata: { run_id: runId, purpose: "read-only-seo-research" },
					}),
				},
				source: "Browserbase session",
				policy: requestPolicy,
			});
			if (typeof payload.id !== "string" || typeof payload.status !== "string")
				throw new IntegrationError(
					"MALFORMED_RESPONSE",
					"Browserbase session response was malformed.",
				);
			return evidence({
				runId,
				source: "browserbase",
				scope: "session-create",
				endpoint,
				tier: SOURCE_TIERS.OFFICIAL_PROVIDER,
				payload: {
					session_id: payload.id,
					status: payload.status,
					expires_at: payload.expiresAt ?? null,
					browser_connection_withheld: true,
				},
			});
		},
	};
}

export function createGithubReadAdapter({
	accessToken,
	accessTokenProvider,
	repository = "byronwade/wadesplumbingandseptic.com",
	enabled = true,
	fetchImpl = fetch,
	budget,
	requestPolicy,
} = {}) {
	const [owner, repo] = repository.split("/");
	const base = `https://api.github.com/repos/${encodeURIComponent(owner ?? "")}/${encodeURIComponent(repo ?? "")}`;
	const hasCredential = Boolean(accessToken || accessTokenProvider);
	const resolveAccessToken = async () => {
		if (accessToken) return accessToken;
		if (!accessTokenProvider) return undefined;
		const token = await accessTokenProvider();
		if (typeof token !== "string" || token.length === 0) {
			throw new IntegrationError(
				"CREDENTIAL_REJECTED",
				"GitHub credential provider returned no token.",
			);
		}
		return token;
	};
	const request = async (url, init, source) => {
		const token = await resolveAccessToken();
		return requestJson({
			fetchImpl,
			budget,
			url,
			init: {
				...init,
				headers: {
					...authorization(token),
					accept: "application/vnd.github+json",
					"x-github-api-version": "2026-03-10",
					...init?.headers,
				},
			},
			source,
			policy: requestPolicy,
		});
	};
	const guard = (runId, scope) =>
		requireEnabled(enabled, runId, "github", scope) ??
		(!hasCredential
			? blocked(
					runId,
					"github",
					scope,
					"Missing human-approved least-privilege GitHub credential.",
				)
			: null);
	return {
		async probe({ runId }) {
			const denied = guard(runId, "repository-read");
			if (denied) return denied;
			const payload = await request(base, {}, "GitHub repository");
			return evidence({
				runId,
				source: "github",
				scope: "repository-read",
				endpoint: base,
				tier: SOURCE_TIERS.REPOSITORY_FACT,
				payload: {
					full_name: payload.full_name ?? null,
					default_branch: payload.default_branch ?? null,
					private: Boolean(payload.private),
					archived: Boolean(payload.archived),
					pushed_at: payload.pushed_at ?? null,
				},
			});
		},
		async listPullRequests({ runId, state = "open", perPage = 20 }) {
			const denied = guard(runId, "pull-request-read");
			if (denied) return denied;
			if (!["open", "closed", "all"].includes(state))
				throw new Error(
					"GitHub pull request state must be open, closed, or all.",
				);
			const endpoint = new URL(`${base}/pulls`);
			endpoint.searchParams.set("state", state);
			endpoint.searchParams.set("per_page", String(clamp(perPage, 100)));
			const payload = await request(endpoint, {}, "GitHub pull request list");
			if (!Array.isArray(payload))
				throw new IntegrationError(
					"MALFORMED_RESPONSE",
					"GitHub pull request response was malformed.",
				);
			return evidence({
				runId,
				source: "github",
				scope: "pull-request-read",
				endpoint: endpoint.toString(),
				tier: SOURCE_TIERS.REPOSITORY_FACT,
				payload: {
					pull_requests: payload.slice(0, 100).map((pr) => ({
						number: pr.number ?? null,
						state: pr.state ?? null,
						draft: Boolean(pr.draft),
						head_sha: pr.head?.sha ?? null,
						base_ref: pr.base?.ref ?? null,
						updated_at: pr.updated_at ?? null,
					})),
				},
			});
		},
	};
}

export function createVercelReadAdapter({
	accessToken,
	projectId,
	teamId,
	enabled = true,
	fetchImpl = fetch,
	budget,
	requestPolicy,
} = {}) {
	const headers = () => authorization(accessToken);
	const withTeam = (endpoint) => {
		if (teamId) endpoint.searchParams.set("teamId", teamId);
		return endpoint;
	};
	const guard = (runId, scope) =>
		requireEnabled(enabled, runId, "vercel", scope) ??
		(!accessToken || !projectId
			? blocked(
					runId,
					"vercel",
					scope,
					"Missing Vercel read token or approved sidecar/public project identifier.",
				)
			: null);
	const request = (url, source) =>
		requestJson({
			fetchImpl,
			budget,
			url,
			init: { headers: headers() },
			source,
			policy: requestPolicy,
		});
	return {
		async probe({ runId }) {
			const denied = guard(runId, "project-read");
			if (denied) return denied;
			const endpoint = withTeam(
				new URL(
					`https://api.vercel.com/v9/projects/${encodeURIComponent(projectId)}`,
				),
			);
			const payload = await request(endpoint, "Vercel project");
			return evidence({
				runId,
				source: "vercel",
				scope: "project-read",
				endpoint: endpoint.toString(),
				tier: SOURCE_TIERS.OFFICIAL_PROVIDER,
				payload: {
					id: payload.id ?? null,
					name: payload.name ?? null,
					framework: payload.framework ?? null,
					latest_deployments: (payload.latestDeployments ?? [])
						.slice(0, 20)
						.map((d) => ({
							uid: d.uid ?? null,
							target: d.target ?? null,
							state: d.state ?? null,
							url: d.url ?? null,
						})),
				},
			});
		},
		async listDeployments({ runId, target = "production", limit = 10 }) {
			const denied = guard(runId, "deployment-read");
			if (denied) return denied;
			if (!["production", "preview"].includes(target))
				throw new Error(
					"Vercel deployment target must be production or preview.",
				);
			const endpoint = withTeam(
				new URL("https://api.vercel.com/v6/deployments"),
			);
			endpoint.searchParams.set("projectId", projectId);
			endpoint.searchParams.set("target", target);
			endpoint.searchParams.set("limit", String(clamp(limit, 100)));
			const payload = await request(endpoint, "Vercel deployment list");
			return evidence({
				runId,
				source: "vercel",
				scope: "deployment-read",
				endpoint: endpoint.toString(),
				tier: SOURCE_TIERS.OFFICIAL_PROVIDER,
				payload: {
					deployments: (payload.deployments ?? []).slice(0, 100).map((d) => ({
						uid: d.uid ?? null,
						target: d.target ?? null,
						state: d.state ?? null,
						url: d.url ?? null,
						meta: {
							github_commit_sha: d.meta?.githubCommitSha ?? null,
							github_commit_ref: d.meta?.githubCommitRef ?? null,
						},
						created_at: d.createdAt ?? null,
					})),
				},
			});
		},
	};
}

export function createGa4Adapter({
	accessToken,
	propertyId,
	enabled = false,
	fetchImpl = fetch,
	budget,
	requestPolicy,
} = {}) {
	return {
		async probe({ runId }) {
			const disabled = requireEnabled(enabled, runId, "ga4", "report-read");
			if (disabled) return disabled;
			if (!accessToken || !propertyId)
				return blocked(
					runId,
					"ga4",
					"report-read",
					"Missing GA4 read credential or property ID.",
				);
			const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`;
			const payload = await requestJson({
				fetchImpl,
				budget,
				url: endpoint,
				init: {
					method: "POST",
					headers: {
						...authorization(accessToken),
						"content-type": "application/json",
					},
					body: JSON.stringify({
						dateRanges: [{ startDate: "30daysAgo", endDate: "4daysAgo" }],
						dimensions: [{ name: "date" }],
						metrics: [{ name: "sessions" }],
						limit: "100",
					}),
				},
				source: "GA4 report",
				policy: requestPolicy,
			});
			return evidence({
				runId,
				source: "ga4",
				scope: "report-read",
				endpoint,
				tier: SOURCE_TIERS.FIRST_PARTY_ANALYTICS,
				payload: {
					row_count: (payload.rows ?? []).slice(0, 100).length,
					rows: (payload.rows ?? []).slice(0, 100).map((row) => ({
						dimension_values: (row.dimensionValues ?? []).map(
							(value) => value.value ?? null,
						),
						metric_values: (row.metricValues ?? []).map(
							(value) => value.value ?? null,
						),
					})),
				},
			});
		},
	};
}

export function createBusinessProfileAdapter({
	accessToken,
	locationId,
	enabled = false,
	fetchImpl = fetch,
	budget,
	requestPolicy,
} = {}) {
	return {
		async probe({ runId }) {
			const disabled = requireEnabled(
				enabled,
				runId,
				"business-profile",
				"performance-read",
			);
			if (disabled) return disabled;
			if (!accessToken || !locationId)
				return blocked(
					runId,
					"business-profile",
					"performance-read",
					"Missing Business Profile read credential or location ID.",
				);
			const endpoint = new URL(
				`https://businessprofileperformance.googleapis.com/v1/locations/${encodeURIComponent(locationId)}:fetchMultiDailyMetricsTimeSeries`,
			);
			endpoint.searchParams.set("dailyMetrics", "WEBSITE_CLICKS");
			const payload = await requestJson({
				fetchImpl,
				budget,
				url: endpoint,
				init: { headers: authorization(accessToken) },
				source: "Business Profile performance",
				policy: requestPolicy,
			});
			return evidence({
				runId,
				source: "business-profile",
				scope: "performance-read",
				endpoint: endpoint.toString(),
				tier: SOURCE_TIERS.FIRST_PARTY_ANALYTICS,
				payload: {
					metric_series: (payload.multiDailyMetricTimeSeries ?? [])
						.slice(0, 10)
						.map((item) => ({
							metric: item.dailyMetric ?? null,
							points: (item.timeSeries?.datedValues ?? [])
								.slice(0, 100)
								.map((point) => ({
									date: point.date ?? null,
									value: point.value ?? null,
								})),
						})),
				},
			});
		},
	};
}

export function createLocalFalconAdapter({
	apiKey,
	enabled = false,
	fetchImpl = fetch,
	budget,
	requestPolicy,
} = {}) {
	const endpoint = "https://api.localfalcon.com/v1/reports/";
	return {
		async probe({ runId }) {
			const disabled = requireEnabled(
				enabled,
				runId,
				"local-falcon",
				"report-read",
			);
			if (disabled) return disabled;
			if (!apiKey)
				return blocked(
					runId,
					"local-falcon",
					"report-read",
					"Missing Local Falcon API credential.",
				);
			const payload = await requestJson({
				fetchImpl,
				budget,
				url: endpoint,
				init: {
					method: "POST",
					headers: {
						authorization: `Bearer ${apiKey}`,
						"content-type": "application/json",
					},
					body: "{}",
				},
				source: "Local Falcon reports",
				policy: requestPolicy,
			});
			if (payload.success !== true)
				throw new IntegrationError(
					"MALFORMED_RESPONSE",
					"Local Falcon did not return its documented success envelope.",
				);
			return evidence({
				runId,
				source: "local-falcon",
				scope: "report-read",
				endpoint,
				tier: SOURCE_TIERS.OFFICIAL_PROVIDER,
				payload: {
					report_count: Array.isArray(payload.data)
						? payload.data.slice(0, 100).length
						: 0,
				},
			});
		},
	};
}

export function createUnsupportedOptionalAdapter(name, reason) {
	return {
		probe: ({ runId }) =>
			Promise.resolve(blocked(runId, name, "optional-adapter", reason)),
	};
}

export function createIntegrationRegistry({
	config = {},
	fetchImpl = fetch,
	budget = createRunBudget(),
	googleServiceAccountJwtFactory,
} = {}) {
	const credentials = config.credentials ?? {};
	const flags = config.integrationFlags ?? {};
	return {
		ai_gateway: createAiGatewayAdapter({
			enabled: flags.aiGateway === true,
			accessToken: credentials.aiGatewayApiKey ?? credentials.vercelOidcToken,
			fetchImpl,
			budget,
		}),
		github: createGithubReadAdapter({
			accessToken: credentials.githubReadToken,
			accessTokenProvider:
				flags.github === true && !credentials.githubReadToken
					? createVercelConnectGithubTokenProvider({
							connector: config.githubConnectorId,
						})
					: undefined,
			repository: config.repository,
			enabled: flags.github === true,
			fetchImpl,
			budget,
		}),
		vercel: createVercelReadAdapter({
			accessToken: credentials.vercelReadToken,
			projectId: credentials.vercelProjectId,
			teamId: credentials.vercelTeamId,
			enabled: flags.vercel === true,
			fetchImpl,
			budget,
		}),
		search_console: createSearchConsoleAdapter({
			accessToken: credentials.searchConsoleAccessToken,
			accessTokenProvider:
				credentials.googleServiceAccountEmail &&
				credentials.googleServiceAccountPrivateKey
					? createGoogleServiceAccountTokenProvider({
							clientEmail: credentials.googleServiceAccountEmail,
							privateKey: credentials.googleServiceAccountPrivateKey,
							jwtFactory: googleServiceAccountJwtFactory,
						})
					: undefined,
			enabled: flags.searchConsole === true,
			fetchImpl,
			budget,
		}),
		pagespeed: createPageSpeedAdapter({
			apiKey: credentials.pageSpeedApiKey,
			enabled: flags.pageSpeed === true,
			fetchImpl,
			budget,
		}),
		browser: createBrowserResearchAdapter({
			enabled: config.browserResearch?.enabled,
			allowedDomains: config.browserResearch?.allowedDomains,
			fetchImpl,
			budget,
		}),
		web_search: createWebSearchAdapter({
			enabled: false,
			allowedDomains: config.browserResearch?.allowedDomains,
			budget,
		}),
		browser_automation: createBrowserAutomationAdapter({
			enabled: false,
			allowedDomains: config.browserResearch?.allowedDomains,
			budget,
		}),
		browserbase: createBrowserbaseAdapter({
			apiKey: credentials.browserbaseApiKey,
			projectId: credentials.browserbaseProjectId,
			enabled: flags.browserbase === true,
			fetchImpl,
			budget,
		}),
		ga4: createGa4Adapter({
			accessToken: credentials.ga4AccessToken,
			propertyId: credentials.ga4PropertyId,
			enabled: flags.ga4 === true,
			fetchImpl,
			budget,
		}),
		business_profile: createBusinessProfileAdapter({
			accessToken: credentials.businessProfileAccessToken,
			locationId: credentials.businessProfileLocationId,
			enabled: flags.businessProfile === true,
			fetchImpl,
			budget,
		}),
		local_falcon: createLocalFalconAdapter({
			apiKey: credentials.localFalconApiKey,
			enabled: flags.localFalcon === true,
			fetchImpl,
			budget,
		}),
		similarweb: createUnsupportedOptionalAdapter(
			"similarweb",
			"Similarweb has no approved, documented endpoint/credential configuration in this sidecar.",
		),
		google_trends: createUnsupportedOptionalAdapter(
			"google-trends",
			"Google Trends API is alpha-only; no approved alpha access is configured.",
		),
		tracing: createUnsupportedOptionalAdapter(
			"tracing",
			"No approved external tracing export is configured; Vercel AI Gateway observability is read separately.",
		),
	};
}
