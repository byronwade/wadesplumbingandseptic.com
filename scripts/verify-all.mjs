import { mkdirSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import {
	git,
	npmExecutable,
	repositoryRoot,
	runCommand,
	toolVersions,
	workingTreeHash,
	writeJson,
	writeText,
} from "./verification-core.mjs"

const startedAt = new Date().toISOString()
const commit = git(["rev-parse", "HEAD"])
const startTreeHash = workingTreeHash()
const runId = `${startedAt.replace(/[:.]/g, "").replace("Z", "z")}-${commit.slice(0, 12)}`
const outputRoot = resolve(repositoryRoot, "artifacts", "verification", runId)
mkdirSync(outputRoot, { recursive: true })

const INTEGRATION_CLASSIFICATIONS = new Set([
	"LIVE_VERIFIED",
	"MOCK_VERIFIED",
	"BLOCKED_MISSING_CREDENTIALS",
	"FAILED",
])

function parseLastJsonLine(output) {
	for (const line of output.trim().split(/\r?\n/).reverse()) {
		try {
			return JSON.parse(line)
		} catch {
			// Command output can include normal npm or runtime lines before JSON.
		}
	}
	return null
}

const checks = [
	["control-plane", npmExecutable(), ["run", "seo-agent:control-plane"]],
	[
		"verification-contracts",
		process.execPath,
		[
			"--test",
			"scripts/verification-core.test.mjs",
			"scripts/verify-completion.test.mjs",
		],
	],
	["root-format", npmExecutable(), ["run", "format:check"]],
	["root-lint", npmExecutable(), ["run", "lint"]],
	["root-typecheck", npmExecutable(), ["run", "typecheck"]],
	["root-seo", npmExecutable(), ["run", "seo:check"]],
	["root-search", npmExecutable(), ["run", "ci:search"]],
	["root-archive", npmExecutable(), ["run", "ci:archive"]],
	["root-related", npmExecutable(), ["run", "ci:related"]],
	["root-page-views", npmExecutable(), ["run", "ci:page-views"]],
	["root-build", npmExecutable(), ["run", "build"]],
	[
		"sidecar-format",
		npmExecutable(),
		["--prefix", "automation/seo-agent", "run", "format:check"],
	],
	[
		"sidecar-lint",
		npmExecutable(),
		["--prefix", "automation/seo-agent", "run", "lint"],
	],
	[
		"sidecar-typecheck",
		npmExecutable(),
		["--prefix", "automation/seo-agent", "run", "typecheck"],
	],
	[
		"sidecar-tests",
		npmExecutable(),
		["--prefix", "automation/seo-agent", "run", "test"],
	],
	[
		"sidecar-integration-tests",
		npmExecutable(),
		["--prefix", "automation/seo-agent", "run", "test:integration"],
	],
	[
		"sidecar-evals",
		npmExecutable(),
		["--prefix", "automation/seo-agent", "run", "evals"],
	],
	[
		"sidecar-dependency-audit",
		npmExecutable(),
		["--prefix", "automation/seo-agent", "run", "audit:dependencies"],
	],
	[
		"sidecar-security",
		npmExecutable(),
		["--prefix", "automation/seo-agent", "run", "security:scan"],
	],
	[
		"sidecar-sandbox-integration",
		npmExecutable(),
		["--prefix", "automation/seo-agent", "run", "sandbox:integration"],
	],
	[
		"sidecar-observability",
		npmExecutable(),
		["--prefix", "automation/seo-agent", "run", "observability:fixture"],
	],
	[
		"sidecar-audit-only",
		npmExecutable(),
		["--prefix", "automation/seo-agent", "run", "audit:fixture"],
	],
	[
		"sidecar-rollback-drill",
		npmExecutable(),
		["--prefix", "automation/seo-agent", "run", "rollback:drill"],
	],
	[
		"sidecar-independent-review",
		npmExecutable(),
		["--prefix", "automation/seo-agent", "run", "review:independent"],
	],
	[
		"sidecar-health-smoke",
		npmExecutable(),
		["--prefix", "automation/seo-agent", "run", "health:smoke"],
	],
	[
		"sidecar-build",
		npmExecutable(),
		["--prefix", "automation/seo-agent", "run", "build"],
	],
]

const capturedResults = checks.map(([id, name, args]) => {
	const result = runCommand({ name, args })
	writeText(
		resolve(outputRoot, "logs", `${id}.log`),
		`${result.stdout}${result.stderr}`,
	)
	return { id, ...result }
})
const results = capturedResults.map((result) => {
	const safeResult = { ...result }
	delete safeResult.stdout
	delete safeResult.stderr
	return safeResult
})
const failed = results
	.filter((result) => result.status !== "PASSED")
	.map((result) => result.id)
const independentReview = parseLastJsonLine(
	capturedResults.find((result) => result.id === "sidecar-independent-review")
		?.stdout ?? "",
)
const integrationInventory = JSON.parse(
	readFileSync(
		resolve(repositoryRoot, "seo", "manifests", "integration-inventory.json"),
		"utf8",
	),
)
const unclassifiedIntegrations = (integrationInventory.integrations ?? [])
	.filter((integration) => !INTEGRATION_CLASSIFICATIONS.has(integration.state))
	.map((integration) => integration.id)
const incompleteDefinitionOfDone =
	independentReview?.completion_ready === true
		? []
		: [
				...(independentReview?.completion_blockers ?? []),
				...(independentReview?.external_prerequisites ?? []),
				...(independentReview ? [] : ["INDEPENDENT_REVIEW_UNAVAILABLE"]),
			]
const finishedAt = new Date().toISOString()
const endTreeHash = workingTreeHash()
const payload = {
	schema_version: "1.0",
	run_id: runId,
	classification: failed.length === 0 ? "MOCK_VERIFIED" : "FAILED",
	started_at: startedAt,
	finished_at: finishedAt,
	commit,
	working_tree_hash: endTreeHash,
	working_tree_hash_at_start: startTreeHash,
	artifact_stale_if_tree_hash_changes: true,
	tool_versions: toolVersions(),
	checks: results,
	failed_checks: failed,
	skipped_checks: [],
	independent_review: independentReview,
	unclassified_integrations: unclassifiedIntegrations,
	incomplete_definition_of_done: incompleteDefinitionOfDone,
	critical_high_findings: independentReview?.completion_blockers ?? [],
	external_blockers: [
		"Live endpoint invocation remains protected by Vercel SSO until an owner-approved preview verification path exists.",
		...(independentReview?.external_prerequisites ?? []).map(
			(entry) => entry.detail,
		),
	],
}
writeJson(resolve(outputRoot, "results.json"), payload)
writeText(
	resolve(outputRoot, "summary.md"),
	`# Verification ${runId}\n\n- Commit: ${commit}\n- Tree hash: ${endTreeHash}\n- Classification: ${payload.classification}\n- Passed: ${results.length - failed.length}/${results.length}\n- Failed checks: ${failed.length ? failed.join(", ") : "none"}\n`,
)
writeJson(resolve(repositoryRoot, "artifacts", "verification", "latest.json"), {
	run_id: runId,
	results_path: `artifacts/verification/${runId}/results.json`,
})
console.log(`Verification evidence written to artifacts/verification/${runId}`)
if (failed.length) process.exit(1)
