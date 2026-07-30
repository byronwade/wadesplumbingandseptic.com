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

export function splitH2Sections(content: string): H2Section[] {
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

/** Intro copy before the first H2, plus each H2 section for banded layouts. */
export function splitContentBands(content: string) {
	const sections = splitH2Sections(content)
	const intro = (
		sections.length > 0 ? content.slice(0, sections[0]!.start) : content
	).trim()

	return {
		intro,
		sections: sections.map(({ heading, body }) => ({
			heading,
			body: body.trim(),
		})),
	}
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
		/"([^"]{12,280})"\s*[-– - ]\s*([A-Za-z][A-Za-z'’.\-]+(?:\s+[A-Za-z][A-Za-z'’.\-]*)?)(?:,\s*([A-Za-z][A-Za-z\s.'’-]+))?/g

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

	// Prefer the last closing CTA - it was written as the end-of-page closer.
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

export type ConversionFallback = {
	title: string
	description: string
	slug?: string
	eyebrow?: string
}

type PageKind =
	| "career"
	| "contact"
	| "about"
	| "area"
	| "tip"
	| "service"
	| "general"

/** Section headings that should never become the designed CTA title. */
const WEAK_CONVERSION_TITLE =
	/^(how to apply|request service|next steps|learn more|get started|contact us|apply now|more information|serving [\w\s,.&'-]+|our office|hours of operation|frequently asked questions|coverage by .+|why .+ matters)$/i

/** Broken template from the old "Get local help with {Page Title}" fallback. */
const BROKEN_TEMPLATE_TITLE = /^get local help with\b/i

/** Headings that read as intentional end-of-page CTAs written in markdown. */
const INTENTIONAL_CTA_TITLE =
	/^(get|need|want|ready|join|call|schedule|act|skip|upgrade|protect|ensure|don'?t|book|trust|choose|clear|stop|fix|replace|install)\b/i

function detectPageKind(fallback: ConversionFallback): PageKind {
	const slug = (fallback.slug ?? "").toLowerCase()
	const title = fallback.title.trim().toLowerCase()
	const eyebrow = (fallback.eyebrow ?? "").toLowerCase()
	const description = fallback.description.toLowerCase()
	const haystack = `${slug} ${title} ${eyebrow} ${description}`

	if (
		slug.startsWith("careers") ||
		eyebrow === "careers" ||
		/\b(join our team|job description|how to apply|resume|hiring|equal opportunity employer)\b/.test(
			haystack,
		)
	) {
		return "career"
	}
	if (slug === "contact" || title === "contact us" || title === "contact") {
		return "contact"
	}
	if (
		slug === "about-us" ||
		slug.startsWith("about") ||
		title === "about us" ||
		/\bour (mission|values|story)\b/.test(haystack)
	) {
		return "about"
	}
	if (
		slug.startsWith("service-area") ||
		slug === "service-areas" ||
		/\bplumbing\s*&\s*septic services\b/.test(title) ||
		/\bca plumbing\b/.test(title)
	) {
		return "area"
	}
	if (
		/\b(guide|tips?|how to|what is|why |signs |maintenance)\b/.test(title) ||
		/\bhomeowner\b/.test(haystack)
	) {
		return "tip"
	}
	// Service offerings and most service-named pages.
	if (
		slug.includes("/") === false &&
		(description.includes("santa cruz") ||
			/\b(repair|installation|inspection|pumping|cleaning|replacement|septic|plumbing|drain|heater)\b/.test(
				haystack,
			))
	) {
		return "service"
	}
	return "general"
}

type KindCta = {
	eyebrow: string
	title: string
	description: string
}

function kindCta(kind: PageKind, fallback: ConversionFallback): KindCta {
	const pageDescription = fallback.description.trim()

	switch (kind) {
		case "career":
			return {
				eyebrow: "We're hiring",
				title: "Ready to join the Wade's team?",
				description:
					pageDescription ||
					"Send your resume to support@wadesinc.io with the role you want and the best way to reach you.",
			}
		case "contact":
			return {
				eyebrow: "Local · Licensed · Responsive",
				title: "Ready to schedule service?",
				description:
					"Call or text 831.225.4344. We confirm your address, triage the issue, and get you on the schedule.",
			}
		case "about":
			return {
				eyebrow: "Local · Licensed · Responsive",
				title: "Need a local licensed team you can trust?",
				description:
					pageDescription ||
					"Family-owned plumbing and septic specialists. Clear options, honest pricing, and work done the right way.",
			}
		case "area":
			return {
				eyebrow: "Local · Licensed · Responsive",
				title: "Need plumbing or septic help near you?",
				description:
					pageDescription ||
					"Call 831.225.4344 with the property address. We will confirm coverage and the right next step.",
			}
		case "tip":
			return {
				eyebrow: "Local · Licensed · Responsive",
				title: "Need this handled by a pro?",
				description:
					"Talk with Wade's for clear options and honest pricing. Call 831.225.4344 or request service online.",
			}
		case "service":
			return {
				eyebrow: "Local · Licensed · Responsive",
				title: "Ready for clear options and honest pricing?",
				description:
					pageDescription ||
					"Call 831.225.4344. A local licensed team will help you decide the right next step before work begins.",
			}
		default:
			return {
				eyebrow: "Local · Licensed · Responsive",
				title: "Ready to talk with Wade's?",
				description:
					pageDescription ||
					"Call 831.225.4344 for plumbing and septic help across Santa Cruz County and selected Santa Clara County communities.",
			}
	}
}

function resolveConversionTitle(
	candidate: string | undefined,
	kindDefaults: KindCta,
): string {
	const cleaned = candidate?.trim() ?? ""
	if (
		!cleaned ||
		WEAK_CONVERSION_TITLE.test(cleaned) ||
		BROKEN_TEMPLATE_TITLE.test(cleaned)
	) {
		return kindDefaults.title
	}
	// Keep intentional CTA headlines already written in markdown.
	if (INTENTIONAL_CTA_TITLE.test(cleaned) || /\btoday\??$/i.test(cleaned)) {
		return cleaned
	}
	return kindDefaults.title
}

/**
 * Pulls WordPress-era CTA / testimonial blocks out of markdown so they can
 * render in a dedicated conversion layout instead of bare prose.
 */
export function extractContentConversion(
	content: string,
	fallback: ConversionFallback,
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

	const defaults = kindCta(detectPageKind(fallback), fallback)

	// Testimonials were nested under FAQ with no separate CTA heading.
	if (!conversion && parsedSections.length > 0) {
		conversion = {
			title: defaults.title,
			description: defaults.description,
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

export function normalizeConversion(
	conversion: ContentConversion | null | undefined,
	fallback: ConversionFallback,
): ContentConversion {
	const defaults = kindCta(detectPageKind(fallback), fallback)
	const rawTitle = conversion?.title?.trim()
	const titleIsWeak = !rawTitle || WEAK_CONVERSION_TITLE.test(rawTitle)
	const title = resolveConversionTitle(rawTitle, defaults)

	const rawDescription = conversion?.description?.trim() ?? ""
	const description =
		!titleIsWeak && rawDescription ? rawDescription : defaults.description

	const testimonials =
		conversion?.testimonials && conversion.testimonials.length > 0
			? conversion.testimonials
			: defaultTestimonials()

	return {
		eyebrow: conversion?.eyebrow?.trim() || defaults.eyebrow,
		title,
		description,
		testimonials,
	}
}

function defaultTestimonials(): ContentTestimonial[] {
	return [
		{
			quote:
				"Clear communication and solid workmanship. The team made the whole job straightforward from the first call.",
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
