import { notFound } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getServiceDetails } from "@/actions/getServices";
import Script from "next/script";
export const revalidate = 3600; // Revalidate every hour

const ContactForm = dynamic(() => import("@/components/forms/ContactForm"), {
	loading: () => <p>Loading...</p>,
});
const NewsletterSection = dynamic(() => import("@/components/sections/NewsletterSection"));
const RelatedArticlesSection = dynamic(() => import("@/components/sections/RelatedArticlesSection"));
const Sidebar = dynamic(() => import("@/components/sections/Sidebar"));
const SocialBar = dynamic(() => import("@/components/sections/SocialBar"));

function generateJsonLd(postDetails) {
	return {
		"@context": "https://schema.org",
		"@type": ["Service", "LocalBusiness"],
		name: postDetails.title,
		serviceType: postDetails.categories.join(", "),
		provider: {
			"@type": ["Organization", "LocalBusiness"],
			name: "Wade's Plumbing & Septic",
			telephone: "+1-831-225-4344",
			url: "https://www.wadesplumbingandseptic.com",
			address: {
				"@type": "PostalAddress",
				streetAddress: "7737 hwy 9",
				addressLocality: "Ben Lomond",
				addressRegion: "CA",
				postalCode: "95005",
				addressCountry: "US",
			},
			logo: {
				"@type": "ImageObject",
				url: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
			},
			geo: {
				"@type": "GeoCoordinates",
				latitude: "37.1426021",
				longitude: "-121.977974",
			},
			areaServed: [
				{
					"@type": "GeoCircle",
					geoMidpoint: {
						"@type": "GeoCoordinates",
						latitude: "37.1426021",
						longitude: "-121.977974",
					},
					geoRadius: "50000",
				},
			],
			sameAs: ["https://www.facebook.com/wadesplumbingandseptic/", "https://www.instagram.com/wadesplumbing/?hl=en"],
			openingHoursSpecification: [
				{
					"@type": "OpeningHoursSpecification",
					dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
					opens: "09:00",
					closes: "17:00",
				},
				{
					"@type": "OpeningHoursSpecification",
					dayOfWeek: ["Saturday", "Sunday"],
					opens: "00:00",
					closes: "00:00",
				},
			],
			specialOpeningHoursSpecification: {
				"@type": "OpeningHoursSpecification",
				description: "24/7 Emergency Services Available",
				dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
				opens: "00:00",
				closes: "23:59",
				validFrom: "2024-01-01",
				validThrough: "2024-12-31",
			},
		},
		image: postDetails.featuredImage?.sourceurl || "https://www.wadesplumbingandseptic.com/placeholder.webp",
		description: postDetails.excerpt,
		url: `https://www.wadesplumbingandseptic.com/services/${postDetails.slug}`,
		priceRange: "$$",
		availableLanguage: "en",
		isPartOf: {
			"@type": "WebSite",
			"@id": "https://www.wadesplumbingandseptic.com/#website",
			url: "https://www.wadesplumbingandseptic.com",
			name: "Wade's Plumbing & Septic",
			description: "Professional Plumbing Services in Santa Cruz, Monterey, and Santa Clara Counties",
			publisher: {
				"@type": "Organization",
				name: "Wade's Plumbing & Septic",
				logo: {
					"@type": "ImageObject",
					url: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
				},
			},
		},
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Plumbing Services",
			itemListElement: [
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: postDetails.title,
						description: postDetails.excerpt,
					},
				},
			],
		},
		potentialAction: [
			{
				"@type": "ReserveAction",
				target: {
					"@type": "EntryPoint",
					urlTemplate: "https://www.wadesplumbingandseptic.com/contact-us/",
					actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/IOSPlatform", "http://schema.org/AndroidPlatform"],
				},
				result: {
					"@type": "Reservation",
					name: "Book Plumbing Service",
				},
			},
			{
				"@type": "SearchAction",
				target: {
					"@type": "EntryPoint",
					urlTemplate: "https://www.wadesplumbingandseptic.com/services?search={search_term_string}",
				},
				"query-input": "required name=search_term_string",
			},
		],
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `https://www.wadesplumbingandseptic.com/services/${postDetails.slug}`,
		},
	};
}

export async function generateMetadata({ params }) {
	const { service } = await getServiceDetails(params.slug);
	if (!service) return {};

	const ogImageUrl = `https://www.wadesplumbingandseptic.com/api/og?title=${encodeURIComponent(service.title)}&description=${encodeURIComponent(service.excerpt)}`;
	const locations = ["Santa Cruz", "Monterey", "Santa Clara", "Ben Lomond", "CA"];
	const serviceKeywords = [...(service.categories || []), service.title].map((kw) => [kw, ...locations.map((loc) => `${kw} ${loc}`), ...locations.map((loc) => `${loc} ${kw}`)]).flat();

	return {
		title: `${service.title} in Santa Cruz, Monterey & Santa Clara | Wade's Plumbing & Septic`,
		description: `Professional ${service.title.toLowerCase()} services in Santa Cruz, Monterey, and Santa Clara Counties. Available 24/7 for emergency service. ${service.excerpt}`,
		generator: "Next.js",
		applicationName: "Wade's Plumbing & Septic",
		keywords: [...serviceKeywords, "Emergency Plumbing", "24/7 Plumber", "Local Plumber", "Professional Plumbing", "Licensed Plumber", "Plumbing Company", "Plumbing Contractor"],
		authors: [{ name: "Byron Wade", url: "https://www.wadesplumbingandseptic.com/" }],
		creator: "Byron Wade",
		publisher: "Wade's Plumbing & Septic",
		alternates: {
			canonical: `https://www.wadesplumbingandseptic.com/services/${service.slug}`,
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		twitter: {
			card: "summary_large_image",
			title: `${service.title} in Santa Cruz & Bay Area | Wade's Plumbing`,
			description: `Professional ${service.title.toLowerCase()} services in Santa Cruz, Monterey, and Santa Clara. Available 24/7 for emergency service.`,
			creator: "@wadesplumbing",
			images: {
				url: ogImageUrl,
				alt: `${service.title} services in Santa Cruz, Monterey & Santa Clara`,
			},
		},
		openGraph: {
			title: `${service.title} in Santa Cruz, Monterey & Santa Clara | Wade's Plumbing`,
			description: `Professional ${service.title.toLowerCase()} services in Santa Cruz, Monterey, and Santa Clara Counties. Available 24/7 for emergency service. ${service.excerpt}`,
			url: `https://www.wadesplumbingandseptic.com/services/${service.slug}`,
			siteName: "Wade's Plumbing & Septic",
			images: [
				{
					url: ogImageUrl,
					width: 800,
					height: 600,
					alt: `${service.title} services in Santa Cruz, Monterey & Santa Clara`,
				},
				{
					url: ogImageUrl,
					width: 1800,
					height: 1600,
					alt: `${service.title} services in Santa Cruz, Monterey & Santa Clara`,
				},
			],
			locale: "en-US",
			type: "website",
		},
	};
}

export default async function ServicePage({ params }) {
	const { service } = await getServiceDetails(params.slug);
	const dateObj = new Date(service.created_at);
	const formattedDate = dateObj.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
	const formattedTime = dateObj.toLocaleTimeString([], {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});

	if (!service) {
		notFound();
	}

	const jsonLd = generateJsonLd(service);

	return (
		<section>
			<Script async strategy="worker" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-white dark:bg-gray-900">
				<div className="container relative z-20 px-4 py-16 mx-auto sm:px-6 lg:px-8">
					<div className="flex flex-col lg:flex-row">
						<div className="w-full lg:w-2/3">
							<article className="w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
								<div className="relative w-full">
									<Image sizes={service.featuredImage?.sizes} priority className="w-full mb-6 rounded" width={1000} height={1000} src={service.featuredImage?.sourceurl || "/placeholder.webp"} alt={service.featuredImage?.alttext || "placeholder text"} />
									<div className="w-full py-6 mx-auto space-y-1">
										<span className="block text-gray-800">
											Published in{" "}
											<span className="font-semibold text-black">
												{service.categories?.map((category, index) => (
													<span key={index}>
														{category}
														{index !== service.categories.length - 1 ? ", " : ""}
													</span>
												))}
											</span>
										</span>
										<h1 dangerouslySetInnerHTML={{ __html: service.title || "" }} className="max-w-4xl text-2xl font-extrabold leading-none text-black sm:text-3xl lg:text-4xl" />
									</div>
								</div>
								<div className="flex flex-col justify-between lg:flex-row lg:items-center">
									<div className="flex items-center mb-2 space-x-3 text-base text-gray-800 dark:text-gray-400 lg:mb-0">
										{service.author && (
											<>
												<span>
													By <span className="font-semibold text-black no-underline dark:text-white">{service.author.username || ""}</span>
												</span>
												<span className="w-2 h-2 bg-gray-300 rounded-full dark:bg-gray-400" />
											</>
										)}
										<span>
											<time className="font-normal text-gray-800 dark:text-gray-400" dateTime={service.created_at || ""} title={`${formattedDate} at ${formattedTime}`}>
												{formattedDate} at {formattedTime}
											</time>
										</span>
									</div>
									<SocialBar />
								</div>
								<div className="prose">
									<div dangerouslySetInnerHTML={{ __html: service.content || "" }} />
								</div>
								<div className="!mt-16">
									<h2 className="mb-4 font-extrabold text-black sm:text-3xl lg:text-4xl">Get a free quote</h2>
									<ContactForm />
								</div>
							</article>
						</div>
						<div className="w-full mt-8 lg:w-1/3 lg:pl-8">
							<Sidebar pathname="/services" />
						</div>
					</div>
				</div>
			</div>
			<RelatedArticlesSection pathname="/services" />
			<NewsletterSection />
		</section>
	);
}
