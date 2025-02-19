import "./globals.css";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { GeistSans } from "geist/font/sans";
import Script from "next/script";
import { Suspense } from "react";
import type { Metadata, Viewport } from "next";

// Types
type LayoutProps = {
	children: React.ReactNode;
};

// Metadata
export const metadata: Metadata = {
	metadataBase: new URL("https://www.wadesplumbingandseptic.com"),
	title: {
		template: "%s | Wade's Plumbing & Septic",
		default: "Wade's Plumbing & Septic - Santa Cruz's Premier Plumbing Service",
	},
	description: "Santa Cruz's trusted 24/7 plumbing and septic service. Professional plumbers serving Santa Cruz County with emergency services, repairs, and maintenance.",
	applicationName: "Wade's Plumbing & Septic",
	authors: [{ name: "Byron Wade", url: "https://www.wadesplumbingandseptic.com" }],
	generator: "Next.js",
	keywords: ["Santa Cruz plumber", "plumbing services", "emergency plumbing", "septic services"],
	referrer: "origin-when-cross-origin",
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
};

// Viewport configuration
export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

// Schema
const websiteSchema = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	"@id": "https://www.wadesplumbingandseptic.com/#website",
	url: "https://www.wadesplumbingandseptic.com",
	name: "Wade's Plumbing & Septic - Santa Cruz",
	description: "Santa Cruz's trusted 24/7 plumbing and septic service. Professional plumbers serving Santa Cruz County with emergency services, repairs, and maintenance.",
	publisher: {
		"@type": "Organization",
		name: "Wade's Plumbing & Septic",
		logo: {
			"@type": "ImageObject",
			url: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
		},
	},
	potentialAction: {
		"@type": "SearchAction",
		target: {
			"@type": "EntryPoint",
			urlTemplate: "https://www.wadesplumbingandseptic.com/search?q={search_term_string}",
		},
		"query-input": "required name=search_term_string",
	},
};

// Loading component for Suspense fallback
const LoadingFallback = () => (
	<div className="flex items-center justify-center min-h-screen bg-gray-50">
		<div className="w-12 h-12 rounded-full animate-pulse bg-brand-500" />
	</div>
);

// Analytics component for better organization
const Analytics = () => (
	<>
		<GoogleTagManager gtmId="AW-11125439577" />
		<GoogleAnalytics gaId="G-0XZEMVRJF1" />
	</>
);

// Layout content component
function LayoutContent({ children }: LayoutProps) {
	return (
		<>
			<Script id="schema-website" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} strategy="afterInteractive" />
			<main className="min-h-screen">{children}</main>
			<Analytics />
		</>
	);
}

// Root layout component
export default function RootLayout({ children }: LayoutProps) {
	return (
		<html lang="en" className={GeistSans.className} suppressHydrationWarning>
			<body className="text-base antialiased bg-gray-50">
				<Suspense fallback={<LoadingFallback />}>
					<LayoutContent>{children}</LayoutContent>
				</Suspense>
			</body>
		</html>
	);
}
