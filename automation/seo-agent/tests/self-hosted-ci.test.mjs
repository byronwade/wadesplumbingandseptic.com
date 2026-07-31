import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "../../..");
const workflowPath = resolve(root, ".github/workflows/seo-agent-offline.yml");
const policyPath = resolve(
	root,
	"automation/seo-agent/ci/self-hosted-runner-policy.json",
);

test("self-hosted workflow is credential-free, pinned, and offline-only", () => {
	assert.equal(existsSync(workflowPath), true);
	assert.equal(existsSync(policyPath), true);
	const workflow = readFileSync(workflowPath, "utf8");
	const policy = JSON.parse(readFileSync(policyPath, "utf8"));

	assert.match(workflow, /^permissions:\r?\n  contents: read\r?$/m);
	assert.match(workflow, /workflow_dispatch:/);
	assert.match(workflow, /push:/);
	assert.doesNotMatch(workflow, /pull_request(?:_target)?:/);
	assert.match(
		workflow,
		/runs-on: \[self-hosted, linux, x64, wades-seo-offline\]/,
	);
	assert.match(
		workflow,
		/actions\/checkout@d23441a48e516b6c34aea4fa41551a30e30af803 # v6\.1\.0/,
	);
	assert.match(workflow, /persist-credentials: false/);
	assert.match(
		workflow,
		/actions\/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4\.6\.2/,
	);
	assert.match(workflow, /npm ci --offline --ignore-scripts --omit=peer/);
	assert.match(workflow, /npm run seo:check/);
	assert.match(workflow, /npm run seo-agent:verify/);
	assert.match(workflow, /verification_exit="\$\{PIPESTATUS\[0\]\}"/);
	assert.match(workflow, /--exit-code="\$verification_exit"/);
	assert.match(
		workflow,
		/--duration-seconds="\$\(\(finished_at - started_at\)\)"/,
	);
	assert.match(workflow, /exit "\$verification_exit"/);
	assert.match(workflow, /SEO_AGENT_OFFLINE_CI: "true"/);
	assert.doesNotMatch(workflow, /secrets\./);
	assert.doesNotMatch(workflow, /npm run (eve:deploy|eve:dev|live:probe)/);
	assert.deepEqual(policy.runner_labels, [
		"self-hosted",
		"linux",
		"x64",
		"wades-seo-offline",
	]);
	assert.equal(policy.node_version, "25.9.0");
	assert.equal(policy.npm_version, "11.12.1");
});
