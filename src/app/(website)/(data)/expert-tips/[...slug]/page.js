import ContactForm from "@/components/forms/ContactForm";
import Image from "next/image";
import NewsletterSection from "@/components/sections/NewsletterSection";
import RelatedArticlesSection from "@/components/sections/RelatedArticlesSection";
import Sidebar from "@/components/sections/Sidebar";
import SocialBar from "@/components/sections/SocialBar";
import fetchData from "../getTips";
import Head from "next/head";
import Script from "next/script";

export async function generateMetadata({ params }, parent) {
	const slug = params.slug;
	const { postDetails } = await fetchData({ slug });
	const previousImages = (await parent).openGraph?.images || [];

	const formattedTitle = postDetails?.title ? `${postDetails.title} | Wade's Plumbing & Septic` : "Expert Tips | Wade's Plumbing & Septic";

	const formattedDescription = postDetails?.excerpt ? postDetails.excerpt : "Looking for expert plumbing tips in the local area? Look no further than Wade's Plumbing & Septic. Our blog has everything you need to know to keep your plumbing running smoothly.";

	return {
		title: formattedTitle,
		description: formattedDescription,
		generator: "Next.js",
		applicationName: "Wade's Plumbing & Septic",
		keywords: postDetails?.categories.join(", ") || "Next.js, React, JavaScript",
		authors: [{ name: postDetails?.author?.username || "Byron Wade", url: "https://www.wadesplumbingandseptic.com/expert-tips/" }],
		creator: postDetails?.author?.username || "Byron Wade",
		publisher: "Byron Wade",
		alternates: {},
		formatDetection: {
			email: false,
			address: false,
			telephone: false,
		},
		category: "construction",
		bookmarks: [`https://www.wadesplumbingandseptic.com/expert-tips/${postDetails?.slug}`],
		twitter: {
			card: "summary_large_image",
			title: formattedTitle,
			description: formattedDescription,
			creator: "@wadesplumbing",
			images: {
				url: postDetails?.featuredImage?.sourceurl || "https://www.wadesplumbingandseptic.com/api/og?title=Expert Tips&link=www.wadesplumbingandseptic.com&description=Looking for expert plumbing tips in the local area? Look no further than Wade's Plumbing & Septic. Our blog has everything you need to know to keep your plumbing running smoothly.",
				alt: postDetails?.featuredImage?.alttext || "Wade's Plumbing & Septic Social Logo",
			},
		},
		openGraph: {
			title: formattedTitle,
			description: formattedDescription,
			url: `https://www.wadesplumbingandseptic.com/expert-tips/${postDetails?.slug}`,
			siteName: "Wade's Plumbing & Septic",
			images: [
				{
					url: postDetails?.featuredImage?.sourceurl || "https://www.wadesplumbingandseptic.com/api/og?title=Expert Tips&link=www.wadesplumbingandseptic.com&description=Looking for expert plumbing tips in the local area? Look no further than Wade's Plumbing & Septic. Our blog has everything you need to know to keep your plumbing running smoothly.",
					width: 800,
					height: 600,
					alt: postDetails?.featuredImage?.alttext || "Wade's Plumbing & Septic",
				},
				...previousImages,
			],
			locale: "en-US",
			type: "website",
		},
	};
}

export default async function BlogPage({ params }) {
	const slug = params.slug;
	const { allPosts, postDetails, relatedPosts, jsonLd } = await fetchData({ slug });

	const dateObj = postDetails ? new Date(postDetails.created_at) : new Date();
	const formattedDate = dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
	const formattedTime = dateObj.toLocaleTimeString([], { hour: "numeric", minute: "numeric", hour12: true });

	return (
		<>
			<Head>
				<Script strategy="beforeInteractive" id="my-ldjson-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			</Head>
			<section className="bg-white dark:bg-gray-900">
				<div className="relative">
					<header className="w-full h-[460px] xl:h-[537px] relative">
						<Image sizes={postDetails?.featuredimage?.sizes} priority className="w-full object-cover object-center" fill src={postDetails?.featuredImage?.sourceurl ? postDetails.featuredImage.sourceurl : "/placeholder.webp"} alt={postDetails?.featuredImage?.alttext ? postDetails.featuredImage.alttext : "placeholder image"} />
						<div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50" />
						<div className="absolute top-20 left-1/2 px-4 mx-auto w-full max-w-screen-xl -translate-x-1/2 xl:top-1/2 xl:-translate-y-1/2 xl:px-0">
							<span className="block mb-4 text-gray-300">
								Published in{" "}
								<span className="font-semibold text-white">
									{postDetails?.categories?.map((categories, index) => (
										<span key={index}>
											{categories}
											{index !== postDetails?.categories?.length - 1 && ", "}
										</span>
									))}
								</span>
							</span>
							<h1 className="mb-4 max-w-4xl text-2xl font-extrabold leading-none text-white sm:text-3xl lg:text-4xl">{postDetails?.title}</h1>
						</div>
					</header>
					<div className="flex relative z-20 justify-between p-6 -m-36 mx-4 max-w-screen-xl bg-white dark:bg-gray-800 rounded xl:-m-32 xl:p-9 xl:mx-auto">
						<article className="xl:w-[828px] w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
							<div className="flex flex-col lg:flex-row justify-between lg:items-center">
								<div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 text-base mb-2 lg:mb-0">
									{postDetails?.author ? (
										<>
											<span>
												By <span className="text-gray-900 dark:text-white no-underline font-semibold">{postDetails?.author?.username}</span>
											</span>
											<span className="bg-gray-300 dark:bg-gray-400 w-2 h-2 rounded-full" />
										</>
									) : null}
									<span>
										<time className="font-normal text-gray-500 dark:text-gray-400" dateTime={postDetails?.date} title={`${formattedDate} at ${formattedTime}`}>
											{formattedDate} at {formattedTime}
										</time>
									</span>
								</div>
								<SocialBar />
							</div>
							<div className="prose lg:prose-xl">
								<div dangerouslySetInnerHTML={{ __html: postDetails?.content }} />
							</div>
							<div className="!mt-16">
								<h1 className="font-extrabold text-black sm:text-3xl lg:text-4xl mb-4">Get a free quote</h1>
								<ContactForm />
							</div>
						</article>
						{allPosts.length > 0 && <Sidebar pathname="/expert-tips" data={allPosts} />}
					</div>
				</div>
			</section>
			<RelatedArticlesSection pathname="/expert-tips" data={relatedPosts} />
			<NewsletterSection />
		</>
	);
}