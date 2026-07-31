import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../../..");
const rootPackageJson = JSON.parse(
	readFileSync(resolve(root, "package.json"), "utf8"),
);
const requiredFiles = [
	"AGENTS.md",
	"docs/seo-agent/BUILD_SPEC.md",
	"docs/seo-agent/EXECUTION_PLAN.md",
	"docs/seo-agent/DEFINITION_OF_DONE.md",
	"docs/seo-agent/DEFINITION_OF_DONE.json",
	"docs/seo-agent/MANUAL_SETUP.md",
	"docs/seo-agent/SOURCE_POLICY.md",
	"docs/seo-agent/THREAT_MODEL.md",
	"docs/seo-agent/SIDECAR_ARCHITECTURE.md",
	"docs/seo-agent/IMPLEMENTATION_STATUS.md",
	".agents/skills/wades-eve-seo-agent/SKILL.md",
	".agents/hooks/eve-seo-agent-stop.ps1",
	".github/workflows/seo-agent-offline.yml",
	"automation/seo-agent/ci/SELF_HOSTED_RUNNER.md",
	"automation/seo-agent/ci/self-hosted-runner-policy.json",
	"scripts/verify-seo-agent.mjs",
	"scripts/site-seo-validation.mjs",
	"scripts/verification-core.mjs",
	"scripts/verify-all.mjs",
	"scripts/verify-completion.mjs",
	"automation/seo-agent/AGENTS.md",
	"seo/AGENTS.md",
	"content/AGENTS.md",
];

const missing = requiredFiles.filter(
	(file) => !existsSync(resolve(root, file)),
);
const failures = [...missing.map((file) => `missing required file: ${file}`)];
if (!rootPackageJson.scripts?.["seo-agent:verify"])
	failures.push("root package.json is missing seo-agent:verify.");
if (!rootPackageJson.scripts?.["seo:check"])
	failures.push("root package.json is missing seo:check.");
const sentinel = resolve(root, ".agents/ENABLE_EVE_SEO_AGENT_STOP_HOOK");
if (!existsSync(sentinel))
	failures.push(
		"completion-hook sentinel must be enabled for final verification",
	);
else {
	try {
		const hookConfig = JSON.parse(readFileSync(sentinel, "utf8"));
		if (
			hookConfig?.enabled !== true ||
			!Number.isInteger(hookConfig.max_continuations) ||
			hookConfig.max_continuations < 0 ||
			hookConfig.max_continuations > 3
		)
			failures.push(
				"completion-hook sentinel has an invalid bounded configuration",
			);
	} catch {
		failures.push("completion-hook sentinel must be valid JSON");
	}
}

for (const file of requiredFiles.filter((entry) =>
	existsSync(resolve(root, entry)),
)) {
	const text = readFileSync(resolve(root, file), "utf8");
	if (!text.trim()) failures.push(`empty required file: ${file}`);
}

const spec = resolve(root, "docs/seo-agent/BUILD_SPEC.md");
if (existsSync(spec)) {
	const text = readFileSync(spec, "utf8");
	for (const requiredPhrase of [
		"automation/seo-agent",
		"audit-only",
		"draft PRs only",
		"LIVE_VERIFIED",
		"MOCK_VERIFIED",
		"BLOCKED_MISSING_CREDENTIALS",
		"FAILED",
	]) {
		if (!text.includes(requiredPhrase))
			failures.push(`BUILD_SPEC.md missing required phrase: ${requiredPhrase}`);
	}
}

const instructionFiles = [
	"AGENTS.md",
	"automation/seo-agent/AGENTS.md",
	".agents/skills/wades-eve-seo-agent/SKILL.md",
];
for (const file of instructionFiles) {
	const path = resolve(root, file);
	if (
		existsSync(path) &&
		!readFileSync(path, "utf8").includes("SOURCE_POLICY.md")
	)
		failures.push(`${file} does not require the source policy.`);
}

const sourcePolicy = resolve(root, "docs/seo-agent/SOURCE_POLICY.md");
if (existsSync(sourcePolicy)) {
	const text = readFileSync(sourcePolicy, "utf8");
	for (const requiredPhrase of [
		"COMPETITOR_GAP_ANALYSIS_ONLY",
		"Search Console windows end at least three complete days",
		"untrusted data",
	]) {
		if (!text.includes(requiredPhrase))
			failures.push(
				`SOURCE_POLICY.md missing required phrase: ${requiredPhrase}`,
			);
	}
}

if (failures.length) {
	console.error(
		`SEO agent control-plane verification failed:\n- ${failures.join("\n- ")}`,
	);
	process.exit(1);
}

console.log(
	`SEO agent control-plane verified (${requiredFiles.length} required files; guarded completion hook enabled).`,
);
