import Link from "next/link";
import { ArrowLongRightIcon, MapPinIcon } from "@heroicons/react/20/solid";
import { Fragment, Suspense } from "react";


export const metadata = {
	title: "Job Opportunities | Wade's Plumbing & Septic",
	description: "Looking for plumbing job opportunities in your local area? Look no further than Wade's Plumbing & Septic. Our team is hiring skilled plumbers now.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	referrer: "origin-when-cross-origin",
	keywords: ["Next.js", "React", "JavaScript"],
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
		title: "Job Opportunities | Wade's Plumbing & Septic",
		description: "Looking for plumbing job opportunities in your local area? Look no further than Wade's Plumbing & Septic. Our team is hiring skilled plumbers now.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/api/og?title=Job Opportunities&link=www.wadesplumbingandseptic.com&description=Looking for plumbing job opportunities in your local area? Look no further than Wade's Plumbing & Septic. Our team is hiring skilled plumbers now.",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Job Opportunities | Wade's Plumbing & Septic",
		description: "Looking for plumbing job opportunities in your local area? Look no further than Wade's Plumbing & Septic. Our team is hiring skilled plumbers now.",
		url: "https://www.wadesplumbingandseptic.com/about-us/jobs/",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Job Opportunities&link=www.wadesplumbingandseptic.com&description=Looking for plumbing job opportunities in your local area? Look no further than Wade's Plumbing & Septic. Our team is hiring skilled plumbers now.",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Job Opportunities&link=www.wadesplumbingandseptic.com&description=Looking for plumbing job opportunities in your local area? Look no further than Wade's Plumbing & Septic. Our team is hiring skilled plumbers now.",
				width: 1800,
				height: 1600,
				alt: "Wade's Plumbing & Septic",
			},
		],
		locale: "en-US",
		type: "website",
	},
};

async function getJobs() {
	const { data } = await fetch("https://wadesplumbingandseptic.byronw35.sg-host.com/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `
			query NewQuery {
				categories(where: { slug: "jobs" }) {
					nodes {
						children {
							nodes {
								jobs {
									nodes {
										title(format: RENDERED)
										uri
										JobsData {
											jobType
											location
											payRange
											shiftAndSchedule
										}
									}
								}
								name
							}
						}
						name
					}
				}
			}
	  `,
		}),
		next: { revalidate: 10 },
	}).then((res) => res.json());
	return { data };
}

export default async function Jobs() {
	const { data } = await getJobs();

	const {
		categories: { nodes },
	} = data;

	console.log(nodes);

	return (
		<section className="mx-auto max-w-7xl py-16 px-6 sm:py-24 lg:px-8">
			<div className="space-y-6 relative flex flex-col overflow-hidden">
			<Suspense fallback={<p>Loading feed...</p>}>
				{nodes?.map((category) =>
					category?.children?.nodes?.map((child) => (
						child?.jobs?.nodes?.map((job, index) => (
							<Fragment key={child.id}>
							<h2 className="text-lg font-bold leading-6 text-black">{child.name}</h2>
							<div key={index} className="relative flex flex-col overflow-hidden">
								<div className="bg-white shadow shadow-gray-100 w-full flex flex-col sm:flex-row gap-3 sm:items-center justify-between px-5 py-4 rounded">
									<div>
										<span className="text-brand-800 text-sm">Engineering</span>
										<h3 className="font-bold mt-px">{job.title}</h3>
										<div className="flex items-center gap-3 mt-2">
											<span className="bg-brand-100 text-brand-700 rounded-full px-3 py-1 text-sm">{job.JobsData.shiftAndSchedule}</span>
											<span className="text-slate-600 text-sm flex gap-1 items-center">
												<MapPinIcon className="h-4 w-4" />
												{job.JobsData.location}
											</span>
											<span className="text-green-600 text-sm flex gap-1 items-center">{job.JobsData.payRange}</span>
										</div>
									</div>
									<div>
										<Link href={`/about-us/${job.uri}`} className="bg-brand text-black font-medium px-4 py-2 rounded flex gap-1 items-center">
											Apply Now <ArrowLongRightIcon className="self-center ml-3 h-4 w-4" />
										</Link>
									</div>
								</div>
							</div>
							</Fragment>
						))
					))
				)}
				</Suspense>
			</div>
		</section>
	);
}
