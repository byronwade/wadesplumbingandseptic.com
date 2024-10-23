import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDown, ArrowRight } from "react-feather";
import Link from "next/link";

export function ExpertTipsMenu({ menu }) {
	const { septic, plumbing } = menu?.posts || {};
	const featuredPost = menu?.featuredPost;

	return (
		<Popover>
			<Popover.Button className="inline-flex items-center gap-x-1 hover:underline">
				Expert Tips
				<ChevronDown className="w-6 h-6" aria-hidden="true" />
			</Popover.Button>
			<Transition as={Fragment} enter="transition ease-out duration-75" enterFrom="opacity-0 -translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-75" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 -translate-y-1">
				<Popover.Panel className="absolute inset-x-0 top-0 -z-10 bg-black pt-[112px] shadow">
					{({ close }) => (
						<div className="px-6 py-10 mx-auto max-w-7xl lg:px-8">
							<div className="grid grid-cols-1 gap-y-10 gap-x-8 lg:grid-cols-2">
								<div className="grid grid-cols-1 col-span-2 gap-x-8 gap-y-12 sm:gap-y-16 lg:grid-cols-3">
									<div className="flex flex-col">
										<h3 className="text-sm font-bold leading-6 text-brand">Featured Post</h3>
										<Link href={`/expert-tips/${featuredPost?.slug}`} onClick={() => close()} className="w-full max-w-2xl mx-auto space-y-2 group lg:mx-0 lg:max-w-lg">
											<h2 id="featured-post" className="mt-4 font-bold tracking-tight text-white text-1xl sm:text-2xl">
												{featuredPost?.title}
											</h2>
											<div className="inline-flex items-center text-sm font-normal hover:underline">
												<span className="group-hover:underline">Read in {featuredPost?.readingtime} min</span>
												<ArrowRight className="self-center w-4 h-4 ml-3" />
											</div>
										</Link>
									</div>
									<div className="flex flex-col space-y-6">
										<h3 className="text-sm font-bold leading-6 text-brand">Septic</h3>
										<div className="flex flex-col space-y-4">
											{septic?.slice(0, 2).map((post, index) => (
												<Link key={index} href={`/expert-tips/${post?.slug}`} onClick={() => close()}>
													<div className="relative max-w-xl space-y-2 group">
														<h2 className="text-lg text-white">
															<div>
																<span className="absolute inset-0" />
																{post?.title}
															</div>
														</h2>
														<div className="inline-flex items-center text-sm font-normal hover:underline">
															<span className="group-hover:underline">Read in {post?.readingtime} min</span>
															<ArrowRight className="self-center w-4 h-4 ml-3" />
														</div>
													</div>
												</Link>
											))}
										</div>
									</div>
									<div className="flex flex-col space-y-6">
										<h3 className="text-sm font-bold leading-6 text-brand">Plumbing</h3>
										<div className="flex flex-col space-y-4">
											{plumbing?.slice(0, 2).map((post, index) => (
												<Link key={index} href={`/expert-tips/${post?.slug}`} onClick={() => close()}>
													<div className="relative max-w-xl space-y-2 group">
														<h2 className="text-lg text-white">
															<div>
																<span className="absolute inset-0" />
																{post?.title}
															</div>
														</h2>
														<div className="inline-flex items-center text-sm font-normal hover:underline">
															<span className="group-hover:underline">Read in {post?.readingtime} min</span>
															<ArrowRight className="self-center w-4 h-4 ml-3" />
														</div>
													</div>
												</Link>
											))}
										</div>
									</div>
								</div>
								<div className="relative flex flex-wrap items-center justify-between col-span-2 p-4 rounded bg-brand">
									<div className="w-full lg:w-1/2">
										<h2 className="text-lg font-semibold leading-8 tracking-tight text-black-600">We have {menu?.totalPosts} Expert Tips</h2>
										<p className="mb-4 text-4xl font-extrabold tracking-tight text-black">Search for any Tips or Post</p>
									</div>
									<div className="w-fulllg:w-1/2">
										<div className="flex flex-wrap lg:justify-end">
											<Link href="/expert-tips" onClick={() => close()} className="hover:text-brand my-1 mr-4 inline-block rounded bg-white bg-opacity-[15%] py-4 px-6 text-base font-medium text-black transition hover:bg-opacity-100 md:px-9 lg:px-6 xl:px-9">
												See all of our tips
											</Link>
											<Link onClick={() => close()} href="/contact-us" className="inline-block px-6 py-4 my-1 text-base font-medium text-white transition bg-black rounded hover:bg-opacity-80 md:px-9 lg:px-6 xl:px-9">
												Get a free quote
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</Popover.Panel>
			</Transition>
		</Popover>
	);
}
