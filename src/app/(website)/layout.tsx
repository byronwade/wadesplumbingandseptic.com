import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import "./globals.css";
import getMenu from "./getMenu";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import CTA from "@/components/sections/CTA";
import { GeistSans } from "geist/font";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const data = await getMenu();
	return (
		<html lang="en" className={`${GeistSans.variable}`}>
			<Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-6TLN795BRR"></Script>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', 'G-6TLN795BRR');
					`}
			</Script>
			{/* <Script data-project-id="XFjOtiZNrxOwMe6WThuLOII0N5rmeMw02hH3ufeR" src="https://snippet.meticulous.ai/v1/meticulous.js" /> */}
			<body className="bg-gray-50 text-base">
				<main>{children}</main>
				{/* <Script id="ze-snippet" strategy="lazyOnload" src="https://static.zdassets.com/ekr/snippet.js?key=06e45130-bfd2-4b2b-8137-28903b96f527"></Script> */}

				<Analytics />
			</body>
		</html>
	);
}
