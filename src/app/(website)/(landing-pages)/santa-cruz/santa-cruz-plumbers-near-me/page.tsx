import ContactForm from "@/components/forms/ContactForm";
import Image from "next/image";
import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

export const metadata: Metadata = {
	metadataBase: new URL("https://www.wadesplumbingandseptic.com/"),
	title: {
		default: "Santa Cruz Plumbers Near Me - Wade's Plumbing & Septic",
		template: "%s | Wade's Plumbing & Septic",
	},
	description: "Find reliable Santa Cruz plumbers near you for all your plumbing needs. Fast, efficient, and ready for 24/7 emergencies with Wade's Plumbing & Septic.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	keywords: ["Santa Cruz Plumbers Near Me", "Local Plumbers Santa Cruz", "Emergency Plumbing Services Santa Cruz", "Residential Plumbing Santa Cruz", "Commercial Plumbing Services Santa Cruz"],
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
		title: "Find Santa Cruz Plumbers Near Me - Wade's Plumbing & Septic",
		description: "Looking for Santa Cruz plumbers near you? Get fast, reliable service for all plumbing emergencies with Wade's Plumbing & Septic.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Santa Cruz Plumbers Near Me - Wade's Plumbing & Septic",
		description: "Need a plumber in Santa Cruz? Find local plumbing experts near you for quick, professional service with Wade's Plumbing & Septic.",
		url: "https://www.wadesplumbingandseptic.com",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Find%20Santa%20Cruz%20Plumbers%20Near%20Me",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Find%20Santa%20Cruz%20Plumbers%20Near%20Me",
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

const jsonFAQLd = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: [
		{
			"@type": "Question",
			name: "Looking for Santa Cruz plumbers near you?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Wade's Plumbing & Septic is your go-to local plumbing service in Santa Cruz, offering rapid, reliable, and tech-savvy solutions for all your plumbing needs.",
			},
		},
		{
			"@type": "Question",
			name: "What plumbing services are available near me in Santa Cruz?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Our services include leak detection, pipe installation, emergency repairs, and routine maintenance, all performed by experienced plumbers near you in Santa Cruz.",
			},
		},
		{
			"@type": "Question",
			name: "How does Wade's Plumbing & Septic stand out among Santa Cruz plumbers?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Our commitment to integrating technology with traditional plumbing services sets us apart, ensuring fast and efficient solutions for our customers in Santa Cruz.",
			},
		},
		{
			"@type": "Question",
			name: "Can I get emergency plumbing help in Santa Cruz?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Absolutely, we provide 24/7 emergency plumbing services in Santa Cruz to tackle your urgent plumbing problems promptly.",
			},
		},
		{
			"@type": "Question",
			name: "Why is regular plumbing maintenance important for my Santa Cruz home?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Regular maintenance by our skilled plumbers can prevent unexpected disruptions, save you money, and keep your plumbing system in Santa Cruz running smoothly.",
			},
		},
		{
			"@type": "Question",
			name: "How quickly can Wade's Plumbing & Septic respond to my plumbing needs in Santa Cruz?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "We are known for our swift response times in Santa Cruz, with a dedicated team ready to address your plumbing concerns as quickly as possible.",
			},
		},
		// ... Add more questions and answers if needed
	],
};

const faqs = [
	{
		id: 1,
		question: "Looking for Santa Cruz plumbers near you?",
		answer: "Wade's Plumbing & Septic is your go-to local plumbing service in Santa Cruz, offering rapid, reliable, and tech-savvy solutions for all your plumbing needs.",
	},
	{
		id: 2,
		question: "What plumbing services are available near me in Santa Cruz?",
		answer: "Our services include leak detection, pipe installation, emergency repairs, and routine maintenance, all performed by experienced plumbers near you in Santa Cruz.",
	},
	{
		id: 3,
		question: "How does Wade's Plumbing & Septic stand out among Santa Cruz plumbers?",
		answer: "Our commitment to integrating technology with traditional plumbing services sets us apart, ensuring fast and efficient solutions for our customers in Santa Cruz.",
	},
	{
		id: 4,
		question: "Can I get emergency plumbing help in Santa Cruz?",
		answer: "Absolutely, we provide 24/7 emergency plumbing services in Santa Cruz to tackle your urgent plumbing problems promptly.",
	},
	{
		id: 5,
		question: "Why is regular plumbing maintenance important for my Santa Cruz home?",
		answer: "Regular maintenance by our skilled plumbers can prevent unexpected disruptions, save you money, and keep your plumbing system in Santa Cruz running smoothly.",
	},
	{
		id: 6,
		question: "How quickly can Wade's Plumbing & Septic respond to my plumbing needs in Santa Cruz?",
		answer: "We are known for our swift response times in Santa Cruz, with a dedicated team ready to address your plumbing concerns as quickly as possible.",
	},
];

const benefits = ["Quick access to local plumbing experts", "Rapid response for emergency services", "Advanced plumbing technology and methods", "Comprehensive maintenance programs", "Expert installations and repairs", "Efficient and timely service delivery", "Experienced and certified plumbing professionals", "Commitment to customer satisfaction and safety"];

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
								<h1 className="text-4xl font-extrabold leading-none tracking-tight text-slate-900 sm:text-5xl sm:leading-[3.5rem]">Santa Cruz Plumbers Near Me</h1>
								<p className="text-base leading-7 text-slate-700">Looking for reliable plumbers near you? Wade&apos;s Plumbing & Septic offers rapid, tech-forward plumbing solutions in Santa Cruz to keep your business running smoothly.</p>

								<div className="flex gap-2 flex-wrap">
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Pipe Installation</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Leak Detection</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Backflow Testing</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Water Heater Services</span>
									<span className="bg-brand-100 rounded-full px-3 py-1 text-sm font-semibold text-brand-800">Preventative Maintenance</span>
								</div>

								<div className="flex gap-2 flex-wrap">
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#plumbinginnovation</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#techplumbing</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#commercialplumbing</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#plumbingtech</span>
									<span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">#efficientsystems</span>
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
									<Image className="h-96 w-full flex-none rounded-2xl object-cover shadow-xl lg:aspect-square lg:h-auto lg:max-w-sm" src="/landing-pages/santa-cruz-plumbers-near-me/santacruznearme.webp" alt="Santa Cruz Plumbers Near Me" width={1000} height={1000} />
									<div className="w-full flex-auto">
										<h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Why Choose Wade&apos;s Plumbing & Septic?</h2>
										<p className="mt-6 text-lg leading-8 text-white">With over two decades of experience, Wade&apos;s Plumbing & Septic offers unmatched expertise in commercial plumbing in Santa Cruz. Our commitment to innovation, state-of-the-art solutions, and exceptional customer service ensures you receive the best care for your business&apos;s plumbing needs.</p>
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
							<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Top-Rated Santa Cruz Plumbers Near You</h2>
							<p className="mt-6 text-base leading-7 text-gray-600">Our Santa Cruz plumbers are dedicated to providing rapid, efficient, and reliable services to address all your plumbing needs. Experience the best in local plumbing solutions with Wade&apos;s Plumbing & Septic.</p>
						</div>
						<div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
							{/* Response Time Stats */}
							<div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-50 p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
								<p className="flex-none text-3xl font-bold tracking-tight text-gray-900">30 Minutes</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-gray-900">Average Response Time</p>
									<p className="mt-2 text-base leading-7 text-gray-600">Our Santa Cruz plumbers are known for their quick response, with an average time of just 30 minutes to arrive on-site for emergencies.</p>
								</div>
							</div>
							{/* Project Completion Stats */}
							<div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-brand-600 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
								<p className="flex-none text-3xl font-bold tracking-tight text-white">500+</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-white">Plumbing Projects Completed</p>
									<p className="mt-2 text-base leading-7 text-indigo-200">We&apos;ve successfully completed over 500 plumbing projects in Santa Cruz, ranging from simple repairs to complex installations.</p>
								</div>
							</div>
							{/* Customer Satisfaction Stats */}
							<div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-black p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44">
								<p className="flex-none text-3xl font-bold tracking-tight text-white">98%</p>
								<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
									<p className="text-lg font-semibold tracking-tight text-white">Customer Satisfaction Rate</p>
									<p className="mt-2 text-base leading-7 text-gray-400">Our commitment to quality service has earned us a 98% customer satisfaction rate among Santa Cruz residents.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
