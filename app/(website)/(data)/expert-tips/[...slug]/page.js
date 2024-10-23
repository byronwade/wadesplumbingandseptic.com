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
import { getTipDetails } from "../getTips";

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
		authors: [{ name: tipDetails.author?.username || "Byron Wade", url: "https://www.wadesplumbingandseptic.com/expert-tips/" }],
		creator: tipDetails.author?.username || "Byron Wade",
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
					url: tipDetails.featuredImage?.sourceurl || "https://www.wadesplumbingandseptic.com/api/og",
					width: 800,
					height: 600,
					alt: tipDetails.featuredImage?.alttext || "Wade's Plumbing & Septic",
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
					url: tipDetails.featuredImage?.sourceurl || "https://www.wadesplumbingandseptic.com/api/og",
					alt: tipDetails.featuredImage?.alttext || "Wade's Plumbing & Septic Social Logo",
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
		image: postDetails.featuredImage?.sourceurl || "https://www.wadesplumbingandseptic.com/placeholder.webp",
		datePublished: postDetails.created_at,
		dateModified: postDetails.created_at,
		author: {
			"@type": "Person",
			name: postDetails.author?.username || "Byron Wade",
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
					<section className="w-full h-[460px] xl:h-[537px] relative">
						<Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority className="object-cover object-center w-full" fill src={postDetails.featuredImage?.sourceurl || "/placeholder.webp"} alt={postDetails.featuredImage?.alttext || "placeholder image"} />
						<div className="absolute top-0 left-0 w-full h-full bg-black/80" />
						<div className="absolute w-full max-w-screen-xl px-4 mx-auto -translate-x-1/2 top-20 left-1/2 xl:top-1/2 xl:-translate-y-1/2 xl:px-0">
							<span className="block mb-4 text-gray-500">
								Published in{" "}
								<span className="font-semibold text-white">
									{postDetails.categories?.map((category, index) => (
										<span key={index}>
											{category}
											{index !== postDetails.categories.length - 1 && ", "}
										</span>
									))}
								</span>
							</span>
							<h1 className="max-w-4xl mb-4 text-2xl font-extrabold leading-none text-white sm:text-3xl lg:text-4xl">{postDetails.title}</h1>
						</div>
					</section>
					<section className="relative z-20 flex justify-between max-w-screen-xl p-6 mx-4 bg-white rounded -m-36 dark:bg-gray-800 xl:-m-32 xl:p-9 xl:mx-auto">
						<article className="xl:w-[828px] w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
							<div className="flex flex-col justify-between lg:flex-row lg:items-center">
								<div className="flex items-center mb-2 space-x-3 text-base text-gray-800 dark:text-gray-400 lg:mb-0">
									{postDetails.author && (
										<>
											<span>
												By <span className="font-semibold text-black no-underline dark:text-white">{postDetails.author.username}</span>
											</span>
											<span className="w-2 h-2 bg-gray-300 rounded-full dark:bg-gray-400" />
										</>
									)}
									<span>
										<time className="font-normal text-gray-800 dark:text-gray-400" dateTime={postDetails.created_at} title={`${formattedDate} at ${formattedTime}`}>
											{formattedDate} at {formattedTime}
										</time>
									</span>
								</div>
								<SocialBar />
							</div>
							<div className="prose lg:prose-xl">
								<div dangerouslySetInnerHTML={{ __html: postDetails.content }} />
							</div>
							<div className="!mt-16">
								<h2 className="mb-4 font-extrabold text-black sm:text-3xl lg:text-4xl">Get a free quote</h2>
								<ContactForm />
							</div>
						</article>
						<Sidebar pathname="/expert-tips" />
					</section>
				</div>
			</div>
			<RelatedArticlesSection pathname="/expert-tips" />
			<NewsletterSection />
		</section>
	);
}

export const revalidate = 3600; // Revalidate every hour
