import { mkdirSync } from "node:fs"
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

const checks = [
  ["root-format", npmExecutable(), ["run", "format:check"]],
  ["root-lint", npmExecutable(), ["run", "lint"]],
  ["root-typecheck", npmExecutable(), ["run", "typecheck"]],
  ["root-seo", npmExecutable(), ["run", "seo:check"]],
  ["root-search", npmExecutable(), ["run", "ci:search"]],
  ["root-archive", npmExecutable(), ["run", "ci:archive"]],
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
    "sidecar-evals",
    npmExecutable(),
    ["--prefix", "automation/seo-agent", "run", "evals"],
  ],
  [
    "sidecar-security",
    npmExecutable(),
    ["--prefix", "automation/seo-agent", "run", "security:scan"],
  ],
  [
    "sidecar-audit-only",
    npmExecutable(),
    ["--prefix", "automation/seo-agent", "run", "audit:fixture"],
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

const results = checks.map(([id, name, args]) => {
  const result = runCommand({ name, args })
  writeText(
    resolve(outputRoot, "logs", `${id}.log`),
    `${result.stdout}${result.stderr}`,
  )
  return { id, ...result, stdout: undefined, stderr: undefined }
})
const failed = results
  .filter((result) => result.status !== "PASSED")
  .map((result) => result.id)
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
  critical_high_findings: [],
  external_blockers: [
    "Live endpoint invocation remains protected by Vercel SSO until an owner-approved preview verification path exists.",
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
