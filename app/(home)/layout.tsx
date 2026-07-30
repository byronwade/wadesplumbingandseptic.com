import { HomeHeader } from "@/components/home-header"
import { StaticSiteFooter } from "@/components/static-site-footer"

import "./home.css"

export default function HomeLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<>
			<HomeHeader />
			{children}
			<StaticSiteFooter />
		</>
	)
}
