export function InfoBar() {
	return (
		<div className="hidden px-4 py-1 font-bold text-black shadow md:block bg-brand">
			<div className="items-center justify-center hidden p-1 px-6 pr-4 mx-auto space-x-10 text-sm lg:flex max-w-7xl lg:px-8">
				<div>Mon - Fri 9:00am - 5:00pm</div>
				<a className="text-lg font-extrabold hover:underline" href="tel:+18312254344">
					831.225.4344
				</a>
				<div className="space-x-1">
					<a className="hover:underline" href="mailto:">
						Santa Cruz County
					</a>
					,
					<a className="hover:underline" href="mailto:">
						Monterey County
					</a>
					,
					<a className="hover:underline" href="mailto:">
						Santa Clara County
					</a>
				</div>
			</div>
		</div>
	);
}
