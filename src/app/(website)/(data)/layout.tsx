import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import getMenu from "../getMenu";
import CTA from "@/components/sections/CTA";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const data = await getMenu();
	return (
		<>
			<Header data={data} />
			<main>
				{children}
				<CTA />
			</main>
			<Footer />
		</>
	);
}
