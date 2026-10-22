import { Check } from "@/components/icons"

import { HomeFaq } from "@/components/home-faq"
import { MarkdownContent } from "@/components/markdown-content"
import { splitContentBands } from "@/lib/content-conversion"
import { extractFaqPairs } from "@/lib/seo"
import { cn } from "@/lib/utils"

type BandKind = "bullets" | "faq" | "prose"

function bandSurface(index: number) {
	if (index % 3 === 1) return "surface-sunken border-border border-y"
	if (index % 3 === 2) return "border-border bg-card border-y"
	return undefined
}

function extractBulletItems(body: string) {
	const items: string[] = []
	for (const line of body.split("\n")) {
		const match = line.match(/^\s*[-*]\s+(.+)$/)
		if (match?.[1]) items.push(match[1].trim())
	}
	return items
}

/**
 * Only real questions become an accordion. Step lists and descriptive
 * subsections ("What We Help With", "Initial Assessment") stay as prose so
 * their lists render as lists instead of a flattened "- a - b" answer.
 */
export function classifyBand(heading: string, body: string): BandKind {
	const questions = extractFaqPairs(body).filter((pair) =>
		pair.question.trim().endsWith("?"),
	)
	if (/\bfaqs?\b|frequently asked/i.test(heading) || questions.length >= 2) {
		return "faq"
	}

	const lines = body
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
		.filter((line) => !/^#{1,6}\s/.test(line))

	const bullets = extractBulletItems(body)
	if (bullets.length >= 3 && bullets.length >= Math.ceil(lines.length * 0.55)) {
		return "bullets"
	}

	return "prose"
}

function BulletPanels({ items }: { items: string[] }) {
	return (
		<ul className="panel-grid mt-[var(--space-block)] grid gap-[var(--space-grid)]">
			{items.map((item) => (
				<li
					className="surface-panel panel-inset flex items-start gap-[min(0.75rem,12px)] text-sm font-bold"
					key={item}
				>
					<span className="bg-accent text-accent-foreground mt-0.5 grid size-[min(2rem,32px)] shrink-0 place-items-center rounded-md">
						<Check aria-hidden="true" className="size-[min(1rem,16px)]" />
					</span>
					<span className="leading-snug">
						{item.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")}
					</span>
				</li>
			))}
		</ul>
	)
}

function SectionBand({
	heading,
	body,
	index,
}: {
	heading: string
	body: string
	index: number
}) {
	const kind = classifyBand(heading, body)
	const surface = bandSurface(index)

	return (
		<section className={cn("section-y", surface)}>
			<div className="container-shell">
				<div className="section-head reveal max-w-3xl">
					<h2 className="type-title">{heading}</h2>
				</div>

				{kind === "bullets" ? (
					<div className="reveal max-w-5xl">
						<BulletPanels items={extractBulletItems(body)} />
					</div>
				) : null}

				{kind === "faq" ? (
					<div className="reveal mt-[var(--space-block)] max-w-3xl">
						<HomeFaq faqs={extractFaqPairs(body)} />
					</div>
				) : null}

				{kind === "prose" ? (
					<div className="reveal mt-[var(--space-block)] max-w-3xl">
						<MarkdownContent content={body} demoteH1 />
					</div>
				) : null}
			</div>
		</section>
	)
}

/**
 * Turns markdown H2 sections into home-like alternating bands with panel
 * lists and FAQ accordions where the structure fits.
 */
export function ContentSectionBands({ content }: { content: string }) {
	const { intro, sections } = splitContentBands(content)

	if (!sections.length) {
		return (
			<section className="section-y">
				<div className="container-shell">
					<div className="reveal mx-auto max-w-3xl">
						<MarkdownContent content={content} demoteH1 />
					</div>
				</div>
			</section>
		)
	}

	return (
		<>
			{intro ? (
				<section className="section-y">
					<div className="container-shell">
						<div className="reveal max-w-3xl">
							<MarkdownContent content={intro} demoteH1 />
						</div>
					</div>
				</section>
			) : null}
			{sections.map((section, index) => (
				<SectionBand
					body={section.body}
					heading={section.heading}
					index={intro ? index + 1 : index}
					key={section.heading}
				/>
			))}
		</>
	)
}
