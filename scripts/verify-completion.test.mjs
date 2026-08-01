import assert from "node:assert/strict"
import test from "node:test"
import { completionFailures } from "./verify-completion.mjs"

function passingResults(overrides = {}) {
	return {
		classification: "MOCK_VERIFIED",
		working_tree_hash: "current-tree",
		checks: [{ id: "fixture", status: "PASSED" }],
		critical_high_findings: [],
		unclassified_integrations: [],
		incomplete_definition_of_done: [],
		independent_review: { completion_ready: true },
		...overrides,
	}
}

test("completion accepts only a current, fully classified, ready verification record", () => {
	assert.deepEqual(completionFailures(passingResults(), "current-tree"), [])
})

test("completion rejects missing truth states and an incomplete independent review", () => {
	const failures = completionFailures(
		passingResults({
			unclassified_integrations: ["github-connect"],
			incomplete_definition_of_done: [
				{ code: "LIVE_INTEGRATION_GITHUB_CONNECT" },
			],
			independent_review: { completion_ready: false },
		}),
		"current-tree",
	)
	assert.ok(failures.includes("one or more integrations are unclassified"))
	assert.ok(failures.includes("definition-of-done items remain incomplete"))
	assert.ok(failures.includes("independent readiness review is not complete"))
})
