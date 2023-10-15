import ContactForm from "@/components/forms/ContactForm";
import NewsletterSection from "@/components/sections/NewsletterSection";
import RelatedArticlesSection from "@/components/sections/RelatedArticlesSection";
import Sidebar from "@/components/sections/Sidebar";
import SocialBar from "@/components/sections/SocialBar";
import Image from "next/image";
import fetchData from "../getServices";

export async function generateMetadata({ params }, parent) {
	const slug = params.slug;
	const { postDetails } = await fetchData({ slug });
	const previousImages = (await parent).openGraph?.images || [];

	const formattedTitle = postDetails?.title && postDetails?.title.length > 50 ? `${postDetails?.title.substring(0, 47)}... | Wade's Plumbing & Septic` : `${postDetails?.title} | Wade's Plumbing & Septic`;

	const formattedDescription = postDetails?.excerpt && postDetails?.excerpt.length > 160 ? `${postDetails?.excerpt.substring(0, 157)}...` : postDetails?.excerpt;

	return {
		title: formattedTitle,
		description: formattedDescription,
		generator: "Next.js",
		applicationName: "Wade's Plumbing & Septic",
		keywords: postDetails?.categories.join(", "),
		authors: [{ name: postDetails?.author?.username || "Byron Wade", url: "https://www.wadesplumbingandseptic.com/" }],
		creator: postDetails?.author?.username || "Byron Wade",
		publisher: "Byron Wade",
		alternates: {},
		formatDetection: {
			email: false,
			address: false,
			telephone: false,
		},
		category: "construction",
		bookmarks: [`https://www.wadesplumbingandseptic.com/services/${postDetails?.slug}`],
		twitter: {
			card: "summary_large_image",
			title: formattedTitle,
			description: formattedDescription,
			creator: "@wadesplumbing",
			images: {
				url: postDetails?.featuredImage?.sourceurl || "https://www.wadesplumbingandseptic.com/placeholder.webp",
				alt: postDetails?.featuredImage?.alttext || "Service Image",
			},
		},
		openGraph: {
			title: formattedTitle,
			description: formattedDescription,
			url: `https://www.wadesplumbingandseptic.com/services/${postDetails?.slug}`,
			siteName: "Wade's Plumbing & Septic",
			images: [
				{
					url: postDetails?.featuredImage?.sourceurl || "https://www.wadesplumbingandseptic.com/placeholder.webp",
					width: 800,
					height: 600,
					alt: postDetails?.featuredImage?.alttext || "Service Image",
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
	const { allServices, postDetails, relatedServices, jsonLd } = await fetchData({ slug });

	const dateObj = new Date(postDetails.created_at);
	const formattedDate = dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
	const formattedTime = dateObj.toLocaleTimeString([], { hour: "numeric", minute: "numeric", hour12: true });

	return (
		<>
			<section className="bg-white dark:bg-gray-900">
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
				<div className="py-16 px-6 sm:py-24 lg:px-8">
					<div className="flex justify-between px-4 mx-auto max-w-screen-xl">
						<article className="space-y-4 mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
							<div className="w-full relative">
								<Image sizes={postDetails?.featuredImage?.sizes} priority className="w-full mb-6 rounded" width={1000} height={1000} src={postDetails?.featuredImage?.sourceurl || "/placeholder.webp"} alt={postDetails?.featuredImage?.alttext || "/placeholder.webp"} />
								<div className="space-y-1 py-6 mx-auto w-full">
									<span className="block text-gray-600">
										Published in{" "}
										<span className="font-semibold text-black">
											{postDetails?.categories?.map((categories, index) => (
												<span key={index}>
													{categories}
													{index !== postDetails?.categories?.length - 1 ? ", " : ""}
												</span>
											))}
										</span>
									</span>
									<h1
										dangerouslySetInnerHTML={{
											__html: postDetails?.title || "",
										}}
										className="max-w-4xl text-2xl font-extrabold leading-none text-black sm:text-3xl lg:text-4xl"
									/>
								</div>
							</div>
							<div className="flex flex-col lg:flex-row justify-between lg:items-center">
								<div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 text-base mb-2 lg:mb-0">
									{postDetails?.author ? (
										<>
											<span>
												By <span className="text-gray-900 dark:text-white no-underline font-semibold">{postDetails?.author?.username || ""}</span>
											</span>
											<span className="bg-gray-300 dark:bg-gray-400 w-2 h-2 rounded-full" />
										</>
									) : null}
									<span>
										<time className="font-normal text-gray-500 dark:text-gray-400" dateTime={postDetails?.created_at || ""} title={`${formattedDate} at ${formattedTime}`}>
											{formattedDate} at {formattedTime}
										</time>
									</span>
								</div>
								<SocialBar />
							</div>
							<div className="prose">
								<div
									dangerouslySetInnerHTML={{
										__html: postDetails?.content || "",
									}}
								/>
							</div>
							<div className="!mt-16">
								<h1 className="font-extrabold text-black sm:text-3xl lg:text-4xl mb-4">Get a free quote</h1>
								<ContactForm />
							</div>
						</article>
						{allServices.length > 0 && <Sidebar pathname="/services" data={allServices} />}
					</div>
				</div>
			</section>
			<RelatedArticlesSection pathname="/services" data={relatedServices} />
			<NewsletterSection />
		</>
	);
}