import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Archivo, Manrope } from "next/font/google"
import { Suspense } from "react"

import { CommandMenuLoader } from "@/components/command-menu-loader"
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
	weight: ["400", "500", "700"],
})

/*
  Display face. A squared grotesque against Manrope's humanist body - the
  contrast is what gives headings their own voice instead of running the body
  face at weight 800. Only the two display weights are loaded.
*/
const archivo = Archivo({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-archivo",
	preload: true,
	weight: ["700", "800"],
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
		apple: "/images/brand/apple-touch-icon.png",
	},
	manifest: "/manifest.webmanifest",
}

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#f7f7f5",
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
	address: {
		"@type": "PostalAddress",
		streetAddress: siteConfig.address.street,
		addressLocality: siteConfig.address.city,
		addressRegion: siteConfig.address.region,
		postalCode: siteConfig.address.postalCode,
		addressCountry: "US",
	},
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
		<html lang="en" className={`${manrope.variable} ${archivo.variable}`}>
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
				<CommandMenuLoader />
				<JsonLd data={localBusinessSchema} />
				<Analytics />
			</body>
		</html>
	)
}
