"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const router = usePathname();

	if (router == "/about-us" || router == "/about-us/jobs" || router == "/about-us/promotions" || router == "/about-us/reviews" || router == "/about-us/discounts") {
		return <>{children}</>;
	}

	// if (router.includes("/about-us/jobs")) {
	// 	return <>{children}</>;
	// }

	return (
		<section className="bg-gray-50 relative overflow-hidden">
			<Image fill priority className="object-right-top object-cover pointer-events-none" src="/background.webp" alt="Background image for our plumbing website" />
			<div className="relative z-1 py-16 px-6 sm:py-24 lg:px-8">
				<div className="mx-auto max-w-7xl">
					<div className="prose max-w-2xl bg-white p-4 md:p-8 rounded">
						<Image className="w-auto h-auto" src="/WadesLogo.png" width={100} height={100} alt="Wade' Plumbing & Septic Logo" />
						{children}
					</div>
				</div>
			</div>
		</section>
	);
}
