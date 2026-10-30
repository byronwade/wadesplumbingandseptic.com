import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

import { findKey, urlForContentFile } from "../indexnow.mjs"

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
