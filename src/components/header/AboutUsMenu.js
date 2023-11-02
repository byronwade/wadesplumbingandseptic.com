import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import Link from "next/link";
import { ChevronDownIcon, CurrencyDollarIcon, CheckBadgeIcon, UserCircleIcon, BanknotesIcon, BriefcaseIcon, MegaphoneIcon } from "@heroicons/react/20/solid";

export function AboutUsMenu() {
	const solutions = [
		{
			name: "Team & Company",
			description: "Get to know our team and company",
			href: "/about-us",
			icon: UserCircleIcon,
		},
		{
			name: "Warranties",
			description: "Learn about our warranties",
			href: "/about-us/warranties",
			icon: CheckBadgeIcon,
		},
		{
			name: "Rebates",
			description: "Find some rebates",
			href: "/about-us/rebates",
			icon: CurrencyDollarIcon,
		},
		{ name: "Financing", description: "Our financing is top notch", href: "/about-us/financing", icon: BanknotesIcon },
		{
			name: "Job Opertunities",
			description: "Find your dream job",
			href: "/about-us/jobs",
			icon: BriefcaseIcon,
		},
		{
			name: "Promotions & Discounts",
			description: "Find a discount here",
			href: "/about-us/promotions",
			icon: MegaphoneIcon,
		},
		// {
		// 	name: "Reviews",
		// 	description: "Our Reviews are top notch",
		// 	href: "/about-us/reviews",
		// 	icon: StarIcon,
		// },
	];
	return (
		<Popover>
			<Popover.Button className="inline-flex items-center gap-x-1 hover:underline">
				About Us & More
				<ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
			</Popover.Button>
			<Transition as={Fragment} enter="transition ease-out duration-75" enterFrom="opacity-0 -translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-75" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 -translate-y-1">
				<Popover.Panel className="absolute inset-x-0 top-0 -z-10 bg-black pt-[112px] shadow">
					{({ close }) => (
						<div className="mx-auto grid max-w-7xl grid-cols-1 gap-2 px-6 py-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-0 sm:py-10 lg:grid-cols-6 lg:gap-4 lg:px-8 xl:gap-8">
							{solutions.map((item, index) => (
								<Link
									href={item.href}
									onClick={async () => {
										close();
									}}
									key={index}
									className="group relative -mx-3 flex gap-6 rounded p-3 text-sm leading-6 hover:bg-black-600 sm:flex-col sm:p-6"
								>
									<div className="flex h-11 w-11 flex-none items-center justify-center rounded bg-black-400 group-hover:bg-white">
										<item.icon className="h-6 w-6 text-gray-700 group-hover:text-brand-600" aria-hidden="true" />
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
