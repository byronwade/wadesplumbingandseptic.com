import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Phone } from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
	return (
		<section className="surface-dark relative overflow-hidden">
			{image ? (
				<>
					<Image
						alt={imageAlt ?? ""}
						className="object-cover opacity-40"
						fill
						priority
						quality={70}
						sizes="100vw"
						src={image}
					/>
					<div className="from-ink/75 via-ink/88 to-ink absolute inset-0 bg-linear-to-b" />
					<div className="from-ink via-ink/70 to-ink/40 absolute inset-0 bg-linear-to-r" />
				</>
			) : null}
			<div className="container-shell relative py-12 sm:py-16 lg:py-20">
				<nav
					className="header-muted mb-5 flex flex-wrap items-center gap-1 text-xs font-bold sm:mb-7"
					aria-label="Breadcrumb"
				>
					<Link
						className="transition-colors hover:text-white"
						href="/"
						prefetch
					>
						Home
					</Link>
					{parent ? (
						<>
							<ChevronRight className="size-3 opacity-70" />
							<Link
								className="transition-colors hover:text-white"
								href={parent.href}
								prefetch
							>
								{parent.label}
							</Link>
						</>
					) : null}
				</nav>
				{eyebrow ? <Badge tone="bright">{eyebrow}</Badge> : null}
				<h1 className="type-display mt-4 max-w-4xl text-white sm:mt-5">
					{title}
				</h1>
				<p className="mt-4 max-w-3xl text-base leading-relaxed text-[#e4e5e7] sm:mt-5 sm:text-lg">
					{description}
				</p>
				<div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
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
