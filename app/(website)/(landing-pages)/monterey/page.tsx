import type { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import Script from "next/script";

export const metadata: Metadata = {
	title: "Monterey Plumbing Services | 24/7 Emergency Plumber",
	description: "Professional plumbing services in Monterey County. Available 24/7 for emergencies, repairs, installations & maintenance. Licensed & insured plumbers.",
	keywords: ["Monterey plumber", "emergency plumbing Monterey", "plumbing services Monterey", "24/7 plumber Monterey", "Monterey County plumber"],
	openGraph: {
		title: "Monterey's Trusted Plumbing Services | Wade's Plumbing & Septic",
		description: "Professional plumbing services in Monterey. 24/7 emergency service, expert solutions, and guaranteed satisfaction.",
		url: "https://www.wadesplumbingandseptic.com/monterey",
		siteName: "Wade's Plumbing & Septic",
		locale: "en_US",
		type: "website",
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "ProfessionalService",
	name: "Wade's Plumbing & Septic - Monterey",
	description: "Professional plumbing services in Monterey County. Available 24/7 for emergencies, repairs, installations & maintenance.",
	url: "https://www.wadesplumbingandseptic.com/monterey",
	telephone: "+1-831-225-4344",
	areaServed: {
		"@type": "City",
		name: "Monterey",
		"@id": "https://www.wikidata.org/wiki/Q485477",
	},
	priceRange: "$$",
	openingHoursSpecification: {
		"@type": "OpeningHoursSpecification",
		dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
		opens: "00:00",
		closes: "23:59",
	},
	address: {
		"@type": "PostalAddress",
		streetAddress: "7737 hwy 9",
		addressLocality: "Ben Lomond",
		addressRegion: "CA",
		postalCode: "95005",
		addressCountry: "US",
	},
};

export default function Monterey() {
	return (
		<>
			<Script id="monterey-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="mb-12">
				<div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:py-40 lg:px-8">
					<div className="mx-auto grid max-w-[40rem] grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
						<div className="flex flex-col col-span-2 lg:pb-6">
							<div className="space-y-6">
								<h1 className="text-4xl font-extrabold leading-none tracking-tight text-slate-900 sm:text-5xl sm:leading-[3.5rem]">Monterey Plumbing Services</h1>
								<p className="text-base leading-7 text-slate-700">Professional plumbing services in Monterey County. Available 24/7 for emergencies, repairs, installations & maintenance.</p>
								<div className="flex flex-wrap gap-2">
									<span className="px-3 py-1 text-sm font-semibold rounded-full bg-brand-100 text-brand-800">Emergency Service</span>
									<span className="px-3 py-1 text-sm font-semibold rounded-full bg-brand-100 text-brand-800">Repairs</span>
									<span className="px-3 py-1 text-sm font-semibold rounded-full bg-brand-100 text-brand-800">Installations</span>
									<span className="px-3 py-1 text-sm font-semibold rounded-full bg-brand-100 text-brand-800">Maintenance</span>
								</div>
							</div>
						</div>
						<div className="relative lg:col-span-2">
							<ContactForm />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
