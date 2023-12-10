import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDown, ArrowRight } from "react-feather";
import Link from "next/link";

export function ExpertTipsMenu({ menu, close }) {
	const { septic, plumbing } = menu?.posts || {};
	const featuredPost = menu?.featuredPost;

	return (
		<Popover>
			<Popover.Button className="inline-flex items-center gap-x-1 hover:underline">
				Expert Tips
				<ChevronDown className="h-6 w-6" aria-hidden="true" />
			</Popover.Button>
			<Transition as={Fragment} enter="transition ease-out duration-75" enterFrom="opacity-0 -translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-75" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 -translate-y-1">
				<Popover.Panel className="absolute inset-x-0 top-0 -z-10 bg-black pt-[112px] shadow">
					{({ close }) => (
						<div className="mx-auto max-w-7xl py-10 px-6 lg:px-8">
							<div className="grid grid-cols-1 gap-y-10 gap-x-8 lg:grid-cols-2">
								<div className="grid grid-cols-1 col-span-2 gap-x-8 gap-y-12 sm:gap-y-16 lg:grid-cols-3">
									<div className="flex flex-col">
										<h3 className="text-sm font-bold leading-6 text-brand">Featured Post</h3>
										<Link
											href={`/expert-tips/${featuredPost?.slug}`}
											onClick={async () => {
												close();
											}}
											className="group space-y-2 mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-lg"
										>
											<h2 id="featured-post" className="mt-4 text-1xl font-bold tracking-tight text-white sm:text-2xl">
												{featuredPost?.title}
											</h2>

											<div className="inline-flex items-center font-normal hover:underline text-sm">
												<span className="group-hover:underline">Read in {featuredPost?.readingtime} min</span>
												<ArrowRight className="self-center ml-3 w-4 h-4" />
											</div>
										</Link>
									</div>
									<div className="flex flex-col space-y-6">
										<h3 className="text-sm font-bold leading-6 text-brand">Septic</h3>
										<div className="flex flex-col space-y-4">
											{septic?.slice(0, 2).map((post, index) => (
												<Link
													key={index}
													href={`/expert-tips/${post?.slug}`}
													onClick={async () => {
														close();
													}}
												>
													<div className="space-y-2 group relative max-w-xl">
														<h2 className="text-lg text-white">
															<div>
																<span className="absolute inset-0" />
																{post?.title}
															</div>
														</h2>

														<div className="inline-flex items-center font-normal hover:underline text-sm">
															<span className="group-hover:underline">Read in {post?.readingtime} min</span>
															<ArrowRight className="self-center ml-3 w-4 h-4" />
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
												<Link
													key={index}
													href={`/expert-tips/${post?.slug}`}
													onClick={async () => {
														close();
													}}
												>
													<div className="space-y-2 group relative max-w-xl">
														<h2 className="text-lg text-white">
															<div>
																<span className="absolute inset-0" />
																{post?.title}
															</div>
														</h2>

														<div className="inline-flex items-center font-normal hover:underline text-sm">
															<span className="group-hover:underline">Read in {post?.readingtime} min</span>
															<ArrowRight className="self-center ml-3 w-4 h-4" />
														</div>
													</div>
												</Link>
											))}
										</div>
									</div>
								</div>

								<div className="bg-brand p-4 rounded relative col-span-2 flex flex-wrap items-center justify-between">
									<div className="w-full lg:w-1/2">
										<h2 className="text-lg font-semibold leading-8 tracking-tight text-black-600">We have {menu?.totalPosts} Expert Tips</h2>
										<p className="mb-4 text-4xl tracking-tight font-extrabold text-black">Search for any Tips or Post</p>
									</div>
									<div className="w-fulllg:w-1/2">
										<div className="flex flex-wrap lg:justify-end">
											<Link
												href="/expert-tips"
												onClick={async () => {
													close();
												}}
												className="hover:text-brand my-1 mr-4 inline-block rounded bg-white bg-opacity-[15%] py-4 px-6 text-base font-medium text-black transition hover:bg-opacity-100 md:px-9 lg:px-6 xl:px-9"
											>
												See all of our tips
											</Link>
											<Link
												onClick={async () => {
													close();
												}}
												href="/contact-us"
												className="my-1 inline-block rounded bg-black py-4 px-6 text-base font-medium text-white transition hover:bg-opacity-80 md:px-9 lg:px-6 xl:px-9"
											>
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
