import { notFound } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

const ContactForm = dynamic(() => import("@/components/forms/ContactForm"), {
	loading: () => <p>Loading...</p>,
});
import NewsletterSection from "@/components/sections/NewsletterSection";
import RelatedArticlesSection from "@/components/sections/RelatedArticlesSection";
import Sidebar from "@/components/sections/Sidebar";
import SocialBar from "@/components/sections/SocialBar";
import { getServiceDetails, getRelatedServices } from "../getServices";

export default async function ServicePage({ params }) {
	const slug = (await params).slug;
	const postDetails = await getServiceDetails(slug);
	const relatedServices = await getRelatedServices(slug);

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
		"@type": "Service",
		name: postDetails.title,
		serviceType: postDetails.categories.join(", "),
		provider: {
			"@type": "Organization",
			name: "Wade's Plumbing & Septic",
			telephone: "+1-831-225-4344",
			url: "https://www.wadesplumbingandseptic.com",
			address: {
				"@type": "PostalAddress",
				streetAddress: "7737 hwy 9",
				addressLocality: "Ben Lomond",
				addressRegion: "CA",
				postalCode: "95005",
				addressCountry: "US",
			},
		},
		image: postDetails.featuredImage?.sourceurl || "https://www.wadesplumbingandseptic.com/placeholder.webp",
		areaServed: ["Santa Cruz County", "Monterey County", "Santa Clara County"],
		description: postDetails.excerpt,
		url: `https://www.wadesplumbingandseptic.com/services/${postDetails.slug}`,
	};

	return (
		<section>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-white dark:bg-gray-900">
				<div className="px-6 py-16 sm:py-24 lg:px-8">
					<div className="flex justify-between max-w-screen-xl px-4 mx-auto">
						<article className="w-full max-w-2xl mx-auto space-y-4 format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
							<div className="relative w-full">
								<Image sizes={postDetails.featuredImage?.sizes} priority className="w-full mb-6 rounded" width={1000} height={1000} src={postDetails.featuredImage?.sourceurl || "/placeholder.webp"} alt={postDetails.featuredImage?.alttext || "placeholder text"} />
								<div className="w-full py-6 mx-auto space-y-1">
									<span className="block text-gray-800">
										Published in{" "}
										<span className="font-semibold text-black">
											{postDetails.categories?.map((category, index) => (
												<span key={index}>
													{category}
													{index !== postDetails.categories.length - 1 ? ", " : ""}
												</span>
											))}
										</span>
									</span>
									<h1 dangerouslySetInnerHTML={{ __html: postDetails.title || "" }} className="max-w-4xl text-2xl font-extrabold leading-none text-black sm:text-3xl lg:text-4xl" />
								</div>
							</div>
							<div className="flex flex-col justify-between lg:flex-row lg:items-center">
								<div className="flex items-center mb-2 space-x-3 text-base text-gray-800 dark:text-gray-400 lg:mb-0">
									{postDetails.author && (
										<>
											<span>
												By <span className="font-semibold text-black no-underline dark:text-white">{postDetails.author.username || ""}</span>
											</span>
											<span className="w-2 h-2 bg-gray-300 rounded-full dark:bg-gray-400" />
										</>
									)}
									<span>
										<time className="font-normal text-gray-800 dark:text-gray-400" dateTime={postDetails.created_at || ""} title={`${formattedDate} at ${formattedTime}`}>
											{formattedDate} at {formattedTime}
										</time>
									</span>
								</div>
								<SocialBar />
							</div>
							<div className="prose">
								<div dangerouslySetInnerHTML={{ __html: postDetails.content || "" }} />
							</div>
							<div className="!mt-16">
								<h2 className="mb-4 font-extrabold text-black sm:text-3xl lg:text-4xl">Get a free quote</h2>
								<ContactForm />
							</div>
						</article>
						<Sidebar pathname="/services" data={relatedServices} />
					</div>
				</div>
			</div>
			<RelatedArticlesSection pathname="/services" data={relatedServices} />
			<NewsletterSection />
		</section>
	);
}

export async function generateMetadata({ params }) {
	const slug = (await params).slug;
	const postDetails = await getServiceDetails(slug);

	if (!postDetails) {
		return {
			title: "Wade's Plumbing & Septic",
			description: "Reliable plumbing and septic services.",
		};
	}

	const formattedTitle = postDetails.title ? `${postDetails.title} | Wade's Plumbing & Septic` : "Services | Wade's Plumbing & Septic";
	const formattedDescription = postDetails.excerpt?.length > 160 ? `${postDetails.excerpt.substring(0, 157)}...` : postDetails.excerpt;

	return {
		title: formattedTitle,
		description: formattedDescription,
		keywords: postDetails?.categories.join(", "),
		authors: [{ name: postDetails?.author?.username || "Byron Wade", url: "https://www.wadesplumbingandseptic.com/" }],
		creator: postDetails?.author?.username || "Byron Wade",
		publisher: "Byron Wade",
		alternates: {
			canonical: `https://www.wadesplumbingandseptic.com/services/${postDetails?.slug}`,
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
			],
			locale: "en-US",
			type: "website",
		},
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
	};
}

export const revalidate = 3600; // Revalidate every hour
