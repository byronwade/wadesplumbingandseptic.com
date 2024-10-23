import LogoCloud from "@/components/sections/LogoCloud";
import FAQ from "@/components/sections/FAQ";
import Testimonials from "@/components/sections/Testimonials";
import { Step } from "@/components/sections/Step";
import FeatureSection from "@/components/sections/FeatureSection";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
	metadataBase: new URL("https://www.wadesplumbingandseptic.com/"),
	title: {
		default: "Wade's Plumbing & Septic - Santa Cruz, Monterey, Santa Clara",
		template: "%s | Wade's Plumbing & Septic",
	},
	description: "Wade's Plumbing & Septic offers septic services across Santa Cruz, Monterey, and Santa Clara Counties. Our experienced team is ready to assist you anytime, any day. Contact us for all your plumbing and septic needs!",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	keywords: ["24/7 Plumbing Service", "Emergency Plumbing", "Plumbing Santa Cruz", "Plumbing Monterey", "Plumbing Santa Clara"],
	authors: [{ name: "Byron Wade" }, { name: "Byron Wade", url: "https://www.wadesplumbingandseptic.com/" }],
	creator: "Byron Wade",
	publisher: "Byron Wade",
	robots: "index, follow",
	viewport: "width=device-width, initial-scale=1.0",
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
		title: "Wade's Plumbing & Septic - Santa Cruz, Monterey, Santa Clara",
		description: "Wade's Plumbing & Septic offers septic services across Santa Cruz, Monterey, and Santa Clara Counties. Contact us for immediate assistance!",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Wade's Plumbing & Septic - Santa Cruz, Monterey, Santa Clara",
		description: "Wade's Plumbing & Septic offers septic services across Santa Cruz, Monterey, and Santa Clara Counties. Contact us for immediate assistance!",
		url: "https://www.wadesplumbingandseptic.com",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Where%20quality%20meets%20community",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Where%20quality%20meets%20community",
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
	"@type": "ProfessionalService",
	additionalType: "http://www.productontology.org/id/Plumbing",
	name: "Wade's Plumbing & Septic",
	address: {
		"@type": "PostalAddress",
		streetAddress: "7737 hwy 9",
		addressLocality: "Ben Lomond",
		addressRegion: "CA",
		postalCode: "95005",
		addressCountry: "US",
	},
	telephone: "+1-831-225-4344",
	url: "https://www.wadesplumbingandseptic.com",
	logo: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
	image: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Where%20quality%20meets%20community",
	description: "Wade's Plumbing & Septic offers septic services across Santa Cruz, Monterey, and Santa Clara Counties. Contact us for all your plumbing and septic needs!",
	priceRange: "$$",
	geo: {
		"@type": "GeoCoordinates",
		latitude: "37.1426021",
		longitude: "-121.977974",
	},
	openingHours: "Mo-Su 00:00-23:59",
	sameAs: ["https://www.facebook.com/wadesplumbingandseptic/", "https://www.instagram.com/wadesplumbing/?hl=en"],
};


export default function Home() {
	return (
		<>
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
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
