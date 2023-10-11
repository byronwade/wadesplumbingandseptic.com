"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagnation from "@/components/ui/Pagnation";
import Search from "@/components/ui/Search";
import { ArrowLongRightIcon } from "@heroicons/react/20/solid";

function Skeleton() {
	return <div className="w-full h-20 bg-gray-300 animate-pulse rounded"></div>;
}
export default function Services() {
	const itemsPerPage = 10;
	const [allServices, setAllServices] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredServices, setFilteredServices] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/services")
			.then((res) => res.json())
			.then((data) => {
				setAllServices(data.services);
				setFilteredServices(data.services); // Set initial value of filteredServices
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching Services:", error);
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		const results = searchTerm ? allServices.filter((service) => service.title.toLowerCase().includes(searchTerm.toLowerCase())) : allServices;
		setFilteredServices(results);
		setCurrentPage(1); // Reset to page 1 after search
	}, [searchTerm, allServices]);

	useEffect(() => {
		console.log("Component re-rendered");
	});

	const displayedServices = filteredServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	const handleSearchResults = (searchQuery) => {
		setSearchTerm(searchQuery);
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	return (
		<section className="bg-gray-50 relative overflow-hidden">
			<div className="py-16 px-6 sm:py-24 lg:px-8">
				<div className="mx-auto max-w-7xl">
					<div className="flex flex-col space-y-6 justify-center items-start">
						<div>
							<h2 className="text-lg font-semibold leading-8 tracking-tight text-brand-600">We have {String(displayedServices.length)} Services</h2>
							<p className="mb-4 text-4xl tracking-tight font-extrabold text-black dark:text-white">Search for any service</p>
							<p className="max-w-2xl text-lg leading-6 text-gray-600">
								Have a different question and can’t find the answer you’re looking for? Reach out to our support team by
								<Link href="/contact-us" className="font-semibold text-brand-600 hover:text-brand-500">
									{` `}sending us an email{` `}
								</Link>
								and we’ll get back to you as soon as we can.
							</p>
						</div>

						<Search placeholder="Search for a service..." onSearchResults={handleSearchResults} />

						<div className="flex mt-10 items-center justify-center w-full">
							<div className="container grid max-w-screen-xl gap-8 lg:grid-cols-2 lg:grid-rows-2">
								{loading ? (
									Array(10)
										.fill()
										.map((_, idx) => <Skeleton key={idx} />)
								) : allServices.length > 0 ? (
									allServices.map((service, index) => {
										console.log(service);
										if (index % 4 === 0) {
											return (
												<Link href={`/services/${service.slug}`} key={service.id} className="max-h-min relative group row-span-2 flex flex-col rounded border border-slate-200 bg-white">
													<div className="h-96 relative">
														<Image placeholder="blur" blurDataURL={service?.featuredImage?.sourceurl ? service.featuredImage.sourceurl : "/placeholder.webp"} fill sizes={service?.featuredImage?.sizes} src={service?.featuredImage?.sourceurl ? service.featuredImage.sourceurl : "/placeholder.webp"} className="w-full object-cover object-center rounded-t" alt={service?.featuredImage?.alttext ? service.featuredImage.alttext : "placeholder text"} />
													</div>
													<div className="p-10">
														<h3 className="text-xl font-medium text-gray-700">{service.title}</h3>
														<div className="mt-2 text-slate-500" dangerouslySetInnerHTML={{ __html: service.excerpt }} />
														<span className="group-hover:underline mt-2 inline-flex text-sky-500">
															Read in {service.readingtime} min <ArrowLongRightIcon className="inline-block self-center ml-3 w-4 h-4" />
														</span>
													</div>
												</Link>
											);
										} else {
											return (
												<Link href={`/services/${service.slug}`} key={service.id} className="group flex rounded border border-slate-200 bg-white">
													<div className="flex-1 p-10">
														<h3 className="text-xl font-medium text-gray-700">{service.title}</h3>
														<div className="mt-2 text-slate-500" dangerouslySetInnerHTML={{ __html: service.excerpt }} />
														<span className="group-hover:underline mt-2 inline-flex text-sky-500">
															Read in {service.readingtime} min <ArrowLongRightIcon className="inline-block self-center ml-3 w-4 h-4" />
														</span>
													</div>
													<div className="relative hidden h-full w-1/3 overflow-hidden lg:block">
														<div className="absolute inset-0">
															<Image placeholder="blur" blurDataURL={service?.featuredImage?.sourceurl ? service.featuredImage.sourceurl : "/placeholder.webp"} fill sizes={service?.featuredImage?.sizes} src={service?.featuredImage?.sourceurl ? service.featuredImage.sourceurl : "/placeholder.webp"} className="w-full object-cover object-center rounded-t" alt={service?.featuredImage?.alttext ? service.featuredImage.alttext : "placeholder text"} />
														</div>
													</div>
												</Link>
											);
										}
									})
								) : (
									<div className="col-span-full text-center py-10">No data</div>
								)}
							</div>
						</div>
						<Pagnation total={filteredServices.length} currentPage={currentPage} onPageChange={handlePageChange} />
					</div>
				</div>
			</div>
		</section>
	);
}
