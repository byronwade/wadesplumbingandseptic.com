import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cache } from "react";
import Script from "next/script";
import { getTipDetails } from "@/actions/getTips";
import { getRelatedArticles } from "../../../../../actions/getRelatedArticles";
import { getSidebarContent } from "../../../../../actions/getSidebarContent";
import ClientComponents from "./components/ClientComponents";

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
function formatDate(date: string) {
	const dateObj = new Date(date);
	return {
		date: dateObj.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
			timeZone: "UTC",
		}),
		time: dateObj.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
			timeZone: "UTC",
		}),
	};
}

export async function generateMetadata({ params }: { params: { slug: string[] } }) {
	const slug = await Promise.resolve(params.slug);
	const joinedSlug = Array.isArray(slug) ? slug.join("/") : slug;
	const tipDetails = await getTipDetailsWithCache(joinedSlug);

	if (!tipDetails) return {};

	const ogImage = tipDetails.featuredImage?.[0]?.sourceurl || "https://www.wadesplumbingandseptic.com/placeholder.webp";

	return {
		title: tipDetails.title,
		description: tipDetails.description,
		openGraph: {
			title: tipDetails.title,
			description: tipDetails.description,
			images: [{ url: ogImage, width: 1200, height: 630, alt: tipDetails.title }],
			type: "article",
			url: `https://www.wadesplumbingandseptic.com/expert-tips/${joinedSlug}`,
			publishedTime: tipDetails.created_at,
			modifiedTime: tipDetails.updated_at,
			authors: tipDetails.author ? [tipDetails.author[0]?.username] : undefined,
			section: "Expert Tips",
		},
		twitter: {
			card: "summary_large_image",
			title: tipDetails.title,
			description: tipDetails.description,
			images: [ogImage],
			creator: "@wadesplumbing",
		},
		alternates: {
			canonical: `https://www.wadesplumbingandseptic.com/expert-tips/${joinedSlug}`,
		},
	};
}

export default async function BlogPage({ params }: { params: { slug: string[] } }) {
	const slug = await Promise.resolve(params.slug);
	const joinedSlug = Array.isArray(slug) ? slug.join("/") : slug;
	const [{ tip: postDetails }, relatedArticles, sidebarContent] = await Promise.all([getTipDetailsWithCache(joinedSlug), getRelatedArticlesWithCache("/expert-tips"), getSidebarContentWithCache("/expert-tips")]);

	if (!postDetails) {
		notFound();
	}

	return (
		<>
			<Script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Article",
						headline: postDetails.title,
						description: postDetails.excerpt,
						image: postDetails?.featuredImage?.[0]?.sourceurl || "/placeholder.webp",
						datePublished: postDetails.date,
						dateModified: postDetails.modified,
						author: {
							"@type": "Person",
							name: "Wade's Plumbing & Septic",
						},
					}),
				}}
			/>
			<article className="relative z-20 w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="mx-auto prose prose-lg prose-blue">
					<h1>{postDetails.title}</h1>
					<div dangerouslySetInnerHTML={{ __html: postDetails.content }} />
				</div>
			</article>
			<ClientComponents pathname="/expert-tips" sidebarContent={sidebarContent} relatedArticles={relatedArticles} />
		</>
	);
}

