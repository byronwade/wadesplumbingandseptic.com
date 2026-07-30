import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Phone } from "@/components/icons"

import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export function ContentHero({
	title,
	description,
	eyebrow,
	image,
	imageAlt,
	parent,
}: {
	title: string
	description: string
	eyebrow?: string
	image?: string
	imageAlt?: string
	parent?: { href: Route; label: string }
}) {
	/*
	 * Sizes at --type-headline, not --type-display. Display belongs to the home
	 * hero alone; run through here it set titles like "Ensure Optimal Drain Flow
	 * in Santa Cruz County, CA" at 68px and pushed them to four cramped lines.
	 *
	 * .surface-hero puts this on the --dark-1 elevation with a top hairline, plus
	 * the grid and glow textures. Previously it shared the header's flat ink, so
	 * the header and the hero read as one slab with no visible boundary. The
	 * photo sits at low opacity as a texture on the right rather than a scrim
	 * across the whole band, which is what made every page look identical.
	 */
	return (
		<section className="surface-hero tex-grid tex-glow overflow-hidden">
			{image ? (
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full lg:w-3/5"
				>
					<Image
						alt=""
						className="object-cover opacity-30"
						fill
						priority
						quality={55}
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

			<div className="container-shell relative py-14 sm:py-16 lg:py-20">
				<nav
					className="text-on-dark-subtle mb-6 flex flex-wrap items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.1em] uppercase"
					aria-label="Breadcrumb"
				>
					<Link
						className="transition-colors hover:text-white"
						href="/"
						prefetch={false}
					>
						Home
					</Link>
					{parent ? (
						<>
							<ChevronRight className="size-3 opacity-60" aria-hidden="true" />
							<Link
								className="transition-colors hover:text-white"
								href={parent.href}
								prefetch={false}
							>
								{parent.label}
							</Link>
						</>
					) : null}
				</nav>

				<div className="section-head max-w-3xl">
					{eyebrow ? <p className="spec-label">{eyebrow}</p> : null}
					<h1 className="type-headline text-white">{title}</h1>
					<p className="type-lead text-on-dark-muted max-w-2xl">
						{description}
					</p>
				</div>

				<div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
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
