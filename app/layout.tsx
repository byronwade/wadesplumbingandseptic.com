import type { Metadata, Viewport } from "next"
import { Archivo, Geist, Geist_Mono, Manrope } from "next/font/google"
import { cacheLife, cacheTag } from "next/cache"
import Script from "next/script"
import { Suspense } from "react"

import { JsonLd } from "@/components/json-ld"
import { getCollection } from "@/lib/content"
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

const manrope = Manrope({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-manrope",
	preload: true,
	weight: ["400", "700"],
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
	/* Body font covers first paint; Archivo is for display headings. */
	preload: false,
	weight: ["700", "800"],
})

/* Typeset markdown surfaces (shadcn/typeset). Site UI keeps Manrope/Archivo. */
const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist",
})

const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
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
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
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

async function RootJsonLd() {
	"use cache"
	cacheTag("content:services")
	cacheLife("max")

	const services = await getCollection("services")
	const organizationSchema = localBusinessJsonLd(
		services.map((service) => ({
			slug: service.slug,
			title: service.title,
			description: service.description,
		})),
	)

	return <JsonLd data={[websiteJsonLd(), organizationSchema]} />
}

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang="en"
			className={`${manrope.variable} ${archivo.variable} ${geist.variable} ${geistMono.variable}`}
		>
			<body className={manrope.className}>
				{process.env.NODE_ENV === "development" && (
					<Script
						src="https://unpkg.com/react-scan/dist/auto.global.js"
						crossOrigin="anonymous"
						strategy="lazyOnload"
					/>
				)}
				<a
					className="sr-only z-[100] rounded-br-lg bg-white p-3 text-black focus:not-sr-only focus:fixed focus:top-0 focus:left-0"
					href="#main-content"
				>
					Skip to content
				</a>
				{children}
				<Suspense fallback={null}>
					<RootJsonLd />
				</Suspense>
			</body>
		</html>
	)
}
