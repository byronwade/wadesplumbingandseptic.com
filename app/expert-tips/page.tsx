import type { Metadata } from "next"
import type { Route } from "next"
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
import { getCollection } from "@/lib/content"

export const metadata: Metadata = {
	title: "Expert Plumbing & Septic Tips",
	description:
		"Practical plumbing and septic education for Santa Cruz County homeowners from Wade's licensed local team.",
	alternates: { canonical: "/expert-tips" },
}

export default function ExpertTipsPage() {
	const posts = getCollection("posts")

	return (
		<main id="main-content">
			<ContentHero
				description="Practical plumbing and septic education from the people doing the work. Straight answers, useful maintenance guidance, and local insight."
				eyebrow="Homeowner Resources"
				image="/images/water-heater.jpeg"
				imageAlt="Professional plumbing maintenance"
				title="Expert Tips & Homeowner Guides"
			/>

			<section className="mx-auto max-w-7xl px-4 py-16 md:px-8 lg:py-20">
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{posts.map((post) => (
						<Card className="group flex h-full flex-col" key={post.slug}>
							<CardHeader>
								<Badge className="w-fit">
									{post.category ?? "Expert Tips"}
								</Badge>
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
				</div>
			</section>

			<ContactCta title="Have a plumbing or septic question?" />
		</main>
	)
}
