"use client";
import Image from "next/image";
import ContactForm from "../forms/ContactForm";
import { Parallax } from "react-parallax";

export default function HeroSection() {
	return (
		<Parallax
			bgImage="/mountins.webp" // Replace with your image path
			strength={500} // Adjust the parallax effect strength as needed
			className="h-auto" // Adjust the container height as needed
		>
			<div className="z-20 absolute inset-0 bg-black opacity-60"></div>
			<section className="z-30 relative overflow-hidden">
				<Image className="hidden md:block absolute bottom-0 right-10 w-auto h-auto" src="/mario.webp" height={100} width={100} alt="Mario Plumber" />
				<div className="grid py-8 px-4 mx-auto max-w-screen-xl lg:gap-12 xl:gap-0 lg:py-44 lg:grid-cols-12">
					<div className="z-10 place-self-center mr-auto mb-10 lg:col-span-7 xl:col-span-8 xl:mb-0 p-4 m:p-6 lg:p-8">
						<p className="text-sm md:text-lg font-semibold leading-8 tracking-tight inline-flex items-center rounded bg-brand-100 px-2.5 py-0.5 text-black">Local Built Company</p>
						<h1 className="tracking-tight font-extrabold mt-2 text-4xl text-white sm:text-6xl dark:text-black">Where Quality Meets Community.</h1>
						<p className="mt-6 text-md md:text-lg leading-6 md:leading-8 text-white backdrop-blur-sm bg-white/30 p-4 rounded">
							&quot;Where Quality Meets Community&quot; represents our commitment to providing high-quality plumbing services to our local community. We believe that by delivering top-notch plumbing solutions with a focus on customer service, we can make a positive impact on the neighborhoods we serve. At Wade&#39;s Plumbing & Septic, we take pride in being more than just a plumbing company; we&#39;re a part of the community we serve, and we&#39;re dedicated to providing the best
							possible service to our friends and neighbors.
						</p>
						<p className="font-bold text-white mt-4">License Number (Plumbing & Septic): 1087260</p>
					</div>
					<div className="z-10 ustify-center p-4 max-w-screen-sm bg-white rounded lg:mt-0 lg:col-span-5 xl:col-span-4 sm:p-6 lg:p-8 dark:bg-gray-800">
						<ContactForm />
					</div>
				</div>
			</section>
		</Parallax>
	);
}
