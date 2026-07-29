import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Phone } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"

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
						className="object-cover opacity-30"
						fill
						priority
						quality={70}
						sizes="100vw"
						src={image}
					/>
					<div className="absolute inset-0 bg-linear-to-r from-ink via-ink/90 to-ink/55" />
				</>
			) : null}
			<div className="container-shell relative py-16 lg:py-20">
				<nav
					className="mb-7 flex flex-wrap items-center gap-1 text-xs font-bold text-white/50"
					aria-label="Breadcrumb"
				>
					<Link className="transition-colors hover:text-white" href="/">
						Home
					</Link>
					{parent ? (
						<>
							<ChevronRight className="size-3" />
							<Link
								className="transition-colors hover:text-white"
								href={parent.href}
							>
								{parent.label}
							</Link>
						</>
					) : null}
				</nav>
				{eyebrow ? <Badge tone="inverse">{eyebrow}</Badge> : null}
				<h1 className="type-display mt-5 max-w-4xl text-white">{title}</h1>
				<p className="type-lead mt-5 max-w-3xl">{description}</p>
				<div className="mt-8 flex flex-col gap-3 sm:flex-row">
					<a
						className={buttonVariants({ size: "xl" })}
						href={siteConfig.phoneHref}
					>
						<Phone />
						Call {siteConfig.phone}
					</a>
					<Link
						className={buttonVariants({ variant: "inverse", size: "xl" })}
						href="/contact"
					>
						Get a Free Quote
					</Link>
				</div>
			</div>
		</section>
	)
}
