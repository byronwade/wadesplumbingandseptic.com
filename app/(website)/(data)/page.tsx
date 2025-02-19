import { Suspense } from "react";
import { headers } from "next/headers";
import Script from "next/script";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";

// Loading Components
const LoadingPulse = ({ className }: { className: string }) => <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />;

// Progressive loading component
function ProgressiveLoading() {
	return (
		<div className="space-y-4">
			<LoadingPulse className="h-[600px]" />
			<LoadingPulse className="h-[600px]" />
			<LoadingPulse className="h-[400px]" />
		</div>
	);
}

// Server-side rendered critical components
const HeroSection = dynamic(() => import("@/components/sections/HeroSection"), {
	loading: () => <LoadingPulse className="h-[600px]" />,
	ssr: true,
});

const FeatureSection = dynamic(() => import("@/components/sections/FeatureSection"), {
	loading: () => <LoadingPulse className="h-[600px]" />,
	ssr: true,
});

// Client-side dynamic sections
const DynamicSections = dynamic(() => import("./components/DynamicSections"), {
	loading: () => <ProgressiveLoading />,
	ssr: true,
});

// Enhanced caching with shorter revalidation for fresher content
const getCachedHomePageData = unstable_cache(
	async () => {
		return {};
	},
	["home-data"],
	{
		revalidate: 60,
		tags: ["home"],
	}
);

async function getHomePageData() {
	headers();
	return getCachedHomePageData();
}

// Pre-computed schema for better performance
const homePageSchema = {
	"@context": "https://schema.org",
	"@type": "WebPage",
	"@id": "https://www.wadesplumbingandseptic.com/#webpage",
	url: "https://www.wadesplumbingandseptic.com",
	name: "Santa Cruz Plumber | 24/7 Emergency Plumbing Services",
	isPartOf: {
		"@id": "https://www.wadesplumbingandseptic.com/#website",
	},
	primaryImageOfPage: {
		"@type": "ImageObject",
		url: "https://www.wadesplumbingandseptic.com/api/og",
	},
	datePublished: new Date().toISOString(),
	dateModified: new Date().toISOString(),
} as const;

// Home page content component with optimized loading
async function HomeContent() {
	try {
		await getHomePageData();

		return (
			<>
				<Script id="home-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }} strategy="worker" />

				<div className="flex flex-col min-h-screen">
					{/* Critical content loaded first */}
					<Suspense fallback={<LoadingPulse className="h-[600px]" />}>
						<HeroSection />
					</Suspense>

					<Suspense fallback={<LoadingPulse className="h-[600px]" />}>
						<FeatureSection />
					</Suspense>

					{/* Non-critical content loaded after */}
					<Suspense fallback={<ProgressiveLoading />}>
						<DynamicSections />
					</Suspense>
				</div>
			</>
		);
	} catch (error) {
		console.error("Error in HomeContent:", error);
		return (
			<div className="py-12 text-center">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Unable to load content</h2>
				<p className="mt-2 text-gray-600 dark:text-gray-400">Please try refreshing the page</p>
			</div>
		);
	}
}

// Pre-computed metadata for better performance
export const metadata: Metadata = {
	metadataBase: new URL("https://www.wadesplumbingandseptic.com/"),
	title: {
		default: "Santa Cruz Plumber | 24/7 Emergency Plumbing & Septic Services | Wade's",
		template: "%s | Wade's Plumbing & Septic - Santa Cruz",
	},
	description: "Santa Cruz's most trusted plumbing & septic service. Available 24/7 for emergencies in Santa Cruz, Monterey & Santa Clara Counties. Licensed experts, same-day service, fair pricing. Call now!",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic - Santa Cruz",
	keywords: ["Santa Cruz plumber", "emergency plumber Santa Cruz", "24/7 plumbing Santa Cruz", "septic service Santa Cruz", "plumbing contractor Santa Cruz", "local plumber Santa Cruz", "Ben Lomond plumber", "Monterey plumbing service", "Santa Clara plumber", "residential plumbing Santa Cruz", "commercial plumbing Santa Cruz", "septic tank service Santa Cruz", "drain cleaning Santa Cruz", "water heater repair Santa Cruz", "sewer line repair Santa Cruz"],
	authors: [{ name: "Byron Wade", url: "https://www.wadesplumbingandseptic.com/" }],
	creator: "Byron Wade",
	publisher: "Wade's Plumbing & Septic - Santa Cruz's Premier Plumbing Service",
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
	alternates: {
		canonical: "https://www.wadesplumbingandseptic.com",
	},
	formatDetection: {
		email: true,
		address: true,
		telephone: true,
	},
	category: "construction",
	bookmarks: ["https://www.wadesplumbingandseptic.com/"],
	twitter: {
		card: "summary_large_image",
		title: "Santa Cruz's Trusted 24/7 Plumber - Wade's Plumbing & Septic",
		description: "Your local Santa Cruz plumbing experts. Available 24/7 for emergency plumbing & septic services. Serving Santa Cruz, Monterey & Santa Clara Counties. Call now!",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
			alt: "Wade's Plumbing & Septic - Santa Cruz's Premier Plumber",
		},
	},
	openGraph: {
		title: "Santa Cruz Plumber | 24/7 Emergency Plumbing Services | Wade's",
		description: "Your trusted Santa Cruz plumbing experts. Available 24/7 for emergencies. Professional plumbing & septic services across Santa Cruz, Monterey & Santa Clara Counties.",
		url: "https://www.wadesplumbingandseptic.com",
		siteName: "Wade's Plumbing & Septic - Santa Cruz",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Santa%20Cruz%20Plumber%20%7C%20Wade%27s%20Plumbing%20%26%20Septic&description=Your%20trusted%20local%20plumbing%20experts",
				width: 1200,
				height: 630,
				alt: "Wade's Plumbing & Septic - Santa Cruz's Premier Plumber",
			},
		],
		locale: "en-US",
		type: "website",
	},
	verification: {
		google: "YOUR_GOOGLE_VERIFICATION",
	},
} as const;

// Main page component with Suspense boundary
export default async function HomePage() {
	return (
		<Suspense fallback={<ProgressiveLoading />}>
			<HomeContent />
		</Suspense>
	);
}
