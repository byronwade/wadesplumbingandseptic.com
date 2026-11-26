import type { Metadata, Route } from "next"
import Link from "next/link"
import { ArrowRight } from "@/components/icons"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { JsonLd } from "@/components/json-ld"
import { RankedContentArchive } from "@/components/ranked-content-archive"
import { getCollection } from "@/lib/content"
import {
	breadcrumbJsonLd,
	buildPageMetadata,
	collectionPageJsonLd,
} from "@/lib/seo"
import {
	serviceCategories,
	serviceCategorySlugs,
} from "@/lib/service-categories"

const description =
	"Residential plumbing, commercial plumbing, and septic installation across Santa Cruz County and selected Santa Clara County communities. Quotes are free."

export const metadata: Metadata = buildPageMetadata({
	title: "Plumbing & Septic Services",
	description,
	pathname: "/services",
	image: "/images/work/commercial-plumbing-installation.webp",
	eyebrow: "What we do",
})

export default async function ServicesPage() {
	const items = await getCollection("services")

	return (
		<main id="main-content">
			<ContentHero
				description="Pick a service, or tell us what is going on. Quotes are free. We do not pump septic tanks."
				eyebrow="What we do"
				image="/images/work/commercial-plumbing-installation.webp"
				imageAlt="Professional plumbing installation"
				indexKind="service"
				title="Plumbing & Septic Services"
				variant="index"
			/>

			<nav
				aria-label="Service types"
				className="container-shell section-y-tight"
			>
				<ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					{serviceCategorySlugs.map((slug) => {
						const category = serviceCategories[slug]
						return (
							<li key={slug}>
								<Link
									prefetch={false}
									className="surface-panel panel-inset flex h-full min-h-11 flex-col rounded-lg no-underline"
									href={`/service-category/${slug}` as Route}
								>
									<span className="type-subtitle text-[1.0625rem]">
										{category.label}
									</span>
									<span className="text-muted-foreground mt-2 text-sm leading-relaxed">
										{category.description}
									</span>
									<span className="text-primary mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
										Browse {category.label.toLowerCase()}
										<ArrowRight aria-hidden="true" className="size-4" />
									</span>
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>

			<RankedContentArchive
				allLabel="All services"
				emptyLabel="No services in this category."
				noun={{ singular: "service", plural: "services" }}
				pageSize={13}
				variant="service"
			/>

			<ContactCta
				description="Describe the leak, backup, water heater, or septic issue. We will point you to the right service."
				title="Not sure which service you need?"
			/>
			<JsonLd
				data={[
					collectionPageJsonLd({
						name: "Plumbing & Septic Services",
						description,
						pathname: "/services",
						items: items.map((item) => ({
							name: item.title,
							path: `/service-offerings/${item.slug}`,
						})),
					}),
					breadcrumbJsonLd([
						{ name: "Home", path: "/" },
						{ name: "Services", path: "/services" },
					]),
				]}
			/>
		</main>
	)
}
