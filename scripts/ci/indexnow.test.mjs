import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

import { findKey, previousDeploySha, urlForContentFile } from "../indexnow.mjs"

test("exactly one IndexNow key file whose contents match its name", () => {
	const key = findKey()
	assert.match(key, /^[a-f0-9]{32}$/)
	assert.equal(fs.readFileSync(`public/${key}.txt`, "utf8").trim(), key)
})

test("content files map to their public URLs", () => {
	const site = "https://www.wadesplumbingandseptic.com"
	assert.equal(
		urlForContentFile("content/posts/slow-drains.md"),
		`${site}/slow-drains`,
	)
	assert.equal(
		urlForContentFile(
			"content/pages/service-area/felton-ca-plumbing-septic-services.md",
		),
		`${site}/service-area/felton-ca-plumbing-septic-services`,
	)
	assert.equal(
		urlForContentFile("content/services/drain-cleaning.md"),
		`${site}/service-offerings/drain-cleaning`,
	)
	assert.equal(urlForContentFile("content/AGENTS.md"), null)
	assert.equal(urlForContentFile("content/pages/AGENTS.md"), null)
	assert.equal(urlForContentFile("lib/seo.ts"), null)
})

test("the baseline is the last earlier production deploy that succeeded", async () => {
	// Newest first: 30 is this deploy, 29 failed, 28 was skipped, 27 shipped.
	const deployments = [
		{ id: 31, sha: "newer" },
		{ id: 30, sha: "current" },
		{ id: 29, sha: "failed" },
		{ id: 28, sha: "skipped" },
		{ id: 27, sha: "shipped" },
	]
	const statuses = {
		29: [{ state: "failure" }, { state: "in_progress" }],
		28: [],
		27: [{ state: "inactive" }, { state: "success" }],
	}
	const fetchImpl = async (url) => {
		const route = new URL(url).pathname.replace("/repos/o/r", "")
		const id = route.match(/^\/deployments\/(\d+)\/statuses$/)?.[1]
		return Response.json(id ? statuses[id] : deployments)
	}
	const options = { repo: "o/r", token: "t", fetchImpl }
	assert.equal(
		await previousDeploySha({ ...options, currentId: "30" }),
		"shipped",
	)
	assert.equal(await previousDeploySha({ ...options, currentId: 27 }), null)
	assert.equal(await previousDeploySha({ ...options, currentId: 99 }), null)
})
