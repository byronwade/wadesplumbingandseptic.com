import Image from "next/image";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { X, Menu } from "react-feather";

export function NavBar({ open }) {
	return (
		<>
			<Link className="flex items-center space-x-4" href="/">
				<Image className="w-auto h-auto" src="/WadesLogo.webp" width={40} height={40} alt="Wade's Plumbing & Septic Logo" />
				<span className="hidden text-2xl font-bold xl:inline-flex">Wade&apos;s Plumbing & Septic</span>
			</Link>
			<div className="flex items-center font-bold md:hidden">
				<Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-400 rounded hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
					<span className="sr-only">Open main menu</span>
					{open ? <X className="block w-6 h-6" aria-hidden="true" /> : <Menu className="block w-6 h-6" aria-hidden="true" />}
				</Disclosure.Button>
			</div>
		</>
	);
}
