import Image from "next/image";

export default function LogoCloud() {
	return (
		<section className="bg-gray-50">
			<div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
				<div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
					<div>
						<h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Trusted Partners</h2>
						<p className="max-w-3xl mt-4 text-lg leading-6 text-gray-500">We collaborate with the top brands to ensure the best quality for our services.</p>
						<div className="mt-6 space-y-4">
							<div className="flex items-center space-x-4">
								<Image className="h-12" src="/partner1.svg" alt="Partner 1 Logo" width={48} height={48} />
								<Image className="h-12" src="/partner2.svg" alt="Partner 2 Logo" width={48} height={48} />
								<Image className="h-12" src="/partner3.svg" alt="Partner 3 Logo" width={48} height={48} />
							</div>
							<div className="flex items-center space-x-4">
								<Image className="h-12" src="/partner4.svg" alt="Partner 4 Logo" width={48} height={48} />
								<Image className="h-12" src="/partner5.svg" alt="Partner 5 Logo" width={48} height={48} />
							</div>
						</div>
					</div>
					<div className="relative mt-10 -mx-4 lg:mt-0" aria-hidden="true">
						<Image className="mx-auto" src="/illustration-partners.svg" alt="Partners Illustration" width={500} height={500} />
					</div>
				</div>
			</div>
		</section>
	);
}
