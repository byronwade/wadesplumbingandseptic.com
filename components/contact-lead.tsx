import dynamic from "next/dynamic"
import { Suspense } from "react"

import { QuoteCallEmail } from "@/components/quote-call-email"
import { VirtualBusinessCard } from "@/components/virtual-business-card"
import { callForFreeQuoteLabel, freeQuoteHash } from "@/lib/public-facts"
import {
	quoteEmailConfigured,
	quoteFormErrorFromQuery,
	type QuoteTownOption,
} from "@/lib/quote-request"
import { serviceAreaLocations } from "@/lib/service-areas"

const QuoteForm = dynamic(() =>
	import("@/components/quote-form").then((mod) => mod.QuoteForm),
)

const towns: QuoteTownOption[] = serviceAreaLocations.map((location) => ({
	name: location.name,
	slug: location.slug,
}))

export function ContactLead({
	initialError = null,
	quoteEmailReady = quoteEmailConfigured(),
}: {
	initialError?: string | null
	quoteEmailReady?: boolean
}) {
	return (
		<section className="container-shell section-y-tight" id={freeQuoteHash}>
			<div className="section-head mb-6 max-w-2xl">
				<p className="spec-label">Free quote</p>
				{quoteEmailReady ? (
					<>
						<h2 className="type-title">Tell us what you need</h2>
						<p className="type-lead">
							Name, phone, and a short note. We follow up during office hours.
							Call if you can talk now.
						</p>
					</>
				) : (
					<>
						<h2 className="type-title">{callForFreeQuoteLabel}</h2>
						<p className="type-lead">
							Call or email the office during weekday hours. Quotes are free.
							Call if you can talk now.
						</p>
					</>
				)}
			</div>
			<div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
				{quoteEmailReady ? (
					<QuoteForm initialError={initialError} towns={towns} />
				) : (
					<QuoteCallEmail />
				)}
				<VirtualBusinessCard id="contact-business-card" />
			</div>
		</section>
	)
}

async function ContactLeadFromSearch({
	searchParams,
}: {
	searchParams: Promise<{ quote?: string | string[] | undefined }>
}) {
	const params = await searchParams
	return <ContactLead initialError={quoteFormErrorFromQuery(params.quote)} />
}

/** Reads `?quote=` outside the static shell so /contact still prerenders. */
export function ContactLeadSlot({
	searchParams,
}: {
	searchParams: Promise<{ quote?: string | string[] | undefined }>
}) {
	return (
		<Suspense fallback={<ContactLead />}>
			<ContactLeadFromSearch searchParams={searchParams} />
		</Suspense>
	)
}
