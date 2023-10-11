import ContactForm from "@/components/forms/ContactForm";
import Image from "next/image";

export default function Example() {
	return (
		<>
			<section className="w-full bg-gray-50">
				<div className="py-10 mx-auto max-w-7xl md:px-8">
					<div className="flex flex-col items-center w-full overflow-hidden bg-white md:flex-row md:rounded justify-between">
						<div className="flex flex-col w-full p-10 mt-4 text-center md:w-1/2 md:mt-0">
							<h3 className="text-3xl font-semibold leading-none md:text-4xl">Septic Pumping</h3>
							<p className="text-xl font-light text-gray-800">Septic tanks should be cleaned and pumped every 3-5 years, depending on the size of the tank and the number of people using it. Let&apos; get yours handled today!</p>
							<a href="#_" className="flex items-center w-auto mx-auto text-lg leading-tight text-center text-brand-600 hover:underline">
								<span className="">Learn More</span>
								<svg className="w-3 h-3 mt-0.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</a>
						</div>
						<div className="w-full mt-7 md:w-2/5 md:mt-0">
							<div className="p-6">
								<ContactForm />
							</div>
						</div>
					</div>
					<div className="flex flex-col md:mt-8 mt-10 items-center w-full overflow-hidden bg-white md:flex-row md:rounded">
						<div className="flex flex-col w-full p-10 mt-4 text-center md:w-1/2 md:mt-0">
							<p className="mb-4 text-3xl font-medium leading-none">Septic Pumping</p>
							<h2 className="max-w-md mx-auto mb-6 text-4xl font-semibold md:leading-tight md:text-5xl">The best septic pumper around.</h2>
							<a href="#_" className="flex items-center w-auto mx-auto text-lg leading-tight text-center text-brand-600 hover:underline">
								<span className="">Learn More</span>
								<svg className="w-3 h-3 mt-0.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</a>
						</div>
						<div className="w-full mt-7 md:w-1/2 md:mt-0 relative">
							<Image src="/landing-pages/septic-pumping/septic-pumping-illistration.png" width={1000} height={800} alt="Septic Pumping illistration" />
						</div>
					</div>
					<div className="flex flex-col mt-10 md:flex-row md:mt-8 md:space-x-8">
						<div className="flex flex-col items-center justify-center flex-1 overflow-hidden text-center bg-white md:rounded">
							<div className="flex flex-col px-10 pb-5 space-y-6 pt-14 md:px-8">
								<h3 className="text-4xl font-semibold leading-none md:text-5xl">Inspections</h3>
								<p className="text-xl font-light text-gray-800">Through inspections without a hassle</p>
								<a href="#_" className="flex items-center w-auto mx-auto text-lg leading-tight text-center text-brand-600 hover:underline">
									<span className="">Learn more</span>
									<svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
									</svg>
								</a>
							</div>
							<Image src="/landing-pages/septic-pumping/inspection.svg" width={1000} height={800} alt="inspection illistration" className="w-2/3" />
						</div>
						<div className="relative flex flex-col items-center justify-center flex-1 py-32 mt-10 overflow-hidden text-center bg-white md:mt-0 md:rounded">
							<Image src="/landing-pages/septic-pumping/reports.svg" width={107} height={107} alt="report icon" className="w-20 h-auto" />
							<div className="flex flex-col px-10 space-y-6 md:px-8">
								<h3 className="text-3xl font-semibold leading-none md:text-4xl">Reports</h3>
								<p className="text-xl font-light text-gray-800">Full county reports in your email the same day</p>
								<p />
								<a href="#_" className="flex items-center w-auto mx-auto text-lg leading-tight text-center text-brand-600 hover:underline">
									<span>Learn more</span>
									<svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
									</svg>
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
