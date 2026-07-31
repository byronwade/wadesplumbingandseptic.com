import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { createAuditOnlyRun } from "../src/audit.mjs";

const root = resolve(import.meta.dirname, "../../..");
const treeHash = execFileSync("git", ["rev-parse", "HEAD^{tree}"], {
	cwd: root,
	encoding: "utf8",
}).trim();
const report = createAuditOnlyRun({
	repoRoot: root,
	treeHash,
	fixtures: process.argv.includes("--fixture"),
});
if (
	!report.audit_only ||
	report.draft_prs_created !== 0 ||
	report.content_files_changed !== 0
)
	throw new Error("Audit-only invariant failed.");
console.log(
	JSON.stringify({
		verification: report.classification,
		tree_hash: treeHash,
		audit_only: report.audit_only,
		decisions: report.decisions.length,
		artifact_proposal: {
			write_performed: report.artifact_proposal.write_performed,
			requires_human_approval: report.artifact_proposal.requires_human_approval,
			paths: report.artifact_proposal.artifact_bundle.files.map(
				(file) => file.path,
			),
		},
	}),
);
