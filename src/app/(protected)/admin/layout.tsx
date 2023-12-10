import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navbar />
			<Sidebar />
			<div className="relative flex flex-row h-full">
				<div className="w-full mt-[32px] ml-[160px]">{children}</div>
			</div>
		</>
	);
}
