import type { Metadata, Viewport } from "next"

import { AppCommandShell } from "@/components/app-command-shell"
import { JsonLd } from "@/components/json-ld"
import { OfficeHoursScript } from "@/components/office-hours-script"
import { ThemeScript } from "@/components/theme-script"
import { TITLE_SUFFIX, localBusinessJsonLd, websiteJsonLd } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

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

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning className="dark">
			<head>
				{/*
				  Stable public URL so the face starts with the HTML, not after the
				  100KB stylesheet. crossOrigin is required or the preload is unused.
				*/}
				<link
					rel="preload"
					href="/fonts/inter-latin.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
				<ThemeScript />
			</head>
			<body>
				<a
					className="bg-foreground text-background sr-only z-[100] rounded-br-lg p-3 focus:not-sr-only focus:fixed focus:top-0 focus:left-0"
					href="#main-content"
				>
					Skip to content
				</a>
				{children}
				{/*
				  NAP JSON-LD stays in the static HTML shell so AI crawlers that
				  do not wait on streamed Suspense still see one LocalBusiness.
				  Service pages keep their own Service nodes; this node does not
				  repeat the 48-item offer catalog on every URL.
				*/}
				<JsonLd data={[websiteJsonLd(), localBusinessJsonLd()]} />
				<OfficeHoursScript />
				<AppCommandShell />
			</body>
		</html>
	)
}
