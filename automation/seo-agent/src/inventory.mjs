import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

function nextConfigSource(repoRoot) {
	for (const candidate of [
		"next.config.ts",
		"next.config.mjs",
		"next.config.js",
	]) {
		const path = join(repoRoot, candidate);
		if (statSync(path, { throwIfNoEntry: false })?.isFile()) return candidate;
	}
	throw new Error("No supported Next configuration file was found.");
}

function walk(directory) {
	return readdirSync(directory).flatMap((entry) => {
		const path = join(directory, entry);
		return statSync(path).isDirectory() ? walk(path) : [path];
	});
}

export function routeFromPagePath(appRoot, sourcePath) {
	const segments = relative(appRoot, sourcePath).split(sep);
	segments.pop();
	const visible = segments.filter((segment) => !/^\(.+\)$/.test(segment));
	if (visible[0] === "api") return null;
	return `/${visible.join("/")}`.replace(/\/$/, "") || "/";
}

export function collectPageInventory({
	repoRoot,
	siteOrigin = "https://www.wadesplumbingandseptic.com",
}) {
	const appRoot = join(repoRoot, "app");
	const pageFiles = walk(appRoot).filter((path) =>
		/[\\/]page\.(?:tsx|ts|jsx|js)$/.test(path),
	);
	const applicationPages = pageFiles
		.map((sourcePath) => ({
			sourcePath,
			route: routeFromPagePath(appRoot, sourcePath),
		}))
		.filter(({ route }) => route)
		.sort((a, b) => a.route.localeCompare(b.route))
		.map(({ sourcePath, route }) => ({
			...(function () {
				const source = readFileSync(sourcePath, "utf8");
				return {
					metadata_declared:
						/(?:export\s+(?:const|async function)\s+(?:metadata|generateMetadata))/.test(
							source,
						),
					canonical_declared: /canonical\s*[:=]/.test(source),
					json_ld_blocks:
						(source.match(/application\/ld\+json/g) ?? []).length ||
						(/\bJsonLd\b/.test(source) ? 1 : 0),
				};
			})(),
			url: route,
			source_path: relative(repoRoot, sourcePath).replaceAll("\\", "/"),
			canonical_url: new URL(route, siteOrigin).toString(),
			type: sourcePath.includes("(landing-pages)")
				? "landing_page"
				: "application_route",
			lifecycle: "EXISTING_UNMIGRATED",
			owner: null,
			classification: "MOCK_VERIFIED",
		}));
	const contentPages = ["pages", "posts", "services"].flatMap((collection) => {
		const collectionRoot = join(repoRoot, "content", collection);
		if (!statSync(collectionRoot, { throwIfNoEntry: false })?.isDirectory())
			return [];
		return walk(collectionRoot)
			.filter((path) => path.endsWith(".md"))
			.map((sourcePath) => {
				const source = readFileSync(sourcePath, "utf8").replaceAll(
					"\r\n",
					"\n",
				);
				const slug = relative(collectionRoot, sourcePath)
					.replace(/\.md$/, "")
					.replaceAll(sep, "/");
				const route =
					collection === "services" ? `/service-offerings/${slug}` : `/${slug}`;
				const titleMatch = source.match(/^title:\s*["']?(.+?)["']?\s*$/m);
				const title = titleMatch?.[1]?.trim()
					? titleMatch[1].trim().slice(0, 160)
					: null;
				return {
					url: route,
					title,
					source_path: relative(repoRoot, sourcePath).replaceAll("\\", "/"),
					canonical_url: new URL(route, siteOrigin).toString(),
					type:
						collection === "services" ? "service_content" : "markdown_content",
					lifecycle: "CONTENT_MANAGED",
					owner: null,
					metadata_declared: Boolean(title),
					canonical_declared: false,
					json_ld_blocks: /application\/ld\+json/.test(source) ? 1 : 0,
					classification: "MOCK_VERIFIED",
				};
			});
	});
	const applicationRoutes = new Set(applicationPages.map((page) => page.url));
	const canonicalContentPages = contentPages.filter(
		(page) => !applicationRoutes.has(page.url),
	);
	return {
		schema_version: "1.0",
		generated_from: "repository-route-scan",
		classification: "MOCK_VERIFIED",
		pages: [...applicationPages, ...canonicalContentPages].sort((a, b) =>
			a.url.localeCompare(b.url),
		),
	};
}

function routeParameters(route) {
	return [...route.matchAll(/\[(?:\.\.\.)?([A-Za-z][A-Za-z0-9_]*)\]/g)].map(
		(match) => match[1],
	);
}

function actionSourcePaths({ repoRoot, sourcePath }) {
	const source = readFileSync(join(repoRoot, sourcePath), "utf8");
	const aliases = [
		...source.matchAll(/from\s+['"]@\/actions\/([^'"]+)['"]/g),
	].map((match) => match[1]);
	const extensions = [".ts", ".tsx", ".js", ".jsx"];
	return [
		...new Set(
			aliases.flatMap((alias) =>
				extensions
					.map((extension) => `actions/${alias}${extension}`)
					.filter((candidate) =>
						statSync(join(repoRoot, candidate), {
							throwIfNoEntry: false,
						})?.isFile(),
					),
			),
		),
	].sort();
}

export function buildRouteMap({ repoRoot, inventory }) {
	return {
		schema_version: "1.0",
		generated_from: "repository-route-scan",
		classification: "MOCK_VERIFIED",
		routes: inventory.pages.map((page) => {
			const parameters = routeParameters(page.url);
			const dynamic = parameters.length > 0;
			return {
				route_pattern: page.url,
				source_path: page.source_path,
				kind: dynamic ? "DYNAMIC_RUNTIME_DATA" : "STATIC_ROUTE",
				parameters,
				materialized_routes: dynamic ? [] : [page.url],
				materialization_state: dynamic
					? "BLOCKED_MISSING_CREDENTIALS"
					: "REPOSITORY_ROUTE_DECLARED",
				data_source_paths: actionSourcePaths({
					repoRoot,
					sourcePath: page.source_path,
				}),
				classification: dynamic
					? "BLOCKED_MISSING_CREDENTIALS"
					: "MOCK_VERIFIED",
				reason: dynamic
					? "Concrete paths require runtime data that is not available to the offline sidecar."
					: "Static route pattern is directly declared in the repository.",
			};
		}),
	};
}

export function buildTechnicalSeoReport({ repoRoot, inventory }) {
	const appRoot = join(repoRoot, "app");
	const allFiles = walk(appRoot);
	const sitemapFiles = allFiles.filter((path) =>
		/[\\/]sitemap\.(?:ts|tsx|js|jsx)$/.test(path),
	);
	const robotsFiles = allFiles.filter((path) =>
		/[\\/]robots(?:\.txt)?\.(?:ts|tsx|js|jsx|txt)$/.test(path),
	);
	const configSource = nextConfigSource(repoRoot);
	const nextConfigPath = join(repoRoot, configSource);
	const nextConfig = readFileSync(nextConfigPath, "utf8");
	const findings = [];
	for (const page of inventory.pages) {
		if (!page.metadata_declared)
			findings.push({
				severity: "info",
				code: "METADATA_INHERITED_OR_UNDECLARED",
				url: page.url,
			});
		if (!page.canonical_declared)
			findings.push({
				severity: "info",
				code: "CANONICAL_INHERITED_OR_UNDECLARED",
				url: page.url,
			});
	}
	if (/ignoreBuildErrors\s*:\s*true/.test(nextConfig))
		findings.push({
			severity: "high",
			code: "TYPESCRIPT_BUILD_ERRORS_IGNORED",
			source_path: configSource,
		});
	if (/ignoreDuringBuilds\s*:\s*true/.test(nextConfig))
		findings.push({
			severity: "high",
			code: "ESLINT_BUILD_ERRORS_IGNORED",
			source_path: configSource,
		});
	const publishablePlaceholders =
		/YOUR_GOOGLE_VERIFICATION|Your Street Address|Your Zip|Your Latitude|Your Longitude/;
	for (const path of allFiles) {
		if (!/\.(?:ts|tsx|js|jsx)$/.test(path)) continue;
		if (publishablePlaceholders.test(readFileSync(path, "utf8")))
			findings.push({
				severity: "high",
				code: "PUBLISHABLE_PLACEHOLDER_VALUE",
				source_path: relative(repoRoot, path).replaceAll("\\", "/"),
			});
	}
	if (!/redirects\s*:\s*async/.test(nextConfig))
		findings.push({
			severity: "info",
			code: "NO_NEXT_REDIRECT_MAP_DECLARED",
			source_path: configSource,
		});
	return {
		schema_version: "1.0",
		classification: "MOCK_VERIFIED",
		sitemap_sources: sitemapFiles.map((path) =>
			relative(repoRoot, path).replaceAll("\\", "/"),
		),
		robots_sources: robotsFiles.map((path) =>
			relative(repoRoot, path).replaceAll("\\", "/"),
		),
		redirect_sources: /redirects\s*:\s*async/.test(nextConfig)
			? [configSource]
			: [],
		pages_with_json_ld: inventory.pages
			.filter((page) => page.json_ld_blocks > 0)
			.map((page) => page.url),
		findings,
	};
}

export function buildRedirectManifest({ repoRoot }) {
	const sourcePath = nextConfigSource(repoRoot);
	const nextConfig = readFileSync(join(repoRoot, sourcePath), "utf8");
	const hasRedirectFunction = /redirects\s*:\s*async/.test(nextConfig);
	return {
		schema_version: "1.0",
		classification: "MOCK_VERIFIED",
		source_paths: hasRedirectFunction ? [sourcePath] : [],
		rules: [],
		findings: hasRedirectFunction
			? []
			: [
					{
						severity: "info",
						code: "NO_NEXT_REDIRECT_MAP_DECLARED",
						source_path: sourcePath,
					},
				],
	};
}

function normalizeInternalTarget(value) {
	if (typeof value !== "string" || !value.startsWith("/")) return null;
	const [pathAndFragment] = value.split(/[?#]/, 1);
	return pathAndFragment.replace(/\/$/, "") || "/";
}

export function extractInternalLinks(text) {
	if (typeof text !== "string") return [];
	const links = [];
	for (const match of text.matchAll(
		/(?:href|url)\s*[:=]\s*["'`]([^"'`?#]+)(?:#[^"'`]*)?["'`]/g,
	)) {
		const target = normalizeInternalTarget(match[1]);
		if (target) links.push({ target, anchor: "UNRESOLVED_STATIC_SOURCE" });
	}
	for (const match of text.matchAll(
		/(^|[^!])\[([^\]]+)\]\(\s*<?(\/[^\s)#?]+)(?:#[^)\s]+)?[^)]*\)/gm,
	)) {
		const target = normalizeInternalTarget(match[3]);
		if (target) links.push({ target, anchor: match[2].trim() });
	}
	return links;
}

export function buildLinkGraph({ repoRoot, inventory }) {
	const routes = new Set(inventory.pages.map((page) => page.url));
	const graph = [];
	for (const page of inventory.pages) {
		const text = readFileSync(join(repoRoot, page.source_path), "utf8");
		const targets = extractInternalLinks(text).filter(({ target }) =>
			routes.has(target),
		);
		for (const { target, anchor } of targets)
			graph.push({
				from: page.url,
				to: target,
				anchor,
				classification: "MOCK_VERIFIED",
			});
	}
	return {
		schema_version: "1.0",
		classification: "MOCK_VERIFIED",
		nodes: inventory.pages.map((page) => page.url),
		edges: graph,
	};
}

export function createNoChangeDecision(inventory) {
	return {
		schema_version: "1.0",
		id: "no-change-until-approved-facts-and-live-research",
		decision: "NO_CHANGE",
		reason:
			"No approved service-area facts or live query data are available; creating or editing content would risk unsupported claims.",
		existing_pages_considered: inventory.pages.map((page) => page.url),
		classification: "BLOCKED_MISSING_CREDENTIALS",
	};
}
