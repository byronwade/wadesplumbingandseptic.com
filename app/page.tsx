import type { Metadata } from "next"
import Image from "next/image"
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
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
	title: "Honest Plumbing & Septic Service",
	description:
		"No sales pressure or upselling. Get licensed plumbing and engineered septic service across Santa Cruz and Santa Clara counties with clear pricing.",
	alternates: { canonical: "/" },
}

const trustItems = [
	"Licensed & insured",
	"Flat-rate pricing",
	"Satisfaction guaranteed",
]

const serviceGroups = [
	{
		title: "Residential Plumbing",
		image: "/images/precision-valve.jpeg",
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
		image: "/images/commercial-plumbing.jpeg",
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
		image: "/images/new-construction.jpeg",
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
			"We serve Santa Cruz County and Santa Clara County, California. Call us if you are unsure whether a specific address is inside the current service area.",
	},
]

export default function HomePage() {
	return (
		<main id="main-content">
			<section className="relative overflow-hidden bg-[#111] text-white">
				<div className="bg-primary/12 pointer-events-none absolute -top-48 -right-40 size-[38rem] rounded-full blur-3xl" />
				<div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:px-8 lg:grid-cols-2 lg:gap-16 lg:py-24">
					<div className="relative z-10">
						<Badge className="border-primary/40 bg-primary/15 mb-6">
							<span className="bg-primary mr-2 size-1.5 rounded-full" />
							{siteConfig.serviceArea}
						</Badge>
						<h1 className="text-5xl leading-[0.95] font-black tracking-[-0.055em] sm:text-6xl lg:text-7xl">
							Honest
							<br />
							Plumbing
							<br />
							<span className="text-primary">&amp; Septic</span>
						</h1>
						<p className="mt-7 max-w-xl text-lg leading-relaxed text-neutral-300">
							No sales pressure. No upselling. Quality workmanship from local
							professionals you can count on—with clear pricing before work
							begins.
						</p>
						<div className="mt-7 grid gap-3 text-sm text-neutral-300 sm:grid-cols-3">
							{trustItems.map((item) => (
								<span className="flex items-center gap-2" key={item}>
									<Check className="text-primary size-4 shrink-0" />
									{item}
								</span>
							))}
						</div>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<a
								className={cn(buttonVariants({ size: "xl" }), "gap-2.5")}
								href={siteConfig.phoneHref}
							>
								<Phone className="size-5" />
								Call {siteConfig.phone}
							</a>
							<Link
								className={buttonVariants({
									variant: "inverse",
									size: "xl",
								})}
								href="/services"
							>
								Our Services
								<ArrowRight />
							</Link>
						</div>
						<div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6 text-sm text-neutral-300">
							<span className="text-amber-400" aria-label="5 stars">
								★★★★★
							</span>
							<span>4.9 local reputation · Family owned since 2021</span>
						</div>
					</div>

					<div className="relative hidden h-[32.5rem] items-end gap-4 lg:flex">
						<div className="relative h-full flex-1 overflow-hidden rounded-2xl shadow-2xl shadow-black/40">
							<Image
								alt="Professional plumber at work"
								className="object-cover"
								fill
								fetchPriority="high"
								priority
								quality={80}
								sizes="(min-width: 1024px) 38vw, 0px"
								src="/images/hero-plumber.jpeg"
							/>
							<div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
						</div>
						<div className="flex w-44 shrink-0 flex-col gap-4">
							<div className="relative h-56 overflow-hidden rounded-2xl shadow-xl">
								<Image
									alt="Water heater installation"
									className="object-cover"
									fill
									quality={75}
									sizes="176px"
									src="/images/water-heater.jpeg"
								/>
							</div>
							<div className="relative h-56 overflow-hidden rounded-2xl shadow-xl">
								<Image
									alt="Septic system installation"
									className="object-cover"
									fill
									quality={75}
									sizes="176px"
									src="/images/septic-installation.jpeg"
								/>
							</div>
						</div>
						<div className="absolute top-6 left-6 rounded-xl border border-white/20 bg-black/30 px-4 py-3 backdrop-blur-md">
							<p className="text-xs text-neutral-300">Serving</p>
							<p className="text-sm font-black">California</p>
							<p className="text-primary text-xs font-bold">
								Santa Cruz · Santa Clara
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="border-b bg-white">
				<div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-5 text-sm font-bold text-neutral-600 md:grid-cols-4 md:px-8">
					{[
						"Family Owned & Operated",
						"Licensed & Insured",
						"Satisfaction Guaranteed",
						"★★★★★ 4.9 Local Rating",
					].map((item) => (
						<span className="flex items-center justify-center gap-2" key={item}>
							<BadgeCheck className="text-primary size-4 shrink-0" />
							{item}
						</span>
					))}
				</div>
			</section>

			<section className="py-20">
				<div className="mx-auto max-w-7xl px-4 md:px-8">
					<div className="mx-auto max-w-3xl text-center">
						<Badge>Our Core Specialty</Badge>
						<h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
							Engineered <span className="text-primary">Septic Systems</span>
						</h2>
						<p className="text-muted-foreground mt-5 text-lg leading-relaxed">
							When a standard system will not work—steep slopes, difficult soil,
							tight lots, or sensitive environments—that is exactly where we
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
								<Card className="bg-neutral-50 shadow-none" key={title}>
									<CardHeader>
										<span className="bg-primary/10 text-primary grid size-10 place-items-center rounded-xl">
											<Icon className="size-5" />
										</span>
										<CardTitle className="mt-3 text-lg">{title}</CardTitle>
										<CardDescription>{text}</CardDescription>
									</CardHeader>
								</Card>
							))}
							<a
								className={cn(
									buttonVariants({ size: "xl" }),
									"mt-2 sm:col-span-2",
								)}
								href={siteConfig.phoneHref}
							>
								<Phone />
								Call to Schedule — {siteConfig.phone}
							</a>
						</div>
						<div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
							<Image
								alt="Three-tank septic system installation on hillside property"
								className="object-cover"
								fill
								quality={80}
								sizes="(min-width: 1024px) 45vw, 100vw"
								src="/images/featured-septic.jpeg"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-neutral-50 py-20">
				<div className="mx-auto max-w-7xl px-4 md:px-8">
					<div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
						<div className="max-w-2xl">
							<Badge>What We Do</Badge>
							<h2 className="mt-5 text-4xl font-black tracking-tight">
								Plumbing &amp; Septic Services
							</h2>
							<p className="text-muted-foreground mt-4 text-lg">
								From routine maintenance to complex installations, our licensed
								team handles it cleanly, honestly, and on time.
							</p>
						</div>
						<Link
							className={buttonVariants({ variant: "outline", size: "lg" })}
							href="/services"
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
										quality={70}
										sizes="(min-width: 1024px) 33vw, 100vw"
										src={group.image}
									/>
								</div>
								<CardHeader>
									<CardTitle>{group.title}</CardTitle>
									<CardDescription>{group.description}</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2 text-sm text-neutral-600">
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

			<section className="py-20">
				<div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
					<div>
						<Badge>Why Choose Wade&apos;s</Badge>
						<h2 className="mt-5 text-4xl font-black tracking-tight">
							Real people. Honest recommendations.
						</h2>
						<p className="text-muted-foreground mt-5 text-lg leading-relaxed">
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
								<div className="rounded-xl border p-5" key={title}>
									<Wrench className="text-primary size-5" />
									<h3 className="mt-3 font-black">{title}</h3>
									<p className="text-muted-foreground mt-1 text-sm">{text}</p>
								</div>
							))}
						</div>
					</div>

					<div className="rounded-3xl bg-[#111] p-7 text-white sm:p-10">
						<p className="text-primary text-sm font-black tracking-wider uppercase">
							Real People, Real Results
						</p>
						<div className="mt-7 space-y-6">
							{[
								[
									"Wade's team was refreshingly honest. They recommended a simple repair that saved me thousands.",
									"Sarah T. · Santa Cruz, CA",
								],
								[
									"They explained every option without pressure. It felt like advice from a knowledgeable neighbor.",
									"Jennifer L.",
								],
							].map(([quote, person]) => (
								<blockquote
									className="border-b border-white/10 pb-6 last:border-0 last:pb-0"
									key={person}
								>
									<div className="text-amber-400">★★★★★</div>
									<p className="mt-3 text-lg leading-relaxed">“{quote}”</p>
									<footer className="mt-3 text-sm font-bold text-neutral-400">
										{person}
									</footer>
								</blockquote>
							))}
						</div>
						<Link
							className={cn(
								buttonVariants({ variant: "inverse", size: "lg" }),
								"mt-8",
							)}
							href="/testimonials"
						>
							Read customer stories
							<ArrowRight />
						</Link>
					</div>
				</div>
			</section>

			<section className="border-y bg-neutral-50 py-20">
				<div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
					<div>
						<Badge>Frequently Asked Questions</Badge>
						<h2 className="mt-5 text-4xl font-black tracking-tight">
							Straight answers to common questions.
						</h2>
						<p className="text-muted-foreground mt-4">
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
					<Accordion type="single" collapsible>
						{faqs.map((faq, index) => (
							<AccordionItem key={faq.question} value={`faq-${index}`}>
								<AccordionTrigger>{faq.question}</AccordionTrigger>
								<AccordionContent>{faq.answer}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</section>

			<ContactCta />
		</main>
	)
}
