import JobForm from "@/components/forms/JobForm";
import { getJobDetails } from "@/actions/getJobs";
import Script from "next/script";

export async function generateMetadata(props, parent) {
	const nextjs15 = await props;
	const slug = nextjs15.slug;
	const jobDetails = await getJobDetails({ slug });
	const previousImages = (await parent).openGraph?.images || [];
	const formattedTitle = `${jobDetails?.data?.title || "Job Listing"} | Wade's Plumbing & Septic`;
	const formattedDescription = jobDetails?.data?.job_type || "Explore job opportunities at Wade's Plumbing & Septic";
	const apiOGUrl = `https://www.wadesplumbingandseptic.com/api/og?title=${encodeURIComponent(formattedTitle)}&link=${encodeURIComponent(`https://www.wadesplumbingandseptic.com/jobs/${jobDetails?.data?.slug || slug}`)}&description=${encodeURIComponent(formattedDescription)}`;

	return {
		title: formattedTitle,
		description: formattedDescription,
		generator: "Next.js",
		applicationName: "Wade's Plumbing & Septic",
		keywords: "plumbing, septic, job listing, careers",
		authors: [{ name: "Byron Wade", url: "https://www.wadesplumbingandseptic.com/" }],
		creator: "Byron Wade",
		publisher: "Byron Wade",
		alternates: {},
		formatDetection: {
			email: false,
			address: false,
			telephone: false,
		},
		category: "construction",
		bookmarks: [`https://www.wadesplumbingandseptic.com/jobs/${jobDetails?.data?.slug}`],
		twitter: {
			card: "summary_large_image",
			title: formattedTitle,
			description: formattedDescription,
			creator: "@wadesplumbing",
			images: {
				url: apiOGUrl,
				alt: "Job Listing Image",
			},
		},
		openGraph: {
			title: formattedTitle,
			description: formattedDescription,
			url: `https://www.wadesplumbingandseptic.com/jobs/${jobDetails?.data?.slug}`,
			siteName: "Wade's Plumbing & Septic",
			images: [
				{
					url: apiOGUrl,
					width: 800,
					height: 600,
					alt: "Job Listing Image",
				},
				...previousImages,
			],
			locale: "en-US",
			type: "website",
		},
	};
}

export default async function Job(props) {
	const nextjs15 = await props;
	const slug = nextjs15.slug;
	const jobDetails = await getJobDetails({ slug });
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "JobPosting",
		title: jobDetails?.data?.title,
		description: jobDetails?.data?.content,
		identifier: {
			"@type": "PropertyValue",
			name: "Wade's Plumbing & Septic",
			value: jobDetails?.data?.id,
		},
		datePosted: jobDetails?.data?.created_at,
		employmentType: jobDetails?.data?.job_type,
		hiringOrganization: {
			"@type": "Organization",
			name: "Wade's Plumbing & Septic",
			sameAs: "https://www.wadesplumbingandseptic.com",
			logo: "https://www.wadesplumbingandseptic.com/_next/image?url=%2FWadesLogo.webp&w=96&q=75",
		},
		jobLocation: {
			"@type": "Place",
			address: {
				"@type": "PostalAddress",
				postalCode: "95005",
				streetAddress: "7737 hwy 9",
				addressLocality: jobDetails?.data?.location,
				addressRegion: "CA",
				addressCountry: "US",
			},
		},
		baseSalary: {
			"@type": "MonetaryAmount",
			currency: "USD",
			value: {
				"@type": "QuantitativeValue",
				minValue: jobDetails?.data?.pay_range?.min,
				maxValue: jobDetails?.data?.pay_range?.max,
				unitText: "HOUR",
			},
		},
	};
	return (
		<>
			<Script async strategy="worker" data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<h1>{jobDetails?.data?.title}</h1>
			<ul>
				<li>Job Type: {jobDetails?.data?.job_type}</li>
				<li>Location: {jobDetails?.data?.location}</li>
				<li>Pay Range: {jobDetails?.data?.pay_range}</li>
				<li>Qualifications: {jobDetails?.data?.qualifications}</li>
				<li>Shift and Schedule: {jobDetails?.data?.shift_and_schedule}</li>
			</ul>
			<div dangerouslySetInnerHTML={{ __html: jobDetails?.data?.content || "<p>no data</p>" }} />
			<div className="!mt-16">
				<h1 className="mb-4 font-extrabold text-black sm:text-3xl lg:text-4xl">Apply with this form</h1>
				<JobForm />
			</div>
		</>
	);
}
function fetchData(arg0: { slug: any }): { jobDetails: any } | PromiseLike<{ jobDetails: any }> {
	throw new Error("Function not implemented.");
}

