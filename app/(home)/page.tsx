import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BadgeCheck } from "@/components/icons"

import { CallButton } from "@/components/call-button"
import { HomeBelowFold } from "@/components/home-below-fold"
import { HomeHeroMedia } from "@/components/home-hero-media"
import { JsonLd } from "@/components/json-ld"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { faqs, heroStats, trustPoints } from "@/lib/home-content"
import { buildPageMetadata } from "@/lib/seo"
import { cn } from "@/lib/utils"

export const metadata: Metadata = buildPageMetadata({
	title: "Santa Cruz Plumbing & Septic",
	description:
		"Licensed plumbing and septic for Santa Cruz County. Clear pricing, no upselling. Call 831.225.4344.",
	pathname: "/",
	image: "/images/locations/santa-cruz-redwoods.webp",
	eyebrow: "Family owned · Local crew",
})

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

			  The photograph is the argument here, so it is not boxed, tinted, or
			  reduced to texture. Only motion in the band is the slow drift on the
			  frame itself.
			*/}
			<section className="hero-cinematic">
				<div className="absolute inset-0 -z-20">
					<div className="media-drift relative size-full">
						<HomeHeroMedia />
					</div>
				</div>

				{/* Top line: where we are, and the scroll cue's counterpart. */}
				<div className="container-shell relative flex items-start justify-between gap-6 pt-8 sm:pt-10">
					<p className="spec-label motion-fade text-primary-bright">
						Santa Cruz County, CA
					</p>
					<p className="text-on-dark-subtle motion-fade hidden font-mono text-[0.6875rem] tracking-[0.14em] uppercase sm:block">
						Est. family owned
					</p>
				</div>

				<div className="container-shell relative mt-auto pb-8 sm:pb-10">
					<h1 className="type-cinematic motion-rise text-white">
						Santa Cruz plumbing
						<br />
						<span className="text-primary-bright">and septic</span>
					</h1>

					<div className="motion-rise motion-delay-1 mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
						<p className="type-lead text-on-dark-muted max-w-md">
							Wade&apos;s Plumbing &amp; Septic: no sales pressure, no
							upselling, and clear pricing before work begins from local
							licensed professionals.
						</p>

						<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
							<CallButton
								className="w-full sm:w-auto"
								desktopLabel={`Call ${contactInfo.phoneDisplay}`}
								size="xl"
							/>
							<Link prefetch={false}
								className={cn(
									buttonVariants({ variant: "inverse", size: "xl" }),
									"w-full sm:w-auto",
								)}
								href="/services"

							>
								Our Services
								<ArrowRight aria-hidden="true" />
							</Link>
						</div>
					</div>
				</div>

				{/*
				  Credential bar on the bottom edge. Keeps the licence numbers in the
				  first frame without adding another row of chips, and gives the
				  photograph a hard bottom rule to sit on.
				*/}
				<div className="relative border-t border-white/12 bg-black/55">
					<div className="container-shell flex items-center justify-between gap-6 py-3.5">
						<dl className="flex flex-wrap items-center gap-x-7 gap-y-1.5">
							{heroStats.map(({ label, value }) => (
								<div className="flex items-baseline gap-2" key={label}>
									<dt className="text-on-dark-subtle font-mono text-[0.625rem] tracking-[0.16em] uppercase">
										{label}
									</dt>
									<dd className="text-[0.8125rem] font-bold text-white">
										{value}
									</dd>
								</div>
							))}
						</dl>
						{/* Centred in the bar, not hanging below it, where overflow: clip
						    cut it off and it read as a stray hairline. */}
						<span
							aria-hidden="true"
							className="scroll-cue hidden shrink-0 self-center lg:block"
						/>
					</div>
				</div>
			</section>

			{/*
			  Trust strip. Every item is left-aligned in its own column so the four
			  labels share a baseline grid; centring each item individually made the
			  row read ragged at the two-column breakpoint.
			*/}
			<section className="border-border bg-card border-b">
				<ul className="container-shell grid grid-cols-1 gap-x-8 gap-y-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
					{trustPoints.map((item) => (
						<li
							className="text-muted-foreground flex items-center gap-2.5 text-sm font-bold"
							key={item}
						>
							<BadgeCheck
								className="text-primary size-4 shrink-0"
								aria-hidden="true"
							/>
							{item}
						</li>
					))}
				</ul>
			</section>

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
