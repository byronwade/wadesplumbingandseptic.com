import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarDays } from "lucide-react"

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
import type { ContentDocument } from "@/lib/content"

export function ArticleArchive({
	title,
	description,
	posts,
}: {
	title: string
	description: string
	posts: ContentDocument[]
}) {
	return (
		<main id="main-content">
			<ContentHero
				description={description}
				eyebrow={`${posts.length} homeowner guides`}
				image="/images/team/byron-working.webp"
				imageAlt="Wade's field experience"
				parent={{ href: "/expert-tips", label: "Expert Tips" }}
				title={title}
			/>
			<section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 md:grid-cols-2 md:px-8 lg:grid-cols-3 lg:py-20">
				{posts.map((post) => (
					<Card
						className="group flex h-full flex-col overflow-hidden"
						key={post.slug}
					>
						<Link
							className="relative block aspect-[16/9] overflow-hidden bg-neutral-100"
							href={`/${post.slug}` as Route}
							tabIndex={-1}
						>
							<Image
								alt=""
								className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
								fill
								quality={65}
								sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
								src={
									post.image ?? "/images/work/precision-valve-installation.webp"
								}
							/>
						</Link>
						<CardHeader>
							<Badge className="w-fit">{post.category ?? "Expert Tips"}</Badge>
							<CardTitle className="group-hover:text-primary mt-3">
								<Link href={`/${post.slug}` as Route}>{post.title}</Link>
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
								className="text-primary inline-flex items-center gap-2 text-sm font-black"
								href={`/${post.slug}` as Route}
							>
								Read guide
								<ArrowRight className="size-4" />
							</Link>
						</CardContent>
					</Card>
				))}
			</section>
			<ContactCta title="Need professional help?" />
		</main>
	)
}
