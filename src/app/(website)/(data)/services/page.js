import Search from "@/components/ui/Search";
import Pagnation from "@/components/ui/Pagnation";
import Services from "./Services";
import Link from "next/link";
import fetchData from "./getServices";
import Script from "next/script";

const ITEMS_PER_PAGE = 6;

function getServiceMessage(searchTerm, allServices) {
	if (searchTerm) {
		return allServices.length > 0 ? `We found ${allServices.length} services matching "${searchTerm}".` : `We couldn't find any services matching "${searchTerm}".`;
	}
	return `We have ${allServices.length} services.`;
}

export default async function Page({ searchParams }) {
	const { search = "", page = "1" } = searchParams || {};
	const currentPage = parseInt(page, 10) || 1;
	const { allServices, pagedData, total } = await fetchData({ searchTerm: search, page: currentPage });

	const serviceMsg = getServiceMessage(search, allServices);

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": "https://www.wadesplumbingandseptic.com/services/",
		},
		itemListElement: allServices?.map((service, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "Service",
				serviceType: service.type, // Assuming each service has a type
				name: service.name, // Assuming each service has a name
				url: `https://www.wadesplumbingandseptic.com/services/${service.slug}`, // Assuming each service has a unique slug
				description: service.description, // Assuming each service has a description
				provider: {
					"@type": "Organization",
					name: "Wade's Plumbing & Septic",
					telephone: "+1-831-225-4344",
					address: {
						"@type": "PostalAddress",
						streetAddress: "7737 hwy 9",
						addressLocality: "Ben Lomond",
						addressRegion: "CA",
						postalCode: "95005",
						addressCountry: "US",
					},
				},
			},
		})),
	};

	return (
		<>
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<section className="bg-gray-50 relative overflow-hidden">
				<div className="py-16 px-6 sm:py-24 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<div className="flex flex-col space-y-6 justify-center items-start">
							<h2 className="text-lg font-semibold leading-8 tracking-tight text-brand-600">{serviceMsg}</h2>
							<p className="!mt-0 mb-4 text-4xl tracking-tight font-extrabold text-black dark:text-white">Search for any service</p>
							<p className="max-w-2xl text-lg leading-6 text-gray-600">
								Have a different question and can’t find the answer you’re looking for? Reach out to our support team by
								<Link href="/contact-us" className="font-semibold text-brand-600 hover:text-brand-500">
									{` sending us an email `}
								</Link>
								and we’ll get back to you as soon as we can.
							</p>
							<Search placeholder="Search for a service..." search={searchParams} />
							<Services services={pagedData} itemsPerPage={ITEMS_PER_PAGE} />
							<Pagnation total={total} currentPage={currentPage} itemsPerPage={ITEMS_PER_PAGE} />
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

export const metadata = {
	title: "Our Services | 24/7 Emergency Plumbing & Septic | Wade's Plumbing & Septic",
	description: "Explore our wide range of plumbing and septic services available 24/7 in Santa Cruz, Monterey, and Santa Clara Counties. From routine maintenance to emergency repairs, we've got you covered.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	keywords: ["Plumbing Services", "Septic Services", "Emergency Plumbing", "Ben Lomond", "Monterey", "Santa Clara"],
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
	bookmarks: ["https://www.wadesplumbingandseptic.com/services/"],
	twitter: {
		card: "summary_large_image",
		title: "Our Services | 24/7 Emergency Plumbing & Septic | Wade's Plumbing & Septic",
		description: "Discover the comprehensive plumbing and septic services we offer 24/7 in Santa Cruz, Monterey, and Santa Clara Counties. Your local, reliable plumbing solution.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Where%20quality%20meets%20community",
			alt: "Wade's Plumbing & Septic Services",
		},
	},
	openGraph: {
		title: "Our Services | 24/7 Emergency Plumbing & Septic | Wade's Plumbing & Septic",
		description: "Explore our wide range of plumbing and septic services available 24/7 in Santa Cruz, Monterey, and Santa Clara Counties. From routine maintenance to emergency repairs, we've got you covered.",
		url: "https://www.wadesplumbingandseptic.com/services/",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Where%20quality%20meets%20community",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&description=Where%20quality%20meets%20community",
				width: 1800,
				height: 1600,
				alt: "Wade's Plumbing & Septic Services",
			},
		],
		locale: "en-US",
		type: "website",
	},
};