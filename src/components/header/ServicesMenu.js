import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDown } from "react-feather";
import Link from "next/link";

export function ServicesMenu({ menu }) {
	const { residential, commercial, drainClearing, septic, engineeredSeptic, drainage } = menu?.services || {};

	return (
		<Popover>
			<Popover.Button className="inline-flex items-center gap-x-1 hover:underline">
				Services
				<ChevronDown className="w-6 h-6" aria-hidden="true" />
			</Popover.Button>
			<Transition as={Fragment} enter="transition ease-out duration-75" enterFrom="opacity-0 -translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-75" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 -translate-y-1">
				<Popover.Panel className="absolute inset-x-0 top-0 -z-10 bg-black pt-[112px] shadow">
					{({ close }) => (
						<div className="px-6 py-10 mx-auto max-w-7xl lg:px-8">
							<div className="grid grid-cols-1 gap-y-10 gap-x-8 lg:grid-cols-3">
								<div className="grid grid-cols-6 col-span-6 gap-x-6 sm:gap-x-8">
									<div className="flex flex-col space-y-6">
										<h3 className="text-sm font-bold leading-6 text-brand">Residential</h3>
										<div className="flex flex-col space-y-4">
											{residential?.map((service, index) => (
												<Link key={index} href={`/services/${service.slug}`} onClick={() => close()} className="text-sm font-normal hover:underline">
													{service.title}
												</Link>
											))}
										</div>
									</div>
									<div className="flex flex-col space-y-6">
										<h3 className="text-sm font-bold leading-6 text-brand">Commercial</h3>
										<div className="flex flex-col space-y-4">
											{commercial?.map((service, index) => (
												<Link key={index} href={`/services/${service.slug}`} onClick={() => close()} className="text-sm font-normal hover:underline">
													{service.title}
												</Link>
											))}
										</div>
									</div>
									<div className="flex flex-col space-y-6">
										<h3 className="text-sm font-bold leading-6 text-brand">Drain Clearing</h3>
										<div className="flex flex-col space-y-4">
											{drainClearing?.map((service, index) => (
												<Link key={index} href={`/services/${service.slug}`} onClick={() => close()} className="text-sm font-normal hover:underline">
													{service.title}
												</Link>
											))}
										</div>
									</div>
									<div className="flex flex-col space-y-6">
										<h3 className="text-sm font-bold leading-6 text-brand">Septic</h3>
										<div className="flex flex-col space-y-4">
											{septic?.map((service, index) => (
												<Link key={index} href={`/services/${service.slug}`} onClick={() => close()} className="text-sm font-normal hover:underline">
													{service.title}
												</Link>
											))}
										</div>
									</div>
									<div className="flex flex-col space-y-6">
										<h3 className="text-sm font-bold leading-6 text-brand">Engineered Septic</h3>
										<div className="flex flex-col space-y-4">
											{engineeredSeptic?.map((service, index) => (
												<Link key={index} href={`/services/${service.slug}`} onClick={() => close()} className="text-sm font-normal hover:underline">
													{service.title}
												</Link>
											))}
										</div>
									</div>
									<div className="flex flex-col space-y-6">
										<h3 className="text-sm font-bold leading-6 text-brand">Drainage</h3>
										<div className="flex flex-col space-y-4">
											{drainage?.map((service, index) => (
												<Link key={index} href={`/services/${service.slug}`} onClick={() => close()} className="text-sm font-normal hover:underline">
													{service.title}
												</Link>
											))}
										</div>
									</div>
								</div>
								<div className="relative flex flex-wrap items-center justify-between col-span-3 p-4 rounded bg-brand">
									<div className="w-full lg:w-1/2">
										<h2 className="text-lg font-semibold leading-8 tracking-tight text-black-600">We have {menu?.totalServices} Services</h2>
										<p className="mb-4 text-4xl font-extrabold tracking-tight text-black">Search for any service</p>
									</div>
									<div className="w-full lg:w-1/2">
										<div className="flex flex-wrap lg:justify-end">
											<Link href="/services" onClick={() => close()} className="hover:text-brand my-1 mr-4 inline-block rounded bg-white bg-opacity-[15%] py-4 px-6 text-base font-medium text-black transition hover:bg-opacity-100 md:px-9 lg:px-6 xl:px-9">
												See all of our services
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
