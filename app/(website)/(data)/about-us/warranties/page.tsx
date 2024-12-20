import Script from "next/script";

export const metadata = {
	title: "Industry-Leading Plumbing Warranties | Wade's Plumbing & Septic",
	description: "Discover comprehensive plumbing and septic service warranties at Wade's Plumbing & Septic. Your satisfaction is our priority. Explore our warranty offerings now.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	keywords: ["Plumbing Warranties", "Septic Service Warranty", "Wade's Plumbing & Septic", "Warranty Registration", "Satisfaction Guarantee"],
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
	bookmarks: ["https://www.wadesplumbingandseptic.com/about-us/warranties/"],
	twitter: {
		card: "summary_large_image",
		title: "Industry-Leading Plumbing Warranties | Wade's Plumbing & Septic",
		description: "Discover comprehensive plumbing and septic service warranties at Wade's Plumbing & Septic. Your satisfaction is our priority.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/api/og?title=Warranties&link=www.wadesplumbingandseptic.com&description=Discover comprehensive plumbing and septic service warranties at Wade's Plumbing & Septic. Your satisfaction is our priority.",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Industry-Leading Plumbing Warranties | Wade's Plumbing & Septic",
		description: "Discover comprehensive plumbing and septic service warranties at Wade's Plumbing & Septic. Your satisfaction is our priority.",
		url: "https://www.wadesplumbingandseptic.com/about-us/warranties/",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Warranties&link=www.wadesplumbingandseptic.com&description=Discover comprehensive plumbing and septic service warranties at Wade's Plumbing & Septic. Your satisfaction is our priority.",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Warranties&link=www.wadesplumbingandseptic.com&description=Discover comprehensive plumbing and septic service warranties at Wade's Plumbing & Septic. Your satisfaction is our priority.",
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
	url: "https://www.wadesplumbingandseptic.com/about-us/warranties/",
	name: "Industry-Leading Plumbing Warranties",
	description: "Discover comprehensive plumbing and septic service warranties at Wade's Plumbing & Septic. Your satisfaction is our priority. Explore our warranty offerings now.",
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
					"@id": "https://www.wadesplumbingandseptic.com",
					"@type": "WebSite",
					url: "https://www.wadesplumbingandseptic.com",
					name: "Home",
				},
			},
			{
				"@type": "ListItem",
				position: 2,
				item: {
					"@id": "https://www.wadesplumbingandseptic.com/about-us/warranties/",
					"@type": "WebPage",
					url: "https://www.wadesplumbingandseptic.com/about-us/warranties/",
					name: "Warranties",
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
		name: "Plumbing and Septic Service Warranties",
		description: "Information about the comprehensive warranties offered for plumbing and septic services.",
	},
};


export default function Warranties() {
	return (
		<>
			<Script async strategy="worker" data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<h1>Warranty and Registrations</h1>
			<p>At Wade&#39;s Plumbing & Septic, we stand behind our work and are committed to providing our customers with the highest quality plumbing and septic services. To ensure your satisfaction and confidence in our work, we offer the following warranty:</p>
			<ul>
				<li>
					<strong>100% Satisfaction Guarantee:</strong> We strive to provide exceptional customer service and high-quality workmanship. If you are not completely satisfied with our services, please let us know and we will make it right. We will either fix the issue to your satisfaction or provide a full refund for the work performed.
				</li>
				<li>
					<strong>1 Year Test Drive:</strong> We stand behind all of our new water heater, ductless mini split, furnace, and air conditioning installations with our 1 Year Test Drive warranty. If for any reason you are not happy with your new system within the first year, we will remove the equipment and refund 100% of your original investment minus the cost paid to any subcontractors. This offer is not available for installed piping, sewer, or underground projects or installations.
				</li>
				<li>
					<strong>1 Year Labor Warranty:</strong> We provide a one-year labor warranty on any new product that we supply and install. This warranty covers any faulty workmanship issues that may arise during this time. If you experience any problems due to faulty workmanship, we will return to your property and repair the issue at no cost to you.
				</li>
				<li>
					<strong>Parts Warranty:</strong> We use only high-quality parts and materials in our work, and we stand behind them. We offer a 1 year warranty on all parts and materials we supply. If any of the parts or materials we installed fail within this warranty period, we will replace them at no cost to you. However, this warranty does not cover any parts or materials supplied by the customer or any damages caused by customer-supplied materials.
				</li>
			</ul>
			<h2>Plumbing Warranties:</h2>
			<ul>
				<li>Home Water Line Replacement - 15 years</li>
				<li>Underground Water and Gas Line Replacement - 10 years</li>
				<li>Sewer Line Replacement - 15 years</li>
				<li>Sewer Line Spot Repair - 1 year</li>
				<li>Hydrojetting - 1 year</li>
				<li>Drain Clogs - 30 days</li>
			</ul>
			<p>We guarantee our workmanship on all plumbing projects covered by the warranties above. If any issues arise within the warranty period, we will repair the issue free of charge. Please note that warranties do not cover damages caused by normal wear and tear, misuse, neglect, or acts of God.</p>
			<h2>Generator Warranties:</h2>
			<p>We offer warranty registration services for the following brands of generators:</p>
			<ul>
				<li>Generac</li>
				<li>Honeywell</li>
			</ul>
			<p>To activate your generator warranty, please follow the manufacturer&#39;s instructions for warranty registration.</p>
			<p>Please note that our warranty is subject to the following limitations:</p>
			<ul>
				<li>The warranty is only valid for the original customer and is non-transferable.</li>
				<li>The warranty does not cover damages caused by repairs or installations made by anyone other than our company.</li>
				<li>The warranty does not cover damages caused by customer-supplied parts or materials.</li>
				<li>The warranty does not cover damages caused by work performed on equipment or systems that have been previously modified or repaired by anyone other than our company.</li>
			</ul>
			<p>Thank you for choosing Wade&#39;s Plumbing & Septic for your plumbing and septic needs. We are confident in our work and our warranty and look forward to serving you.</p>
			<p>
				Please don&#39;t hesitate to contact us if you have any questions about our warranty or any of our plumbing and septic services. We are always here to help and ensure your satisfaction with our work. <a href="tel:8312254344">831-225-4344.</a>
			</p>
		</>
	);
}
