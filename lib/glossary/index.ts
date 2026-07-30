import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import { plumbingTerms } from "@/lib/glossary/plumbing-terms"
import { septicTerms } from "@/lib/glossary/septic-terms"
import type {
	GlossaryHub,
	GlossaryTerm,
	GlossaryTopic,
} from "@/lib/glossary/types"

export const glossaryHubs: Record<GlossaryTopic, GlossaryHub> = {
	plumbing: {
		topic: "plumbing",
		title: "Plumbing Glossary",
		eyebrow: "Homeowner Reference",
		description:
			"Plain-English plumbing definitions for drains, sewers, water heaters, fixtures, and water quality, written for Santa Cruz County homeowners.",
		intro: [
			"Plumbing jobs move faster when everyone shares the same vocabulary. This glossary explains the terms Wade's crews use on residential and commercial calls across Santa Cruz County and nearby foothill communities.",
			"Use it before a repair visit, while reading an estimate, or when you want to understand why a drain, water heater, or sewer recommendation matters for an older coastal or hillside home.",
		],
		image: "/images/work/precision-valve-installation.webp",
		imageAlt: "Precision plumbing valve installation",
	},
	septic: {
		topic: "septic",
		title: "Septic Glossary",
		eyebrow: "System Literacy",
		description:
			"Clear septic system definitions for tanks, drain fields, engineered treatment, alarms, and permitting in Santa Cruz County.",
		intro: [
			"Septic systems have their own language, especially once Santa Cruz County Environmental Health, soil conditions, and engineered treatment enter the conversation.",
			"These definitions help homeowners understand inspections, pumping, repairs, and replacement options for conventional and advanced systems on coastal, mountain, and foothill lots.",
		],
		image: "/images/work/engineered-septic-hero.webp",
		imageAlt: "Engineered septic installation in Santa Cruz County",
	},
}

function termsForTopic(topic: GlossaryTopic): GlossaryTerm[] {
	return topic === "plumbing" ? plumbingTerms : septicTerms
}

export async function getGlossaryTerms(topic: GlossaryTopic) {
	"use cache"
	cacheTag(`glossary:${topic}`)
	cacheLife("max")
	return termsForTopic(topic)
}

export async function getGlossaryTerm(topic: GlossaryTopic, slug: string) {
	"use cache"
	cacheTag(`glossary:${topic}`, `glossary:${topic}:${slug}`)
	cacheLife("max")
	return termsForTopic(topic).find((term) => term.slug === slug)
}

export async function getGlossaryTermSlugs(topic: GlossaryTopic) {
	const terms = await getGlossaryTerms(topic)
	return terms.map((term) => term.slug)
}

export async function getAllGlossaryEntries() {
	"use cache"
	cacheTag("glossary:plumbing", "glossary:septic")
	cacheLife("max")

	return [
		...plumbingTerms.map((term) => ({ topic: "plumbing" as const, term })),
		...septicTerms.map((term) => ({ topic: "septic" as const, term })),
	]
}

/** Group terms by first letter for A to Z hubs. */
export function groupTermsByLetter(terms: GlossaryTerm[]) {
	const groups = new Map<string, GlossaryTerm[]>()

	for (const term of terms) {
		const letter = term.term.charAt(0).toUpperCase()
		const bucket = groups.get(letter) ?? []
		bucket.push(term)
		groups.set(letter, bucket)
	}

	return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
}

export function glossaryTermPath(topic: GlossaryTopic, slug: string) {
	return `/glossary/${topic}/${slug}`
}

export function glossaryHubPath(topic: GlossaryTopic) {
	return `/glossary/${topic}`
}
