import JobForm from "@/components/forms/JobForm";
import { fetchJobDetails } from "@/actions/getJobs";
import Script from "next/script";

export async function generateMetadata(props, parent) {
	const params = await props.params;
	const slug = params.slug;
	const jobDetails = await fetchJobDetails({ slug });
	const previousImages = (await parent).openGraph?.images || [];
	const formattedTitle = `${jobDetails?.title || "Job Listing"} | Wade's Plumbing & Septic`;
	const formattedDescription = jobDetails?.job_type || "Explore job opportunities at Wade's Plumbing & Septic";
	const apiOGUrl = `https://www.wadesplumbingandseptic.com/api/og?title=${encodeURIComponent(formattedTitle)}&link=${encodeURIComponent(`https://www.wadesplumbingandseptic.com/jobs/${jobDetails?.slug || slug}`)}&description=${encodeURIComponent(formattedDescription)}`;

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
		bookmarks: [`https://www.wadesplumbingandseptic.com/jobs/${jobDetails?.slug}`],
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
			url: `https://www.wadesplumbingandseptic.com/jobs/${jobDetails?.slug}`,
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
	const params = await props.params;
	const slug = params.slug;
	const jobDetails = await fetchJobDetails({ slug });
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "JobPosting",
		title: jobDetails?.title,
		description: jobDetails?.content,
		identifier: {
			"@type": "PropertyValue",
			name: "Wade's Plumbing & Septic",
			value: jobDetails?.id,
		},
		datePosted: jobDetails?.created_at,
		employmentType: jobDetails?.job_type,
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
				addressLocality: jobDetails?.location,
				addressRegion: "CA",
				addressCountry: "US",
			},
		},
		baseSalary: {
			"@type": "MonetaryAmount",
			currency: "USD",
			value: {
				"@type": "QuantitativeValue",
				minValue: jobDetails?.pay_range?.min,
				maxValue: jobDetails?.pay_range?.max,
				unitText: "HOUR",
			},
		},
	};
	return (
		<>
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<h1>{jobDetails?.title}</h1>
			<ul>
				<li>Job Type: {jobDetails?.job_type}</li>
				<li>Location: {jobDetails?.location}</li>
				<li>Pay Range: {jobDetails?.pay_range}</li>
				<li>Qualifications: {jobDetails?.qualifications}</li>
				<li>Shift and Schedule: {jobDetails?.shift_and_schedule}</li>
			</ul>
			<div dangerouslySetInnerHTML={{ __html: jobDetails?.content || "<p>no data</p>" }} />
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

