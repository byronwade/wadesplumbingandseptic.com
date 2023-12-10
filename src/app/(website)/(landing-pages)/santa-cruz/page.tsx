import ContactForm from "@/components/forms/ContactForm";
import Image from "next/image";
import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { CheckCircle } from "react-feather";

export const metadata: Metadata = {
	metadataBase: new URL("https://www.wadesplumbingandseptic.com/"),
	title: {
		default: "Plumbers in Santa Cruz, CA - Wade's Plumbing & Septic",
		template: "%s | Wade's Plumbing & Septic",
	},
	description: "Professional Plumbers in Santa Cruz, CA offering a range of plumbing services including repairs, installations, and maintenance. Contact Wade's Plumbing & Septic today.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	keywords: ["Plumbers Santa Cruz", "Plumbing Services Santa Cruz", "Plumbing Repairs Santa Cruz", "Plumbing Installations Santa Cruz", "Emergency Plumbing Santa Cruz"],
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
		title: "Professional Plumbers in Santa Cruz, CA - Wade's Plumbing & Septic",
		description: "Expert plumbing services in Santa Cruz for all your needs. Available 24/7 for emergencies.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Professional Plumbers in Santa Cruz, CA - Wade's Plumbing & Septic",
		description: "Expert plumbing services in Santa Cruz for all your residential and commercial needs. Available 24/7 for emergencies.",
		url: "https://www.wadesplumbingandseptic.com",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Professional%20Plumbers",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Professional%20Plumbers",
				width: 1800,
				height: 1600,
				alt: "Wade's Plumbing & Septic",
			},
		],
		locale: "en-US",
		type: "website",
	},
};

const jsonFAQLd = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: [
		{
			"@type": "Question",
			name: "Why choose Wade's Plumbing & Septic as your Santa Cruz plumbers?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Wade's Plumbing & Septic, based in Santa Cruz, CA, offers top-notch plumbing services with a focus on customer satisfaction and efficient, eco-friendly solutions. Our local expertise ensures tailored services for the Santa Cruz community.",
			},
		},
		{
			"@type": "Question",
			name: "What plumbing services do you offer in Santa Cruz?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Our Santa Cruz plumbing services include comprehensive drain clearing, leak detection, pipe repair, water heater services, and emergency plumbing solutions, all tailored to meet the unique needs of Santa Cruz residents and businesses.",
			},
		},
		{
			"@type": "Question",
			name: "How does Wade's Plumbing & Septic ensure quality plumbing in Santa Cruz?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Our commitment to quality in Santa Cruz includes using advanced plumbing technology, ongoing training for our technicians, and a focus on eco-friendly practices, ensuring the highest standards of service for our Santa Cruz customers.",
			},
		},
		{
			"@type": "Question",
			name: "Do you offer emergency plumbing services in Santa Cruz?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Yes, Wade's Plumbing & Septic provides 24/7 emergency plumbing services in Santa Cruz, CA. We're equipped to handle urgent plumbing issues promptly, ensuring minimal disruption and quick resolutions for our Santa Cruz clients.",
			},
		},
		{
			"@type": "Question",
			name: "What sets Wade's Plumbing & Septic apart from other Santa Cruz plumbers?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Our deep understanding of Santa Cruz's plumbing needs, combined with our advanced technology and commitment to customer service, makes us a preferred choice for plumbing services in the Santa Cruz area.",
			},
		},
		{
			"@type": "Question",
			name: "Can Wade's Plumbing & Septic handle commercial plumbing needs in Santa Cruz?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Absolutely, we offer a range of commercial plumbing services in Santa Cruz, including maintenance, repairs, and installations, all designed to meet the specific needs of Santa Cruz businesses.",
			},
		},
		// ... Add more questions and answers if needed
	],
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "ProfessionalService",
	additionalType: "http://www.productontology.org/id/Plumbing",
	name: "Wade's Plumbing & Septic",
	address: {
		"@type": "PostalAddress",
		streetAddress: "7737 hwy 9",
		addressLocality: "Santa Cruz",
		addressRegion: "CA",
		postalCode: "95005",
		addressCountry: "US",
	},
	telephone: "+1-831-225-4344",
	url: "https://www.wadesplumbingandseptic.com",
	logo: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
	image: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Expert%20Plumbing%20Services%20in%20Santa%20Cruz",
	description: "Leading plumbing services in Santa Cruz, CA. Fast, reliable, and eco-friendly plumbing solutions by Wade's Plumbing & Septic, available 24/7 for all your plumbing needs.",
	priceRange: "$$",
	geo: {
		"@type": "GeoCoordinates",
		latitude: "37.1426021",
		longitude: "-121.977974",
	},
	openingHours: "Mo-Su 00:00-23:59",
	sameAs: ["https://www.facebook.com/wadesplumbingandseptic/", "https://www.instagram.com/wadesplumbing/?hl=en"],
};

const faqs = [
	{
		id: 1,
		question: "Why choose Wade's Plumbing & Septic as your Santa Cruz plumbers?",
		answer: "Wade's Plumbing & Septic, based in Santa Cruz, CA, offers top-notch plumbing services with a focus on customer satisfaction and efficient, eco-friendly solutions. Our local expertise ensures tailored services for the Santa Cruz community.",
	},
	{
		id: 2,
		question: "What plumbing services do you offer in Santa Cruz?",
		answer: "Our Santa Cruz plumbing services include comprehensive drain clearing, leak detection, pipe repair, water heater services, and emergency plumbing solutions, all tailored to meet the unique needs of Santa Cruz residents and businesses.",
	},
	{
		id: 3,
		question: "How does Wade's Plumbing & Septic ensure quality plumbing in Santa Cruz?",
		answer: "Our commitment to quality in Santa Cruz includes using advanced plumbing technology, ongoing training for our technicians, and a focus on eco-friendly practices, ensuring the highest standards of service for our Santa Cruz customers.",
	},
	{
		id: 4,
		question: "Do you offer emergency plumbing services in Santa Cruz?",
		answer: "Yes, Wade's Plumbing & Septic provides 24/7 emergency plumbing services in Santa Cruz, CA. We're equipped to handle urgent plumbing issues promptly, ensuring minimal disruption and quick resolutions for our Santa Cruz clients.",
	},
	{
		id: 5,
		question: "What sets Wade's Plumbing & Septic apart from other Santa Cruz plumbers?",
		answer: "Our deep understanding of Santa Cruz's plumbing needs, combined with our advanced technology and commitment to customer service, makes us a preferred choice for plumbing services in the Santa Cruz area.",
	},
	{
		id: 6,
		question: "Can Wade's Plumbing & Septic handle commercial plumbing needs in Santa Cruz?",
		answer: "Absolutely, we offer a range of commercial plumbing services in Santa Cruz, including maintenance, repairs, and installations, all designed to meet the specific needs of Santa Cruz businesses.",
	},
];

const benefits = [
	"Specialized plumbing services for Santa Cruz, CA",
	"Rapid response for plumbing emergencies in the Santa Cruz area",
	"Eco-friendly plumbing solutions tailored for Santa Cruz's environment",
	"Advanced technology for efficient plumbing service in Santa Cruz",
	"Expert team with local knowledge of Santa Cruz's plumbing infrastructure",
	"Comprehensive residential and commercial plumbing services in Santa Cruz",
	"Dedicated customer support for the Santa Cruz community",
	"Proactive plumbing maintenance services to serve Santa Cruz homes and businesses",
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
								<h1 className="text-4xl font-extrabold leading-none tracking-tight text-slate-900 sm:text-5xl sm:leading-[3.5rem]">Santa Cruz Plumbing Services</h1>
								<p className="text-base leading-7 text-slate-700">Looking for reliable plumbers in Santa Cruz? Wade&apos;s Plumbing & Septic specializes in a range of plumbing services, ensuring top-quality solutions for all your plumbing needs in Santa Cruz.</p>

								<div className="flex gap-2 flex-wrap">
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Residential Plumbing</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Commercial Plumbing</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Emergency Services</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Leak Detection</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Pipe Repair</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Water Heater Services</span>
								</div>

								<div className="flex gap-2 flex-wrap">
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#SantaCruzPlumbing</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#EcoFriendly</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#24/7Service</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#QualityWork</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#ExperiencedPlumbers</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#CustomerSatisfaction</span>
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
							<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Frequently Asked Questions - Santa Cruz Plumbing</h2>
							<p className="mt-6 max-w-2xl text-base leading-7 text-gray-800">
								Have a different question about our plumbing services in Santa Cruz? Reach out to our team by{" "}
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
									<Image className="h-96 w-full flex-none rounded-2xl object-cover shadow-xl lg:aspect-square lg:h-auto lg:max-w-sm" src="/landing-pages/drain-clearing/drain-clearing.webp" alt="Expert Plumbing Services in Santa Cruz" width={1000} height={1000} />
									<div className="w-full flex-auto">
										<h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Santa Cruz&apos;s Premier Plumbing Experts</h2>
										<p className="mt-6 text-lg leading-8 text-white">Wade&apos;s Plumbing & Septic is a leader in plumbing services in Santa Cruz, offering over two decades of experience. We specialize in a range of plumbing solutions, ensuring top-quality service and customer satisfaction for every job in Santa Cruz.</p>
										<ul role="list" className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 text-base leading-7 text-white sm:grid-cols-2">
											{benefits.map((benefit) => (
												<li key={benefit} className="flex gap-x-3">
													<CheckCircle className="h-7 w-5 flex-none" aria-hidden="true" />
													{benefit}
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
							<div className="absolute inset-x-0 -top-16 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl" aria-hidden="true">
								<div
									className="aspect-[1318/752] w-[82.375rem] flex-none bg-gradient-to-r from-[#000] to-[#000] opacity-25"
									style={{
										clipPath: "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
									}}
								/>
							</div>
						</div>
					</div>

					{/* Stats */}
					<div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
						<div className="mx-auto max-w-2xl lg:mx-0">
							<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Leading Plumbing Services in Santa Cruz</h2>
							<p className="mt-6 text-base leading-7 text-gray-600">Wade&apos;s Plumbing & Septic is dedicated to providing the best plumbing services in Santa Cruz. Our team of seasoned professionals ensures efficient and effective solutions for all plumbing issues, from routine maintenance to complex repairs, tailored specifically for Santa Cruz homes and businesses.</p>
						</div>
						<div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
							{/* Plumbing Efficiency Stats */}
							<div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-50 p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
								<p className="flex-none text-3xl font-bold tracking-tight text-gray-900">98%</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-gray-900">Customer Satisfaction</p>
									<p className="mt-2 text-base leading-7 text-gray-600">Our commitment to excellence has resulted in a 98% customer satisfaction rate, reflecting our dedication to quality service in Santa Cruz.</p>
								</div>
							</div>
							{/* Cost-Effective Solutions Stats */}
							<div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-brand-600 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
								<p className="flex-none text-3xl font-bold tracking-tight text-white">Cost-Effective</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-white">Affordable Solutions</p>
									<p className="mt-2 text-base leading-7 text-indigo-200">We offer cost-effective plumbing solutions, saving our Santa Cruz customers on average 20% compared to other local services.</p>
								</div>
							</div>
							{/* Professional Expertise Stats */}
							<div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-black p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44">
								<p className="flex-none text-3xl font-bold tracking-tight text-white">20+ Years</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-white">Years of Service in Santa Cruz</p>
									<p className="mt-2 text-base leading-7 text-gray-400">With over 20 years of dedicated service, our team has deep roots in the Santa Cruz community, offering trusted and reliable plumbing solutions.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
