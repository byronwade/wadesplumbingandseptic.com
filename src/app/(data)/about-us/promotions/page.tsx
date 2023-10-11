/* eslint-disable react/jsx-no-undef */
import Image from "next/image";

export const metadata = {
	title: "Promotions | Wade's Plumbing & Septic",
	description: "Looking for quality plumbing services in your local area? Check out Wade's Plumbing & Septic promotions page for exclusive deals and discounts!",
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
	bookmarks: ["https://www.wadesplumbingandseptic.com/about-us/promotions/"],
	twitter: {
		card: "summary_large_image",
		title: "Promotions | Wade's Plumbing & Septic",
		description: "Looking for quality plumbing services in your local area? Check out Wade's Plumbing & Septic promotions page for exclusive deals and discounts!",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/api/og?title=Promotions&link=www.wadesplumbingandseptic.com&description=Looking for quality plumbing services in your local area? Check out Wade's Plumbing & Septic promotions page for exclusive deals and discounts!",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Promotions | Wade's Plumbing & Septic",
		description: "Looking for quality plumbing services in your local area? Check out Wade's Plumbing & Septic promotions page for exclusive deals and discounts!",
		url: "https://www.wadesplumbingandseptic.com/about-us/promotions/",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Promotions&link=www.wadesplumbingandseptic.com&description=Looking for quality plumbing services in your local area? Check out Wade's Plumbing & Septic promotions page for exclusive deals and discounts!",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Promotions&link=www.wadesplumbingandseptic.com&description=Looking for quality plumbing services in your local area? Check out Wade's Plumbing & Septic promotions page for exclusive deals and discounts!",
				width: 1800,
				height: 1600,
				alt: "Wade's Plumbing & Septic",
			},
		],
		locale: "en-US",
		type: "website",
	},
};

async function getPromotions() {
	const { data } = await fetch("https://wadesplumbingandseptic.byronw35.sg-host.com/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `
			query NewQuery {
				promotions {
					nodes {
						title(format: RENDERED)
						content(format: RENDERED)
						promotionData {
							expiration
						}
					}
				}
			}
	  `,
		}),
		next: { revalidate: 10 },
	}).then((res) => res.json());
	return { data };
}

export default async function Discounts() {
	const { data } = await getPromotions();
	const { nodes: promotions } = data?.promotions;
	return (
		<section className="mx-auto max-w-7xl py-16 px-6 sm:py-24 lg:px-8">
			<h2 className="text-lg font-semibold leading-8 tracking-tight text-brand-600">Discounts</h2>
			<p className="mb-6 text-4xl tracking-tight font-extrabold text-black dark:text-white">Promotions for our company</p>
			<div className="flex flex-col overflow-hidden">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-x-8">
					{promotions?.length > 0 ? (
						promotions?.map((promotion, index) => {
							const expirationDate = promotion?.promotionData?.expiration;
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
										<p className="mt-2 text-red font-bold">{promotion.promotionData.expiration === null ? "This item does not expire" : differenceInDays <= 7 ? `Expiring soon on: ${promotion.promotionData.expiration}` : `Expires: ${promotion.promotionData.expiration}`}</p>
									</div>
								</div>
							);
						})
					) : (
						<p>There are currently no promotions.</p>
					)}
				</div>
			</div>
		</section>
	);
}
