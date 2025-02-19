import { Suspense } from "react";
import dynamic from "next/dynamic";
import getMenu from "../getMenu";
import type { Metadata } from "next";

// Loading Components
const LoadingPulse = ({ className }: { className: string }) => <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />;

// Dynamic imports with loading states and preload hints
const Header = dynamic(() => import("@/components/sections/Header"), {
	loading: () => <LoadingPulse className="h-24" />,
	ssr: true,
});

const Footer = dynamic(() => import("@/components/sections/Footer"), {
	loading: () => <LoadingPulse className="h-96" />,
});

const CTA = dynamic(() => import("@/components/sections/CTA"), {
	loading: () => <LoadingPulse className="h-48" />,
});

// Progressive loading component
function ProgressiveLoading() {
	return (
		<div className="space-y-4">
			<LoadingPulse className="h-24" />
			<LoadingPulse className="h-[calc(100vh-6rem)]" />
			<LoadingPulse className="h-96" />
		</div>
	);
}

export const metadata: Metadata = {
	metadataBase: new URL("https://www.wadesplumbingandseptic.com"),
	title: {
		template: "%s | Wade's Plumbing & Septic",
		default: "Wade's Plumbing & Septic - Santa Cruz's Premier Plumbing Service",
	},
	description: "Santa Cruz's trusted 24/7 plumbing and septic service. Professional plumbers serving Santa Cruz County with emergency services, repairs, and maintenance.",
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

async function LayoutContent() {
	try {
		const data = await getMenu();

		return (
			<>
				<Suspense fallback={<LoadingPulse className="h-24" />}>
					<Header data={data} />
				</Suspense>

				<main className="min-h-screen">
					<Suspense fallback={<ProgressiveLoading />}>
						<div id="content" />
					</Suspense>
					<Suspense fallback={<LoadingPulse className="h-48" />}>
						<CTA />
					</Suspense>
				</main>

				<Suspense fallback={<LoadingPulse className="h-96" />}>
					<Footer />
				</Suspense>
			</>
		);
	} catch (error) {
		console.error("Error in LayoutContent:", error);
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
					<p className="mt-2 text-gray-600">Please try refreshing the page</p>
				</div>
			</div>
		);
	}
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Suspense fallback={<ProgressiveLoading />}>
				<LayoutContent />
			</Suspense>
			{children}
		</>
	);
}
