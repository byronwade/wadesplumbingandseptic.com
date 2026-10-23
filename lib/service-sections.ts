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

export type ServiceSectionBullet = {
	text: string
	/** Authored leading emphasis, present only when an explanation follows. */
	label?: string
}

export type ServiceSection = {
	kind: ServiceSectionKind
	heading: string
	eyebrow: string
	/** Lead paragraphs before lists / steps (markdown). */
	lead: string
	/** Remaining body markdown when not fully consumed by structured parts. */
	body: string
	bullets: ServiceSectionBullet[]
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

/** Plain text for fields rendered outside Markdown. */
function stripInlineMarkdown(value: string) {
	return value
		.replace(/\*\*/g, "")
		.replace(/__([^_]+)__/g, "$1")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/\\([\\`*_{}[\]()#+\-.!])/g, "$1")
		.trim()
}

function serviceBullet(value: string): ServiceSectionBullet {
	const text = stripInlineMarkdown(value)
	const leading = value.match(/^(?:\*\*([^*]+)\*\*|__([^_]+)__)\s+\S/)
	const label = leading
		? stripInlineMarkdown(leading[1] ?? leading[2] ?? "")
		: ""
	return label && text.startsWith(label) ? { text, label } : { text }
}

/** The step card already shows "Step 01", so drop a numbered prefix from the title. */
function stepTitle(heading: string) {
	return stripInlineMarkdown(heading).replace(/^\d+\.\s+/, "")
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
		const title = stepTitle(match[0].replace(/^###\s+/, ""))
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
		if (!sawBullet) leadLines.push(line)
		else after.push(line)
	}

	return {
		lead: leadLines.join("\n").trim(),
		bullets,
		remainder: after.join("\n").trim(),
	}
}

export type ServiceFaq = { question: string; answer: string }

type FaqBlock =
	| { type: "question"; question: string; answer: string }
	| { type: "text"; markdown: string }

/** Plain-text answer: same cleanup the site uses for FAQ schema elsewhere. */
function plainFaqText(markdown: string) {
	return markdown
		.replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
		.replace(/\\-/g, "")
		.replace(/[#>*_`]/g, "")
		.replace(/\s+/g, " ")
		.trim()
}

/**
 * One FAQ entry written as `### Question?`, `**Question?** Answer`,
 * `- **Question?** Answer` or `**Q: Question?**` followed by `A: Answer`.
 */
function parseFaqQuestion(text: string): FaqBlock | null {
	const heading = text.match(/^###\s+(.+?)\s*(?:\n([\s\S]*))?$/)
	if (heading?.[1]) {
		const question = heading[1].trim()
		if (!question.endsWith("?")) return null
		return { type: "question", question, answer: heading[2]?.trim() ?? "" }
	}

	const bold = text.match(/^(?:[-*]\s+)?\*\*(?:Q:\s*)?(.+?\?)\*\*([\s\S]*)$/)
	if (!bold?.[1]) return null
	const answer = (bold[2] ?? "").replace(/^\s*(?:\\?-|:|A:)?\s*/, "").trim()
	return { type: "question", question: bold[1].trim(), answer }
}

function faqBlocks(body: string): FaqBlock[] {
	const blocks: FaqBlock[] = []
	for (const paragraph of body.split(/\n\s*\n/)) {
		const trimmed = paragraph.trim()
		if (!trimmed) continue
		// A bulleted FAQ list keeps every question in one paragraph.
		const parts = /^[-*]\s+\*\*/.test(trimmed)
			? trimmed.split(/\n(?=[-*]\s+)/)
			: [trimmed]
		for (const part of parts) {
			blocks.push(
				parseFaqQuestion(part.trim()) ?? { type: "text", markdown: part },
			)
		}
	}
	return blocks
}

/**
 * Split a service FAQ section into question/answer pairs plus the copy around
 * them. Answers run until the next question, except the last one: closing
 * paragraphs after it (sign-offs, call prompts) stay visible as section copy
 * instead of being folded into the final answer or the FAQ schema.
 */
export function extractServiceFaqs(body: string): {
	faqs: ServiceFaq[]
	lead: string
	trailing: string
} {
	const blocks = faqBlocks(body)
	const firstQuestion = blocks.findIndex((block) => block.type === "question")
	if (firstQuestion === -1) return { faqs: [], lead: body.trim(), trailing: "" }

	const textOf = (items: FaqBlock[]) =>
		items
			.map((block) => (block.type === "text" ? block.markdown.trim() : ""))
			.filter(Boolean)
			.join("\n\n")

	const lead = textOf(blocks.slice(0, firstQuestion))
	const faqs: ServiceFaq[] = []
	let trailing = ""
	let index = firstQuestion

	while (index < blocks.length) {
		const block = blocks[index] as Extract<FaqBlock, { type: "question" }>
		let next = index + 1
		while (next < blocks.length && blocks[next]!.type === "text") next++
		const followers = blocks.slice(index + 1, next)
		const isLast = next >= blocks.length

		let answerParts = [block.answer]
		if (!isLast) {
			answerParts = [block.answer, textOf(followers)]
		} else if (!block.answer && followers.length) {
			answerParts = [textOf(followers.slice(0, 1))]
			trailing = textOf(followers.slice(1))
		} else {
			trailing = textOf(followers)
		}

		const answer = plainFaqText(
			answerParts.filter(Boolean).join("\n\n"),
		).replace(/^A:\s*/, "")
		if (answer) faqs.push({ question: block.question, answer })
		index = next
	}

	return { faqs, lead, trailing }
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

	if (kind === "faq") {
		const { faqs, lead, trailing } = extractServiceFaqs(body)
		return {
			kind,
			heading,
			eyebrow: eyebrowFor(kind),
			lead: faqs.length ? lead : "",
			body: faqs.length ? trailing : lead,
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
			bullets: bullets.map(serviceBullet),
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
			bullets: bullets.map(serviceBullet),
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
		bullets: bulletHeavy ? bullets.map(serviceBullet) : [],
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
		const heading = stripInlineMarkdown(match[0].replace(/^##\s+/, ""))
		const body = content.slice(start + match[0].length, end).trim()
		return buildSection(heading, body)
	})

	return { intro, sections }
}
