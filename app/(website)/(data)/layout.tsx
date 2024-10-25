import { Suspense } from "react";
import dynamic from "next/dynamic";
import getMenu from "../getMenu";

const Header = dynamic(() => import("@/components/sections/Header"));
const Footer = dynamic(() => import("@/components/sections/Footer"));
const CTA = dynamic(() => import("@/components/sections/CTA"));

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const data = await getMenu();
	return (
		<>
			<Suspense fallback={<p>Loading header...</p>}>
				<Header data={data} />
			</Suspense>
			<main>
				{children}
				<Suspense fallback={<p>Loading CTA...</p>}>
					<CTA />
				</Suspense>
			</main>
			<Suspense fallback={<p>Loading footer...</p>}>
				<Footer />
			</Suspense>
		</>
	);
}
