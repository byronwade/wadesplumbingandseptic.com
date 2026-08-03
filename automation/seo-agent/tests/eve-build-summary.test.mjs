import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { verifyEveBuildSummary } from "../scripts/verify-eve-manifest.mjs";

function summary() {
	return {
		kind: "vercel-eve-agent-summary",
		schemaVersion: 3,
		generatorVersion: "0.29.4",
		sandbox: { logicalPath: "sandbox.ts" },
		schedules: [{ name: "audit", cron: "17 16 * * 1" }],
		channels: [
			{ urlPath: "/api/healthz" },
			{ urlPath: "/api/readyz" },
			{ urlPath: "/api/cron" },
		],
		tools: [{ name: "model" }, { name: "orchestrate" }],
		subagents: Array.from({ length: 9 }, (_, index) => ({ name: `${index}` })),
		skills: Array.from({ length: 14 }, (_, index) => ({ name: `${index}` })),
	};
}

test("Eve 0.29 build summaries retain the required runtime contract", () => {
	assert.equal(verifyEveBuildSummary(summary()).generatorVersion, "0.29.4");
	assert.throws(
		() => verifyEveBuildSummary({ ...summary(), schedules: [] }),
		/bounded audit schedule/,
	);
	assert.throws(
		() =>
			verifyEveBuildSummary({
				...summary(),
				schedules: [
					{ name: "audit", cron: "17 16 * * 1" },
					{ name: "unexpected", cron: "0 0 * * *" },
				],
			}),
		/single audit schedule/,
	);
	assert.throws(
		() =>
			verifyEveBuildSummary({
				...summary(),
				channels: [{ urlPath: "/api/healthz" }],
			}),
		/readyz channel/,
	);
});

test("the native schedule hands durable work to Eve through waitUntil", () => {
	const scheduleSource = readFileSync(
		resolve(import.meta.dirname, "../agent/schedules/audit.ts"),
		"utf8",
	);
	assert.match(scheduleSource, /run\(\{ receive, waitUntil, appAuth \}\)/);
	assert.match(scheduleSource, /waitUntil\(\s*receive\(runtime,/s);
	assert.match(scheduleSource, /target: \{ source: "EVE_NATIVE_CRON" \}/);
});

test("the Eve root agent declares bounded session limits", () => {
	const agentSource = readFileSync(
		resolve(import.meta.dirname, "../agent/agent.ts"),
		"utf8",
	);
	assert.match(agentSource, /limits:\s*EVE_SESSION_LIMITS/);
});
