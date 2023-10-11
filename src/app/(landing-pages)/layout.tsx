"use client";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const router = usePathname();

	if (router == "/about-us/jobs") {
		return <>{children}</>;
	}

	// if (router.includes("/about-us/jobs")) {
	// 	return <>{children}</>;
	// }

	return <>{children}</>;
}
