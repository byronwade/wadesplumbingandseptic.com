import "./globals.css";
import { GeistSans } from "geist/font/sans";

export const viewport = {
	width: "device-width",
	initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${GeistSans.variable} w-full h-full dark`}>
			<body className="w-full h-full text-base bg-gray-50">{children}</body>
		</html>
	);
}
