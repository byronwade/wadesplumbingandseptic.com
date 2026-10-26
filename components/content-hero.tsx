import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { BadgeCheck, ChevronRight } from "@/components/icons"

import { CallButton } from "@/components/call-button"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

/* Confirmed facts only: license and insurance, how pricing works, free quotes. */
const serviceHeroFacts = [
	`CSLB #${siteConfig.licenseNumber}`,
	"Licensed & insured",
	"Flat-rate, quoted on site",
	"Free quotes",
] as const

export type HeroBreadcrumb = {
	label: string
	/** Omit on the current page crumb (rendered as plain text). */
	href?: Route
}

export type ContentHeroVariant =
	| "page"
	| "service"
	| "article"
	| "index"
	/** @deprecated Prefer `page`. Kept so older call sites keep compiling. */
	| "default"
	| "marketing"

function buildBreadcrumbs({
	title,
	parent,
	breadcrumbs,
}: {
	title: string
	parent?: { href: Route; label: string }
	breadcrumbs?: HeroBreadcrumb[]
}): HeroBreadcrumb[] {
	if (breadcrumbs?.length) return breadcrumbs

	return [
		{ href: "/" as Route, label: "Home" },
		...(parent ? [{ href: parent.href, label: parent.label }] : []),
		{ label: title },
	]
}

function BreadcrumbTrail({
	items,
	tone = "dark",
}: {
	items: HeroBreadcrumb[]
	tone?: "dark" | "light"
}) {
	const light = tone === "light"
	/*
	  Mobile: ancestors only. The current page title is the H1 directly below,
	  so repeating a truncated all-caps crumb looked broken on narrow screens.
	  From sm up, include the current crumb and let it wrap instead of ellipsis.
	*/
	const ancestors = items.slice(0, -1)
	const current = items[items.length - 1]

	return (
		<nav
			aria-label="Breadcrumb"
			className={cn(
				"mb-5 text-[0.8125rem] leading-snug sm:mb-6",
				light ? "text-muted-foreground" : "text-on-dark-subtle",
			)}
		>
			<ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
				{ancestors.map((item, index) => (
					<li
						key={item.href ?? item.label}
						className="flex items-center gap-1.5"
					>
						{index > 0 ? (
							<ChevronRight
								aria-hidden="true"
								className="size-3.5 shrink-0 opacity-50"
							/>
						) : null}
						{item.href ? (
							<Link
								prefetch={false}
								className={cn(
									"transition-colors",
									light ? "hover:text-foreground" : "hover:text-white",
								)}
								href={item.href}
							>
								{item.label}
							</Link>
						) : (
							<span>{item.label}</span>
						)}
					</li>
				))}
				{current ? (
					<li className="hidden min-w-0 items-center gap-1.5 sm:flex">
						{ancestors.length > 0 ? (
							<ChevronRight
								aria-hidden="true"
								className="size-3.5 shrink-0 opacity-50"
							/>
						) : null}
						<span
							aria-current="page"
							className={cn(
								"min-w-0 text-pretty break-words",
								light ? "text-foreground/80" : "text-white/85",
							)}
						>
							{current.label}
						</span>
					</li>
				) : null}
			</ol>
		</nav>
	)
}

function normalizeVariant(
	variant: ContentHeroVariant,
): "page" | "service" | "article" | "index" {
	if (variant === "default" || variant === "marketing") return "page"
	return variant
}

/**
 * Interior page heroes. The homepage cinematic hero is separate on purpose.
 *
 * - article: editorial / blog post intro (light, featured image, no CTAs)
 * - service: work-photo band under a quiet title row (one call action)
 * - index: compact catalog intro for /services and /expert-tips
 * - page: quieter utility / company / area landing intro
 */
export function ContentHero({
	title,
	description,
	eyebrow,
	image,
	imageAlt,
	parent,
	breadcrumbs,
	variant = "page",
	indexKind,
	meta,
	showActions,
	pageCta = "contact",
}: {
	title: string
	description: string
	eyebrow?: string
	image?: string
	imageAlt?: string
	parent?: { href: Route; label: string }
	breadcrumbs?: HeroBreadcrumb[]
	variant?: ContentHeroVariant
	/** Nuance for catalog pages (tips read softer than services). */
	indexKind?: "tip" | "service"
	/** Optional meta row under the dek (dates, views). Used by article heroes. */
	meta?: ReactNode
	/** Override default CTA visibility for the variant. */
	showActions?: boolean
	/**
	 * Page-hero primary CTA. Defaults to a Contact link. Use "call" on the
	 * contact page itself so the button does not navigate nowhere.
	 */
	pageCta?: "contact" | "call"
}) {
	const kind = normalizeVariant(variant)
	const trail = buildBreadcrumbs({ title, parent, breadcrumbs })

	if (kind === "article") {
		return (
			<header className="hero-article border-border border-b">
				<div className="article-wide-shell pt-10 pb-8 sm:pt-14 sm:pb-12">
					<BreadcrumbTrail items={trail} tone="light" />
					<div className="section-head max-w-3xl">
						{eyebrow ? (
							<p className="text-primary font-mono text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
								{eyebrow}
							</p>
						) : null}
						{/*
						  No entrance motion on title/lead: they are common LCP nodes.
						  motion-rise with fill-mode both delayed first paint by ~2s.
						*/}
						<h1 className="type-headline text-foreground">{title}</h1>
						<p className="type-lead text-muted-foreground">{description}</p>
					</div>
					{meta ? (
						<div className="text-muted-foreground mt-6">{meta}</div>
					) : null}

					{image ? (
						<figure className="hero-article-media mt-8 sm:mt-10">
							<div className="relative aspect-[16/10] overflow-hidden rounded-lg sm:aspect-[2/1] lg:aspect-[12/5]">
								<Image
									alt={imageAlt?.trim() || title}
									className="object-cover"
									decoding="sync"
									fill
									priority
									quality={75}
									sizes="(min-width: 1200px) 72rem, 100vw"
									src={image}
								/>
							</div>
						</figure>
					) : null}
				</div>
			</header>
		)
	}

	if (kind === "service") {
		const actions = showActions ?? true

		/*
		  Split hero on a dark band, matching the home hero. Title, actions and
		  the quick facts share the first screen with the work photo, instead of
		  a full-width photo pushing the facts below the fold.
		*/
		return (
			<header className="hero-service surface-hero tex-grid overflow-hidden">
				<div className="container-shell grid grid-cols-1 items-center gap-8 pt-8 pb-10 sm:pt-10 sm:pb-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 lg:py-14">
					<div className="min-w-0">
						<BreadcrumbTrail items={trail} tone="dark" />
						<div className="section-head">
							{eyebrow ? <p className="spec-label">{eyebrow}</p> : null}
							<h1 className="type-headline text-white">{title}</h1>
							<p className="type-lead text-on-dark-muted">{description}</p>
						</div>
						{actions ? (
							<div className="mt-8 flex min-w-0 flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center">
								<CallButton
									className="w-full sm:w-auto"
									desktopLabel={`Call ${contactInfo.phoneDisplay}`}
									prefer="dial"
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
									href="/contact"
								>
									Request service
								</Link>
							</div>
						) : null}
						<ul className="text-on-dark-muted mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[0.8125rem] font-bold">
							{serviceHeroFacts.map((fact) => (
								<li className="flex items-center gap-2" key={fact}>
									<BadgeCheck
										aria-hidden="true"
										className="text-primary-bright size-4 shrink-0"
									/>
									{fact}
								</li>
							))}
						</ul>
					</div>

					{image ? (
						<div className="hero-service-media relative aspect-[16/10] overflow-hidden rounded-xl shadow-[var(--shadow-float)] lg:aspect-[4/3]">
							<Image
								alt={imageAlt?.trim() || title}
								className="object-cover"
								decoding="sync"
								fill
								priority
								quality={70}
								sizes="(min-width: 1024px) 40vw, 100vw"
								src={image}
							/>
						</div>
					) : null}
				</div>
			</header>
		)
	}

	if (kind === "index") {
		const tip = indexKind === "tip"

		/*
		  Catalog intro for /services and /expert-tips. Same dark brand band as
		  the other heroes, with the photo framed on the right and the call path
		  in the first screen.
		*/
		return (
			<header className="hero-index surface-hero tex-grid relative overflow-hidden">
				<div className="container-shell relative py-12 sm:py-16 lg:py-20">
					<BreadcrumbTrail items={trail} tone="dark" />
					<div
						className={cn(
							"grid items-center gap-10",
							image
								? "lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]"
								: undefined,
						)}
					>
						<div>
							<div className="section-head max-w-2xl">
								{eyebrow ? <p className="spec-label">{eyebrow}</p> : null}
								<h1 className="type-headline text-white">{title}</h1>
								<p className="type-lead text-on-dark-muted max-w-xl">
									{description}
								</p>
							</div>
							<div className="mt-8 flex min-w-0 flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center">
								<CallButton
									className="w-full sm:w-auto"
									desktopLabel={`Call ${contactInfo.phoneDisplay}`}
									prefer="dial"
									size="lg"
								/>
								<Link
									prefetch={false}
									className={cn(
										buttonVariants({
											variant: "inverse",
											size: "lg",
											wrap: true,
										}),
										"w-full sm:w-auto",
									)}
									href={tip ? "/contact" : "/service-areas"}
								>
									{tip ? "Ask us a question" : "Check your town"}
								</Link>
							</div>
						</div>
						{image ? (
							<div className="hero-service-media relative hidden aspect-[4/3] overflow-hidden rounded-lg lg:block">
								<Image
									alt={imageAlt?.trim() || title}
									className="object-cover"
									decoding="sync"
									fill
									priority
									quality={65}
									sizes="26rem"
									src={image}
								/>
							</div>
						) : null}
					</div>
				</div>
			</header>
		)
	}

	/*
	  Company, area and utility pages. Same dark band as the home and service
	  heroes so every template opens in the brand, with the page photo as a
	  faded wash on the right and the call path in the first screen.
	*/
	const actions = showActions ?? true

	return (
		<header className="hero-page surface-hero tex-grid relative overflow-hidden">
			{image ? (
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full opacity-35 lg:w-3/5"
				>
					<Image
						alt=""
						className="object-cover"
						decoding="sync"
						fill
						priority
						quality={50}
						sizes="60vw"
						src={image}
					/>
					<div className="absolute inset-0 bg-linear-to-r from-[var(--dark-1)] via-[color-mix(in_srgb,var(--dark-1)_75%,transparent)] to-transparent" />
					<div className="absolute inset-0 bg-linear-to-t from-[var(--dark-1)] to-transparent" />
				</div>
			) : null}

			{image ? (
				<span className="sr-only">{imageAlt?.trim() || title}</span>
			) : null}

			<div className="container-shell relative py-12 sm:py-16 lg:py-20">
				<BreadcrumbTrail items={trail} tone="dark" />
				<div className="section-head max-w-2xl">
					{eyebrow ? <p className="spec-label">{eyebrow}</p> : null}
					<h1 className="type-headline text-white">{title}</h1>
					<p className="type-lead text-on-dark-muted">{description}</p>
				</div>
				{actions ? (
					<div className="mt-8 flex min-w-0 flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center">
						<CallButton
							className="w-full sm:w-auto"
							desktopLabel={`Call ${contactInfo.phoneDisplay}`}
							prefer="dial"
							size="lg"
						/>
						{pageCta === "call" ? null : (
							<Link
								prefetch={false}
								className={cn(
									buttonVariants({
										variant: "inverse",
										size: "lg",
										wrap: true,
									}),
									"w-full sm:w-auto",
								)}
								href="/contact"
							>
								Request a free quote
							</Link>
						)}
					</div>
				) : null}
				{actions ? (
					<ul className="text-on-dark-muted mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[0.8125rem] font-bold">
						{serviceHeroFacts.map((fact) => (
							<li className="flex items-center gap-2" key={fact}>
								<BadgeCheck
									aria-hidden="true"
									className="text-primary-bright size-4 shrink-0"
								/>
								{fact}
							</li>
						))}
					</ul>
				) : null}
			</div>
		</header>
	)
}
