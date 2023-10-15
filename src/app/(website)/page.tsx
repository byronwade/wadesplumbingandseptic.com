import LogoCloud from "@/components/sections/LogoCloud";
import FAQ from "@/components/sections/FAQ";
import Testimonials from "@/components/sections/Testimonials";
import { Step } from "@/components/sections/Step";
import FeatureSection from "@/components/sections/FeatureSection";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import { Metadata } from "next";
import Head from "next/head";
import Script from "next/script";

export const metadata: Metadata = {
	title: {
		default: "Wade's Plumbing & Septic - 24/7 Emergency Service - Santa Cruz, Monterey, Santa Clara",
		template: "%s | Wade's Plumbing & Septic",
	},
	description: "Wade's Plumbing & Septic offers 24/7 emergency plumbing and septic services across Santa Cruz, Monterey, and Santa Clara Counties. Our experienced team is ready to assist you anytime, any day. Contact us for all your plumbing and septic needs!",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	keywords: ["24/7 Plumbing Service", "Emergency Plumbing", "Plumbing Santa Cruz", "Plumbing Monterey", "Plumbing Santa Clara"],
	authors: [{ name: "Byron Wade" }, { name: "Byron Wade", url: "https://www.wadesplumbingandseptic.com/" }],
	creator: "Byron Wade",
	publisher: "Byron Wade",
	alternates: {},
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	category: "construction",
	bookmarks: ["https://www.wadesplumbingandseptic.com/"],
	twitter: {
		card: "summary_large_image",
		title: "Wade's Plumbing & Septic - 24/7 Emergency Service - Santa Cruz, Monterey, Santa Clara",
		description: "Wade's Plumbing & Septic offers 24/7 emergency plumbing and septic services across Santa Cruz, Monterey, and Santa Clara Counties. Contact us for immediate assistance!",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/social-image.jpg",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Wade's Plumbing & Septic - 24/7 Emergency Service - Santa Cruz, Monterey, Santa Clara",
		description: "Wade's Plumbing & Septic offers 24/7 emergency plumbing and septic services across Santa Cruz, Monterey, and Santa Clara Counties. Contact us for immediate assistance!",
		url: "https://www.wadesplumbingandseptic.com",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/og-image.jpg",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/og-image2.jpg",
				width: 1800,
				height: 1600,
				alt: "Wade's Plumbing & Septic",
			},
		],
		locale: "en-US",
		type: "website",
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "Plumbing",
	name: "Wade's Plumbing & Septic",
	address: {
		"@type": "PostalAddress",
		streetAddress: "123 Main St",
		addressLocality: "Santa Cruz",
		addressRegion: "CA",
		postalCode: "95060",
		addressCountry: "US",
	},
	telephone: "+1-831-123-4567",
	url: "https://www.wadesplumbingandseptic.com",
	logo: "https://www.wadesplumbingandseptic.com/logo.png",
	image: "https://www.wadesplumbingandseptic.com/og-image.jpg",
	description: "Wade's Plumbing & Septic offers 24/7 emergency plumbing and septic services across Santa Cruz, Monterey, and Santa Clara Counties. Contact us for all your plumbing and septic needs!",
	priceRange: "$$",
	geo: {
		"@type": "GeoCoordinates",
		latitude: "36.974117",
		longitude: "-122.030796",
	},
	openingHours: "Mo-Su 00:00-23:59",
	sameAs: ["https://www.facebook.com/wadesplumbing", "https://www.twitter.com/wadesplumbing", "https://www.linkedin.com/company/wadesplumbing"],
};

export default function Home() {
	return (
		<>
			<Head>
				<Script strategy="beforeInteractive" id="my-ldjson-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			</Head>
			<HeroSection />
			<Step />
			<FeatureSection />
			<FAQ />
			{/* <Testimonials /> */}
			<LogoCloud />
			<Testimonials />
			<StatsSection />
		</>
	);
}
