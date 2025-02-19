import "./globals.css";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { GeistSans } from "geist/font/sans";

export const viewport = {
	width: "device-width",
	initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={GeistSans.className} suppressHydrationWarning>
			<body className="text-base bg-gray-50">
				<main>{children}</main>
				<GoogleTagManager gtmId="AW-11125439577" />
				<GoogleAnalytics gaId="G-0XZEMVRJF1" />
			</body>
		</html>
	);
}
