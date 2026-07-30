import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { ChevronRight, Phone } from "@/components/icons"

import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

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

	return (
		<nav
			aria-label="Breadcrumb"
			className={cn(
				"mb-6 flex flex-wrap items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.1em] uppercase",
				light ? "text-muted-foreground" : "text-on-dark-subtle",
			)}
		>
			<ol className="flex flex-wrap items-center gap-1.5">
				{items.map((item, index) => {
					const isCurrent = index === items.length - 1
					return (
						<li
							key={`${item.label}-${index}`}
							className="flex min-w-0 items-center gap-1.5"
						>
							{index > 0 ? (
								<ChevronRight
									aria-hidden="true"
									className="size-3 shrink-0 opacity-60"
								/>
							) : null}
							{item.href && !isCurrent ? (
								<Link
									className={cn(
										"transition-colors",
										light ? "hover:text-foreground" : "hover:text-white",
									)}
									href={item.href}
									prefetch={false}
								>
									{item.label}
								</Link>
							) : (
								<span
									aria-current={isCurrent ? "page" : undefined}
									className={cn(
										"min-w-0 truncate",
										isCurrent
											? light
												? "text-foreground"
												: "text-white/90"
											: undefined,
									)}
									title={item.label}
								>
									{item.label}
								</span>
							)}
						</li>
					)
				})}
			</ol>
		</nav>
	)
}

function HeroCallLink({
	className,
	label,
}: {
	className?: string
	label?: string
}) {
	return (
		<a className={className} href={siteConfig.phoneHref}>
			<Phone aria-hidden="true" />
			{label ?? `Call ${siteConfig.phone}`}
		</a>
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
}) {
	const kind = normalizeVariant(variant)
	const trail = buildBreadcrumbs({ title, parent, breadcrumbs })

	if (kind === "article") {
		return (
			<header className="hero-article border-border border-b">
				<div className="article-shell pt-10 pb-8 sm:pt-14 sm:pb-10">
					<BreadcrumbTrail items={trail} tone="light" />
					<div className="section-head max-w-3xl">
						{eyebrow ? (
							<p className="motion-fade text-primary font-mono text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
								{eyebrow}
							</p>
						) : null}
						<h1 className="type-headline motion-rise text-foreground">
							{title}
						</h1>
						<p className="type-lead motion-rise motion-delay-1 text-muted-foreground max-w-2xl">
							{description}
						</p>
					</div>
					{meta ? (
						<div className="motion-fade motion-delay-2 text-muted-foreground mt-6">
							{meta}
						</div>
					) : null}
				</div>

				{image ? (
					<figure className="hero-article-media motion-rise motion-delay-2">
						<div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[2/1]">
							<Image
								alt={imageAlt?.trim() || title}
								className="object-cover"
								fill
								priority
								quality={75}
								sizes="100vw"
								src={image}
							/>
						</div>
					</figure>
				) : null}
			</header>
		)
	}

	if (kind === "service") {
		const actions = showActions ?? true

		return (
			<header className="hero-service">
				<div className="container-shell pt-10 pb-8 sm:pt-12 sm:pb-10">
					<BreadcrumbTrail items={trail} tone="light" />
					<div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
						<div className="section-head max-w-2xl">
							{eyebrow ? (
								<p className="motion-fade text-primary font-mono text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
									{eyebrow}
								</p>
							) : null}
							<h1 className="type-headline motion-rise text-foreground">
								{title}
							</h1>
							<p className="type-lead motion-rise motion-delay-1 text-muted-foreground">
								{description}
							</p>
						</div>
						{actions ? (
							<div className="motion-rise motion-delay-2 flex shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
								<HeroCallLink
									className={cn(
										buttonVariants({ size: "xl" }),
										"w-full sm:w-auto",
									)}
								/>
								<Link
									className={cn(
										buttonVariants({ variant: "outline", size: "xl" }),
										"w-full sm:w-auto",
									)}
									href="/contact"
									prefetch
								>
									Request service
								</Link>
							</div>
						) : null}
					</div>
				</div>

				{image ? (
					<div className="hero-service-media motion-fade">
						<div className="relative h-[min(52vw,22rem)] w-full sm:h-[min(42vw,28rem)] lg:h-[32rem]">
							<Image
								alt={imageAlt?.trim() || title}
								className="object-cover"
								fill
								priority
								quality={70}
								sizes="100vw"
								src={image}
							/>
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent"
							/>
						</div>
					</div>
				) : null}
			</header>
		)
	}

	if (kind === "index") {
		const tip = indexKind === "tip"

		return (
			<header
				className={cn(
					"hero-index border-border border-b",
					tip ? "hero-index-tip" : "hero-index-service",
				)}
			>
				<div className="container-shell py-12 sm:py-16 lg:py-20">
					<BreadcrumbTrail items={trail} tone="light" />
					<div
						className={cn(
							"grid items-end gap-8",
							image ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]" : undefined,
						)}
					>
						<div className="section-head max-w-2xl">
							{eyebrow ? (
								<p className="motion-fade text-primary font-mono text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
									{eyebrow}
								</p>
							) : null}
							<h1 className="type-headline motion-rise text-foreground">
								{title}
							</h1>
							<p className="type-lead motion-rise motion-delay-1 text-muted-foreground max-w-xl">
								{description}
							</p>
						</div>
						{image ? (
							<div className="motion-rise motion-delay-2 relative hidden aspect-[4/3] overflow-hidden rounded-md lg:block">
								<Image
									alt={imageAlt?.trim() || title}
									className="object-cover"
									fill
									priority
									quality={65}
									sizes="22rem"
									src={image}
								/>
							</div>
						) : null}
					</div>
				</div>
			</header>
		)
	}

	/* Quiet utility / company / area page hero. Less CTA noise than before. */
	const actions = showActions ?? true

	return (
		<header className="hero-page border-border relative overflow-hidden border-b">
			{image ? (
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full opacity-[0.14] lg:w-1/2"
				>
					<Image
						alt=""
						className="object-cover"
						fill
						priority
						quality={50}
						sizes="50vw"
						src={image}
					/>
					<div className="from-background via-background/80 absolute inset-0 bg-linear-to-r to-transparent" />
					<div className="from-background absolute inset-0 bg-linear-to-t to-transparent" />
				</div>
			) : null}

			{image ? (
				<span className="sr-only">{imageAlt?.trim() || title}</span>
			) : null}

			<div className="container-shell relative py-12 sm:py-16 lg:py-20">
				<BreadcrumbTrail items={trail} tone="light" />
				<div className="section-head max-w-2xl">
					{eyebrow ? (
						<p className="motion-fade text-primary font-mono text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
							{eyebrow}
						</p>
					) : null}
					<h1 className="type-headline motion-rise text-foreground">{title}</h1>
					<p className="type-lead motion-rise motion-delay-1 text-muted-foreground">
						{description}
					</p>
				</div>
				{actions ? (
					<div className="motion-rise motion-delay-2 mt-8">
						<Link
							className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
							href="/contact"
							prefetch
						>
							Get in touch
						</Link>
					</div>
				) : null}
			</div>
		</header>
	)
}
