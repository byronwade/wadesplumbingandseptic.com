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
			<section className="container-shell section-y grid gap-5 md:grid-cols-2 lg:grid-cols-3">
				{posts.map((post) => (
					<Card
						className="group flex h-full flex-col overflow-hidden"
						key={post.slug}
					>
						<Link
							className="relative block aspect-[16/9] overflow-hidden bg-muted"
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
							<Badge className="w-fit" tone="muted">
								{post.category ?? "Expert Tips"}
							</Badge>
							<CardTitle className="mt-3 group-hover:text-primary">
								<Link href={`/${post.slug}` as Route}>{post.title}</Link>
							</CardTitle>
							<CardDescription>{post.description}</CardDescription>
						</CardHeader>
						<CardContent className="mt-auto">
							{post.date ? (
								<p className="mb-4 flex items-center gap-2 text-xs font-bold text-muted-foreground">
									<CalendarDays className="size-4 text-primary" />
									{post.date}
								</p>
							) : null}
							<Link
								className="inline-flex items-center gap-2 text-sm font-extrabold text-primary"
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
