import type { Route } from "next"
import Link from "next/link"

import { ContentHero } from "@/components/content-hero"
import { JsonLd } from "@/components/json-ld"
import { ProtectedPhoneText } from "@/components/protected-contact"
import { glossaryHubPath, glossaryTermPath } from "@/lib/glossary"
import type { GlossaryTerm, GlossaryTopic } from "@/lib/glossary/types"
import { absoluteUrl, breadcrumbJsonLd, definedTermJsonLd } from "@/lib/seo"
function paragraphs(text: string) {
	return text
		.split(/\n\n+/)
		.map((part) => part.trim())
		.filter(Boolean)
}

export function GlossaryTermPage({
	topic,
	term,
	relatedTerms,
	relatedServices,
}: {
	topic: GlossaryTopic
	term: GlossaryTerm
	relatedTerms: GlossaryTerm[]
	relatedServices: Array<{ slug: string; title: string }>
}) {
	const hubPath = glossaryHubPath(topic)
	const hubLabel =
		topic === "plumbing" ? "Plumbing Glossary" : "Septic Glossary"
	const termPath = glossaryTermPath(topic, term.slug)
	const otherTopic: GlossaryTopic = topic === "plumbing" ? "septic" : "plumbing"

	const breadcrumbs = [
		{ name: "Home", path: "/" },
		{ name: "Glossary", path: "/glossary" },
		{ name: hubLabel, path: hubPath },
		{ name: term.term, path: termPath },
	]

	return (
		<main id="main-content">
			<ContentHero
				breadcrumbs={[
					{ href: "/" as Route, label: "Home" },
					{ href: "/glossary" as Route, label: "Glossary" },
					{ href: hubPath as Route, label: hubLabel },
					{ label: term.term },
				]}
				description={term.shortDefinition}
				eyebrow={hubLabel}
				image={
					topic === "plumbing"
						? "/images/work/precision-valve-installation.webp"
						: "/images/work/engineered-septic-hero.webp"
				}
				imageAlt={term.term}
				title={term.term}
				variant="article"
			/>

			<article className="article-shell section-y space-y-8">
				{term.alsoKnownAs?.length ? (
					<p className="type-meta text-muted-foreground font-bold">
						Also called: {term.alsoKnownAs.join(", ")}
					</p>
				) : null}

				<section aria-labelledby="definition-heading" className="space-y-4">
					<h2 className="type-title" id="definition-heading">
						What it means
					</h2>
					{paragraphs(term.definition).map((paragraph) => (
						<p className="type-body" key={paragraph.slice(0, 40)}>
							{paragraph}
						</p>
					))}
				</section>

				<section aria-labelledby="local-heading" className="space-y-4">
					<h2 className="type-title" id="local-heading">
						Why it matters in Santa Cruz County
					</h2>
					<p className="type-body">{term.localContext}</p>
				</section>

				<section
					aria-labelledby="tip-heading"
					className="border-border bg-muted/40 rounded-lg border p-5"
				>
					<h2 className="type-card-title mb-2" id="tip-heading">
						Homeowner tip
					</h2>
					<p className="type-body">{term.homeownerTip}</p>
				</section>

				{relatedServices.length ? (
					<section aria-labelledby="services-heading" className="space-y-4">
						<h2 className="type-title" id="services-heading">
							Related Wade&apos;s services
						</h2>
						<ul className="grid gap-3 sm:grid-cols-2">
							{relatedServices.map((service) => (
								<li key={service.slug}>
									<Link
										className="border-border hover:border-primary/40 hover:bg-muted/40 block rounded-lg border p-4 font-bold transition-colors"
										href={`/service-offerings/${service.slug}` as Route}
										prefetch={false}
									>
										{service.title}
									</Link>
								</li>
							))}
						</ul>
					</section>
				) : null}

				{relatedTerms.length ? (
					<section
						aria-labelledby="related-terms-heading"
						className="space-y-4"
					>
						<h2 className="type-title" id="related-terms-heading">
							Related glossary terms
						</h2>
						<ul className="flex flex-wrap gap-2">
							{relatedTerms.map((related) => (
								<li key={related.slug}>
									<Link
										className="border-border hover:border-primary/40 hover:bg-muted/40 inline-flex rounded-md border px-3 py-1.5 text-sm font-bold transition-colors"
										href={glossaryTermPath(topic, related.slug) as Route}
										prefetch={false}
									>
										{related.term}
									</Link>
								</li>
							))}
						</ul>
					</section>
				) : null}

				<p className="type-body text-muted-foreground">
					Also explore the{" "}
					<Link
						className="text-primary font-bold underline-offset-2 hover:underline"
						href={glossaryHubPath(otherTopic) as Route}
					>
						{otherTopic === "plumbing"
							? "Plumbing Glossary"
							: "Septic Glossary"}
					</Link>{" "}
					or call{" "}
					<ProtectedPhoneText className="text-primary font-bold underline-offset-2 hover:underline" />{" "}
					with questions about your property.
				</p>
			</article>

			<JsonLd
				data={[
					definedTermJsonLd({
						name: term.term,
						description: term.shortDefinition,
						url: termPath,
						inDefinedTermSet: hubPath,
					}),
					{
						"@context": "https://schema.org",
						"@type": "WebPage",
						name: `${term.term}: ${hubLabel}`,
						description: term.shortDefinition,
						url: absoluteUrl(termPath),
						isPartOf: { "@id": absoluteUrl("/#website") },
						about: { "@id": absoluteUrl("/#business") },
						mainEntity: {
							"@type": "DefinedTerm",
							name: term.term,
							description: term.shortDefinition,
							url: absoluteUrl(termPath),
						},
					},
					breadcrumbJsonLd(breadcrumbs),
				]}
			/>
		</main>
	)
}
