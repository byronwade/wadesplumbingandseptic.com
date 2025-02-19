import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cache } from "react";
import Script from "next/script";
import type { Metadata } from "next/types";
import { getTipDetails } from "@/actions/getTips";
import { getRelatedArticles } from "../../../../../actions/getRelatedArticles";
import { getSidebarContent } from "../../../../../actions/getSidebarContent";
import { Sidebar } from "@/components/sections/Sidebar";
import { RelatedArticlesSection } from "@/components/sections/RelatedArticlesSection";
import NewsletterSection from "@/components/sections/NewsletterSection";

// Types
interface TipDetails {
	title: string;
	content: string;
	excerpt: string;
	description: string;
	date: string;
	modified: string;
	created_at: string;
	updated_at: string;
	author?: Array<{ username: string }>;
	featuredImage?: Array<{ sourceurl: string; alttext: string }>;
}

// Cached data fetching
const getTipDetailsWithCache = cache(async (slug: string) => {
	return getTipDetails(slug);
});

const getRelatedArticlesWithCache = cache(async (pathname: string) => {
	return getRelatedArticles(pathname);
});

const getSidebarContentWithCache = cache(async (pathname: string) => {
	return getSidebarContent(pathname);
});

// Format date on the server to avoid hydration mismatch
function formatDateSafely(dateStr: string | undefined): string {
	if (!dateStr) {
		return '2023-01-01T00:00:00.000Z';
	}
	try {
		const timestamp = Date.parse(dateStr);
		if (isNaN(timestamp)) {
			return '2023-01-01T00:00:00.000Z';
		}
		return new Date(timestamp).toISOString();
	} catch (e) {
		return '2023-01-01T00:00:00.000Z';
	}
}

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
	const params = await props.params;
	const slug = await Promise.resolve(params.slug);
	const joinedSlug = Array.isArray(slug) ? slug.join("/") : slug;
	const tipDetails = await getTipDetailsWithCache(joinedSlug);

	if (!tipDetails) return {};

	const ogImage = tipDetails.featuredImage?.[0]?.sourceurl || "https://www.wadesplumbingandseptic.com/placeholder.webp";
	const formattedDate = formatDateSafely(tipDetails.created_at);

	return {
		metadataBase: new URL("https://www.wadesplumbingandseptic.com"),
		title: {
			absolute: `${tipDetails.title} | Wade's Plumbing & Septic Expert Tips`,
		},
		description: tipDetails.description || tipDetails.excerpt,
		keywords: ["plumbing tips", "septic maintenance", "plumbing advice", "septic system care", ...(tipDetails.categories || [])],
		authors: [{ name: tipDetails.author?.[0]?.username || "Wade's Plumbing & Septic" }],
		openGraph: {
			title: tipDetails.title,
			description: tipDetails.description || tipDetails.excerpt,
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: tipDetails.title,
					type: "image/jpeg",
				},
			],
			type: "article",
			url: `https://www.wadesplumbingandseptic.com/expert-tips/${joinedSlug}`,
			publishedTime: formattedDate,
			modifiedTime: formatDateSafely(tipDetails.updated_at),
			authors: tipDetails.author ? [tipDetails.author[0]?.username] : ["Wade's Plumbing & Septic"],
			section: "Expert Tips",
			tags: tipDetails.categories || [],
			siteName: "Wade's Plumbing & Septic",
			locale: "en_US",
		},
		twitter: {
			card: "summary_large_image",
			title: tipDetails.title,
			description: tipDetails.description || tipDetails.excerpt,
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
	};
}

export default async function BlogPage(props: { params: Promise<{ slug: string[] }> }) {
	const params = await props.params;
	const slug = await Promise.resolve(params.slug);
	const joinedSlug = Array.isArray(slug) ? slug.join("/") : slug;
	const [{ tip: postDetails }, relatedArticles, sidebarContent] = await Promise.all([getTipDetailsWithCache(joinedSlug), getRelatedArticlesWithCache("/expert-tips"), getSidebarContentWithCache("/expert-tips")]);

	if (!postDetails) {
		notFound();
	}

	const formattedDate = formatDateSafely(postDetails.created_at);
	const modifiedDate = formatDateSafely(postDetails.updated_at);

	return (
		<>
			<Script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Article",
						"@id": `https://www.wadesplumbingandseptic.com/expert-tips/${joinedSlug}`,
						headline: postDetails.title,
						description: postDetails.description || postDetails.excerpt,
						image: {
							"@type": "ImageObject",
							url: postDetails?.featuredImage?.[0]?.sourceurl || "/placeholder.webp",
							height: 630,
							width: 1200,
						},
						datePublished: formattedDate,
						dateModified: modifiedDate,
						author: {
							"@type": "Person",
							name: postDetails.author?.[0]?.username || "Wade's Plumbing & Septic",
							url: "https://www.wadesplumbingandseptic.com/about",
						},
						publisher: {
							"@type": "Organization",
							name: "Wade's Plumbing & Septic",
							logo: {
								"@type": "ImageObject",
								url: "https://www.wadesplumbingandseptic.com/WadesLogo.webp",
								width: 600,
								height: 60,
							},
						},
						mainEntityOfPage: {
							"@type": "WebPage",
							"@id": `https://www.wadesplumbingandseptic.com/expert-tips/${joinedSlug}`,
						},
						articleBody: postDetails.content.replace(/<[^>]*>/g, ""),
						keywords: postDetails.categories?.join(", "),
						articleSection: "Expert Tips",
						inLanguage: "en-US",
					}),
				}}
			/>
			<div className="bg-white dark:bg-gray-900">
				<div className="container relative z-20 px-4 mx-auto sm:px-6 lg:px-8">
					<div className="flex flex-col lg:flex-row">
						<article className="w-full lg:w-2/3" itemScope itemType="https://schema.org/Article">
							{postDetails.featuredImage && (
								<div className="relative w-full h-[300px] sm:h-[400px] md:h-[460px] xl:h-[537px] mb-8">
									<Image src={postDetails.featuredImage[0]?.sourceurl || "/placeholder.webp"} alt={postDetails.featuredImage[0]?.alttext || postDetails.title} fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw" priority />
								</div>
							)}
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
							<meta itemProp="dateModified" content={modifiedDate} />
							<meta itemProp="author" content={postDetails.author?.[0]?.username || "Wade's Plumbing & Septic"} />
						</article>
						<aside className="w-full mt-8 lg:w-1/3 lg:mt-0 lg:pl-8">
							<div className="sticky top-4">
								<Sidebar pathname="/expert-tips" data={sidebarContent} />
							</div>
						</aside>
					</div>
				</div>
			</div>
			<RelatedArticlesSection pathname="/expert-tips" data={relatedArticles} />
			<NewsletterSection />
		</>
	);
}

