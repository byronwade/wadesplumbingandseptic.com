import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Phone } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export type HeroBreadcrumb = {
	label: string
	/** Omit on the current page crumb (rendered as plain text). */
	href?: Route
}

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

function BreadcrumbTrail({ items }: { items: HeroBreadcrumb[] }) {
	return (
		<nav aria-label="Breadcrumb" className="mb-5 sm:mb-7">
			<ol className="header-muted flex flex-wrap items-center gap-x-1 gap-y-1 text-xs font-bold">
				{items.map((item, index) => {
					const isCurrent = index === items.length - 1
					const separator =
						index > 0 ? (
							<ChevronRight
								aria-hidden="true"
								className="mx-0.5 size-3 shrink-0 opacity-70"
							/>
						) : null

					return (
						<li
							key={`${item.label}-${index}`}
							className="flex min-w-0 items-center"
						>
							{separator}
							{item.href && !isCurrent ? (
								<Link
									className="rounded-sm transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--primary-bright)_70%,transparent)]"
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
										isCurrent ? "text-white/90" : undefined,
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

export function ContentHero({
	title,
	description,
	eyebrow,
	image,
	imageAlt,
	parent,
	breadcrumbs,
}: {
	title: string
	description: string
	eyebrow?: string
	image?: string
	imageAlt?: string
	/** Optional middle crumb (e.g. Services, Expert Tips, Service Areas). */
	parent?: { href: Route; label: string }
	/** Full trail override. Last item is treated as the current page. */
	breadcrumbs?: HeroBreadcrumb[]
}) {
	const trail = buildBreadcrumbs({ title, parent, breadcrumbs })

	return (
		<section className="surface-dark relative overflow-hidden">
			{image ? (
				<div className="pointer-events-none absolute inset-0">
					{/*
					  Wrap fill Image so its absolutely positioned span cannot steal
					  clicks from breadcrumb links and CTAs stacked above.
					*/}
					<Image
						alt={imageAlt?.trim() || title}
						className="object-cover opacity-40 select-none"
						fill
						priority
						quality={55}
						sizes="100vw"
						src={image}
					/>
					<div
						aria-hidden="true"
						className="from-ink/75 via-ink/88 to-ink absolute inset-0 bg-linear-to-b"
					/>
					<div
						aria-hidden="true"
						className="from-ink via-ink/70 to-ink/40 absolute inset-0 bg-linear-to-r"
					/>
				</div>
			) : null}
			<div className="container-shell relative z-10 py-12 sm:py-16 lg:py-20">
				<BreadcrumbTrail items={trail} />
				{eyebrow ? <Badge tone="bright">{eyebrow}</Badge> : null}
				<h1 className="type-display mt-4 max-w-4xl text-white sm:mt-5">
					{title}
				</h1>
				<p className="mt-4 max-w-3xl text-base leading-relaxed text-[#e4e5e7] sm:mt-5 sm:text-lg">
					{description}
				</p>
				<div className="mt-7 flex flex-col items-stretch gap-4 sm:mt-8 sm:flex-row sm:items-center">
					<a
						className={cn(buttonVariants({ size: "xl" }), "w-full sm:w-auto")}
						href={siteConfig.phoneHref}
					>
						<Phone />
						Call {siteConfig.phone}
					</a>
					<Link
						className={cn(
							buttonVariants({ variant: "inverse", size: "xl" }),
							"w-full justify-start sm:w-auto sm:justify-center",
						)}
						href="/contact"
						prefetch
					>
						Get a Free Quote
					</Link>
				</div>
			</div>
		</section>
	)
}
