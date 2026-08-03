import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const repoRoot = resolve(root, "../..");
const packageJson = JSON.parse(
	readFileSync(resolve(root, "package.json"), "utf8"),
);
const rootVercelPath = resolve(repoRoot, "vercel.json");
const servicesExamplePath = resolve(
	repoRoot,
	"docs/seo-agent/vercel.services.example.json",
);
const vercelConfig = JSON.parse(readFileSync(rootVercelPath, "utf8"));
const servicesExample = JSON.parse(readFileSync(servicesExamplePath, "utf8"));
const envExample = readFileSync(resolve(root, ".env.example"), "utf8");
const failures = [];

if (packageJson.engines?.node !== ">=24")
	failures.push("package.json must require Node >=24 for Eve.");
for (const script of [
	"lint",
	"format",
	"format:check",
	"typecheck",
	"test",
	"test:integration",
	"verify:offline",
	"build",
	"stage:repository-snapshot",
	"bundle:repository-snapshot",
	"dry-run",
	"runtime:preflight",
]) {
	if (!packageJson.scripts?.[script])
		failures.push(`package.json is missing the ${script} command.`);
}
for (const dependency of [
	"@eslint/js",
	"eslint",
	"globals",
	"prettier",
	"typescript",
]) {
	if (!packageJson.devDependencies?.[dependency])
		failures.push(`package.json is missing dev dependency ${dependency}.`);
}
if (vercelConfig.$schema !== "https://openapi.vercel.sh/vercel.json")
	failures.push("vercel.json must use the Vercel schema.");
if (servicesExample.$schema !== "https://openapi.vercel.sh/vercel.json")
	failures.push(
		"docs/seo-agent/vercel.services.example.json must use the Vercel schema.",
	);
if (existsSync(resolve(root, "vercel.json")))
	failures.push(
		"Do not keep a nested automation/seo-agent/vercel.json; root owns deploy topology.",
	);

const activeServicesConfig =
	vercelConfig.services && typeof vercelConfig.services === "object"
		? vercelConfig
		: null;

if (activeServicesConfig) {
	failures.push(
		...validateServicesTopology(activeServicesConfig, "root vercel.json"),
	);
} else {
	if ("services" in vercelConfig || "rewrites" in vercelConfig)
		failures.push(
			"Site-only root vercel.json must omit services and service rewrites until Services access is LIVE_VERIFIED.",
		);
	const disallowedRootKeys = [
		"buildCommand",
		"installCommand",
		"outputDirectory",
		"framework",
		"crons",
	];
	for (const key of disallowedRootKeys) {
		if (key in vercelConfig)
			failures.push(
				`Site-only root vercel.json must not set ${key}; let the Next.js project defaults own the public site.`,
			);
	}
	failures.push(
		...validateServicesTopology(
			servicesExample,
			"docs/seo-agent/vercel.services.example.json",
		),
	);
}

for (const name of [
	"SEO_AGENT_ENV",
	"AI_GATEWAY_API_KEY",
	"VERCEL_OIDC_TOKEN",
	"GOOGLE_SERVICE_ACCOUNT_EMAIL",
	"GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
	"SEARCH_CONSOLE_ACCESS_TOKEN",
	"PAGESPEED_API_KEY",
	"GITHUB_READ_TOKEN",
	"VERCEL_READ_TOKEN",
]) {
	if (!envExample.includes(name))
		failures.push(`.env.example must document ${name}.`);
}
if (failures.length)
	throw new Error(
		`Sidecar deployment configuration failed:\n- ${failures.join("\n- ")}`,
	);

if (activeServicesConfig) {
	console.log(
		"Vercel Services configuration verified (one project; independently built site and Eve services; rewrite-routed /_internal/eve; Eve-owned Cron/output metadata).",
	);
} else {
	console.log(
		"Site-only root deploy verified; Services topology remains MOCK_VERIFIED in docs/seo-agent/vercel.services.example.json until owner LIVE_VERIFIED access exists.",
	);
}

/**
 * @param {Record<string, unknown>} config
 * @param {string} label
 * @returns {string[]}
 */
function validateServicesTopology(config, label) {
	/** @type {string[]} */
	const localFailures = [];
	const sidecarService = config.services?.eve_seo_agent;
	const siteService = config.services?.site;
	if (!sidecarService || !siteService)
		localFailures.push(
			`${label} must declare site and Eve services for the target Services topology.`,
		);
	if (sidecarService?.root !== "automation/seo-agent")
		localFailures.push(
			`${label}: Eve service must use automation/seo-agent as its root.`,
		);
	if (siteService?.root !== "." || siteService?.framework !== "nextjs")
		localFailures.push(
			`${label}: Site service must own the repository root as Next.js.`,
		);
	if (
		"routePrefix" in (sidecarService ?? {}) ||
		"routePrefix" in (siteService ?? {})
	)
		localFailures.push(
			`${label}: routePrefix belongs to experimentalServices; current services routing must use top-level rewrites.`,
		);
	if (
		"maxDuration" in (sidecarService ?? {}) ||
		"maxDuration" in (siteService ?? {})
	)
		localFailures.push(
			`${label}: maxDuration is not a service-level field; leave runtime limits to Eve Build Output metadata.`,
		);
	if (sidecarService?.installCommand !== "npm ci --ignore-scripts --omit=peer")
		localFailures.push(
			`${label}: Eve service must install only its local lockfile.`,
		);
	if (sidecarService?.buildCommand !== "npm run build")
		localFailures.push(`${label}: Eve service must invoke its own build.`);
	if ("includeFiles" in (sidecarService ?? {}))
		localFailures.push(
			`${label}: service configuration cannot use includeFiles; bundle the generated snapshot into Eve Build Output instead.`,
		);
	if (siteService?.installCommand !== "npm ci --ignore-scripts --omit=peer")
		localFailures.push(
			`${label}: Site service must install only its local lockfile.`,
		);
	if (siteService?.buildCommand !== "npm run build")
		localFailures.push(`${label}: Site service must invoke its own build.`);

	const rewrites = Array.isArray(config.rewrites) ? config.rewrites : [];
	const nativeCronRewrite = rewrites.find(
		(rule) =>
			rule?.source === "/eve/v1/cron/(.*)" &&
			rule?.destination?.service === "eve_seo_agent" &&
			rule?.destination?.path === "/eve/v1/cron/$1",
	);
	const eveRewrite = rewrites.find(
		(rule) =>
			rule?.source === "/_internal/eve/(.*)" &&
			rule?.destination?.service === "eve_seo_agent" &&
			rule?.destination?.path === "/$1",
	);
	const siteRewrite = rewrites.find(
		(rule) => rule?.source === "/(.*)" && rule?.destination?.service === "site",
	);
	if (!eveRewrite)
		localFailures.push(
			`${label}: top-level rewrites must expose Eve only under /_internal/eve and map path /$1.`,
		);
	if (!nativeCronRewrite)
		localFailures.push(
			`${label}: native Eve Cron traffic must route only /eve/v1/cron/* to the Eve service.`,
		);
	if (!siteRewrite)
		localFailures.push(
			`${label}: top-level rewrites must send remaining public traffic to site.`,
		);
	if (
		nativeCronRewrite &&
		siteRewrite &&
		rewrites.indexOf(nativeCronRewrite) > rewrites.indexOf(siteRewrite)
	)
		localFailures.push(
			`${label}: native Eve Cron routing must be evaluated before the site catch-all rewrite.`,
		);
	if (
		eveRewrite &&
		siteRewrite &&
		rewrites.indexOf(eveRewrite) > rewrites.indexOf(siteRewrite)
	)
		localFailures.push(
			`${label}: Eve rewrite must be evaluated before the site catch-all rewrite.`,
		);

	const evePathTransform = (sidecarService?.routes ?? []).find(
		(route) =>
			route?.src === "/_internal/eve/(.*)" &&
			Array.isArray(route.transforms) &&
			route.transforms.some(
				(transform) =>
					transform?.type === "request.path" &&
					transform?.op === "set" &&
					transform?.args === "/$1",
			),
	);
	if (!evePathTransform)
		localFailures.push(
			`${label}: Eve service routes must transform /_internal/eve/* to the path Eve handlers observe.`,
		);

	if ("crons" in (sidecarService ?? {}))
		localFailures.push(
			`${label}: Eve service must not declare crons; Eve schedules emit Cron metadata.`,
		);
	const allowedLiveProbeCrons = new Set([
		"/_internal/eve/api/live-probe/search-console",
		"/_internal/eve/api/live-probe/pagespeed",
		"/_internal/eve/api/live-probe/search-console-topics",
		"/_internal/eve/api/live-probe/pagespeed-qa",
		"/_internal/eve/api/live-probe/browser-research",
	]);
	const rootCrons = Array.isArray(config.crons) ? config.crons : null;
	if (rootCrons) {
		for (const cron of rootCrons) {
			if (
				typeof cron?.path !== "string" ||
				!allowedLiveProbeCrons.has(cron.path) ||
				cron.schedule !== "0 0 1 1 *"
			) {
				localFailures.push(
					`${label}: only annual manual-trigger live-probe crons are allowed (${[
						...allowedLiveProbeCrons,
					].join(", ")}); Eve schedules emit their own Cron metadata.`,
				);
				break;
			}
		}
		const paths = rootCrons.map((cron) => cron.path);
		if (new Set(paths).size !== paths.length) {
			localFailures.push(`${label}: live-probe cron paths must be unique.`);
		}
	} else if ("crons" in config) {
		localFailures.push(
			`${label}: crons must be an array of allowed live-probe paths when present.`,
		);
	}
	if (
		"outputDirectory" in config ||
		"outputDirectory" in (sidecarService ?? {})
	)
		localFailures.push(
			`${label}: Eve determines the Vercel Build Output API directory; do not override it.`,
		);
	return localFailures;
}
