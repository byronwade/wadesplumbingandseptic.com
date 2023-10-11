export default function RootLayout({ children }) {
	return (
		<>
			<div className="min-h-screen">
				<main>{children}</main>
			</div>
		</>
	);
}
