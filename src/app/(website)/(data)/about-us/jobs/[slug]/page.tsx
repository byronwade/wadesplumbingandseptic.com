import JobForm from "@/components/forms/JobForm";
import { Metadata } from "next";
import fetchData from "../getJobs";

export default async function Job({ params }) {
	const slug = params.slug;
	const { jobDetails } = await fetchData({ slug });
	console.log(jobDetails);
	return (
		<>
			<h1>{jobDetails?.title}</h1>

			<ul>
				<li>Job Type: {jobDetails?.job_type}</li>
				<li>Location: {jobDetails?.location}</li>
				<li>Pay Range: {jobDetails?.pay_range}</li>
				<li>Qualifications: {jobDetails?.qualifications}</li>
				<li>Shift and Schedule: {jobDetails?.shift_and_schedule}</li>
				{/* <li>
					Benefits:
					<ul>
						{jobDetails?.benefits?.map((benefit, index) => (
							<li key={index}>{benefit.name}</li>
						))}
					</ul>
				</li> */}
			</ul>
			<div dangerouslySetInnerHTML={{ __html: jobDetails?.content || "<p>no data</p>" }} />

			<div className="!mt-16">
				<h1 className="font-extrabold text-black sm:text-3xl lg:text-4xl mb-4">Apply with this form</h1>
				<JobForm />
			</div>
		</>
	);
}

// export async function generateMetadata({ params }): Promise<Metadata> {
// 	const { data } = await getJob(`"/${params.slug}"`);
// 	const seo = data?.job?.seo;
// 	console.log(seo);
// 	return {
// 		title: data?.job?.title || "This is a title to the service",
// 		description: seo?.metaDesc || seo?.opengraphDescription || "This is a Service from Wade's Plumbing & Septic",
// 		generator: "Next.js",
// 		applicationName: "Wade's Plumbing & Septic",
// 		referrer: "origin-when-cross-origin",
// 		keywords: seo?.metaKeywords,
// 		authors: [{ name: "Byron Wade" }, { name: "Byron Wade", url: `https://www.wadesplumbingandseptic.com/expert-tips/${params.slug}` }],
// 		creator: "Byron Wade",
// 		publisher: "Byron Wade",
// 		alternates: {},
// 		formatDetection: {
// 			email: false,
// 			address: false,
// 			telephone: false,
// 		},
// 		category: "construction",
// 		bookmarks: [`https://www.wadesplumbingandseptic.com/expert-tips/${params.slug}`],
// 		twitter: {
// 			card: "summary_large_image",
// 			title: seo?.twitterTitle || seo?.title || data?.job?.title,
// 			description: seo?.twitterDescription || seo?.metaDesc || seo?.opengraphDescription,
// 			creator: "@wadesplumbing",
// 			images: [`https://www.wadesplumbingandseptic.com/api/og?title=${data?.job?.title}&discription=${seo?.metaDesc.slice(0, 200) || seo?.opengraphDescription.slice(0, 200) || "This is a Service from Wade's Plumbing & Septic"}`],
// 		},
// 		openGraph: {
// 			title: seo?.opengraphTitle || seo?.title,
// 			description: seo?.opengraphDescription || seo?.metaDesc,
// 			url: `https://www.wadesplumbingandseptic.com/expert-tips/${params.slug}`,
// 			siteName: seo?.opengraphTitle || seo?.title,
// 			images: [
// 				{
// 					url: `https://www.wadesplumbingandseptic.com/api/og?title=${data?.job?.title}&discription=${seo?.metaDesc.slice(0, 200) || seo?.opengraphDescription.slice(0, 200) || "This is a Service from Wade's Plumbing & Septic"}}`,
// 					width: 800,
// 					height: 600,
// 				},
// 				{
// 					url: `https://www.wadesplumbingandseptic.com/api/og?title=${data?.job?.title}&discription=${seo?.metaDesc.slice(0, 200) || seo?.opengraphDescription.slice(0, 200) || "This is a Service from Wade's Plumbing & Septic"}}`,
// 					width: 1800,
// 					height: 1600,
// 					alt: "My custom alt",
// 				},
// 			],
// 			locale: "en-US",
// 			type: "website",
// 		},
// 	};
// }
