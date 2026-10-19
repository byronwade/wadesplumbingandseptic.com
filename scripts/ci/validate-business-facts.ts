import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

import { localBusinessJsonLd } from "../../lib/seo"
import { siteConfig } from "../../lib/site"
import {
	businessFactIssues,
	confirmedHours,
	confirmedPricing,
} from "./business-facts"

import { sourceBusinessFactIssues } from "./business-facts-source"

const errors: string[] = []
let count = 0

function check(text: string, file: string, line: number) {
	for (const issue of businessFactIssues(text))
		errors.push(`${file}:${line}: ${issue}`)
}

for (const root of [
	"content/pages",
	"content/posts",
	"content/services",
	"app",
	"components",
	"lib",
]) {
	for (const entry of fs.readdirSync(root, {
		recursive: true,
		withFileTypes: true,
	})) {
		if (!entry.isFile() || !/\.(?:md|[cm]?[jt]sx?)$/.test(entry.name)) continue
		const file = path.join(entry.parentPath, entry.name)
		const source = fs.readFileSync(file, "utf8")
		count++
		if (file.endsWith(".md")) {
			check(source, file, 1)
			continue
		}
		errors.push(...sourceBusinessFactIssues(source, file))
	}
}

assert.equal(siteConfig.hours, confirmedHours)
assert.equal(siteConfig.pricing, confirmedPricing)
assert.deepEqual(localBusinessJsonLd().openingHoursSpecification, [
	{
		"@type": "OpeningHoursSpecification",
		dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
		opens: "09:00",
		closes: "17:00",
	},
])

console.log(
	`Business facts: checked ${count} public source files; ${errors.length} violations`,
)
if (errors.length) {
	console.error(errors.join("\n"))
	process.exitCode = 1
}
