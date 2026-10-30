import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import test from "node:test"

import { getCityServicePage } from "../../lib/city-service-pages"
import {
	finderProblems,
	finderSpokes,
	finderTowns,
} from "../../lib/problem-finder"

test("every problem points at real service pages", () => {
	for (const problem of finderProblems) {
		for (const service of problem.services) {
			assert.ok(
				existsSync(`content/services/${service.slug}.md`),
				`${problem.id}: no service page for ${service.slug}`,
			)
		}
	}
})

test("problems are unique and every town has a page", () => {
	const ids = finderProblems.map((problem) => problem.id)
	assert.equal(new Set(ids).size, ids.length)
	assert.ok(finderTowns.length >= 30)
	for (const town of finderTowns) {
		assert.match(
			town.href,
			/^\/service-area\/[a-z-]+-ca-plumbing-septic-services$/,
		)
	}
})

test("local links only go to local pages that exist", () => {
	for (const spoke of finderSpokes) {
		const [city, service] = spoke.split("/")
		assert.ok(getCityServicePage(city!, service!), spoke)
	}
})
