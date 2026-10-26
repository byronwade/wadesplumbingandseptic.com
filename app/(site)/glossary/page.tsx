import type { Metadata } from "next"
import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { cacheLife, cacheTag } from "next/cache"

import { ArrowRight } from "@/components/icons"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { JsonLd } from "@/components/json-ld"
import { buttonVariants } from "@/components/ui/button"
import {
	getGlossaryTerms,
	glossaryHubPath,
	glossaryHubs,
	glossaryTermPath,
} from "@/lib/glossary"
import { absoluteUrl, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo"
import { cn } from "@/lib/utils"

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
			terms: plumbing,
			href: glossaryHubPath("plumbing"),
		},
		{
			...glossaryHubs.septic,
			terms: septic,
			href: glossaryHubPath("septic"),
		},
	]

	return (
		<>
			<section className="section-y">
				<div className="container-shell band-split">
					<div className="band-split-head reveal">
						<p className="spec-label">How to use it</p>
					</div>
					<div className="reveal max-w-3xl min-w-0 space-y-4">
						<p className="type-lead">
							Whether you are reading an estimate, preparing for a repair visit,
							or trying to understand a septic inspection report, clear
							definitions help you make better decisions for your Santa Cruz
							County home or business.
						</p>
						<p className="type-body text-muted-foreground">
							Wade&apos;s Plumbing &amp; Septic built these glossaries from the
							language our crews use every week on coastal, hillside, and
							foothill jobs.
						</p>
					</div>
				</div>
			</section>

			<section className="surface-sunken border-border section-y border-y">
				<ul className="container-shell grid grid-cols-1 gap-[var(--space-grid)] md:grid-cols-2">
					{hubs.map((hub) => (
						<li
							className="surface-panel reveal flex min-w-0 flex-col overflow-hidden rounded-lg [overflow-wrap:anywhere]"
							key={hub.topic}
						>
							<div className="bg-muted relative aspect-[16/7]">
								<Image
									alt={hub.imageAlt}
									className="object-cover"
									fill
									sizes="(min-width: 768px) 36rem, 100vw"
									src={hub.image}
								/>
							</div>
							<div className="flex flex-1 flex-col gap-4 p-6 px-[min(1.5rem,24px)]">
								<p className="spec-label">{hub.eyebrow}</p>
								<h2 className="type-title">
									<Link
										prefetch={false}
										className="hover:text-primary transition-colors"
										href={hub.href as Route}
									>
										{hub.title}
									</Link>
								</h2>
								<p className="type-body text-muted-foreground">
									{hub.description}
								</p>
								<ul
									aria-label={`Sample ${hub.topic} terms`}
									className="flex flex-wrap gap-2"
								>
									{hub.terms.slice(0, 8).map((term) => (
										<li key={term.slug}>
											<Link
												prefetch={false}
												className="border-border bg-background hover:border-primary hover:text-primary inline-flex rounded-md border px-3 py-1.5 text-sm font-bold transition-colors"
												href={glossaryTermPath(hub.topic, term.slug) as Route}
											>
												{term.term}
											</Link>
										</li>
									))}
								</ul>
								<Link
									prefetch={false}
									className={cn(
										buttonVariants({ variant: "outline", wrap: true }),
										"mt-auto w-full sm:w-auto sm:self-start",
									)}
									href={hub.href as Route}
								>
									Browse all {hub.terms.length} terms A to Z
									<ArrowRight aria-hidden="true" />
								</Link>
							</div>
						</li>
					))}
				</ul>
			</section>
		</>
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
