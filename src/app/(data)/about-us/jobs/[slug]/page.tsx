import JobForm from "@/components/forms/JobForm";
import { Metadata } from "next";

async function getJob(slug) {
	const { data } = await fetch("https://wadesplumbingandseptic.byronw35.sg-host.com/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `
			query NewQuery {
				job(id: ${slug}, idType: SLUG) {
					title(format: RENDERED)
					uri
					JobsData {
						benefits {
							name
						}
						jobType
						location
						payRange
						qualifications
						shiftAndSchedule
					}
					seo {
						canonical
						cornerstone
						focuskw
						fullHead
						metaKeywords
						metaDesc
						metaRobotsNofollow
						metaRobotsNoindex
						opengraphAuthor
						opengraphDescription
						opengraphModifiedTime
						opengraphPublishedTime
						opengraphPublisher
						opengraphSiteName
						opengraphTitle
						opengraphType
						opengraphUrl
						title
						schema {
						  articleType
						  pageType
						  raw
						}
						twitterDescription
						twitterTitle
					  }
					content(format: RENDERED)
				}
			}
	  `,
		}),
		next: { revalidate: 10 },
	}).then((res) => res.json());
	return { data };
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { data } = await getJob(`"/${params.slug}"`);
	const seo = data?.job?.seo;
	console.log(seo);
	return {
		title: data?.job?.title || "This is a title to the service",
		description: seo?.metaDesc || seo?.opengraphDescription || "This is a Service from Wade's Plumbing & Septic",
		generator: "Next.js",
		applicationName: "Wade's Plumbing & Septic",
		referrer: "origin-when-cross-origin",
		keywords: seo?.metaKeywords,
		authors: [{ name: "Byron Wade" }, { name: "Byron Wade", url: `https://www.wadesplumbingandseptic.com/expert-tips/${params.slug}` }],
		creator: "Byron Wade",
		publisher: "Byron Wade",
		alternates: {},
		formatDetection: {
			email: false,
			address: false,
			telephone: false,
		},
		category: "construction",
		bookmarks: [`https://www.wadesplumbingandseptic.com/expert-tips/${params.slug}`],
		twitter: {
			card: "summary_large_image",
			title: seo?.twitterTitle || seo?.title || data?.job?.title,
			description: seo?.twitterDescription || seo?.metaDesc || seo?.opengraphDescription,
			creator: "@wadesplumbing",
			images: [`https://www.wadesplumbingandseptic.com/api/og?title=${data?.job?.title}&discription=${seo?.metaDesc.slice(0, 200) || seo?.opengraphDescription.slice(0, 200) || "This is a Service from Wade's Plumbing & Septic"}`],
		},
		openGraph: {
			title: seo?.opengraphTitle || seo?.title,
			description: seo?.opengraphDescription || seo?.metaDesc,
			url: `https://www.wadesplumbingandseptic.com/expert-tips/${params.slug}`,
			siteName: seo?.opengraphTitle || seo?.title,
			images: [
				{
					url: `https://www.wadesplumbingandseptic.com/api/og?title=${data?.job?.title}&discription=${seo?.metaDesc.slice(0, 200) || seo?.opengraphDescription.slice(0, 200) || "This is a Service from Wade's Plumbing & Septic"}}`,
					width: 800,
					height: 600,
				},
				{
					url: `https://www.wadesplumbingandseptic.com/api/og?title=${data?.job?.title}&discription=${seo?.metaDesc.slice(0, 200) || seo?.opengraphDescription.slice(0, 200) || "This is a Service from Wade's Plumbing & Septic"}}`,
					width: 1800,
					height: 1600,
					alt: "My custom alt",
				},
			],
			locale: "en-US",
			type: "website",
		},
	};
}

export default async function Job({ params }) {
	const { data } = await getJob(`"${params.slug}"`);

	console.log(data);

	return (
		<>
			<h1>{data?.job?.title}</h1>

			<ul>
				<li>Job Type: {data?.job?.JobsData?.jobType}</li>
				<li>Location: {data?.job?.JobsData?.location}</li>
				<li>Pay Range: {data?.job?.JobsData?.payRange}</li>
				<li>Qualifications: {data?.job?.JobsData?.qualifications}</li>
				<li>Shift and Schedule: {data?.job?.JobsData?.shiftAndSchedule}</li>
				<li>
					Benefits:
					<ul>
						{data?.job?.JobsData?.benefits?.map((benefit, index) => (
							<li key={index}>{benefit.name}</li>
						))}
					</ul>
				</li>
			</ul>
			<div dangerouslySetInnerHTML={{ __html: data?.job?.content }} />

			<div className="!mt-16">
				<h1 className="font-extrabold text-black sm:text-3xl lg:text-4xl mb-4">Apply with this form</h1>
				<JobForm />
			</div>
		</>
	);
}
