import assert from "node:assert/strict"

import { pageViewCookieToken, pageViewKey } from "../../lib/page-views/keys"
import {
	attachViewStats,
	parseArchiveSort,
	sortArchiveItems,
} from "../../lib/page-views/ranking"
import {
	appendSeenToken,
	hasSeenToken,
	parseSeenCookie,
} from "../../lib/page-views/seen-cookie"
import {
	pruneDaily,
	statsForRecord,
	trendingScore,
	utcDay,
} from "../../lib/page-views/stats"
import type { PageViewStore } from "../../lib/page-views/types"

assert.equal(pageViewKey("service", "drain-cleaning"), "service:drain-cleaning")
assert.equal(parseArchiveSort("popular"), "popular")
assert.equal(parseArchiveSort("nope"), "default")

const today = utcDay(new Date("2026-07-30T12:00:00.000Z"))
const yesterdayDate = new Date(`${today}T00:00:00.000Z`)
yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1)
const yesterday = yesterdayDate.toISOString().slice(0, 10)

const record = {
	unique: 10,
	views: 25,
	daily: {
		[today]: 3,
		[yesterday]: 4,
		"2020-01-01": 99,
	},
}

assert.equal(trendingScore(record.daily, today, 7), 7)
assert.deepEqual(pruneDaily(record.daily, today, 30)["2020-01-01"], undefined)
assert.equal(statsForRecord(record, today).trending, 7)

const tokenA = pageViewCookieToken("tip", "slow-drains")
const tokenB = pageViewCookieToken("service", "drain-cleaning")
assert.notEqual(tokenA, tokenB)
assert.equal(hasSeenToken(undefined, tokenA), false)
const cookie = appendSeenToken(undefined, tokenA)
assert.equal(hasSeenToken(cookie, tokenA), true)
assert.deepEqual(parseSeenCookie(cookie), [tokenA])

const store: PageViewStore = {
	version: 1,
	updatedAt: null,
	pages: {
		"tip:a": { unique: 5, views: 9, daily: { [today]: 5 } },
		"tip:b": { unique: 2, views: 20, daily: { [today]: 1, [yesterday]: 8 } },
		"tip:c": { unique: 8, views: 8, daily: {} },
	},
}

const items = attachViewStats(
	[
		{
			slug: "a",
			title: "A",
			description: "",
			category: "Tips",
			href: "/a",
			date: "2024-01-01",
		},
		{
			slug: "b",
			title: "B",
			description: "",
			category: "Tips",
			href: "/b",
			date: "2025-06-01",
		},
		{
			slug: "c",
			title: "C",
			description: "",
			category: "Tips",
			href: "/c",
			date: "2023-01-01",
		},
	],
	store,
	"tip",
	today,
)

assert.deepEqual(
	sortArchiveItems(items, "popular").map((item) => item.slug),
	["c", "a", "b"],
)
assert.deepEqual(
	sortArchiveItems(items, "trending").map((item) => item.slug),
	["b", "a", "c"],
)
assert.deepEqual(
	sortArchiveItems(items, "newest").map((item) => item.slug),
	["b", "a", "c"],
)

console.log("page view helpers ok")
