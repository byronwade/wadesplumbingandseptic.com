/**
 * Production HTTP handlers for exact-run live probes.
 * Secrets stay in the Production runtime; local CLI cannot read Sensitive vars.
 */
import { createIntegrationRegistry } from "./adapters.mjs";
import { loadConfig, summarizeConfig } from "./config.mjs";
import {
	probeBrowserResearchLive,
	probeGa4Live,
	probePageSpeedLive,
	probePageSpeedQaLive,
	probeSearchConsoleLive,
	probeSearchConsoleTopicsLive,
} from "./probes.mjs";
import { verifyCronSecret } from "./runtime.mjs";

export function authorizeLiveProbeRequest({
	authorization,
	cronSecret = process.env.CRON_SECRET,
} = {}) {
	if (!verifyCronSecret(authorization, cronSecret)) {
		return Object.freeze({
			ok: false,
			status: 401,
			body: Object.freeze({
				error: "AUTHENTICATION_FAILED",
				message: "Live probes require a valid CRON_SECRET bearer token.",
			}),
		});
	}
	return Object.freeze({ ok: true });
}

/**
 * @param {object} [input]
 * @param {{ url: string, headers: { get: (name: string) => string | null } }} input.request
 * @param {ReturnType<typeof loadConfig>} [input.config]
 * @param {{ search_console: { probe: Function } }} [input.registry]
 * @param {string} [input.cronSecret]
 */
export async function handleSearchConsoleLiveProbe({
	request,
	config = loadConfig(),
	registry = createIntegrationRegistry({ config }),
	cronSecret = process.env.CRON_SECRET,
} = {}) {
	const auth = authorizeLiveProbeRequest({
		authorization: request?.headers?.get?.("authorization"),
		cronSecret,
	});
	if (!auth.ok) return auth;

	const url = new URL(request.url);
	const runId =
		url.searchParams.get("run_id") ?? config.liveReads?.approvedRunId ?? null;
	if (typeof runId !== "string" || !/^[a-z0-9][a-z0-9-]{2,79}$/.test(runId)) {
		return Object.freeze({
			ok: false,
			status: 400,
			body: Object.freeze({
				error: "MALFORMED_REQUEST",
				message:
					"Provide run_id as a query parameter or set SEO_AGENT_LIVE_READS_APPROVED_RUN_ID.",
			}),
		});
	}

	try {
		const evidence = await probeSearchConsoleLive({
			registry,
			config,
			runId,
			execute: true,
		});
		return Object.freeze({
			ok: evidence.classification === "LIVE_VERIFIED",
			status: evidence.classification === "LIVE_VERIFIED" ? 200 : 503,
			body: Object.freeze({
				mode: "human-approved-live-read",
				run_id: runId,
				adapter: "search_console",
				config: summarizeConfig(config),
				result: Object.freeze({
					classification: evidence.classification,
					scope: evidence.scope,
					source: evidence.source,
					collected_at: evidence.collected_at,
					payload: evidence.payload,
				}),
			}),
		});
	} catch (error) {
		return Object.freeze({
			ok: false,
			status: 403,
			body: Object.freeze({
				error: "LIVE_READ_REFUSED",
				message: error instanceof Error ? error.message : "Live read refused.",
				run_id: runId,
			}),
		});
	}
}

/**
 * @param {object} [input]
 * @param {{ url: string, headers: { get: (name: string) => string | null } }} input.request
 * @param {ReturnType<typeof loadConfig>} [input.config]
 * @param {{ pagespeed: { probe: Function } }} [input.registry]
 * @param {string} [input.cronSecret]
 */
export async function handlePageSpeedLiveProbe({
	request,
	config = loadConfig(),
	registry = createIntegrationRegistry({ config }),
	cronSecret = process.env.CRON_SECRET,
} = {}) {
	const auth = authorizeLiveProbeRequest({
		authorization: request?.headers?.get?.("authorization"),
		cronSecret,
	});
	if (!auth.ok) return auth;

	const url = new URL(request.url);
	const runId =
		url.searchParams.get("run_id") ?? config.liveReads?.approvedRunId ?? null;
	if (typeof runId !== "string" || !/^[a-z0-9][a-z0-9-]{2,79}$/.test(runId)) {
		return Object.freeze({
			ok: false,
			status: 400,
			body: Object.freeze({
				error: "MALFORMED_REQUEST",
				message:
					"Provide run_id as a query parameter or set SEO_AGENT_LIVE_READS_APPROVED_RUN_ID.",
			}),
		});
	}

	const strategyParam = url.searchParams.get("strategy");
	const strategy =
		strategyParam === "desktop" || strategyParam === "mobile"
			? strategyParam
			: "mobile";
	const targetUrl = url.searchParams.get("url") ?? config.siteUrl;

	try {
		const evidence = await probePageSpeedLive({
			registry,
			config,
			runId,
			execute: true,
			url: targetUrl,
			strategy,
		});
		return Object.freeze({
			ok: evidence.classification === "LIVE_VERIFIED",
			status: evidence.classification === "LIVE_VERIFIED" ? 200 : 503,
			body: Object.freeze({
				mode: "human-approved-live-read",
				run_id: runId,
				adapter: "pagespeed",
				config: summarizeConfig(config),
				result: Object.freeze({
					classification: evidence.classification,
					scope: evidence.scope,
					source: evidence.source,
					collected_at: evidence.collected_at,
					payload: evidence.payload,
				}),
			}),
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Live read refused.";
		const upstreamFailure =
			/\b(timed out|HTTP|response exceeds|credential|rate.?limit|upstream)\b/i.test(
				message,
			);
		return Object.freeze({
			ok: false,
			status: upstreamFailure ? 503 : 403,
			body: Object.freeze({
				error: upstreamFailure ? "LIVE_READ_FAILED" : "LIVE_READ_REFUSED",
				message,
				run_id: runId,
			}),
		});
	}
}

/**
 * Task 3 focused live probe: Search Console topic signals.
 *
 * @param {object} [input]
 * @param {{ url: string, headers: { get: (name: string) => string | null } }} input.request
 * @param {ReturnType<typeof loadConfig>} [input.config]
 * @param {{ search_console: { queryTopicSignals?: Function } }} [input.registry]
 * @param {string} [input.cronSecret]
 */
export async function handleSearchConsoleTopicsLiveProbe({
	request,
	config = loadConfig(),
	registry = createIntegrationRegistry({ config }),
	cronSecret = process.env.CRON_SECRET,
} = {}) {
	const auth = authorizeLiveProbeRequest({
		authorization: request?.headers?.get?.("authorization"),
		cronSecret,
	});
	if (!auth.ok) return auth;

	const url = new URL(request.url);
	const runId =
		url.searchParams.get("run_id") ?? config.liveReads?.approvedRunId ?? null;
	if (typeof runId !== "string" || !/^[a-z0-9][a-z0-9-]{2,79}$/.test(runId)) {
		return Object.freeze({
			ok: false,
			status: 400,
			body: Object.freeze({
				error: "MALFORMED_REQUEST",
				message:
					"Provide run_id as a query parameter or set SEO_AGENT_LIVE_READS_APPROVED_RUN_ID.",
			}),
		});
	}

	try {
		const evidence = await probeSearchConsoleTopicsLive({
			registry,
			config,
			runId,
			execute: true,
		});
		return Object.freeze({
			ok: evidence.classification === "LIVE_VERIFIED",
			status: evidence.classification === "LIVE_VERIFIED" ? 200 : 503,
			body: Object.freeze({
				mode: "human-approved-live-read",
				run_id: runId,
				adapter: "search_console_topics",
				config: summarizeConfig(config),
				result: Object.freeze({
					classification: evidence.classification,
					scope: evidence.scope,
					source: evidence.source,
					collected_at: evidence.collected_at,
					payload: evidence.payload,
				}),
			}),
		});
	} catch (error) {
		return Object.freeze({
			ok: false,
			status: 403,
			body: Object.freeze({
				error: "LIVE_READ_REFUSED",
				message: error instanceof Error ? error.message : "Live read refused.",
				run_id: runId,
			}),
		});
	}
}

/**
 * Task 4 focused live probe: PageSpeed draft/preview QA signals.
 *
 * @param {object} [input]
 * @param {{ url: string, headers: { get: (name: string) => string | null } }} input.request
 * @param {ReturnType<typeof loadConfig>} [input.config]
 * @param {{ pagespeed: { probe?: Function } }} [input.registry]
 * @param {string} [input.cronSecret]
 */
export async function handlePageSpeedQaLiveProbe({
	request,
	config = loadConfig(),
	registry = createIntegrationRegistry({ config }),
	cronSecret = process.env.CRON_SECRET,
} = {}) {
	const auth = authorizeLiveProbeRequest({
		authorization: request?.headers?.get?.("authorization"),
		cronSecret,
	});
	if (!auth.ok) return auth;

	const url = new URL(request.url);
	const runId =
		url.searchParams.get("run_id") ?? config.liveReads?.approvedRunId ?? null;
	if (typeof runId !== "string" || !/^[a-z0-9][a-z0-9-]{2,79}$/.test(runId)) {
		return Object.freeze({
			ok: false,
			status: 400,
			body: Object.freeze({
				error: "MALFORMED_REQUEST",
				message:
					"Provide run_id as a query parameter or set SEO_AGENT_LIVE_READS_APPROVED_RUN_ID.",
			}),
		});
	}

	try {
		const evidence = await probePageSpeedQaLive({
			registry,
			config,
			runId,
			execute: true,
			strategy: url.searchParams.get("strategy") ?? "mobile",
			url: url.searchParams.get("url") ?? undefined,
		});
		return Object.freeze({
			ok: evidence.classification === "LIVE_VERIFIED",
			status: evidence.classification === "LIVE_VERIFIED" ? 200 : 503,
			body: Object.freeze({
				mode: "human-approved-live-read",
				run_id: runId,
				adapter: "pagespeed_qa",
				config: summarizeConfig(config),
				result: Object.freeze({
					classification: evidence.classification,
					scope: evidence.scope,
					source: evidence.source,
					collected_at: evidence.collected_at,
					payload: evidence.payload,
				}),
			}),
		});
	} catch (error) {
		return Object.freeze({
			ok: false,
			status: 403,
			body: Object.freeze({
				error: "LIVE_READ_REFUSED",
				message: error instanceof Error ? error.message : "Live read refused.",
				run_id: runId,
			}),
		});
	}
}

/**
 * Task 5 focused live probe: allowlisted HTTP browser research.
 *
 * @param {object} [input]
 * @param {{ url: string, headers: { get: (name: string) => string | null } }} input.request
 * @param {ReturnType<typeof loadConfig>} [input.config]
 * @param {{ browser: { probe?: Function } }} [input.registry]
 * @param {string} [input.cronSecret]
 */
export async function handleBrowserResearchLiveProbe({
	request,
	config = loadConfig(),
	registry = createIntegrationRegistry({ config }),
	cronSecret = process.env.CRON_SECRET,
} = {}) {
	const auth = authorizeLiveProbeRequest({
		authorization: request?.headers?.get?.("authorization"),
		cronSecret,
	});
	if (!auth.ok) return auth;

	const url = new URL(request.url);
	const runId =
		url.searchParams.get("run_id") ?? config.liveReads?.approvedRunId ?? null;
	if (typeof runId !== "string" || !/^[a-z0-9][a-z0-9-]{2,79}$/.test(runId)) {
		return Object.freeze({
			ok: false,
			status: 400,
			body: Object.freeze({
				error: "MALFORMED_REQUEST",
				message:
					"Provide run_id as a query parameter or set SEO_AGENT_LIVE_READS_APPROVED_RUN_ID.",
			}),
		});
	}

	try {
		const evidence = await probeBrowserResearchLive({
			registry,
			config,
			runId,
			execute: true,
			url: url.searchParams.get("url") ?? undefined,
		});
		const payload = evidence.payload ?? {};
		// Keep live-probe responses compact: hash + mode, not full HTML excerpts.
		const compactPayload = Object.freeze({
			retrieval_mode: payload.retrieval_mode ?? null,
			untrusted: payload.untrusted ?? true,
			content_hash: payload.content_hash ?? null,
			excerpt_present: Boolean(payload.excerpt),
			excerpt_chars:
				typeof payload.excerpt === "string" ? payload.excerpt.length : 0,
			reason: payload.reason ?? null,
			next_action: payload.next_action ?? null,
			security_state: payload.security_state ?? null,
		});
		return Object.freeze({
			ok: evidence.classification === "LIVE_VERIFIED",
			status: evidence.classification === "LIVE_VERIFIED" ? 200 : 503,
			body: Object.freeze({
				mode: "human-approved-live-read",
				run_id: runId,
				adapter: "browser_research",
				config: summarizeConfig(config),
				result: Object.freeze({
					classification: evidence.classification,
					scope: evidence.scope,
					source: evidence.source,
					collected_at: evidence.collected_at,
					payload: compactPayload,
				}),
			}),
		});
	} catch (error) {
		return Object.freeze({
			ok: false,
			status: 403,
			body: Object.freeze({
				error: "LIVE_READ_REFUSED",
				message: error instanceof Error ? error.message : "Live read refused.",
				run_id: runId,
			}),
		});
	}
}

/**
 * Task 6 focused live probe: GA4 Analytics Data API aggregate read.
 *
 * @param {object} [input]
 * @param {{ url: string, headers: { get: (name: string) => string | null } }} input.request
 * @param {ReturnType<typeof loadConfig>} [input.config]
 * @param {{ ga4: { probe?: Function } }} [input.registry]
 * @param {string} [input.cronSecret]
 */
export async function handleGa4LiveProbe({
	request,
	config = loadConfig(),
	registry = createIntegrationRegistry({ config }),
	cronSecret = process.env.CRON_SECRET,
} = {}) {
	const auth = authorizeLiveProbeRequest({
		authorization: request?.headers?.get?.("authorization"),
		cronSecret,
	});
	if (!auth.ok) return auth;

	const url = new URL(request.url);
	const runId =
		url.searchParams.get("run_id") ?? config.liveReads?.approvedRunId ?? null;
	if (typeof runId !== "string" || !/^[a-z0-9][a-z0-9-]{2,79}$/.test(runId)) {
		return Object.freeze({
			ok: false,
			status: 400,
			body: Object.freeze({
				error: "MALFORMED_REQUEST",
				message:
					"Provide run_id as a query parameter or set SEO_AGENT_LIVE_READS_APPROVED_RUN_ID.",
			}),
		});
	}

	try {
		const evidence = await probeGa4Live({
			registry,
			config,
			runId,
			execute: true,
		});
		const payload = evidence.payload ?? {};
		const compactPayload = Object.freeze({
			property_id: payload.property_id ?? null,
			metric: payload.metric ?? null,
			date_range: payload.date_range ?? null,
			row_count: payload.row_count ?? null,
			sessions_total: payload.sessions_total ?? null,
			reason: payload.reason ?? null,
			next_action: payload.next_action ?? null,
			http_status: payload.http_status ?? null,
		});
		return Object.freeze({
			ok: evidence.classification === "LIVE_VERIFIED",
			status: evidence.classification === "LIVE_VERIFIED" ? 200 : 503,
			body: Object.freeze({
				mode: "human-approved-live-read",
				run_id: runId,
				adapter: "ga4",
				config: summarizeConfig(config),
				result: Object.freeze({
					classification: evidence.classification,
					scope: evidence.scope,
					source: evidence.source,
					collected_at: evidence.collected_at,
					payload: compactPayload,
				}),
			}),
		});
	} catch (error) {
		return Object.freeze({
			ok: false,
			status: 403,
			body: Object.freeze({
				error: "LIVE_READ_REFUSED",
				message: error instanceof Error ? error.message : "Live read refused.",
				run_id: runId,
			}),
		});
	}
}
