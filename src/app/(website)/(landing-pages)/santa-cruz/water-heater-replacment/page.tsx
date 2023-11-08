import ContactForm from "@/components/forms/ContactForm";
import Image from "next/image";
import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

export const metadata: Metadata = {
	metadataBase: new URL("https://www.wadesplumbingandseptic.com/"),
	title: {
		default: "Water Heater Replacement in Santa Cruz - Wade's Plumbing & Septic",
		template: "%s | Wade's Plumbing & Septic",
	},
	description: "Expert water heater replacement services in Santa Cruz. Efficient, reliable, and ready for all your water heater needs with Wade's Plumbing & Septic.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	keywords: ["Water Heater Replacement Santa Cruz", "Water Heater Installation", "Water Heater Repair", "Efficient Water Heater Services", "Reliable Water Heater Maintenance"],
	authors: [{ name: "Byron Wade" }, { name: "Byron Wade", url: "https://www.wadesplumbingandseptic.com/" }],
	creator: "Byron Wade",
	publisher: "Byron Wade",
	alternates: {},
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	category: "construction",
	bookmarks: ["https://www.wadesplumbingandseptic.com/"],
	twitter: {
		card: "summary_large_image",
		title: "Expert Water Heater Replacement - Wade's Plumbing & Septic",
		description: "Need water heater replacement in Santa Cruz? Get fast, reliable service with Wade's Plumbing & Septic.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Water Heater Replacement in Santa Cruz - Wade's Plumbing & Septic",
		description: "Professional water heater replacement services in Santa Cruz by Wade's Plumbing & Septic. Fast, reliable, and efficient.",
		url: "https://www.wadesplumbingandseptic.com",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Expert%20Water%20Heater%20Replacement%20Services",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Expert%20Water%20Heater%20Replacement%20Services",
				width: 1800,
				height: 1600,
				alt: "Wade's Plumbing & Septic",
			},
		],
		locale: "en-US",
		type: "website",
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "ProfessionalService",
	additionalType: "http://www.productontology.org/id/Plumbing",
	name: "Wade's Plumbing & Septic",
	address: {
		"@type": "PostalAddress",
		streetAddress: "7737 hwy 9",
		addressLocality: "Ben Lomond",
		addressRegion: "CA",
		postalCode: "95005",
		addressCountry: "US",
	},
	telephone: "+1-831-225-4344",
	url: "https://www.wadesplumbingandseptic.com",
	logo: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
	image: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Expert%20Water%20Heater%20Replacement%20Services",
	description: "Expert water heater replacement services in Santa Cruz, Monterey, and Santa Clara. Fast, reliable, and 24/7 emergency services by Wade's Plumbing & Septic.",
	priceRange: "$$",
	geo: {
		"@type": "GeoCoordinates",
		latitude: "37.1426021",
		longitude: "-121.977974",
	},
	openingHours: "Mo-Su 00:00-23:59",
	sameAs: ["https://www.facebook.com/wadesplumbingandseptic/", "https://www.instagram.com/wadesplumbing/?hl=en"],
};

const jsonFAQLd = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: [
		{
			"@type": "Question",
			name: "Need a water heater replacement in Santa Cruz?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Wade's Plumbing & Septic offers professional water heater replacement services in Santa Cruz, ensuring efficient and reliable solutions for your home or business.",
			},
		},
		{
			"@type": "Question",
			name: "What types of water heaters can Wade's Plumbing & Septic replace?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Our skilled technicians are equipped to replace a variety of water heaters, including tankless, electric, gas, and hybrid models, to meet the specific needs of our customers in Santa Cruz.",
			},
		},
		{
			"@type": "Question",
			name: "How long does it take to replace a water heater?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Most water heater replacements by Wade's Plumbing & Septic are completed on the same day, minimizing disruption to your daily routine and ensuring you have hot water when you need it.",
			},
		},
		{
			"@type": "Question",
			name: "Can Wade's Plumbing & Septic help me choose the right water heater?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Absolutely! We provide expert guidance on selecting the most efficient and cost-effective water heater for your property, considering factors like size, energy efficiency, and your hot water needs.",
			},
		},
		{
			"@type": "Question",
			name: "Does Wade's Plumbing & Septic offer warranties on water heater replacements?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Yes, we stand behind our work with comprehensive warranties on both the water heater units we install and our labor, giving you peace of mind with your investment.",
			},
		},
		{
			"@type": "Question",
			name: "Are there energy-efficient water heaters available through Wade's Plumbing & Septic?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "We offer a range of energy-efficient water heaters, including the latest tankless models, which can help reduce your energy bills and are environmentally friendly.",
			},
		},
		{
			"@type": "Question",
			name: "What is the cost of replacing a water heater with Wade's Plumbing & Septic?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "The cost of water heater replacement varies depending on the type and model you choose. We provide transparent pricing and detailed quotes to ensure there are no surprises.",
			},
		},
		// ... Add more questions and answers if needed
	],
};

const faqs = [
	{
		id: 1,
		question: "Need a water heater replacement in Santa Cruz?",
		answer: "Wade's Plumbing & Septic offers professional water heater replacement services in Santa Cruz, ensuring efficient and reliable solutions for your home or business.",
	},
	{
		id: 2,
		question: "What types of water heaters can Wade's Plumbing & Septic replace?",
		answer: "Our skilled technicians are equipped to replace a variety of water heaters, including tankless, electric, gas, and hybrid models, to meet the specific needs of our customers in Santa Cruz.",
	},
	{
		id: 3,
		question: "How long does it take to replace a water heater?",
		answer: "Most water heater replacements by Wade's Plumbing & Septic are completed on the same day, minimizing disruption to your daily routine and ensuring you have hot water when you need it.",
	},
	{
		id: 4,
		question: "Can Wade's Plumbing & Septic help me choose the right water heater?",
		answer: "Absolutely! We provide expert guidance on selecting the most efficient and cost-effective water heater for your property, considering factors like size, energy efficiency, and your hot water needs.",
	},
	{
		id: 5,
		question: "Does Wade's Plumbing & Septic offer warranties on water heater replacements?",
		answer: "Yes, we stand behind our work with comprehensive warranties on both the water heater units we install and our labor, giving you peace of mind with your investment.",
	},
	{
		id: 6,
		question: "Are there energy-efficient water heaters available through Wade's Plumbing & Septic?",
		answer: "We offer a range of energy-efficient water heaters, including the latest tankless models, which can help reduce your energy bills and are environmentally friendly.",
	},
	{
		id: 7,
		question: "What is the cost of replacing a water heater with Wade's Plumbing & Septic?",
		answer: "The cost of water heater replacement varies depending on the type and model you choose. We provide transparent pricing and detailed quotes to ensure there are no surprises.",
	},
];

const benefits = [
	"Expert water heater replacement and installation",
	"Rapid response for emergency water heater issues",
	"Energy-efficient water heater solutions",
	"Comprehensive water heater maintenance services",
	"Certified and experienced technicians",
	"Customer-focused approach and satisfaction guarantee",
	// ... Add more benefits if needed
];
export default function DrainClearing() {
	return (
		<>
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonFAQLd, null, "\t") }} />
			<section className="w-full bg-white text-black">
				<div className="py-20 mx-auto max-w-7xl px-8 space-y-20">
					<div className="mx-auto grid max-w-[40rem] grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
						<div className="flex flex-col col-span-2 lg:pb-6">
							<div className="space-y-6">
								<h1 className="text-4xl font-extrabold leading-none tracking-tight text-slate-900 sm:text-5xl sm:leading-[3.5rem]">Water Heater Services in Santa Cruz</h1>
								<p className="text-base leading-7 text-slate-700">In need of a water heater replacement or repair? Wade&apos;s Plumbing & Septic is your trusted provider for all water heater services, ensuring your Santa Cruz home stays warm and comfortable.</p>

								<div className="flex gap-2 flex-wrap">
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Water Heater Installation</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Water Heater Repair</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Tankless Water Heaters</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Energy Efficient Models</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Routine Maintenance</span>
								</div>

								<div className="flex gap-2 flex-wrap">
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#waterheaterreplacement</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#hotwatersolutions</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#santacruzplumbing</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#plumbingexperts</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#reliableplumbing</span>
								</div>
							</div>
							<div className="flex flex-col space-y-4 mt-10">
								<Link href="tel:+1831-225-4344" className="text-5xl font-black text-brand-800">
									(831)-225-4344
								</Link>
							</div>
						</div>
						<div className="relative lg:col-span-2">
							<ContactForm />
						</div>
					</div>

					<div className="bg-white">
						<div className="mx-auto max-w-7xl">
							<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
							<p className="mt-6 max-w-2xl text-base leading-7 text-gray-800">
								Have a different question and can’t find the answer you’re looking for? Reach out to our support team by{" "}
								<a href="/contact-us" className="font-semibold text-brand-800 hover:text-brand-500">
									sending us an email
								</a>{" "}
								and we’ll get back to you as soon as we can.
							</p>
							<div className="mt-20">
								<dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-3 lg:gap-x-10">
									{faqs.map((faq) => (
										<div key={faq.id}>
											<dt className="text-base font-semibold leading-7 text-gray-900">{faq.question}</dt>
											<dd className="mt-2 text-base leading-7 text-gray-800">{faq.answer}</dd>
										</div>
									))}
								</dl>
							</div>
						</div>
					</div>

					<div className="bg-brand-900 p-10 rounded-2xl">
						<div className="relative isolate">
							<div className="mx-auto max-w-7xl">
								<div className="mx-auto flex max-w-2xl flex-col gap-16 lg:max-w-none lg:flex-row lg:items-center xl:gap-x-20">
									<Image className="h-96 w-full flex-none rounded-2xl object-cover shadow-xl lg:aspect-square lg:h-auto lg:max-w-sm" src="/landing-pages/santa-cruz/water-heater-replacment/water-heater.webp" alt="Expert Water Heater Replacment Services" width={1000} height={1000} />
									<div className="w-full flex-auto">
										<h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Expert Water Heater Services in Santa Cruz</h2>
										<p className="mt-6 text-lg leading-8 text-white">Wade&apos;s Plumbing & Septic is a leader in water heater installation and repair services in Santa Cruz. We offer efficient, reliable solutions for your water heating needs, ensuring you have access to hot water when you need it most.</p>
										<ul role="list" className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 text-base leading-7 text-white sm:grid-cols-2">
											{benefits.map((benefit) => (
												<li key={benefit} className="flex gap-x-3">
													<CheckCircleIcon className="h-7 w-5 flex-none" aria-hidden="true" />
													{benefit}
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Stats Section */}
					<div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
						<div className="mx-auto max-w-2xl lg:mx-0">
							<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your Trusted Water Heater Specialists in Santa Cruz</h2>
							<p className="mt-6 text-base leading-7 text-gray-600">At Wade&apos;s Plumbing & Septic, we&apos;re dedicated to providing top-tier water heater services, from emergency repairs to new installations, ensuring Santa Cruz homes and businesses enjoy uninterrupted hot water supply.</p>
						</div>
						<div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
							{/* Response Time Stats */}
							<div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-50 p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
								<p className="flex-none text-3xl font-bold tracking-tight text-gray-900">45 Minutes</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-gray-900">Average Water Heater Service Response</p>
									<p className="mt-2 text-base leading-7 text-gray-600">Our team is quick to respond to your water heater needs, with an average response time of 45 minutes in Santa Cruz.</p>
								</div>
							</div>
							{/* Project Completion Stats */}
							<div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-brand-600 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
								<p className="flex-none text-3xl font-bold tracking-tight text-white">300+</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-white">Water Heater Installations & Repairs</p>
									<p className="mt-2 text-base leading-7 text-indigo-200">We&apos;ve completed over 300 water heater installations and repairs, ensuring optimal performance and energy efficiency for our clients.</p>
								</div>
							</div>
							{/* Customer Satisfaction Stats */}
							<div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-black p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44">
								<p className="flex-none text-3xl font-bold tracking-tight text-white">99%</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-white">Customer Satisfaction Rate</p>
									<p className="mt-2 text-base leading-7 text-gray-400">Our dedication to providing the best water heater services has earned us a 99% customer satisfaction rate in Santa Cruz.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
