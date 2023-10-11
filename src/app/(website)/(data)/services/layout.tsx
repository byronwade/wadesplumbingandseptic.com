export const metadata = {
	title: "Services | Wade's Plumbing & Septic",
	description: "Looking for reliable plumbing services in the local area? Look no further than Wade's Plumbing & Septic! Our experienced team offers a wide range of plumbing services to meet all your needs.",
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
	bookmarks: ["https://www.wadesplumbingandseptic.com/services/"],
	twitter: {
		card: "summary_large_image",
		title: "Services | Wade's Plumbing & Septic",
		description: "Looking for reliable plumbing services in the local area? Look no further than Wade's Plumbing & Septic! Our experienced team offers a wide range of plumbing services to meet all your needs.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/api/og?title=Services&link=www.wadesplumbingandseptic.com&description=Looking for reliable plumbing services in the local area? Look no further than Wade's Plumbing & Septic! Our experienced team offers a wide range of plumbing services to meet all your needs.",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "Services | Wade's Plumbing & Septic",
		description: "Looking for reliable plumbing services in the local area? Look no further than Wade's Plumbing & Septic! Our experienced team offers a wide range of plumbing services to meet all your needs.",
		url: "https://www.wadesplumbingandseptic.com/services/",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Services&link=www.wadesplumbingandseptic.com&description=Looking for reliable plumbing services in the local area? Look no further than Wade's Plumbing & Septic! Our experienced team offers a wide range of plumbing services to meet all your needs.",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=Services&link=www.wadesplumbingandseptic.com&description=Looking for reliable plumbing services in the local area? Look no further than Wade's Plumbing & Septic! Our experienced team offers a wide range of plumbing services to meet all your needs.",
				width: 1800,
				height: 1600,
				alt: "Wade's Plumbing & Septic",
			},
		],
		locale: "en-US",
		type: "website",
	},
};

export default async function Layout({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}
