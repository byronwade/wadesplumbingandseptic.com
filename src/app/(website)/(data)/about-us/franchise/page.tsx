import Script from "next/script";

export const metadata = {
	title: "Franchise Opportunities | Wade&apos;s Plumbing & Septic",
	description: "Embark on a rewarding entrepreneurial journey with a Wade&apos;s Plumbing & Septic franchise. Leverage our established brand, proven business model, and extensive support to build a thriving plumbing business in your local community.",
	generator: "Next.js",
	applicationName: "Wade&apos;s Plumbing & Septic",
	keywords: ["Plumbing Franchise", "Septic Services Franchise", "Entrepreneurship", "Business Opportunity", "Franchise System"],
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
	bookmarks: ["https://www.wadesplumbingandseptic.com/about-us/franchising/"],
	twitter: {
		card: "summary_large_image",
		title: "Franchise Opportunities | Wade&apos;s Plumbing & Septic",
		description: "Embark on a rewarding entrepreneurial journey with a Wade&apos;s Plumbing & Septic franchise. Leverage our established brand, proven business model, and extensive support to build a thriving plumbing business in your local community.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/api/og?title=Franchising&link=www.wadesplumbingandseptic.com&description=Embark on a rewarding entrepreneurial journey with a Wade&apos;s Plumbing & Septic franchise.",
			alt: "Wade&apos;s Plumbing & Septic Franchise Opportunity",
		},
	},
	openGraph: {
		title: "Franchise Opportunities | Wade&apos;s Plumbing & Septic",
		description: "Embark on a rewarding entrepreneurial journey with a Wade&apos;s Plumbing & Septic franchise. Leverage our established brand, proven business model, and extensive support to build a thriving plumbing business in your local community.",
		url: "https://www.wadesplumbingandseptic.com/about-us/franchising/",
		siteName: "Wade&apos;s Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Franchising&link=www.wadesplumbingandseptic.com&description=Embark on a rewarding entrepreneurial journey with a Wade&apos;s Plumbing & Septic franchise.",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Franchising&link=www.wadesplumbingandseptic.com&description=Embark on a rewarding entrepreneurial journey with a Wade&apos;s Plumbing & Septic franchise.",
				width: 1800,
				height: 1600,
				alt: "Wade&apos;s Plumbing & Septic Franchise Opportunity",
			},
		],
		locale: "en-US",
		type: "website",
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "Corporation",
	name: "Wade&apos;s Plumbing & Septic Franchise Opportunities",
	url: "https://www.wadesplumbingandseptic.com/about-us/franchising/",
	telephone: "+18314206011",
	description: "Embark on a rewarding entrepreneurial journey with a Wade&apos;s Plumbing & Septic franchise. Leverage our established brand, proven business model, and extensive support to build a thriving plumbing business in your local community.",
	location: {
		"@type": "PostalAddress",
		addressLocality: "Santa Cruz",
		addressRegion: "CA",
		postalCode: "95060",
		addressCountry: "US",
	},
	contactPoint: {
		"@type": "ContactPoint",
		contactType: "sales",
		url: "https://www.wadesplumbingandseptic.com/about-us/franchising/",
	},
	offers: {
		"@type": "Offer",
		url: "https://www.wadesplumbingandseptic.com/about-us/franchising/",
		price: "Contact for pricing details",
		priceCurrency: "USD",
		validFrom: "2023-10-14",
	},
	sameAs: "https://www.wadesplumbingandseptic.com/",
};



export default function Example() {
	return (
		<>
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<h1>Franchise Opportunities at Wade&#39;s Plumbing &amp; Septic</h1>
			<p>Are you an ambitious individual with a passion for plumbing and community service? Wade&#39;s Plumbing &amp; Septic offers a remarkable franchise opportunity that empowers you to own and operate your own plumbing business under our reputable brand. By becoming a franchisee, you&#39;ll gain access to our proven business model, comprehensive training programs, and continuous support from a team of industry experts.</p>

			<h2>Why Choose a Wade&#39;s Plumbing &amp; Septic Franchise?</h2>
			<p>We offer a turnkey franchise solution that provides everything you need to hit the ground running. Our franchisees benefit from:</p>
			<ul>
				<li>Exclusive territorial rights to build a loyal customer base.</li>
				<li>A well-established brand known for quality and reliability.</li>
				<li>Access to our extensive network of suppliers and contractors.</li>
				<li>Marketing and advertising support to drive customer acquisition and retention.</li>
				<li>Comprehensive training and ongoing educational opportunities to keep you at the forefront of the plumbing industry.</li>
				<li>A collaborative community of franchisees committed to mutual success.</li>
			</ul>

			<h2>Ready to Take the Next Step?</h2>
			<p>If you&#39;re ready to take control of your future and make a positive impact in your community, a Wade&#39;s Plumbing &amp; Septic franchise could be the perfect fit. Get in touch with us today to learn more about our franchise program and discover how you can build a successful plumbing business with Wade&#39;s Plumbing &amp; Septic.</p>
			<p>
				Contact us at <a href="tel:8314306011">(831) 225-4344</a> or <a href="mailto:support@wadesinc.io">support@wadesinc.io</a>, or fill out our online inquiry form to get started.
			</p>
		</>
	);
}
