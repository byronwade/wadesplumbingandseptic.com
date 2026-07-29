import type { Metadata, Viewport } from "next"
import { Manrope } from "next/font/google"
import { Suspense } from "react"

import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { siteConfig } from "@/lib/site"

import "./globals.css"

const manrope = Manrope({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-manrope",
	preload: true,
	weight: ["400", "700", "800"],
})

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
				url: "/images/locations/santa-cruz-plumber.webp",
				width: 1280,
				height: 720,
				alt: "Wade's Plumbing & Septic",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
		images: ["/images/locations/santa-cruz-plumber.webp"],
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
		apple: "/images/brand/wades-mark.webp",
	},
	manifest: "/manifest.webmanifest",
}

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#101214",
}

const localBusinessSchema = {
	"@context": "https://schema.org",
	"@type": ["Plumber", "LocalBusiness"],
	"@id": `${siteConfig.url}/#business`,
	name: siteConfig.name,
	url: siteConfig.url,
	telephone: "+18312254344",
	email: siteConfig.email,
	logo: `${siteConfig.url}/images/brand/wades-mark.webp`,
	image: `${siteConfig.url}/images/locations/santa-cruz-plumber.webp`,
	priceRange: "$$",
	areaServed: [
		{ "@type": "AdministrativeArea", name: "Santa Cruz County, California" },
		{ "@type": "AdministrativeArea", name: "Santa Clara County, California" },
		{ "@type": "AdministrativeArea", name: "Pickens County, Georgia" },
	],
	openingHoursSpecification: [
		{
			"@type": "OpeningHoursSpecification",
			dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
			opens: "09:00",
			closes: "17:00",
		},
	],
	sameAs: [
		siteConfig.social.facebook,
		siteConfig.social.instagram,
		siteConfig.social.linkedin,
	],
}

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={manrope.variable}>
			<body className={manrope.className}>
				<a
					className="sr-only z-[100] rounded-br-lg bg-white p-3 text-black focus:not-sr-only focus:fixed focus:top-0 focus:left-0"
					href="#main-content"
				>
					Skip to content
				</a>
				<SiteHeader />
				<Suspense
					fallback={<main id="main-content" className="min-h-[40vh]" />}
				>
					{children}
				</Suspense>
				<SiteFooter />
				<JsonLd data={localBusinessSchema} />
			</body>
		</html>
	)
}
