export type ArchiveItem = {
	slug: string
	title: string
	description: string
	category: string
	href: string
	image?: string
	imageAlt?: string
	date?: string
}

export type ArchiveFilter = {
	key: string
	label: string
	count: number
}

/** Shorter chip labels for long WordPress category names. */
const SHORT_LABELS: Record<string, string> = {
	"Septic Issues in Santa Cruz County": "Septic Issues",
	"Plumbing Maintenance": "Maintenance",
	"Plumbing Tips": "Plumbing Tips",
	"Septic Maintenance": "Septic Care",
	"DIY Projects": "DIY",
	"Santa Cruz Plumbing": "Santa Cruz",
}

export function archiveCategoryKey(category: string) {
	return category
		.toLowerCase()
		.replace(/&/g, "and")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
}

export function archiveCategoryLabel(category: string) {
	return SHORT_LABELS[category] ?? category
}

export function toArchiveItem(
	document: {
		slug: string
		title: string
		description: string
		category?: string
		image?: string
		imageAlt?: string
		date?: string
	},
	href: string,
	fallbackCategory: string,
): ArchiveItem {
	return {
		slug: document.slug,
		title: document.title,
		description: document.description,
		category: document.category ?? fallbackCategory,
		href,
		image: document.image,
		imageAlt: document.imageAlt,
		date: document.date,
	}
}

export function buildArchiveFilters(items: ArchiveItem[]): ArchiveFilter[] {
	const counts = new Map<string, { label: string; count: number }>()

	for (const item of items) {
		const key = archiveCategoryKey(item.category)
		const existing = counts.get(key)
		if (existing) {
			existing.count += 1
		} else {
			counts.set(key, {
				label: archiveCategoryLabel(item.category),
				count: 1,
			})
		}
	}

	return [...counts.entries()]
		.map(([key, value]) => ({
			key,
			label: value.label,
			count: value.count,
		}))
		.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

export function filterArchiveItems(
	items: ArchiveItem[],
	categoryKey: string | null,
): ArchiveItem[] {
	if (!categoryKey || categoryKey === "all") return items
	return items.filter(
		(item) => archiveCategoryKey(item.category) === categoryKey,
	)
}

export function paginateArchiveItems<T>(
	items: T[],
	page: number,
	pageSize: number,
): {
	page: number
	pageCount: number
	pageItems: T[]
	total: number
} {
	const total = items.length
	const pageCount = Math.max(1, Math.ceil(total / pageSize) || 1)
	const safePage = Math.min(Math.max(1, page), pageCount)
	const start = (safePage - 1) * pageSize

	return {
		page: safePage,
		pageCount,
		pageItems: items.slice(start, start + pageSize),
		total,
	}
}
