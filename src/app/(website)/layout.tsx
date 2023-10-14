import { Provider } from "../../utils/provider";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import "./globals.css";
//import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

export default async function RootLayout({ children, props }: { children: React.ReactNode; props?: any }) {
	console.log("Layout", props);
	return (
		<Provider>
			<html lang="en">
				<head>
					{/* <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-6TLN795BRR"></Script>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', 'G-6TLN795BRR');
					`}
				</Script> */}
				</head>
				<body className="bg-gray-50 text-base">
					<Header />
					{children}
					<Analytics />
					<Footer />
					{/* <Script id="ze-snippet" strategy="lazyOnload" src="https://static.zdassets.com/ekr/snippet.js?key=06e45130-bfd2-4b2b-8137-28903b96f527"></Script> */}
				</body>
			</html>
		</Provider>
	);
}
