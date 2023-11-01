import ContactForm from "@/components/forms/ContactForm";
import Image from "next/image";
import { Metadata } from "next";
import Script from "next/script";

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
			url: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.png&w=96&q=75",
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
	logo: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.png&w=96&q=75",
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

export default function DrainClearing() {
	return (
		<>
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<section className="w-full bg-gray-50">
				<div className="py-10 mx-auto max-w-7xl md:px-8">
					<div className="flex flex-col w-full overflow-hidden bg-white md:flex-row md:rounded justify-between">
						<div className="flex flex-col w-full p-10 mt-4 md:w-1/2 md:mt-0">
							<h1 className="text-4xl font-bold leading-none md:text-5xl">Expert Drain Clearing Services in Santa Cruz</h1>
							<p className="mt-4 text-lg font-light text-gray-800">Struggling with a clogged drain in Santa Cruz? Our team at Wade's Plumbing & Septic specializes in fast, efficient, and affordable drain clearing services. Utilizing advanced rooter technology and state-of-the-art drain clearing tools, we ensure your pipes are free from blockages. Whether it's a minor clog or an emergency situation, we offer 24/7 services to tackle all your drain clearing needs.</p>
						</div>
						<div className="w-full mt-7 md:w-2/5 md:mt-0">
							<div className="p-6">
								<ContactForm />
							</div>
						</div>
					</div>
					<div className="flex flex-col md:mt-8 mt-10 w-full overflow-hidden bg-white md:flex-row md:rounded">
						<div className="flex flex-col w-full p-10 mt-4 md:w-1/2 md:mt-0">
							<h2 className="mb-4 text-3xl font-medium leading-none">Why Choose Wade's Plumbing & Septic?</h2>
							<ul className="text-md text-gray-800">
								<li className="mb-2">Over two decades of drain clearing expertise</li>
								<li className="mb-2">Transparent pricing with no hidden fees</li>
								<li className="mb-2">24/7 emergency drain clearing services</li>
								<li className="mb-2">State-of-the-art hydro jetting services</li>
								<li className="mb-2">In-depth video camera inspection for accurate diagnosis</li>
								<li className="mb-2">Routine drain maintenance to prevent future clogs</li>
								<li className="mb-2">Free estimates for all drain clearing services</li>
								<li className="mb-2">Fast response time for all service calls</li>
								<li className="mb-2">Highly trained and certified technicians</li>
								<li className="mb-2">Customized solutions for unique drain issues</li>
								<li className="mb-2">Safe and effective cleaning agents</li>
								<li className="mb-2">Excellent customer service and after-service support</li>
							</ul>

							<a href="#_" className="flex w-auto mx-auto mt-4 text-lg leading-tight text-brand-600 hover:underline">
								<span className="">Learn More</span>
								<svg className="w-3 h-3 mt-0.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</a>
						</div>
						<div className="w-full mt-7 md:w-1/2 md:mt-0">
							<Image className="w-full" src="https://mpop-prod-hls-primary.s3.amazonaws.com/inception-plumbing/img/1646338794-inception-plumbing-16122884_362294677473447_5125232728274370560_n_17870650150047728.jpg" alt="Expert Drain Clearing Services" width={1000} height={1000} />
						</div>
					</div>
					<div className="flex flex-col mt-10 p-10 bg-white md:flex-row md:rounded md:space-x-8">
						<div className="flex flex-col w-full md:w-1/2">
							<h3 className="text-3xl font-semibold leading-none md:text-4xl">Our Drain Clearing Services</h3>
							<p className="mt-4 text-lg text-gray-800">We offer a wide range of drain clearing services, including:</p>
							<ul className="mt-4 text-lg text-gray-800">
								<li className="mb-2">- Rooter Drains</li>
								<li className="mb-2">- Sewer Line Cleaning</li>
								<li className="mb-2">- Hydro Jetting</li>
								<li className="mb-2">- Video Camera Inspection</li>
								<li className="mb-2">- Routine Drain Maintenance</li>
							</ul>
						</div>
						<div className="flex flex-col w-full mt-10 md:w-1/2 md:mt-0">
							<h3 className="text-3xl font-semibold leading-none md:text-4xl">Areas We Serve</h3>
							<p className="mt-4 text-lg text-gray-800">Proudly serving Santa Cruz, Monterey County, and Santa Clara County.</p>
						</div>
					</div>
					{/* Your HTML content here */}
					<div className="flex flex-col mt-10 p-10 bg-white md:flex-row md:rounded md:space-x-8">
						<div className="flex flex-col w-full md:w-1/2">
							<h2 className="text-3xl font-semibold leading-none md:text-4xl">The Importance of Professional Drain Clearing</h2>
							<p className="mt-4 text-lg text-gray-800">
								A clogged drain is more than just a nuisance; it can lead to a series of plumbing issues that could potentially damage your property. Water backflow, pipe corrosion, and even flooding are some of the severe consequences of untreated clogged drains. That's why it's crucial to seek professional help as soon as you notice signs of a clogged drain. At Wade's Plumbing & Septic, we use the latest technology to diagnose and treat all types of drain clogs, ensuring that
								your plumbing system is in optimal condition.
							</p>
						</div>
						<div className="flex flex-col w-full mt-10 md:w-1/2 md:mt-0">
							<h2 className="text-3xl font-semibold leading-none md:text-4xl">Types of Clogs We Handle</h2>
							<p className="mt-4 text-lg text-gray-800">We handle a variety of clogs, including:</p>
							<ul className="mt-4 text-lg text-gray-800">
								<li className="mb-2">- Hair and Soap Scum</li>
								<li className="mb-2">- Food Particles</li>
								<li className="mb-2">- Grease and Oil</li>
								<li className="mb-2">- Tree Roots</li>
								<li className="mb-2">- Foreign Objects</li>
							</ul>
						</div>
					</div>
					<div className="flex flex-col mt-10 p-10 bg-white md:flex-row md:rounded md:space-x-8">
						<div className="flex flex-col w-full md:w-1/2">
							<h2 className="text-3xl font-semibold leading-none md:text-4xl">Advanced Technology for Drain Clearing</h2>
							<p className="mt-4 text-lg text-gray-800">We employ various advanced technologies for effective drain clearing:</p>
							<ul className="mt-4 text-lg text-gray-800">
								<li className="mb-2">- Hydro Jetting: A high-pressure hose with a specialized nozzle is used to blast water through the pipes, effectively clearing any clogs.</li>
								<li className="mb-2">- Video Camera Inspection: A small camera is sent down the drain to identify the location and nature of the clog, allowing for targeted treatment.</li>
								<li className="mb-2">- Electric Drain Cleaning: Also known as "drain snaking," this method uses an electric cleaner to break down clogs physically.</li>
							</ul>
						</div>
						<div className="flex flex-col w-full mt-10 md:w-1/2 md:mt-0">
							<h2 className="text-3xl font-semibold leading-none md:text-4xl">Preventive Measures</h2>
							<p className="mt-4 text-lg text-gray-800">Prevention is better than cure. We offer advice and services that help you prevent future clogs, such as regular maintenance and the use of advanced cleaning agents.</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
