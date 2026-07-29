import type { Metadata, Viewport } from "next"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { siteConfig } from "@/lib/site"

import "./globals.css"

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: "Wade's Plumbing & Septic",
		template: "%s | Wade's Plumbing & Septic",
	},
	description: siteConfig.description,
	applicationName: siteConfig.name,
	alternates: {
		canonical: "/",
		types: {
			"text/plain": "/llms.txt",
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		siteName: siteConfig.name,
		title: siteConfig.name,
		description: siteConfig.description,
		url: siteConfig.url,
		images: [
			{
				url: "/images/hero-plumber.jpeg",
				width: 1200,
				height: 630,
				alt: "Wade's Plumbing & Septic",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
		images: ["/images/hero-plumber.jpeg"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
		},
	},
	icons: {
		icon: "/icon.svg",
	},
	manifest: "/manifest.webmanifest",
}

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#111111",
}

const localBusinessSchema = {
	"@context": "https://schema.org",
	"@type": ["Plumber", "LocalBusiness"],
	"@id": `${siteConfig.url}/#business`,
	name: siteConfig.name,
	url: siteConfig.url,
	telephone: "+18312254344",
	email: siteConfig.email,
	image: `${siteConfig.url}/images/hero-plumber.jpeg`,
	priceRange: "$$",
	areaServed: [
		{ "@type": "AdministrativeArea", name: "Santa Cruz County, California" },
		{ "@type": "AdministrativeArea", name: "Santa Clara County, California" },
	],
	openingHoursSpecification: [
		{
			"@type": "OpeningHoursSpecification",
			dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
			opens: "09:00",
			closes: "17:00",
		},
	],
	sameAs: [siteConfig.social.facebook, siteConfig.social.instagram],
}

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body>
				<a
					className="sr-only z-[100] rounded-br-lg bg-white p-3 text-black focus:not-sr-only focus:fixed focus:top-0 focus:left-0"
					href="#main-content"
				>
					Skip to content
				</a>
				<SiteHeader />
				{children}
				<SiteFooter />
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(localBusinessSchema),
					}}
				/>
			</body>
		</html>
	)
}
