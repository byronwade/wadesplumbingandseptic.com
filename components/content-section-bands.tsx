import { Check } from "@/components/icons"

import { HomeFaq } from "@/components/home-faq"
import { MarkdownContent, MarkdownInline } from "@/components/markdown-content"
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
		<ul className="panel-grid grid gap-[var(--space-grid)]">
			{items.map((item) => (
				<li
					className="surface-panel panel-inset flex items-start gap-[min(0.75rem,12px)] text-sm font-bold"
					key={item}
				>
					<span className="bg-accent text-accent-foreground mt-0.5 grid size-[min(2rem,32px)] shrink-0 place-items-center rounded-md">
						<Check aria-hidden="true" className="size-[min(1rem,16px)]" />
					</span>
					{/* The panel is already bold, so bold markers are dropped, but
					    links stay links: "Open roles" lists are how the job pages
					    are reached at all. */}
					<span className="inline-links leading-snug">
						<MarkdownInline content={item.replace(/\*\*/g, "")} />
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
	number,
}: {
	heading: string
	body: string
	index: number
	number: number
}) {
	const kind = classifyBand(heading, body)
	const surface = bandSurface(index)

	return (
		<section className={cn("section-y", surface)}>
			<div className="container-shell band-split">
				<div className="band-split-head section-head reveal">
					<p aria-hidden="true" className="spec-label">
						{String(number).padStart(2, "0")}
					</p>
					<h2 className="type-title">{heading}</h2>
				</div>

				<div className="reveal min-w-0">
					{kind === "bullets" ? (
						<BulletPanels items={extractBulletItems(body)} />
					) : null}

					{kind === "faq" ? <HomeFaq faqs={extractFaqPairs(body)} /> : null}

					{kind === "prose" ? (
						<div className="max-w-3xl">
							<MarkdownContent content={body} demoteH1 />
						</div>
					) : null}
				</div>
			</div>
		</section>
	)
}

/** Short prose sections read better side by side than as near-empty bands. */
const SHORT_SECTION_CHARS = 700

function isShortProse(section: { heading: string; body: string }) {
	return (
		classifyBand(section.heading, section.body) === "prose" &&
		section.body.length <= SHORT_SECTION_CHARS &&
		!/^\s*\|/m.test(section.body) &&
		!/!\[/.test(section.body)
	)
}

type Section = { heading: string; body: string }
type Group =
	{ kind: "single"; section: Section } | { kind: "panels"; sections: Section[] }

function groupSections(sections: Section[]): Group[] {
	const groups: Group[] = []
	let run: Section[] = []

	const flush = () => {
		if (run.length >= 2) groups.push({ kind: "panels", sections: run })
		else if (run[0]) groups.push({ kind: "single", section: run[0] })
		run = []
	}

	for (const section of sections) {
		if (isShortProse(section)) {
			run.push(section)
			continue
		}
		flush()
		groups.push({ kind: "single", section })
	}
	flush()
	return groups
}

/** Numbers each split band so long pages read as a sequence of steps. */
function numberGroups(groups: Group[]) {
	let number = 0
	return groups.map((group) => {
		if (group.kind === "single") number += 1
		return { group, number }
	})
}

function PanelBand({
	sections,
	index,
}: {
	sections: Section[]
	index: number
}) {
	return (
		<section className={cn("section-y", bandSurface(index))}>
			<div className="container-shell">
				<div className="reveal grid grid-cols-1 gap-[var(--space-grid)] md:grid-cols-2">
					{sections.map((section) => (
						<article
							className="surface-panel panel-inset rounded-lg"
							key={section.heading}
						>
							<h2 className="type-title text-[length:var(--type-card)] sm:text-2xl">
								{section.heading}
							</h2>
							<div className="mt-4">
								<MarkdownContent content={section.body} demoteH1 />
							</div>
						</article>
					))}
				</div>
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
					<div className="container-shell band-split">
						<div className="band-split-head reveal">
							<p className="spec-label">Overview</p>
						</div>
						<div className="reveal max-w-3xl min-w-0">
							<MarkdownContent content={intro} demoteH1 />
						</div>
					</div>
				</section>
			) : null}
			{numberGroups(groupSections(sections)).map(({ group, number }, index) =>
				group.kind === "panels" ? (
					<PanelBand
						index={intro ? index + 1 : index}
						key={group.sections[0]?.heading}
						sections={group.sections}
					/>
				) : (
					<SectionBand
						body={group.section.body}
						heading={group.section.heading}
						index={intro ? index + 1 : index}
						key={group.section.heading}
						number={number}
					/>
				),
			)}
		</>
	)
}
