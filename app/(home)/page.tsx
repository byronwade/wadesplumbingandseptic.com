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
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import {
	faqs,
	heroQuickLinks,
	heroStats,
	proofPoints,
} from "@/lib/home-content"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"
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
			  Split hero. Wide capitals on a deep navy field carry the statement on
			  the left; the work photograph sits on the right as a framed card with
			  the licence badge pinned to it. Intent shortcuts and the credential
			  bar sit underneath so the first screen answers what, where and who.
			*/}
			<section className="hero-split">
				<div className="container-shell relative grid grid-cols-[minmax(0,1fr)] items-center gap-10 pt-10 pb-10 sm:pt-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-14 lg:pt-16 lg:pb-14">
					<div className="min-w-0">
						<p className="hero-chip">
							<span aria-hidden="true" className="hero-chip-dot" />
							Family owned · Since 2021
						</p>
						{/*
						  Title and lead paint immediately. Entrance motion on first-screen
						  copy delayed LCP under mobile Lighthouse (~2s element render delay).
						*/}
						<h1 className="type-cinematic mt-6 text-white">
							Santa Cruz <br />
							plumbing <br />
							<span className="hero-accent">and septic</span>
						</h1>

						<p className="type-lead text-on-dark-muted mt-7 max-w-xl">
							Wade&apos;s Plumbing &amp; Septic: no sales pressure, no
							upselling, and local licensed professionals. Flat-rate pricing,
							quoted on site before work begins.
						</p>

						<div className="motion-rise mt-8 flex min-w-0 flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center">
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

					<div className="hero-frame">
						<HomeHeroMedia />
						<div className="hero-badge">
							<ShieldCheck
								aria-hidden="true"
								className="text-primary size-7 shrink-0"
							/>
							<span className="min-w-0">
								<span className="block text-sm leading-tight font-bold">
									Licensed &amp; insured
								</span>
								<span className="text-muted-foreground mt-0.5 block text-[0.8125rem] leading-snug">
									CSLB #{siteConfig.licenseNumber}
								</span>
							</span>
						</div>
					</div>
				</div>

				<div className="container-shell relative pb-10 sm:pb-12">
					{/*
					  Intent shortcuts. Most visitors arrive with one job in mind, so
					  the four common ones are a tap away from the first screen rather
					  than behind the menu.
					*/}
					<nav
						aria-label="Popular services"
						className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4"
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
									<span className="hero-pick-icon">
										<Icon aria-hidden="true" className="size-5 sm:size-6" />
									</span>
									<span className="min-w-0">
										<span className="block text-[0.9375rem] leading-tight font-bold text-white sm:text-base">
											{label}
										</span>
										<span className="text-on-dark-subtle mt-1 hidden text-[0.8125rem] leading-snug sm:block">
											{detail}
										</span>
									</span>
									<ArrowUpRight
										aria-hidden="true"
										className="text-on-dark-subtle ml-auto size-4 shrink-0 self-start transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
									/>
								</Link>
							)
						})}
					</nav>
				</div>

				{/* Credential bar on the bottom edge. */}
				<div className="relative border-t border-white/10 bg-black/25">
					<div className="container-shell py-3.5">
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
					</div>
				</div>
			</section>

			{/*
			  Proof bar. Four confirmed facts, each with an icon tile and a one-line
			  detail, so the strip carries evidence rather than a row of slogans.
			  Columns are divided by hairlines from lg up and stack in pairs below.
			*/}
			<section
				aria-label="Why homeowners call Wade's"
				className="bg-card border-border border-b"
			>
				<ul className="container-shell proof-bar">
					{proofPoints.map(({ title, detail, icon }) => {
						const Icon = proofIcons[icon]
						return (
							<li className="flex min-w-0 items-center gap-3.5" key={title}>
								<span className="bg-accent text-accent-foreground grid size-11 shrink-0 place-items-center rounded-lg">
									<Icon aria-hidden="true" className="size-5.5" />
								</span>
								<span className="min-w-0">
									<span className="block text-[0.9375rem] leading-tight font-bold tracking-[-0.01em]">
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
