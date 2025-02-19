"use server";

import { Suspense } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getServiceDetails } from "@/actions/getServices";
import { getRelatedArticles } from "@/actions/getRelatedArticles";
import { getSidebarContent } from "@/actions/getSidebarContent";
import ServicePageContent from "./ServicePageContent";

// Loading Components
const LoadingPulse = ({ className }: { className: string }) => <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />;

export default async function ServicePage(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const headersList = headers();

	try {
		const [{ service }, relatedArticles, sidebarContent] = await Promise.all([getServiceDetails(params.slug), getRelatedArticles("/services"), getSidebarContent("/services")]);

		if (!service) {
			notFound();
		}

		return (
			<Suspense fallback={<LoadingPulse className="h-screen" />}>
				<ServicePageContent service={service} relatedArticles={relatedArticles} sidebarContent={sidebarContent} />
			</Suspense>
		);
	} catch (error) {
		console.error("Error loading service:", error);
		return (
			<div className="py-10 text-center">
				<p className="text-red-500">Error loading service. Please try again later.</p>
			</div>
		);
	}
}
