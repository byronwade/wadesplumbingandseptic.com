import assert from "node:assert/strict"
import test from "node:test"
import { npmExecutable, runCommand } from "./verification-core.mjs"

test("verification launcher runs npm commands on the current platform", () => {
	const result = runCommand({ name: npmExecutable(), args: ["--version"] })
	assert.equal(result.status, "PASSED")
	assert.equal(result.exit_code, 0)
	assert.equal(result.error, null)
	assert.match(result.stdout.trim(), /^\d+\.\d+\.\d+$/)
})
