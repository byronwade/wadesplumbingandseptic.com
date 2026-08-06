import { Check, Siren } from "@/components/icons"

import { HomeFaq } from "@/components/home-faq"
import { MarkdownContent } from "@/components/markdown-content"
import {
	parseServiceSections,
	type ServiceSection,
} from "@/lib/service-sections"
import { cn } from "@/lib/utils"

function surfaceFor(index: number) {
	if (index % 3 === 1) return "surface-sunken border-border border-y"
	if (index % 3 === 2) return "border-border bg-card border-y"
}

function SectionChrome({
	eyebrow,
	heading,
	lead,
	align = "start",
}: {
	eyebrow: string
	heading: string
	lead?: string
	align?: "start" | "split"
}) {
	if (align === "split") {
		return (
			<div className="section-head-row reveal">
				<div className="max-w-xl">
					<p className="spec-label">{eyebrow}</p>
					<h2 className="type-title mt-[var(--space-stack)]">{heading}</h2>
				</div>
				{lead ? (
					<div className="max-w-md">
						<MarkdownContent
							className="text-muted-foreground text-base leading-relaxed [&_p]:text-[inherit]"
							content={lead}
							demoteH1
						/>
					</div>
				) : null}
			</div>
		)
	}

	return (
		<div className="section-head reveal max-w-3xl">
			<p className="spec-label">{eyebrow}</p>
			{heading ? <h2 className="type-title">{heading}</h2> : null}
			{lead ? (
				<div className="type-lead text-muted-foreground [&_.prose]:max-w-none [&_.prose]:text-[inherit] [&_.prose_p]:text-[length:inherit] [&_.prose_p]:leading-[inherit]">
					<MarkdownContent content={lead} demoteH1 />
				</div>
			) : null}
		</div>
	)
}

function BulletGrid({
	items,
	tone = "check",
}: {
	items: string[]
	tone?: "check" | "warning"
}) {
	const Icon = tone === "warning" ? Siren : Check
	return (
		<ul className="mt-[var(--space-block)] grid gap-[var(--space-grid)] sm:grid-cols-2">
			{items.map((item) => (
				<li
					className="surface-panel flex items-start gap-3 p-[var(--space-card)] text-sm font-bold"
					key={item}
				>
					<span
						className={cn(
							"mt-0.5 grid size-8 shrink-0 place-items-center rounded-md",
							tone === "warning"
								? "bg-primary/15 text-primary"
								: "bg-accent text-accent-foreground",
						)}
					>
						<Icon aria-hidden="true" className="size-4" />
					</span>
					<span className="leading-snug">{item}</span>
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
		<ol className="mt-[var(--space-block)] grid gap-[var(--space-grid)] lg:grid-cols-3">
			{steps.map((step, index) => (
				<li
					className="surface-panel flex h-full flex-col p-[var(--space-card)]"
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
				<div className="reveal grid items-start gap-[var(--space-block)] lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)]">
					<div className="max-w-2xl">
						<p className="spec-label">{section.eyebrow}</p>
						<div className="[&_.prose_p]:text-foreground/90 [&_.prose_strong]:text-foreground mt-[var(--space-stack)] [&_.prose]:max-w-none [&_.prose_p]:text-[length:var(--type-lead)] [&_.prose_p]:leading-[1.55]">
							<MarkdownContent content={section.lead} demoteH1 />
						</div>
					</div>
					<aside className="surface-panel border-border self-stretch p-[var(--space-card)] lg:mt-10">
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

function SignsBand({
	section,
	index,
}: {
	section: ServiceSection
	index: number
}) {
	return (
		<section className={cn("section-y", surfaceFor(index))}>
			<div className="container-shell">
				<SectionChrome
					align="split"
					eyebrow={section.eyebrow}
					heading={section.heading}
					lead={section.lead || undefined}
				/>
				{section.bullets.length ? (
					<div className="reveal">
						<BulletGrid items={section.bullets} tone="warning" />
					</div>
				) : null}
				{section.body ? (
					<div className="reveal mx-auto mt-[var(--space-block)] max-w-3xl">
						<MarkdownContent content={section.body} demoteH1 />
					</div>
				) : null}
			</div>
		</section>
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
		<section className={cn("section-y", surfaceFor(index))}>
			<div className="container-shell">
				<SectionChrome
					eyebrow={section.eyebrow}
					heading={section.heading}
					lead={section.lead || undefined}
				/>
				{section.steps.length ? (
					<div className="reveal">
						<ProcessSteps steps={section.steps} />
					</div>
				) : section.bullets.length ? (
					<div className="reveal">
						<BulletGrid items={section.bullets} />
					</div>
				) : (
					<div className="reveal mt-[var(--space-block)] max-w-3xl">
						<MarkdownContent content={section.body || section.lead} demoteH1 />
					</div>
				)}
			</div>
		</section>
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
				<div className="reveal grid gap-[var(--space-block)] lg:grid-cols-[minmax(14rem,0.85fr)_minmax(0,1.15fr)] lg:items-start">
					<div className="section-head max-w-md">
						<p className="spec-label">{section.eyebrow}</p>
						<h2 className="type-title">{section.heading}</h2>
					</div>
					<div className="surface-float border-border p-[var(--space-card)] sm:p-8">
						{section.bullets.length ? (
							<ul className="grid gap-4">
								{section.bullets.map((item) => (
									<li
										className="border-border flex items-start gap-3 border-b pb-4 text-sm font-bold last:border-0 last:pb-0"
										key={item}
									>
										<span className="bg-accent text-accent-foreground mt-0.5 grid size-7 shrink-0 place-items-center rounded-md">
											<Check aria-hidden="true" className="size-3.5" />
										</span>
										<span className="leading-snug">{item}</span>
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
		<section className={cn("section-y", surfaceFor(index))}>
			<div className="container-shell">
				<SectionChrome
					align="split"
					eyebrow={section.eyebrow}
					heading={section.heading}
					lead={section.lead || undefined}
				/>
				{section.bullets.length ? (
					<div className="reveal">
						<ol className="mt-[var(--space-block)] grid gap-[var(--space-grid)] sm:grid-cols-2">
							{section.bullets.map((item, itemIndex) => (
								<li
									className="surface-panel flex items-start gap-3 p-[var(--space-card)]"
									key={item}
								>
									<span className="text-primary font-mono text-[0.75rem] font-bold tracking-[0.12em]">
										{String(itemIndex + 1).padStart(2, "0")}
									</span>
									<span className="text-sm leading-snug font-bold">{item}</span>
								</li>
							))}
						</ol>
					</div>
				) : null}
				{section.body ? (
					<div className="reveal mt-[var(--space-block)] max-w-3xl">
						<MarkdownContent content={section.body} demoteH1 />
					</div>
				) : null}
			</div>
		</section>
	)
}

function FaqBand({
	section,
	index,
}: {
	section: ServiceSection
	index: number
}) {
	if (!section.faqs.length) return null

	return (
		<section className={cn("section-y", surfaceFor(index))}>
			<div className="container-shell">
				<div className="section-head-row reveal">
					<div className="max-w-xl">
						<p className="spec-label">{section.eyebrow}</p>
						<h2 className="type-title mt-[var(--space-stack)]">
							{section.heading}
						</h2>
					</div>
					<p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
						Straight answers for Santa Cruz County homeowners before you
						schedule.
					</p>
				</div>
				<div className="reveal mx-auto mt-[var(--space-block)] max-w-3xl">
					<HomeFaq faqs={section.faqs} />
				</div>
			</div>
		</section>
	)
}

function ProseBand({
	section,
	index,
}: {
	section: ServiceSection
	index: number
}) {
	const content = section.body || section.lead
	if (!(content || section.bullets.length)) return null

	return (
		<section className={cn("section-y", surfaceFor(index))}>
			<div className="container-shell">
				<SectionChrome
					align={section.lead || section.bullets.length ? "split" : "start"}
					eyebrow={section.eyebrow}
					heading={section.heading}
					lead={section.lead || undefined}
				/>
				{section.bullets.length ? (
					<div className="reveal">
						<BulletGrid items={section.bullets} />
					</div>
				) : null}
				{section.body || (!section.lead && content) ? (
					<div className="reveal mt-[var(--space-block)] max-w-3xl">
						<MarkdownContent content={section.body || content} demoteH1 />
					</div>
				) : null}
			</div>
		</section>
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
