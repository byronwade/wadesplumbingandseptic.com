import ContactForm from "@/components/forms/ContactForm";
import NewsletterSection from "@/components/sections/NewsletterSection";
import RelatedArticlesSection from "@/components/sections/RelatedArticlesSection";
import Sidebar from "@/components/sections/Sidebar";
import SocialBar from "@/components/sections/SocialBar";
import Image from "next/image";

async function getData({ params }) {
	try {
		// Fetch all services
		const allservicesResponse = await fetch("http://localhost:3002/api/services"); // Use a relative URL
		if (!allservicesResponse.ok) {
			throw new Error("Failed to fetch all services");
		}
		const allservicesData = await allservicesResponse.json();

		// Fetch the specific service by slug
		const serviceBySlugResponse = await fetch(`http://localhost:3002/api/services?slug=${params.slug}`); // Use a relative URL
		if (!serviceBySlugResponse.ok) {
			throw new Error(`Failed to fetch service with slug: ${params.slug}`);
		}
		const serviceBySlugData = await serviceBySlugResponse.json();

		// Extract categories from the specific service
		const serviceCategories = serviceBySlugData.categories || [];

		// Filter and sort services based on matching categories
		const RelatedServices = filterAndSortservices(allservicesData, serviceCategories);

		return {
			allservicesData,
			serviceBySlugData,
			RelatedServices,
		};
	} catch (error) {
		console.error("Error fetching data:", error);
		return {
			allservicesData: [],
			serviceBySlugData: {},
			RelatedServices: [],
		};
	}
}

// Function to filter and sort services based on matching categories
function filterAndSortservices(services, serviceCategories) {
	if (!Array.isArray(services)) {
		return []; // Return an empty array if `services` is not an array
	}

	//console.log("All services:", services); // Debug: Check if allservicesData contains the correct data

	const matchingservices = services
		.filter((service) => {
			console.log("service:", service); // Debug: Check if each service contains the correct data

			if (service.categories && service.categories.length > 0) {
				// Check if any of the service's categories match the serviceCategories
				const matchingCategories = service.categories.some((category) => serviceCategories.includes(category));
				//console.log("Matching Categories:", matchingCategories); // Debug: Check if matchingCategories is true for any service
				return matchingCategories; // Include services with at least one matching category
			}
			return false; // Exclude services with no categories
		})
		.sort((a, b) => {
			const categoriesA = a.categories.filter((category) => serviceCategories.includes(category));
			const categoriesB = b.categories.filter((category) => serviceCategories.includes(category));
			return categoriesB.length - categoriesA.length;
		});

	//console.log("Matching services:", matchingservices); // Debug: Check the resulting matching services

	return matchingservices;
}

export default async function ServicesPage({ params }) {
	let NewestServices = [];
	let RelatedServices = [];
	const data = await getData({ params });
	console.log(params);

	const services = data?.serviceBySlugData.services[0];
	console.log(services);

	if (Array.isArray(data?.allservicesData?.services)) {
		NewestServices = data?.allservicesData?.services.slice().sort((a, b) => {
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);
			return dateB - dateA;
		});
	}

	// Define the desired category or categories to match for related services
	const desiredCategories = services?.categories || []; // Use the categories from the current service

	RelatedServices = filterAndSortservices(data?.allservicesData.services || [], desiredCategories);

	// Format data
	const dateObj = services?.created_at ? new Date(services.created_at) : null; // Convert the string to a Date object
	const formattedDate = dateObj
		? dateObj.toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
		  })
		: ""; // Format the date as "Month Day, Year"
	const formattedTime = dateObj
		? dateObj.toLocaleTimeString([], {
				hour: "numeric",
				minute: "numeric",
				hour12: true,
		  })
		: ""; // Format the time as "hh:mm AM/PM"

	return (
		<>
			<section className="bg-white dark:bg-gray-900">
				<div className="py-16 px-6 sm:py-24 lg:px-8">
					<div className="flex justify-between px-4 mx-auto max-w-screen-xl">
						<article className="space-y-4 mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
							<div className="w-full relative">
								<Image sizes={services?.featuredImage?.sizes} priority className="w-full mb-6 rounded" width={1000} height={1000} src={services?.featuredImage?.sourceurl || "/placeholder.webp"} alt={services?.featuredImage?.alttext || "/placeholder.webp"} />
								<div className="space-y-1 py-6 mx-auto w-full">
									<span className="block text-gray-600">
										Published in{" "}
										<span className="font-semibold text-black">
											{services?.categories?.map((categories, index) => (
												<span key={index}>
													{categories}
													{index !== services?.categories?.length - 1 ? ", " : ""}
												</span>
											))}
										</span>
									</span>
									<h1
										dangerouslySetInnerHTML={{
											__html: services?.title || "",
										}}
										className="max-w-4xl text-2xl font-extrabold leading-none text-black sm:text-3xl lg:text-4xl"
									/>
								</div>
							</div>
							<div className="flex flex-col lg:flex-row justify-between lg:items-center">
								<div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 text-base mb-2 lg:mb-0">
									{services?.author ? (
										<>
											<span>
												By <span className="text-gray-900 dark:text-white no-underline font-semibold">{services?.author?.username || ""}</span>
											</span>
											<span className="bg-gray-300 dark:bg-gray-400 w-2 h-2 rounded-full" />
										</>
									) : null}
									<span>
										<time className="font-normal text-gray-500 dark:text-gray-400" dateTime={services?.created_at || ""} title={`${formattedDate} at ${formattedTime}`}>
											{formattedDate} at {formattedTime}
										</time>
									</span>
								</div>
								<SocialBar />
							</div>
							<div className="prose">
								<div
									dangerouslySetInnerHTML={{
										__html: services?.content || "",
									}}
								/>
							</div>
							<div className="!mt-16">
								<h1 className="font-extrabold text-black sm:text-3xl lg:text-4xl mb-4">Get a free quote</h1>
								<ContactForm />
							</div>
						</article>
						{NewestServices.length > 0 && <Sidebar pathname="/services" NewestPosts={NewestServices} />}
					</div>
				</div>
			</section>
			<RelatedArticlesSection pathname="/services" posts={RelatedServices} />
			<NewsletterSection />
		</>
	);
}
