import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import Link from "next/link";
import { ChevronDown, DollarSign, Award, User, Briefcase, Mic, ShoppingBag } from "react-feather";

const solutions = [
	{ name: "Team & Company", description: "Get to know our team and company", href: "/about-us", icon: User },
	{ name: "Warranties", description: "Learn about our warranties", href: "/about-us/warranties", icon: Award },
	{ name: "Rebates", description: "Find some rebates", href: "/about-us/rebates", icon: DollarSign },
	{ name: "Financing", description: "Our financing is top notch", href: "/about-us/financing", icon: ShoppingBag },
	{ name: "Job Opportunities", description: "Find your dream job", href: "/about-us/jobs", icon: Briefcase },
	{ name: "Promotions & Discounts", description: "Find a discount here", href: "/about-us/promotions", icon: Mic },
];

export function AboutUsMenu() {
	return (
		<Popover>
			<Popover.Button className="inline-flex items-center gap-x-1 hover:underline">
				About Us & More
				<ChevronDown className="w-6 h-6" aria-hidden="true" />
			</Popover.Button>
			<Transition as={Fragment} enter="transition ease-out duration-75" enterFrom="opacity-0 -translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-75" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 -translate-y-1">
				<Popover.Panel className="absolute inset-x-0 top-0 -z-10 bg-black pt-[112px] shadow">
					{({ close }) => (
						<div className="grid grid-cols-1 gap-2 px-6 py-6 mx-auto max-w-7xl sm:grid-cols-2 sm:gap-x-6 sm:gap-y-0 sm:py-10 lg:grid-cols-6 lg:gap-4 lg:px-8 xl:gap-8">
							{solutions.map((item, index) => (
								<Link href={item.href} onClick={() => close()} key={index} className="relative flex gap-6 p-3 -mx-3 text-sm leading-6 rounded group hover:bg-black-600 sm:flex-col sm:p-6">
									<div className="flex items-center justify-center flex-none rounded h-11 w-11 bg-black-400 group-hover:bg-white">
										<item.icon className="w-6 h-6 text-gray-700 group-hover:text-brand-600" aria-hidden="true" />
									</div>
									<div>
										<div className="font-semibold text-gray-900">
											{item.name}
											<span className="absolute inset-0" />
										</div>
										<p className="mt-1 text-gray-700">{item.description}</p>
									</div>
								</Link>
							))}
						</div>
					)}
				</Popover.Panel>
			</Transition>
		</Popover>
	);
}
