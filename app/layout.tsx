import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Archivo, Manrope } from "next/font/google"
import { Suspense } from "react"

import { CommandMenuLoader } from "@/components/command-menu-loader"
import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { getCollection } from "@/lib/content"
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/seo"
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
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
		{ media: "(prefers-color-scheme: dark)", color: "#101214" },
	],
}

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const services = await getCollection("services")
	const organizationSchema = localBusinessJsonLd(
		services.map((service) => ({
			slug: service.slug,
			title: service.title,
			description: service.description,
		})),
	)

	return (
		<html
			lang="en"
			className={`${manrope.variable} ${archivo.variable}`}
			suppressHydrationWarning
		>
			<body className={manrope.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
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
					<JsonLd data={[websiteJsonLd(), organizationSchema]} />
					<Analytics />
				</ThemeProvider>
			</body>
		</html>
	)
}
