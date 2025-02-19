"use server";

import { Suspense } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getServiceDetails } from "@/actions/getServices";
import { getRelatedArticles } from "@/actions/getRelatedArticles";
import { getSidebarContent } from "@/actions/getSidebarContent";
import ServicePageContent from "./ServicePageContent";

// Loading Components
const LoadingPulse = ({ className }: { className: string }) => <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />;

<<<<<<< HEAD
export default async function ServicePage(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const headersList = headers();
=======
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
>>>>>>> 612b96e148723dd6144a0c3cd3a3fcac03f9fbd6

	try {
		const [{ service }, relatedArticles, sidebarContent] = await Promise.all([getServiceDetails(params.slug), getRelatedArticles("/services"), getSidebarContent("/services")]);

<<<<<<< HEAD
		if (!service) {
			notFound();
		}
=======
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
>>>>>>> 612b96e148723dd6144a0c3cd3a3fcac03f9fbd6

		return (
			<Suspense fallback={<LoadingPulse className="h-screen" />}>
				<ServicePageContent service={service} relatedArticles={relatedArticles} sidebarContent={sidebarContent} />
			</Suspense>
		);
	} catch (error) {
		console.error("Error loading service:", error);
		return (
			<div className="py-10 text-center">
				<p className="text-red-500">Error loading service. Please try again later.</p>
			</div>
		);
	}
}
