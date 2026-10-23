import Image from "next/image"
import Link from "next/link"
import {
	ArrowRight,
	Check,
	Droplets,
	Gauge,
	Home,
	ShieldCheck,
	Wrench,
} from "@/components/icons"

import { CallButton } from "@/components/call-button"
import { HomeFaq } from "@/components/home-faq"
import {
	EmailAddress,
	ProtectedContactLink,
} from "@/components/protected-contact"
import { buttonVariants } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { contactInfo } from "@/lib/contact"
import {
	faqs,
	reasons,
	serviceGroups,
	testimonials,
	trustedBrands,
	workGallery,
} from "@/lib/home-content"
import { cn } from "@/lib/utils"

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
								<span className="bg-ink/85 absolute top-3 left-3 rounded-md px-2.5 py-1.5 font-mono text-[0.625rem] tracking-[0.14em] text-white uppercase">
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

			<section className="surface-hero tex-grid section-y section-defer overflow-hidden">
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

					<div className="card-rail mt-[var(--space-block)]">
						{serviceGroups.map((group) => (
							<Card className="reveal h-full overflow-hidden" key={group.title}>
								<div className="bg-muted relative aspect-16/10">
									<Image
										alt={group.title}
										className="object-cover"
										fill
										quality={60}
										sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
										src={group.image}
										loading="lazy"
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

			<section className="section-y section-defer">
				<div className="container-shell grid grid-cols-1 items-start gap-[var(--space-block)] [overflow-wrap:anywhere] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
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
						<div className="panel-grid mt-[var(--space-block)] grid gap-[var(--space-grid)]">
							{reasons.map(([title, text]) => (
								<div className="surface-panel panel-inset" key={title}>
									<Wrench className="text-primary size-5" aria-hidden="true" />
									<h3 className="mt-3 font-bold tracking-[-0.02em]">{title}</h3>
									<p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
										{text}
									</p>
								</div>
							))}
						</div>
					</div>

					<div className="surface-float @container relative overflow-hidden rounded-xl px-[min(1.75rem,28px)] py-7 sm:px-[min(2.25rem,36px)] sm:py-9">
						<p className="spec-label">Real people, real results</p>
						<div className="mt-8 space-y-7">
							{testimonials.map(([quote, person]) => (
								<blockquote
									className="border-b border-white/10 pb-7 last:border-0 last:pb-0"
									key={person}
								>
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
							<a
								className="text-primary font-bold underline-offset-2 hover:underline"
								href={contactInfo.phoneHref}
							>
								{contactInfo.phoneDisplay}
							</a>{" "}
							and talk to someone who understands the work.
						</p>
					</div>
					<HomeFaq faqs={faqs} />
				</div>
			</section>

			<section className="surface-hero tex-grid tex-glow section-y-tight relative overflow-hidden">
				<div className="container-shell relative flex flex-wrap items-center justify-between gap-8 md:gap-12">
					<div className="section-head max-w-2xl min-w-0 flex-1 basis-96">
						<p className="spec-label">Wade&apos;s Plumbing &amp; Septic</p>
						<h2 className="type-title">Ready to get started?</h2>
						<p className="type-lead text-on-dark-muted text-pretty">
							Talk to a local licensed professional and get clear options with
							no pressure.
						</p>
						<div className="text-on-dark-muted flex flex-wrap gap-x-6 gap-y-2 text-sm">
							<span>{contactInfo.hours}</span>
							<ProtectedContactLink
								className="inline-flex min-h-11 min-w-0 items-center transition-colors hover:text-white"
								kind="email"
							>
								{/* One text box, so the wrap point after @ is not a flex item */}
								<span className="min-w-0 [overflow-wrap:anywhere]">
									<EmailAddress />
								</span>
							</ProtectedContactLink>
						</div>
					</div>
					<div className="flex w-full max-w-full min-w-0 flex-col flex-wrap items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
						<CallButton
							className="w-full sm:w-auto"
							desktopLabel={`Call ${contactInfo.phoneDisplay}`}
							showIcon={false}
							size="xl"
						/>
						<Link
							prefetch={false}
							className={cn(
								buttonVariants({ variant: "inverse", size: "xl", wrap: true }),
								"w-full sm:w-auto",
							)}
							href="/contact"
						>
							Send a Message
							<ArrowRight aria-hidden="true" />
						</Link>
					</div>
				</div>
			</section>
		</>
	)
}
