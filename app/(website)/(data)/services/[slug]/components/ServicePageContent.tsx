"use client";

import Image from "next/image";
import { Suspense } from "react";
import Script from "next/script";
import ContactForm from "@/components/forms/ContactForm";
import NewsletterSection from "@/components/sections/NewsletterSection";
import { RelatedArticlesSection } from "@/components/sections/RelatedArticlesSection";
import { Sidebar } from "@/components/sections/Sidebar";

// Loading Components
const LoadingPulse = ({ className }: { className: string }) => <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />;

interface ServicePageContentProps {
	service: any;
	relatedArticles: any;
	sidebarContent: any;
}

export default function ServicePageContent({ service, relatedArticles, sidebarContent }: ServicePageContentProps) {
	return (
		<>
			<div className="bg-white dark:bg-gray-900">
				<div className="container relative z-20 px-4 mx-auto sm:px-6 lg:px-8">
					<div className="flex flex-col lg:flex-row">
						<article className="w-full lg:w-2/3" itemScope itemType="https://schema.org/Service">
							<Suspense fallback={<LoadingPulse className="h-[537px]" />}>
								{service.featuredImage && service.featuredImage[0] && (
									<div className="relative w-full h-[300px] sm:h-[400px] md:h-[460px] xl:h-[537px] mb-8">
										<Image
											src={service.featuredImage[0].sourceurl || "/placeholder.webp"}
											alt={service.featuredImage[0].alttext || service.title}
											fill
											className="object-cover rounded-lg"
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
											priority
											onError={(e) => {
												console.error("Image load error:", e);
												const target = e.target as HTMLImageElement;
												target.src = "/placeholder.webp";
											}}
										/>
									</div>
								)}
							</Suspense>
							<div className="mb-8">
								<div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
									{service.categories && (
										<div className="flex flex-wrap gap-2">
											{service.categories.map((category: string, index: number) => (
												<span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded-full dark:bg-gray-800">
													{category}
												</span>
											))}
										</div>
									)}
								</div>
								<h1 itemProp="name" className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
									{service.title}
								</h1>
								{service.excerpt && <div className="text-xl text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: service.excerpt }} />}
							</div>
							<div className="prose prose-lg prose-blue max-w-none dark:prose-invert" itemProp="description" dangerouslySetInnerHTML={{ __html: service.content }} />
							<div className="mt-12">
								<h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">Get a Free Quote</h2>
								<Suspense fallback={<LoadingPulse className="h-96" />}>
									<ContactForm />
								</Suspense>
							</div>
						</article>
						<aside className="w-full mt-8 lg:w-1/3 lg:mt-0 lg:pl-8">
							<div className="sticky top-4">
								<Suspense fallback={<LoadingPulse className="h-96" />}>
									<Sidebar pathname="/services" data={sidebarContent} />
								</Suspense>
							</div>
						</aside>
					</div>
				</div>
			</div>
			<Suspense fallback={<LoadingPulse className="h-96" />}>
				<RelatedArticlesSection pathname="/services" data={relatedArticles} />
			</Suspense>
			<NewsletterSection />
		</>
	);
}
