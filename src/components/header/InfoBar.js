export function InfoBar() {
	return (
		<div className="hidden md:block bg-brand text-black font-bold py-1 px-4 shadow">
			<div className="hidden lg:flex mx-auto max-w-7xl px-6 lg:px-8 p-1 items-center justify-center text-sm space-x-10 pr-4">
				<div>Mon - Fri 9:00am - 5:00pm (24/7 for emergency work)</div>
				<a className="text-lg font-extrabold hover:underline" href="tel:+18312254344">
					831.225.4344
				</a>
				{/* <a target="_blank" className="hover:underline" href="https://www.google.com/maps/place/Wade'+Plumbing+%26+Septic/@37.0691872,-122.0863327,17z/data=!4m15!1m8!3m7!1s0x808e45d553ee3671:0x11e65c09abb0758b!2s7737+CA-9,+Ben+Lomond,+CA+95005!3b1!8m2!3d37.0691829!4d-122.084144!16s%2Fg%2F11jzwrnb7h!3m5!1s0x6b4df86479b11ce3:0x6dc60026b2e543b9!8m2!3d37.0691829!4d-122.084144!16s%2Fg%2F11np4mj1hk" rel="noreferrer">
					7737 HWY 9, Ben Lomond, CA, 95005
				</a> */}
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
