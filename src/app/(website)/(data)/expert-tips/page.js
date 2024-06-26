import Search from "@/components/ui/Search";
import Pagination from "@/components/ui/Pagnation";
import ExpertTips from "./ExpertTips";
import Link from "next/link";
import Script from "next/script";
import getTips from "./getTips";

const ITEMS_PER_PAGE = 10;
const BASE_URL = "https://www.wadesplumbingandseptic.com";

export default async function Page({ searchParams }) {
	const searchTerm = searchParams?.search;
	const currentPage = parseInt(searchParams?.page) || 1;
	const { allPosts, pagedData, total } = await getTips({ searchTerm, page: currentPage });

	const serviceMsg = searchTerm ? `We ${allPosts.length ? "found " + allPosts.length : "couldn't find any"} expert tips matching "${searchTerm}".` : `We have ${allPosts.length} expert tips.`;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${BASE_URL}/expert-tips/`,
		},
		itemListElement: allPosts.map((post, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "BlogPosting",
				headline: post.title,
				description: post.excerpt,
				url: `${BASE_URL}/expert-tips/${post.slug}`,
				author: {
					"@type": "Person",
					name: "Byron Wade",
				},
				publisher: {
					"@type": "Organization",
					name: "Wade's Plumbing & Septic",
					logo: {
						"@type": "ImageObject",
						url: `${BASE_URL}/_next/image?url=%2FWadesLogo.webp&w=96&q=75`,
						width: 180,
						height: 60,
					},
				},
				image: post.featuredImage?.sourceurl || "",
				datePublished: post.created_at,
				dateModified: post.updated_at,
			},
		})),
	};

	return (
		<section>
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<div className="relative overflow-hidden bg-gray-50">
				<div className="px-6 py-16 sm:py-24 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<div className="flex flex-col items-start justify-center space-y-6">
							<h2 className="text-lg font-semibold leading-8 tracking-tight text-brand-500">{serviceMsg}</h2>
							<p className="!mt-0 mb-4 text-4xl tracking-tight font-extrabold text-black dark:text-white">Tips from experts</p>
							<p className="max-w-2xl text-lg leading-6 text-gray-700">
								Have a different question and can’t find the answer you’re looking for? Reach out to our support team by
								<Link href="/contact-us" className="font-semibold text-brand-700 hover:text-brand-500">
									{" "}
									sending us an email{" "}
								</Link>
								and we’ll get back to you as soon as we can.
							</p>
							<Search placeholder="Search for a tip..." search={searchParams} />
							<ExpertTips tips={pagedData} itemsPerPage={ITEMS_PER_PAGE} />
							<Pagination total={total} currentPage={currentPage} itemsPerPage={ITEMS_PER_PAGE} />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export const metadata = {
	title: "Expert Tips | Wade's Plumbing & Septic",
	description: "Looking for expert plumbing tips in the local area? Look no further than Wade's Plumbing & Septic. Our blog has everything you need to know to keep your plumbing running smoothly.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	keywords: ["Plumbing", "Tips", "Expert Advice", "Wade's Plumbing & Septic", "Construction"],
	authors: [{ name: "Byron Wade", url: "https://www.wadesplumbingandseptic.com/expert-tips/" }],
	creator: "Byron Wade",
	publisher: "Byron Wade",
	alternates: {},
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	category: "construction",
	bookmarks: ["https://www.wadesplumbingandseptic.com/expert-tips/"],
	twitter: {
		card: "summary_large_image",
		title: "Expert Tips | Wade's Plumbing & Septic",
		description: "Looking for expert plumbing tips in the local area? Look no further than Wade's Plumbing & Septic. Our blog has everything you need to know to keep your plumbing running smoothly.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/api/og?title=Expert Tips&link=www.wadesplumbingandseptic.com&description=Looking for expert plumbing tips in the local area? Look no further than Wade's Plumbing & Septic. Our blog has everything you need to know to keep your plumbing running smoothly.",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Expert Tips | Wade's Plumbing & Septic",
		description: "Looking for expert plumbing tips in the local area? Look no further than Wade's Plumbing & Septic. Our blog has everything you need to know to keep your plumbing running smoothly.",
		url: "https://www.wadesplumbingandseptic.com/expert-tips/",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Expert Tips&link=www.wadesplumbingandseptic.com&description=Looking for expert plumbing tips in the local area? Look no further than Wade's Plumbing & Septic. Our blog has everything you need to know to keep your plumbing running smoothly.",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Expert Tips&link=www.wadesplumbingandseptic.com&description=Looking for expert plumbing tips in the local area? Look no further than Wade's Plumbing & Septic. Our blog has everything you need to know to keep your plumbing running smoothly.",
				width: 1800,
				height: 1600,
				alt: "Wade's Plumbing & Septic",
			},
		],
		locale: "en-US",
		type: "article",
	},
};
