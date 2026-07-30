import type { Route } from "next"
import Link from "next/link"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { JsonLd } from "@/components/json-ld"
import { buttonVariants } from "@/components/ui/button"
import {
	glossaryHubPath,
	glossaryTermPath,
	groupTermsByLetter,
} from "@/lib/glossary"
import type {
	GlossaryHub,
	GlossaryTerm,
	GlossaryTopic,
} from "@/lib/glossary/types"
import {
	absoluteUrl,
	breadcrumbJsonLd,
	definedTermSetJsonLd,
} from "@/lib/seo"
import { cn } from "@/lib/utils"

export function GlossaryTopicHub({
	hub,
	terms,
	otherTopic,
}: {
	hub: GlossaryHub
	terms: GlossaryTerm[]
	otherTopic: { topic: GlossaryTopic; label: string }
}) {
	const groups = groupTermsByLetter(terms)
	const letters = groups.map(([letter]) => letter)
	const hubPath = glossaryHubPath(hub.topic)

	const breadcrumbs = [
		{ name: "Home", path: "/" },
		{ name: "Glossary", path: "/glossary" },
		{ name: hub.title, path: hubPath },
	]

	return (
		<main id="main-content">
			<ContentHero
				breadcrumbs={[
					{ href: "/" as Route, label: "Home" },
					{ href: "/glossary" as Route, label: "Glossary" },
					{ label: hub.title },
				]}
				description={hub.description}
				eyebrow={hub.eyebrow}
				image={hub.image}
				imageAlt={hub.imageAlt}
				title={hub.title}
			/>

			<section className="container-shell section-y space-y-[var(--space-block)]">
				<div className="reveal mx-auto max-w-3xl space-y-4">
					{hub.intro.map((paragraph) => (
						<p className="type-lead" key={paragraph.slice(0, 48)}>
							{paragraph}
						</p>
					))}
					<p className="type-body text-muted-foreground">
						Looking for the other glossary? Browse the{" "}
						<Link
							className="text-primary font-bold underline-offset-2 hover:underline"
							href={glossaryHubPath(otherTopic.topic) as Route}
						>
							{otherTopic.label}
						</Link>
						.
					</p>
				</div>

				<nav
					aria-label={`${hub.title} A to Z`}
					className="reveal flex flex-wrap justify-center gap-2"
				>
					{letters.map((letter) => (
						<a
							className={cn(
								buttonVariants({ variant: "outline", size: "sm" }),
								"min-w-10 font-mono",
							)}
							href={`#letter-${letter}`}
							key={letter}
						>
							{letter}
						</a>
					))}
				</nav>

				<div className="space-y-[var(--space-block)]">
					{groups.map(([letter, letterTerms]) => (
						<section
							aria-labelledby={`letter-${letter}-heading`}
							className="reveal"
							id={`letter-${letter}`}
							key={letter}
						>
							<h2
								className="type-title border-border mb-6 border-b pb-3"
								id={`letter-${letter}-heading`}
							>
								{letter}
							</h2>
							<ul className="grid gap-4 md:grid-cols-2">
								{letterTerms.map((term) => (
									<li key={term.slug}>
										<Link
											className="border-border bg-background hover:border-primary/40 hover:bg-muted/40 group flex h-full flex-col gap-2 rounded-lg border p-5 transition-colors"
											href={
												glossaryTermPath(hub.topic, term.slug) as Route
											}
											prefetch={false}
										>
											<span className="type-card-title group-hover:text-primary transition-colors">
												{term.term}
											</span>
											<span className="type-body text-muted-foreground text-sm">
												{term.shortDefinition}
											</span>
										</Link>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
			</section>

			<ContactCta
				description="If a term on this page matches something failing at your property, call and we will help you sort out the next practical step."
				title="Need this explained for your home?"
			/>

			<JsonLd
				data={[
					{
						"@context": "https://schema.org",
						"@type": "CollectionPage",
						name: hub.title,
						description: hub.description,
						url: absoluteUrl(hubPath),
						isPartOf: { "@id": absoluteUrl("/#website") },
						about: { "@id": absoluteUrl("/#business") },
					},
					breadcrumbJsonLd(breadcrumbs),
					definedTermSetJsonLd({
						name: hub.title,
						description: hub.description,
						url: hubPath,
						terms: terms.map((term) => ({
							name: term.term,
							description: term.shortDefinition,
							url: glossaryTermPath(hub.topic, term.slug),
						})),
					}),
				]}
			/>
		</main>
	)
}
