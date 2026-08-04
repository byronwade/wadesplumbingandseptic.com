import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Offline discovery gate modeled on `eve info`: every authored skill, tool,
 * subagent, channel, and schedule must be present and discoverable from disk
 * before a build. This does not call the network.
 */
export function discoverEveSurface(root = resolve(import.meta.dirname, "..")) {
	const skillsDir = resolve(root, "agent/skills");
	const toolsDir = resolve(root, "agent/tools");
	const subagentsDir = resolve(root, "agent/subagents");
	const channelsDir = resolve(root, "agent/channels");
	const schedulesDir = resolve(root, "agent/schedules");

	const skills = readdirSync(skillsDir)
		.filter((name) =>
			statSync(resolve(skillsDir, name), {
				throwIfNoEntry: false,
			})?.isDirectory(),
		)
		.sort();
	const tools = readdirSync(toolsDir)
		.filter((name) => name.endsWith(".ts"))
		.map((name) => name.replace(/\.ts$/, ""))
		.sort();
	const subagents = readdirSync(subagentsDir)
		.filter((name) =>
			statSync(resolve(subagentsDir, name), {
				throwIfNoEntry: false,
			})?.isDirectory(),
		)
		.sort();
	const channels = existsSync(channelsDir)
		? readdirSync(channelsDir)
				.filter((name) => name.endsWith(".ts"))
				.map((name) => name.replace(/\.ts$/, ""))
				.sort()
		: [];
	const schedules = existsSync(schedulesDir)
		? readdirSync(schedulesDir)
				.filter((name) => name.endsWith(".ts"))
				.map((name) => name.replace(/\.ts$/, ""))
				.sort()
		: [];

	return Object.freeze({ skills, tools, subagents, channels, schedules });
}

export function verifyEveDiscovery(root = resolve(import.meta.dirname, "..")) {
	const surface = discoverEveSurface(root);
	const requiredSkills = [
		"approval-risk-policy",
		"brand-context",
		"content-strategy",
		"conversion-usefulness",
		"internal-linking",
		"local-seo",
		"orchestration",
		"post-deploy-audit",
		"preview-audit",
		"prompt-injection-defense",
		"refresh-vs-create-consolidate",
		"research",
		"search-performance",
		"seo-evidence-boundaries",
		"source-policy",
		"technical-seo",
		"writing-quality",
	];
	const requiredTools = [
		"get_brand_context",
		"model",
		"orchestrate",
		"propose_brand_context_patch",
	];
	const requiredSubagents = [
		"analytics",
		"fact-checking",
		"independent-qa",
		"internal-links",
		"no-change",
		"research",
		"strategy",
		"technical-seo",
		"writing",
	];

	for (const skill of requiredSkills) {
		if (!surface.skills.includes(skill)) {
			throw new Error(`Eve discovery missing skill directory: ${skill}`);
		}
		const skillFile = resolve(root, "agent/skills", skill, "SKILL.md");
		const source = readFileSync(skillFile, "utf8");
		if (!source.includes("description:")) {
			throw new Error(`Eve skill lacks discovery description: ${skill}`);
		}
	}
	if (surface.skills.length !== requiredSkills.length) {
		throw new Error(
			`Eve discovery skill count mismatch: expected ${requiredSkills.length}, found ${surface.skills.length} (${surface.skills.join(", ")})`,
		);
	}
	for (const tool of requiredTools) {
		if (!surface.tools.includes(tool)) {
			throw new Error(`Eve discovery missing tool: ${tool}`);
		}
	}
	for (const role of requiredSubagents) {
		if (!surface.subagents.includes(role)) {
			throw new Error(`Eve discovery missing subagent: ${role}`);
		}
	}
	if (!surface.channels.includes("runtime")) {
		throw new Error("Eve discovery missing runtime channel.");
	}
	if (!surface.schedules.includes("audit")) {
		throw new Error("Eve discovery missing audit schedule.");
	}

	const brandContext = resolve(root, "../../seo/manifests/brand-context.json");
	if (!existsSync(brandContext)) {
		throw new Error("Missing Git-backed brand context manifest.");
	}

	return surface;
}

function run() {
	const surface = verifyEveDiscovery();
	console.log(
		`Eve discovery verified (${surface.skills.length} skills; ${surface.tools.length} tools; ${surface.subagents.length} subagents; channels=${surface.channels.join(",")}; schedules=${surface.schedules.join(",")}).`,
	);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) run();
