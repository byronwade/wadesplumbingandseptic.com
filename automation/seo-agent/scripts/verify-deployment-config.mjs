import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const repoRoot = resolve(root, "../..");
const packageJson = JSON.parse(
	readFileSync(resolve(root, "package.json"), "utf8"),
);
const vercelConfig = JSON.parse(
	readFileSync(resolve(repoRoot, "vercel.json"), "utf8"),
);
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
const sidecarService = vercelConfig.services?.eve_seo_agent;
const siteService = vercelConfig.services?.site;
if (!sidecarService || !siteService)
	failures.push(
		"root Vercel Services configuration must declare site and Eve services.",
	);
if (sidecarService?.root !== "automation/seo-agent")
	failures.push("Eve service must use automation/seo-agent as its root.");
if (siteService?.root !== "." || siteService?.framework !== "nextjs")
	failures.push("Site service must own the repository root as Next.js.");
if (
	"routePrefix" in (sidecarService ?? {}) ||
	"routePrefix" in (siteService ?? {})
)
	failures.push(
		"routePrefix belongs to experimentalServices; current services routing must use top-level rewrites.",
	);
if (
	"maxDuration" in (sidecarService ?? {}) ||
	"maxDuration" in (siteService ?? {})
)
	failures.push(
		"maxDuration is not a service-level field; leave runtime limits to Eve Build Output metadata.",
	);
if (sidecarService?.installCommand !== "npm ci --ignore-scripts --omit=peer")
	failures.push("Eve service must install only its local lockfile.");
if (sidecarService?.buildCommand !== "npm run build")
	failures.push("Eve service must invoke its own build.");
if (siteService?.installCommand !== "npm ci --ignore-scripts --omit=peer")
	failures.push("Site service must install only its local lockfile.");
if (siteService?.buildCommand !== "npm run build")
	failures.push("Site service must invoke its own build.");

const rewrites = Array.isArray(vercelConfig.rewrites)
	? vercelConfig.rewrites
	: [];
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
	failures.push(
		"Top-level rewrites must expose Eve only under /_internal/eve and map path /$1.",
	);
if (!siteRewrite)
	failures.push(
		"Top-level rewrites must send remaining public traffic to site.",
	);
if (
	eveRewrite &&
	siteRewrite &&
	rewrites.indexOf(eveRewrite) > rewrites.indexOf(siteRewrite)
)
	failures.push(
		"Eve rewrite must be evaluated before the site catch-all rewrite.",
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
	failures.push(
		"Eve service routes must transform /_internal/eve/* to the path Eve handlers observe.",
	);

if ("crons" in vercelConfig || "crons" in (sidecarService ?? {}))
	failures.push(
		"Eve schedules emit Vercel Cron metadata; do not duplicate them in vercel.json.",
	);
if (
	"outputDirectory" in vercelConfig ||
	"outputDirectory" in (sidecarService ?? {})
)
	failures.push(
		"Eve determines the Vercel Build Output API directory; do not override it.",
	);
for (const name of [
	"SEO_AGENT_ENV",
	"AI_GATEWAY_API_KEY",
	"VERCEL_OIDC_TOKEN",
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
console.log(
	"Vercel Services configuration verified (one project; independently built site and Eve services; rewrite-routed /_internal/eve; Eve-owned Cron/output metadata).",
);
