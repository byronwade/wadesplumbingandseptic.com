#!/usr/bin/env node
/**
 * One-shot SEO content hygiene for migrated WordPress markdown.
 * - Rebuilds truncated / TOC-corrupted meta descriptions from body copy
 * - Removes competitor-gap leftovers and fake tel links
 * - Retargets noindex campaign LPs to indexable service-offerings URLs
 * - Demotes leading H1 that duplicates the page title (hero already provides H1)
 */
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const ROOT = path.join(process.cwd(), "content")

const NOINDEX_LP_REWRITES = [
	[
		/\/(?:lp\/)?engineered-septic-systems-santa-cruz-county\/?/g,
		"/service-offerings/engineered-septic-system-installation",
	],
	[
		/\/(?:lp\/)?failed-septic-repair(?:-replacement)?-santa-cruz-county\/?/g,
		"/service-offerings/septic-tank-repair-and-replacement",
	],
	[
		/\/(?:lp\/)?plumbing-repair-services-santa-cruz-county\/?/g,
		"/service-offerings/pipe-repair-and-replacement",
	],
	[
		/\/(?:lp\/)?water-main-sewer-line-repair-santa-cruz-county\/?/g,
		"/service-offerings/trenchless-sewer-line-replacement",
	],
	[
		/\/(?:lp\/)?emergency-plumber-santa-cruz-county\/?/g,
		"/service-offerings/drain-cleaning",
	],
	[
		/\/santa-cruz\/water-heater-replacment\/?/g,
		"/santa-cruz/water-heater-replacement",
	],
	[
		/\/service-offerings\/septic-system-repair\/?/g,
		"/service-offerings/septic-tank-repair-and-replacement",
	],
	[
		/\/service-offerings\/sewer-line-repair\/?/g,
		"/service-offerings/trenchless-sewer-line-replacement",
	],
]

const COMPETITOR_LINE =
	/^\s*.*(?:Competitor gap|redwoodpipeanddrain\.com|plumbtreeplumbing\.com).*$/gim

function walk(dir, acc = []) {
	if (!fs.existsSync(dir)) return acc
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name)
		if (entry.isDirectory()) walk(full, acc)
		else if (entry.name.endsWith(".md")) acc.push(full)
	}
	return acc
}

function firstCleanParagraph(content) {
	const lines = content.replace(/\r\n/g, "\n").split("\n")
	const chunks = []
	let buf = []

	const flush = () => {
		if (!buf.length) return
		chunks.push(buf.join(" ").replace(/\s+/g, " ").trim())
		buf = []
	}

	for (const line of lines) {
		const trimmed = line.trim()
		if (!trimmed) {
			flush()
			continue
		}
		if (
			trimmed.startsWith("#") ||
			trimmed.startsWith("!") ||
			trimmed.startsWith("|") ||
			trimmed.startsWith("- ") ||
			trimmed.startsWith("* ") ||
			trimmed.startsWith(">") ||
			trimmed.startsWith("```") ||
			/^In This Guide/i.test(trimmed) ||
			/^\d+\.\s/.test(trimmed) ||
			/^Table of Contents/i.test(trimmed)
		) {
			flush()
			continue
		}
		buf.push(
			trimmed
				.replace(/!\[[^\]]*]\([^)]+\)/g, "")
				.replace(/\[([^\]]+)]\([^)]+\)/g, "$1"),
		)
	}
	flush()

	return (
		chunks.find(
			(chunk) =>
				chunk.length >= 80 &&
				!/In This Guide/i.test(chunk) &&
				!/min read/i.test(chunk),
		) ??
		chunks[0] ??
		""
	)
}

function toDescription(paragraph, fallback) {
	const clean = paragraph
		.replace(/\s+/g, " ")
		.replace(/[…]+$/g, "")
		.replace(/\s*\.\.\.$/g, "")
		.trim()

	if (!clean) return fallback

	if (clean.length <= 158) {
		return /[.!?]$/.test(clean) ? clean : `${clean}.`
	}

	const sliced = clean.slice(0, 155)
	const cut = Math.max(
		sliced.lastIndexOf(". "),
		sliced.lastIndexOf("; "),
		sliced.lastIndexOf(", "),
		sliced.lastIndexOf(" "),
	)
	const base = (cut > 80 ? sliced.slice(0, cut) : sliced).trim()
	return /[.!?]$/.test(base) ? base : `${base}.`
}

function descriptionNeedsRewrite(description) {
	const d = String(description || "").trim()
	if (!d) return true
	if (/In This Guide/i.test(d) || /min read/i.test(d)) return true
	if (/…/.test(d) || /\.\.\.$/.test(d)) return true
	if (d.length < 70) return true
	if (/\[list of counties/i.test(d)) return true
	return false
}

function demoteDuplicateH1(content, title) {
	const match = content.match(/^#\s+(.+)\n+/)
	if (!match) return content
	const heading = match[1].trim()
	const normalizedHeading = heading.toLowerCase().replace(/[^a-z0-9]+/g, "")
	const normalizedTitle = String(title || "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "")
	if (
		normalizedHeading === normalizedTitle ||
		normalizedHeading.includes("frequentlyaskedquestions") ||
		normalizedHeading === "faq"
	) {
		return content.replace(/^#\s+(.+)\n+/, "")
	}
	// Keep unique H1s as H2 so the hero remains the sole H1.
	return content.replace(/^#\s+/, "## ")
}

let rewrittenDescriptions = 0
let filesTouched = 0

for (const file of walk(ROOT)) {
	const raw = fs.readFileSync(file, "utf8")
	const parsed = matter(raw)
	let { content } = parsed
	const data = { ...parsed.data }
	let changed = false

	if (COMPETITOR_LINE.test(content)) {
		content = content.replace(COMPETITOR_LINE, "")
		changed = true
	}

	if (/tel:\+?1234567890/i.test(content)) {
		content = content.replace(/tel:\+?1234567890/gi, "tel:+18312254344")
		content = content.replace(/\(?123\)?[-.\s]?456[-.\s]?7890/g, "831.225.4344")
		changed = true
	}

	for (const [pattern, replacement] of NOINDEX_LP_REWRITES) {
		if (pattern.test(content)) {
			content = content.replace(pattern, replacement)
			changed = true
		}
	}

	const demoted = demoteDuplicateH1(content, data.title)
	if (demoted !== content) {
		content = demoted
		changed = true
	}

	// Collapse excess blank lines from removals.
	content = content.replace(/\n{3,}/g, "\n\n")

	if (descriptionNeedsRewrite(data.description)) {
		const next = toDescription(
			firstCleanParagraph(content),
			String(data.description || data.title || ""),
		)
		if (next && next !== data.description) {
			data.description = next
			rewrittenDescriptions += 1
			changed = true
		}
	}

	if (!changed) continue

	const nextRaw = matter.stringify(content.trimStart(), data)
	fs.writeFileSync(file, nextRaw.endsWith("\n") ? nextRaw : `${nextRaw}\n`)
	filesTouched += 1
}

console.log(
	`SEO hygiene: touched ${filesTouched} files; rewrote ${rewrittenDescriptions} descriptions`,
)
