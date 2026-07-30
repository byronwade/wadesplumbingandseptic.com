import "server-only"

import { get, put } from "@vercel/blob"
import { promises as fs } from "node:fs"
import path from "node:path"

import {
	PAGE_VIEW_BLOB_PATHNAME,
	PAGE_VIEW_STORE_VERSION,
	type PageViewRecord,
	type PageViewStore,
} from "@/lib/page-views/types"
import {
	emptyPageViewRecord,
	pruneDaily,
	utcDayNow,
} from "@/lib/page-views/stats"

const LOCAL_STORE_PATH = path.join(process.cwd(), "data", "page-views.json")

function emptyStore(): PageViewStore {
	return {
		version: PAGE_VIEW_STORE_VERSION,
		updatedAt: null,
		pages: {},
	}
}

function normalizeStore(value: unknown): PageViewStore {
	if (!value || typeof value !== "object") return emptyStore()
	const candidate = value as Partial<PageViewStore>
	const pages: Record<string, PageViewRecord> = {}

	if (candidate.pages && typeof candidate.pages === "object") {
		for (const [key, record] of Object.entries(candidate.pages)) {
			if (!record || typeof record !== "object") continue
			pages[key] = {
				unique: Math.max(0, Number(record.unique) || 0),
				views: Math.max(0, Number(record.views) || 0),
				daily:
					record.daily && typeof record.daily === "object"
						? Object.fromEntries(
								Object.entries(record.daily).filter(
									([, count]) => typeof count === "number" && count > 0,
								),
							)
						: {},
			}
		}
	}

	return {
		version: PAGE_VIEW_STORE_VERSION,
		updatedAt:
			typeof candidate.updatedAt === "string" ? candidate.updatedAt : null,
		pages,
	}
}

async function readLocalStore() {
	try {
		const raw = await fs.readFile(LOCAL_STORE_PATH, "utf8")
		return normalizeStore(JSON.parse(raw) as unknown)
	} catch {
		return emptyStore()
	}
}

async function writeLocalStore(store: PageViewStore) {
	await fs.mkdir(path.dirname(LOCAL_STORE_PATH), { recursive: true })
	await fs.writeFile(
		LOCAL_STORE_PATH,
		`${JSON.stringify(store, null, "\t")}\n`,
		"utf8",
	)
}

function blobConfigured() {
	return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

async function readBlobStore(): Promise<PageViewStore | null> {
	if (!blobConfigured()) return null

	try {
		const result = await get(PAGE_VIEW_BLOB_PATHNAME, {
			access: "private",
			useCache: false,
		})
		if (!result?.stream) return null

		const text = await new Response(result.stream).text()
		return normalizeStore(JSON.parse(text) as unknown)
	} catch (error) {
		console.error("page-views: failed to read blob store", error)
		return null
	}
}

async function writeBlobStore(store: PageViewStore) {
	if (!blobConfigured()) return false

	await put(PAGE_VIEW_BLOB_PATHNAME, JSON.stringify(store), {
		access: "private",
		addRandomSuffix: false,
		allowOverwrite: true,
		contentType: "application/json",
	})
	return true
}

/**
 * JSON document store — no database.
 * - Local/dev: `data/page-views.json`
 * - Production: Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set, else local file
 *   (ephemeral on serverless; configure Blob for durable counts).
 */
export async function readPageViewStore(): Promise<PageViewStore> {
	const fromBlob = await readBlobStore()
	if (fromBlob) return fromBlob
	return readLocalStore()
}

export async function writePageViewStore(store: PageViewStore) {
	const wroteBlob = await writeBlobStore(store)
	if (!wroteBlob) {
		await writeLocalStore(store)
	}
}

export async function incrementPageView(
	key: string,
	options: { unique: boolean },
): Promise<PageViewRecord> {
	const today = utcDayNow()
	let attempt = 0
	let lastRecord = emptyPageViewRecord()

	while (attempt < 3) {
		attempt += 1
		const store = await readPageViewStore()
		const current = store.pages[key] ?? emptyPageViewRecord()
		const daily = pruneDaily(current.daily, today)
		const next: PageViewRecord = {
			unique: current.unique + (options.unique ? 1 : 0),
			views: current.views + 1,
			daily: options.unique
				? { ...daily, [today]: (daily[today] ?? 0) + 1 }
				: daily,
		}

		store.pages[key] = next
		store.updatedAt = new Date().toISOString()

		try {
			await writePageViewStore(store)
			return next
		} catch (error) {
			lastRecord = next
			console.error("page-views: write retry", attempt, error)
		}
	}

	return lastRecord
}
