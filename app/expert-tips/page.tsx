import type { Metadata } from "next"
import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarDays } from "lucide-react"
import { Suspense } from "react"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { getCollection } from "@/lib/content"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
	title: "Expert Plumbing & Septic Tips",
	description:
		"Practical plumbing and septic education for Santa Cruz County homeowners from Wade's licensed local team.",
	pathname: "/expert-tips",
	image: "/images/team/byron-working.webp",
})

const FEATURED_COUNT = 9

async function TipsGrid() {
	"use cache"

	const posts = await getCollection("posts")
	const featured = posts.slice(0, FEATURED_COUNT)
	const remaining = posts.slice(FEATURED_COUNT)

	return (
		<section className="container-shell section-y">
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{featured.map((post) => (
					<Card
						className="group flex h-full flex-col overflow-hidden"
						key={post.slug}
					>
						<Link
							aria-label={`Read ${post.title}`}
							className="bg-muted relative block aspect-[16/9] overflow-hidden"
							href={`/${post.slug}` as Route}
							prefetch={false}
							tabIndex={-1}
						>
							<Image
								alt=""
								className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
								fill
								quality={60}
								sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
								src={
									post.image ?? "/images/work/precision-valve-installation.webp"
								}
							/>
						</Link>
						<CardHeader>
							<Badge className="w-fit" tone="muted">
								{post.category ?? "Expert Tips"}
							</Badge>
							<CardTitle className="group-hover:text-primary mt-3">
								<Link href={`/${post.slug}` as Route} prefetch={false}>
									{post.title}
								</Link>
							</CardTitle>
							<CardDescription>{post.description}</CardDescription>
						</CardHeader>
						<CardContent className="mt-auto">
							{post.date ? (
								<p className="text-muted-foreground mb-4 flex items-center gap-2 text-xs font-bold">
									<CalendarDays className="text-primary size-4" />
									{post.date}
								</p>
							) : null}
							<Link
								className="text-primary inline-flex items-center gap-2 text-sm font-extrabold"
								href={`/${post.slug}` as Route}
								prefetch={false}
							>
								Read guide
								<ArrowRight className="size-4" />
							</Link>
						</CardContent>
					</Card>
				))}
			</div>

			{remaining.length > 0 ? (
				<div className="mt-12">
					<h2 className="type-title text-2xl">More guides</h2>
					<ul className="mt-6 divide-y divide-[var(--border)] border-y border-[var(--border)]">
						{remaining.map((post) => (
							<li key={post.slug}>
								<Link
									className="hover:bg-muted/60 flex flex-col gap-1 py-4 transition-colors sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
									href={`/${post.slug}` as Route}
									prefetch={false}
								>
									<span className="font-extrabold tracking-[-0.02em]">
										{post.title}
									</span>
									<span className="text-muted-foreground text-sm">
										{post.category ?? "Expert Tips"}
										{post.date ? ` · ${post.date}` : ""}
									</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			) : null}
		</section>
	)
}

export default function ExpertTipsPage() {
	return (
		<main id="main-content">
			<ContentHero
				description="Practical plumbing and septic education from the people doing the work. Straight answers, useful maintenance guidance, and local insight."
				eyebrow="Homeowner Resources"
				image="/images/team/byron-working.webp"
				imageAlt="Professional plumbing maintenance"
				title="Expert Tips & Homeowner Guides"
			/>

			<Suspense
				fallback={
					<section className="container-shell section-y">
						Loading guides…
					</section>
				}
			>
				<TipsGrid />
			</Suspense>

			<ContactCta title="Have a plumbing or septic question?" />
		</main>
	)
}
