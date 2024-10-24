import Image from "next/image";
import { notFound } from "next/navigation";

import dynamic from "next/dynamic";

const ContactForm = dynamic(() => import("@/components/forms/ContactForm"), {
	loading: () => <p>Loading...</p>,
});
import NewsletterSection from "@/components/sections/NewsletterSection";
import RelatedArticlesSection from "@/components/sections/RelatedArticlesSection";
import Sidebar from "@/components/sections/Sidebar";
import SocialBar from "@/components/sections/SocialBar";
import { getTipDetails } from "@/actions/getTips";

export async function generateMetadata({ params }, parent) {
	const slug = (await params).slug.join("/");
	const tipDetails = await getTipDetails(slug);

	if (!tipDetails) {
		return {
			title: "Expert Tips | Wade's Plumbing & Septic",
			description: "Looking for expert plumbing tips in the local area? Look no further than Wade's Plumbing & Septic. Our blog has everything you need to know to keep your plumbing running smoothly.",
		};
	}

	const previousImages = (await parent).openGraph?.images || [];

	const formattedTitle = tipDetails.title ? `${tipDetails.title} | Wade's Plumbing & Septic` : "Expert Tips | Wade's Plumbing & Septic";
	const formattedDescription = tipDetails.excerpt || "Looking for expert plumbing tips in the local area? Look no further than Wade's Plumbing & Septic. Our blog has everything you need to know to keep your plumbing running smoothly.";

	return {
		title: formattedTitle,
		description: formattedDescription,
		authors: [{ name: tipDetails.author?.[0]?.username || "Byron Wade", url: "https://www.wadesplumbingandseptic.com/expert-tips/" }],
		creator: tipDetails.author?.[0]?.username || "Byron Wade",
		publisher: "Byron Wade",
		alternates: {
			canonical: `https://www.wadesplumbingandseptic.com/expert-tips/${tipDetails.slug}`,
		},
		category: "construction",
		keywords: tipDetails.categories?.join(", ") || "plumbing, septic, tips",
		openGraph: {
			title: formattedTitle,
			description: formattedDescription,
			url: `https://www.wadesplumbingandseptic.com/expert-tips/${tipDetails.slug}`,
			siteName: "Wade's Plumbing & Septic",
			images: [
				{
					url: tipDetails.featuredImage?.[0]?.sourceurl || "https://www.wadesplumbingandseptic.com/api/og",
					width: 800,
					height: 600,
					alt: tipDetails.featuredImage?.[0]?.alttext || "Wade's Plumbing & Septic",
				},
				...previousImages,
			],
			locale: "en-US",
			type: "article",
		},
		twitter: {
			card: "summary_large_image",
			title: formattedTitle,
			description: formattedDescription,
			creator: "@wadesplumbing",
			images: [
				{
					url: tipDetails.featuredImage?.[0]?.sourceurl || "https://www.wadesplumbingandseptic.com/api/og",
					alt: tipDetails.featuredImage?.[0]?.alttext || "Wade's Plumbing & Septic Social Logo",
				},
			],
		},
	};
}

export default async function BlogPage({ params }) {
	const slug = (await params).slug.join("/");
	const postDetails = await getTipDetails(slug);

	if (!postDetails) {
		notFound();
	}

	const dateObj = new Date(postDetails.created_at);
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

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: postDetails.title,
		image: postDetails.featuredImage?.[0]?.sourceurl || "https://www.wadesplumbingandseptic.com/placeholder.webp",
		datePublished: postDetails.created_at,
		dateModified: postDetails.created_at,
		author: {
			"@type": "Person",
			name: postDetails.author?.[0]?.username || "Byron Wade",
		},
		publisher: {
			"@type": "Organization",
			name: "Wade's Plumbing & Septic",
			logo: {
				"@type": "ImageObject",
				url: "https://www.wadesplumbingandseptic.com/WadesLogo.webp",
			},
		},
	};

	return (
		<section>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-white dark:bg-gray-900">
				<div className="relative">
					<section className="w-full h-[300px] sm:h-[400px] md:h-[460px] xl:h-[537px] relative">
						<Image sizes="100vw" priority className="object-cover object-center w-full" fill src={postDetails.featuredImage?.[0]?.sourceurl || "/placeholder.webp"} alt={postDetails.featuredImage?.[0]?.alttext || "placeholder image"} />
					</section>
					<section className="container relative z-20 px-4 mx-auto sm:px-6 lg:px-8">
						<div className="flex flex-col lg:flex-row">
							<div className="w-full lg:w-2/3">
								<div className="p-6 sm:p-8 md:p-10">
									<article className="w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
										<span className="block mb-2 text-sm text-gray-500 sm:text-base">
											Published in{" "}
											<span className="font-semibold">
												{postDetails.categories?.map((category, index) => (
													<span key={index}>
														{category}
														{index !== postDetails.categories.length - 1 && ", "}
													</span>
												))}
											</span>
										</span>
										<h1 className="max-w-4xl mb-4 text-xl font-bold leading-tight sm:text-2xl md:text-3xl lg:text-5xl">{postDetails.title}</h1>
										<div className="flex flex-col justify-between space-y-4 sm:space-y-0 sm:flex-row sm:items-center">
											<div className="flex flex-col space-y-2 text-sm text-gray-800 sm:text-base dark:text-gray-400">
												{postDetails.author && (
													<span>
														By <span className="font-semibold text-black no-underline dark:text-white">{postDetails.author[0]?.username}</span>
													</span>
												)}
												<time className="font-normal text-gray-800 dark:text-gray-400" dateTime={postDetails.created_at} title={`${formattedDate} at ${formattedTime}`}>
													{formattedDate} at {formattedTime}
												</time>
											</div>
											<SocialBar />
										</div>
										<div className="mt-8 prose sm:prose-sm md:prose-base lg:prose-lg dark:prose-invert">
											<div dangerouslySetInnerHTML={{ __html: postDetails.content }} />
										</div>
										<div className="mt-12 sm:mt-16">
											<h2 className="mb-4 text-2xl font-bold text-black sm:text-3xl lg:text-4xl dark:text-white">Get a free quote</h2>
											<ContactForm />
										</div>
									</article>
								</div>
							</div>
							<div className="w-full mt-8 lg:w-1/3 lg:pl-8">
								<Sidebar pathname="/expert-tips" />
							</div>
						</div>
					</section>
				</div>
			</div>
			<RelatedArticlesSection pathname="/expert-tips" />
			<NewsletterSection />
		</section>
	);
}

export const revalidate = 3600; // Revalidate every hour
