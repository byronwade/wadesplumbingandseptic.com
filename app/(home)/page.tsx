import type { Metadata } from "next"
import Link from "next/link"
import {
	ArrowRight,
	ArrowUpRight,
	Fire,
	Handshake,
	HardHat,
	Home,
	Pipe,
	ShieldCheck,
	Wallet,
	Wrench,
	type IconComponent,
} from "@/components/icons"

import { CallButton } from "@/components/call-button"
import { HomeBelowFold } from "@/components/home-below-fold"
import { HomeHeroMedia } from "@/components/home-hero-media"
import { JsonLd } from "@/components/json-ld"
import { ProblemFinder } from "@/components/problem-finder"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import {
	faqs,
	heroQuickLinks,
	heroStats,
	proofPoints,
} from "@/lib/home-content"
import { finderProblems, finderSpokes, finderTowns } from "@/lib/problem-finder"
import { buildPageMetadata } from "@/lib/seo"
import { cn } from "@/lib/utils"

export const metadata: Metadata = buildPageMetadata({
	title: "Santa Cruz Plumbing & Septic",
	description:
		"Licensed plumbing and septic for Santa Cruz County. Flat-rate pricing, quoted on site before work begins. Call 831.225.4344.",
	pathname: "/",
	image: "/images/locations/santa-cruz-redwoods.webp",
	eyebrow: "Family owned · Local crew",
})

const quickLinkIcons: Record<
	(typeof heroQuickLinks)[number]["icon"],
	IconComponent
> = {
	pipe: Pipe,
	fire: Fire,
	wrench: Wrench,
	hardhat: HardHat,
}

const proofIcons: Record<(typeof proofPoints)[number]["icon"], IconComponent> =
	{
		shield: ShieldCheck,
		home: Home,
		wallet: Wallet,
		handshake: Handshake,
	}

export default function HomePage() {
	return (
		<main id="main-content">
			{/*
			  Cinematic frame. Full-bleed work photograph sized to the visible
			  viewport, with the headline set at --type-cinematic and anchored low so
			  the picture carries the top of the frame and the type carries the
			  bottom. Structure follows the pattern used by Lightship and Locomotive:
			  minimal chrome, one oversized statement, credentials pinned to the
			  bottom edge as a hairline bar.

			  The photograph is the argument here, so it is not boxed or reduced to
			  texture. It holds still: one flat scrim keeps the type legible.
			*/}
			<section className="hero-cinematic">
				<div className="absolute inset-0 -z-20">
					<div className="relative size-full">
						<HomeHeroMedia />
					</div>
				</div>

				{/* Top line: where we are. */}
				<div className="container-shell relative flex items-start justify-between gap-6 pt-8 sm:pt-10">
					<p className="spec-label text-on-dark-muted">Santa Cruz County, CA</p>
					<p className="text-on-dark-subtle hidden text-xs sm:block">
						Est. 2021 · Family owned
					</p>
				</div>

				<div className="container-shell relative mt-auto pt-10 pb-8 sm:pb-10">
					{/*
					  Title and lead paint immediately. Entrance motion on first-screen
					  copy delayed LCP under mobile Lighthouse (~2s element render delay).
					*/}
					<h1 className="type-cinematic text-on-dark">
						Santa Cruz plumbing <br />
						<span className="text-primary-bright">and septic</span>
					</h1>

					<div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
						<p className="type-lead text-on-dark-muted max-w-md">
							Wade&apos;s Plumbing &amp; Septic: no sales pressure, no
							upselling, and local licensed professionals. Flat-rate pricing,
							quoted on site before work begins.
						</p>

						<div className="motion-rise flex min-w-0 flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center lg:shrink-0">
							<CallButton
								className="w-full sm:w-auto"
								desktopLabel={`Call ${contactInfo.phoneDisplay}`}
								size="xl"
							/>
							<Link
								prefetch={false}
								className={cn(
									buttonVariants({
										variant: "inverse",
										size: "xl",
										wrap: true,
									}),
									"w-full sm:w-auto",
								)}
								href="/services"
							>
								Our Services
								<ArrowRight aria-hidden="true" />
							</Link>
						</div>
					</div>

					{/*
					  Intent shortcuts. Most visitors arrive with one job in mind, so
					  the four common ones are a tap away from the first screen rather
					  than behind the menu. Solid tint, no backdrop blur: blur over the
					  photo would repaint every scroll frame.
					*/}
					<nav
						aria-label="Popular services"
						className="mt-8 grid grid-cols-2 gap-2 sm:mt-10 sm:gap-3 lg:grid-cols-4"
					>
						{heroQuickLinks.map(({ label, detail, href, icon }) => {
							const Icon = quickLinkIcons[icon]
							return (
								<Link
									prefetch={false}
									className="hero-pick group"
									href={href}
									key={href}
								>
									<Icon
										aria-hidden="true"
										className="text-primary-bright size-6 shrink-0 sm:size-7"
									/>
									<span className="min-w-0">
										<span className="text-on-dark block text-[0.9375rem] leading-tight font-semibold sm:text-base">
											{label}
										</span>
										<span className="text-on-dark-subtle mt-1 hidden text-[0.8125rem] leading-snug sm:block">
											{detail}
										</span>
									</span>
									<ArrowUpRight
										aria-hidden="true"
										className="text-on-dark-subtle group-hover:text-on-dark ml-auto size-4 shrink-0 self-start transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
									/>
								</Link>
							)
						})}
					</nav>
				</div>

				{/*
				  Credential bar on the bottom edge. Keeps the licence numbers in the
				  first frame without adding another row of chips, and gives the
				  photograph a hard bottom rule to sit on.
				*/}
				<div className="relative bg-black/55 shadow-[inset_0_1px_0_oklch(1_0_0/0.1)]">
					<div className="container-shell flex items-center justify-between gap-6 py-3.5">
						<dl className="flex flex-wrap items-center gap-x-7 gap-y-1.5">
							{heroStats.map(({ label, value }) => (
								<div className="flex items-baseline gap-2" key={label}>
									<dt className="text-on-dark-subtle text-xs">{label}</dt>
									<dd className="text-on-dark font-mono text-[0.8125rem] font-medium tabular-nums">
										{value}
									</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</section>

			{/*
			  Proof bar. Four confirmed facts, each with a copper mark and a one-line
			  detail, so the strip carries evidence rather than a row of slogans.
			  Spacing separates the columns; there are no dividing lines.
			*/}
			<section
				aria-label="Why homeowners call Wade's"
				className="bg-card border-border border-b"
			>
				<ul className="container-shell proof-bar">
					{proofPoints.map(({ title, detail, icon }) => {
						const Icon = proofIcons[icon]
						return (
							<li className="flex min-w-0 items-start gap-3" key={title}>
								<Icon
									aria-hidden="true"
									className="text-primary mt-0.5 size-5 shrink-0"
								/>
								<span className="min-w-0">
									<span className="block text-[0.9375rem] leading-tight font-semibold tracking-[-0.01em]">
										{title}
									</span>
									<span className="text-muted-foreground mt-1 block text-[0.8125rem] leading-snug">
										{detail}
									</span>
								</span>
							</li>
						)
					})}
				</ul>
			</section>

			<ProblemFinder
				problems={finderProblems}
				spokes={finderSpokes}
				towns={finderTowns}
			/>

			<HomeBelowFold />
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "FAQPage",
					mainEntity: faqs.map((faq) => ({
						"@type": "Question",
						name: faq.question,
						acceptedAnswer: {
							"@type": "Answer",
							text: faq.answer,
						},
					})),
				}}
			/>
		</main>
	)
}
