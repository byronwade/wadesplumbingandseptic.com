import type { Metadata, Viewport } from "next"
import { cacheLife, cacheTag } from "next/cache"
import localFont from "next/font/local"
import { ThemeProvider } from "next-themes"
import { Suspense } from "react"

import { AppCommandShell } from "@/components/app-command-shell"
import { JsonLd } from "@/components/json-ld"
import { ThemeHotkey } from "@/components/theme-hotkey"
import { getCollection } from "@/lib/content"
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

/*
  Both faces are self-hosted from assets/fonts (SIL Open Font License, see the
  OFL files beside them) so builds never fetch from Google Fonts. Each file is
  the variable Latin subset Google serves, declared at only the weights the
  site used before, so 500 and 600 still resolve to the nearest loaded weight.
*/
const manrope = localFont({
	src: [
		{
			path: "../assets/fonts/manrope-latin.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../assets/fonts/manrope-latin.woff2",
			weight: "700",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-manrope",
	preload: true,
	/* Metrics live in globals.css so they match the old Google build exactly. */
	adjustFontFallback: false,
	fallback: ["Manrope Fallback"],
})

/*
  Display face. A squared grotesque against Manrope's humanist body - the
  contrast is what gives headings their own voice instead of running the body
  face at weight 800. Only the two display weights are loaded.
*/
const archivo = localFont({
	src: [
		{
			path: "../assets/fonts/archivo-latin.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "../assets/fonts/archivo-latin.woff2",
			weight: "800",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-archivo",
	/* Body font covers first paint; Archivo is for display headings. */
	preload: false,
	adjustFontFallback: false,
	fallback: ["Archivo Fallback"],
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
			suppressHydrationWarning
			className={`${manrope.variable} ${archivo.variable}`}
		>
			<body className={manrope.className}>
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
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
					<ThemeHotkey />
					<AppCommandShell />
				</ThemeProvider>
			</body>
		</html>
	)
}
