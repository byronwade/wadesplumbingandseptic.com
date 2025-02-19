import ContactForm from "@/components/forms/ContactForm";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Script from "next/script";

const MapBox = dynamic(() => import("@/components/sections/MapBox"));

export const metadata = {
	title: "Contact Santa Cruz's Top Plumber | 24/7 Emergency Service | Wade's",
	description: "Need a plumber in Santa Cruz? Available 24/7 for emergency plumbing & septic services. Fast response, licensed experts, and fair pricing. Serving Santa Cruz, Ben Lomond, and surrounding areas. Call (831)-225-4344 now!",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic - Santa Cruz",
	keywords: ["Santa Cruz plumber contact", "emergency plumber Santa Cruz", "24/7 plumbing service Santa Cruz", "local plumber contact", "plumbing emergency contact", "Ben Lomond plumber", "Santa Cruz plumbing company", "plumbing service near me", "emergency septic service Santa Cruz", "contact plumber Santa Cruz"],
	authors: [{ name: "Byron Wade", url: "https://www.wadesplumbingandseptic.com/" }],
	creator: "Byron Wade",
	publisher: "Wade's Plumbing & Septic - Santa Cruz's Premier Plumbing Service",
	alternates: {
		canonical: "https://www.wadesplumbingandseptic.com/contact-us/",
	},
	formatDetection: {
		email: true,
		address: true,
		telephone: true,
	},
	category: "construction",
	bookmarks: ["https://www.wadesplumbingandseptic.com/contact-us/"],
	twitter: {
		card: "summary_large_image",
		title: "Contact Santa Cruz's 24/7 Emergency Plumber | Wade's Plumbing",
		description: "Need an emergency plumber in Santa Cruz? We're available 24/7! Licensed experts, fast response times, and fair pricing. Serving Santa Cruz County. Call now!",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/api/og?title=Santa%20Cruz%20Emergency%20Plumber&description=24/7%20Plumbing%20%26%20Septic%20Services",
			alt: "Wade's Plumbing & Septic - Santa Cruz's Premier Emergency Plumber",
		},
	},
	openGraph: {
		title: "Contact Santa Cruz's 24/7 Emergency Plumber | Wade's Plumbing",
		description: "Need an emergency plumber in Santa Cruz? We're available 24/7! Licensed experts, fast response times, and fair pricing. Serving all of Santa Cruz County.",
		url: "https://www.wadesplumbingandseptic.com/contact-us/",
		siteName: "Wade's Plumbing & Septic - Santa Cruz",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Santa%20Cruz%20Emergency%20Plumber&description=24/7%20Plumbing%20Services",
				width: 1200,
				height: 630,
				alt: "Santa Cruz Emergency Plumbing Services",
			},
		],
		locale: "en-US",
		type: "website",
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "LocalBusiness",
	"@id": "https://www.wadesplumbingandseptic.com/#organization",
	name: "Wade's Plumbing & Septic",
	alternateName: "Wade's Plumbing Santa Cruz",
	telephone: "+1-831-225-4344",
	email: "support@wadesinc.io",
	url: "https://www.wadesplumbingandseptic.com",
	logo: {
		"@type": "ImageObject",
		url: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
		width: 96,
		height: 96,
	},
	image: {
		"@type": "ImageObject",
		url: "https://www.wadesplumbingandseptic.com/api/og?title=Santa%20Cruz%20Emergency%20Plumber&description=24/7%20Plumbing%20Services",
		width: 1200,
		height: 630,
	},
	description: "Santa Cruz's trusted 24/7 emergency plumbing and septic service. Licensed professionals serving Santa Cruz County with fast response times and quality workmanship.",
	areaServed: [
		{
			"@type": "City",
			name: "Santa Cruz",
			"@id": "https://www.wikidata.org/wiki/Q49155",
		},
		{
			"@type": "City",
			name: "Ben Lomond",
			"@id": "https://www.wikidata.org/wiki/Q2894902",
		},
		{
			"@type": "City",
			name: "Scotts Valley",
			"@id": "https://www.wikidata.org/wiki/Q967635",
		},
		{
			"@type": "City",
			name: "Capitola",
			"@id": "https://www.wikidata.org/wiki/Q2937529",
		},
	],
	address: {
		"@type": "PostalAddress",
		streetAddress: "7737 hwy 9",
		addressLocality: "Ben Lomond",
		addressRegion: "CA",
		postalCode: "95005",
		addressCountry: "US",
	},
	geo: {
		"@type": "GeoCoordinates",
		latitude: "37.1426021",
		longitude: "-121.977974",
	},
	hasMap: "https://www.google.com/maps?cid=YOUR_GOOGLE_BUSINESS_CID", // Add your actual Google Business CID
	serviceArea: {
		"@type": "GeoCircle",
		geoMidpoint: {
			"@type": "GeoCoordinates",
			latitude: "37.1426021",
			longitude: "-121.977974",
		},
		geoRadius: "50000", // 50km radius
	},
	openingHoursSpecification: {
		"@type": "OpeningHoursSpecification",
		dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
		opens: "00:00",
		closes: "23:59",
	},
	sameAs: ["https://www.facebook.com/wadesplumbingandseptic/", "https://www.instagram.com/wadesplumbing/?hl=en"],
	contactPoint: [
		{
			"@type": "ContactPoint",
			contactType: "emergency service",
			telephone: "+1-831-225-4344",
			areaServed: "Santa Cruz County",
			availableLanguage: "English",
			contactOption: "TollFree",
			hoursAvailable: "Mo-Su 00:00-23:59",
		},
		{
			"@type": "ContactPoint",
			contactType: "customer service",
			telephone: "+1-831-225-4344",
			email: "support@wadesinc.io",
			areaServed: "Santa Cruz County",
			availableLanguage: "English",
		},
	],
	makesOffer: [
		{
			"@type": "Offer",
			itemOffered: {
				"@type": "Service",
				name: "24/7 Emergency Plumbing",
				description: "Round-the-clock emergency plumbing services in Santa Cruz County",
			},
			areaServed: {
				"@type": "City",
				name: "Santa Cruz County",
			},
			availability: "https://schema.org/24-7",
		},
	],
	potentialAction: {
		"@type": "Action",
		target: {
			"@type": "EntryPoint",
			urlTemplate: "tel:+1-831-225-4344",
			actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/IOSPlatform", "http://schema.org/AndroidPlatform"],
		},
		actionStatus: "https://schema.org/PotentialActionStatus",
	},
};

export default function ContactPage() {
	return (
		<>
			<Script async strategy="worker" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="relative h-full bg-black max-sm:px-4">
				<div className="z-20 flex px-6 py-20 mx-auto space-x-6 relitive max-w-7xl lg:px-8">
					<div className="p-10 bg-white rounded-md">
						<h1 className="text-4xl font-bold tracking-tight text-gray-900">Contact Santa Cruz's Most Trusted Plumber</h1>
						<p className="mt-1 text-lg leading-8 text-gray-700">Available 24/7 for emergency plumbing services in Santa Cruz County</p>
						<Suspense fallback={<p>Loading contact form...</p>}>
							<ContactForm />
						</Suspense>
					</div>
					<div className="flex-col hidden p-4 leading-6 text-white rounded md:flex text-md md:text-lg md:leading-8 backdrop-blur-sm bg-white/10">
						<div className="mb-8">
							<h2 className="mb-1 font-medium text-white">Wade's Plumbing & Septic - Santa Cruz</h2>
							<Link href="tel:8312254344" className="text-sm font-normal text-brand-500 non-italic hover:underline">
								Call Now: (831)-225-4344
							</Link>
							<address className="text-sm font-normal text-white non-italic">
								7737 hwy 9
								<br />
								Ben Lomond, CA, 95005
								<br />
								Serving all of Santa Cruz County
							</address>
						</div>
						<div className="mt-8 space-y-4">
							<div>
								<h3 className="mb-1 font-medium text-white">24/7 Emergency Service</h3>
								<p className="text-sm font-medium text-brand-500 hover:underline">
									<a href="tel:8312254344">(831)-225-4344</a>
								</p>
							</div>
							<div>
								<h3 className="mb-1 font-medium text-white">General Inquiries</h3>
								<p className="text-sm font-medium text-brand-500 hover:underline">
									<a href="mailto:support@wadesinc.io">support@wadesinc.io</a>
								</p>
							</div>
							<div>
								<h3 className="mb-1 font-medium text-white">Service Areas</h3>
								<p className="text-sm text-white">Santa Cruz • Ben Lomond • Scotts Valley • Capitola • Surrounding Areas</p>
							</div>
						</div>
					</div>
				</div>
				<Suspense fallback={<p>Loading map...</p>}>
					<div className="absolute top-0 right-0 w-1/2 h-full -z-10">
						<MapBox />
					</div>
				</Suspense>
			</div>
		</>
	);
}
