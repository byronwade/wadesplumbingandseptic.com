import ContactForm from "@/components/forms/ContactForm";
import Image from "next/image";
import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { ArrowLongRightIcon, CheckCircleIcon } from "@heroicons/react/20/solid";

export const metadata: Metadata = {
	metadataBase: new URL("https://www.wadesplumbingandseptic.com/"),
	title: {
		default: "Drain Clearing Services in Santa Cruz - Wade's Plumbing & Septic",
		template: "%s | Wade's Plumbing & Septic",
	},
	description: "Expert drain clearing services in Santa Cruz, Monterey, and Santa Clara. Fast, reliable, and 24/7 emergency drain unclogging by Wade's Plumbing & Septic.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	keywords: ["Drain Clearing Santa Cruz", "Emergency Drain Clearing", "Drain Unclogging Santa Cruz", "Sewer Line Cleaning Santa Cruz", "Rooter Service Santa Cruz"],
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
		title: "Expert Drain Clearing Services in Santa Cruz - Wade's Plumbing & Septic",
		description: "Fast and reliable drain clearing services in Santa Cruz, Monterey, and Santa Clara. Available 24/7 for emergencies.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Expert Drain Clearing Services in Santa Cruz - Wade's Plumbing & Septic",
		description: "Fast and reliable drain clearing services in Santa Cruz, Monterey, and Santa Clara. Available 24/7 for emergencies.",
		url: "https://www.wadesplumbingandseptic.com",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Expert%20Drain%20Clearing%20Services",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Expert%20Drain%20Clearing%20Services",
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
			name: "Why choose Wade's Plumbing & Septic for drain clearing in Santa Cruz?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Wade's Plumbing & Septic offers professional and efficient drain clearing services in Santa Cruz, utilizing advanced technology and eco-friendly methods to ensure your plumbing system is free of clogs and functioning optimally.",
			},
		},
		{
			"@type": "Question",
			name: "What drain clearing services do you offer in Santa Cruz?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Our comprehensive drain clearing services include residential and commercial drain cleaning, hydro jetting, sewer drain cleaning, and emergency drain clearing, available 24/7 in Santa Cruz.",
			},
		},
		{
			"@type": "Question",
			name: "How can I prevent clogged drains in my Santa Cruz home?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Regular drain maintenance and inspections can prevent clogs. Wade's Plumbing & Septic provides expert drain maintenance services, including eco-friendly solutions and advanced drain cleaning technology in Santa Cruz.",
			},
		},
		{
			"@type": "Question",
			name: "Do you offer eco-friendly drain clearing services in Santa Cruz?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Yes, we are committed to protecting the environment with our eco-friendly drain clearing methods. Our services are designed to effectively clear your drains while preserving the integrity of your plumbing and the Santa Cruz ecosystem.",
			},
		},
		{
			"@type": "Question",
			name: "What makes Wade's Plumbing & Septic a reliable choice for drain clearing?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Our team of skilled technicians are experts in sewer line cleaning and drain clearing, offering quick, reliable, and affordable services in Santa Cruz. We're equipped to handle any drain issue with the utmost professionalism.",
			},
		},
		{
			"@type": "Question",
			name: "How quickly can you respond to a drain emergency in Santa Cruz?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Wade's Plumbing & Septic provides 24/7 emergency drain clearing assistance in Santa Cruz. We pride ourselves on our quick response times and our ability to resolve most drain issues promptly and effectively.",
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
	image: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Expert%20Drain%20Clearing%20Services",
	description: "Expert drain clearing services in Santa Cruz, Monterey, and Santa Clara. Fast, reliable, and 24/7 emergency drain unclogging by Wade's Plumbing & Septic.",
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
		question: "Why choose Wade's Plumbing & Septic for drain clearing in Santa Cruz?",
		answer: "Wade's Plumbing & Septic offers professional and efficient drain clearing services in Santa Cruz, utilizing advanced technology and eco-friendly methods to ensure your plumbing system is free of clogs and functioning optimally.",
	},
	{
		id: 2,
		question: "What drain clearing services do you offer in Santa Cruz?",
		answer: "Our comprehensive drain clearing services include residential and commercial drain cleaning, hydro jetting, sewer drain cleaning, and emergency drain clearing, available 24/7 in Santa Cruz.",
	},
	{
		id: 3,
		question: "How can I prevent clogged drains in my Santa Cruz home?",
		answer: "Regular drain maintenance and inspections can prevent clogs. Wade's Plumbing & Septic provides expert drain maintenance services, including eco-friendly solutions and advanced drain cleaning technology in Santa Cruz.",
	},
	{
		id: 4,
		question: "Do you offer eco-friendly drain clearing services in Santa Cruz?",
		answer: "Yes, we are committed to protecting the environment with our eco-friendly drain clearing methods. Our services are designed to effectively clear your drains while preserving the integrity of your plumbing and the Santa Cruz ecosystem.",
	},
	{
		id: 5,
		question: "What makes Wade's Plumbing & Septic a reliable choice for drain clearing?",
		answer: "Our team of skilled technicians are experts in sewer line cleaning and drain clearing, offering quick, reliable, and affordable services in Santa Cruz. We're equipped to handle any drain issue with the utmost professionalism.",
	},
	{
		id: 6,
		question: "How quickly can you respond to a drain emergency in Santa Cruz?",
		answer: "Wade's Plumbing & Septic provides 24/7 emergency drain clearing assistance in Santa Cruz. We pride ourselves on our quick response times and our ability to resolve most drain issues promptly and effectively.",
	},
];

const benefits = ["Over two decades of drain clearing expertise", "Transparent pricing with no hidden fees", "24/7 emergency drain clearing services", "State-of-the-art hydro jetting services", "In-depth video camera inspection for accurate diagnosis", "Routine drain maintenance to prevent future clogs", "Fast response time for all service calls", "Highly trained and certified technicians"];

export default function DrainClearing() {
	return (
		<>
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonFAQLd, null, "\t") }} />
			<section className="w-full bg-white text-black">
				<div className="py-20 mx-auto max-w-7xl md:px-8 space-y-20">
					<div className="mx-auto grid max-w-[40rem] grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
						<div className="flex flex-col col-span-2 lg:pb-6">
							<div className="space-y-6">
								<h1 className="text-4xl font-extrabold leading-none tracking-tight text-slate-900 sm:text-5xl sm:leading-[3.5rem]">Drain Clearing Services</h1>
								<p className="text-base leading-7 text-slate-700">Have a clogged drain? Our expert plumbers at Wade&apos;s Plumbing & Septic are ready to clear any blockages, ensuring a smooth flow. Say goodbye to persistent clogs and hello to hassle-free plumbing.</p>

								<div className="flex gap-2 flex-wrap">
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Rooter Drains</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Sewer Line Cleaning</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Hydro Jetting</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Video Camera Inspection</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Video Camera Inspection</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Routine Drain Maintenance</span>
								</div>

								<div className="flex gap-2 flex-wrap">
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#softblockages</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#emergency</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#leachfeilds</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#mainlines</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#kitchendrains</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#commercialdrains</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#retreival</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#grease</span>
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
							<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Frequently asked questions</h2>
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
									<Image className="h-96 w-full flex-none rounded-2xl object-cover shadow-xl lg:aspect-square lg:h-auto lg:max-w-sm" src="/landing-pages/drain-clearing/drain-clearing.webp" alt="Expert Drain Clearing Services" width={1000} height={1000} />
									<div className="w-full flex-auto">
										<h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Why Choose Wade&apos;s Plumbing & Septic?</h2>
										<p className="mt-6 text-lg leading-8 text-white">With over two decades of experience, Wade&apos;s Plumbing & Septic offers unmatched drain clearing expertise in Santa Cruz. Our commitment to transparency, state-of-the-art solutions, and exceptional customer service ensures you receive the best care for your plumbing needs.</p>
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
							<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Expert Drain Clearing Services in Santa Cruz</h2>
							<p className="mt-6 text-base leading-7 text-gray-600">
								Avoid costly water damage and maintain the health of your plumbing system with Wade&apos;s Plumbing & Septic&apos;s professional drain clearing services. Our team of experts offers the best drain clearing services in Santa Cruz, ensuring your drains are free from clogs and functioning efficiently. Whether you need residential drain cleaning or commercial drain clearing services, we provide affordable and quick solutions tailored to your needs.
							</p>
						</div>
						<div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
							{/* Drain Clearing Efficiency Stats */}
							<div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-50 p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
								<p className="flex-none text-3xl font-bold tracking-tight text-gray-900">90%</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-gray-900">Reduction in Blockages</p>
									<p className="mt-2 text-base leading-7 text-gray-600">Regular drain clearing has been shown to reduce the risk of blockages by up to 90%, preventing emergency plumbing situations.</p>
								</div>
							</div>
							{/* Cost Savings Stats */}
							<div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-brand-600 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
								<p className="flex-none text-3xl font-bold tracking-tight text-white">$500+</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-white">Average Savings</p>
									<p className="mt-2 text-base leading-7 text-indigo-200">Homeowners can save an average of $500 in unexpected repair costs by opting for routine drain maintenance.</p>
								</div>
							</div>
							{/* Professional Expertise Stats */}
							<div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-black p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44">
								<p className="flex-none text-3xl font-bold tracking-tight text-white">25+ Years</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-white">Experience in Drain Clearing</p>
									<p className="mt-2 text-base leading-7 text-gray-400">Our team has over 25 years of experience in drain clearing, ensuring the job is done quickly and effectively.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
