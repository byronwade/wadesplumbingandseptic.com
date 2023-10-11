import Image from "next/image";

export default function LogoCloud() {
	return (
		<section className="bg-black relative overflow-hidden">
			<div className="py-16 px-6 sm:py-24 lg:px-8">
				<div className="mx-auto max-w-7xl">
					<h2 className="text-lg font-semibold leading-8 tracking-tight text-brand-600">Brands we use</h2>
					<p className="mb-4 text-4xl tracking-tight font-extrabold text-white dark:text-black">Trusted by the world’s most innovative teams</p>
					<div className="mx-auto mt-10 grid grid-cols-4 items-start gap-x-8 gap-y-10 sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:grid-cols-5">
						<Image className="col-span-2 max-h-16 w-full object-contain object-center lg:col-span-1 grayscale invert place-self-center" src="/bradfordwhite.png" alt="Transistor" width={158} height={48} />
						<Image className="col-span-2 max-h-8 w-full object-contain object-center lg:col-span-1 grayscale invert place-self-center" src="/kohler.png" alt="Transistor" width={158} height={48} />
						<Image className="col-span-2 max-h-16 w-full object-contain object-center lg:col-span-1 grayscale invert place-self-center" src="/grundfos.png" alt="Transistor" width={158} height={48} />
						<Image className="col-span-2 max-h-16 w-full object-contain object-center lg:col-span-1 grayscale invert place-self-center" src="/grohe.png" alt="Transistor" width={158} height={48} />
						<Image className="col-span-2 max-h-12 w-full object-contain object-center lg:col-span-1 grayscale invert place-self-center" src="/navien.png" alt="Transistor" width={158} height={48} />
					</div>
				</div>
			</div>
		</section>
	);
}
