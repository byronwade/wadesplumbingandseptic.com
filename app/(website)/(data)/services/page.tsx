import Search from "@/components/ui/Search";
import Pagination from "@/components/ui/Pagnation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { ArrowRight } from "react-feather";
import { getServices } from "@/actions/getServices";

const ITEMS_PER_PAGE = 6;
const BASE_URL = "https://www.wadesplumbingandseptic.com";

export default async function Page({ searchParams }) {
	const searchTerm = (await searchParams)?.search ?? "";
	const currentPage = parseInt((await searchParams)?.page) || 1;
	const { services = [], total = 0 } = await getServices({ searchTerm, page: currentPage });

	const serviceMsg = searchTerm ? (services.length > 0 ? `We found ${services.length} services matching "${searchTerm}".` : `We couldn't find any services matching "${searchTerm}".`) : `We have ${services.length} services.`;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${BASE_URL}/services/`,
		},
		itemListElement: services.map((service, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "Service",
				serviceType: service.categories.join(", "),
				name: service.title,
				url: `${BASE_URL}/services/${service.slug}`,
				description: service.excerpt,
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
		<section>
			<Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="relative overflow-hidden bg-gray-50">
				<div className="px-6 py-16 sm:py-24 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<div className="flex flex-col items-start justify-center space-y-6">
							<h2 className="text-lg font-semibold leading-8 tracking-tight text-brand-500">{serviceMsg}</h2>
							<p className="!mt-0 mb-4 text-4xl tracking-tight font-extrabold text-black dark:text-white">Our Services</p>
							<p className="max-w-2xl text-lg leading-6 text-gray-700">
								Have a different question and can&apos;t find the answer you&apos;re looking for? Reach out to our support team by
								<Link href="/contact-us" className="font-semibold text-brand-700 hover:text-brand-500">
									{" "}
									sending us an email{" "}
								</Link>
								and we&apos;ll get back to you as soon as we can.
							</p>
							<Search placeholder="Search for a service..." />
							<div className="flex items-center justify-center w-full mt-10">
								<div className="container grid max-w-screen-xl gap-8 lg:grid-cols-2">
									{services && services.length > 0 ? (
										services.slice(0, ITEMS_PER_PAGE).map((service) => (
											<Link href={`/services/${service.slug}`} key={service.id} className={`max-h-min relative group flex flex-col rounded border border-slate-200 bg-white`}>
												<div className="relative h-96">
													<Image placeholder="blur" blurDataURL={service?.featuredImage?.sourceurl || "/placeholder.webp"} fill sizes={service?.featuredImage?.sizes} src={service?.featuredImage?.sourceurl || "/placeholder.webp"} className="object-cover object-center w-full rounded-t" alt={service?.featuredImage?.alttext || "placeholder text"} />
												</div>
												<div className="p-10">
													<h3 className="text-xl font-medium text-gray-700">{service.title}</h3>
													<div className="mt-2 text-slate-500" dangerouslySetInnerHTML={{ __html: service.excerpt }} />
													<span className="inline-flex mt-2 group-hover:underline text-sky-500">
														Read in {service.readingtime} min <ArrowRight className="self-center inline-block w-4 h-4 ml-3" />
													</span>
												</div>
											</Link>
										))
									) : (
										<div className="py-10 text-center col-span-full">No data</div>
									)}
								</div>
							</div>
							<Pagination total={total} itemsPerPage={ITEMS_PER_PAGE} />
						</div>
					</div>
				</div>
			</div>
		</section>
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
