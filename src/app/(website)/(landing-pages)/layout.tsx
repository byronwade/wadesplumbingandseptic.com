import LogoCloud from "@/components/sections/LogoCloud";
import Testimonials from "@/components/sections/Testimonials";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}

			<LogoCloud />
			<Testimonials />
		</>
	);
}
