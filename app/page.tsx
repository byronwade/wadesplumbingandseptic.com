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
import { Badge } from "@/components/ui/badge"
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

const faqs = [
	{
		question: "How often should I have my septic tank pumped?",
		answer:
			"Most septic tanks should be pumped every 3–5 years, depending on household size, wastewater volume, and tank size. We recommend a professional inspection to determine the right schedule for your system.",
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
			"Conventional tank water heaters commonly last 8–12 years, while tankless models can last 15–20 years or longer with proper maintenance.",
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
			<section className="surface-dark relative min-h-[min(78vh,44rem)] overflow-hidden sm:min-h-[min(92vh,52rem)]">
				<HomeHeroMedia />
				<div className="bg-ink/55 sm:bg-ink/40 absolute inset-0" />
				<div className="from-ink via-ink/90 to-ink/55 absolute inset-0 bg-linear-to-r" />
				<div className="from-ink via-ink/70 to-ink/25 absolute inset-0 bg-linear-to-t" />

				<div className="container-shell relative flex min-h-[min(78vh,44rem)] flex-col justify-end pt-24 pb-12 sm:min-h-[min(92vh,52rem)] sm:pt-28 sm:pb-16 lg:justify-center lg:pt-20 lg:pb-24">
					<div className="max-w-3xl">
						<p className="type-eyebrow text-primary-bright">
							Wade&apos;s Plumbing &amp; Septic
						</p>
						<h1 className="type-display mt-4 text-white sm:mt-5">
							Honest plumbing
							<br />
							<span className="text-primary-bright">&amp; septic</span>
						</h1>
						<p className="motion-rise motion-delay-1 mt-5 max-w-xl text-base leading-relaxed text-[#ececea] sm:mt-6 sm:text-lg">
							No sales pressure. No upselling. Clear pricing before work begins
							from local licensed professionals.
						</p>
						<div className="motion-rise motion-delay-2 mt-7 flex w-full max-w-md flex-col items-stretch gap-4 sm:mt-8 sm:max-w-none sm:flex-row sm:items-center">
							<a
								className={cn(
									buttonVariants({ size: "xl" }),
									"w-full gap-2.5 sm:w-auto",
								)}
								href={siteConfig.phoneHref}
							>
								<Phone className="size-5" />
								Call {siteConfig.phone}
							</a>
							<Link
								className={cn(
									buttonVariants({
										variant: "inverse",
										size: "xl",
									}),
									"w-full justify-start sm:w-auto sm:justify-center",
								)}
								href="/services"
								prefetch
							>
								Our Services
								<ArrowRight />
							</Link>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-card shadow-[inset_0_-1px_0_0_var(--border)]">
				<div className="container-shell text-muted-foreground grid grid-cols-1 gap-3 py-4 text-sm font-bold sm:grid-cols-2 sm:gap-4 sm:py-5 md:grid-cols-4">
					{[
						"Family Owned & Operated",
						"Licensed & Insured",
						"Satisfaction Guaranteed",
						"★★★★★ 4.9 Local Rating",
					].map((item) => (
						<span
							className="flex items-center gap-2 sm:justify-center"
							key={item}
						>
							<BadgeCheck className="text-primary size-4 shrink-0" />
							{item}
						</span>
					))}
				</div>
			</section>

			<section className="section-y">
				<div className="container-shell">
					<div className="mx-auto max-w-3xl text-center">
						<Badge>Our Core Specialty</Badge>
						<h2 className="type-title mt-5">
							Engineered <span className="text-primary">septic systems</span>
						</h2>
						<p className="type-lead mt-5">
							When a standard system will not work (steep slopes, difficult soil,
							tight lots, or sensitive environments), that is exactly where we
							excel.
						</p>
					</div>

					<div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
						<div className="grid gap-4 sm:grid-cols-2">
							{[
								{
									icon: ShieldCheck,
									title: "Licensed & Code-Compliant",
									text: "Properly planned and permitted for the property.",
								},
								{
									icon: Home,
									title: "Family-Owned & Local",
									text: "Not a franchise. We know these counties and codes.",
								},
								{
									icon: Gauge,
									title: "Advanced ATU Systems",
									text: "For sites conventional contractors turn down.",
								},
								{
									icon: Droplets,
									title: "Free Site Consultations",
									text: "We tell you what can work before money changes hands.",
								},
							].map(({ icon: Icon, title, text }) => (
								<div className="surface-panel p-5" key={title}>
									<span className="bg-accent text-accent-foreground grid size-10 place-items-center rounded-md">
										<Icon className="size-5" />
									</span>
									<h3 className="mt-4 text-lg font-extrabold tracking-[-0.02em]">
										{title}
									</h3>
									<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
										{text}
									</p>
								</div>
							))}
							<div className="mt-2 flex flex-col gap-3 sm:col-span-2 sm:flex-row">
								<a
									className={cn(buttonVariants({ size: "xl" }), "w-full sm:w-auto")}
									href={siteConfig.phoneHref}
								>
									<Phone />
									Call to Schedule: {siteConfig.phone}
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
						<div className="relative aspect-[4/3] overflow-hidden rounded-lg">
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
					<div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
						<div className="max-w-2xl">
							<Badge tone="bright">Project Gallery</Badge>
							<h2 className="type-title mt-5 text-white">
								Real work from the Wade&apos;s team.
							</h2>
							<p className="type-lead mt-4">
								Engineered septic installations, excavation, controls, and
								finished systems completed on challenging Santa Cruz County
								properties.
							</p>
						</div>
						<Link
							className={cn(
								buttonVariants({ variant: "inverse", size: "lg" }),
								"w-full justify-start sm:w-auto sm:justify-center",
							)}
							href="/contact"
							prefetch
						>
							Discuss your project
							<ArrowRight />
						</Link>
					</div>
					<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{workGallery.map((image) => (
							<figure key={image.src}>
								<div className="bg-panel-elevated relative aspect-[4/5] overflow-hidden rounded-lg">
									<Image
										alt={image.alt}
										className="object-cover"
										fill
										quality={65}
										sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
										src={image.src}
									/>
								</div>
								<figcaption className="mt-3 text-sm font-bold text-white/65">
									{image.caption}
								</figcaption>
							</figure>
						))}
					</div>
				</div>
			</section>

			<section className="section-y bg-secondary/60">
				<div className="container-shell">
					<div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
						<div className="max-w-2xl">
							<Badge>What We Do</Badge>
							<h2 className="type-title mt-5">
								Plumbing &amp; septic services
							</h2>
							<p className="type-lead mt-4">
								From routine maintenance to complex installations, our licensed
								team handles it cleanly, honestly, and on time.
							</p>
						</div>
						<Link
							className={buttonVariants({ variant: "outline", size: "lg" })}
							href="/services"
							prefetch
						>
							View all services
							<ArrowRight />
						</Link>
					</div>

					<div className="mt-10 grid gap-6 lg:grid-cols-3">
						{serviceGroups.map((group) => (
							<Card className="overflow-hidden" key={group.title}>
								<div className="relative aspect-[16/10]">
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
											<li className="flex items-center gap-2" key={item}>
												<Check className="text-primary size-4" />
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

			<section className="border-border bg-card border-y py-12">
				<div className="container-shell">
					<p className="text-muted-foreground text-center text-xs font-extrabold tracking-[0.16em] uppercase">
						Experienced with leading plumbing equipment brands
					</p>
					<div className="mt-8 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-5">
						{trustedBrands.map((brand) => (
							<div
								className="relative mx-auto h-14 w-full max-w-40 grayscale transition hover:grayscale-0"
								key={brand.src}
							>
								<Image
									alt={brand.alt}
									className="object-contain"
									fill
									quality={80}
									sizes="160px"
									src={brand.src}
								/>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="section-y">
				<div className="container-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
					<div>
						<Badge>Why Choose Wade&apos;s</Badge>
						<h2 className="type-title mt-5">
							Real people. Honest recommendations.
						</h2>
						<p className="type-lead mt-5">
							We are not corporate plumbers trying to hit an upsell quota. We
							explain the issue, show you practical options, and do quality work
							at a fair price.
						</p>
						<div className="mt-8 grid gap-4 sm:grid-cols-2">
							{[
								["No-Pressure Advice", "Only the work your property needs."],
								["Transparent Pricing", "Clear pricing before work begins."],
								["Clean Workmanship", "Respectful service and a clean finish."],
								[
									"Long-Term Reliability",
									"Repairs and systems designed to last.",
								],
							].map(([title, text]) => (
								<div className="surface-panel p-5" key={title}>
									<Wrench className="text-primary size-5" />
									<h3 className="mt-3 font-extrabold tracking-[-0.02em]">
										{title}
									</h3>
									<p className="text-muted-foreground mt-1 text-sm">{text}</p>
								</div>
							))}
						</div>
					</div>

					<div className="surface-dark rounded-lg p-7 sm:p-10">
						<p className="type-eyebrow">Real People, Real Results</p>
						<div className="mt-7 space-y-6">
							{[
								[
									"As a real estate professional, I love working with Wade’s Plumbing. They are courteous, professional, and always make sure my clients are taken care of.",
									"Bailey Cotrona",
								],
								[
									"They know their stuff, do great work, and are a pleasure to work with. They made me feel comfortable with a terrible situation that shut down my house.",
									"Aaron Berger",
								],
							].map(([quote, person]) => (
								<blockquote
									className="pb-6 shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.08)] last:pb-0 last:shadow-none"
									key={person}
								>
									<div className="text-primary-bright" aria-label="5 stars">
										★★★★★
									</div>
									<p className="mt-3 text-lg leading-relaxed text-white">
										“{quote}”
									</p>
									<footer className="mt-3 text-sm font-bold text-white/50">
										{person}
									</footer>
								</blockquote>
							))}
						</div>
						<Link
							className={cn(
								buttonVariants({ variant: "inverse", size: "lg" }),
								"mt-8 w-full justify-start sm:w-auto sm:justify-center",
							)}
							href="/testimonials"
							prefetch
						>
							Read customer stories
							<ArrowRight />
						</Link>
					</div>
				</div>
			</section>

			<section className="section-y border-border bg-secondary/60 border-y">
				<div className="container-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
					<div>
						<Badge>Frequently Asked Questions</Badge>
						<h2 className="type-title mt-5">
							Straight answers to common questions.
						</h2>
						<p className="type-lead mt-4">
							Do not see your question? Call and talk to someone who understands
							the work.
						</p>
						<a
							className={cn(buttonVariants({ size: "lg" }), "mt-6")}
							href={siteConfig.phoneHref}
						>
							<Phone />
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
