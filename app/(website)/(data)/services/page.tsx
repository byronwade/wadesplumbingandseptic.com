"use server";

import { Suspense } from "react";
import { headers } from "next/headers";
import { getServices } from "@/actions/getServices";
import ServicesPageContent from "./components/ServicesPageContent";
import { cache } from "react";
import type { Metadata } from "next";

// Loading Components
const LoadingPulse = ({ className }: { className: string }) => <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />;

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "ProfessionalService",
	additionalType: "http://www.productontology.org/id/Plumbing",
	name: "Wade's Plumbing & Septic Services",
	description: "Explore our wide range of plumbing and septic services available 24/7 in Santa Cruz, Monterey, and Santa Clara Counties. From routine maintenance to emergency repairs, we've got you covered.",
	url: "https://www.wadesplumbingandseptic.com/services/",
	telephone: "+1-831-225-4344",
	address: {
		"@type": "PostalAddress",
		streetAddress: "7737 hwy 9",
		addressLocality: "Ben Lomond",
		addressRegion: "CA",
		postalCode: "95005",
		addressCountry: "US",
	},
	geo: {
		"@type": "GeoCoordinates",
		latitude: "37.1426021",
		longitude: "-121.977974",
	},
	openingHours: "Mo-Su 00:00-23:59",
	priceRange: "$$",
	sameAs: ["https://www.facebook.com/wadesplumbingandseptic/", "https://www.instagram.com/wadesplumbing/?hl=en"],
};

export default async function ServicesPage({ searchParams }) {
	const nextjs15 = await searchParams;
	const searchTerm = nextjs15?.search ?? "";
	const currentPage = nextjs15?.page ? parseInt(nextjs15.page) : 1;
	const headersList = headers();

	try {
		const { services = [], total = 0 } = await getServices({ searchTerm, page: currentPage });

		if (!Array.isArray(services)) {
			console.error("Services is not an array:", services);
			throw new Error("Invalid services data");
		}

		return (
			<Suspense fallback={<LoadingPulse className="h-screen" />}>
				<ServicesPageContent services={services} total={total} searchTerm={searchTerm} currentPage={currentPage} />
			</Suspense>
		);
	} catch (error) {
		console.error("Error loading services:", error);
		return (
			<div className="py-10 text-center">
				<p className="text-red-500">Error loading services. Please try again later.</p>
			</div>
		);
	}
}
