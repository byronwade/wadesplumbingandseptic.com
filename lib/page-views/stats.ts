import {
	PAGE_VIEW_DAILY_RETENTION_DAYS,
	PAGE_VIEW_TREND_DAYS,
	type PageViewDaily,
	type PageViewRecord,
	type PageViewStats,
	type PageViewStore,
} from "@/lib/page-views/types"

export function utcDay(date: Date) {
	return date.toISOString().slice(0, 10)
}

/** Request-time helper. Do not call during static prerender. */
export function utcDayNow() {
	return utcDay(new Date())
}

export function emptyPageViewRecord(): PageViewRecord {
	return { unique: 0, views: 0, daily: {} }
}

export function pruneDaily(
	daily: PageViewDaily,
	today: string,
	retainDays = PAGE_VIEW_DAILY_RETENTION_DAYS,
): PageViewDaily {
	const cutoff = new Date(`${today}T00:00:00.000Z`)
	cutoff.setUTCDate(cutoff.getUTCDate() - (retainDays - 1))
	const cutoffDay = cutoff.toISOString().slice(0, 10)

	const next: PageViewDaily = {}
	for (const [day, count] of Object.entries(daily)) {
		if (day >= cutoffDay && count > 0) next[day] = count
	}
	return next
}

export function trendingScore(
	daily: PageViewDaily,
	today: string,
	windowDays = PAGE_VIEW_TREND_DAYS,
) {
	let total = 0
	const cursor = new Date(`${today}T00:00:00.000Z`)
	for (let i = 0; i < windowDays; i += 1) {
		const day = cursor.toISOString().slice(0, 10)
		total += daily[day] ?? 0
		cursor.setUTCDate(cursor.getUTCDate() - 1)
	}
	return total
}

export function statsForRecord(
	record: PageViewRecord | undefined,
	today: string,
): PageViewStats {
	if (!record) return { unique: 0, views: 0, trending: 0 }
	return {
		unique: record.unique,
		views: record.views,
		trending: trendingScore(record.daily, today),
	}
}

export function statsForKey(
	store: PageViewStore,
	key: string,
	today: string,
): PageViewStats {
	return statsForRecord(store.pages[key], today)
}
