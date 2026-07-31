import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../../..");
const policyPath = resolve(
	root,
	"automation/seo-agent/ci/self-hosted-runner-policy.json",
);
const policy = JSON.parse(readFileSync(policyPath, "utf8"));
const npmCli =
	process.env.npm_execpath ??
	resolve(dirname(process.execPath), "node_modules/npm/bin/npm-cli.js");

if (process.env.SEO_AGENT_OFFLINE_CI !== "true")
	throw new Error(
		"Self-hosted runner preflight requires SEO_AGENT_OFFLINE_CI=true.",
	);

if (!existsSync(npmCli))
	throw new Error("npm CLI entry point is unavailable for runner preflight.");
const npmVersion = execFileSync(process.execPath, [npmCli, "--version"], {
	encoding: "utf8",
}).trim();
const nodeVersion = process.version.replace(/^v/, "");
const failures = [];

if (nodeVersion !== policy.node_version)
	failures.push(
		`expected Node ${policy.node_version}; received ${nodeVersion}`,
	);
if (npmVersion !== policy.npm_version)
	failures.push(`expected npm ${policy.npm_version}; received ${npmVersion}`);
for (const name of policy.prohibited_environment_variables) {
	if (process.env[name])
		failures.push(`prohibited credential variable is set: ${name}`);
}
if (!process.env.RUNNER_TEMP)
	failures.push("RUNNER_TEMP is required for isolated CI provenance artifacts");

if (failures.length)
	throw new Error(
		`Self-hosted runner preflight failed:\n- ${failures.join("\n- ")}`,
	);

console.log(
	JSON.stringify({
		verification: "MOCK_VERIFIED",
		scope: "self_hosted_offline_runner_preflight",
		node_version: nodeVersion,
		npm_version: npmVersion,
		credential_variables: "absent",
		network_policy: "host-enforced; source contract only",
	}),
);
