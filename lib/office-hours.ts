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

/**
 * Tiny DOM updater for `[data-office-hours]`. Keep this in the same file as
 * `officeStatus` so the published days and clock stay in one place.
 */
export function officeHoursBootScript(
	hours: OpeningHours = siteConfig.openingHours,
) {
	const config = JSON.stringify({
		days: hours.days,
		opens: hours.opens,
		closes: hours.closes,
	})
	return `(function(cfg){var TZ="America/Los_Angeles";function minutes(hhmm){var p=String(hhmm).split(":");return (+p[0]||0)*60+(+p[1]||0)}function clock(hhmm){var total=minutes(hhmm);var h=Math.floor(total/60),m=String(total%60).padStart(2,"0");return (h%12||12)+":"+m+" "+(h<12?"AM":"PM")}function dayName(i){return new Intl.DateTimeFormat("en-US",{timeZone:"UTC",weekday:"long"}).format(new Date(Date.UTC(2026,10,1+i)))}function parts(d){var p=new Intl.DateTimeFormat("en-US",{timeZone:TZ,weekday:"long",hour:"numeric",minute:"numeric",hourCycle:"h23"}).formatToParts(d);function g(t){for(var i=0;i<p.length;i++)if(p[i].type===t)return p[i].value}var weekday=g("weekday"),idx=0;for(;idx<7;idx++)if(dayName(idx)===weekday)break;return {day:idx,minute:(+g("hour"))*60+(+g("minute"))}}function status(now){var c=parts(now),day=c.day,minute=c.minute,opens=minutes(cfg.opens),closes=minutes(cfg.closes);function isOpenDay(off){return cfg.days.indexOf(dayName((day+off)%7))>=0}if(isOpenDay(0)&&minute>=opens&&minute<closes)return {open:true,label:"Office open now until "+clock(cfg.closes)};var offset=(isOpenDay(0)&&minute<opens)?0:-1;if(offset<0){for(var n=1;n<=7;n++)if(isOpenDay(n)){offset=n;break}}if(offset<0)return {open:false,label:"Office closed now"};var when=offset===0?"today":offset===1?"tomorrow":dayName((day+offset)%7);return {open:false,label:"Office closed now. Opens "+when+" at "+clock(cfg.opens)}}function paint(){var s=status(new Date());var nodes=document.querySelectorAll("[data-office-hours]");for(var i=0;i<nodes.length;i++){var el=nodes[i];el.setAttribute("data-open",s.open?"true":"false");var live=el.querySelector("[data-office-hours-live]");if(live&&live.textContent!==s.label)live.textContent=s.label}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",paint);else paint();setInterval(paint,60000)})(${config})`
}
