"use client";

import Search from "@/components/ui/Search";
import Pagination from "@/components/ui/Pagnation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "react-feather";
import { Suspense } from "react";

// Loading Components
const LoadingPulse = ({ className }: { className: string }) => <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />;

const ITEMS_PER_PAGE = 6;

interface ServicesPageContentProps {
	services: any[];
	total: number;
	searchTerm: string;
	currentPage: number;
}

export default function ServicesPageContent({ services, total, searchTerm, currentPage }: ServicesPageContentProps) {
	const serviceMsg = searchTerm ? (services.length > 0 ? `We found ${services.length} services matching "${searchTerm}".` : `We couldn't find any services matching "${searchTerm}".`) : `We have ${services.length} services.`;

	return (
		<section>
			<div className="relative overflow-hidden bg-gray-50">
				<div className="px-6 py-16 sm:py-24 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<div className="flex flex-col items-start justify-center space-y-6">
							<h2 className="text-lg font-semibold leading-8 tracking-tight text-brand-500">{serviceMsg}</h2>
							<p className="!mt-0 mb-4 text-4xl tracking-tight font-extrabold text-black dark:text-white">Our Services</p>
							<p className="max-w-2xl text-lg leading-6 text-gray-700">
								Have a different question and can&apos;t find the answer you&apos;re looking for? Reach out to our support team by
								<Link href="/contact-us" className="font-semibold text-brand-700 hover:text-brand-500">
									{" "}
									sending us an email{" "}
								</Link>
								and we&apos;ll get back to you as soon as we can.
							</p>
							<Search placeholder="Search for a service..." />
							<div className="flex items-center justify-center w-full mt-10">
								<div className="container grid max-w-screen-xl gap-8 lg:grid-cols-2">
									<Suspense fallback={<LoadingPulse className="h-96" />}>
										{services && services.length > 0 ? (
											services.slice(0, ITEMS_PER_PAGE).map((service) => {
												if (!service) {
													console.error("Invalid service object");
													return null;
												}

												return (
													<Link href={`/services/${service.slug}`} key={service.id} className={`max-h-min relative group flex flex-col rounded border border-slate-200 bg-white`}>
														<div className="relative h-96">
															<Image
																placeholder="blur"
																blurDataURL="/placeholder.webp"
																fill
																sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
																src={service?.featuredImage?.[0]?.sourceurl || "/placeholder.webp"}
																className="object-cover object-center w-full rounded-t"
																alt={service?.featuredImage?.[0]?.alttext || service.title || "Service image"}
																onError={(e) => {
																	console.error("Image load error:", e);
																	const target = e.target as HTMLImageElement;
																	target.src = "/placeholder.webp";
																}}
															/>
														</div>
														<div className="p-10">
															<h3 className="text-xl font-medium text-gray-700">{service.title}</h3>
															{service.excerpt && <div className="mt-2 text-slate-500" dangerouslySetInnerHTML={{ __html: service.excerpt }} />}
															<span className="inline-flex mt-2 group-hover:underline text-sky-500">
																Read in {service.readingtime || "5"} min <ArrowRight className="self-center inline-block w-4 h-4 ml-3" />
															</span>
														</div>
													</Link>
												);
											})
										) : (
											<div className="py-10 text-center col-span-full">No services found. Please try a different search.</div>
										)}
									</Suspense>
								</div>
							</div>
							<Pagination total={total} itemsPerPage={ITEMS_PER_PAGE} />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
