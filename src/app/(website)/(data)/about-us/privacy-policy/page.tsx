import Script from "next/script";

export const metadata = {
	title: "Comprehensive Privacy Policy | Wade's Plumbing & Septic",
	description: "At Wade's Plumbing & Septic, safeguarding your privacy is our priority. Explore our policy detailing the data collection, usage, and management practices ensuring your privacy.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	keywords: ["Privacy Policy", "Data Protection", "Personal Information Management", "Wade's Plumbing & Septic"],
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
	bookmarks: ["https://www.wadesplumbingandseptic.com/about-us/privacy-policy/"],
	twitter: {
		card: "summary_large_image",
		title: "Comprehensive Privacy Policy | Wade's Plumbing & Septic",
		description: "Your privacy is our priority. Explore Wade's Plumbing & Septic's policy on data collection, usage, and management practices ensuring your privacy.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/api/og?title=Privacy Policy&link=www.wadesplumbingandseptic.com&description=Your privacy is our priority. Explore Wade's Plumbing & Septic's policy on data collection, usage, and management practices ensuring your privacy.",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Comprehensive Privacy Policy | Wade's Plumbing & Septic",
		description: "Your privacy is our priority. Explore Wade's Plumbing & Septic's policy on data collection, usage, and management practices ensuring your privacy.",
		url: "https://www.wadesplumbingandseptic.com/about-us/privacy-policy/",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Privacy Policy&link=www.wadesplumbingandseptic.com&description=Your privacy is our priority. Explore Wade's Plumbing & Septic's policy on data collection, usage, and management practices ensuring your privacy.",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Privacy Policy&link=www.wadesplumbingandseptic.com&description=Your privacy is our priority. Explore Wade's Plumbing & Septic's policy on data collection, usage, and management practices ensuring your privacy.",
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
	url: "https://www.wadesplumbingandseptic.com/about-us/privacy-policy/",
	name: "Comprehensive Privacy Policy of Wade's Plumbing & Septic",
	publisher: {
		"@type": "Organization",
		name: "Wade's Plumbing & Septic",
		url: "https://www.wadesplumbingandseptic.com",
	},
	datePublished: "2023-03-23",
	dateModified: "2023-03-23",
	about: {
		"@type": "Thing",
		name: "Data Protection and Privacy",
		description: "Detailing the data protection and privacy practices of Wade's Plumbing & Septic to ensure the confidentiality and security of our customers' information.",
	},
	audience: {
		"@type": "Audience",
		name: "Customers and Site Visitors",
		description: "This privacy policy is intended for customers and visitors of Wade's Plumbing & Septic website.",
	},
};


export default function PrivacyPolicy() {
	return (
		<>
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<h1>Privacy Policy</h1>
			<p>Effective Date: 3/23/2023</p>
			<p>Wade\'s Plumbing &amp; Septic (&quot;us,&quot; &quot;we,&quot; or &quot;our&quot;) operates the website wadesplumbingandseptic.com (the &quot;Site&quot;). This page informs you of our policies regarding the collection, use, and disclosure of Personal Information we receive from users of the Site.</p>
			<p>By using the Site, you agree to the collection and use of information in accordance with this policy.</p>
			<ol start={1}>
				<li>Information Collection and Use</li>
			</ol>
			<p>While using our Site, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to, your name, email address, phone number, and mailing address (&quot;Personal Information&quot;).</p>
			<p>We use your Personal Information for providing and improving the Site and our Privacy Policy. By providing your Personal Information, you agree that we can contact you regarding our Privacy Policy, promotions, and any other relevant information.</p>
			<ol start={2}>
				<li>Log Data</li>
			</ol>
			<p>Like many site operators, we collect information that your browser sends whenever you visit our Site (&quot;Log Data&quot;). This Log Data may include information such as your computer&apos;s Internet Protocol (&quot;IP&quot;) address, browser type, browser version, the pages of our Site that you visit, the time and date of your visit, the time spent on those pages, and other statistics.</p>
			<ol start={3}>
				<li>Cookies</li>
			</ol>
			<p>Cookies are files with a small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your computer&apos;s hard drive.</p>
			<p>Like many websites, we use &quot;cookies&quot; to collect information and improve your experience on our Site. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.</p>
			<ol start={4}>
				<li>Security</li>
			</ol>
			<p>The security of your Personal Information is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p>
			<ol start={5}>
				<li>Third-Party Privacy Policy</li>
			</ol>
			<p>We may employ third-party companies and individuals to facilitate our Privacy Policy, provide Privacy Policy on our behalf, perform Site-related Privacy Policy, or assist us in analyzing how our Site is used. These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
			<ol start={6}>
				<li>Links to Other Sites</li>
			</ol>
			<p>Our Site may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party&apos; site. We strongly advise you to review the Privacy Policy of every site you visit.</p>
			<p>Wade&apos; Plumbing &amp; Septic has no control over and assumes no responsibility for the content, privacy policies, or practices of any third-party sites or Privacy Policy.</p>
			<ol start={7}>
				<li>Children&apos; Privacy</li>
			</ol>
			<p>
				Our Site does not address anyone under the age of 13 (&quot;Children&quot;). We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Information, please contact us. If we become aware that we have collected Personal Information from a child under the age of 13 without verification of parental consent, we will take steps to remove that information from
				our servers.
			</p>
			<ol start={8}>
				<li>Changes to This Privacy Policy</li>
			</ol>
			<p>This Privacy Policy is effective as of [enter the date] and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.</p>
			<p>We reserve the right to update or change our Privacy Policy at any time, and you should check this Privacy Policy periodically. Your continued use of the Site after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy.</p>
			<ol start={9}>
				<li>Contact Us</li>
			</ol>
			<p>If you have any questions about this Privacy Policy, please contact us at:</p>
			<p>
				Wade&apos; Plumbing &amp; Septic Phone: <a href="tel:8314306011">(831) 225-4344</a> Email: <a href="mailto:support@wadesinc.io">support@wadesinc.io</a>
			</p>
		</>
	);
}
