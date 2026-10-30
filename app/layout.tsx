import type { Metadata, Viewport } from "next"
import { cacheLife, cacheTag } from "next/cache"
import localFont from "next/font/local"
import { ThemeProvider } from "next-themes"
import { Suspense } from "react"

import { AppCommandShell } from "@/components/app-command-shell"
import { JsonLd } from "@/components/json-ld"
import { ThemeHotkey } from "@/components/theme-hotkey"
import { getCollection } from "@/lib/content"
import { TITLE_SUFFIX, localBusinessJsonLd, websiteJsonLd } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

/*
  Both faces are self-hosted from assets/fonts (SIL Open Font License, see the
  OFL files beside them) so builds never fetch from Google Fonts. Each file is
  the variable Latin subset, so every weight between 400 and 700 resolves
  from one download. Inter carries the UI and headings; Geist Mono carries
  phone numbers, licence numbers and other figures that must read exactly.
*/
const inter = localFont({
	src: [
		{
			path: "../assets/fonts/inter-latin.woff2",
			weight: "100 900",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-inter",
	preload: true,
})

const geistMono = localFont({
	src: [
		{
			path: "../assets/fonts/geist-mono-latin.woff2",
			weight: "100 900",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-geist-mono",
	/* Mono is for figures and labels, never first paint. */
	preload: false,
	adjustFontFallback: false,
})

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: "Wade's Plumbing & Septic",
		template: `%s${TITLE_SUFFIX}`,
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
	themeColor: "#0a0a0a",
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
			className={`${inter.variable} ${geistMono.variable}`}
		>
			<body className={inter.className}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
					<a
						className="bg-foreground text-background sr-only z-[100] rounded-br-lg p-3 focus:not-sr-only focus:fixed focus:top-0 focus:left-0"
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
