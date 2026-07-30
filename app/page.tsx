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
} from "lucide-react"

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
	title: "Honest Plumbing & Septic Service",
	description:
		"No sales pressure or upselling. Get licensed plumbing and engineered septic service in Santa Cruz County and selected Santa Clara County communities.",
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

function HomeHeroMedia() {
	const common = {
		alt: "Three-tank engineered septic system installed on a hillside property in Santa Cruz County",
		sizes: "100vw",
	} as const

	const {
		props: { srcSet: desktop },
	} = getImageProps({
		...common,
		width: 768,
		height: 1024,
		quality: 70,
		src: "/images/work/engineered-septic-hero.webp",
	})

	const {
		props: { srcSet: mobile, ...rest },
	} = getImageProps({
		...common,
		width: 640,
		height: 400,
		quality: 65,
		src: "/images/work/engineered-septic-hero-mobile.webp",
	})

	return (
		<picture>
			<source media="(min-width: 640px)" srcSet={desktop} sizes="100vw" />
			<img
				{...rest}
				srcSet={mobile}
				alt={common.alt}
				className="absolute inset-0 size-full object-cover object-center"
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
			  Hero height is bounded in rem, not 92vh. At viewport height the copy
			  sat marooned in the bottom third of a very tall panel. Two scrims
			  instead of the previous three stacked layers: a horizontal one to
			  hold the copy, a short vertical one to seat the buttons - enough
			  contrast for AA without crushing the work photo to near-black.
			*/}
			<section className="surface-dark relative flex min-h-[32rem] items-end overflow-hidden pt-20 pb-14 sm:min-h-[36rem] sm:pb-16 lg:min-h-[40rem] lg:items-center lg:pt-24 lg:pb-20">
				<HomeHeroMedia />
				<div className="from-ink via-ink/92 to-ink/25 absolute inset-0 bg-linear-to-r" />
				<div className="from-ink/80 to-ink/0 absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t" />

				<div className="container-shell relative">
					<div className="section-head max-w-2xl">
						<p className="spec-label">Santa Cruz County, CA</p>
						<h1 className="type-display text-white">
							Honest plumbing
							<br />
							<span className="text-primary-bright">&amp; septic</span>
						</h1>
						<p className="motion-rise motion-delay-1 type-lead text-on-dark-muted max-w-xl">
							No sales pressure. No upselling. Clear pricing before work begins
							from local licensed professionals.
						</p>
					</div>
					<div className="motion-rise motion-delay-2 mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
						<a
							className={cn(buttonVariants({ size: "xl" }), "w-full sm:w-auto")}
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
							When a standard system will not work (steep slopes, difficult soil,
							tight lots, or sensitive environments), that is exactly where we
							excel.
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
							<a
								className={cn(
									buttonVariants({ size: "xl" }),
									"w-full sm:col-span-2",
								)}
								href={siteConfig.phoneHref}
							>
								<Phone aria-hidden="true" />
								Call to schedule: {siteConfig.phone}
							</a>
						</div>
						<div className="bg-muted relative aspect-4/3 overflow-hidden rounded-lg lg:aspect-auto lg:min-h-[26rem]">
							<Image
								alt="Three-tank septic system installation on hillside property"
								className="object-cover"
								fill
								quality={70}
								sizes="(min-width: 1024px) 45vw, 100vw"
								src="/images/work/completed-multi-tank.webp"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="surface-dark section-y">
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

					<div className="surface-dark rounded-lg p-7 sm:p-9">
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
							Do not see your question? Call and talk to someone who understands
							the work.
						</p>
						<a
							className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
							href={siteConfig.phoneHref}
						>
							<Phone aria-hidden="true" />
							{siteConfig.phone}
						</a>
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
