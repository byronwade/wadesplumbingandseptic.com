#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const ROOT = path.join(process.cwd(), "content")
const COLLECTIONS = ["pages", "posts", "services"]

const required = ["title", "description"]
const errors = []
const warnings = []
let count = 0

function walk(dir) {
	if (!fs.existsSync(dir)) return []
	return fs
		.readdirSync(dir, { withFileTypes: true, recursive: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
		.map((entry) => path.join(entry.parentPath, entry.name))
}

for (const collection of COLLECTIONS) {
	const files = walk(path.join(ROOT, collection))
	if (files.length === 0) {
		errors.push(`Collection missing or empty: ${collection}`)
		continue
	}

	for (const file of files) {
		count += 1
		const source = fs.readFileSync(file, "utf8")
		let data
		try {
			;({ data } = matter(source))
		} catch (error) {
			errors.push(`${file}: invalid frontmatter (${error.message})`)
			continue
		}

		for (const key of required) {
			if (!data[key] || String(data[key]).trim() === "") {
				errors.push(`${file}: missing frontmatter field "${key}"`)
			}
		}

		if (collection === "posts" && !data.date) {
			warnings.push(`${file}: post missing date`)
		}

		if (data.image && typeof data.image === "string") {
			const imagePath = data.image.startsWith("/")
				? path.join(process.cwd(), "public", data.image)
				: null
			if (imagePath && !fs.existsSync(imagePath)) {
				warnings.push(`${file}: image not found at public${data.image}`)
			}
		}

		// Dash punctuation is banned site-wide (see AGENTS.md).
		if (
			source.includes("\u2014") ||
			source.includes("&mdash;") ||
			source.includes("&#8212;")
		) {
			errors.push(
				`${file}: em dash (U+2014) is not allowed; use parentheses, a comma, a colon, or a new sentence`,
			)
		}

		if (
			source.includes("\u2013") ||
			source.includes("&ndash;") ||
			source.includes("&#8211;")
		) {
			errors.push(
				`${file}: en dash (U+2013) is not allowed; use "to"/"through" for ranges, or other real punctuation`,
			)
		}

		// Spaced hyphen asides ("word - word"), excluding markdown list markers.
		if (/(?<=\S) - (?=\S)/.test(source)) {
			errors.push(
				`${file}: spaced hyphen aside (" - ") is not allowed; use parentheses, a comma, a colon, or a new sentence`,
			)
		}

		// Only the working inbox is allowed in published content.
		const emails = source.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? []
		for (const email of emails) {
			if (email.toLowerCase() !== "support@wadesinc.io") {
				errors.push(
					`${file}: email "${email}" is not allowed; use support@wadesinc.io`,
				)
			}
		}
	}
}

console.log(
	`Validated ${count} markdown files across ${COLLECTIONS.join(", ")}`,
)
if (warnings.length) {
	console.log(`Warnings (${warnings.length}):`)
	for (const warning of warnings.slice(0, 50)) console.log(`  - ${warning}`)
	if (warnings.length > 50) console.log(`  … ${warnings.length - 50} more`)
}

if (errors.length) {
	console.error(`Errors (${errors.length}):`)
	for (const error of errors) console.error(`  - ${error}`)
	process.exit(1)
}

console.log("Content validation passed")
