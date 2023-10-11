import { ArrowLongRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";

const features = [
	{
		name: "Fast Response Time",
		description: "Our expert plumbers are always on standby, ready to tackle any plumbing issue with efficiency and precision. Rest easy knowing help is just a call away.",
	},
	{
		name: "Eco-Friendly Practices",
		description: "We prioritize environmentally responsible plumbing solutions, helping you save water and energy, and reduce your carbon footprint.",
	},
	{
		name: "Emergency Plumbing Services",
		description: "We offer round-the-clock support for your urgent plumbing needs. Our skilled technicians will resolve your emergency issues promptly and effectively.",
	},
	{
		name: "Licensed & Insured Professionals",
		description: "Trust our team of certified and insured plumbers to provide high-quality services, ensuring the longevity and functionality of your plumbing system.",
	},
	{
		name: "Customized Service Plans",
		description: "Our flexible service plans cater to your unique needs, providing comprehensive plumbing solutions that fit your budget and requirements.",
	},
	{
		name: "Preventative Maintenance",
		description: "Stay ahead of potential issues with our preventative maintenance programs, designed to keep your plumbing system running smoothly and efficiently.",
	},
];

export default function FeatureSection() {
	return (
		<section className="bg-gray-50 relative overflow-hidden">
			<div className="py-16 px-6 sm:py-24 lg:px-8">
				<Image className="hidden md:block absolute -bottom-5 right-10" src="/gumba.png" height={100} width={100} alt="Gumba Plumber" />
				<div className="mx-auto max-w-7xl">
					<h2 className="text-lg font-semibold leading-8 tracking-tight text-brand-600">Just a few features...</h2>
					<p className="mb-4 text-4xl tracking-tight font-extrabold text-black dark:text-white">All-in-One Plumbing Solutions</p>
					<p className="max-w-2xl text-lg leading-6 text-gray-600">Experience top-notch plumbing services that cater to all your needs. Our team of licensed professionals ensures your satisfaction, every step of the way.</p>
					<dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
						{features.map((feature, index) => (
							<div key={index}>
								<dt className="font-semibold text-gray-900">{feature.name}</dt>
								<dd className="mt-1 text-gray-600">{feature.description}</dd>
							</div>
						))}
					</dl>

					<Link href="/contact-us" className="mt-10 inline-flex items-center text-white bg-brand-700 hover:bg-brand-800 focus:ring-4 focus:ring-brand-300 font-medium rounded text-sm px-5 py-2.5 text-center dark:focus:ring-brand-900">
						Request a complimentary estimate
						<ArrowLongRightIcon className="self-center ml-2 -mr-1 w-5 h-5" />
					</Link>
				</div>
			</div>
		</section>
	);
}
