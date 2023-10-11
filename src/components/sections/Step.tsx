import { ArrowLongRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";

export const Step = () => {
	return (
		<section className="bg-black relative overflow-hidden">
			<div className="py-16 px-6 sm:py-24 lg:px-8">
				<Image className="hidden md:block absolute bottom-0 left-10" src="/luigi.png" height={100} width={100} alt="Mario Plumber" />
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<h2 className="text-lg font-semibold leading-8 tracking-tight text-brand-600">Our Process</h2>
					<p className="mb-4 text-4xl tracking-tight font-extrabold text-white dark:text-black">How do we handle our customers?</p>
					<div className="mt-10 grid gap-6 row-gap-10 lg:grid-cols-2">
						<div className="lg:py-6 lg:pr-16">
							<div className="flex">
								<div className="flex flex-col items-center mr-4">
									<div>
										<div className="flex items-center justify-center w-10 h-10 border rounded-full">
											<svg className="w-4 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
												<line fill="none" strokeMiterlimit="10" x1="12" y1="2" x2="12" y2="22" />
												<polyline fill="none" strokeMiterlimit="10" points="19,15 12,22 5,15" />
											</svg>
										</div>
									</div>
									<div className="w-px h-full bg-gray-300" />
								</div>
								<div className="pt-1 pb-8">
									<p className=" mb-2 text-lg font-bold text-white">We send a tech to you.</p>
									<p className="mt-2 text-md font-normal text-gray-500 dark:text-gray-400">Once you contact us or submit a request, our technician will visit your location to assess the project, create a list of necessary materials, and provide any educational information you may need.</p>
								</div>
							</div>
							<div className="flex">
								<div className="flex flex-col items-center mr-4">
									<div>
										<div className="flex items-center justify-center w-10 h-10 border rounded-full">
											<svg className="w-4 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
												<line fill="none" strokeMiterlimit="10" x1="12" y1="2" x2="12" y2="22" />
												<polyline fill="none" strokeMiterlimit="10" points="19,15 12,22 5,15" />
											</svg>
										</div>
									</div>
									<div className="w-px h-full bg-gray-300" />
								</div>
								<div className="pt-1 pb-8">
									<p className=" mb-2 text-lg font-bold text-white">We give you a quote.</p>
									<p className="mt-2 text-md font-normal text-gray-500 dark:text-gray-400">Once we assess your project, we&apos;ll provide a flat-rate price based on standard industry rates. Our technician will remain onsite to answer any questions you may have and potentially schedule the project for the same day.</p>
								</div>
							</div>
							<div className="flex">
								<div className="flex flex-col items-center mr-4">
									<div>
										<div className="flex items-center justify-center w-10 h-10 border rounded-full">
											<svg className="w-4 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
												<line fill="none" strokeMiterlimit="10" x1="12" y1="2" x2="12" y2="22" />
												<polyline fill="none" strokeMiterlimit="10" points="19,15 12,22 5,15" />
											</svg>
										</div>
									</div>
									<div className="w-px h-full bg-gray-300" />
								</div>
								<div className="pt-1 pb-8">
									<p className=" mb-2 text-lg font-bold text-white">You accept that quote.</p>
									<p className="mt-2 text-md font-normal text-gray-500 dark:text-gray-400">Once the project details have been established, we will review any applicable warranties or stipulations with you. Following this, we will request that you sign a contract for the work to be done.</p>
								</div>
							</div>
							<div className="flex">
								<div className="flex flex-col items-center mr-4">
									<div>
										<div className="flex items-center justify-center w-10 h-10 border rounded-full">
											<svg className="w-4 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
												<line fill="none" strokeMiterlimit="10" x1="12" y1="2" x2="12" y2="22" />
												<polyline fill="none" strokeMiterlimit="10" points="19,15 12,22 5,15" />
											</svg>
										</div>
									</div>
									<div className="w-px h-full bg-gray-300" />
								</div>
								<div className="pt-1 pb-8">
									<p className=" mb-2 text-lg font-bold text-white">We scedule the project.</p>
									<p className="mt-2 text-md font-normal text-gray-500 dark:text-gray-400">We strive to provide same-day service whenever possible, based on the size and complexity of your project. If same-day service isn&apos;t feasible, we&apos;ll work with you to schedule a convenient appointment.</p>
								</div>
							</div>
							<div className="flex">
								<div className="flex flex-col items-center mr-4">
									<div>
										<div className="flex items-center justify-center w-10 h-10 border rounded-full">
											<svg className="w-4 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
												<line fill="none" strokeMiterlimit="10" x1="12" y1="2" x2="12" y2="22" />
												<polyline fill="none" strokeMiterlimit="10" points="19,15 12,22 5,15" />
											</svg>
										</div>
									</div>
									<div className="w-px h-full bg-gray-300" />
								</div>
								<div className="pt-1 pb-8">
									<p className="mb-2 text-lg font-bold text-white">We send our team.</p>
									<p className="mt-2 text-md font-normal text-gray-500 dark:text-gray-400">Once all details are confirmed, our project manager will assemble a team that is tailored to your project&apos;s specific needs. The team will be selected based on the project manager&apos;s discretion, ensuring that the most qualified individuals are assigned to your project.</p>
								</div>
							</div>
							<div className="flex">
								<div className="flex flex-col items-center mr-4">
									<div>
										<div className="flex items-center justify-center w-10 h-10 bg-green rounded-full">
											<svg className="w-6 text-black" stroke="currentColor" viewBox="0 0 24 24">
												<polyline fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="6,12 10,16 18,8" />
											</svg>
										</div>
									</div>
								</div>
								<div className="pt-1">
									<p className=" mb-2 text-lg font-bold text-white">Success</p>
									<p className="mt-2 text-md font-normal text-gray-500 dark:text-gray-400">Our team will follow up with you to ensure that everything is in order, and we&apos;ll be available to assist you with any additional needs you may have. This is part of our commitment to providing outstanding customer service and ensuring your complete satisfaction.</p>
								</div>
							</div>
						</div>
						<div className="relative">
							<Image className="inset-0 object-cover object-bottom w-full rounded shadow-lg h-96 lg:absolute lg:h-full" width={1000} height={100} src="/customerservice.png" alt="customer service" />
						</div>
					</div>

					<Link href="/contact-us" className="mt-10 inline-flex items-center text-white bg-brand-700 hover:bg-brand-800 focus:ring-4 focus:ring-brand-300 font-medium rounded text-sm px-5 py-2.5 text-center dark:focus:ring-brand-900">
						Receive a no-obligation quote
						<ArrowLongRightIcon className="self-center ml-2 -mr-1 w-5 h-5" />
					</Link>
				</div>
			</div>
		</section>
	);
};
