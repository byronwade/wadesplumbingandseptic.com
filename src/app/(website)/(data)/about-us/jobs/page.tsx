import Link from "next/link";
import { ArrowLongRightIcon, MapPinIcon } from "@heroicons/react/20/solid";
import fetchData from "./getJobs";
import Head from "next/head";

export const metadata = {
	title: "Plumbing Careers | Wade's Plumbing & Septic",
	description: "Embark on a rewarding career in plumbing with Wade's Plumbing & Septic. Explore our current job openings and apply to join our team of skilled plumbing professionals.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	keywords: ["Plumbing Careers", "Job Openings", "Skilled Plumbers", "Wade's Plumbing & Septic"],
	authors: [{ name: "Byron Wade" }, { name: "Byron Wade", url: "https://www.wadesplumbingandseptic.com/" }],
	creator: "Byron Wade",
	publisher: "Byron Wade",
	alternates: {},
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	category: "construction",
	bookmarks: ["https://www.wadesplumbingandseptic.com/about-us/jobs/"],
	twitter: {
		card: "summary_large_image",
		title: "Plumbing Careers | Wade's Plumbing & Septic",
		description: "Embark on a rewarding career in plumbing with Wade's Plumbing & Septic. Explore our current job openings and apply to join our team of skilled plumbing professionals.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/api/og?title=Plumbing Careers&link=www.wadesplumbingandseptic.com&description=Embark on a rewarding career in plumbing with Wade's Plumbing & Septic. Explore our current job openings and apply to join our team of skilled plumbing professionals.",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Plumbing Careers | Wade's Plumbing & Septic",
		description: "Embark on a rewarding career in plumbing with Wade's Plumbing & Septic. Explore our current job openings and apply to join our team of skilled plumbing professionals.",
		url: "https://www.wadesplumbingandseptic.com/about-us/jobs/",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Plumbing Careers&link=www.wadesplumbingandseptic.com&description=Embark on a rewarding career in plumbing with Wade's Plumbing & Septic. Explore our current job openings and apply to join our team of skilled plumbing professionals.",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Plumbing Careers&link=www.wadesplumbingandseptic.com&description=Embark on a rewarding career in plumbing with Wade's Plumbing & Septic. Explore our current job openings and apply to join our team of skilled plumbing professionals.",
				width: 1800,
				height: 1600,
				alt: "Wade's Plumbing & Septic",
			},
		],
		locale: "en-US",
		type: "website",
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "JobPosting",
	title: "Plumbing Careers at Wade's Plumbing & Septic",
	description: "Embark on a rewarding career in plumbing with Wade's Plumbing & Septic. Explore our current job openings and apply to join our team of skilled plumbing professionals.",
	identifier: {
		"@type": "PropertyValue",
		name: "Wade's Plumbing & Septic",
		value: "Plumbing_Jobs",
	},
	jobLocation: {
		"@type": "Place",
		address: {
			"@type": "PostalAddress",
			streetAddress: "123 Main St",
			addressLocality: "Santa Cruz",
			addressRegion: "CA",
			postalCode: "95060",
			addressCountry: "US",
		},
	},
	hiringOrganization: {
		"@type": "Organization",
		name: "Wade's Plumbing & Septic",
		sameAs: "https://www.wadesplumbingandseptic.com",
		logo: "https://www.wadesplumbingandseptic.com/api/og?title=Plumbing Careers&link=www.wadesplumbingandseptic.com&description=Embark on a rewarding career in plumbing with Wade's Plumbing & Septic. Explore our current job openings and apply to join our team of skilled plumbing professionals.",
	},
	baseSalary: {
		"@type": "MonetaryAmount",
		currency: "USD",
		value: {
			"@type": "QuantitativeValue",
			value: "Competitive",
			unitText: "YEAR",
		},
	},
	employmentType: "FULL_TIME",
	validThrough: "2024-12-31",
	jobPostingURL: "https://www.wadesplumbingandseptic.com/about-us/jobs/",
};

export default async function Jobs() {
	const { allJobs, jobDetails } = await fetchData();
	console.log(jobDetails);

	return (
		<>
			<Head>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			</Head>
			<section className="mx-auto max-w-7xl py-16 px-6 sm:py-24 lg:px-8">
				<div className="space-y-6 relative flex flex-col overflow-hidden">
					{allJobs?.map((job, index) => (
						<div key={index}>
							<div className="relative flex flex-col overflow-hidden">
								<div className="bg-white shadow shadow-gray-100 w-full flex flex-col sm:flex-row gap-3 sm:items-center justify-between px-5 py-4 rounded">
									<div>
										<span className="text-brand-800 text-sm">Engineering</span>
										<h3 className="font-bold mt-px">{job.title}</h3>
										<div className="flex items-center gap-3 mt-2">
											<span className="bg-brand-100 text-brand-700 rounded-full px-3 py-1 text-sm">{job.shift_and_schedule}</span>
											<span className="text-slate-600 text-sm flex gap-1 items-center">
												<MapPinIcon className="h-4 w-4" />
												{job.location}
											</span>
											<span className="text-green-600 text-sm flex gap-1 items-center">{job.pay_range}</span>
										</div>
									</div>
									<div>
										<Link href={`/about-us/jobs/${job.slug}`} className="bg-brand text-black font-medium px-4 py-2 rounded flex gap-1 items-center">
											Apply Now <ArrowLongRightIcon className="self-center ml-3 h-4 w-4" />
										</Link>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</>
	);
}