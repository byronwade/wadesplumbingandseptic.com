import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getServiceDetails } from "@/actions/getServices";
import { getRelatedArticles } from "@/actions/getRelatedArticles";
import { getSidebarContent } from "@/actions/getSidebarContent";
import ServicePageContent from "./ServicePageContent";
import type { Metadata } from "next";

// Loading Components
const LoadingPulse = ({ className }: { className: string }) => <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />;

// Progressive loading component
function ProgressiveLoading() {
	return (
		<div className="space-y-4">
			<LoadingPulse className="h-[400px]" />
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="md:col-span-2">
					<LoadingPulse className="h-24" />
					<LoadingPulse className="h-96 mt-4" />
				</div>
				<LoadingPulse className="h-[600px]" />
			</div>
		</div>
	);
}

// Generate JSON-LD for the service
function generateJsonLd(postDetails: any) {
	return {
		"@context": "https://schema.org",
		"@type": ["Service", "LocalBusiness"],
		name: postDetails.title,
		serviceType: postDetails.categories?.join(", ") || "",
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
		},
		image: postDetails.featuredImage?.[0]?.sourceurl || "https://www.wadesplumbingandseptic.com/placeholder.webp",
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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
	try {
		const slug = params.slug;
		const { service } = await getServiceDetails(slug);

		if (!service) {
			return {};
		}

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
				locale: "en_US",
				type: "website",
			},
		};
	} catch (error) {
		console.error("Error generating metadata:", error);
		return {};
	}
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
	try {
		const slug = params.slug;
		const [serviceData, relatedArticles, sidebarContent] = await Promise.all([getServiceDetails(slug), getRelatedArticles("/services"), getSidebarContent("/services")]);

		if (!serviceData.service) {
			notFound();
		}

		return (
			<Suspense fallback={<ProgressiveLoading />}>
				<ServicePageContent service={serviceData.service} relatedArticles={relatedArticles} sidebarContent={sidebarContent} jsonLd={generateJsonLd(serviceData.service)} />
			</Suspense>
		);
	} catch (error) {
		console.error("Error in ServicePage:", error);
		return (
			<div className="py-12 text-center">
				<h2 className="text-xl font-semibold text-gray-900">Unable to load service</h2>
				<p className="mt-2 text-gray-600">Please try refreshing the page</p>
			</div>
		);
	}
}
