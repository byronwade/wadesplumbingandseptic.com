import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Phone } from "@/components/icons"

import { CallButton } from "@/components/call-button"
import { ProtectedContactLink } from "@/components/protected-contact"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
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
		<nav
			aria-label="Breadcrumb"
			className="text-on-dark-subtle mb-6 flex flex-wrap items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.1em] uppercase"
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
									className="transition-colors hover:text-white"
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
	variant = "default",
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
	/** Marketing pages get a stronger photo plane closer to the home hero. */
	variant?: "default" | "marketing"
}) {
	const trail = buildBreadcrumbs({ title, parent, breadcrumbs })
	const marketing = variant === "marketing"

	/*
	 * Sizes at --type-headline, not --type-display. Display belongs to the home
	 * hero alone; run through here it set titles like "Ensure Optimal Drain Flow
	 * in Santa Cruz County, CA" at 68px and pushed them to four cramped lines.
	 *
	 * .surface-hero puts this on the --dark-1 elevation with a top hairline, plus
	 * the grid and glow textures. Previously it shared the header's flat ink, so
	 * the header and the hero read as one slab with no visible boundary. The
	 * photo sits as atmosphere on the right; marketing pages raise opacity so the
	 * image reads as real work rather than a faint texture.
	 */
	return (
		<section className="surface-hero tex-grid tex-glow overflow-hidden">
			{image ? (
				<div
					aria-hidden="true"
					className={cn(
						"pointer-events-none absolute inset-y-0 right-0 -z-10 w-full",
						marketing ? "lg:w-2/3" : "lg:w-3/5",
					)}
				>
					<Image
						alt=""
						className={cn(
							"object-cover",
							marketing ? "opacity-45" : "opacity-30",
						)}
						fill
						priority
						quality={marketing ? 65 : 55}
						sizes="(min-width: 1024px) 60vw, 100vw"
						src={image}
					/>
					<div className="from-dark-1 via-dark-1/70 absolute inset-0 bg-linear-to-r to-transparent" />
					<div className="from-dark-1 absolute inset-0 bg-linear-to-t to-transparent" />
				</div>
			) : null}

			{/* Alt text lives on a real, non-decorative image only when it carries
			    meaning; the background copy above is aria-hidden. */}
			{image ? (
				<span className="sr-only">{imageAlt?.trim() || title}</span>
			) : null}

			<div
				className={cn(
					"container-shell relative",
					marketing ? "py-16 sm:py-20 lg:py-24" : "py-14 sm:py-16 lg:py-20",
				)}
			>
				<BreadcrumbTrail items={trail} />

				<div className="section-head max-w-3xl">
					{eyebrow ? <p className="spec-label">{eyebrow}</p> : null}
					<h1 className="type-headline text-white">{title}</h1>
					<p className="type-lead text-on-dark-muted max-w-2xl">
						{description}
					</p>
				</div>

				{/*
				  Mobile header already exposes a phone icon, so the hero leads with
				  Quote there and keeps the big Call button from sm up.
				*/}
				<div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
					<CallButton
						className="hidden w-full sm:inline-flex sm:w-auto"
						desktopLabel={`Call ${contactInfo.phoneDisplay}`}
						prefer="dial"
						size="xl"
					/>
					<Link
						className={cn(
							buttonVariants({ size: "xl" }),
							"w-full sm:hidden",
						)}
						href="/contact"
						prefetch
					>
						Get a Free Quote
					</Link>
					<Link
						className={cn(
							buttonVariants({ variant: "inverse", size: "xl" }),
							"hidden w-full sm:inline-flex sm:w-auto",
						)}
						href="/contact"
						prefetch
					>
						Get a Free Quote
					</Link>
					<ProtectedContactLink
						className="text-on-dark-muted hover:text-primary-bright inline-flex items-center justify-center gap-2 text-sm font-bold transition-colors sm:hidden"
						kind="vcard"
					>
						<Phone aria-hidden="true" className="size-4" />
						Save our contact
					</ProtectedContactLink>
				</div>
			</div>
		</section>
	)
}
