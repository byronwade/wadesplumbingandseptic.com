import assert from "node:assert/strict"

import {
	archiveCategoryKey,
	buildArchiveFilters,
	filterArchiveItems,
	paginateArchiveItems,
	resolveArchiveCategory,
	toArchiveItem,
} from "../../lib/archive"

const items = [
	toArchiveItem(
		{
			slug: "a",
			title: "Drain Cleaning",
			description: "Clear drains",
			category: "Plumbing",
		},
		"/service-offerings/a",
		"Plumbing",
	),
	toArchiveItem(
		{
			slug: "b",
			title: "Septic Pumping",
			description: "Pump tanks",
			category: "Septic",
		},
		"/service-offerings/b",
		"Plumbing",
	),
	toArchiveItem(
		{
			slug: "c",
			title: "Commercial Drain",
			description: "Biz drains",
			category: "Commercial",
		},
		"/service-offerings/c",
		"Plumbing",
	),
	toArchiveItem(
		{
			slug: "d",
			title: "Leak Detection",
			description: "Find leaks",
			category: "Plumbing",
		},
		"/service-offerings/d",
		"Plumbing",
	),
]

assert.equal(archiveCategoryKey("Plumbing Tips"), "plumbing-tips")

const filters = buildArchiveFilters(items)
assert.equal(filters[0]?.key, "plumbing")
assert.equal(filters[0]?.count, 2)
assert.equal(filters.length, 3)

const plumbing = filterArchiveItems(items, "plumbing")
assert.equal(plumbing.length, 2)

assert.equal(resolveArchiveCategory(filters, null), null)
assert.equal(resolveArchiveCategory(filters, "all"), null)
assert.equal(resolveArchiveCategory(filters, "plumbing"), "plumbing")
assert.equal(
	resolveArchiveCategory(filters, "not-a-real-category"),
	null,
	"Unknown category keys must fall back to all",
)
assert.equal(
	filterArchiveItems(
		items,
		resolveArchiveCategory(filters, "not-a-real-category"),
	).length,
	items.length,
)

const page1 = paginateArchiveItems(items, 1, 2)
assert.equal(page1.pageCount, 2)
assert.equal(page1.pageItems.length, 2)
assert.equal(page1.page, 1)

const pageOverflow = paginateArchiveItems(items, 99, 2)
assert.equal(pageOverflow.page, 2)

console.log("archive helpers ok")
