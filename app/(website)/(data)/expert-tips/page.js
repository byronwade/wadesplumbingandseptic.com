import Search from "@/components/ui/Search";
import Pagination from "@/components/ui/Pagnation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { ArrowRight } from "react-feather";
import { getTips } from "./getTips";

const ITEMS_PER_PAGE = 10;
const BASE_URL = "https://www.wadesplumbingandseptic.com";

export default async function Page({ searchParams }) {
	const searchTerm = (await searchParams)?.search ?? "";
	const currentPage = parseInt((await searchParams)?.page) || 1;
	const { tips, total } = await getTips({ searchTerm, page: currentPage });

	const serviceMsg = searchTerm ? `We ${tips.length ? "found " + tips.length : "couldn't find any"} expert tips matching "${searchTerm}".` : `We have ${total} expert tips.`;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${BASE_URL}/expert-tips/`,
		},
		itemListElement: tips.map((post, index) => ({
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
				dateModified: post.created_at,
			},
		})),
	};

	return (
		<section>
			<Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="relative overflow-hidden bg-gray-50">
				<div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="max-w-2xl mx-auto text-center">
						<h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Expert Tips</h2>
						<p className="max-w-2xl mt-3 text-xl text-gray-500 sm:mt-4">{serviceMsg}</p>
						<Search placeholder="Search for a tip..." />
					</div>
					<div className="grid items-stretch w-full grid-cols-1 gap-6 mt-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto">
						{tips.length > 0 ? (
							tips.slice(0, ITEMS_PER_PAGE).map((tip, index) => (
								<Link href={`/expert-tips/${tip.slug}`} key={tip.id} className={`max-h-90 w-full relative group ${index % 7 === 0 ? "col-span-1 row-span-1 xl:col-span-2 xl:row-span-2" : "max-h-45 row-span-1"}`}>
									<div className="z-20">
										<p className="absolute top-0 right-0 z-20 p-6 text-xs font-medium leading-3 text-white">12 April 2021</p>
										<div className="absolute bottom-0 left-0 z-20 p-6">
											<h2 className="text-xl font-semibold text-white">{tip.title}</h2>
											<span className="flex items-center mt-4 text-white cursor-pointer group-hover:underline focus:outline-none focus:underline hover:text-gray-200 hover:underline">
												Read in {tip.readingtime} min <ArrowRight className="self-center inline-block w-4 h-4 ml-3" />
											</span>
										</div>
									</div>
									<Image placeholder="blur" blurDataURL={tip?.featuredImage?.sourceurl || "/placeholder.webp"} width={500} height={500} src={tip?.featuredImage?.sourceurl || "/placeholder.webp"} className="z-10 object-cover object-center w-full h-full rounded brightness-75" alt={tip?.featuredImage?.alttext || "placeholder text"} />
								</Link>
							))
						) : (
							<div className="py-10 text-center col-span-full">No data</div>
						)}
					</div>
					<Pagination total={total} currentPage={currentPage} itemsPerPage={ITEMS_PER_PAGE} />
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
