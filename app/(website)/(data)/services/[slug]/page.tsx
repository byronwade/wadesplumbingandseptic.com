import { notFound } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { cache } from "react";

export const runtime = "edge";

const ContactForm = dynamic(() => import("@/components/forms/ContactForm"), {
	loading: () => <p>Loading...</p>,
});
const NewsletterSection = dynamic(() => import("@/components/sections/NewsletterSection"));
const RelatedArticlesSection = dynamic(() => import("@/components/sections/RelatedArticlesSection"));
const Sidebar = dynamic(() => import("@/components/sections/Sidebar"));
const SocialBar = dynamic(() => import("@/components/sections/SocialBar"));

import { getServiceDetails, getRelatedServices } from "@/actions/getServices";

const cachedGetServiceDetails = cache(getServiceDetails);
const cachedGetRelatedServices = cache(getRelatedServices);

function formatDate(dateString) {
	const dateObj = new Date(dateString);
	return {
		date: dateObj.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		}),
		time: dateObj.toLocaleTimeString([], {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		}),
	};
}

function generateJsonLd(postDetails) {
	return {
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
}

export async function generateStaticParams() {
	// Implement this to generate static params for all services
	// Example:
	// const allSlugs = await getAllServiceSlugs();
	// return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
	const { service } = await getServiceDetails(params.slug);
	// Generate metadata based on service details
}

export default async function ServicePage({ params }) {
	const { service } = await getServiceDetails(params.slug);
	const { relatedServices } = await getRelatedServices(params.slug);

	if (!service) {
		notFound();
	}

	const { date: formattedDate, time: formattedTime } = formatDate(service.created_at);
	const jsonLd = generateJsonLd(service);

	return (
		<section>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-white dark:bg-gray-900">
				<div className="container relative z-20 px-4 py-16 mx-auto sm:px-6 lg:px-8">
					<div className="flex flex-col lg:flex-row">
						<div className="w-full lg:w-2/3">
							<article className="w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
								<div className="relative w-full">
									<Image sizes={service.featuredImage?.sizes} priority className="w-full mb-6 rounded" width={1000} height={1000} src={service.featuredImage?.sourceurl || "/placeholder.webp"} alt={service.featuredImage?.alttext || "placeholder text"} />
									<div className="w-full py-6 mx-auto space-y-1">
										<span className="block text-gray-800">
											Published in{" "}
											<span className="font-semibold text-black">
												{service.categories?.map((category, index) => (
													<span key={index}>
														{category}
														{index !== service.categories.length - 1 ? ", " : ""}
													</span>
												))}
											</span>
										</span>
										<h1 dangerouslySetInnerHTML={{ __html: service.title || "" }} className="max-w-4xl text-2xl font-extrabold leading-none text-black sm:text-3xl lg:text-4xl" />
									</div>
								</div>
								<div className="flex flex-col justify-between lg:flex-row lg:items-center">
									<div className="flex items-center mb-2 space-x-3 text-base text-gray-800 dark:text-gray-400 lg:mb-0">
										{service.author && (
											<>
												<span>
													By <span className="font-semibold text-black no-underline dark:text-white">{service.author.username || ""}</span>
												</span>
												<span className="w-2 h-2 bg-gray-300 rounded-full dark:bg-gray-400" />
											</>
										)}
										<span>
											<time className="font-normal text-gray-800 dark:text-gray-400" dateTime={service.created_at || ""} title={`${formattedDate} at ${formattedTime}`}>
												{formattedDate} at {formattedTime}
											</time>
										</span>
									</div>
									<SocialBar />
								</div>
								<div className="prose">
									<div dangerouslySetInnerHTML={{ __html: service.content || "" }} />
								</div>
								<div className="!mt-16">
									<h2 className="mb-4 font-extrabold text-black sm:text-3xl lg:text-4xl">Get a free quote</h2>
									<ContactForm />
								</div>
							</article>
						</div>
						<div className="w-full mt-8 lg:w-1/3 lg:pl-8">
							<Sidebar pathname="/services" />
						</div>
					</div>
				</div>
			</div>
			<RelatedArticlesSection pathname="/services" />
			<NewsletterSection />
		</section>
	);
}
