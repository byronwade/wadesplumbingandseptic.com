import { SiteHeader } from "@/components/site-header"
import { StaticSiteFooter } from "@/components/static-site-footer"

import "./home.css"

export default function HomeLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<>
			<SiteHeader />
			{children}
			<StaticSiteFooter />
		</>
	)
}
