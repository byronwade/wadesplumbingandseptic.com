import type { ReactNode } from "react"

import { Check, Siren } from "@/components/icons"

import { HomeFaq } from "@/components/home-faq"
import { MarkdownContent } from "@/components/markdown-content"
import {
	parseServiceSections,
	type ServiceSection,
	type ServiceSectionBullet,
} from "@/lib/service-sections"
import { cn } from "@/lib/utils"

function surfaceFor(index: number) {
	if (index % 3 === 1) return "surface-sunken border-border border-y"
	if (index % 3 === 2) return "border-border bg-card border-y"
	return undefined
}

function BulletText({
	item,
	className,
}: {
	item: ServiceSectionBullet
	className?: string
}) {
	return (
		<span
			className={cn("leading-snug", className, item.label && "font-normal")}
		>
			{item.label ? (
				<>
					<strong className="font-bold">{item.label}</strong>
					{item.text.slice(item.label.length)}
				</>
			) : (
				item.text
			)}
		</span>
	)
}

function BulletGrid({
	items,
	tone = "check",
}: {
	items: ServiceSectionBullet[]
	tone?: "check" | "warning"
}) {
	const Icon = tone === "warning" ? Siren : Check
	return (
		<ul className="panel-grid grid gap-[var(--space-grid)]">
			{items.map((item) => (
				<li
					className="surface-panel panel-inset flex items-start gap-[min(0.75rem,12px)] text-sm font-bold"
					key={item.text}
				>
					<span
						className={cn(
							"mt-0.5 grid size-[min(2rem,32px)] shrink-0 place-items-center rounded-md",
							tone === "warning"
								? "bg-primary/15 text-primary"
								: "bg-accent text-accent-foreground",
						)}
					>
						<Icon aria-hidden="true" className="size-[min(1rem,16px)]" />
					</span>
					<BulletText item={item} />
				</li>
			))}
		</ul>
	)
}

function ProcessSteps({
	steps,
}: {
	steps: Array<{ title: string; body: string }>
}) {
	return (
		<ol className="grid grid-cols-1 gap-[var(--space-grid)]">
			{steps.map((step, index) => (
				<li
					className="surface-panel panel-inset flex h-full flex-col"
					key={step.title}
				>
					<span className="text-primary font-mono text-[0.6875rem] font-bold tracking-[0.16em] uppercase">
						Step {String(index + 1).padStart(2, "0")}
					</span>
					<h3 className="type-subtitle mt-3 text-[1.0625rem]">{step.title}</h3>
					{step.body ? (
						<div className="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed [&_.prose]:max-w-none [&_.prose]:text-[inherit] [&_.prose_p]:my-0 [&_.prose_p]:text-[length:inherit] [&_.prose_p]:leading-[inherit]">
							<MarkdownContent content={step.body} demoteH1 />
						</div>
					) : null}
				</li>
			))}
		</ol>
	)
}

function IntroBand({
	section,
	category,
	asideTitle,
	asideBody,
}: {
	section: ServiceSection
	category?: string
	asideTitle: string
	asideBody: string
}) {
	return (
		<section className="section-y">
			<div className="container-shell">
				<div className="reveal grid grid-cols-1 items-start gap-[var(--space-block)] lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)]">
					<div className="max-w-2xl">
						<p className="spec-label">{section.eyebrow}</p>
						<div className="[&_.prose_p]:text-foreground/90 [&_.prose_strong]:text-foreground mt-[var(--space-stack)] [&_.prose]:max-w-none [&_.prose_p]:text-[length:var(--type-lead)] [&_.prose_p]:leading-[1.55]">
							<MarkdownContent content={section.lead} demoteH1 />
						</div>
					</div>
					<aside className="surface-panel panel-inset border-border self-stretch lg:mt-10">
						<p className="spec-label">{category?.trim() || "Local service"}</p>
						<p className="type-subtitle mt-3 text-[1.125rem]">{asideTitle}</p>
						<p className="text-muted-foreground mt-3 text-sm leading-relaxed">
							{asideBody}
						</p>
					</aside>
				</div>
			</div>
		</section>
	)
}

/** Leads this short sit under the heading; longer ones open the body. */
const SHORT_LEAD_CHARS = 260

/**
 * Every band shares one composition: eyebrow, heading, and a short lead in a
 * sticky left column, and the list, steps, FAQ, or prose on the right. Wide
 * screens use the full row instead of a heading over a half-empty grid.
 */
function SplitBand({
	section,
	index,
	children,
}: {
	section: ServiceSection
	index: number
	children?: ReactNode
}) {
	const lead = section.lead.trim()
	const leadInHead = lead && lead.length <= SHORT_LEAD_CHARS
	const leadInBody = lead && !leadInHead

	return (
		<section className={cn("section-y", surfaceFor(index))}>
			<div className="container-shell band-split">
				<div className="band-split-head section-head reveal">
					<p className="spec-label">{section.eyebrow}</p>
					{section.heading ? (
						<h2 className="type-title">{section.heading}</h2>
					) : null}
					{leadInHead ? (
						<MarkdownContent
							className="text-muted-foreground text-base leading-relaxed [&_h3]:mt-4 [&_h3]:text-base [&_p]:text-[inherit]"
							content={lead}
							demoteH1
						/>
					) : null}
				</div>
				<div className="reveal flex min-w-0 flex-col gap-[var(--space-block)]">
					{leadInBody ? (
						<div className="max-w-3xl">
							<MarkdownContent content={lead} demoteH1 />
						</div>
					) : null}
					{children}
				</div>
			</div>
		</section>
	)
}

function BodyProse({ content }: { content: string }) {
	return (
		<div className="max-w-3xl">
			<MarkdownContent content={content} demoteH1 />
		</div>
	)
}

function SignsBand({
	section,
	index,
}: {
	section: ServiceSection
	index: number
}) {
	return (
		<SplitBand index={index} section={section}>
			{section.bullets.length ? (
				<BulletGrid items={section.bullets} tone="warning" />
			) : null}
			{section.body ? <BodyProse content={section.body} /> : null}
		</SplitBand>
	)
}

function ProcessBand({
	section,
	index,
}: {
	section: ServiceSection
	index: number
}) {
	return (
		<SplitBand index={index} section={section}>
			{section.steps.length ? (
				<ProcessSteps steps={section.steps} />
			) : section.bullets.length ? (
				<BulletGrid items={section.bullets} />
			) : section.body ? (
				<BodyProse content={section.body} />
			) : null}
		</SplitBand>
	)
}

function TimelineBand({
	section,
	index,
}: {
	section: ServiceSection
	index: number
}) {
	return (
		<section className={cn("section-y", surfaceFor(index))}>
			<div className="container-shell">
				<div className="reveal grid grid-cols-1 gap-[var(--space-block)] [overflow-wrap:anywhere] lg:grid-cols-[minmax(14rem,0.85fr)_minmax(0,1.15fr)] lg:items-start">
					<div className="section-head max-w-md">
						<p className="spec-label">{section.eyebrow}</p>
						<h2 className="type-title">{section.heading}</h2>
					</div>
					<div className="surface-float border-border min-w-0 p-[var(--space-card)] px-[min(var(--space-card),24px)] [overflow-wrap:anywhere] sm:p-8 sm:px-[min(2rem,32px)]">
						{section.bullets.length ? (
							<ul className="grid gap-4">
								{section.bullets.map((item) => (
									<li
										className="border-border flex items-start gap-[min(0.75rem,12px)] border-b pb-4 text-sm font-bold last:border-0 last:pb-0"
										key={item.text}
									>
										<span className="bg-accent text-accent-foreground mt-0.5 grid size-[min(1.75rem,28px)] shrink-0 place-items-center rounded-md">
											<Check
												aria-hidden="true"
												className="size-[min(0.875rem,14px)]"
											/>
										</span>
										<BulletText item={item} />
									</li>
								))}
							</ul>
						) : (
							<MarkdownContent
								content={section.lead || section.body}
								demoteH1
							/>
						)}
						{section.body && section.bullets.length ? (
							<div className="mt-6">
								<MarkdownContent content={section.body} demoteH1 />
							</div>
						) : null}
					</div>
				</div>
			</div>
		</section>
	)
}

function TipsBand({
	section,
	index,
}: {
	section: ServiceSection
	index: number
}) {
	return (
		<SplitBand index={index} section={section}>
			{section.bullets.length ? (
				<ol className="panel-grid grid gap-[var(--space-grid)]">
					{section.bullets.map((item, itemIndex) => (
						<li
							className="surface-panel panel-inset flex items-start gap-[min(0.75rem,12px)]"
							key={item.text}
						>
							<span className="text-primary shrink-0 font-mono text-[0.75rem] font-bold tracking-[0.12em]">
								{String(itemIndex + 1).padStart(2, "0")}
							</span>
							<BulletText className="text-sm font-bold" item={item} />
						</li>
					))}
				</ol>
			) : null}
			{section.body ? <BodyProse content={section.body} /> : null}
		</SplitBand>
	)
}

function FaqBand({
	section,
	index,
}: {
	section: ServiceSection
	index: number
}) {
	if (!section.faqs.length) {
		return <ProseBand index={index} section={section} />
	}

	return (
		<SplitBand index={index} section={section}>
			<HomeFaq faqs={section.faqs} />
			{section.body ? <BodyProse content={section.body} /> : null}
		</SplitBand>
	)
}

function ProseBand({
	section,
	index,
}: {
	section: ServiceSection
	index: number
}) {
	if (!section.body && !section.lead && !section.bullets.length) return null

	return (
		<SplitBand index={index} section={section}>
			{section.bullets.length ? <BulletGrid items={section.bullets} /> : null}
			{section.body ? <BodyProse content={section.body} /> : null}
		</SplitBand>
	)
}

function renderSection(section: ServiceSection, index: number) {
	switch (section.kind) {
		case "signs":
			return <SignsBand index={index} key={section.heading} section={section} />
		case "process":
			return (
				<ProcessBand index={index} key={section.heading} section={section} />
			)
		case "timeline":
			return (
				<TimelineBand index={index} key={section.heading} section={section} />
			)
		case "tips":
			return <TipsBand index={index} key={section.heading} section={section} />
		case "faq":
			return <FaqBand index={index} key={section.heading} section={section} />
		case "causes":
		case "overview":
		case "prose":
			return <ProseBand index={index} key={section.heading} section={section} />
		default:
			return null
	}
}

/**
 * Maps service markdown H2 sections onto homepage-style layouts. Editors keep
 * changing copy in `content/services/*.md`; this component owns the visual
 * composition for each section kind.
 */
export function ServiceContentSections({
	content,
	category,
	asideTitle,
	asideBody,
}: {
	content: string
	category?: string
	asideTitle?: string
	asideBody?: string
}) {
	const { intro, sections } = parseServiceSections(content)

	if (!intro && sections.length === 0) {
		return (
			<section className="section-y">
				<div className="container-shell">
					<div className="reveal max-w-3xl">
						<MarkdownContent content={content} demoteH1 />
					</div>
				</div>
			</section>
		)
	}

	return (
		<>
			{intro ? (
				<IntroBand
					asideBody={
						asideBody ??
						"Clear recommendations before work begins. Licensed local crews, honest options, and a clean finish."
					}
					asideTitle={
						asideTitle ?? "Licensed local work across Santa Cruz County"
					}
					category={category}
					section={intro}
				/>
			) : null}
			{sections.map((section, index) =>
				renderSection(section, intro ? index + 1 : index),
			)}
		</>
	)
}
