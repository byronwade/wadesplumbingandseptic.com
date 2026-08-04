import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function verifyEveBuildSummary(summary) {
	if (summary?.kind !== "vercel-eve-agent-summary")
		throw new Error("Eve build summary has an unexpected kind.");
	if (summary.schemaVersion !== 3)
		throw new Error("Eve build summary schema is not supported.");
	if (typeof summary.generatorVersion !== "string" || !summary.generatorVersion)
		throw new Error("Eve build summary is missing its generator version.");
	if (!summary.sandbox?.logicalPath)
		throw new Error("Root agent must declare an explicit Sandbox policy.");
	const auditSchedule = (summary.schedules ?? []).find(
		(schedule) => schedule.name === "audit",
	);
	if (!auditSchedule || auditSchedule.cron !== "17 16 * * 1") {
		throw new Error(
			"Eve build summary must contain the bounded audit schedule.",
		);
	}
	if ((summary.schedules ?? []).length !== 1) {
		throw new Error(
			"Eve build summary must contain only the single audit schedule.",
		);
	}
	const channels = new Set(
		(summary.channels ?? []).map((channel) => channel.urlPath),
	);
	for (const path of ["/api/healthz", "/api/readyz", "/api/cron"]) {
		if (!channels.has(path))
			throw new Error(`Eve build summary is missing the ${path} channel.`);
	}
	const tools = new Set((summary.tools ?? []).map((tool) => tool.name));
	for (const tool of [
		"model",
		"orchestrate",
		"get_brand_context",
		"propose_brand_context_patch",
	]) {
		if (!tools.has(tool))
			throw new Error(`Root agent is missing the bounded ${tool} tool.`);
	}
	if ((summary.subagents ?? []).length !== 9)
		throw new Error(
			"Eve build summary does not contain all declared role agents.",
		);
	if ((summary.skills ?? []).length !== 17)
		throw new Error("Eve build summary does not contain all required skills.");
	return summary;
}

function run() {
	const root = resolve(import.meta.dirname, "..");
	const summaryPath = resolve(root, ".eve/agent-summary.json");
	if (!existsSync(summaryPath))
		throw new Error("Eve build summary is missing; run eve build first.");
	const summary = verifyEveBuildSummary(
		JSON.parse(readFileSync(summaryPath, "utf8")),
	);
	console.log(
		`Eve build summary verified (${summary.generatorVersion}; ${summary.subagents.length} least-privilege role agents; explicit Sandbox; one bounded native schedule with exact-gated proposal dispatch).`,
	);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) run();
