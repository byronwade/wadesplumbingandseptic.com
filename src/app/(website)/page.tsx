import LogoCloud from "@/components/sections/LogoCloud";
import FAQ from "@/components/sections/FAQ";
import Testimonials from "@/components/sections/Testimonials";
import { Step } from "@/components/sections/Step";
import FeatureSection from "@/components/sections/FeatureSection";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		default: "Wade's Plumbing & Septic",
		template: "%s | Wade's Plumbing & Septic",
	},
	description: "Wade's Plumbing & Septic is your go-to local plumbing company. With years of experience, our team of experts provides top-notch plumbing and septic services to ensure your home or business runs smoothly. Trust us for all your plumbing needs, big or small.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	referrer: "origin-when-cross-origin",
	keywords: ["Next.js", "React", "JavaScript"],
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
		title: "Wade's Plumbing & Septic",
		description: "Wade's Plumbing & Septic is your go-to local plumbing company. With years of experience, our team of experts provides top-notch plumbing and septic services to ensure your home or business runs smoothly. Trust us for all your plumbing needs, big or small.",
		creator: "@wadesplumbing",
		images: {
			url: "http://localhost:3002/api/og?title=Wade's Plumbing & Septic&link=www.wadesplumbingandseptic.com&description=Wade's Plumbing & Septic is your go-to local plumbing company. With years of experience, our team of experts provides top-notch plumbing and septic services to ensure your home or business runs smoothly. Trust us for all your plumbing needs, big or small.",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Wade's Plumbing & Septic",
		description: "Wade's Plumbing & Septic is your go-to local plumbing company. With years of experience, our team of experts provides top-notch plumbing and septic services to ensure your home or business runs smoothly. Trust us for all your plumbing needs, big or small.",
		url: "https://nextjs.org",
		siteName: "Next.js",
		images: [
			{
				url: "http://localhost:3002/api/og?title=Wade's Plumbing & Septic&link=www.wadesplumbingandseptic.com&description=Wade's Plumbing & Septic is your go-to local plumbing company. With years of experience, our team of experts provides top-notch plumbing and septic services to ensure your home or business runs smoothly. Trust us for all your plumbing needs, big or small.",
				width: 800,
				height: 600,
			},
			{
				url: "http://localhost:3002/api/og?title=wades%20plumbing&link=www.wadesplumbingandseptic.com&description=Wade's Plumbing & Septic is your go-to local plumbing company. With years of experience, our team of experts provides top-notch plumbing and septic services to ensure your home or business runs smoothly. Trust us for all your plumbing needs, big or small.",
				width: 1800,
				height: 1600,
				alt: "Wade's Plumbing & Septic",
			},
		],
		locale: "en-US",
		type: "website",
	},
};

export default function Home() {
	return (
		<>
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
