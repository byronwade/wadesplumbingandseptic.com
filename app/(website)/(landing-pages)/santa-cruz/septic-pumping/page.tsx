import ContactForm from "@/components/forms/ContactForm";
import Image from "next/image";
import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { CheckCircle } from "react-feather";

export const metadata: Metadata = {
	metadataBase: new URL("https://www.wadesplumbingandseptic.com/"),
	title: {
		default: "Septic Pumping Services in Santa Cruz - Wade's Plumbing & Septic",
		template: "%s | Wade's Plumbing & Septic",
	},
	description: "Professional septic pumping and cleaning services in Santa Cruz. Trust Wade's Plumbing & Septic for efficient and reliable septic maintenance.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	keywords: ["Septic Pumping Santa Cruz", "Septic Cleaning Services", "Septic System Maintenance", "Reliable Septic Solutions", "Emergency Septic Service"],
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
		title: "Professional Septic Pumping Services - Wade's Plumbing & Septic",
		description: "Looking for septic pumping in Santa Cruz? Wade's Plumbing & Septic offers rapid, reliable service.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Septic Pumping Services in Santa Cruz - Wade's Plumbing & Septic",
		description: "Efficient septic pumping and cleaning services by Wade's Plumbing & Septic. Serving Santa Cruz with top-notch septic solutions.",
		url: "https://www.wadesplumbingandseptic.com",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Professional%20Septic%20Pumping%20Services",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Professional%20Septic%20Pumping%20Services",
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
	image: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Professional%20Septic%20Pumping%20Services",
	description: "Wade's Plumbing & Septic provides expert septic pumping and cleaning services in Santa Cruz, Monterey, and Santa Clara. Available 24/7 for all your septic system needs.",
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
			name: "How often should septic pumping be done in Santa Cruz?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Septic systems typically require pumping every 3 to 5 years, but it can vary based on the size of your tank and household usage. Wade's Plumbing & Septic can assess and recommend a schedule for your specific needs.",
			},
		},
		{
			"@type": "Question",
			name: "What are the signs that I need septic pumping services?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Common signs include slow drains, unpleasant odors, water pooling in the drain field, and backups. If you notice any of these, contact Wade's Plumbing & Septic immediately for an assessment.",
			},
		},
		{
			"@type": "Question",
			name: "Can Wade's Plumbing & Septic handle emergency septic pumping?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Yes, we offer 24/7 emergency septic pumping services to address urgent issues promptly and prevent further damage to your property.",
			},
		},
		{
			"@type": "Question",
			name: "Is regular septic cleaning necessary?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Regular septic cleaning is crucial for maintaining the efficiency and longevity of your septic system. Wade's Plumbing & Septic provides comprehensive cleaning services to keep your system in top condition.",
			},
		},
		{
			"@type": "Question",
			name: "What is included in Wade's Plumbing & Septic's septic service?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Our septic service includes pumping out the waste, cleaning the tank, inspecting for any issues, and providing recommendations for maintenance or repairs if needed.",
			},
		},
		{
			"@type": "Question",
			name: "Does Wade's Plumbing & Septic offer septic maintenance plans?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "We offer customizable septic maintenance plans to ensure your system operates smoothly year-round. These plans can help prevent unexpected problems and extend the life of your septic system.",
			},
		},
		// ... Add more questions and answers if needed
	],
};

const faqs = [
	{
		id: 1,
		question: "How often should septic pumping be done in Santa Cruz?",
		answer: "Septic systems typically require pumping every 3 to 5 years, but it can vary based on the size of your tank and household usage. Wade's Plumbing & Septic can assess and recommend a schedule for your specific needs.",
	},
	{
		id: 2,
		question: "What are the signs that I need septic pumping services?",
		answer: "Common signs include slow drains, unpleasant odors, water pooling in the drain field, and backups. If you notice any of these, contact Wade's Plumbing & Septic immediately for an assessment.",
	},
	{
		id: 3,
		question: "Can Wade's Plumbing & Septic handle emergency septic pumping?",
		answer: "Yes, we offer 24/7 emergency septic pumping services to address urgent issues promptly and prevent further damage to your property.",
	},
	{
		id: 4,
		question: "Is regular septic cleaning necessary?",
		answer: "Regular septic cleaning is crucial for maintaining the efficiency and longevity of your septic system. Wade's Plumbing & Septic provides comprehensive cleaning services to keep your system in top condition.",
	},
	{
		id: 5,
		question: "What is included in Wade's Plumbing & Septic's septic service?",
		answer: "Our septic service includes pumping out the waste, cleaning the tank, inspecting for any issues, and providing recommendations for maintenance or repairs if needed.",
	},
	{
		id: 6,
		question: "Does Wade's Plumbing & Septic offer septic maintenance plans?",
		answer: "We offer customizable septic maintenance plans to ensure your system operates smoothly year-round. These plans can help prevent unexpected problems and extend the life of your septic system.",
	},
	// ... Add more FAQs if needed
];

const benefits = [
	"Professional septic pumping and cleaning services",
	"Emergency septic solutions available 24/7",
	"Customizable septic maintenance plans",
	"Expert advice on septic system care",
	"State-of-the-art septic service equipment",
	"Dedicated to customer satisfaction and service excellence",
	// ... Add more benefits if needed
];

export default function DrainClearing() {
	return (
		<>
			<Script async strategy="worker"  data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<Script async strategy="worker"  data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonFAQLd, null, "\t") }} />
			<section className="w-full text-black bg-white">
				<div className="px-8 py-20 mx-auto space-y-20 max-w-7xl">
					<div className="mx-auto grid max-w-[40rem] grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
						<div className="flex flex-col col-span-2 lg:pb-6">
							<div className="space-y-6">
								<h1 className="text-4xl font-extrabold leading-none tracking-tight text-slate-900 sm:text-5xl sm:leading-[3.5rem]">Septic Pumping and Cleaning in Santa Cruz</h1>
								<p className="text-base leading-7 text-slate-700">Looking for reliable septic pumping or cleaning? Wade&apos;s Plumbing & Septic offers top-notch septic services to keep your Santa Cruz property&apos;s system running smoothly.</p>

								<div className="flex flex-wrap gap-2">
									<span className="px-3 py-1 text-sm font-semibold rounded-full bg-brand-100 text-brand-800">Septic Pumping</span>
									<span className="px-3 py-1 text-sm font-semibold rounded-full bg-brand-100 text-brand-800">Septic Cleaning</span>
									<span className="px-3 py-1 text-sm font-semibold rounded-full bg-brand-100 text-brand-800">Septic Maintenance</span>
									<span className="px-3 py-1 text-sm font-semibold rounded-full bg-brand-100 text-brand-800">Emergency Septic Service</span>
									<span className="px-3 py-1 text-sm font-semibold rounded-full bg-brand-100 text-brand-800">Septic System Inspection</span>
								</div>

								<div className="flex flex-wrap gap-2">
									<span className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full">#septicpumping</span>
									<span className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full">#septicservices</span>
									<span className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full">#santacruzseptic</span>
									<span className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full">#septicexperts</span>
									<span className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full">#reliableseptic</span>
								</div>
							</div>
							<div className="flex flex-col mt-10 space-y-4">
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
							<p className="max-w-2xl mt-6 text-base leading-7 text-gray-800">
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

					<div className="p-10 bg-brand-900 rounded-2xl">
						<div className="relative isolate">
							<div className="mx-auto max-w-7xl">
								<div className="flex flex-col max-w-2xl gap-16 mx-auto lg:max-w-none lg:flex-row lg:items-center xl:gap-x-20">
									<Image className="flex-none object-cover w-full shadow-xl h-96 rounded-2xl lg:aspect-square lg:h-auto lg:max-w-sm" src="https://abuqrtstxqryqcvsohkz.supabase.co/storage/v1/object/public/wadesplumbingandseptic.com/wadesplumbingandseptic/posts/septic-pumping.jpg" alt="Septic Pumping and Cleaning" width={1000} height={1000} />
									<div className="flex-auto w-full">
										<h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Septic Pumping and Cleaning Services in Santa Cruz</h2>
										<p className="mt-6 text-lg leading-8 text-white">Wade&apos;s Plumbing & Septic is your go-to expert for septic pumping and cleaning services in Santa Cruz. We ensure your septic system operates efficiently, providing you with reliable and sanitary waste management.</p>
										<ul role="list" className="grid grid-cols-1 mt-10 text-base leading-7 text-white gap-x-8 gap-y-3 sm:grid-cols-2">
											<li className="flex gap-x-3">
												<CheckCircle className="flex-none w-5 h-7" aria-hidden="true" />
												Comprehensive septic system inspections
											</li>
											<li className="flex gap-x-3">
												<CheckCircle className="flex-none w-5 h-7" aria-hidden="true" />
												Regular septic tank pumping and maintenance
											</li>
											<li className="flex gap-x-3">
												<CheckCircle className="flex-none w-5 h-7" aria-hidden="true" />
												Emergency septic service response
											</li>
											<li className="flex gap-x-3">
												<CheckCircle className="flex-none w-5 h-7" aria-hidden="true" />
												Environmentally friendly septic cleaning
											</li>
											{/* Add more list items as needed */}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Stats Section */}
					<div className="px-6 mx-auto mt-32 max-w-7xl sm:mt-40 lg:px-8">
						<div className="max-w-2xl mx-auto lg:mx-0">
							<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your Trusted Septic Service Specialists in Santa Cruz</h2>
							<p className="mt-6 text-base leading-7 text-gray-600">At Wade&apos;s Plumbing & Septic, we&apos;re committed to providing exceptional septic services, from routine maintenance to emergency responses, ensuring Santa Cruz properties maintain a functional and hygienic septic system.</p>
						</div>
						<div className="flex flex-col max-w-2xl gap-8 mx-auto mt-16 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
							{/* Response Time Stats */}
							<div className="flex flex-col-reverse justify-between p-8 gap-x-16 gap-y-8 rounded-2xl bg-gray-50 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
								<p className="flex-none text-3xl font-bold tracking-tight text-gray-900">1 Hour</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-gray-900">Average Septic Service Response</p>
									<p className="mt-2 text-base leading-7 text-gray-600">Our team is quick to respond to your septic service needs, with an average response time of 1 hour in Santa Cruz.</p>
								</div>
							</div>
							{/* Project Completion Stats */}
							<div className="flex flex-col-reverse justify-between p-8 gap-x-16 gap-y-8 rounded-2xl bg-brand-600 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
								<p className="flex-none text-3xl font-bold tracking-tight text-white">500+</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-white">Septic Services Rendered</p>
									<p className="mt-2 text-base leading-7 text-indigo-200">We&apos;ve provided over 500 septic services, including pumping, cleaning, and repairs, ensuring the longevity and efficiency of septic systems for our clients.</p>
								</div>
							</div>
							{/* Customer Satisfaction Stats */}
							<div className="flex flex-col-reverse justify-between p-8 bg-black gap-x-16 gap-y-8 rounded-2xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44">
								<p className="flex-none text-3xl font-bold tracking-tight text-white">98%</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-white">Customer Satisfaction Rate</p>
									<p className="mt-2 text-base leading-7 text-gray-400">Our commitment to quality septic services has earned us a 98% customer satisfaction rate in Santa Cruz, reflecting our dedication to excellence.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
