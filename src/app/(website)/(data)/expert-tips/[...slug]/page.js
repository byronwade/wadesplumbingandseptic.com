import ContactForm from "@/components/forms/ContactForm";
import Image from "next/image";
import NewsletterSection from "@/components/sections/NewsletterSection";
import RelatedArticlesSection from "@/components/sections/RelatedArticlesSection";
import Sidebar from "@/components/sections/Sidebar";
import SocialBar from "@/components/sections/SocialBar";
import fetchData from "../getTips";
import Script from "next/script";

/**
 * Generate metadata for the page based on the fetched post details.
 * @param {Object} context - The context object containing parameters.
 * @param {Object} parent - The parent metadata.
 * @returns {Promise<Object>} The metadata object.
 */
export async function generateMetadata({ params }, parent) {
	try {
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
	} catch (error) {
		console.error("Error generating metadata:", error);
		return {
			title: "Wade's Plumbing & Septic",
			description: "Reliable plumbing and septic services.",
		};
	}
}

/**
 * The main blog page component.
 * @param {Object} context - The context object containing parameters.
 * @returns {JSX.Element} The page component.
 */
export default async function BlogPage({ params }) {
	try {
		const slug = params.slug;
		const { allPosts, postDetails, relatedPosts, jsonLd } = await fetchData({ slug });

		const dateObj = postDetails ? new Date(postDetails.created_at) : new Date();
		const formattedDate = dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
		const formattedTime = dateObj.toLocaleTimeString([], { hour: "numeric", minute: "numeric", hour12: true });

		return (
			<section>
				<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
				<div className="bg-white dark:bg-gray-900">
					<div className="relative">
						<section className="w-full h-[460px] xl:h-[537px] relative">
							<Image sizes={postDetails?.featuredImage?.sizes} priority className="object-cover object-center w-full" fill src={postDetails?.featuredImage?.sourceurl || "/placeholder.webp"} alt={postDetails?.featuredImage?.alttext || "placeholder image"} />
							<div className="absolute top-0 left-0 w-full h-full bg-black/80" />
							<div className="absolute w-full max-w-screen-xl px-4 mx-auto -translate-x-1/2 top-20 left-1/2 xl:top-1/2 xl:-translate-y-1/2 xl:px-0">
								<span className="block mb-4 text-gray-500">
									Published in{" "}
									<span className="font-semibold text-white">
										{postDetails?.categories?.map((category, index) => (
											<span key={index}>
												{category}
												{index !== postDetails.categories.length - 1 && ", "}
											</span>
										))}
									</span>
								</span>
								<h1 className="max-w-4xl mb-4 text-2xl font-extrabold leading-none text-white sm:text-3xl lg:text-4xl">{postDetails?.title}</h1>
							</div>
						</section>
						<section className="relative z-20 flex justify-between max-w-screen-xl p-6 mx-4 bg-white rounded -m-36 dark:bg-gray-800 xl:-m-32 xl:p-9 xl:mx-auto">
							<article className="xl:w-[828px] w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
								<div className="flex flex-col justify-between lg:flex-row lg:items-center">
									<div className="flex items-center mb-2 space-x-3 text-base text-gray-800 dark:text-gray-400 lg:mb-0">
										{postDetails?.author && (
											<>
												<span>
													By <span className="font-semibold text-black no-underline dark:text-white">{postDetails?.author?.username}</span>
												</span>
												<span className="w-2 h-2 bg-gray-300 rounded-full dark:bg-gray-400" />
											</>
										)}
										<span>
											<time className="font-normal text-gray-800 dark:text-gray-400" dateTime={postDetails?.date} title={`${formattedDate} at ${formattedTime}`}>
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
									<h1 className="mb-4 font-extrabold text-black sm:text-3xl lg:text-4xl">Get a free quote</h1>
									<ContactForm />
								</div>
							</article>
							{allPosts.length > 0 && <Sidebar pathname="/expert-tips" data={allPosts} />}
						</section>
					</div>
				</div>
				<RelatedArticlesSection pathname="/expert-tips" data={relatedPosts} />
				<NewsletterSection />
			</section>
		);
	} catch (error) {
		console.error("Error loading blog page:", error);
		return (
			<section>
				<div className="bg-white dark:bg-gray-900">
					<div className="px-6 py-16 sm:py-24 lg:px-8">
						<div className="max-w-screen-xl mx-auto text-center">
							<h1 className="text-3xl font-extrabold text-red-600">Error loading page</h1>
							<p className="mt-4 text-lg text-gray-600">Sorry, we encountered an error while loading the page. Please try again later.</p>
						</div>
					</div>
				</div>
			</section>
		);
	}
}
