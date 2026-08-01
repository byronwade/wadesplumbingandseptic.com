import assert from "node:assert/strict";
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
				channels: [{ urlPath: "/api/healthz" }],
			}),
		/readyz channel/,
	);
});
