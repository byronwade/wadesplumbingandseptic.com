import test from "node:test";
import assert from "node:assert/strict";
import { reviewReadiness } from "../src/independent-review.mjs";

test("independent review prevents completion when high findings or live prerequisites remain", () => {
	const review = reviewReadiness({
		technicalSeo: {
			findings: [
				{
					severity: "high",
					code: "TYPESCRIPT_BUILD_ERRORS_IGNORED",
					source_path: "next.config.js",
				},
			],
		},
		integrationInventory: {
			integrations: [
				{ id: "vercel-eve-ai-gateway", state: "BLOCKED_MISSING_CREDENTIALS" },
			],
		},
		rootConfig:
			"module.exports = { typescript: { ignoreBuildErrors: true }, eslint: { ignoreDuringBuilds: true } };",
	});
	assert.equal(review.classification, "MOCK_VERIFIED");
	assert.equal(review.completion_ready, false);
	assert.equal(review.conclusion, "NOT_READY");
	assert.ok(
		review.completion_blockers.some(
			(entry) => entry.code === "PUBLIC_TYPESCRIPT_BUILD_SUPPRESSED",
		),
	);
	assert.ok(
		review.external_prerequisites.some(
			(entry) => entry.code === "LIVE_INTEGRATION_GITHUB_CONNECT",
		),
	);
});
