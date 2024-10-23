import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GeistSans } from "geist/font/sans";

export const viewport = {
	width: "device-width",
	initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={GeistSans.className}>
			<body className="text-base bg-gray-50">
				<main>{children}</main>
				<Analytics />
				<SpeedInsights />
				<GoogleAnalytics gaId="G-0XZEMVRJF1" />
			</body>
		</html>
	);
}
