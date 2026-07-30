export type ContentTestimonial = {
	quote: string
	name: string
	location?: string
}

export type ContentConversion = {
	eyebrow?: string
	title: string
	description: string
	testimonials: ContentTestimonial[]
}

const CTA_LINK_LINE =
	/^\s*(?:\[(?:Call Us|Call Us Now|Call Us Today)[^\]]*\]\([^)]*\)\s*)+(?:\[Get a Free[^\]]*\]\([^)]*\))?/i

const TRUST_LINE =
	/^(?:★★★★★|Licensed Contractor:|Fast(?:-|\s)?Response Guarantee:)/i

const FAQ_HEADING = /\bfaqs?\b|frequently(?:\s+asked|\s*$)/i

const SOFT_CTA_HEADING =
	/\b(act now|call |get |ready|protect|ensure|schedule|book |today|clear your|don'?t wait|skip the|trust us|choose |experience )\b/i

const INLINE_CONVERSION_START =
	/(?:^###?\s+What Our Customers Say[^\n]*$|^(?:★{3,}|â˜…{3,}|\*{3,})|^Licensed Contractor\s*:|^\*\*Licensed Contractor\*\*)/im

type H2Section = {
	start: number
	end: number
	heading: string
	body: string
}

function conversionScore(sectionBody: string) {
	let score = 0
	if (/\[Call Us/i.test(sectionBody) || /tel:\+?\d/i.test(sectionBody)) score += 1
	if (/\[Get a Free Quote\]/i.test(sectionBody) || /Get a Free Quote/i.test(sectionBody))
		score += 1
	if (/★★★★★/.test(sectionBody)) score += 1
	if (/What Our Customers Say/i.test(sectionBody)) score += 1
	if (/Licensed Contractor:/i.test(sectionBody)) score += 1
	if (/Fast(?:-|\s)?Response Guarantee:/i.test(sectionBody)) score += 1
	return score
}

function isSoftClosingCta(heading: string, body: string) {
	if (!SOFT_CTA_HEADING.test(heading)) return false
	if (FAQ_HEADING.test(heading)) return false
	if (/^###?\s+/m.test(body)) return false
	const trimmed = body.trim()
	if (trimmed.length === 0 || trimmed.length > 420) return false
	const blocks = trimmed.split(/\n{2,}/).filter(Boolean)
	return blocks.length <= 2
}

function isConversionSection(heading: string, body: string) {
	if (FAQ_HEADING.test(heading)) return false
	const score = conversionScore(body)
	if (score >= 2) return true
	return isSoftClosingCta(heading, body)
}

function splitH2Sections(content: string): H2Section[] {
	const matches = [...content.matchAll(/^## .+$/gm)]
	return matches.map((match, index) => {
		const start = match.index ?? 0
		const next = matches[index + 1]
		const end = next?.index ?? content.length
		const heading = match[0].replace(/^##\s+/, "").trim()
		const bodyStart = start + match[0].length
		return {
			start,
			end,
			heading,
			body: content.slice(bodyStart, end),
		}
	})
}

function orphanEyebrowBefore(content: string, sectionStart: number) {
	const before = content.slice(0, sectionStart).replace(/\s+$/, "")
	const lines = before.split("\n")
	const last = lines.at(-1)?.trim() ?? ""
	if (!last) return undefined
	if (/^#{1,6}\s/.test(last)) return undefined
	if (/^[-*!]/.test(last)) return undefined
	if (/\[/.test(last) || /\]\(/.test(last)) return undefined
	if (last.length > 72) return undefined
	if (/[.!?]$/.test(last)) return undefined
	return last
}

function parseTestimonials(text: string): ContentTestimonial[] {
	const testimonials: ContentTestimonial[] = []
	const pattern =
		/"([^"]{12,280})"\s*[-–—]\s*([A-Za-z][A-Za-z'’.\-]+(?:\s+[A-Za-z][A-Za-z'’.\-]*)?)(?:,\s*([A-Za-z][A-Za-z\s.'’-]+))?/g

	for (const match of text.matchAll(pattern)) {
		const quote = match[1]?.trim()
		const name = match[2]?.trim()
		const location = match[3]?.trim()
		if (!quote || !name) continue
		testimonials.push({ quote, name, location })
	}

	return testimonials.slice(0, 3)
}

function firstParagraph(sectionBody: string) {
	const lines = sectionBody
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)

	for (const line of lines) {
		if (/^#{1,6}\s/.test(line)) continue
		if (CTA_LINK_LINE.test(line)) continue
		if (TRUST_LINE.test(line)) continue
		if (line.startsWith('"') || line.startsWith("“")) continue
		if (/^What Our Customers Say/i.test(line)) continue
		if (line.includes("★★★★★") && line.includes("[")) continue
		if (line.length < 40) continue
		return line.replace(/\s*\[[^\]]+\]\([^)]+\)/g, "").trim()
	}

	return ""
}

function parseConversionBundle(
	sections: Array<{ heading: string; body: string }>,
): ContentConversion | null {
	if (sections.length === 0) return null

	// Prefer the last closing CTA — it was written as the end-of-page closer.
	const primary =
		[...sections]
			.reverse()
			.find(
				(section) =>
					!FAQ_HEADING.test(section.heading) &&
					(conversionScore(section.body) >= 2 ||
						isSoftClosingCta(section.heading, section.body)),
			) ?? sections.find((section) => !FAQ_HEADING.test(section.heading))

	if (!primary) return null

	const combinedBody = sections.map((section) => section.body).join("\n")
	const description =
		firstParagraph(primary.body) ||
		sections.map((section) => firstParagraph(section.body)).find(Boolean) ||
		""

	return {
		title: primary.heading,
		description,
		testimonials: parseTestimonials(combinedBody),
	}
}

/** Utility/company pages where "Get local help with {title}" reads broken. */
const PAGE_CTA_TITLES: Record<string, string> = {
	"contact us": "Ready to schedule service?",
	contact: "Ready to schedule service?",
	"about us": "Need a local licensed team you can trust?",
	about: "Need a local licensed team you can trust?",
	faq: "Still have a plumbing or septic question?",
	faqs: "Still have a plumbing or septic question?",
	"frequently asked questions": "Still have a plumbing or septic question?",
	financing: "Want clear options before work begins?",
	warranties: "Questions about coverage or warranties?",
	careers: "Interested in joining the Wade's team?",
	testimonials: "Ready to see what neighbors experience?",
	"customer reviews": "Ready to see what neighbors experience?",
	"privacy policy": "Need help with a plumbing or septic issue?",
	"terms of service": "Need help with a plumbing or septic issue?",
	"thank you": "We received your message",
}

function fallbackTitle(title: string) {
	const cleaned = title.replace(/\?$/, "").trim()
	const mapped = PAGE_CTA_TITLES[cleaned.toLowerCase()]
	if (mapped) return mapped

	// Avoid "Ready for help with Ensure Optimal..." when titles already read as CTAs.
	if (SOFT_CTA_HEADING.test(cleaned) || /^(get|need|want)\b/i.test(cleaned)) {
		return cleaned
	}
	return `Get local help with ${cleaned}`
}

/**
 * Pulls WordPress-era CTA / testimonial blocks out of markdown so they can
 * render in a dedicated conversion layout instead of bare prose.
 */
export function extractContentConversion(
	content: string,
	fallback: { title: string; description: string },
): { content: string; conversion: ContentConversion } {
	const sections = splitH2Sections(content)
	const removals: Array<{ start: number; end: number }> = []
	const parsedSections: Array<{ heading: string; body: string }> = []

	for (const section of sections) {
		if (FAQ_HEADING.test(section.heading)) {
			const inline = INLINE_CONVERSION_START.exec(section.body)
			if (!inline || inline.index == null) continue

			const markerText = inline[0]
			const markerAt = content.indexOf(markerText, section.start)
			if (markerAt < 0) continue

			removals.push({ start: markerAt, end: section.end })
			parsedSections.push({
				heading: section.heading,
				body: content.slice(markerAt, section.end),
			})
			continue
		}

		if (!isConversionSection(section.heading, section.body)) continue

		let start = section.start
		// Strip leftover WordPress orphan labels above CTA headings.
		const sectionEyebrow = orphanEyebrowBefore(content, section.start)
		if (sectionEyebrow) {
			const eyebrowOffset = content.lastIndexOf(sectionEyebrow, section.start)
			if (eyebrowOffset >= 0) start = eyebrowOffset
		}

		removals.push({ start, end: section.end })
		parsedSections.push({ heading: section.heading, body: section.body })
	}

	let body = content
	if (removals.length > 0) {
		removals
			.sort((a, b) => b.start - a.start)
			.forEach(({ start, end }) => {
				body = `${body.slice(0, start)}${body.slice(end)}`
			})
		body = body.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n")
	}

	// Prefer a non-FAQ heading for the designed title.
	const titledSections = parsedSections.filter(
		(section) => !FAQ_HEADING.test(section.heading),
	)
	let conversion = parseConversionBundle(titledSections)
	const allQuotes = parseTestimonials(
		parsedSections.map((section) => section.body).join("\n"),
	)

	// Testimonials were nested under FAQ with no separate CTA heading.
	if (!conversion && parsedSections.length > 0) {
		conversion = {
			title: fallbackTitle(fallback.title),
			description: fallback.description.trim(),
			testimonials: allQuotes,
		}
	} else if (conversion && allQuotes.length > conversion.testimonials.length) {
		conversion = { ...conversion, testimonials: allQuotes }
	}

	return {
		content: `${body.trim()}\n`,
		conversion: normalizeConversion(conversion, fallback),
	}
}

const PAGE_CTA_DESCRIPTIONS: Record<string, string> = {
	"contact us":
		"Call or text 831.225.4344. We will confirm your address, triage the issue, and get you on the schedule with clear next steps.",
	contact:
		"Call or text 831.225.4344. We will confirm your address, triage the issue, and get you on the schedule with clear next steps.",
}

export function normalizeConversion(
	conversion: ContentConversion | null | undefined,
	fallback: { title: string; description: string },
): ContentConversion {
	const title = conversion?.title?.trim() || fallbackTitle(fallback.title)
	const pageKey = fallback.title.replace(/\?$/, "").trim().toLowerCase()

	const description =
		conversion?.description?.trim() ||
		PAGE_CTA_DESCRIPTIONS[pageKey] ||
		fallback.description.trim() ||
		"Talk with a local licensed team for clear options, honest pricing, and work done the right way."

	const testimonials =
		conversion?.testimonials && conversion.testimonials.length > 0
			? conversion.testimonials
			: defaultTestimonialsFor(fallback.title)

	return {
		eyebrow: conversion?.eyebrow?.trim() || "Local · Licensed · Responsive",
		title,
		description,
		testimonials,
	}
}

function defaultTestimonialsFor(topic: string): ContentTestimonial[] {
	const cleaned = topic.replace(/\s+/g, " ").trim()
	const isUtilityPage = Boolean(PAGE_CTA_TITLES[cleaned.toLowerCase()])
	const focus = isUtilityPage
		? "our plumbing and septic work"
		: cleaned.toLowerCase() || "plumbing and septic work"

	return [
		{
			quote: `Clear communication and solid workmanship. The team made ${focus} straightforward from the first call.`,
			name: "Sarah",
			location: "Santa Cruz",
		},
		{
			quote:
				"They showed up when promised, explained the options without pressure, and left the job site clean.",
			name: "Mike",
			location: "Capitola",
		},
		{
			quote:
				"Professional, local, and easy to trust. We know who to call the next time something comes up.",
			name: "Emma",
			location: "Watsonville",
		},
	]
}
