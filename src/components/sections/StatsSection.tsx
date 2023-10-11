import Image from "next/image";
const stats = [
	{ id: 1, name: "Water saved per year with WaterSense fixtures", value: "13,000 gallons" },
	{ id: 2, name: "Energy savings on water heating", value: "Up to 15%" },
	{ id: 3, name: "Water bill savings from fixing leaks", value: "10%" },
	{ id: 4, name: "DIY plumbing risks in insurance claims", value: "Significant" },
];

export default function StatsSection() {
	return (
		<section className="bg-gray-50 relative overflow-hidden">
			<div className="py-16 px-6 sm:py-24 lg:px-8">
				<Image className="hidden md:block absolute -bottom-5 right-10" src="/gumba.png" height={100} width={100} alt="Gumba Plumber" />
				<div className="mx-auto max-w-7xl">
					<h2 className="text-lg font-semibold leading-8 tracking-tight text-brand-600">Impressive Plumbing Statistics</h2>
					<p className="mb-4 text-4xl tracking-tight font-extrabold text-black dark:text-white">Relied upon by homeowners nationwide</p>
					<dl className="mt-8 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
						{stats.map((stat, index) => (
							<div key={index} className="flex flex-col bg-gray-400/5 p-8">
								<dt className="text-sm font-semibold leading-6 text-gray-600">{stat.name}</dt>
								<dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</section>
	);
}
