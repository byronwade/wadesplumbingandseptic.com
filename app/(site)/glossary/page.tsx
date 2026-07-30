import type { Metadata } from "next"
import type { Route } from "next"
import Link from "next/link"
import { cacheLife, cacheTag } from "next/cache"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { JsonLd } from "@/components/json-ld"
import {
	getGlossaryTerms,
	glossaryHubPath,
	glossaryHubs,
} from "@/lib/glossary"
import {
	absoluteUrl,
	breadcrumbJsonLd,
	buildPageMetadata,
} from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
	title: "Plumbing & Septic Glossary",
	description:
		"Two plain-English glossaries for Santa Cruz County homeowners: plumbing terms and septic system terms from Wade's licensed local team.",
	pathname: "/glossary",
	image: "/images/work/precision-valve-installation.webp",
})

async function GlossaryIndexBody() {
	"use cache"
	cacheTag("glossary:plumbing", "glossary:septic")
	cacheLife("max")

	const [plumbing, septic] = await Promise.all([
		getGlossaryTerms("plumbing"),
		getGlossaryTerms("septic"),
	])

	const hubs = [
		{
			...glossaryHubs.plumbing,
			count: plumbing.length,
			href: glossaryHubPath("plumbing"),
		},
		{
			...glossaryHubs.septic,
			count: septic.length,
			href: glossaryHubPath("septic"),
		},
	]

	return (
		<section className="container-shell section-y space-y-[var(--space-block)]">
			<div className="reveal mx-auto max-w-3xl space-y-4 text-center">
				<p className="type-lead">
					Whether you are reading an estimate, preparing for a repair visit, or
					trying to understand a septic inspection report, clear definitions
					help you make better decisions for your Santa Cruz County home or
					business.
				</p>
				<p className="type-body text-muted-foreground">
					Wade&apos;s Plumbing &amp; Septic built these glossaries from the
					language our crews use every week on coastal, hillside, and foothill
					jobs.
				</p>
			</div>

			<ul className="grid gap-6 md:grid-cols-2">
				{hubs.map((hub) => (
					<li key={hub.topic}>
						<Link
							className="border-border bg-background hover:border-primary/40 group flex h-full flex-col gap-4 rounded-lg border p-6 transition-colors"
							href={hub.href as Route}
						>
							<p className="spec-label">{hub.eyebrow}</p>
							<h2 className="type-title group-hover:text-primary transition-colors">
								{hub.title}
							</h2>
							<p className="type-body text-muted-foreground flex-1">
								{hub.description}
							</p>
							<p className="type-meta font-bold">
								{hub.count} terms · Browse A to Z
							</p>
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
}

export default function GlossaryIndexPage() {
	return (
		<main id="main-content">
			<ContentHero
				description="Plain-English plumbing and septic definitions written for Santa Cruz County homeowners and property managers."
				eyebrow="Reference"
				image="/images/work/precision-valve-installation.webp"
				imageAlt="Professional plumbing workmanship"
				showActions={false}
				title="Plumbing & Septic Glossary"
				variant="page"
			/>
			<GlossaryIndexBody />
			<ContactCta
				description="If a definition still leaves you unsure what is happening at your property, call and ask. We will explain the next step in plain English."
				title="Still sorting through the jargon?"
			/>
			<JsonLd
				data={[
					{
						"@context": "https://schema.org",
						"@type": "CollectionPage",
						name: "Plumbing & Septic Glossary",
						description:
							"Plumbing and septic glossaries for Santa Cruz County homeowners.",
						url: absoluteUrl("/glossary"),
						hasPart: [
							{
								"@type": "CollectionPage",
								name: glossaryHubs.plumbing.title,
								url: absoluteUrl(glossaryHubPath("plumbing")),
							},
							{
								"@type": "CollectionPage",
								name: glossaryHubs.septic.title,
								url: absoluteUrl(glossaryHubPath("septic")),
							},
						],
					},
					breadcrumbJsonLd([
						{ name: "Home", path: "/" },
						{ name: "Glossary", path: "/glossary" },
					]),
				]}
			/>
		</main>
	)
}
