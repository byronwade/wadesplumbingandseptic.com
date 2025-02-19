import { Suspense } from "react";
import dynamic from "next/dynamic";
import getMenu from "../getMenu";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";

// Loading Components with memoization
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

// Enhanced cache menu data with revalidation
const getCachedMenuData = unstable_cache(
	async () => {
		try {
			return await getMenu();
		} catch (error) {
			console.error("Error fetching menu:", error);
			return null;
		}
	},
	["menu-data"],
	{
		revalidate: 3600, // Revalidate every hour
		tags: ["menu"],
	}
);

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	try {
		headers(); // Call headers outside the cached function
		const data = await getCachedMenuData();

		return (
			<>
				<Suspense fallback={<LoadingPulse className="h-24" />}>
					<Header data={data} />
				</Suspense>

				<main className="min-h-screen">
					<Suspense fallback={<ProgressiveLoading />}>{children}</Suspense>
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
		console.error("Error in RootLayout:", error);
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
