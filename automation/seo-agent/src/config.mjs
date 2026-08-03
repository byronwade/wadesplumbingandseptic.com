import { z } from "zod";
import { COMMUNITY_RESEARCH_DOMAINS, DEFAULT_BUDGETS } from "./constants.mjs";
import { isStandingProductionPropose } from "./production-mode.mjs";

const envSchema = z
	.object({
		SEO_AGENT_ENV: z.enum(["development", "preview", "production"]).optional(),
		SEO_AGENT_FORCE_OBSERVE: z.enum(["true", "false"]).optional(),
		SEO_AGENT_REPOSITORY: z
			.string()
			.regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/)
			.optional(),
		SEO_AGENT_SITE_URL: z.string().url().optional(),
		SEO_AGENT_BROWSER_RESEARCH_ENABLED: z.enum(["true", "false"]).optional(),
		SEO_AGENT_BROWSER_ALLOWED_DOMAINS: z.string().optional(),
		SEO_AGENT_LIVE_READS_APPROVED: z.enum(["true", "false"]).optional(),
		SEO_AGENT_LIVE_READS_APPROVED_RUN_ID: z
			.string()
			.regex(/^[a-z0-9][a-z0-9-]{2,79}$/)
			.optional(),
		SEO_AGENT_BLOB_ENABLED: z.enum(["true", "false"]).optional(),
		SEO_AGENT_BLOB_ARCHIVE_APPROVED: z.enum(["true", "false"]).optional(),
		SEO_AGENT_BLOB_APPROVED_RUN_ID: z
			.string()
			.regex(/^[a-z0-9][a-z0-9-]{2,79}$/)
			.optional(),
		SEO_AGENT_BLOB_PREFIX: z
			.string()
			.regex(/^[a-z0-9][a-z0-9/_-]{2,95}$/)
			.optional(),
		SEO_AGENT_MUTATION_MODE: z.enum(["disabled", "enabled"]).optional(),
		SEO_AGENT_NATIVE_SCHEDULE_JOB: z.enum(["audit", "proposal"]).optional(),
		SEO_AGENT_PUBLISHING_HUMAN_APPROVED: z.enum(["true", "false"]).optional(),
		SEO_AGENT_PUBLISHING_INTEGRATION_TEST: z.enum(["true", "false"]).optional(),
		SEO_AGENT_PUBLISHING_APPROVED_RUN_ID: z
			.string()
			.regex(/^[a-z0-9][a-z0-9-]{2,79}$/)
			.optional(),
		SEO_AGENT_PUBLISHING_PRECONDITION_AUDIT_RUN_ID: z
			.string()
			.regex(/^audit-\d{4}-\d{2}-\d{2}$/)
			.optional(),
		GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().email().optional(),
		GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string().min(1).optional(),
		SEARCH_CONSOLE_ACCESS_TOKEN: z.string().min(1).optional(),
		PAGESPEED_API_KEY: z.string().min(1).optional(),
		GITHUB_READ_TOKEN: z.string().min(1).optional(),
		SEO_AGENT_GITHUB_CONNECTOR_ID: z
			.string()
			.regex(/^github\/[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/)
			.optional(),
		VERCEL_READ_TOKEN: z.string().min(1).optional(),
		VERCEL_READ_PROJECT_ID: z.string().min(1).optional(),
		VERCEL_READ_TEAM_ID: z.string().min(1).optional(),
		AI_GATEWAY_API_KEY: z.string().min(1).optional(),
		VERCEL_OIDC_TOKEN: z.string().min(1).optional(),
		BROWSERBASE_API_KEY: z.string().min(1).optional(),
		BROWSERBASE_PROJECT_ID: z.string().min(1).optional(),
		GA4_ACCESS_TOKEN: z.string().min(1).optional(),
		GA4_PROPERTY_ID: z.string().min(1).optional(),
		GOOGLE_BUSINESS_PROFILE_ACCESS_TOKEN: z.string().min(1).optional(),
		GOOGLE_BUSINESS_PROFILE_LOCATION_ID: z.string().min(1).optional(),
		LOCAL_FALCON_API_KEY: z.string().min(1).optional(),
		SIMILARWEB_API_KEY: z.string().min(1).optional(),
		GOOGLE_TRENDS_ACCESS_TOKEN: z.string().min(1).optional(),
		UNSPLASH_ACCESS_KEY: z.string().min(1).optional(),
		PEXELS_API_KEY: z.string().min(1).optional(),
		PIXABAY_API_KEY: z.string().min(1).optional(),
		FLICKR_API_KEY: z.string().min(1).optional(),
		EUROPEANA_API_KEY: z.string().min(1).optional(),
		BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),
		SEO_AGENT_ENABLE_AI_GATEWAY: z.enum(["true", "false"]).optional(),
		SEO_AGENT_ENABLE_GITHUB: z.enum(["true", "false"]).optional(),
		SEO_AGENT_ENABLE_VERCEL: z.enum(["true", "false"]).optional(),
		SEO_AGENT_ENABLE_SEARCH_CONSOLE: z.enum(["true", "false"]).optional(),
		SEO_AGENT_ENABLE_PAGESPEED: z.enum(["true", "false"]).optional(),
		SEO_AGENT_ENABLE_BROWSERBASE: z.enum(["true", "false"]).optional(),
		SEO_AGENT_ENABLE_GA4: z.enum(["true", "false"]).optional(),
		SEO_AGENT_ENABLE_BUSINESS_PROFILE: z.enum(["true", "false"]).optional(),
		SEO_AGENT_ENABLE_LOCAL_FALCON: z.enum(["true", "false"]).optional(),
		SEO_AGENT_ENABLE_SIMILARWEB: z.enum(["true", "false"]).optional(),
		SEO_AGENT_ENABLE_GOOGLE_TRENDS: z.enum(["true", "false"]).optional(),
		SEO_AGENT_ENABLE_IMAGE_SOURCING: z.enum(["true", "false"]).optional(),
		SEO_AGENT_ENABLE_IMAGE_AI_LINEART: z.enum(["true", "false"]).optional(),
		SEO_AGENT_ENABLE_OPEN_RESEARCH: z.enum(["true", "false"]).optional(),
	})
	.passthrough();

function parseAllowedDomains(value) {
	if (!value) return [];
	const domains = value
		.split(",")
		.map((domain) => domain.trim())
		.filter(Boolean);
	for (const domain of domains) {
		if (!DEFAULT_BUDGETS.allowedDomains.includes(domain)) {
			throw new Error(
				`Browser research domain is not approved by versioned policy: ${domain}`,
			);
		}
	}
	return domains;
}

function resolveBrowserResearchConfig(raw, standingPropose) {
	const extra = parseAllowedDomains(raw.SEO_AGENT_BROWSER_ALLOWED_DOMAINS);
	// Standing Production propose always researches community/holiday hosts.
	// Owner env flags are not required for Eve to decide and fetch.
	const enabled =
		standingPropose || raw.SEO_AGENT_BROWSER_RESEARCH_ENABLED === "true";
	const allowedDomains = [
		...new Set([
			...(standingPropose || enabled ? COMMUNITY_RESEARCH_DOMAINS : []),
			...extra,
		]),
	];
	return Object.freeze({
		enabled,
		allowedDomains: Object.freeze(allowedDomains),
		mode: standingPropose
			? "AUTOMATIC_STANDING_PROPOSE"
			: enabled
				? "EXPLICITLY_ENABLED"
				: "DISABLED",
	});
}

export function loadConfig(env = process.env) {
	const raw = envSchema.parse(env);
	if (
		Boolean(raw.GOOGLE_SERVICE_ACCOUNT_EMAIL) !==
		Boolean(raw.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)
	) {
		throw new Error(
			"GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY must be configured together.",
		);
	}
	const standingPropose = isStandingProductionPropose(raw);
	return Object.freeze({
		environment: raw.SEO_AGENT_ENV ?? "development",
		repository:
			raw.SEO_AGENT_REPOSITORY ?? "byronwade/wadesplumbingandseptic.com",
		siteUrl:
			raw.SEO_AGENT_SITE_URL ?? "https://www.wadesplumbingandseptic.com/",
		browserResearch: resolveBrowserResearchConfig(raw, standingPropose),
		githubConnectorId:
			raw.SEO_AGENT_GITHUB_CONNECTOR_ID ?? "github/wadesplumbingandseptic-com",
		integrationFlags: Object.freeze({
			aiGateway: standingPropose || raw.SEO_AGENT_ENABLE_AI_GATEWAY === "true",
			github: standingPropose || raw.SEO_AGENT_ENABLE_GITHUB === "true",
			vercel: raw.SEO_AGENT_ENABLE_VERCEL === "true",
			searchConsole: raw.SEO_AGENT_ENABLE_SEARCH_CONSOLE === "true",
			// Camel-case `pageSpeed` is the integrationFlags key (not `pagespeed`).
			// Registry adapters and summarizeConfig.integrations use snake/lower `pagespeed`.
			pageSpeed: raw.SEO_AGENT_ENABLE_PAGESPEED === "true",
			browserbase: raw.SEO_AGENT_ENABLE_BROWSERBASE === "true",
			ga4: raw.SEO_AGENT_ENABLE_GA4 === "true",
			businessProfile: raw.SEO_AGENT_ENABLE_BUSINESS_PROFILE === "true",
			localFalcon: raw.SEO_AGENT_ENABLE_LOCAL_FALCON === "true",
			similarweb: raw.SEO_AGENT_ENABLE_SIMILARWEB === "true",
			googleTrends: raw.SEO_AGENT_ENABLE_GOOGLE_TRENDS === "true",
			// Standing Production propose sources online images (Wikimedia always;
			// Unsplash/Pexels when keys exist; AI line-art only when separately enabled).
			imageSourcing:
				standingPropose || raw.SEO_AGENT_ENABLE_IMAGE_SOURCING === "true",
			imageAiLineArt: raw.SEO_AGENT_ENABLE_IMAGE_AI_LINEART === "true",
			openResearch:
				standingPropose || raw.SEO_AGENT_ENABLE_OPEN_RESEARCH === "true",
		}),
		liveReads: Object.freeze({
			humanApproved: raw.SEO_AGENT_LIVE_READS_APPROVED === "true",
			approvedRunId: raw.SEO_AGENT_LIVE_READS_APPROVED_RUN_ID,
		}),
		publishing: Object.freeze({
			mutationMode: standingPropose
				? "enabled"
				: (raw.SEO_AGENT_MUTATION_MODE ?? "disabled"),
			humanApproved: raw.SEO_AGENT_PUBLISHING_HUMAN_APPROVED === "true",
			integrationTestEnabled:
				raw.SEO_AGENT_PUBLISHING_INTEGRATION_TEST === "true",
			approvedRunId: raw.SEO_AGENT_PUBLISHING_APPROVED_RUN_ID,
			preconditionAuditRunId:
				raw.SEO_AGENT_PUBLISHING_PRECONDITION_AUDIT_RUN_ID,
		}),
		nativeSchedule: Object.freeze({
			// Legacy optional override. Runtime prefers SEO_AGENT_RUN_MODE=propose
			// for Cron-selected draft proposals through Vercel Connect.
			job: raw.SEO_AGENT_NATIVE_SCHEDULE_JOB ?? "audit",
		}),
		blob: Object.freeze({
			enabled: raw.SEO_AGENT_BLOB_ENABLED === "true",
			archiveApproved: raw.SEO_AGENT_BLOB_ARCHIVE_APPROVED === "true",
			approvedRunId: raw.SEO_AGENT_BLOB_APPROVED_RUN_ID,
			prefix: raw.SEO_AGENT_BLOB_PREFIX ?? "wades-eve-seo-agent/v1",
		}),
		credentials: Object.freeze({
			googleServiceAccountEmail: raw.GOOGLE_SERVICE_ACCOUNT_EMAIL,
			googleServiceAccountPrivateKey: raw.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
			searchConsoleAccessToken: raw.SEARCH_CONSOLE_ACCESS_TOKEN,
			pageSpeedApiKey: raw.PAGESPEED_API_KEY,
			githubReadToken: raw.GITHUB_READ_TOKEN,
			vercelReadToken: raw.VERCEL_READ_TOKEN,
			vercelProjectId: raw.VERCEL_READ_PROJECT_ID,
			vercelTeamId: raw.VERCEL_READ_TEAM_ID,
			aiGatewayApiKey: raw.AI_GATEWAY_API_KEY,
			vercelOidcToken: raw.VERCEL_OIDC_TOKEN,
			browserbaseApiKey: raw.BROWSERBASE_API_KEY,
			browserbaseProjectId: raw.BROWSERBASE_PROJECT_ID,
			ga4AccessToken: raw.GA4_ACCESS_TOKEN,
			ga4PropertyId: raw.GA4_PROPERTY_ID,
			businessProfileAccessToken: raw.GOOGLE_BUSINESS_PROFILE_ACCESS_TOKEN,
			businessProfileLocationId: raw.GOOGLE_BUSINESS_PROFILE_LOCATION_ID,
			localFalconApiKey: raw.LOCAL_FALCON_API_KEY,
			similarwebApiKey: raw.SIMILARWEB_API_KEY,
			googleTrendsAccessToken: raw.GOOGLE_TRENDS_ACCESS_TOKEN,
			unsplashAccessKey: raw.UNSPLASH_ACCESS_KEY,
			pexelsApiKey: raw.PEXELS_API_KEY,
			pixabayApiKey: raw.PIXABAY_API_KEY,
			flickrApiKey: raw.FLICKR_API_KEY,
			europeanaApiKey: raw.EUROPEANA_API_KEY,
			blobReadWriteToken: raw.BLOB_READ_WRITE_TOKEN,
		}),
	});
}

export function assertDeployedSidecarReadiness(config) {
	if (config.environment !== "production") {
		throw new Error(
			"Deployed sidecar readiness requires SEO_AGENT_ENV=production.",
		);
	}
	if (
		!config.credentials.aiGatewayApiKey &&
		!config.credentials.vercelOidcToken
	) {
		throw new Error(
			"Deployed sidecar readiness requires Vercel OIDC or AI_GATEWAY_API_KEY.",
		);
	}
	return config;
}

export function summarizeConfig(config) {
	return Object.freeze({
		environment: config.environment,
		repository: config.repository,
		site_url: config.siteUrl,
		browser_research_enabled: config.browserResearch.enabled,
		browser_research_mode: config.browserResearch.mode,
		browser_allowed_domains: config.browserResearch.allowedDomains,
		integration_flags: config.integrationFlags,
		live_reads_approval_configured: Boolean(
			config.liveReads.humanApproved && config.liveReads.approvedRunId,
		),
		publishing: config.publishing,
		native_schedule_job: config.nativeSchedule.job,
		blob: Object.freeze({
			enabled: config.blob.enabled,
			archive_approval_configured: Boolean(
				config.blob.archiveApproved && config.blob.approvedRunId,
			),
			prefix: config.blob.prefix,
			credential_configured: Boolean(config.credentials.blobReadWriteToken),
		}),
		integrations: Object.freeze({
			search_console: Boolean(
				(config.credentials.googleServiceAccountEmail &&
					config.credentials.googleServiceAccountPrivateKey) ||
				config.credentials.searchConsoleAccessToken,
			),
			pagespeed: Boolean(config.credentials.pageSpeedApiKey),
			github: Boolean(config.credentials.githubReadToken),
			vercel: Boolean(
				config.credentials.vercelReadToken &&
				config.credentials.vercelProjectId,
			),
			ai_gateway: Boolean(
				config.credentials.aiGatewayApiKey ||
				config.credentials.vercelOidcToken,
			),
			browserbase: Boolean(
				config.credentials.browserbaseApiKey &&
				config.credentials.browserbaseProjectId,
			),
			ga4: Boolean(
				config.credentials.ga4PropertyId &&
				(config.credentials.ga4AccessToken ||
					(config.credentials.googleServiceAccountEmail &&
						config.credentials.googleServiceAccountPrivateKey)),
			),
			business_profile: Boolean(
				config.credentials.businessProfileAccessToken &&
				config.credentials.businessProfileLocationId,
			),
			local_falcon: Boolean(config.credentials.localFalconApiKey),
			similarweb: Boolean(config.credentials.similarwebApiKey),
			google_trends: Boolean(config.credentials.googleTrendsAccessToken),
			unsplash: Boolean(config.credentials.unsplashAccessKey),
			pexels: Boolean(config.credentials.pexelsApiKey),
			pixabay: Boolean(config.credentials.pixabayApiKey),
			flickr: Boolean(config.credentials.flickrApiKey),
			europeana: Boolean(config.credentials.europeanaApiKey),
			image_sourcing: config.integrationFlags.imageSourcing === true,
			image_ai_lineart: config.integrationFlags.imageAiLineArt === true,
			open_research: config.integrationFlags.openResearch === true,
		}),
		search_console_auth_mode:
			config.credentials.googleServiceAccountEmail &&
			config.credentials.googleServiceAccountPrivateKey
				? "service_account"
				: config.credentials.searchConsoleAccessToken
					? "legacy_access_token"
					: "not_configured",
		github_connector_id: config.githubConnectorId,
	});
}
