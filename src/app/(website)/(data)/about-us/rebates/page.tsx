import Script from "next/script";

export const metadata = {
	title: "Plumbing Rebates and Savings | Wade's Plumbing & Septic",
	description: "Discover local plumbing rebates with Wade's Plumbing & Septic. Explore savings and incentives for your next plumbing project. Your path to economical plumbing upgrades starts here.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	keywords: ["Plumbing Rebates", "Water-Saving Rebates", "Efficient Plumbing", "Wade's Plumbing & Septic", "Rebate Programs"],
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
	bookmarks: ["https://www.wadesplumbingandseptic.com/about-us/rebates/"],
	twitter: {
		card: "summary_large_image",
		title: "Plumbing Rebates and Savings | Wade's Plumbing & Septic",
		description: "Discover local plumbing rebates and start saving on your plumbing upgrades with Wade's Plumbing & Septic. Find incentives for water-efficient fixtures and more.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/api/og?title=Rebates&link=www.wadesplumbingandseptic.com&description=Discover local plumbing rebates and start saving on your plumbing upgrades with Wade's Plumbing & Septic. Find incentives for water-efficient fixtures and more.",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Plumbing Rebates and Savings | Wade's Plumbing & Septic",
		description: "Discover local plumbing rebates and start saving on your plumbing upgrades with Wade's Plumbing & Septic. Find incentives for water-efficient fixtures and more.",
		url: "https://www.wadesplumbingandseptic.com/about-us/rebates/",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Rebates&link=www.wadesplumbingandseptic.com&description=Discover local plumbing rebates and start saving on your plumbing upgrades with Wade's Plumbing & Septic. Find incentives for water-efficient fixtures and more.",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Rebates&link=www.wadesplumbingandseptic.com&description=Discover local plumbing rebates and start saving on your plumbing upgrades with Wade's Plumbing & Septic. Find incentives for water-efficient fixtures and more.",
				width: 1800,
				height: 1600,
				alt: "Wade's Plumbing & Septic",
			},
		],
		locale: "en-US",
		type: "website",
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "WebPage",
	url: "https://www.wadesplumbingandseptic.com/about-us/rebates/",
	name: "Plumbing Rebates and Savings",
	description: "Discover local plumbing rebates and start saving on your plumbing upgrades with Wade's Plumbing & Septic. Find incentives for water-efficient fixtures and more.",
	provider: {
		"@type": "Organization",
		name: "Wade's Plumbing & Septic",
		url: "https://www.wadesplumbingandseptic.com",
	},
	datePublished: "2023-10-14",
	dateModified: "2023-10-14",
	breadcrumb: {
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				item: {
					"@type": "WebSite",
					url: "https://www.wadesplumbingandseptic.com",
					name: "Home",
				},
			},
			{
				"@type": "ListItem",
				position: 2,
				item: {
					"@type": "WebPage",
					url: "https://www.wadesplumbingandseptic.com/about-us/rebates/",
					name: "Rebates",
				},
			},
		],
	},
	isPartOf: {
		"@type": "WebSite",
		url: "https://www.wadesplumbingandseptic.com",
		name: "Wade's Plumbing & Septic",
	},
	about: {
		"@type": "Thing",
		name: "Plumbing Rebates and Savings",
		description: "Information about available rebates and savings for plumbing services and products.",
	},
};

export default function Rebates() {
	return (
		<>
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<h1>Rebates: Save Money on Your Plumbing Upgrades</h1>
			<div>
				<p>
					At Wade&apos;s Plumbing & Septic, we understand that upgrading your plumbing system can be a significant investment. That&apos;s why we want to help you save money by informing you about available rebates in the plumbing industry. These financial incentives or discounts are offered on specific products or services by manufacturers, distributors, retailers, or even government agencies. The goal is to encourage the purchase and use of more efficient, environmentally friendly,
					or technologically advanced plumbing products and services.
				</p>
				<p>How Rebates Work:</p>
				<ol>
					<li>
						<p>
							<strong>Eligibility:</strong> Rebates are available for select products or services, such as energy-efficient water heaters, low-flow toilets, or water-saving appliances. To qualify, you&apos;ll need to purchase eligible products or services.
						</p>
					</li>
					<li>
						<p>
							<strong>Rebate Forms &amp; Documentation:</strong> To apply for a rebate, you&apos;ll need to complete a rebate form, which can be found online or obtained from us. You&apos;ll be asked to provide your personal information, product details, and proof of purchase. Additional documentation, like receipts or invoices, may be required to verify your eligibility.
						</p>
					</li>
					<li>
						<p>
							<strong>Submission &amp; Processing:</strong> Make sure to submit your completed rebate forms and any required documentation by the specified deadline. Processing times for rebates can vary, but it usually takes several weeks or even months for the rebate provider to review and approve your application.
						</p>
					</li>
					<li>
						<p>
							<strong>Payment:</strong> Once your application is approved, you&apos;ll receive the rebate payment, which could be in the form of a check, prepaid debit card, or credit to your account, depending on the rebate provider&apos;s
						</p>
					</li>
				</ol>
			</div>
		</>
	);
}
