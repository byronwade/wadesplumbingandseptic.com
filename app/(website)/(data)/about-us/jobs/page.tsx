import Link from "next/link";
import { ArrowRight, MapPin } from "react-feather";
import { getJobs } from "@/actions/getJobs";
import Script from "next/script";

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

export default async function Jobs() {
	const { allJobs, jobDetails } = await getJobs();
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		itemListElement: allJobs?.map((job, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "JobPosting",
				title: job.title,
				description: job.content, // Assuming each job has a description
				identifier: {
					"@type": "PropertyValue",
					name: "Wade's Plumbing & Septic",
					value: job.id, // Assuming each job has a unique ID
				},
				jobLocation: {
					"@type": "Place",
					address: {
						"@type": "PostalAddress",
						streetAddress: "7737 hwy 9",
						addressLocality: "Ben Lomond",
						addressRegion: "CA",
						postalCode: "95005",
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
				datePosted: "2023-10-14", // This should be the actual posting date of each job
				url: `https://www.wadesplumbingandseptic.com/about-us/jobs/${job.slug}`, // Assuming each job has a unique slug
			},
		})),
	};
	return (
		<>
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<section className="px-6 py-16 mx-auto max-w-7xl sm:py-24 lg:px-8">
				<div className="relative flex flex-col space-y-6 overflow-hidden">
					{(allJobs?.length ?? 0) > 0 ? (
						allJobs?.map((job, index) => {
							return (
								<div key={index}>
									<div className="relative flex flex-col overflow-hidden">
										<div className="flex flex-col justify-between w-full gap-3 px-5 py-4 bg-white rounded shadow shadow-gray-100 sm:flex-row sm:items-center">
											<div>
												<span className="text-sm text-brand-800">Engineering</span>
												<h3 className="mt-px font-bold">{job.title}</h3>
												<div className="flex items-center gap-3 mt-2">
													<span className="px-3 py-1 text-sm text-black rounded-full bg-brand-100">{job.shift_and_schedule}</span>
													<span className="flex items-center gap-1 text-sm text-slate-600">
														<MapPin className="w-4 h-4" />
														{job.location}
													</span>
													<span className="flex items-center gap-1 text-sm text-green-600">{job.pay_range}</span>
												</div>
											</div>
											<div>
												<Link href={`/about-us/jobs/${job.slug}`} className="flex items-center gap-1 px-4 py-2 font-medium text-black rounded bg-brand">
													Apply Now <ArrowRight className="self-center w-4 h-4 ml-3" />
												</Link>
											</div>
										</div>
									</div>
								</div>
							);
						})
					) : (
						<div>No jobs currently available</div>
					)}
				</div>
			</section>
		</>
	);
}