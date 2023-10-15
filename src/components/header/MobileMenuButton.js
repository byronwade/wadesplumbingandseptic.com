import { Disclosure } from "@headlessui/react";
import Link from "next/link";

export function MobileMenuButton() {
	const navigation = [
		{
			name: "Home",
			href: "/",
			current: true,
		},
		{
			name: "Services",
			href: "/services",
			current: false,
		},
		{
			name: "Expert Tips",
			href: "/expert-tips",
			current: false,
		},
		{
			name: "About",
			href: "/about",
			current: false,
		},
		{
			name: "Contact",
			href: "/contact",
			current: false,
		},
	];

	function classNames(...classes) {
		return classes.filter(Boolean).join(" ");
	}

	return (
		<Disclosure.Panel className="md:hidden">
			{({ close }) => (
				<div className="space-y-3 px-2 pt-2 pb-3">
					{navigation.map((item, index) => (
						<Link key={index} href={item.href} onClick={() => close()} className={classNames(item.current ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white", "block rounded px-3 py-2 text-base font-bold")} aria-current={item.current ? "page" : undefined}>
							{item.name}
						</Link>
					))}
				</div>
			)}
		</Disclosure.Panel>
	);
}
