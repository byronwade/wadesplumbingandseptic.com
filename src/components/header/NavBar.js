import Image from "next/image";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { X } from "react-feather";

export function NavBar({ open }) {
	return (
		<>
			<Link className="flex items-center space-x-4" href="/">
				<Image className="w-auto h-auto" src="/WadesLogo.webp" width={40} height={40} alt="Wade's Plumbing & Septic Logo" />
				<span className="font-bold text-2xl hidden xl:inline-flex">Wades Plumbing & Septic</span>
			</Link>
			<div className="flex font-bold items-center md:hidden">
				<Disclosure.Button className="inline-flex items-center justify-center rounded p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
					<span className="sr-only">Open main menu</span>
					{open ? <X className="block h-6 w-6" aria-hidden="true" /> : <X className="block h-6 w-6" aria-hidden="true" />}
				</Disclosure.Button>
			</div>
		</>
	);
}
