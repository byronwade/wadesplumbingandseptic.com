import { siteConfig } from "@/lib/site"

const OFFICE_TIME_ZONE = "America/Los_Angeles"
const WEEKDAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
] as const

type OpeningHours = { days: readonly string[]; opens: string; closes: string }

export type OfficeStatus = { open: boolean; label: string }

function minutes(hhmm: string) {
	const [hours = 0, mins = 0] = hhmm.split(":").map(Number)
	return hours * 60 + mins
}

/** "17:00" → "5:00 PM", matching how the site writes its hours. */
function clock(hhmm: string) {
	const total = minutes(hhmm)
	const hours = Math.floor(total / 60)
	const mins = String(total % 60).padStart(2, "0")
	return `${hours % 12 || 12}:${mins} ${hours < 12 ? "AM" : "PM"}`
}

/** Weekday and minutes past midnight at the office, wherever the visitor is. */
function officeClock(now: Date) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: OFFICE_TIME_ZONE,
		weekday: "long",
		hour: "numeric",
		minute: "numeric",
		hourCycle: "h23",
	}).formatToParts(now)
	const part = (type: string) => parts.find((p) => p.type === type)?.value
	return {
		day: WEEKDAYS.indexOf(part("weekday") as (typeof WEEKDAYS)[number]),
		minute: Number(part("hour")) * 60 + Number(part("minute")),
	}
}

/**
 * Whether the office is open right now, worded for a visitor. Built only from
 * the published hours; holidays are not known, so it never promises a callback.
 */
export function officeStatus(
	now: Date,
	hours: OpeningHours = siteConfig.openingHours,
): OfficeStatus {
	const { day, minute } = officeClock(now)
	const opens = minutes(hours.opens)
	const closes = minutes(hours.closes)
	const isOpenDay = (offset: number) =>
		hours.days.includes(WEEKDAYS[(day + offset) % 7]!)

	if (isOpenDay(0) && minute >= opens && minute < closes) {
		return { open: true, label: `Office open now until ${clock(hours.closes)}` }
	}

	const startsToday = isOpenDay(0) && minute < opens
	const offset = startsToday
		? 0
		: [1, 2, 3, 4, 5, 6, 7].find((next) => isOpenDay(next))
	if (offset === undefined) return { open: false, label: "Office closed now" }

	const when =
		offset === 0
			? "today"
			: offset === 1
				? "tomorrow"
				: WEEKDAYS[(day + offset) % 7]
	return {
		open: false,
		label: `Office closed now. Opens ${when} at ${clock(hours.opens)}`,
	}
}
