import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BadgeCheck } from "@/components/icons"

import { HomeBelowFold } from "@/components/home-below-fold"
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

const HERO_TITLE_STYLE = {
	margin: 0,
	color: "#ffffff",
	fontWeight: 800,
	fontSize: "clamp(3.25rem, 13vw, 9rem)",
	lineHeight: 0.9,
	letterSpacing: "-0.045em",
	fontFamily:
		'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
} as const

export default function HomePage() {
	return (
		<main id="main-content">
			{/*
			  No bitmap in the first viewport: <img> and CSS background-image both
			  become LCP under Chrome and add ~1s+ of Lantern render delay on
			  mobile. The H1 paints with FCP (~0.9s) for Perf 100. Field photography
			  lives in the below-fold specialty / gallery sections.
			*/}
			<style>{`
				.hero-cinematic[data-lcp] {
					position: relative;
					isolation: isolate;
					overflow: hidden;
					color: #f7f7f5;
					min-height: min(88svh, 52rem);
					display: flex;
					flex-direction: column;
					background-color: #0c0b0a;
					background-image:
						radial-gradient(ellipse 90% 70% at 80% 10%, rgba(196, 122, 58, 0.22), transparent 55%),
						radial-gradient(ellipse 70% 60% at 10% 90%, rgba(196, 122, 58, 0.12), transparent 50%),
						linear-gradient(165deg, #1a1714 0%, #0c0b0a 48%, #14110e 100%);
				}
			`}</style>
			<section className="hero-cinematic" data-lcp="">
				<div
					style={{
						position: "relative",
						zIndex: 2,
						display: "flex",
						flex: 1,
						flexDirection: "column",
						minHeight: "inherit",
					}}
				>
					<div className="container-shell flex items-start justify-between gap-6 pt-8 sm:pt-10">
						<p className="spec-label text-primary-bright">
							Santa Cruz County, CA
						</p>
						<p className="text-on-dark-subtle hidden font-mono text-[0.6875rem] tracking-[0.14em] uppercase sm:block">
							Est. family owned
						</p>
					</div>

					<div className="container-shell mt-auto pb-8 sm:pb-10">
						<h1 className="type-cinematic text-white" style={HERO_TITLE_STYLE}>
							Santa Cruz plumbing
							<br />
							<span className="text-primary-bright">and septic</span>
						</h1>

						<div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
							<p className="type-lead text-on-dark-muted max-w-md">
								Wade&apos;s Plumbing &amp; Septic: no sales pressure, no
								upselling, and clear pricing before work begins from local
								licensed professionals.
							</p>

							<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
								<a
									className={cn(
										buttonVariants({ size: "xl" }),
										"w-full sm:hidden",
									)}
									href={contactInfo.vcardPath}
								>
									Save contact
								</a>
								<a
									className={cn(
										buttonVariants({ size: "xl" }),
										"hidden w-full sm:inline-flex sm:w-auto",
									)}
									href={contactInfo.phoneHref}
								>
									Call {contactInfo.phoneDisplay}
								</a>
								<Link
									className={cn(
										buttonVariants({ variant: "inverse", size: "xl" }),
										"w-full sm:w-auto",
									)}
									href="/services"
									prefetch
								>
									Our Services
									<ArrowRight aria-hidden="true" />
								</Link>
							</div>
						</div>
					</div>

					<div className="border-t border-white/12 bg-black/55">
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
							<span
								aria-hidden="true"
								className="scroll-cue hidden shrink-0 self-center lg:block"
							/>
						</div>
					</div>
				</div>
			</section>

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
