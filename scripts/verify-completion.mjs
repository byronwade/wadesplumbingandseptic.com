import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  latestVerificationResult,
  repositoryRoot,
  workingTreeHash,
} from "./verification-core.mjs";

let pointer;
try {
  pointer = latestVerificationResult();
} catch {
  throw new Error(
    "Completion verification requires artifacts/verification/latest.json.",
  );
}
const resultsPath = resolve(repositoryRoot, pointer.results_path ?? "");
if (!existsSync(resultsPath))
  throw new Error("Completion verification results are missing.");
const results = JSON.parse(readFileSync(resultsPath, "utf8"));
const failures = [];
if (results.classification !== "MOCK_VERIFIED")
  failures.push("verification evidence is not green");
if (results.working_tree_hash !== workingTreeHash())
  failures.push("verification evidence is stale for the current working tree");
if (
  !Array.isArray(results.checks) ||
  results.checks.some((check) => check.status !== "PASSED")
)
  failures.push("a required verification check did not pass");
if ((results.critical_high_findings ?? []).length)
  failures.push("critical or high findings remain");
if (failures.length)
  throw new Error(
    `Completion verification failed:\n- ${failures.join("\n- ")}`,
  );
console.log(`Completion verification passed for ${results.run_id}.`);
