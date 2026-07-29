import "server-only"

import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

export type Collection = "pages" | "services" | "posts"

export type ContentDocument = {
	slug: string
	title: string
	description: string
	content: string
	category?: string
	date?: string
	updated?: string
	image?: string
	imageAlt?: string
	eyebrow?: string
	order?: number
	featured?: boolean
}

const CONTENT_ROOT = path.join(process.cwd(), "content")

function collectionPath(collection: Collection) {
	return path.join(CONTENT_ROOT, collection)
}

function normalizeDate(value: unknown) {
	if (!value) return undefined
	if (value instanceof Date) return value.toISOString().slice(0, 10)
	return String(value)
}

export function getCollection(collection: Collection): ContentDocument[] {
	const directory = collectionPath(collection)

	if (!fs.existsSync(directory)) return []

	return fs
		.readdirSync(directory)
		.filter((file) => file.endsWith(".md"))
		.map((file) => {
			const slug = file.replace(/\.md$/, "")
			const source = fs.readFileSync(path.join(directory, file), "utf8")
			const { data, content } = matter(source)

			return {
				slug,
				title: String(data.title ?? slug),
				description: String(data.description ?? ""),
				content,
				category: data.category ? String(data.category) : undefined,
				date: normalizeDate(data.date),
				updated: normalizeDate(data.updated),
				image: data.image ? String(data.image) : undefined,
				imageAlt: data.imageAlt ? String(data.imageAlt) : undefined,
				eyebrow: data.eyebrow ? String(data.eyebrow) : undefined,
				order: data.order === undefined ? undefined : Number(data.order),
				featured: Boolean(data.featured),
			}
		})
		.sort((a, b) => {
			if (a.order !== undefined || b.order !== undefined) {
				return (a.order ?? 999) - (b.order ?? 999)
			}

			if (a.date || b.date) {
				return String(b.date ?? "").localeCompare(String(a.date ?? ""))
			}

			return a.title.localeCompare(b.title)
		})
}

export function getDocument(collection: Collection, slug: string) {
	return getCollection(collection).find((document) => document.slug === slug)
}

export function getPageOrPost(slug: string) {
	return getDocument("pages", slug) ?? getDocument("posts", slug)
}
