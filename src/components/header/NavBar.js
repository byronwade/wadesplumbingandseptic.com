import Image from "next/image";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/20/solid";

export function NavBar({ open }) {
	return (
		<>
			<Link className="flex items-center space-x-4" href="/">
				<Image className="w-auto h-auto" src="/WadesLogo.webp" width={40} height={40} alt="Wade's Plumbing & Septic Logo" />
				<h1 className="font-bold text-2xl hidden xl:inline-flex">Wades Plumbing & Septic</h1>
			</Link>
			<div className="flex font-bold items-center md:hidden">
				<Disclosure.Button className="inline-flex items-center justify-center rounded p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
					<span className="sr-only">Open main menu</span>
					{open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
				</Disclosure.Button>
			</div>
		</>
	);
}
