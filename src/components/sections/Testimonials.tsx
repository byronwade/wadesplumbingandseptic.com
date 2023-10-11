import { ArrowLongRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";

const testimonials = [
	{
		body: "As a real estate professional, I love working with Wade’s plumbing! They will always make sure you are taken care of and have always been super courteous and professional to my clients. I have often used them for high level plumbing inspections for buyers during contingency periods, I don’t know any other plumber who does that!!! I’ve also had them work on my own home. Totally recommend.",
		author: {
			name: "Bailey Cotrona",
			imageUrl: "https://lh3.googleusercontent.com/a-/ACB-R5T5epJSF9j2DDRDp8uDUBbS_6Ru7CL5ZYJH3wGhXA=w120-h120-p-rp-mo-br100",
		},
	},

	{
		body: "These guys are top notch.  It's my third time using them, with definitely the largest problem yet, and I can't recommend them enough after they have fixed us up consistently for the third time.  They know their stuff, do great work, and are a pleasure to work with.  I got to see them in action with a large and costly septic main line repair full with trenchless pull and all that stuff... they were pro's with a great attitude and made me feel comfortable with a terrible situation that shut down my house.  Corey is a top notch guy that was hands on at every step and walked me through the whole process and even had great patience with me as I go through all the stages of denial :) Big shout out to Bruce tho, the kindest dude who put in tons of work.  These are all a bunch of great guys that are efficient and reliable and come at a reasonable cost.",
		author: {
			name: "aaron berger",
			imageUrl: "https://lh3.googleusercontent.com/a-/ACB-R5QovgzyWClbByxo6UOV1jA8P1ejTcoVJhQ2kw0uAw=w120-h120-p-rp-mo-br100",
		},
	},

	{
		body: "Our house flooded on NYE causing our sewage ejector pump and basin to fill with silt and debris on top of the effluent. After playing phone tag with a few other companies I was able to get ahold of someone at Wade’s right away. They understood my situation and responded the same afternoon to pump out the basin. I work in construction and was extremely pleased with how responsive and professional everyone was from the office staff and project manager to the guys in the field who worked quickly and efficiently to diagnose the problem. Dealing with the aftermath of this flood has been incredibly difficult but the team at Wade‘s came through when I needed them most and I will most certainly be using them in the future.",
		author: {
			name: "Shawn Moresco",
			imageUrl: "https://lh3.googleusercontent.com/a-/ACB-R5QmO-Mp2m1DEHae6-RUAhxU_U88mV6jQBL_9Wv9-A=w120-h120-p-rp-mo-br100",
		},
	},

	{
		body: "Corey came by for the job walk.  He was very knowledgeable and quoted me a very fair price.  The crew performed all of their work to a very high standard.  This company is excellent at communicating and creating a personal experience.  Highly recommend!",
		author: {
			name: "dobrofreak",
			imageUrl: "https://lh3.googleusercontent.com/a/AGNmyxak8QWsmPK196QHW8V3SDCDn41c2Guh0xZnVmyW=w120-h120-p-rp-mo-br100",
		},
	},
	{
		body: "The guys and gals at Wade's were fast, professional did everything they said and promised.  They worked with me on different levels and did a great job of replacing our downstairs ejector pump.",
		author: {
			name: "Bob Skubis",
			imageUrl: "https://lh3.googleusercontent.com/a/AGNmyxb7vTCd0CaGSgZ1_qd0B-Ab6ABj_JZYQa3nY8Wb=w120-h120-p-rp-mo-br100",
		},
	},
	{
		body: "My Waterheater was leaking,and i had some corrosive pipes. We called wades plumbing over Cory came and took a look and told me the truth on what they could do for us. Miguel and Benjamin fixed our problem and other forseable problem in the future with in a reasonable time. They are very punctual and courteous we highly recommend them and we will be using them in our future projects.",
		author: {
			name: "Henry Padilla",
			imageUrl: "https://lh3.googleusercontent.com/a/AGNmyxYWROm1oE7CZT7pJ6HSbaRJ0JDIDEogvsJhUwyx=w120-h120-p-rp-mo-br100",
		},
	},
	// More testimonials...
];

export default function Testimonials() {
	return (
		<div className="bg-white py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<h2 className="text-lg font-semibold leading-8 tracking-tight text-brand-600">Read what our customers have said</h2>
				<p className="mb-4 text-4xl tracking-tight font-extrabold text-black dark:text-white">Testimonials</p>
				<p className="max-w-2xl text-lg leading-6 text-gray-600">We have worked with thousands of amazing people</p>
				<div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
					<div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
						{testimonials.map((testimonial, index) => (
							<div key={index} className="pt-8 sm:inline-block sm:w-full sm:px-4">
								<figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
									<div className="flex items-center mb-4 space-x-4">
										<Image width={50} height={50} className="h-10 w-10 rounded-full bg-gray-50" src={testimonial.author.imageUrl} alt="" />
										<div className="space-y-1 font-medium dark:text-white">
											<div>
												{testimonial.author.name}

												<div className="flex items-center mb-1">
													<svg aria-hidden="true" className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
														<title>First star</title>
														<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
													</svg>
													<svg aria-hidden="true" className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
														<title>Second star</title>
														<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
													</svg>
													<svg aria-hidden="true" className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
														<title>Third star</title>
														<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
													</svg>
													<svg aria-hidden="true" className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
														<title>Fourth star</title>
														<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
													</svg>
													<svg aria-hidden="true" className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
														<title>Fifth star</title>
														<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
													</svg>
												</div>
											</div>
										</div>
									</div>
									<p className="mb-2 text-gray-500 dark:text-gray-400">{testimonial.body}</p>
								</figure>
							</div>
						))}
					</div>
					<Link href="/contact-us" className="mt-10 inline-flex items-center text-white bg-brand-700 hover:bg-brand-800 focus:ring-4 focus:ring-brand-300 font-medium rounded text-sm px-5 py-2.5 text-center dark:focus:ring-brand-900">
						Get a cost-free consultation
						<ArrowLongRightIcon className="self-center ml-2 -mr-1 w-5 h-5" />
					</Link>
				</div>
			</div>
		</div>
	);
}
