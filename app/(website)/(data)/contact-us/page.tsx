import ContactForm from "@/components/forms/ContactForm";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const MapBox = dynamic(() => import("@/components/sections/MapBox"));

export const metadata = {
	title: "Contact Us 24/7 - Emergency Plumbing & Septic | Wade's Plumbing & Septic",
	description: "Available 24/7 for emergency plumbing and septic services across Santa Cruz, Monterey, and Santa Clara Counties. Reach out to Wade's Plumbing & Septic for prompt, reliable assistance.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	keywords: ["24/7 Emergency Plumbing", "Santa Cruz Plumbing", "Monterey Septic Service", "Santa Clara Plumbing"],
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
	bookmarks: ["https://www.wadesplumbingandseptic.com/contact-us/"],
	twitter: {
		card: "summary_large_image",
		title: "Contact Us 24/7 - Emergency Plumbing & Septic | Wade's Plumbing & Septic",
		description: "Available 24/7 for emergency plumbing and septic services across Santa Cruz, Monterey, and Santa Clara Counties. Reach out for prompt, reliable assistance.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Where%20quality%20meets%20community",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Contact Us 24/7 - Emergency Plumbing & Septic | Wade's Plumbing & Septic",
		description: "Available 24/7 for emergency plumbing and septic services across Santa Cruz, Monterey, and Santa Clara Counties. Reach out to Wade's Plumbing & Septic for prompt, reliable assistance.",
		url: "https://www.wadesplumbingandseptic.com/contact-us/",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Where%20quality%20meets%20community",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Where%20quality%20meets%20community",
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
	"@type": "LocalBusiness",
	name: "Wade's Plumbing & Septic",
	telephone: "+1-831-225-4344",
	url: "https://www.wadesplumbingandseptic.com",
	areaServed: ["Santa Cruz County", "Monterey County", "Santa Clara County"],
	availableLanguage: "en",
	image: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Where%20quality%20meets%20community",
	sameAs: ["https://www.facebook.com/wadesplumbingandseptic/", "https://www.instagram.com/wadesplumbing/?hl=en"],
	logo: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
	description: "Available 24/7 for emergency plumbing and septic services across Santa Cruz, Monterey, and Santa Clara Counties. Contact Wade's Plumbing & Septic for prompt, reliable assistance.",
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
	openingHours: "Mo-Su 00:00-23:59",
};

export default function ContactPage() {
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="relative h-full bg-black max-sm:px-4">
				<div className="z-20 flex px-6 py-20 mx-auto space-x-6 relitive max-w-7xl lg:px-8">
					<div className="p-10 bg-white rounded-md">
						<h2 className="text-4xl font-bold tracking-tight text-gray-900">Let’s talk about your project</h2>
						<p className="mt-1 text-lg leading-8 text-gray-700">We help homeowners and businesses fix thier problems.</p>
						<Suspense fallback={<p>Loading contact form...</p>}>
							<ContactForm />
						</Suspense>
					</div>
					<div className="flex-col hidden p-4 leading-6 text-white rounded md:flex text-md md:text-lg md:leading-8 backdrop-blur-sm bg-white/10">
						<div className="mb-8">
							<h4 className="mb-1 font-medium text-white">Wade&#39;s Plumbing & Septic</h4>
							<Link href="tel:8314306011" className="text-sm font-normal text-brand-500 non-italic">
								(831)-225-4344
							</Link>
							<address className="text-sm font-normal text-white non-italic">
								7737 hwy 9
								<br />
								Ben Lomond, CA, 95005
							</address>
						</div>
						<div className="mt-8 space-y-4">
							<div>
								<h4 className="mb-1 font-medium text-white text-gray-900">Information &amp; Sales</h4>
								<p className="text-sm font-medium text-brand-500 hover:underline dark:text-brand-500">
									<a href="mailto:support@wadesinc.io">support@wadesinc.io</a>
								</p>
							</div>
							<div>
								<h4 className="mb-1 font-medium text-white text-gray-900">Support</h4>
								<p className="text-sm font-medium text-brand-500 hover:underline dark:text-brand-500">
									<a href="mailto:support@wadesinc.io">support@wadesinc.io</a>
								</p>
							</div>
							<div>
								<h4 className="mb-1 font-medium text-white text-gray-900">Verification of Employment</h4>
								<p className="text-sm font-medium text-brand-500 hover:underline dark:text-brand-500">
									<a href="mailto:support@wadesinc.io">support@wadesinc.io</a>
								</p>
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
