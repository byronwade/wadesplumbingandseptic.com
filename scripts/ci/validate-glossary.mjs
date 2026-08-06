#!/usr/bin/env node
/**
 * Validates glossary term integrity: unique slugs, related term refs,
 * dash punctuation rules, and shortDefinition length.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const files = [
	path.join(root, "lib/glossary/plumbing-terms.ts"),
	path.join(root, "lib/glossary/septic-terms.ts"),
]

const EM = "\u2014"
const EN = "\u2013"
let failed = false

function fail(message) {
	console.error(`glossary: ${message}`)
	failed = true
}

function unescapeGlossaryValue(value) {
	return value.replace(/\\n/g, "\n").replace(/\\"/g, '"')
}

/**
 * Split the exported array into object literal blocks by top-level `{...}` pairs.
 */
function termBlocks(source) {
	const start = source.indexOf("= [")
	if (start === -1) return []
	const body = source.slice(start + 2)
	const blocks = []
	let depth = 0
	let begin = -1
	let inString = false
	let escaped = false

	for (let i = 0; i < body.length; i += 1) {
		const char = body[i]
		if (inString) {
			if (escaped) {
				escaped = false
				continue
			}
			if (char === "\\") {
				escaped = true
				continue
			}
			if (char === '"') inString = false
			continue
		}
		if (char === '"') {
			inString = true
			continue
		}
		if (char === "{") {
			if (depth === 0) begin = i
			depth += 1
			continue
		}
		if (char === "}") {
			depth -= 1
			if (depth === 0 && begin !== -1) {
				blocks.push(body.slice(begin, i + 1))
				begin = -1
			}
		}
	}
	return blocks
}

function field(block, name) {
	const match = block.match(
		new RegExp(`${name}:\\s*"((?:\\\\.|[^"\\\\])*)"`, "m"),
	)
	return match ? unescapeGlossaryValue(match[1]) : null
}

function fieldArray(block, name) {
	const match = block.match(new RegExp(`${name}:\\s*\\[([\\s\\S]*?)\\]`, "m"))
	if (!match) return []
	return [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1])
}

for (const file of files) {
	const label = path.basename(file)
	const source = fs.readFileSync(file, "utf8")

	if (source.includes(EM) || source.includes(EN)) {
		fail(`${label} contains em/en dash punctuation`)
	}
	if (/\s-\s/.test(source)) {
		fail(`${label} contains spaced hyphen aside`)
	}

	const blocks = termBlocks(source)
	const slugs = new Set()
	/** @type {Array<{ slug: string, related: string[] }>} */
	const relations = []

	if (blocks.length < 35) {
		fail(`${label} has only ${blocks.length} terms (expected a full glossary)`)
	}

	for (const block of blocks) {
		const slug = field(block, "slug")
		const term = field(block, "term")
		const shortDefinition = field(block, "shortDefinition")
		const definition = field(block, "definition")
		const localContext = field(block, "localContext")
		const homeownerTip = field(block, "homeownerTip")
		const relatedTermSlugs = fieldArray(block, "relatedTermSlugs")
		const relatedServiceSlugs = fieldArray(block, "relatedServiceSlugs")

		if (
			!slug ||
			!term ||
			!shortDefinition ||
			!definition ||
			!localContext ||
			!homeownerTip
		) {
			fail(
				`${label}: missing required fields near ${slug ?? term ?? "unknown"}`,
			)
			continue
		}
		if (slugs.has(slug)) fail(`${label}: duplicate slug ${slug}`)
		slugs.add(slug)

		if (shortDefinition.length < 120 || shortDefinition.length > 180) {
			fail(
				`${label}:${slug} shortDefinition length ${shortDefinition.length} (want 120-180)`,
			)
		}
		if (!definition.includes("\n\n")) {
			fail(`${label}:${slug} definition should include two paragraphs`)
		}
		if (relatedServiceSlugs.length < 1) {
			fail(`${label}:${slug} needs relatedServiceSlugs`)
		}
		if (relatedTermSlugs.length < 1) {
			fail(`${label}:${slug} needs relatedTermSlugs`)
		}

		relations.push({ slug, related: relatedTermSlugs })
	}

	for (const { slug, related } of relations) {
		for (const target of related) {
			if (!slugs.has(target)) {
				fail(`${label}:${slug} relatedTermSlugs missing target ${target}`)
			}
		}
	}

	console.log(`glossary: ${label} ok (${slugs.size} terms)`)
}

if (failed) process.exit(1)
console.log("glossary: all checks passed")
