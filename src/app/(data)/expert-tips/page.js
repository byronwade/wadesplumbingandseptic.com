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

export default function ExpertTips() {
	const itemsPerPage = 10;
	const [allTips, setAllTips] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredTips, setFilteredTips] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/tips")
			.then((res) => res.json())
			.then((data) => {
				setAllTips(data.posts);
				setFilteredTips(data.posts);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching tips:", error);
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		const results = searchTerm ? allTips.filter((tip) => tip.title.toLowerCase().includes(searchTerm.toLowerCase())) : allTips;
		setFilteredTips(results);
		setCurrentPage(1); // Reset to page 1 after search
	}, [searchTerm]);

	const displayedTips = filteredTips.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
							<h2 className="text-lg font-semibold leading-8 tracking-tight text-brand-600">We have {String(displayedTips.length)} Expert Tips</h2>
							<p className="mb-4 text-4xl tracking-tight font-extrabold text-black dark:text-white">Tips from experts</p>
							<p className="max-w-2xl text-lg leading-6 text-gray-600">
								Have a different question and can’t find the answer you’re looking for? Reach out to our support team by
								<Link href="/contact-us" className="font-semibold text-brand-600 hover:text-brand-500">
									{` `}sending us an email{` `}
								</Link>
								and we’ll get back to you as soon as we can.
							</p>
						</div>

						<Search placeholder="Search for a tip..." onSearchResults={handleSearchResults} />

						<div className="grid gird-col-1 md:grid-cols-2 lg:grid-col-3 xl:grid-cols-4 auto-rows-auto gap-6 mt-10 items-stretch w-full">
							{loading ? (
								Array(10)
									.fill()
									.map((_, idx) => <Skeleton key={idx} />)
							) : displayedTips.length > 0 ? (
								displayedTips.map((tip, index) => {
									if (index % 7 === 0) {
										return (
											<Link href={`/expert-tips/${tip.slug}`} key={index} className="max-h-90 w-full relative group col-spane-1 row-span-1 xl:col-span-2 xl:row-span-2">
												<div className="z-20">
													<p className="z-20 md:p-10 p-6 text-xs font-medium leading-3 text-white absolute top-0 right-0">12 April 2021</p>
													<div className="z-20 absolute bottom-0 left-0 md:p-10 p-6">
														<h2 className="text-xl font-semibold 5 text-white">{tip.title}</h2>
														<span className="group-hover:underline focus:outline-none focus:underline flex items-center mt-4 cursor-pointer text-white hover:text-gray-200 hover:underline">
															<p className="pr-2 text-sm font-medium leading-none">
																Read in {tip.readingtime} min <ArrowLongRightIcon className="inline-block self-center ml-3 w-4 h-4" />
															</p>
														</span>
													</div>
												</div>
												<Image placeholder="blur" blurDataURL={tip?.featuredImage?.sourceurl ? tip.featuredImage.sourceurl : "/placeholder.webp"} width={500} height={500} src={tip?.featuredImage?.sourceurl ? tip.featuredImage.sourceurl : "/placeholder.webp"} className="brightness-75 z-10 h-full w-full object-cover object-center rounded" alt={tip?.featuredImage?.alttext ? tip.featuredImage.alttext : "placeholder text"} />
											</Link>
										);
									} else {
										return (
											<Link href={`/expert-tips/${tip.slug}`} key={tip.id} className="max-h-45 w-full relative group row-span-1">
												<div className="z-20">
													<p className="z-20 p-6 text-xs font-medium leading-3 text-white absolute top-0 right-0">12 April 2021</p>
													<div className="z-20 absolute bottom-0 left-0 p-6">
														<h2 className="text-xl font-semibold 5 text-white">{tip.title}</h2>
														<span className="group-hover:underline focus:outline-none focus:underline flex items-center mt-4 cursor-pointer text-white hover:text-gray-200 hover:underline">
															<p className="pr-2 text-sm font-medium leading-none">
																Read in {tip.readingtime} min <ArrowLongRightIcon className="inline-block self-center ml-3 w-4 h-4" />
															</p>
														</span>
													</div>
												</div>
												<Image placeholder="blur" blurDataURL={tip?.featuredImage?.sourceurl ? tip.featuredImage.sourceurl : "/placeholder.webp"} width={500} height={500} src={tip?.featuredImage?.sourceurl ? tip.featuredImage.sourceurl : "/placeholder.webp"} className="brightness-75 z-10 h-full w-full object-cover object-center rounded" alt={tip?.featuredImage?.alttext ? tip.featuredImage.alttext : "placeholder text"} />
											</Link>
										);
									}
								})
							) : (
								<div className="col-span-full text-center py-10">No data</div>
							)}
						</div>
						<Pagnation total={filteredTips.length} currentPage={currentPage} onPageChange={handlePageChange} />
					</div>
				</div>
			</div>
		</section>
	);
}
