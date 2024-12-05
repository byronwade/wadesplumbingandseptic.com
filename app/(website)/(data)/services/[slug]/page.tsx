import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cache } from "react";
import Script from "next/script";
import ContactForm from "@/components/forms/ContactForm";
import NewsletterSection from "@/components/sections/NewsletterSection";
import { RelatedArticlesSection } from "@/components/sections/RelatedArticlesSection";
import { Sidebar } from "@/components/sections/Sidebar";
import SocialBar from "@/components/sections/SocialBar";
import { getServiceDetails } from "@/actions/getServices";
import { getRelatedArticles } from "@/actions/getRelatedArticles";
import { getSidebarContent } from "@/actions/getSidebarContent";

// Loading Components
const LoadingPulse = ({ className }: { className: string }) => <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />;

// Cached data fetching
const getServiceDetailsWithCache = cache(async (slug: string) => {
	return getServiceDetails(slug);
});

const getRelatedArticlesWithCache = cache(async (pathname: string) => {
	return getRelatedArticles(pathname);
});

const getSidebarContentWithCache = cache(async (pathname: string) => {
	return getSidebarContent(pathname);
});

// Optimized JSON-LD generation
const generateJsonLd = cache((postDetails) => {
	return {
		"@context": "https://schema.org",
		"@type": "Service",
		name: postDetails.title,
		serviceType: postDetails.categories?.join(", "),
		provider: {
			"@type": "Organization",
			name: "Wade's Plumbing & Septic",
			telephone: "+1-831-225-4344",
			url: "https://www.wadesplumbingandseptic.com",
			address: {
				"@type": "PostalAddress",
				streetAddress: "7737 hwy 9",
				addressLocality: "Ben Lomond",
				addressRegion: "CA",
				postalCode: "95005",
				addressCountry: "US",
			},
		},
		image: postDetails.featuredImage?.sourceurl || "https://www.wadesplumbingandseptic.com/placeholder.webp",
		areaServed: ["Santa Cruz County", "Monterey County", "Santa Clara County"],
		description: postDetails.excerpt,
		url: `https://www.wadesplumbingandseptic.com/services/${postDetails.slug}`,
	};
});

// Metadata generation with improved SEO
export async function generateMetadata({ params }) {
	const nextjs15 = await params;
	const { service } = await getServiceDetailsWithCache(nextjs15.slug);
	if (!service) return {};

	const ogImage = service.featuredImage?.sourceurl || "https://www.wadesplumbingandseptic.com/placeholder.webp";

	return {
		title: service.title,
		description: service.excerpt,
		openGraph: {
			title: service.title,
			description: service.excerpt,
			images: [{ url: ogImage, width: 1200, height: 630, alt: service.title }],
			type: "article",
			url: `https://www.wadesplumbingandseptic.com/services/${service.slug}`,
			publishedTime: service.created_at,
			modifiedTime: service.updated_at,
			authors: service.author ? [service.author.username] : undefined,
			section: "Services",
		},
		twitter: {
			card: "summary_large_image",
			title: service.title,
			description: service.excerpt,
			images: [ogImage],
			creator: "@wadesplumbing",
		},
		alternates: {
			canonical: `https://www.wadesplumbingandseptic.com/services/${service.slug}`,
		},
	};
}

// Main component with streaming and suspense boundaries
export default async function ServicePage({ params }: { params: { slug: string } }) {
	const slug = await Promise.resolve(params.slug);
	const [{ service: serviceDetails }, relatedArticles, sidebarContent] = await Promise.all([getServiceDetailsWithCache(slug), getRelatedArticlesWithCache("/services"), getSidebarContentWithCache("/services")]);

	if (!serviceDetails) {
		notFound();
	}

	const dateObj = new Date(serviceDetails.created_at);
	const formattedDate = dateObj.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
	const formattedTime = dateObj.toLocaleTimeString([], {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});

	const jsonLd = generateJsonLd(serviceDetails);

	return (
		<section>
			<Script id="service-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-white dark:bg-gray-900">
				<div className="container relative z-20 px-4 py-16 mx-auto sm:px-6 lg:px-8">
					<div className="flex flex-col lg:flex-row">
						<div className="w-full lg:w-2/3">
							<article className="w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
								<div className="relative w-full">
									<Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw" priority className="w-full mb-6 rounded" width={1000} height={1000} src={serviceDetails.featuredImage?.sourceurl || "/placeholder.webp"} alt={serviceDetails.featuredImage?.alttext || serviceDetails.title} />
									<div className="w-full py-6 mx-auto space-y-1">
										<span className="block text-gray-800">
											Published in{" "}
											<span className="font-semibold text-black">
												{serviceDetails.categories?.map((category, index) => (
													<span key={index}>
														{category}
														{index !== serviceDetails.categories.length - 1 ? ", " : ""}
													</span>
												))}
											</span>
										</span>
										<h1 dangerouslySetInnerHTML={{ __html: serviceDetails.title || "" }} className="max-w-4xl text-2xl font-extrabold leading-none text-black sm:text-3xl lg:text-4xl" />
									</div>
								</div>
								<div className="flex flex-col justify-between lg:flex-row lg:items-center">
									<div className="flex items-center mb-2 space-x-3 text-base text-gray-800 dark:text-gray-400 lg:mb-0">
										{serviceDetails.author && (
											<>
												<span>
													By <span className="font-semibold text-black no-underline dark:text-white">{serviceDetails.author.username || ""}</span>
												</span>
												<span className="w-2 h-2 bg-gray-300 rounded-full dark:bg-gray-400" />
											</>
										)}
										<span>
											<time className="font-normal text-gray-800 dark:text-gray-400" dateTime={serviceDetails.created_at || ""} title={`${formattedDate} at ${formattedTime}`}>
												{formattedDate} at {formattedTime}
											</time>
										</span>
									</div>
									<Suspense fallback={<LoadingPulse className="w-32 h-8" />}>
										<SocialBar />
									</Suspense>
								</div>
								<div className="prose prose-lg dark:prose-invert max-w-none">
									<div dangerouslySetInnerHTML={{ __html: serviceDetails.content || "" }} />
								</div>
								<div className="!mt-16">
									<h2 className="mb-4 font-extrabold text-black sm:text-3xl lg:text-4xl">Get a free quote</h2>
									<Suspense fallback={<LoadingPulse className="h-96" />}>
										<ContactForm />
									</Suspense>
								</div>
							</article>
						</div>
						<div className="w-full mt-8 lg:w-1/3 lg:pl-8">
							<Suspense fallback={<LoadingPulse className="h-full min-h-[400px]" />}>
								<Sidebar pathname="/services" data={sidebarContent} />
							</Suspense>
						</div>
					</div>
				</div>
			</div>
			<Suspense fallback={<LoadingPulse className="h-64" />}>
				<RelatedArticlesSection pathname="/services" data={relatedArticles} />
			</Suspense>
			<Suspense fallback={<LoadingPulse className="h-48" />}>
				<NewsletterSection />
			</Suspense>
		</section>
	);
}
