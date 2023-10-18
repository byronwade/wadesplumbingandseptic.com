import ContactForm from "@/components/forms/ContactForm";
import Image from "next/image";
import Script from "next/script";

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
	logo: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.png&w=96&q=75",
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
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<section className="relative flex flex-row">
				<div className="hidden md:block w-full md:w-1/2 relative">
					<Image placeholder="blur" blurDataURL="/placeholder.webp" className="object-cover h-full w-full brightness-80" src="/trees-river.jpg" width={1500} height={1500} alt="Redwood trees" />
					<div className="absolute bottom-10 right-10">
						<p className="text-white backdrop-blur-sm bg-white/30 p-2 rounded">
							Photo by a local resident <span className="underline">Luca Bravo</span>.
						</p>
					</div>
				</div>
				<div className="w-full md:w-1/2 mx-auto">
					<div className="py-16 px-6 sm:py-24 lg:px-8">
						<h2 className="text-4xl font-bold tracking-tight text-gray-900">Let’s talk about your project</h2>
						<p className="mt-2 text-lg leading-8 text-gray-600">We help homeowners and businesses fix thier problems.</p>
						<div className="mt-16 flex flex-col gap-10 sm:gap-y-20 lg:flex-row">
							<div className="hidden md:block">
								<h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Points of contact</h3>
								<h4 className="mb-1 font-medium text-gray-900 dark:text-white">Wade&apos;s Plumbing & Septic</h4>
								<address className="text-sm font-normal text-gray-500 non-italic">
									7737 hwy 9
									<br />
									Ben Lomond, CA, 95005
								</address>
								<div className="mt-4 space-y-4">
									<div>
										<h4 className="mb-1 font-medium text-gray-900 dark:text-white">Information &amp; Sales</h4>
										<p className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-500">
											<a href="mailto:support@wadesinc.io">support@wadesinc.io</a>
										</p>
									</div>
									<div>
										<h4 className="mb-1 font-medium text-gray-900 dark:text-white">Support</h4>
										<p className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-500">
											<a href="mailto:support@wadesinc.io">support@wadesinc.io</a>
										</p>
									</div>
									<div>
										<h4 className="mb-1 font-medium text-gray-900 dark:text-white">Verification of Employment</h4>
										<p className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-500">
											<a href="mailto:support@wadesinc.io">support@wadesinc.io</a>
										</p>
									</div>
								</div>
							</div>
							<ContactForm />
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
