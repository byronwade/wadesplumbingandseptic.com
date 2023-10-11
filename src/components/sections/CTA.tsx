import Link from "next/link";
import Image from "next/image";

export default function CTA() {
	return (
		<section className="bg-brand relative">
			<div className="py-16 px-6 sm:py-24 lg:px-8">
				<div className="mx-auto max-w-7xl">
					<div className="flex flex-wrap items-center justify-between">
						<div className="w-full lg:w-1/2">
							<span className="mb-2 text-base font-semibold text-black">Get the best local plumbers</span>
							<h2 className="mb-6 text-3xl font-bold leading-tight text-black sm:mb-8 sm:text-[38px] lg:mb-0">
								Contact us for <br className="xs:block hidden" />a free quote
							</h2>
						</div>
						<div className="w-fulllg:w-1/2">
							<div className="flex flex-wrap lg:justify-end">
								<Link href="/services" className="hover:text-brand my-1 mr-4 inline-block rounded bg-white bg-opacity-[15%] py-4 px-6 text-base font-medium text-black transition hover:bg-opacity-100 md:px-9 lg:px-6 xl:px-9">
									See our services
								</Link>
								<Link href="/contact-us" className="my-1 inline-block rounded bg-black py-4 px-6 text-base font-medium text-white transition hover:bg-opacity-80 md:px-9 lg:px-6 xl:px-9">
									Get a free quote
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
