import "./globals.css";
import { GeistSans } from "geist/font/sans";

export const viewport = {
	themeColor: "#bc6f30",
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${GeistSans.variable} w-full h-full dark`}>
			<body className="bg-gray-50 text-base h-full w-full">{children}</body>
		</html>
	);
}
