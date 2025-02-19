import ContactForm from "@/components/forms/ContactForm";
import Image from "next/image";
import type { Metadata } from "next/types";
import Script from "next/script";
import Link from "next/link";
import { CheckCircle } from "react-feather";

export const metadata: Metadata = {
	metadataBase: new URL("https://www.wadesplumbingandseptic.com/"),
	title: {
		default: "Commercial Plumbing Services in Santa Cruz - Wade's Plumbing & Septic",
		template: "%s | Wade's Plumbing & Septic",
	},
	description: "Professional commercial plumbing services in Santa Cruz, Monterey, and Santa Clara. Fast, reliable, and available for 24/7 emergencies by Wade's Plumbing & Septic.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	keywords: ["Commercial Plumbing Santa Cruz", "Emergency Plumbing Services", "Commercial Plumbing Repair Santa Cruz", "Commercial Plumbing Installation Santa Cruz", "Plumbing Maintenance Santa Cruz"],
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
		title: "Professional Commercial Plumbing Services in Santa Cruz - Wade's Plumbing & Septic",
		description: "Dependable and expert commercial plumbing services in Santa Cruz, Monterey, and Santa Clara. Available 24/7 for any plumbing emergencies.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Professional Commercial Plumbing Services in Santa Cruz - Wade's Plumbing & Septic",
		description: "Dependable and expert commercial plumbing services in Santa Cruz, Monterey, and Santa Clara. Available 24/7 for any plumbing emergencies.",
		url: "https://www.wadesplumbingandseptic.com",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Professional%20Commercial%20Plumbing%20Services",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Professional%20Commercial%20Plumbing%20Services",
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
			name: "Why choose Wade's Plumbing & Septic for commercial plumbing in Santa Cruz?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Wade's Plumbing & Septic provides top-notch commercial plumbing services in Santa Cruz, using state-of-the-art technology and methods to ensure your business's plumbing needs are met efficiently and effectively.",
			},
		},
		{
			"@type": "Question",
			name: "What commercial plumbing services do you offer in Santa Cruz?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "We offer a full range of commercial plumbing services including plumbing repair, installation, maintenance, and emergency services to businesses in Santa Cruz.",
			},
		},
		{
			"@type": "Question",
			name: "How can regular plumbing maintenance benefit my Santa Cruz business?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Regular plumbing maintenance by Wade's Plumbing & Septic can prevent costly disruptions, ensure compliance with health regulations, and maintain the overall efficiency of your plumbing systems.",
			},
		},
		{
			"@type": "Question",
			name: "Do you provide emergency commercial plumbing services in Santa Cruz?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Yes, we offer 24/7 emergency plumbing services to address any urgent issues that may arise in your commercial establishment, minimizing downtime and protecting your business.",
			},
		},
		{
			"@type": "Question",
			name: "What sets Wade's Plumbing & Septic apart for commercial plumbing needs?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Our extensive experience, commitment to speed and efficiency, and our use of the latest plumbing technologies make us a premier choice for commercial plumbing services in Santa Cruz.",
			},
		},
		{
			"@type": "Question",
			name: "How quickly can Wade's Plumbing & Septic respond to commercial plumbing issues in Santa Cruz?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "We pride ourselves on our rapid response times for commercial plumbing emergencies in Santa Cruz, ensuring that your business's operations can continue with minimal interruption.",
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
		addressLocality: "Ben Lomond",
		addressRegion: "CA",
		postalCode: "95005",
		addressCountry: "US",
	},
	telephone: "+1-831-225-4344",
	url: "https://www.wadesplumbingandseptic.com",
	logo: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
	image: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Professional%20Commercial%20Plumbing%20Services",
	description: "Professional commercial plumbing services in Santa Cruz, Monterey, and Santa Clara. Fast, reliable, and 24/7 emergency services by Wade's Plumbing & Septic.",
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
		question: "Why choose Wade's Plumbing & Septic for commercial plumbing in Santa Cruz?",
		answer: "Wade's Plumbing & Septic provides top-notch commercial plumbing services in Santa Cruz, using state-of-the-art technology and methods to ensure your business's plumbing needs are met efficiently and effectively.",
	},
	{
		id: 2,
		question: "What commercial plumbing services do you offer in Santa Cruz?",
		answer: "We offer a full range of commercial plumbing services including plumbing repair, installation, maintenance, and emergency services to businesses in Santa Cruz.",
	},
	{
		id: 3,
		question: "How can regular plumbing maintenance benefit my Santa Cruz business?",
		answer: "Regular plumbing maintenance by Wade's Plumbing & Septic can prevent costly disruptions, ensure compliance with health regulations, and maintain the overall efficiency of your plumbing systems.",
	},
	{
		id: 4,
		question: "Do you provide emergency commercial plumbing services in Santa Cruz?",
		answer: "Yes, we offer 24/7 emergency plumbing services to address any urgent issues that may arise in your commercial establishment, minimizing downtime and protecting your business.",
	},
	{
		id: 5,
		question: "What sets Wade's Plumbing & Septic apart for commercial plumbing needs?",
		answer: "Our extensive experience, commitment to speed and efficiency, and our use of the latest plumbing technologies make us a premier choice for commercial plumbing services in Santa Cruz.",
	},
	{
		id: 6,
		question: "How quickly can Wade's Plumbing & Septic respond to commercial plumbing issues in Santa Cruz?",
		answer: "We pride ourselves on our rapid response times for commercial plumbing emergencies in Santa Cruz, ensuring that your business's operations can continue with minimal interruption.",
	},
];

const benefits = ["Dedicated commercial plumbing solutions", "Rapid response for emergency services", "Advanced plumbing technology and methods", "Comprehensive maintenance programs", "Expert installations and repairs", "Efficient and timely service delivery", "Experienced and certified plumbing professionals", "Commitment to customer satisfaction and safety"];

export default function DrainClearing() {
	return (
		<>
			<Script async strategy="worker" data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<Script async strategy="worker" data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonFAQLd, null, "\t") }} />
			<section className="w-full text-black bg-white">
				<div className="px-8 py-20 mx-auto space-y-20 max-w-7xl">
					<div className="mx-auto grid max-w-[40rem] grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
						<div className="flex flex-col col-span-2 lg:pb-6">
							<div className="space-y-6">
								<h1 className="text-4xl font-extrabold leading-none tracking-tight text-slate-900 sm:text-5xl sm:leading-[3.5rem]">Commercial Plumbing Services</h1>
								<p className="text-base leading-7 text-slate-700">At Wade&apos;s Plumbing & Septic, we provide comprehensive commercial plumbing services to meet the needs of your business in Santa Cruz, ensuring reliability and efficiency with our tech-enhanced solutions.</p>

								<div className="flex flex-wrap gap-2">
									<span className="px-3 py-1 text-sm font-semibold rounded-full bg-brand-100 text-brand-800">Pipe Installation</span>
									<span className="px-3 py-1 text-sm font-semibold rounded-full bg-brand-100 text-brand-800">Leak Detection</span>
									<span className="px-3 py-1 text-sm font-semibold rounded-full bg-brand-100 text-brand-800">Backflow Testing</span>
									<span className="px-3 py-1 text-sm font-semibold rounded-full bg-brand-100 text-brand-800">Water Heater Services</span>
									<span className="px-3 py-1 text-sm font-semibold rounded-full bg-brand-100 text-brand-800">Preventative Maintenance</span>
								</div>

								<div className="flex flex-wrap gap-2">
									<span className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full">#plumbinginnovation</span>
									<span className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full">#techplumbing</span>
									<span className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full">#commercialplumbing</span>
									<span className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full">#plumbingtech</span>
									<span className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full">#efficientsystems</span>
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
									<Image className="flex-none object-cover w-full shadow-xl h-96 rounded-2xl lg:aspect-square lg:h-auto lg:max-w-sm" src="/landing-pages/commercial-plumbing/commercial-plumbing.webp" alt="Expert Commercial Plumbing Services" width={1000} height={1000} />
									<div className="flex-auto w-full">
										<h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Why Choose Wade&apos;s Plumbing & Septic?</h2>
										<p className="mt-6 text-lg leading-8 text-white">With over two decades of experience, Wade&apos;s Plumbing & Septic offers unmatched expertise in commercial plumbing in Santa Cruz. Our commitment to innovation, state-of-the-art solutions, and exceptional customer service ensures you receive the best care for your business&apos;s plumbing needs.</p>
										<ul role="list" className="grid grid-cols-1 mt-10 text-base leading-7 text-white gap-x-8 gap-y-3 sm:grid-cols-2">
											{benefits.map((benefit) => (
												<li key={benefit} className="flex gap-x-3">
													<CheckCircle className="flex-none w-5 h-7" aria-hidden="true" />
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
					<div className="px-6 mx-auto mt-32 max-w-7xl sm:mt-40 lg:px-8">
						<div className="max-w-2xl mx-auto lg:mx-0">
							<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Premier Commercial Plumbing Services in Santa Cruz</h2>
							<p className="mt-6 text-base leading-7 text-gray-600">Our commercial plumbing services are designed to ensure your operations run smoothly without any disruptions due to plumbing issues. We provide efficient, reliable, and compliant solutions tailored for your business needs.</p>
						</div>
						<div className="flex flex-col max-w-2xl gap-8 mx-auto mt-16 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
							{/* Response Time Stats */}
							<div className="flex flex-col-reverse justify-between p-8 gap-x-16 gap-y-8 rounded-2xl bg-gray-50 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
								<p className="flex-none text-3xl font-bold tracking-tight text-gray-900">4 hours</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-gray-900">Average Response Time</p>
									<p className="mt-2 text-base leading-7 text-gray-600">Our team is committed to responding rapidly to commercial plumbing emergencies, with an average response time of 4 hours.</p>
								</div>
							</div>
							{/* Project Completion Stats */}
							<div className="flex flex-col-reverse justify-between p-8 gap-x-16 gap-y-8 rounded-2xl bg-brand-600 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
								<p className="flex-none text-3xl font-bold tracking-tight text-white">1276</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-white">Projects Completed</p>
									<p className="mt-2 text-base leading-7 text-indigo-200">We have successfully completed over 1276 commercial plumbing projects, ensuring high-quality standards and customer satisfaction.</p>
								</div>
							</div>
							{/* Customer Satisfaction Stats */}
							<div className="flex flex-col-reverse justify-between p-8 bg-black gap-x-16 gap-y-8 rounded-2xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44">
								<p className="flex-none text-3xl font-bold tracking-tight text-white">98%</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-white">Customer Satisfaction Rate</p>
									<p className="mt-2 text-base leading-7 text-gray-400">Our dedication to excellence has earned us a customer satisfaction rate of 98%, reflecting our commitment to service quality.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
