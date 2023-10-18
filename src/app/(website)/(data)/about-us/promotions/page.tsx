import Image from "next/image";
import fetchData from "./getPromotions";
import Script from "next/script";

export const metadata = {
	title: "Current Promotions & Discounts | Wade's Plumbing & Septic",
	description: "Discover the latest promotions and discounts offered by Wade's Plumbing & Septic. Save on your next plumbing project with our exclusive deals.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	keywords: ["Plumbing Promotions", "Plumbing Discounts", "Special Offers", "Wade's Plumbing & Septic"],
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
	bookmarks: ["https://www.wadesplumbingandseptic.com/about-us/promotions/"],
	twitter: {
		card: "summary_large_image",
		title: "Current Promotions & Discounts | Wade's Plumbing & Septic",
		description: "Discover the latest promotions and discounts offered by Wade's Plumbing & Septic. Save on your next plumbing project with our exclusive deals.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/api/og?title=Promotions&link=www.wadesplumbingandseptic.com&description=Discover the latest promotions and discounts offered by Wade's Plumbing & Septic. Save on your next plumbing project with our exclusive deals.",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Current Promotions & Discounts | Wade's Plumbing & Septic",
		description: "Discover the latest promotions and discounts offered by Wade's Plumbing & Septic. Save on your next plumbing project with our exclusive deals.",
		url: "https://www.wadesplumbingandseptic.com/about-us/promotions/",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Promotions&link=www.wadesplumbingandseptic.com&description=Discover the latest promotions and discounts offered by Wade's Plumbing & Septic. Save on your next plumbing project with our exclusive deals.",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Promotions&link=www.wadesplumbingandseptic.com&description=Discover the latest promotions and discounts offered by Wade's Plumbing & Septic. Save on your next plumbing project with our exclusive deals.",
				width: 1800,
				height: 1600,
				alt: "Wade's Plumbing & Septic",
			},
		],
		locale: "en-US",
		type: "website",
	},
};

export default async function Discounts() {
	const { promotions } = await fetchData();
	console.log(promotions);

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Wade's Plumbing & Septic",
		url: "https://www.wadesplumbingandseptic.com",
		offers: {
			"@type": "OfferCatalog",
			name: "Current Promotions & Discounts",
			url: "https://www.wadesplumbingandseptic.com/about-us/promotions/",
			description: "Discover the latest promotions and discounts offered by Wade's Plumbing & Septic. Save on your next plumbing project with our exclusive deals.",
			itemListElement: promotions?.map((promotion, index) => ({
				"@type": "Offer",
				url: `https://www.wadesplumbingandseptic.com/about-us/promotions/#offer-${index + 1}`,
				name: promotion.title,
				description: promotion.content,
				price: "Contact for Price",
				validThrough: promotion.expiration,
			})),
		},
	};

	return (
		<>
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<section className="mx-auto max-w-7xl py-16 px-6 sm:py-24 lg:px-8">
				<h2 className="text-lg font-semibold leading-8 tracking-tight text-brand-600">Discounts</h2>
				<p className="mb-6 text-4xl tracking-tight font-extrabold text-black dark:text-white">Promotions for our company</p>
				<div className="flex flex-col overflow-hidden">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-x-8">
						{(promotions?.length ?? 0) > 0 ? (
							promotions?.map((promotion, index) => {
								const expirationDate = promotion?.expiration;
								const today = new Date().getTime();
								const expiration = new Date(expirationDate).getTime();
								const differenceInTime = expiration - today;
								const differenceInDays = differenceInTime / (1000 * 3600 * 24);

								return (
									<div key={index} className="h-full space-y-4 w-full flex flex-col items-center text-center p-6 bg-white overflow-hidden rounded-xl border-4 border-dashed border-gray-500">
										<Image priority className="w-auto h-auto" src="/WadesLogo.png" width={100} height={100} alt="Wade' Plumbing & Septic Logo" />
										<div>
											<h2 className="font-extrabold text-lg">{promotion.title}</h2>
											<div dangerouslySetInnerHTML={{ __html: promotion.content }} />
										</div>
										<div>
											Contact us today at{" "}
											<a href="tel:8314306011" className="text-brand hover:underline">
												(831) 225-4344
											</a>{" "}
											or{" "}
											<a href="mailto:support@wadesinc.io" className="text-brand hover:underline">
												support@wadesinc.io
											</a>
											<p className="mt-2 text-red font-bold">{promotion.expiration === null ? "This item does not expire" : differenceInDays <= 7 ? `Expiring soon on: ${promotion.expiration}` : `Expires: ${promotion.expiration}`}</p>
										</div>
									</div>
								);
							})
						) : (
							<div>No promotions available</div>
						)}
					</div>
				</div>
			</section>
		</>
	);
}