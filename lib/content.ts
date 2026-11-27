import "server-only"

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { cacheLife, cacheTag } from "next/cache"

import {
	extractContentConversion,
	type ContentConversion,
} from "@/lib/content-conversion"
import { sanitizeArticleContent } from "@/lib/sanitize-content"

export type Collection = "pages" | "services" | "posts"

export type ContentImage = {
	src: string
	alt: string
	width: number
	height: number
	caption?: string
}

export type ContentDocument = {
	slug: string
	title: string
	/** Optional shorter hero heading; metadata and related cards keep title. */
	heroTitle?: string
	description: string
	content: string
	/** Page-specific end CTA parsed from WordPress-era markdown blocks. */
	conversion: ContentConversion
	category?: string
	date?: string
	updated?: string
	/**
	 * Calendar day of the last git commit that touched this file. Used for
	 * sitemap lastmod when frontmatter has no `updated` / `date`. Never file
	 * mtime: on Vercel that is the deploy clock, not an editorial date.
	 */
	sourceModified?: string
	image?: string
	imageAlt?: string
	eyebrow?: string
	order?: number
	featured?: boolean
	gallery?: ContentImage[]
	tags?: string[]
	noindex?: boolean
}

const CONTENT_ROOT = path.join(process.cwd(), "content")

function collectionPath(collection: Collection) {
	return path.join(CONTENT_ROOT, collection)
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

function normalizeDate(value: unknown) {
	if (!value) return undefined
	const raw = value instanceof Date ? value.toISOString() : String(value)
	const day = raw.slice(0, 10)
	return DATE_ONLY.test(day) ? day : undefined
}

let gitContentDates: Map<string, string> | undefined

/** Newest commit day per path under `content/` and `lib/glossary/`. */
function loadGitContentDates() {
	if (gitContentDates) return gitContentDates
	gitContentDates = new Map()
	try {
		const output = execFileSync(
			"git",
			["log", "--format=%cs", "--name-only", "--", "content", "lib/glossary"],
			{ encoding: "utf8", maxBuffer: 20_000_000 },
		)
		let current: string | undefined
		for (const line of output.split("\n")) {
			if (DATE_ONLY.test(line)) {
				current = line
				continue
			}
			if (!line || !current || gitContentDates.has(line)) continue
			gitContentDates.set(line, current)
		}
	} catch {
		// Shallow clones and git-less test stubs still have frontmatter dates.
	}
	return gitContentDates
}

function gitDayForFile(absolutePath: string) {
	const relative = path
		.relative(process.cwd(), absolutePath)
		.split(path.sep)
		.join("/")
	return loadGitContentDates().get(relative)
}

function parseDocument(absolutePath: string, slug: string): ContentDocument {
	const source = fs.readFileSync(absolutePath, "utf8")
	const { data, content } = matter(source)
	const title = String(data.title ?? slug)
	const description = String(data.description ?? "")
	const eyebrow = data.eyebrow ? String(data.eyebrow) : undefined
	const { content: articleContent, conversion } = extractContentConversion(
		sanitizeArticleContent(content),
		{ title, description, slug, eyebrow },
	)
	const sourceModified = gitDayForFile(absolutePath)

	return {
		slug,
		title,
		heroTitle: data.heroTitle
			? String(data.heroTitle).trim() || undefined
			: undefined,
		description,
		content: articleContent,
		conversion,
		category: data.category ? String(data.category) : undefined,
		date: normalizeDate(data.date),
		updated: normalizeDate(data.updated),
		sourceModified,
		image: data.image ? String(data.image) : undefined,
		imageAlt: data.imageAlt ? String(data.imageAlt) : undefined,
		eyebrow,
		order: data.order === undefined ? undefined : Number(data.order),
		featured: Boolean(data.featured),
		gallery: Array.isArray(data.gallery)
			? data.gallery.map((image) => ({
					src: String(image.src),
					alt: String(image.alt),
					width: Number(image.width),
					height: Number(image.height),
					caption: image.caption ? String(image.caption) : undefined,
				}))
			: undefined,
		tags: Array.isArray(data.tags)
			? data.tags.map((tag) => String(tag))
			: undefined,
		noindex: Boolean(data.noindex),
	}
}

function documentPath(collection: Collection, slug: string) {
	const directory = collectionPath(collection)
	const absolutePath = path.resolve(directory, `${slug}.md`)
	const relative = path.relative(directory, absolutePath)

	if (relative.startsWith("..") || path.isAbsolute(relative)) {
		return null
	}

	return absolutePath
}

function readCollection(collection: Collection): ContentDocument[] {
	const directory = collectionPath(collection)

	if (!fs.existsSync(directory)) return []

	const files = fs.readdirSync(directory, {
		recursive: true,
		withFileTypes: true,
	})

	return files
		.filter((file) => file.isFile() && file.name.endsWith(".md"))
		.map((file) => {
			const absolutePath = path.join(file.parentPath, file.name)
			const slug = path
				.relative(directory, absolutePath)
				.replace(/\.md$/, "")
				.split(path.sep)
				.join("/")
			return parseDocument(absolutePath, slug)
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

export async function getCollection(
	collection: Collection,
): Promise<ContentDocument[]> {
	"use cache"
	cacheTag(`content:${collection}`)
	cacheLife("max")
	return readCollection(collection)
}

export async function getDocument(collection: Collection, slug: string) {
	"use cache"
	cacheTag(`content:${collection}`, `content:${collection}:${slug}`)
	cacheLife("max")

	const absolutePath = documentPath(collection, slug)
	if (!absolutePath || !fs.existsSync(absolutePath)) {
		return undefined
	}

	return parseDocument(absolutePath, slug)
}

export async function getPageOrPost(slug: string) {
	const [page, post] = await Promise.all([
		getDocument("pages", slug),
		getDocument("posts", slug),
	])
	return page ?? post
}

/** Resolve a page or post once, including which collection matched. */
export async function resolvePageOrPost(slug: string) {
	const [page, post] = await Promise.all([
		getDocument("pages", slug),
		getDocument("posts", slug),
	])

	if (page) return { document: page, isPost: false as const }
	if (post) return { document: post, isPost: true as const }
	return undefined
}

export function taxonomySlug(value: string) {
	return value
		.toLowerCase()
		.replace(/&/g, "and")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
}

export async function getAllRoutes() {
	"use cache"
	cacheTag("content:routes")
	cacheLife("max")

	const [pages, services, posts] = await Promise.all([
		getCollection("pages"),
		getCollection("services"),
		getCollection("posts"),
	])

	return { pages, services, posts }
}
