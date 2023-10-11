import NewsletterSection from "@/components/sections/NewsletterSection";
import RelatedArticlesSection from "@/components/sections/RelatedArticlesSection";
import Sidebar from "@/components/sections/Sidebar";
import SocialBar from "@/components/sections/SocialBar";
import { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

async function getData({ params }) {
	// Fetch all posts
	const allPostsResponse = await fetch("http://localhost:3002/api/tips");
	if (!allPostsResponse.ok) {
		throw new Error("Failed to fetch all posts");
	}
	const allPostsData = await allPostsResponse.json();

	// Fetch the specific post by slug
	const postBySlugResponse = await fetch(`http://localhost:3002/api/tips?slug=${params.uri}`);
	if (!postBySlugResponse.ok) {
		throw new Error(`Failed to fetch post with slug: ${params.uri}`);
	}
	const postBySlugData = await postBySlugResponse.json();

	// Extract categories from the specific post
	const postCategories = postBySlugData.categories || [];

	// Filter and sort posts based on matching categories
	const RelatedPosts = filterAndSortPosts(allPostsData, postCategories);

	return {
		allPostsData,
		postBySlugData,
		RelatedPosts,
	};
}

// Function to filter and sort posts based on matching categories
function filterAndSortPosts(posts, postCategories) {
	if (!Array.isArray(posts)) {
		return []; // Return an empty array if `posts` is not an array
	}

	console.log("All Posts:", posts); // Debug: Check if allPostsData contains the correct data

	const matchingPosts = posts
		.filter((post) => {
			console.log("Post:", post); // Debug: Check if each post contains the correct data

			if (post.categories && post.categories.length > 0) {
				// Check if any of the post's categories match the postCategories
				const matchingCategories = post.categories.some((category) => postCategories.includes(category));
				console.log("Matching Categories:", matchingCategories); // Debug: Check if matchingCategories is true for any post
				return matchingCategories; // Include posts with at least one matching category
			}
			return false; // Exclude posts with no categories
		})
		.sort((a, b) => {
			const categoriesA = a.categories.filter((category) => postCategories.includes(category));
			const categoriesB = b.categories.filter((category) => postCategories.includes(category));
			return categoriesB.length - categoriesA.length;
		});

	console.log("Matching Posts:", matchingPosts); // Debug: Check the resulting matching posts

	return matchingPosts;
}

// export async function generateMetadata({ params }): Promise<Metadata> {
// 	const { data } = await getTip(`"/${params.uri.join("/")}"`);
// 	const seo = data?.post?.seo;
// 	console.log(seo);
// 	return {
// 		title: data?.post?.title || "This is a title to the service",
// 		description: seo?.metaDesc || seo?.opengraphDescription || "This is a Service from Wade's Plumbing & Septic",
// 		generator: "Next.js",
// 		applicationName: "Wade's Plumbing & Septic",
// 		referrer: "origin-when-cross-origin",
// 		keywords: seo?.metaKeywords,
// 		authors: [{ name: data?.post?.author?.node?.name }, { name: data?.post?.author?.node?.name, url: `https://www.wadesplumbingandseptic.com/expert-tips/${params.uri.join("/")}` }],
// 		creator: "Byron Wade",
// 		publisher: data?.post?.author?.node?.name,
// 		alternates: {},
// 		formatDetection: {
// 			email: false,
// 			address: false,
// 			telephone: false,
// 		},
// 		category: "construction",
// 		bookmarks: [`https://www.wadesplumbingandseptic.com/expert-tips/${params.uri.join("/")}`],
// 		twitter: {
// 			card: "summary_large_image",
// 			title: seo?.twitterTitle || seo?.title || data?.post?.title,
// 			description: seo?.twitterDescription || seo?.metaDesc || seo?.opengraphDescription,
// 			creator: "@wadesplumbing",
// 			images: [`https://www.wadesplumbingandseptic.com/api/og?title=${data?.post?.title}&discription=${seo?.metaDesc.slice(0, 200) || seo?.opengraphDescription.slice(0, 200) || "This is a Service from Wade's Plumbing & Septic"}`],
// 		},
// 		openGraph: {
// 			title: seo?.opengraphTitle || seo?.title,
// 			description: seo?.opengraphDescription || seo?.metaDesc,
// 			url: `https://www.wadesplumbingandseptic.com/expert-tips/${params.uri.join("/")}`,
// 			siteName: seo?.opengraphTitle || seo?.title,
// 			images: [
// 				{
// 					url: `https://www.wadesplumbingandseptic.com/api/og?title=${data?.post?.title}&discription=${seo?.metaDesc.slice(0, 200) || seo?.opengraphDescription.slice(0, 200) || "This is a Service from Wade's Plumbing & Septic"}}`,
// 					width: 800,
// 					height: 600,
// 				},
// 				{
// 					url: `https://www.wadesplumbingandseptic.com/api/og?title=${data?.post?.title}&discription=${seo?.metaDesc.slice(0, 200) || seo?.opengraphDescription.slice(0, 200) || "This is a Service from Wade's Plumbing & Septic"}}`,
// 					width: 1800,
// 					height: 1600,
// 					alt: "My custom alt",
// 				},
// 			],
// 			locale: "en-US",
// 			type: "website",
// 		},
// 	};
// }

export default async function BlogPage({ params }) {
	let NewestPosts = [];
	let RelatedPosts = [];
	const data = await getData({ params });
	console.log(data.RelatedPosts);

	const tips = data?.postBySlugData.posts[0];

	if (Array.isArray(data?.allPostsData?.posts)) {
		NewestPosts = data?.allPostsData?.posts.slice().sort((a, b) => {
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);
			return dateB - dateA;
		});
	}

	// Define the desired category or categories to match for related posts
	const desiredCategories = tips.categories; // Use the categories from the current post

	RelatedPosts = filterAndSortPosts(data.allPostsData.posts, desiredCategories);

	//format data
	const dateObj = new Date(tips?.date); // Convert the string to a Date object
	const formattedDate = dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }); // Format the date as "Month Day, Year"
	const formattedTime = dateObj.toLocaleTimeString([], { hour: "numeric", minute: "numeric", hour12: true }); // Format the time as "hh:mm AM/PM"

	return (
		<>
			<section className="bg-white dark:bg-gray-900">
				<div className="relative">
					<Suspense fallback={<p>Loading content...</p>}>
						<header className="w-full h-[460px] xl:h-[537px] relative">
							<Image sizes={tips?.featuredimage?.sizes} priority className="w-full object-cover object-center" fill src={tips?.featuredImage?.sourceurl ? tips.featuredImage.sourceurl : "/placeholder.webp"} alt={tips?.featuredImage?.alttext ? tips.featuredImage.alttext : "placeholder image"} />
							<div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50" />
							<div className="absolute top-20 left-1/2 px-4 mx-auto w-full max-w-screen-xl -translate-x-1/2 xl:top-1/2 xl:-translate-y-1/2 xl:px-0">
								<span className="block mb-4 text-gray-300">
									Published in{" "}
									<span className="font-semibold text-white">
										{tips?.categories?.map((categories, index) => (
											<span key={index}>
												{categories}
												{index !== tips?.categories?.length - 1 && ", "}
											</span>
										))}
									</span>
								</span>
								<h1 className="mb-4 max-w-4xl text-2xl font-extrabold leading-none text-white sm:text-3xl lg:text-4xl">{tips?.title}</h1>
							</div>
						</header>
						<div className="flex relative z-20 justify-between p-6 -m-36 mx-4 max-w-screen-xl bg-white dark:bg-gray-800 rounded xl:-m-32 xl:p-9 xl:mx-auto">
							<article className="xl:w-[828px] w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
								<div className="flex flex-col lg:flex-row justify-between lg:items-center">
									<div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 text-base mb-2 lg:mb-0">
										{tips?.author ? (
											<>
												<span>
													By <span className="text-gray-900 dark:text-white no-underline font-semibold">{tips?.author?.username}</span>
												</span>
												<span className="bg-gray-300 dark:bg-gray-400 w-2 h-2 rounded-full" />
											</>
										) : null}
										<span>
											<time className="font-normal text-gray-500 dark:text-gray-400" dateTime={tips?.date} title={`${formattedDate} at ${formattedTime}`}>
												{formattedDate} at {formattedTime}
											</time>
										</span>
									</div>
									<SocialBar />
								</div>
								<div className="prose lg:prose-xl">
									<div dangerouslySetInnerHTML={{ __html: tips?.content }} />
								</div>
							</article>
							{NewestPosts.length > 0 && <Sidebar pathname="/expert-tips" NewestPosts={NewestPosts} />}
						</div>
					</Suspense>
				</div>
			</section>
			<RelatedArticlesSection pathname="/expert-tips" posts={RelatedPosts} />
			<NewsletterSection />
		</>
	);
}
