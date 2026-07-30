import type { Metadata } from "next"
import Image, { getImageProps } from "next/image"
import Link from "next/link"
import {
	ArrowRight,
	BadgeCheck,
	Check,
	Droplets,
	Gauge,
	Home,
	Phone,
	ShieldCheck,
	Wrench,
} from "@/components/icons"

import { ContactCta } from "@/components/contact-cta"
import { HomeFaq } from "@/components/home-faq"
import { JsonLd } from "@/components/json-ld"
import { buttonVariants } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export const metadata: Metadata = buildPageMetadata({
	title: "Santa Cruz Plumbing & Septic",
	description:
		"Licensed plumbing and engineered septic service in Santa Cruz County and selected Santa Clara County communities. Clear pricing, no upselling. Call 831.225.4344.",
	pathname: "/",
	image: "/images/locations/santa-cruz-plumber.webp",
})

const serviceGroups = [
	{
		title: "Residential Plumbing",
		image: "/images/work/precision-valve-installation.webp",
		description:
			"Repairs and installations completed cleanly, honestly, and to code.",
		items: [
			"Leak detection & repair",
			"Fixture installation & repair",
			"Pipe replacement & repiping",
			"Drain cleaning & unclogging",
		],
	},
	{
		title: "Commercial Plumbing",
		image: "/images/work/commercial-plumbing-installation.webp",
		description:
			"Dependable commercial service that keeps your property operating.",
		items: [
			"Commercial water heaters",
			"Backflow prevention",
			"Code compliance updates",
			"Restaurant & kitchen plumbing",
		],
	},
	{
		title: "New Construction",
		image: "/images/work/new-construction-rough-in.webp",
		description:
			"Code-compliant plumbing planned from rough-in through final testing.",
		items: [
			"Plumbing system design",
			"Rough-in plumbing",
			"Fixture installation",
			"Final inspections & testing",
		],
	},
]

const workGallery = [
	{
		src: "/images/work/engineered-retaining-wall.webp",
		alt: "Engineered septic retaining wall and control panel in Santa Cruz County",
		caption: "Engineered retaining wall and control panel",
	},
	{
		src: "/images/work/multi-tank-excavation.webp",
		alt: "Multi-tank septic excavation underway on a hillside property",
		caption: "Multi-tank excavation in progress",
	},
	{
		src: "/images/work/completed-multi-tank.webp",
		alt: "Completed multi-tank engineered septic installation",
		caption: "Completed multi-tank installation",
	},
	{
		src: "/images/work/advanced-septic-control-panel.webp",
		alt: "Advanced septic control panel and system access points",
		caption: "Advanced septic control system",
	},
] as const

const trustedBrands = [
	{ src: "/images/partners/bradfordwhite.webp", alt: "Bradford White" },
	{ src: "/images/partners/navien.webp", alt: "Navien" },
	{ src: "/images/partners/kohler.webp", alt: "Kohler" },
	{ src: "/images/partners/grohe.webp", alt: "Grohe" },
	{ src: "/images/partners/grundfos.webp", alt: "Grundfos" },
] as const

const heroStats = [
	{ label: "Licensed", value: "CA CSLB #1087260" },
	{ label: "Local rating", value: "4.9 out of 5" },
	{ label: "Office hours", value: "Mon to Fri, 9 to 5" },
] as const

const trustPoints = [
	"Family owned & operated",
	"Licensed & insured",
	"Satisfaction guaranteed",
	"4.9 local rating",
] as const

const specialtyPoints = [
	{
		icon: ShieldCheck,
		title: "Licensed & code-compliant",
		text: "Properly planned and permitted for the property.",
	},
	{
		icon: Home,
		title: "Family-owned & local",
		text: "Not a franchise. We know these counties and codes.",
	},
	{
		icon: Gauge,
		title: "Advanced ATU systems",
		text: "For sites conventional contractors turn down.",
	},
	{
		icon: Droplets,
		title: "Free site consultations",
		text: "We tell you what can work before money changes hands.",
	},
] as const

const reasons = [
	["No-pressure advice", "Only the work your property needs."],
	["Transparent pricing", "Clear pricing before work begins."],
	["Clean workmanship", "Respectful service and a clean finish."],
	["Long-term reliability", "Repairs and systems designed to last."],
] as const

const testimonials = [
	[
		"As a real estate professional, I love working with Wade’s Plumbing. They are courteous, professional, and always make sure my clients are taken care of.",
		"Bailey Cotrona",
	],
	[
		"They know their stuff, do great work, and are a pleasure to work with. They made me feel comfortable with a terrible situation that shut down my house.",
		"Aaron Berger",
	],
] as const

const faqs = [
	{
		question: "How often should I have my septic tank pumped?",
		answer:
			"Most septic tanks should be pumped every 3 to 5 years, depending on household size, wastewater volume, and tank size. We recommend a professional inspection to determine the right schedule for your system.",
	},
	{
		question: "What are the signs of a failing septic system?",
		answer:
			"Warning signs include slow drains, gurgling sounds, sewage backups, soggy areas around the drain field, unusually lush grass, strong odors, and contaminated well water.",
	},
	{
		question: "What should I do if I have a water leak?",
		answer:
			"Shut off water at the nearest fixture valve or the main valve, keep electricity away from affected areas, and call us promptly for a professional repair.",
	},
	{
		question: "How long does a water heater typically last?",
		answer:
			"Conventional tank water heaters commonly last 8 to 12 years, while tankless models can last 15 to 20 years or longer with proper maintenance.",
	},
	{
		question: "What areas do you serve?",
		answer:
			"We serve Santa Cruz County and selected Santa Clara County communities in California. Call us if you are unsure whether a specific address is inside the current service area.",
	},
]

/*
 * Art direction for the cinematic frame. The viewport is landscape on desktop
 * and portrait on a phone, so the two orientations get different photographs
 * rather than one image cropped badly at both ends.
 *
 * Desktop is the blue-hour rough-in: 1280px wide against a 1440px band, so it
 * upscales ~1.1x and stays sharp. The old pairing had this backwards, serving a
 * 768x1024 portrait to desktop (a 1.9x upscale) and a 640x400 landscape to
 * phones.
 *
 * One alt for both sources, since <picture> has a single <img>: it has to be
 * true of whichever photograph is served.
 */
const HERO_SIZES = "100vw"

function HomeHeroMedia() {
	const common = {
		alt: "Recent Wade's Plumbing & Septic work on a Santa Cruz County property",
		sizes: HERO_SIZES,
	} as const

	const {
		props: { srcSet: desktop },
	} = getImageProps({
		...common,
		width: 1280,
		height: 961,
		quality: 74,
		src: "/images/team/byron-working.webp",
	})

	const {
		props: { srcSet: portrait, ...rest },
	} = getImageProps({
		...common,
		width: 768,
		height: 1024,
		quality: 70,
		src: "/images/work/engineered-septic-hero.webp",
	})

	return (
		<picture>
			<source media="(min-width: 640px)" srcSet={desktop} sizes={HERO_SIZES} />
			<img
				{...rest}
				srcSet={portrait}
				alt={common.alt}
				className="absolute inset-0 size-full object-cover object-[50%_62%]"
				decoding="async"
				fetchPriority="high"
			/>
		</picture>
	)
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
							<a
								className={cn(
									buttonVariants({ size: "xl" }),
									"w-full sm:w-auto",
								)}
								href={siteConfig.phoneHref}
							>
								<Phone aria-hidden="true" />
								Call {siteConfig.phone}
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

				{/*
				  Credential bar on the bottom edge. Keeps the licence numbers in the
				  first frame without adding another row of chips, and gives the
				  photograph a hard bottom rule to sit on.
				*/}
				<div className="relative border-t border-white/12 bg-black/35 backdrop-blur-sm">
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

			<section className="section-y">
				<div className="container-shell">
					<div className="section-head reveal mx-auto max-w-2xl text-center">
						<p className="spec-label spec-label-center">Our core specialty</p>
						<h2 className="type-title">
							Engineered <span className="text-primary">septic systems</span>
						</h2>
						<p className="type-lead">
							When a standard system will not work (steep slopes, difficult
							soil, tight lots, or sensitive environments), that is exactly
							where we excel.
						</p>
					</div>

					{/*
					  items-stretch, not items-center: with the image vertically centred
					  against a taller card column its top and bottom edges lined up with
					  nothing on the left.
					*/}
					<div className="reveal mt-[var(--space-block)] grid items-stretch gap-[var(--space-grid)] lg:grid-cols-2">
						<div className="grid content-start gap-[var(--space-grid)] sm:grid-cols-2">
							{specialtyPoints.map(({ icon: Icon, title, text }) => (
								<div
									className="surface-panel p-[var(--space-card)]"
									key={title}
								>
									<span className="bg-accent text-accent-foreground grid size-10 place-items-center rounded-md">
										<Icon className="size-5" aria-hidden="true" />
									</span>
									<h3 className="type-subtitle mt-4 text-[1.0625rem]">
										{title}
									</h3>
									<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
										{text}
									</p>
								</div>
							))}
							<div className="flex w-full flex-col gap-3 sm:col-span-2 sm:flex-row">
								<a
									className={cn(
										buttonVariants({ size: "xl" }),
										"w-full sm:w-auto",
									)}
									href={siteConfig.phoneHref}
								>
									<Phone aria-hidden="true" />
									Call to schedule: {siteConfig.phone}
								</a>
								<Link
									className={cn(
										buttonVariants({ variant: "outline", size: "xl" }),
										"w-full sm:w-auto",
									)}
									href="/service-offerings/engineered-septic-system-installation"
									prefetch
								>
									Engineered Septic Services
								</Link>
							</div>
						</div>
						{/*
						  The spec-plate treatment lives here now that the hero is a
						  full-bleed frame. A captioned, framed photo still earns its place
						  next to the capability list, where it reads as evidence for the
						  claims beside it.
						*/}
						<figure className="surface-panel flex flex-col overflow-hidden p-2">
							<div className="bg-muted relative aspect-4/3 overflow-hidden rounded-md lg:aspect-auto lg:min-h-[24rem] lg:flex-1">
								<Image
									alt="Completed three-tank septic system installation on a hillside property"
									className="object-cover"
									fill
									quality={70}
									sizes="(min-width: 1024px) 45vw, 100vw"
									src="/images/work/completed-multi-tank.webp"
								/>
								<span className="bg-ink/80 absolute top-3 left-3 rounded-md px-2.5 py-1.5 font-mono text-[0.625rem] tracking-[0.14em] text-white uppercase backdrop-blur-sm">
									Engineered ATU
								</span>
							</div>
							<figcaption className="flex items-end justify-between gap-4 px-2 pt-3 pb-1">
								<span className="text-[0.8125rem] leading-snug font-bold">
									Three-tank engineered septic system
									<span className="text-muted-foreground block font-normal">
										Hillside property, Santa Cruz Mountains
									</span>
								</span>
								<Link
									className="text-primary inline-flex shrink-0 items-center gap-1.5 text-[0.8125rem] font-bold"
									href="/service-category/septic"
									prefetch
								>
									Septic work
									<ArrowRight aria-hidden="true" className="size-3.5" />
								</Link>
							</figcaption>
						</figure>
					</div>
				</div>
			</section>

			<section className="surface-hero tex-grid section-y overflow-hidden">
				<div className="container-shell">
					<div className="section-head-row reveal">
						<div className="section-head max-w-2xl">
							<p className="spec-label">Project gallery</p>
							<h2 className="type-title text-white">
								Real work from the Wade&apos;s team.
							</h2>
							<p className="type-lead text-on-dark-muted">
								Engineered septic installations, excavation, controls, and
								finished systems completed on challenging Santa Cruz County
								properties.
							</p>
						</div>
						<Link
							className={cn(
								buttonVariants({ variant: "inverse", size: "lg" }),
								"w-full shrink-0 sm:w-auto",
							)}
							href="/contact"
							prefetch
						>
							Discuss your project
							<ArrowRight aria-hidden="true" />
						</Link>
					</div>
					<div className="snap-rail mt-[var(--space-block)]">
						{workGallery.map((image) => (
							<figure key={image.src}>
								<div className="bg-panel-elevated relative aspect-4/5 overflow-hidden rounded-lg">
									<Image
										alt={image.alt}
										className="object-cover"
										fill
										quality={65}
										sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
										src={image.src}
									/>
								</div>
								<figcaption className="text-on-dark-subtle mt-3 text-sm font-bold">
									{image.caption}
								</figcaption>
							</figure>
						))}
					</div>
				</div>
			</section>

			<section className="section-y surface-sunken">
				<div className="container-shell">
					<div className="section-head-row reveal">
						<div className="section-head max-w-2xl">
							<p className="spec-label">What we do</p>
							<h2 className="type-title">Plumbing &amp; septic services</h2>
							<p className="type-lead">
								From routine maintenance to complex installations, our licensed
								team handles it cleanly, honestly, and on time.
							</p>
						</div>
						<Link
							className={cn(
								buttonVariants({ variant: "outline", size: "lg" }),
								"w-full shrink-0 sm:w-auto",
							)}
							href="/services"
							prefetch
						>
							View all services
							<ArrowRight aria-hidden="true" />
						</Link>
					</div>

					<div className="card-rail mt-[var(--space-block)]">
						{serviceGroups.map((group) => (
							<Card className="reveal h-full overflow-hidden" key={group.title}>
								<div className="bg-muted relative aspect-16/10">
									<Image
										alt={group.title}
										className="object-cover"
										fill
										quality={65}
										sizes="(min-width: 1024px) 33vw, 100vw"
										src={group.image}
									/>
								</div>
								<CardHeader>
									<CardTitle>{group.title}</CardTitle>
									<CardDescription>{group.description}</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="text-muted-foreground space-y-2 text-sm">
										{group.items.map((item) => (
											<li className="flex items-start gap-2" key={item}>
												<Check
													className="text-primary mt-0.5 size-4 shrink-0"
													aria-hidden="true"
												/>
												{item}
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section className="border-border bg-card section-y-tight border-y">
				<div className="container-shell">
					<p className="spec-label spec-label-center">
						Experienced with leading equipment brands
					</p>
					<div className="mt-10 grid grid-cols-2 items-center gap-x-10 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
						{trustedBrands.map((brand) => (
							<div
								className="relative mx-auto h-12 w-full max-w-36 opacity-70 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0"
								key={brand.src}
							>
								<Image
									alt={brand.alt}
									className="object-contain"
									fill
									quality={80}
									sizes="144px"
									src={brand.src}
								/>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="section-y">
				<div className="container-shell grid items-start gap-[var(--space-block)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
					<div>
						<div className="section-head">
							<p className="spec-label">Why choose Wade&apos;s</p>
							<h2 className="type-title">
								Real people. Honest recommendations.
							</h2>
							<p className="type-lead">
								We are not corporate plumbers trying to hit an upsell quota. We
								explain the issue, show you practical options, and do quality
								work at a fair price.
							</p>
						</div>
						<div className="mt-[var(--space-block)] grid gap-[var(--space-grid)] sm:grid-cols-2">
							{reasons.map(([title, text]) => (
								<div
									className="surface-panel p-[var(--space-card)]"
									key={title}
								>
									<Wrench className="text-primary size-5" aria-hidden="true" />
									<h3 className="mt-3 font-bold tracking-[-0.02em]">{title}</h3>
									<p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
										{text}
									</p>
								</div>
							))}
						</div>
					</div>

					<div className="surface-float relative overflow-hidden rounded-xl p-7 sm:p-9">
						<p className="spec-label">Real people, real results</p>
						<div className="mt-8 space-y-7">
							{testimonials.map(([quote, person]) => (
								<blockquote
									className="border-b border-white/10 pb-7 last:border-0 last:pb-0"
									key={person}
								>
									<p
										className="text-primary-bright text-sm tracking-[0.2em]"
										aria-label="Rated 5 out of 5"
									>
										★★★★★
									</p>
									<p className="mt-3 text-[1.0625rem] leading-relaxed text-pretty text-white">
										“{quote}”
									</p>
									<footer className="text-on-dark-subtle mt-3 text-sm font-bold">
										{person}
									</footer>
								</blockquote>
							))}
						</div>
						<Link
							className={cn(
								buttonVariants({ variant: "inverse", size: "lg" }),
								"mt-8 w-full sm:w-auto",
							)}
							href="/testimonials"
							prefetch
						>
							Read customer stories
							<ArrowRight aria-hidden="true" />
						</Link>
					</div>
				</div>
			</section>

			<section className="section-y border-border surface-sunken border-y">
				<div className="container-shell grid items-start gap-[var(--space-block)] lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
					<div className="section-head">
						<p className="spec-label">Frequently asked</p>
						<h2 className="type-title">
							Straight answers to common questions.
						</h2>
						<p className="type-lead">
							Do not see your question? Call{" "}
							<a
								className="text-primary font-bold underline-offset-2 hover:underline"
								href={siteConfig.phoneHref}
							>
								{siteConfig.phone}
							</a>{" "}
							and talk to someone who understands the work.
						</p>
					</div>
					<HomeFaq faqs={faqs} />
				</div>
			</section>

			<ContactCta />
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
