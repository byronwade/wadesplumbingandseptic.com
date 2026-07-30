export type PageViewKind = "service" | "tip"

export type PageViewDaily = Record<string, number>

export type PageViewRecord = {
	/** Lifetime unique viewers (cookie-gated). */
	unique: number
	/** Lifetime page loads (including return visits). */
	views: number
	/** Unique viewers per UTC day (YYYY-MM-DD). Used for trending. */
	daily: PageViewDaily
}

export type PageViewStore = {
	version: 1
	updatedAt: string | null
	pages: Record<string, PageViewRecord>
}

export type PageViewStats = {
	unique: number
	views: number
	/** Sum of unique viewers over the trailing trend window. */
	trending: number
}

export const PAGE_VIEW_STORE_VERSION = 1 as const
export const PAGE_VIEW_TREND_DAYS = 7
export const PAGE_VIEW_DAILY_RETENTION_DAYS = 30
export const PAGE_VIEW_BLOB_PATHNAME = "analytics/page-views.json"
export const PAGE_VIEW_COOKIE_NAME = "wps_seen"
export const PAGE_VIEW_COOKIE_MAX_ENTRIES = 80
export const PAGE_VIEW_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
