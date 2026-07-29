import type { Metadata } from "next"
import { Suspense } from "react"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { ServiceCard } from "@/components/service-card"
import { getCollection } from "@/lib/content"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
	title: "Plumbing & Septic Services",
	description:
		"Browse residential plumbing, commercial plumbing, and septic services across Santa Cruz County, selected Santa Clara County communities, and Pickens County, Georgia.",
	pathname: "/services",
	image: "/images/work/commercial-plumbing-installation.webp",
})

async function ServiceDirectory() {
	"use cache"

	const services = await getCollection("services")
	const categories = ["Septic", "Plumbing", "Commercial"] as const

	return (
		<div className="container-shell section-y space-y-16">
			{categories.map((category) => {
				const categoryServices = services.filter(
					(service) => service.category === category,
				)

				if (!categoryServices.length) return null

				return (
					<section key={category}>
						<div className="border-border mb-7 flex items-end justify-between gap-5 border-b pb-5">
							<div>
								<p className="type-eyebrow">
									{categoryServices.length} services
								</p>
								<h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em]">
									{category}
								</h2>
							</div>
						</div>
						<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
							{categoryServices.map((service) => (
								<ServiceCard key={service.slug} service={service} />
							))}
						</div>
					</section>
				)
			})}
		</div>
	)
}

export default function ServicesPage() {
	return (
		<main id="main-content">
			<ContentHero
				description="Browse residential plumbing, commercial plumbing, and septic services across Santa Cruz County, selected Santa Clara County communities, and Pickens County, Georgia."
				eyebrow="Browse Services"
				image="/images/work/commercial-plumbing-installation.webp"
				imageAlt="Professional plumbing installation"
				title="All Plumbing & Septic Services"
			/>

			<Suspense
				fallback={
					<div className="container-shell section-y">Loading services…</div>
				}
			>
				<ServiceDirectory />
			</Suspense>

			<ContactCta
				description="Call or message us. We will diagnose the problem and point you to the right service with no pressure."
				title="Not sure which service you need?"
			/>
		</main>
	)
}
