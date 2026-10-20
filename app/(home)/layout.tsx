import { ChromeExtras } from "@/components/chrome-extras"
import { MobileCallBar } from "@/components/mobile-call-bar"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

import "../globals.css"

export default function HomeLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<>
			<SiteHeader />
			{children}
			<SiteFooter />
			<MobileCallBar />
			<ChromeExtras />
		</>
	)
}
