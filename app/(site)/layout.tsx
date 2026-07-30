import { ChromeExtras } from "@/components/chrome-extras"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

import "../globals.css"

export default function SiteChromeLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<>
			<SiteHeader />
			{children}
			<SiteFooter />
			<ChromeExtras />
		</>
	)
}
