import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import {
	ArrowRight,
	Check,
	Clock,
	Droplets,
	Gauge,
	HardHat,
	Mail,
	MapPin,
	MapPinned,
	Quotes,
	ShieldCheck,
} from "@/components/icons"

import { CallButton } from "@/components/call-button"
import { HomeFaq } from "@/components/home-faq"
import {
	EmailAddress,
	ProtectedContactLink,
} from "@/components/protected-contact"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import {
	faqs,
	processSteps,
	serviceGroups,
	testimonials,
	trustedBrands,
	workGallery,
} from "@/lib/home-content"
import { locationsByCounty } from "@/lib/service-areas"
import { cn } from "@/lib/utils"

const specialtyPoints = [
	{
		icon: HardHat,
		title: "Hillsides & tight lots",
		text: "Systems planned around slopes, access, and setbacks.",
	},
	{
		icon: ShieldCheck,
		title: "Built with your engineer",
		text: "Installed to the engineered design and the county permit.",
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

export function HomeBelowFold() {
	return (
		<>
			<section className="section-y section-defer">
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
					<div className="reveal mt-[var(--space-block)] grid grid-cols-1 items-stretch gap-[var(--space-grid)] lg:grid-cols-2">
						<div className="panel-grid grid content-start gap-[var(--space-grid)]">
							{specialtyPoints.map(({ icon: Icon, title, text }) => (
								<div className="surface-panel panel-inset" key={title}>
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
							<div className="col-span-full flex w-full min-w-0 flex-col flex-wrap gap-3 sm:flex-row">
								<CallButton
									className="w-full sm:w-auto"
									desktopLabel={`Call ${contactInfo.phoneDisplay}`}
									showIcon={false}
									size="xl"
								/>
								<Link
									prefetch={false}
									className={cn(
										buttonVariants({
											variant: "outline",
											size: "xl",
											wrap: true,
										}),
										"w-full sm:w-auto",
									)}
									href="/service-offerings/engineered-septic-system-installation"
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
									quality={58}
									sizes="(min-width: 1024px) 45vw, 100vw"
									src="/images/work/completed-multi-tank.webp"
									loading="lazy"
								/>
								<span className="bg-ink/85 text-on-dark absolute top-3 left-3 rounded-md px-2.5 py-1.5 text-xs">
									Engineered ATU
								</span>
							</div>
							<figcaption className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 px-2 pt-3 pb-1">
								<span className="text-[0.8125rem] leading-snug font-bold">
									Three-tank engineered septic system
									<span className="text-muted-foreground block font-normal">
										Hillside property, Santa Cruz Mountains
									</span>
								</span>
								<Link
									prefetch={false}
									className="text-primary inline-flex shrink-0 items-center gap-1.5 text-[0.8125rem] font-bold"
									href="/service-category/septic"
								>
									Septic work
									<ArrowRight aria-hidden="true" className="size-3.5" />
								</Link>
							</figcaption>
						</figure>
					</div>
				</div>
			</section>

			<section className="surface-hero section-y section-defer overflow-hidden">
				<div className="container-shell">
					<div className="section-head-row reveal">
						<div className="section-head max-w-2xl">
							<p className="spec-label">Project gallery</p>
							<h2 className="type-title text-on-dark">
								Real work from the Wade&apos;s team.
							</h2>
							<p className="type-lead text-on-dark-muted">
								Engineered septic installations, excavation, controls, and
								finished systems completed on challenging Santa Cruz County
								properties.
							</p>
						</div>
						<Link
							prefetch={false}
							className={cn(
								buttonVariants({ variant: "inverse", size: "lg", wrap: true }),
								"w-full shrink-0 sm:w-auto",
							)}
							href="/contact"
						>
							Discuss your project
							<ArrowRight aria-hidden="true" />
						</Link>
					</div>
					<div
						aria-label="Project photos"
						className="snap-rail mt-[var(--space-block)]"
						role="region"
						tabIndex={0}
					>
						{workGallery.map((image) => (
							<figure key={image.src}>
								<div className="bg-panel-elevated relative aspect-4/5 overflow-hidden rounded-lg">
									<Image
										alt={image.alt}
										className="object-cover"
										fill
										quality={55}
										sizes="(min-width: 640px) 25vw, 50vw"
										src={image.src}
										loading="lazy"
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

			<section className="section-y surface-sunken section-defer">
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
							prefetch={false}
							className={cn(
								buttonVariants({ variant: "outline", size: "lg", wrap: true }),
								"w-full shrink-0 sm:w-auto",
							)}
							href="/services"
						>
							View all services
							<ArrowRight aria-hidden="true" />
						</Link>
					</div>

					{/*
					  Swipeable on phones (three tall stacked cards was most of a
					  screen each), a three-up grid once there is room. The photo
					  carries the title so each card reads as a place, not a form.
					*/}
					<div
						aria-label="Service groups"
						className="snap-rail service-rail mt-[var(--space-block)]"
						role="region"
						tabIndex={0}
					>
						{serviceGroups.map((group) => (
							<article
								className="bg-card text-card-foreground border-border flex flex-col overflow-hidden rounded-xl border shadow-[var(--shadow-panel)]"
								key={group.title}
							>
								<div className="bg-muted relative aspect-4/3 overflow-hidden">
									<Image
										alt=""
										className="object-cover"
										fill
										quality={60}
										sizes="(min-width: 1024px) 400px, (min-width: 640px) 33vw, 76vw"
										src={group.image}
										loading="lazy"
									/>
									<div className="absolute inset-0 bg-black/50" />
									<h3 className="font-display text-on-dark absolute inset-x-0 bottom-0 p-5 text-[1.375rem] leading-tight font-semibold tracking-[-0.02em]">
										{group.title}
									</h3>
								</div>
								<div className="flex flex-1 flex-col p-5 sm:p-6">
									<p className="text-muted-foreground text-[0.9375rem] leading-relaxed">
										{group.description}
									</p>
									<ul className="mt-4 mb-5 grid gap-2 text-sm">
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
									<Link
										prefetch={false}
										className="text-primary border-border mt-auto inline-flex items-center gap-1.5 border-t pt-4 text-sm font-bold hover:underline"
										href={group.href as Route}
									>
										{group.linkLabel}
										<ArrowRight aria-hidden="true" className="size-4" />
									</Link>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>

			{/*
			  Service area. Every town links to its own page, so the homepage
			  states the coverage in plain HTML for people, crawlers, and AI
			  assistants alike, and passes link weight to the local pages.
			*/}
			<section className="section-y section-defer">
				<div className="container-shell grid grid-cols-1 gap-[var(--space-block)] lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
					<div className="section-head">
						<p className="spec-label">Service area</p>
						<h2 className="type-title">Local to Santa Cruz County.</h2>
						<p className="type-lead">
							Our crew works across Santa Cruz County and selected Santa Clara
							County communities. Not sure about your address? Call and ask.
						</p>
						<Link
							prefetch={false}
							className={cn(
								buttonVariants({ variant: "outline", size: "lg", wrap: true }),
								"w-full sm:w-auto",
							)}
							href="/service-areas"
						>
							<MapPinned aria-hidden="true" />
							See the service area map
						</Link>
					</div>
					<div className="grid gap-8">
						{(["Santa Cruz County", "Santa Clara County"] as const).map(
							(county) => (
								<div key={county}>
									<h3 className="text-muted-foreground text-xs font-medium">
										{county}
									</h3>
									<ul className="town-grid mt-4">
										{locationsByCounty(county).map((town) => (
											<li key={town.slug}>
												<Link
													prefetch={false}
													className="town-link"
													href={town.href as Route}
												>
													<MapPin
														aria-hidden="true"
														className="text-primary size-4 shrink-0"
													/>
													<span className="min-w-0">{town.name}</span>
												</Link>
											</li>
										))}
									</ul>
								</div>
							),
						)}
					</div>
				</div>
			</section>

			<section className="border-border bg-card section-y-tight section-defer border-y">
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

			{/*
			  How it works. A numbered process replaces the old grid of four
			  wrench cards, which restated the trust bar. Steps run down a rail
			  so the sequence reads at a glance; the testimonial panel sits beside
			  it as the outcome of that process.
			*/}
			<section className="section-y section-defer">
				<div className="container-shell grid grid-cols-1 items-start gap-[var(--space-block)] [overflow-wrap:anywhere] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
					<div>
						<div className="section-head">
							<p className="spec-label">How it works</p>
							<h2 className="type-title">
								Real people. Honest recommendations.
							</h2>
							<p className="type-lead">
								We are not corporate plumbers trying to hit an upsell quota.
								Here is what happens after you call.
							</p>
						</div>
						<ol className="process-rail mt-[var(--space-block)]">
							{processSteps.map(({ title, text }, index) => (
								<li key={title}>
									<span aria-hidden="true" className="process-num">
										{String(index + 1).padStart(2, "0")}
									</span>
									<div className="min-w-0 pb-8">
										<h3 className="type-subtitle text-[1.125rem]">{title}</h3>
										<p className="text-muted-foreground mt-2 max-w-prose text-[0.9375rem] leading-relaxed">
											{text}
										</p>
									</div>
								</li>
							))}
						</ol>
						<div className="flex w-full min-w-0 flex-col flex-wrap gap-3 sm:flex-row">
							<CallButton
								className="w-full sm:w-auto"
								desktopLabel={`Call ${contactInfo.phoneDisplay}`}
								size="xl"
							/>
							<Link
								prefetch={false}
								className={cn(
									buttonVariants({
										variant: "outline",
										size: "xl",
										wrap: true,
									}),
									"w-full sm:w-auto",
								)}
								href="/contact"
							>
								Request a free quote
								<ArrowRight aria-hidden="true" />
							</Link>
						</div>
					</div>

					<div className="surface-float @container relative overflow-hidden rounded-xl px-[min(1.75rem,28px)] py-8 sm:px-[min(2.5rem,40px)] sm:py-10 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
						<Quotes
							aria-hidden="true"
							className="text-primary-bright size-12 opacity-90"
						/>
						<p className="spec-label mt-6">What customers say</p>
						<div className="mt-6 space-y-8">
							{testimonials.map(([quote, person], index) => (
								<blockquote
									className="border-b border-white/10 pb-8 last:border-0 last:pb-0"
									key={person}
								>
									<p
										className={cn(
											"text-on-dark leading-snug font-medium tracking-[-0.01em] text-pretty",
											index === 0
												? "font-display text-[clamp(1.25rem,2.2vw,1.625rem)]"
												: "text-[1.0625rem] leading-relaxed",
										)}
									>
										“{quote}”
									</p>
									<footer className="mt-4 flex items-center gap-3">
										<span
											aria-hidden="true"
											className="bg-primary text-primary-foreground grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold"
										>
											{person.charAt(0)}
										</span>
										<span className="text-on-dark-muted text-sm font-bold">
											{person}
										</span>
									</footer>
								</blockquote>
							))}
						</div>
						<Link
							prefetch={false}
							className={cn(
								buttonVariants({ variant: "inverse", size: "lg", wrap: true }),
								"mt-8 w-full sm:w-auto @max-[12rem]:flex-col @max-[12rem]:px-0",
							)}
							href="/testimonials"
						>
							Read customer stories
							<ArrowRight aria-hidden="true" />
						</Link>
					</div>
				</div>
			</section>

			<section className="section-y border-border surface-sunken section-defer border-y">
				<div className="container-shell grid grid-cols-1 items-start gap-[var(--space-block)] lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
					<div className="section-head">
						<p className="spec-label">Frequently asked</p>
						<h2 className="type-title">
							Straight answers to common questions.
						</h2>
						<p className="type-lead">
							Do not see your question? Call{" "}
							<a className="text-link" href={contactInfo.phoneHref}>
								{contactInfo.phoneDisplay}
							</a>{" "}
							and talk to someone who understands the work.
						</p>
					</div>
					<HomeFaq faqs={faqs} />
				</div>
			</section>

			{/*
			  Closing band. The number itself is the headline of the right-hand
			  panel, set large enough to read from across a room, with hours and
			  email on an aligned icon list beneath it.
			*/}
			<section className="surface-hero section-y relative overflow-hidden">
				<div className="container-shell relative grid grid-cols-1 items-center gap-[var(--space-block)] lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16">
					<div className="section-head max-w-2xl min-w-0">
						<p className="spec-label">Wade&apos;s Plumbing &amp; Septic</p>
						<h2 className="type-headline text-on-dark">
							Ready to get started?
						</h2>
						<p className="type-lead text-on-dark-muted text-pretty">
							Talk to a local licensed professional and get clear options with
							no pressure. Quotes are free, and the price is set before any work
							begins.
						</p>
					</div>
					<div className="surface-float min-w-0 rounded-xl p-[min(1.75rem,28px)] sm:p-8">
						<p className="text-on-dark-subtle text-xs">Call the office</p>
						<ProtectedContactLink
							ariaLabel={`Call ${contactInfo.phoneDisplay}`}
							className="font-display text-primary-bright hover:text-on-dark mt-2 inline-flex min-h-11 items-center text-[clamp(2rem,5vw,2.75rem)] leading-none font-semibold tracking-[-0.03em] [overflow-wrap:anywhere] transition-colors"
							kind="phone"
						>
							{contactInfo.phoneDisplay}
						</ProtectedContactLink>
						<ul className="text-on-dark-muted mt-5 space-y-2.5 border-t border-white/10 pt-5 text-sm">
							<li className="flex items-start gap-3">
								<Clock
									aria-hidden="true"
									className="text-primary-bright mt-0.5 size-4 shrink-0"
								/>
								<span>{contactInfo.hours}</span>
							</li>
							<li className="flex items-start gap-3">
								<Mail
									aria-hidden="true"
									className="text-primary-bright mt-0.5 size-4 shrink-0"
								/>
								<ProtectedContactLink
									className="hover:text-on-dark min-w-0 [overflow-wrap:anywhere] transition-colors"
									kind="email"
								>
									<EmailAddress />
								</ProtectedContactLink>
							</li>
						</ul>
						<Link
							prefetch={false}
							className={cn(
								buttonVariants({ variant: "default", size: "lg", wrap: true }),
								"mt-6 w-full",
							)}
							href="/contact"
						>
							Send a message
							<ArrowRight aria-hidden="true" />
						</Link>
					</div>
				</div>
			</section>
		</>
	)
}
