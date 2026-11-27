import type { Metadata, Route } from "next"

import { CompanyFacts } from "@/components/business-facts"
import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { GoogleReviewInvite } from "@/components/google-reviews"
import { HomeFaq } from "@/components/home-faq"
import { JsonLd } from "@/components/json-ld"
import type { ContentDocument } from "@/lib/content"
import { normalizeConversion } from "@/lib/content-conversion"
import {
	factsFaqs,
	factsPageDescription,
	factsPageEyebrow,
	factsPagePath,
	factsPageTitle,
} from "@/lib/public-facts"
import {
	breadcrumbJsonLd,
	buildPageMetadata,
	companyFactsJsonLd,
	faqPageJsonLd,
	webPageJsonLd,
} from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
	title: factsPageTitle,
	description: factsPageDescription,
	pathname: factsPagePath,
	image: "/images/team/byron-working.webp",
	eyebrow: factsPageEyebrow,
})

export default function FactsPage() {
	const faqs = factsFaqs()
	const document: ContentDocument = {
		title: factsPageTitle,
		description: factsPageDescription,
		slug: factsPagePath.slice(1),
		content: "",
		conversion: normalizeConversion(null, {
			title: factsPageTitle,
			description: factsPageDescription,
			slug: factsPagePath.slice(1),
			eyebrow: factsPageEyebrow,
		}),
	}

	return (
		<main id="main-content">
			<ContentHero
				breadcrumbs={[
					{ href: "/" as Route, label: "Home" },
					{ label: "Company Facts" },
				]}
				description={factsPageDescription}
				eyebrow={factsPageEyebrow}
				title={factsPageTitle}
				variant="page"
			/>
			<CompanyFacts currentPath={factsPagePath} />
			<section
				aria-labelledby="facts-faq-heading"
				className="border-border border-b"
			>
				<div className="container-shell py-8 sm:py-10">
					<h2 className="spec-label" id="facts-faq-heading">
						Frequently asked questions
					</h2>
					<p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
						The same facts as the list above, in question form so assistants can
						quote a direct answer.
					</p>
					<div className="mt-6">
						<HomeFaq faqs={faqs} />
					</div>
				</div>
			</section>
			<GoogleReviewInvite message="If we recently finished plumbing or septic work at your home, you can leave us a review on Google." />
			<ContactCta
				description="Call during office hours or request a free quote. Flat-rate pricing, quoted on site before work begins."
				title="Ready for a free quote?"
			/>
			<JsonLd
				data={[
					webPageJsonLd(document),
					breadcrumbJsonLd([
						{ name: "Home", path: "/" },
						{ name: "Company Facts", path: factsPagePath },
					]),
					companyFactsJsonLd(),
					faqPageJsonLd(faqs),
				]}
			/>
		</main>
	)
}
