import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Phone } from "lucide-react"

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
	 * Sizes at --type-headline, not --type-display. Display is the home hero's
	 * alone; run through here it set titles like "Ensure Optimal Drain Flow in
	 * Santa Cruz County, CA" at 68px and pushed them to four cramped lines.
	 *
	 * One scrim instead of the previous three stacked layers, so the work photo
	 * behind it is actually visible.
	 */
	return (
		<section className="surface-dark relative overflow-hidden">
			{image ? (
				<>
					<Image
						alt={imageAlt?.trim() || title}
						className="object-cover opacity-55"
						fill
						priority
						quality={60}
						sizes="100vw"
						src={image}
					/>
					<div className="from-ink via-ink/85 to-ink/45 absolute inset-0 bg-linear-to-r" />
				</>
			) : null}
			<div className="container-shell relative py-14 sm:py-16 lg:py-20">
				<nav
					className="text-on-dark-muted mb-6 flex flex-wrap items-center gap-1.5 text-xs font-bold"
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
					<p className="type-lead text-on-dark-muted">{description}</p>
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
