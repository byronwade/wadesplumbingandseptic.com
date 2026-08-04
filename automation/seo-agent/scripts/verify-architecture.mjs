import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const repoRoot = resolve(root, "../..");
const packageJson = JSON.parse(
	readFileSync(resolve(root, "package.json"), "utf8"),
);
const rootPackageJson = JSON.parse(
	readFileSync(resolve(repoRoot, "package.json"), "utf8"),
);
const dependencies = {
	...(packageJson.dependencies ?? {}),
	...(packageJson.devDependencies ?? {}),
};
const forbiddenPackages = [
	"next",
	"react",
	"react-dom",
	"@prisma/client",
	"prisma",
	"drizzle-orm",
	"pg",
	"@supabase/supabase-js",
	"mongoose",
];
const presentPackages = forbiddenPackages.filter(
	(name) => name in dependencies,
);
if (presentPackages.length)
	throw new Error(
		`Backend-only sidecar must not depend on UI or database packages: ${presentPackages.join(", ")}.`,
	);

const rootDependencies = {
	...(rootPackageJson.dependencies ?? {}),
	...(rootPackageJson.devDependencies ?? {}),
};
const sidecarRuntimePackages = [
	"eve",
	"ai",
	"@ai-sdk/gateway",
	"@github-tools/sdk",
	"@vercel/connect",
	"@vercel/sandbox",
];
const pollutedRootPackages = sidecarRuntimePackages.filter(
	(name) => name in rootDependencies,
);
if (pollutedRootPackages.length)
	throw new Error(
		`Public site package must not contain sidecar runtime dependencies: ${pollutedRootPackages.join(", ")}.`,
	);

const publicRuntimeRoots = ["app", "components", "lib"];
const publicRuntimeFiles = [];
const collectPublicRuntimeFiles = (directory) => {
	if (!existsSync(directory)) return;
	for (const entry of readdirSync(directory)) {
		const file = join(directory, entry);
		const stat = statSync(file);
		if (stat.isDirectory()) collectPublicRuntimeFiles(file);
		else if (/\.(?:mjs|cjs|js|ts|tsx|jsx)$/.test(entry))
			publicRuntimeFiles.push(file);
	}
};
for (const directory of publicRuntimeRoots)
	collectPublicRuntimeFiles(resolve(repoRoot, directory));
const publicSidecarLeaks = publicRuntimeFiles.filter((file) =>
	/(?:automation\/seo-agent|\b(?:SEO_AGENT_|EVE_SEO_AGENT_|AI_GATEWAY_API_KEY)\b)/.test(
		readFileSync(file, "utf8"),
	),
);
if (publicSidecarLeaks.length)
	throw new Error(
		`Public-site runtime must not import sidecar code or reference sidecar environment variables: ${publicSidecarLeaks.map((file) => relative(repoRoot, file)).join(", ")}.`,
	);

const forbiddenRoots = ["app", "pages", "components", "public"];
const presentRoots = forbiddenRoots.filter((name) =>
	existsSync(resolve(root, name)),
);
if (presentRoots.length)
	throw new Error(
		`Backend-only sidecar must not contain UI roots: ${presentRoots.join(", ")}.`,
	);

for (const path of [
	"seo/manifests/approved-facts.json",
	"seo/manifests/brand-context.json",
	"seo/manifests/query-ownership.json",
	"seo/manifests/pages.json",
]) {
	if (!existsSync(resolve(repoRoot, path)))
		throw new Error(`Git-backed SEO state is missing: ${path}.`);
}

const sourceFiles = [];
const visit = (directory) => {
	for (const entry of readdirSync(directory)) {
		if (["node_modules", ".eve", ".output"].includes(entry)) continue;
		const file = join(directory, entry);
		const stat = statSync(file);
		if (stat.isDirectory()) visit(file);
		else if (/\.(?:mjs|cjs|js|ts)$/.test(entry)) sourceFiles.push(file);
	}
};
visit(resolve(root, "agent"));
visit(resolve(root, "src"));
const forbiddenImports =
	/(?:from\s+['"](?:pg|prisma|drizzle-orm|@prisma\/client|@supabase\/supabase-js|mongoose)['"]|require\(['"](?:pg|prisma|drizzle-orm|@prisma\/client|@supabase\/supabase-js|mongoose)['"]\))/;
const persistenceImports = sourceFiles.filter((file) =>
	forbiddenImports.test(readFileSync(file, "utf8")),
);
if (persistenceImports.length)
	throw new Error(
		`Git is the only persistent state; found database import(s): ${persistenceImports.map((file) => relative(root, file)).join(", ")}.`,
	);

console.log(
	`Architecture verified (backend-only sidecar; ${sourceFiles.length} source files; Git-backed manifests; public-site dependency boundary preserved).`,
);
