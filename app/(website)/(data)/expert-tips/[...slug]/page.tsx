import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Script from "next/script";
import type { Metadata } from "next/types";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { getTipDetails } from "@/actions/getTips";
import { getRelatedArticles } from "@/actions/getRelatedArticles";
import { getSidebarContent } from "@/actions/getSidebarContent";
import { Sidebar } from "@/components/sections/Sidebar";
import { RelatedArticlesSection } from "@/components/sections/RelatedArticlesSection";
import NewsletterSection from "@/components/sections/NewsletterSection";

// Loading Components
const LoadingPulse = ({ className }: { className: string }) => <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />;

// Progressive loading component
function ProgressiveLoading() {
	return (
		<div className="space-y-4">
			<LoadingPulse className="h-[400px]" />
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="md:col-span-2">
					<LoadingPulse className="h-24" />
					<LoadingPulse className="h-96 mt-4" />
				</div>
				<LoadingPulse className="h-[600px]" />
			</div>
		</div>
	);
}

// Types
interface TipDetails {
	id: any;
	title: string;
	content: string;
	excerpt: string;
	description?: string;
	created_at: string;
	updated_at?: string;
	readingtime?: string;
	categories?: string[];
	author?: Array<{ id: any; username: string }>;
	featuredImage?: Array<{ sourceurl: string; alttext: string; sizes: any }>;
	slug: string;
}

// Enhanced cached data fetching
const getTipDetailsWithCache = unstable_cache(
	async (slug: string) => {
		return getTipDetails(slug);
	},
	["tip-details"],
	{
		revalidate: 3600,
		tags: ["tips"],
	}
);

const getRelatedArticlesWithCache = unstable_cache(
	async (pathname: string) => {
		return getRelatedArticles(pathname);
	},
	["related-articles"],
	{
		revalidate: 3600,
		tags: ["articles"],
	}
);

const getSidebarContentWithCache = unstable_cache(
	async (pathname: string) => {
		return getSidebarContent(pathname);
	},
	["sidebar-content"],
	{
		revalidate: 3600,
		tags: ["sidebar"],
	}
);

async function getTipData(slug: string) {
	headers(); // Call headers outside of cached functions
	return getTipDetailsWithCache(slug);
}

async function getRelatedArticlesData(pathname: string) {
	headers(); // Call headers outside of cached functions
	return getRelatedArticlesWithCache(pathname);
}

async function getSidebarContentData(pathname: string) {
	headers(); // Call headers outside of cached functions
	return getSidebarContentWithCache(pathname);
}

// Format date on the server to avoid hydration mismatch
function formatDateSafely(dateStr: string | undefined): string {
	if (!dateStr) return "2023-01-01T00:00:00.000Z";
	try {
		const timestamp = Date.parse(dateStr);
		return isNaN(timestamp) ? "2023-01-01T00:00:00.000Z" : new Date(timestamp).toISOString();
	} catch {
		return "2023-01-01T00:00:00.000Z";
	}
}

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
	const params = await props.params;
	const slug = await Promise.resolve(params.slug);
	const joinedSlug = Array.isArray(slug) ? slug.join("/") : slug;
	const tipDetails = await getTipData(joinedSlug);

	if (!tipDetails?.tip) return {};

	const ogImage = tipDetails.tip.featuredImage?.[0]?.sourceurl || "https://www.wadesplumbingandseptic.com/placeholder.webp";
	const formattedDate = formatDateSafely(tipDetails.tip.created_at);
	const ogImageUrl = `https://www.wadesplumbingandseptic.com/api/og?title=${encodeURIComponent(tipDetails.tip.title)}&description=${encodeURIComponent(tipDetails.tip.excerpt)}`;

	return {
		metadataBase: new URL("https://www.wadesplumbingandseptic.com"),
		title: {
			absolute: `${tipDetails.tip.title} | Santa Cruz Plumbing & Septic Expert Tips | Wade's Plumbing`,
		},
		description: `${tipDetails.tip.excerpt} - Expert plumbing tips from Santa Cruz's trusted plumbing professionals at Wade's Plumbing & Septic.`,
		generator: "Next.js",
		applicationName: "Wade's Plumbing & Septic - Santa Cruz",
		keywords: ["Santa Cruz plumber", "Santa Cruz plumbing tips", "local plumbing advice", "Santa Cruz septic service", "plumbing maintenance Santa Cruz", "emergency plumber Santa Cruz", "professional plumber Santa Cruz", "plumbing tips", "septic maintenance", "plumbing advice", "septic system care", ...(tipDetails.tip.categories || [])],
		authors: [
			{
				name: tipDetails.tip.author?.[0]?.username || "Wade's Plumbing & Septic",
				url: "https://www.wadesplumbingandseptic.com/",
			},
		],
		creator: tipDetails.tip.author?.[0]?.username || "Byron Wade",
		publisher: "Wade's Plumbing & Septic - Santa Cruz's Premier Plumbing Service",
		openGraph: {
			title: `${tipDetails.tip.title} | Expert Plumbing Tips from Santa Cruz's Top Plumbers`,
			description: `${tipDetails.tip.excerpt} - Professional plumbing advice from Santa Cruz's most trusted plumbing experts.`,
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: `${tipDetails.tip.title} - Santa Cruz Plumbing Tips`,
					type: "image/jpeg",
				},
				{
					url: ogImageUrl,
					width: 1800,
					height: 1600,
					alt: `${tipDetails.tip.title} - Santa Cruz Plumbing Guide`,
				},
			],
			type: "article",
			url: `https://www.wadesplumbingandseptic.com/expert-tips/${joinedSlug}`,
			publishedTime: formattedDate,
			modifiedTime: formattedDate,
			authors: tipDetails.tip.author ? [tipDetails.tip.author[0]?.username] : ["Wade's Plumbing & Septic"],
			section: "Santa Cruz Plumbing Tips",
			tags: ["Santa Cruz plumber", "local plumbing tips", "California plumbing", ...(tipDetails.tip.categories || [])],
			siteName: "Wade's Plumbing & Septic - Santa Cruz",
			locale: "en_US",
		},
		twitter: {
			card: "summary_large_image",
			title: `${tipDetails.tip.title} | Santa Cruz Plumbing Tips`,
			description: `${tipDetails.tip.excerpt} - Expert advice from Santa Cruz's trusted plumbers.`,
			images: [ogImage],
			creator: "@wadesplumbing",
			site: "@wadesplumbing",
		},
		alternates: {
			canonical: `https://www.wadesplumbingandseptic.com/expert-tips/${joinedSlug}`,
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
	} as const;
}

async function BlogContent({ postDetails, sidebarContent, relatedArticles }: { postDetails: TipDetails; sidebarContent: any; relatedArticles: any }) {
	try {
		const dateObj = new Date(postDetails.created_at);
		const formattedDate = dateObj.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});

		const jsonLd = [
			{
				"@context": "https://schema.org",
				"@type": "BreadcrumbList",
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: "Home",
						item: "https://www.wadesplumbingandseptic.com",
					},
					{
						"@type": "ListItem",
						position: 2,
						name: "Expert Tips",
						item: "https://www.wadesplumbingandseptic.com/expert-tips",
					},
					{
						"@type": "ListItem",
						position: 3,
						name: postDetails.title,
						item: `https://www.wadesplumbingandseptic.com/expert-tips/${postDetails.slug}`,
					},
				],
			},
			{
				"@context": "https://schema.org",
				"@type": "BlogPosting",
				headline: `${postDetails.title} - Santa Cruz Plumbing Tips`,
				description: `${postDetails.excerpt} - Expert plumbing advice from Santa Cruz's trusted professionals.`,
				image: postDetails.featuredImage?.[0]?.sourceurl || "https://www.wadesplumbingandseptic.com/placeholder.webp",
				datePublished: postDetails.created_at,
				dateModified: postDetails.updated_at || postDetails.created_at,
				author: {
					"@type": "Person",
					name: postDetails.author?.[0]?.username || "Byron Wade",
					url: "https://www.wadesplumbingandseptic.com/about-us",
				},
				publisher: {
					"@type": "Organization",
					name: "Wade's Plumbing & Septic",
					logo: {
						"@type": "ImageObject",
						url: "https://www.wadesplumbingandseptic.com/WadesLogo.webp",
					},
					address: {
						"@type": "PostalAddress",
						streetAddress: "Your Street Address", // Add your actual address
						addressLocality: "Santa Cruz",
						addressRegion: "CA",
						postalCode: "Your Zip", // Add your actual zip
						addressCountry: "US",
					},
					geo: {
						"@type": "GeoCoordinates",
						latitude: "Your Latitude", // Add your actual coordinates
						longitude: "Your Longitude",
					},
					areaServed: {
						"@type": "GeoCircle",
						geoMidpoint: {
							"@type": "GeoCoordinates",
							latitude: "Your Latitude",
							longitude: "Your Longitude",
						},
						geoRadius: "30000", // 30km radius, adjust as needed
					},
				},
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": `https://www.wadesplumbingandseptic.com/expert-tips/${postDetails.slug}`,
				},
				keywords: ["Santa Cruz plumber", "local plumbing tips", "Santa Cruz plumbing service", ...(postDetails.categories || []), "Plumbing Tips", "Expert Advice", "Plumbing Guide"].join(", "),
				articleSection: postDetails.categories?.[0] || "Santa Cruz Plumbing Tips",
				wordCount: postDetails.content?.split(/\s+/).length || 0,
				inLanguage: "en-US",
				locationCreated: {
					"@type": "Place",
					name: "Santa Cruz, California",
					address: {
						"@type": "PostalAddress",
						addressLocality: "Santa Cruz",
						addressRegion: "CA",
						addressCountry: "US",
					},
				},
			},
			{
				"@context": "https://schema.org",
				"@type": "Article",
				"@id": `https://www.wadesplumbingandseptic.com/expert-tips/${postDetails.slug}`,
				headline: `${postDetails.title} - Santa Cruz Plumbing Expert Tips`,
				description: `${postDetails.description || postDetails.excerpt} - Professional plumbing advice from Santa Cruz's trusted experts.`,
				image: {
					"@type": "ImageObject",
					url: postDetails?.featuredImage?.[0]?.sourceurl || "/placeholder.webp",
					height: 630,
					width: 1200,
				},
				datePublished: formattedDate,
				dateModified: formatDateSafely(postDetails.updated_at),
				author: {
					"@type": "Person",
					name: postDetails.author?.[0]?.username || "Wade's Plumbing & Septic",
					url: "https://www.wadesplumbingandseptic.com/about",
				},
				publisher: {
					"@type": "Organization",
					name: "Wade's Plumbing & Septic - Santa Cruz",
					logo: {
						"@type": "ImageObject",
						url: "https://www.wadesplumbingandseptic.com/WadesLogo.webp",
						width: 600,
						height: 60,
					},
					address: {
						"@type": "PostalAddress",
						streetAddress: "Your Street Address", // Add your actual address
						addressLocality: "Santa Cruz",
						addressRegion: "CA",
						postalCode: "Your Zip", // Add your actual zip
						addressCountry: "US",
					},
					geo: {
						"@type": "GeoCoordinates",
						latitude: "Your Latitude", // Add your actual coordinates
						longitude: "Your Longitude",
					},
				},
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": `https://www.wadesplumbingandseptic.com/expert-tips/${postDetails.slug}`,
				},
				articleBody: postDetails.content.replace(/<[^>]*>/g, ""),
				keywords: ["Santa Cruz plumber", "local plumbing expert", "Santa Cruz plumbing tips", ...(postDetails.categories || [])].join(", "),
				articleSection: "Santa Cruz Plumbing Expert Tips",
				inLanguage: "en-US",
				locationCreated: {
					"@type": "Place",
					name: "Santa Cruz, California",
					address: {
						"@type": "PostalAddress",
						addressLocality: "Santa Cruz",
						addressRegion: "CA",
						addressCountry: "US",
					},
				},
			},
		] as const;

		return (
			<>
				<Script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(jsonLd),
					}}
					strategy="worker"
				/>
				<div className="bg-white dark:bg-gray-900">
					<div className="container relative z-20 px-4 mx-auto sm:px-6 lg:px-8">
						<div className="flex flex-col lg:flex-row">
							<article className="w-full lg:w-2/3" itemScope itemType="https://schema.org/Article">
								<Suspense fallback={<LoadingPulse className="h-[400px]" />}>
									{postDetails.featuredImage && (
										<div className="relative w-full h-[300px] sm:h-[400px] md:h-[460px] xl:h-[537px] mb-8">
											<Image src={postDetails.featuredImage[0]?.sourceurl || "/placeholder.webp"} alt={postDetails.featuredImage[0]?.alttext || postDetails.title} fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw" priority />
										</div>
									)}
								</Suspense>
								<div className="mb-8">
									<div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
										<time dateTime={formattedDate}>
											{new Date(formattedDate).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</time>
										{postDetails.categories && (
											<div className="flex items-center gap-2">
												<span>•</span>
												<div className="flex flex-wrap gap-2">
													{postDetails.categories.map((category, index) => (
														<span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded-full dark:bg-gray-800">
															{category}
														</span>
													))}
												</div>
											</div>
										)}
									</div>
									<h1 itemProp="headline" className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
										{postDetails.title}
									</h1>
									{postDetails.excerpt && <div className="text-xl text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: postDetails.excerpt }} />}
								</div>
								<div className="prose prose-lg prose-blue max-w-none dark:prose-invert" itemProp="articleBody" dangerouslySetInnerHTML={{ __html: postDetails.content }} />
								<meta itemProp="datePublished" content={formattedDate} />
								<meta itemProp="dateModified" content={formatDateSafely(postDetails.updated_at)} />
								<meta itemProp="author" content={postDetails.author?.[0]?.username || "Wade's Plumbing & Septic"} />
							</article>
							<aside className="w-full mt-8 lg:w-1/3 lg:mt-0 lg:pl-8">
								<div className="sticky top-4">
									<Suspense fallback={<LoadingPulse className="h-96" />}>
										<Sidebar pathname="/expert-tips" data={sidebarContent} />
									</Suspense>
								</div>
							</aside>
						</div>
					</div>
				</div>
				<Suspense fallback={<LoadingPulse className="h-96" />}>
					<RelatedArticlesSection pathname="/expert-tips" data={relatedArticles} />
				</Suspense>
				<NewsletterSection />
			</>
		);
	} catch (error) {
		console.error("Error in BlogContent:", error);
		return (
			<div className="py-12 text-center">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Unable to load blog content</h2>
				<p className="mt-2 text-gray-600 dark:text-gray-400">Please try refreshing the page</p>
			</div>
		);
	}
}

export default async function BlogPage(props: { params: Promise<{ slug: string[] }> }) {
	try {
		const params = await props.params;
		const slug = await Promise.resolve(params.slug);
		const joinedSlug = Array.isArray(slug) ? slug.join("/") : slug;

		const [tipDetails, relatedArticles, sidebarContent] = await Promise.all([getTipData(joinedSlug), getRelatedArticlesData("/expert-tips"), getSidebarContentData("/expert-tips")]);

		if (!tipDetails?.tip) {
			notFound();
		}

		return (
			<section>
				<Suspense fallback={<ProgressiveLoading />}>
					<BlogContent postDetails={tipDetails.tip} sidebarContent={sidebarContent} relatedArticles={relatedArticles} />
				</Suspense>
			</section>
		);
	} catch (error) {
		console.error("Error in BlogPage:", error);
		return (
			<div className="py-12 text-center">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Unable to load blog</h2>
				<p className="mt-2 text-gray-600 dark:text-gray-400">Please try refreshing the page</p>
			</div>
		);
	}
}
