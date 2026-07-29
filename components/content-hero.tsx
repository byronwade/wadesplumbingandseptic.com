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
		<section className="relative overflow-hidden bg-[#111] text-white">
			{image ? (
				<>
					<Image
						alt={imageAlt ?? ""}
						className="object-cover opacity-25"
						fill
						priority
						quality={70}
						sizes="100vw"
						src={image}
					/>
					<div className="absolute inset-0 bg-linear-to-r from-[#111] via-[#111]/90 to-[#111]/50" />
				</>
			) : null}
			<div className="bg-primary/12 pointer-events-none absolute -top-48 -right-40 size-[36rem] rounded-full blur-3xl" />
			<div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 lg:py-20">
				<nav
					className="mb-7 flex flex-wrap items-center gap-1 text-xs font-bold text-neutral-400"
					aria-label="Breadcrumb"
				>
					<Link className="hover:text-white" href="/">
						Home
					</Link>
					{parent ? (
						<>
							<ChevronRight className="size-3" />
							<Link className="hover:text-white" href={parent.href}>
								{parent.label}
							</Link>
						</>
					) : null}
				</nav>
				{eyebrow ? <Badge>{eyebrow}</Badge> : null}
				<h1 className="mt-5 max-w-4xl text-4xl leading-tight font-black tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
					{title}
				</h1>
				<p className="mt-5 max-w-3xl text-lg leading-relaxed text-neutral-300">
					{description}
				</p>
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
