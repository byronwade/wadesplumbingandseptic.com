import { QuoteForm } from "@/components/quote-form"
import { VirtualBusinessCard } from "@/components/virtual-business-card"
import { freeQuoteHash } from "@/lib/public-facts"
import type { QuoteTownOption } from "@/lib/quote-request"
import { serviceAreaLocations } from "@/lib/service-areas"

const towns: QuoteTownOption[] = serviceAreaLocations.map((location) => ({
	name: location.name,
	slug: location.slug,
}))

export function ContactLead() {
	return (
		<section className="container-shell section-y-tight" id={freeQuoteHash}>
			<div className="section-head mb-6 max-w-2xl">
				<p className="spec-label">Free quote</p>
				<h2 className="type-title">Tell us what you need</h2>
				<p className="type-lead">
					Leave your name, phone, and a short note. We follow up during office
					hours. Calling is faster if you can talk now.
				</p>
			</div>
			<div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
				<QuoteForm towns={towns} />
				<VirtualBusinessCard id="contact-business-card" />
			</div>
		</section>
	)
}
