import { ArrowLongRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

const faqs = [
	{
		id: 1,
		question: "How often should I get my septic system pumped?",
		answer: "It is recommended to get your septic system pumped every 3-5 years to prevent backup and potential damage to your system. However, the frequency of pumping may vary depending on the size of your tank, the number of people in your household, and your water usage. Our team of professionals can evaluate your system and recommend a pumping schedule that suits your specific needs.",
	},
	{
		id: 2,
		question: "Can you help me with my bathroom or kitchen remodeling projects?",
		answer: "Yes, we offer bathroom and kitchen remodeling services! Our team has the experience and expertise to help you design and execute your dream project. We will work with you to understand your vision and provide you with a comprehensive plan that fits your budget and timeline.",
	},
	{
		id: 3,
		question: "How can I prevent clogged drains and pipes in my home?",
		answer: "There are several ways to prevent clogged drains and pipes in your home. You can avoid pouring grease and oil down your drains, use a drain catcher to catch hair and debris, and avoid flushing non-degradable items such as wipes and sanitary products down your toilet. Additionally, regular maintenance such as drain cleaning and inspections can help prevent clogs from forming.",
	},
	{
		id: 4,
		question: "What are some signs that my septic system is not working properly?",
		answer: "Some signs that your septic system may not be working properly include slow draining sinks or toilets, foul odors, wet spots or standing water in your yard, and sewage backups in your home. If you notice any of these signs, it is important to have your system inspected by a professional as soon as possible.",
	},
	{
		id: 5,
		question: "Can I use a septic tank treatment to avoid having my tank pumped?",
		answer: "Septic tank treatments can be beneficial in maintaining a healthy system, but they cannot replace the need for regular pumping. These treatments can help break down solids and improve the overall health of your system, but they should be used in conjunction with regular pumping and inspections.",
	},
	{
		id: 6,
		question: "How often should I have my water heater serviced?",
		answer: "It is generally recommended to have your water heater serviced annually by a professional plumber. Regular maintenance can help extend the life of your water heater and prevent issues such as leaks and poor performance.",
	},
	// More questions...
];

export default function FAQ() {
	return (
		<section className="bg-white relative overflow-hidden">
			<div className="py-16 px-6 sm:py-24 lg:px-8">
				<div className="mx-auto max-w-7xl">
					<h2 className="text-lg font-semibold leading-8 tracking-tight text-brand-600">Frequently asked questions</h2>
					<p className="mb-4 text-4xl tracking-tight font-extrabold text-black dark:text-white">Learn more about our company</p>
					<p className="max-w-2xl text-lg leading-6 text-gray-600">
						Have a different question and can’t find the answer you’re looking for? Reach out to our support team by
						<Link href="/contact-us" className="font-semibold text-brand-600 hover:text-brand-500">
							{` `}sending us an email{` `}
						</Link>
						and we’ll get back to you as soon as we can.
					</p>
					<div className="mt-20">
						<dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:gap-x-10">
							{faqs.map((faq, index) => (
								<div key={index}>
									<dt className="text-xl font-semibold leading-7 text-black">{faq.question}</dt>
									<dd className="mt-2 text-lg leading-7 text-gray-600">{faq.answer}</dd>
								</div>
							))}
						</dl>
					</div>
					<Link href="/contact-us" className="mt-10 inline-flex items-center text-white bg-brand-700 hover:bg-brand-800 focus:ring-4 focus:ring-brand-300 font-medium rounded text-sm px-5 py-2.5 text-center dark:focus:ring-brand-900">
						Get a free quote
						<ArrowLongRightIcon className="self-center ml-2 -mr-1 w-5 h-5" />
					</Link>
				</div>
			</div>
		</section>
	);
}
