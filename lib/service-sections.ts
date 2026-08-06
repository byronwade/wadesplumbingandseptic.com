import { extractFaqPairs } from "@/lib/seo"

export type ServiceSectionKind =
	| "intro"
	| "overview"
	| "signs"
	| "causes"
	| "process"
	| "timeline"
	| "tips"
	| "faq"
	| "prose"

export type ServiceSectionStep = {
	title: string
	body: string
}

export type ServiceSection = {
	kind: ServiceSectionKind
	heading: string
	eyebrow: string
	/** Lead paragraphs before lists / steps (markdown). */
	lead: string
	/** Remaining body markdown when not fully consumed by structured parts. */
	body: string
	bullets: string[]
	steps: ServiceSectionStep[]
	faqs: Array<{ question: string; answer: string }>
}

function extractBulletItems(body: string) {
	const items: string[] = []
	for (const line of body.split("\n")) {
		const match = line.match(/^\s*[-*]\s+(.+)$/)
		if (match?.[1]) items.push(match[1].trim())
	}
	return items
}

function stripInlineMarkdown(value: string) {
	return value
		.replace(/\*\*/g, "")
		.replace(/__([^_]+)__/g, "$1")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/`([^`]+)`/g, "$1")
		.trim()
}

function splitH3Steps(body: string): {
	lead: string
	steps: ServiceSectionStep[]
	remainder: string
} {
	const matches = [...body.matchAll(/^### .+$/gm)]
	if (matches.length < 2) {
		return { lead: body.trim(), steps: [], remainder: "" }
	}

	const lead = body.slice(0, matches[0]!.index ?? 0).trim()
	const steps = matches.map((match, index) => {
		const start = match.index ?? 0
		const next = matches[index + 1]
		const end = next?.index ?? body.length
		const title = match[0].replace(/^###\s+/, "").trim()
		const stepBody = body.slice(start + match[0].length, end).trim()
		return { title, body: stepBody }
	})

	return { lead, steps, remainder: "" }
}

function leadAndBullets(body: string) {
	const bullets = extractBulletItems(body)
	if (bullets.length === 0) {
		return { lead: body.trim(), bullets: [] as string[], remainder: "" }
	}

	const lines = body.split("\n")
	const leadLines: string[] = []
	let sawBullet = false
	const after: string[] = []

	for (const line of lines) {
		if (/^\s*[-*]\s+/.test(line)) {
			sawBullet = true
			continue
		}
		if (sawBullet) after.push(line)
		else leadLines.push(line)
	}

	return {
		lead: leadLines.join("\n").trim(),
		bullets,
		remainder: after.join("\n").trim(),
	}
}

function classifyHeading(heading: string): ServiceSectionKind {
	const h = heading.toLowerCase()

	if (/\bfaqs?\b|frequently asked/.test(h)) return "faq"
	if (
		/\bsigns?\b|\bsymptoms?\b|\bindicators?\b|when (to|you)|watch for|need .+ (cleaning|service|help|repair)/.test(
			h,
		)
	) {
		return "signs"
	}
	if (
		/\bcauses?\b|why .+ (fail|clog|happen)|common (problems?|issues?)/.test(h)
	) {
		return "causes"
	}
	if (
		/\bprocess\b|how we |what (we|to) expect|our approach|step[- ]by[- ]step|how .+ works/.test(
			h,
		)
	) {
		return "process"
	}
	if (/\btimeline\b|\bcost\b|pricing|how long|duration|what it costs/.test(h)) {
		return "timeline"
	}
	if (
		/\btips?\b|prevention|prevent |maintain|homeowner|keep (your|the)|aftercare|care tips/.test(
			h,
		)
	) {
		return "tips"
	}
	if (
		/\bunderstanding\b|what is |overview|about |why choose|why trust/.test(h)
	) {
		return "overview"
	}

	return "prose"
}

function eyebrowFor(kind: ServiceSectionKind): string {
	switch (kind) {
		case "intro":
			return "Overview"
		case "overview":
			return "The basics"
		case "signs":
			return "Watch for these"
		case "causes":
			return "What drives the problem"
		case "process":
			return "How we work"
		case "timeline":
			return "Time and cost"
		case "tips":
			return "Protect the system"
		case "faq":
			return "Common questions"
		default:
			return "Details"
	}
}

function buildSection(heading: string, body: string): ServiceSection {
	const kind = classifyHeading(heading)
	const faqs = kind === "faq" ? extractFaqPairs(body) : []

	if (kind === "faq") {
		return {
			kind,
			heading,
			eyebrow: eyebrowFor(kind),
			lead: "",
			body: "",
			bullets: [],
			steps: [],
			faqs,
		}
	}

	if (kind === "process") {
		const { lead, steps } = splitH3Steps(body)
		if (steps.length >= 2) {
			return {
				kind,
				heading,
				eyebrow: eyebrowFor(kind),
				lead,
				body: "",
				bullets: [],
				steps,
				faqs: [],
			}
		}
	}

	const { lead, bullets, remainder } = leadAndBullets(body)
	const bulletHeavy =
		bullets.length >= 3 &&
		bullets.length >=
			Math.ceil(
				body
					.split("\n")
					.map((line) => line.trim())
					.filter(Boolean)
					.filter((line) => !/^#{1,6}\s/.test(line)).length * 0.45,
			)

	if (
		(kind === "signs" || kind === "tips" || kind === "overview") &&
		bulletHeavy
	) {
		return {
			kind,
			heading,
			eyebrow: eyebrowFor(kind),
			lead,
			body: remainder,
			bullets: bullets.map(stripInlineMarkdown),
			steps: [],
			faqs: [],
		}
	}

	if (kind === "timeline" || kind === "causes") {
		return {
			kind,
			heading,
			eyebrow: eyebrowFor(kind),
			lead: lead || body.trim(),
			body: remainder,
			bullets: bullets.map(stripInlineMarkdown),
			steps: [],
			faqs: [],
		}
	}

	return {
		kind: kind === "prose" && bulletHeavy ? "tips" : kind,
		heading,
		eyebrow: eyebrowFor(kind === "prose" && bulletHeavy ? "tips" : kind),
		lead: bulletHeavy ? lead : "",
		body: bulletHeavy ? remainder : body.trim(),
		bullets: bulletHeavy ? bullets.map(stripInlineMarkdown) : [],
		steps: [],
		faqs: [],
	}
}

/**
 * Split service markdown into typed sections the service landing page can map
 * onto distinct layouts. Content stays editable in markdown; the frontend owns
 * composition.
 */
export function parseServiceSections(content: string): {
	intro: ServiceSection | null
	sections: ServiceSection[]
} {
	const matches = [...content.matchAll(/^## .+$/gm)]
	const introRaw = (
		matches.length > 0 ? content.slice(0, matches[0]!.index ?? 0) : content
	).trim()

	const intro: ServiceSection | null = introRaw
		? {
				kind: "intro",
				heading: "",
				eyebrow: eyebrowFor("intro"),
				lead: introRaw,
				body: "",
				bullets: [],
				steps: [],
				faqs: [],
			}
		: null

	const sections = matches.map((match, index) => {
		const start = match.index ?? 0
		const next = matches[index + 1]
		const end = next?.index ?? content.length
		const heading = match[0].replace(/^##\s+/, "").trim()
		const body = content.slice(start + match[0].length, end).trim()
		return buildSection(heading, body)
	})

	return { intro, sections }
}
