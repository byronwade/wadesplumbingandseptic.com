import assert from "node:assert/strict"
import test from "node:test"

import { officeStatus } from "../../lib/office-hours"

// Times are UTC; the office is in Pacific time (UTC-7 in October 2026).
const at = (iso: string) => officeStatus(new Date(iso))

test("open during weekday office hours, in Pacific time", () => {
	assert.deepEqual(at("2026-10-30T16:00:00Z"), {
		open: true,
		label: "Office open now until 5:00 PM",
	})
	// 4:59 PM Pacific is still open; 5:00 PM is closed.
	assert.equal(at("2026-10-30T23:59:00Z").open, true)
	assert.equal(at("2026-10-31T00:00:00Z").open, false)
})

test("closed times point to the next opening", () => {
	// Friday 8:00 AM Pacific, before opening.
	assert.equal(
		at("2026-10-30T15:00:00Z").label,
		"Office closed now. Opens today at 9:00 AM",
	)
	// Thursday 6:00 PM Pacific.
	assert.equal(
		at("2026-10-30T01:00:00Z").label,
		"Office closed now. Opens tomorrow at 9:00 AM",
	)
	// Saturday noon Pacific.
	assert.equal(
		at("2026-10-31T19:00:00Z").label,
		"Office closed now. Opens Monday at 9:00 AM",
	)
})

test("uses whatever hours the site publishes", () => {
	const hours = { days: ["Saturday"], opens: "08:30", closes: "12:00" }
	assert.equal(
		officeStatus(new Date("2026-10-31T16:00:00Z"), hours).label,
		"Office open now until 12:00 PM",
	)
	assert.equal(
		officeStatus(new Date("2026-11-01T16:00:00Z"), hours).label,
		"Office closed now. Opens Saturday at 8:30 AM",
	)
})
