import ContactForm from "@/components/forms/ContactForm";
import LogoCloud from "@/components/sections/LogoCloud";
import Testimonials from "@/components/sections/Testimonials";
import ContactPage from "../(data)/contact-us/page";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/sections/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
	metadataBase: new URL("https://www.wadesplumbingandseptic.com"),
	title: {
		template: "%s | Wade's Plumbing & Septic",
		default: "Professional Plumbing Services | Wade's Plumbing & Septic",
	},
	description: "Expert plumbing services in Santa Cruz, Monterey & Santa Clara Counties. 24/7 emergency service, professional solutions, and guaranteed satisfaction.",
	openGraph: {
		type: "website",
		locale: "en_US",
		siteName: "Wade's Plumbing & Septic",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<div className="bg-black text-white sticky top-0 z-50">
				<div className="relitive flex p-3 items-center justify-between mx-auto max-w-7xl px-6 lg:px-8">
					<Link href="/" className="flex items-center space-x-4 hover:underline">
						<Image className="w-auto h-auto" src="/WadesLogo.webp" alt="Wade's Plumbing & Septic Logo" width={40} height={40} />
						<span className="font-bold text-2xl hidden md:inline-flex">Wades Plumbing &amp; Septic</span>
					</Link>
					<Link href="tel:18312254344" className="inline-flex justify-center rounded font-bold px-3.5 py-2.5 bg-brand text-black hover:bg-brand-600">
						Call (831)-225-4344
					</Link>
				</div>
			</div>
			{children}
			<div>
				<ContactPage />
			</div>
			<Footer />
		</>
	);
}
