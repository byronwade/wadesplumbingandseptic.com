import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const sandbox = readFileSync(resolve(root, "agent/sandbox.ts"), "utf8");
if (!sandbox.includes('networkPolicy: "deny-all"')) {
	throw new Error(
		"Sandbox policy must deny network egress by default; Eve owns the sandbox runtime image.",
	);
}
const roles = [
	"analytics",
	"research",
	"strategy",
	"writing",
	"fact-checking",
	"internal-links",
	"technical-seo",
	"independent-qa",
	"no-change",
];
const requiredSkills = [
	"orchestration",
	"search-performance",
	"research",
	"local-seo",
	"content-strategy",
	"refresh-vs-create-consolidate",
	"internal-linking",
	"technical-seo",
	"conversion-usefulness",
	"source-policy",
	"approval-risk-policy",
	"prompt-injection-defense",
	"preview-audit",
	"post-deploy-audit",
];
const disabled = [
	"bash",
	"glob",
	"grep",
	"read_file",
	"todo",
	"web_fetch",
	"web_search",
	"write_file",
];
if (existsSync(resolve(root, "agent/tools/sandbox.ts"))) {
	throw new Error(
		"Sandbox is an authored backend, not a framework tool; do not reintroduce an invalid sandbox tool stub.",
	);
}
const modelPolicy = readFileSync(resolve(root, "agent/model.ts"), "utf8");
if (
	!modelPolicy.includes("resolveModelProfile") ||
	!modelPolicy.includes("resolveGatewayModelOptions")
) {
	throw new Error(
		"Agent model policy must resolve the configured route through the approved model allowlist.",
	);
}
const agentFiles = [
	resolve(root, "agent/agent.ts"),
	...roles.map((role) => resolve(root, "agent/subagents", role, "agent.ts")),
];
for (const agentFile of agentFiles) {
	const source = readFileSync(agentFile, "utf8");
	if (!source.includes("../../model") && agentFile.includes("subagents")) {
		throw new Error(
			`Subagent model declaration does not use the central model policy: ${agentFile}`,
		);
	}
	if (source.includes("SEO_AGENT_MODEL")) {
		throw new Error(
			`Agent model declaration bypasses the central model policy: ${agentFile}`,
		);
	}
}
for (const skill of requiredSkills) {
	const file = resolve(root, "agent/skills", skill, "SKILL.md");
	if (!existsSync(file)) throw new Error(`Missing Eve skill package: ${skill}`);
	const source = readFileSync(file, "utf8");
	if (!source.includes("description:"))
		throw new Error(`Eve skill lacks discovery description: ${skill}`);
}
const writingAgent = readFileSync(
	resolve(root, "agent/subagents/writing/agent.ts"),
	"utf8",
);
const judgeAgent = readFileSync(
	resolve(root, "agent/subagents/independent-qa/agent.ts"),
	"utf8",
);
if (
	!writingAgent.includes("modelForRole('writing')") ||
	!judgeAgent.includes("modelForRole('independent_qa')")
) {
	throw new Error(
		"Writer and independent QA must use their distinct central model profiles.",
	);
}
const modelTool = readFileSync(resolve(root, "agent/tools/model.ts"), "utf8");
if (
	!modelTool.includes("resolveModelProfile") ||
	!modelTool.includes("resolveGatewayModelOptions") ||
	!modelTool.includes("reserveModelRequest") ||
	!modelTool.includes("runId")
) {
	throw new Error(
		"Gateway model tool must enforce an approved route and a run-scoped pre-dispatch reservation.",
	);
}
for (const role of roles) {
	const roleRoot = resolve(root, "agent/subagents", role);
	if (!existsSync(resolve(roleRoot, "instructions.md")))
		throw new Error(`Subagent ${role} lacks scoped instructions.`);
	for (const tool of disabled) {
		if (!existsSync(resolve(roleRoot, "tools", `${tool}.ts`)))
			throw new Error(
				`Subagent ${role} leaves ${tool} at the framework default.`,
			);
	}
}
const connection = readFileSync(
	resolve(root, "agent/connections/vercel-mcp.ts"),
	"utf8",
);
for (const name of [
	"list_teams",
	"list_projects",
	"get_project",
	"list_deployments",
	"get_deployment",
]) {
	if (!new RegExp(`["']${name}["']`).test(connection))
		throw new Error(`Vercel MCP read allowlist is missing ${name}.`);
}
for (const forbidden of [
	"deploy_to_vercel",
	"use_vercel_cli",
	"get_access_to_vercel_url",
	"web_fetch_vercel_url",
	"get_runtime_logs",
	"get_deployment_build_logs",
]) {
	if (new RegExp(`["']${forbidden}["']`).test(connection))
		throw new Error(`Vercel MCP must not expose ${forbidden}.`);
}
if (!connection.includes("approval: always()"))
	throw new Error("Vercel MCP must require per-call human approval.");
console.log(
	`Agent boundaries verified (${roles.length} scoped subagents; ${requiredSkills.length} discoverable skills; central role-model policy; Vercel MCP read allowlist; Sandbox egress denied).`,
);
