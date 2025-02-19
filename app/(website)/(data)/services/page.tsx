import { Suspense } from "react";
import { getServices } from "@/actions/getServices";
import ServicesPageContent from "./components/ServicesPageContent";
import type { Metadata } from "next";
import Script from "next/script";

// Loading Components
const LoadingPulse = ({ className }: { className: string }) => <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />;

// Pre-computed schema for better performance
const servicesPageSchema = {
	"@context": "https://schema.org",
	"@type": "CollectionPage",
	"@id": "https://www.wadesplumbingandseptic.com/services/#webpage",
	url: "https://www.wadesplumbingandseptic.com/services/",
	name: "Professional Plumbing Services in Santa Cruz",
	isPartOf: {
		"@id": "https://www.wadesplumbingandseptic.com/#website",
	},
	description: "Professional plumbing services in Santa Cruz. 24/7 emergency service, drain cleaning, water heaters, septic & more.",
	breadcrumb: {
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				item: {
					"@id": "https://www.wadesplumbingandseptic.com/",
					name: "Home",
				},
			},
			{
				"@type": "ListItem",
				position: 2,
				item: {
					"@id": "https://www.wadesplumbingandseptic.com/services/",
					name: "Services",
				},
			},
		],
	},
} as const;

// Progressive loading component
function ProgressiveLoading() {
	return (
		<div className="space-y-4">
			<LoadingPulse className="w-full h-24" />
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{[...Array(6)].map((_, i) => (
					<LoadingPulse key={i} className="h-64" />
				))}
			</div>
		</div>
	);
}

async function ServicesContent({ searchParams }: { searchParams: { search?: string; page?: string } }) {
	try {
		const search = searchParams?.search ?? "";
		const page = searchParams?.page ? Number(searchParams.page) : 1;
		const { services = [], total = 0 } = await getServices({ searchTerm: search, page });

		if (!Array.isArray(services)) {
			throw new Error("Invalid services data");
		}

		return (
			<>
				<Script id="services-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesPageSchema) }} strategy="worker" />
				<Suspense fallback={<ProgressiveLoading />}>
					<ServicesPageContent services={services} total={total ?? 0} searchTerm={search} currentPage={page} />
				</Suspense>
			</>
		);
	} catch (error) {
		console.error("Error fetching services:", error);
		return (
			<div className="py-12 text-center">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Unable to load services</h2>
				<p className="mt-2 text-gray-600 dark:text-gray-400">Please try again later or contact support if the problem persists.</p>
			</div>
		);
	}
}

// Pre-computed metadata for better performance
export const metadata: Metadata = {
	metadataBase: new URL("https://www.wadesplumbingandseptic.com"),
	title: "Santa Cruz Plumbing Services | Emergency & Residential Plumber | Wade's",
	description: "Professional plumbing services in Santa Cruz. 24/7 emergency service, drain cleaning, water heaters, septic & more. Licensed local plumbers serving Santa Cruz County. Call now!",
	keywords: ["Santa Cruz plumbing services", "emergency plumber Santa Cruz", "residential plumber Santa Cruz", "commercial plumbing Santa Cruz", "septic service Santa Cruz", "drain cleaning Santa Cruz", "water heater repair Santa Cruz", "sewer line service Santa Cruz", "local plumber Santa Cruz", "24/7 plumber Santa Cruz", "plumbing contractor Santa Cruz", "Ben Lomond plumber", "Santa Cruz County plumbing"],
	openGraph: {
		title: "Santa Cruz Professional Plumbing Services | Wade's Plumbing & Septic",
		description: "Expert plumbing services in Santa Cruz. Available 24/7 for emergencies. Licensed plumbers, fair pricing, and guaranteed work. Serving all of Santa Cruz County.",
		url: "https://www.wadesplumbingandseptic.com/services",
		siteName: "Wade's Plumbing & Septic - Santa Cruz",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Santa%20Cruz%20Plumbing%20Services&description=Professional%20plumbing%20services%20in%20Santa%20Cruz",
				width: 1200,
				height: 630,
				alt: "Santa Cruz Plumbing Services - Wade's Plumbing & Septic",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Professional Plumbing Services in Santa Cruz | Wade's",
		description: "Expert plumbing services available 24/7 in Santa Cruz. Licensed plumbers, emergency service, and guaranteed work.",
		images: ["https://www.wadesplumbingandseptic.com/api/og?title=Santa%20Cruz%20Plumbing%20Services&description=Professional%20plumbing%20services%20in%20Santa%20Cruz"],
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
} as const;

export default async function ServicesPage({ searchParams }: { searchParams: { search?: string; page?: string } }) {
	return (
		<Suspense fallback={<ProgressiveLoading />}>
			<ServicesContent searchParams={searchParams} />
		</Suspense>
	);
}
