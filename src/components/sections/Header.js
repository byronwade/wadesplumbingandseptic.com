"use client";
import { NavBar } from "../header/NavBar";
import { ServicesMenu } from "../header/ServicesMenu";
import { ExpertTipsMenu } from "../header/ExpertTipsMenu";
import { AboutUsMenu } from "../header/AboutUsMenu";
import { MobileMenuButton } from "../header/MobileMenuButton";
import { InfoBar } from "../header/InfoBar";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";

export default function Header({ data: menu }) {
	return (
		<>
			<Disclosure as="nav" className="bg-black text-white sticky top-0 z-50">
				{({ open, close }) => (
					<>
						<div className="relitive flex p-3 items-center justify-between mx-auto max-w-7xl px-6 lg:px-8">
							<NavBar open={open} />
							<div className="hidden md:flex space-x-8 items-center font-bold">
								<Link className="hover:underline" href="/">
									Home
								</Link>

								<ServicesMenu menu={menu} close={close} />
								<ExpertTipsMenu menu={menu} close={close} />
								<AboutUsMenu close={close} />
								<Link href="/contact-us" className="inline-flex justify-center rounded font-bold px-3.5 py-2.5 bg-brand text-black hover:bg-brand-600">
									Get a Quote
								</Link>
							</div>
						</div>
						<InfoBar />
						<MobileMenuButton />
					</>
				)}
			</Disclosure>
		</>
	);
}
