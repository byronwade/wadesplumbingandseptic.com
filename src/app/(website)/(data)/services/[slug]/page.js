import ContactForm from "@/components/forms/ContactForm";
import NewsletterSection from "@/components/sections/NewsletterSection";
import RelatedArticlesSection from "@/components/sections/RelatedArticlesSection";
import Sidebar from "@/components/sections/Sidebar";
import SocialBar from "@/components/sections/SocialBar";
import Image from "next/image";
import fetchData from "../getServices";
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

		const formattedTitle = postDetails?.title?.length > 50 ? `${postDetails.title.substring(0, 47)}... | Wade's Plumbing & Septic` : `${postDetails.title} | Wade's Plumbing & Septic`;

		const formattedDescription = postDetails?.excerpt?.length > 160 ? `${postDetails.excerpt.substring(0, 157)}...` : postDetails.excerpt;

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
		const { allServices, postDetails, relatedServices, jsonLd } = await fetchData({ slug });

		const dateObj = new Date(postDetails?.created_at);
		const formattedDate = dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
		const formattedTime = dateObj.toLocaleTimeString([], { hour: "numeric", minute: "numeric", hour12: true });

		return (
			<section>
				<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
				<div className="bg-white dark:bg-gray-900">
					<div className="px-6 py-16 sm:py-24 lg:px-8">
						<div className="flex justify-between max-w-screen-xl px-4 mx-auto">
							<article className="w-full max-w-2xl mx-auto space-y-4 format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
								<div className="relative w-full">
									<Image sizes={postDetails?.featuredImage?.sizes} priority className="w-full mb-6 rounded" width={1000} height={1000} src={postDetails?.featuredImage?.sourceurl || "/placeholder.webp"} alt={postDetails?.featuredImage?.alttext || "placeholder text"} />
									<div className="w-full py-6 mx-auto space-y-1">
										<span className="block text-gray-800">
											Published in{" "}
											<span className="font-semibold text-black">
												{postDetails?.categories?.map((category, index) => (
													<span key={index}>
														{category}
														{index !== postDetails.categories.length - 1 ? ", " : ""}
													</span>
												))}
											</span>
										</span>
										<h1 dangerouslySetInnerHTML={{ __html: postDetails?.title || "" }} className="max-w-4xl text-2xl font-extrabold leading-none text-black sm:text-3xl lg:text-4xl" />
									</div>
								</div>
								<div className="flex flex-col justify-between lg:flex-row lg:items-center">
									<div className="flex items-center mb-2 space-x-3 text-base text-gray-800 dark:text-gray-400 lg:mb-0">
										{postDetails?.author && (
											<>
												<span>
													By <span className="font-semibold text-black no-underline dark:text-white">{postDetails?.author?.username || ""}</span>
												</span>
												<span className="w-2 h-2 bg-gray-300 rounded-full dark:bg-gray-400" />
											</>
										)}
										<span>
											<time className="font-normal text-gray-800 dark:text-gray-400" dateTime={postDetails?.created_at || ""} title={`${formattedDate} at ${formattedTime}`}>
												{formattedDate} at {formattedTime}
											</time>
										</span>
									</div>
									<SocialBar />
								</div>
								<div className="prose">
									<div dangerouslySetInnerHTML={{ __html: postDetails?.content || "" }} />
								</div>
								<div className="!mt-16">
									<h1 className="mb-4 font-extrabold text-black sm:text-3xl lg:text-4xl">Get a free quote</h1>
									<ContactForm />
								</div>
							</article>
							{allServices?.length > 0 && <Sidebar pathname="/services" data={allServices} />}
						</div>
					</div>
				</div>
				<RelatedArticlesSection pathname="/services" data={relatedServices} />
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
