import Script from "next/script";

export const metadata = {
	title: "Financing Options | Wade's Plumbing & Septic",
	description: "Explore flexible financing options for your plumbing projects with Wade's Plumbing & Septic. Our partnership with WiseStack offers easy application, competitive rates, and tailored payment plans to meet your needs.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	keywords: ["Plumbing Financing", "Wade's Plumbing & Septic", "WiseStack Financing", "Plumbing Project Financing", "Local Plumbing Financing"],
	authors: [{ name: "Byron Wade", url: "https://www.wadesplumbingandseptic.com/about-us/financing/" }],
	creator: "Byron Wade",
	publisher: "Byron Wade",
	alternates: {},
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	category: "construction",
	bookmarks: ["https://www.wadesplumbingandseptic.com/about-us/financing/"],
	twitter: {
		card: "summary_large_image",
		title: "Financing Options | Wade's Plumbing & Septic",
		description: "Explore flexible financing options for your plumbing projects with Wade's Plumbing & Septic. Our partnership with WiseStack offers easy application, competitive rates, and tailored payment plans to meet your needs.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/api/og?title=Financing&link=www.wadesplumbingandseptic.com&description=Explore flexible financing options for your plumbing projects with Wade's Plumbing & Septic. Our partnership with WiseStack offers easy application, competitive rates, and tailored payment plans to meet your needs.",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Financing Options | Wade's Plumbing & Septic",
		description: "Explore flexible financing options for your plumbing projects with Wade's Plumbing & Septic. Our partnership with WiseStack offers easy application, competitive rates, and tailored payment plans to meet your needs.",
		url: "https://www.wadesplumbingandseptic.com/about-us/financing/",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Financing&link=www.wadesplumbingandseptic.com&description=Explore flexible financing options for your plumbing projects with Wade's Plumbing & Septic. Our partnership with WiseStack offers easy application, competitive rates, and tailored payment plans to meet your needs.",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Financing&link=www.wadesplumbingandseptic.com&description=Explore flexible financing options for your plumbing projects with Wade's Plumbing & Septic. Our partnership with WiseStack offers easy application, competitive rates, and tailored payment plans to meet your needs.",
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
	"@type": "FinancialService",
	name: "Wade's Plumbing & Septic Financing",
	url: "https://www.wadesplumbingandseptic.com/about-us/financing/",
	telephone: "+18314206011",
	description: "Explore flexible financing options for your plumbing projects with Wade's Plumbing & Septic. Our partnership with WiseStack offers easy application, competitive rates, and tailored payment plans to meet your needs.",
	areaServed: {
		"@type": "GeoShape",
		address: {
			"@type": "PostalAddress",
			addressLocality: "Ben Lomond",
			addressRegion: "CA",
			postalCode: "95005",
			addressCountry: "US",
		},
	},
	mentions: {
		"@type": "Corporation",
		name: "WiseStack",
		url: "https://www.wisestack.com/",
	},
};


export default function Example() {
	return (
		<>
			<Script async strategy="worker" data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<h1>Financing Your Plumbing Project with WiseStack</h1>
			<div>
				<p>Financing Your Plumbing Project with WiseStack</p>
				<p>At Wade&#39;s Plumbig & Septic, we understand that plumbing projects can be a significant investment, and we want to make the process as easy as possible for you. That&#39;s why we&#39;ve partnered with WiseStack, a trusted financing partner, to offer flexible and affordable financing options for your plumbing needs.</p>
				<p>Why Choose WiseStack Financing?</p>
				<p>
					<strong>Easy Application Process:</strong> Applying for financing with WiseStack is quick and straightforward. Simply complete the online application form, and you&#39;ll receive a decision within minutes.
				</p>
				<p>
					<strong>Flexible Payment Plans:</strong> WiseStack offers a variety of payment plans to suit your budget, from short-term to long-term financing options. You can choose the repayment term that works best for you.
				</p>
				<p>
					<strong>Competitive Rates:</strong> WiseStack provides competitive interest rates, ensuring you get the best possible financing option for your plumbing project.
				</p>
				<p>
					<strong>No Prepayment Penalties:</strong> With WiseStack, you have the freedom to pay off your loan early without incurring any additional fees or penalties.
				</p>
				<p>
					<strong>Secure &amp; Confidential:</strong> Your personal and financial information is protected with WiseStack&#39;s secure online application system, ensuring your privacy and peace of mind.
				</p>
				<p>Get Started with WiseStack Financing</p>
				<p>Ready to finance your plumbing project with WiseStack? Follow these simple steps:</p>
				<ol>
					<li>
						Contact our support team and we can send an application directly to your email shoot us a call at{" "}
						<a href="tel:8314306011" className="text-brand-800 hover:underline">
							(831) 225-4344
						</a>{" "}
						or{" "}
						<a href="mailto:support@wadesinc.io" className="text-brand-800 hover:underline">
							support@wadesinc.io
						</a>
						.
					</li>
					<li>Complete the online application form with your personal and financial information.</li>
					<li>Receive a decision within minutes and select the payment plan that best fits your needs.</li>
					<li>Proceed with your plumbing project, knowing that you have secured flexible and affordable financing through WiseStack.</li>
					<li>Once your project is complete, begin making your scheduled payments to WiseStack according to the agreed-upon terms.</li>
					<li>Enjoy the benefits of your upgraded plumbing system, knowing that you&#39;ve made a smart investment in your home or business.</li>
				</ol>
				<p>Available Financing Options</p>
				<p>WiseStack offers a range of financing options to suit your specific needs. Some popular plans include:</p>
				<ul>
					<li>No-interest financing if paid in full within promotional period (subject to credit approval)</li>
					<li>Low-interest financing for longer-term repayment plans</li>
					<li>Deferred payment options, allowing you to start paying after a specified period</li>
				</ul>
				<p>To learn more about the specific financing options available through WiseStack, please visit their website or contact our team for further assistance.</p>
				<p>We&#39;re Here to Help</p>
				<p>At Wade&#39;s Plumbing & Septic, our goal is to provide you with the best possible plumbing solutions and support you every step of the way. If you have any questions about financing your project with WiseStack or need assistance with the application process, please don&#39;t hesitate to reach out to our team. We&#39;re here to help make your plumbing upgrades a reality.</p>
				<p>
					Financing today at{" "}
					<a href="tel:8314306011" className="text-brand-800 hover:underline">
						(831) 225-4344
					</a>{" "}
					or{" "}
					<a href="mailto:support@wadesinc.io" className="text-brand-800 hover:underline">
						support@wadesinc.io
					</a>
					, or see the rest of our website for more information on how we can assist you with your plumbing needs.
				</p>
			</div>
		</>
	);
}
