import Image from "next/image";

export const metadata = {
	title: "About Us | Wade's Plumbing & Septic",
	description: "Looking for a reliable plumbing company in the local area? Look no further than Wade's Plumbing & Septic. Our experienced team is dedicated to providing top-quality services for all your plumbing needs.",
	generator: "Next.js",
	applicationName: "Wade's Plumbing & Septic",
	referrer: "origin-when-cross-origin",
	keywords: ["Next.js", "React", "JavaScript"],
	authors: [{ name: "Byron Wade" }, { name: "Byron Wade", url: "https://www.wadesplumbingandseptic.com/" }],
	creator: "Byron Wade",
	publisher: "Byron Wade",
	alternates: {},
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	category: "construction",
	bookmarks: ["https://www.wadesplumbingandseptic.com/about-us/"],
	twitter: {
		card: "summary_large_image",
		title: "About Us | Wade's Plumbing & Septic",
		description: "Looking for a reliable plumbing company in the local area? Look no further than Wade's Plumbing & Septic. Our experienced team is dedicated to providing top-quality services for all your plumbing needs.",
		creator: "@wadesplumbing",
		images: {
			url: "https://www.wadesplumbingandseptic.com/api/og?title=About Us&link=www.wadesplumbingandseptic.com&description=Looking for a reliable plumbing company in the local area? Look no further than Wade's Plumbing & Septic. Our experienced team is dedicated to providing top-quality services for all your plumbing needs.",
			alt: "Wade's Plumbing & Septic Social Logo",
		},
	},
	openGraph: {
		title: "About Us | Wade's Plumbing & Septic",
		description: "Looking for a reliable plumbing company in the local area? Look no further than Wade's Plumbing & Septic. Our experienced team is dedicated to providing top-quality services for all your plumbing needs.",
		url: "https://www.wadesplumbingandseptic.com/about-us/",
		siteName: "Wade's Plumbing & Septic",
		images: [
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=About Us&link=www.wadesplumbingandseptic.com&description=Looking for a reliable plumbing company in the local area? Look no further than Wade's Plumbing & Septic. Our experienced team is dedicated to providing top-quality services for all your plumbing needs.",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.wadesplumbingandseptic.com/api/og?title=About Us&link=www.wadesplumbingandseptic.com&description=Looking for a reliable plumbing company in the local area? Look no further than Wade's Plumbing & Septic. Our experienced team is dedicated to providing top-quality services for all your plumbing needs.",
				width: 1800,
				height: 1600,
				alt: "Wade's Plumbing & Septic",
			},
		],
		locale: "en-US",
		type: "website",
	},
};

const stats = [
	{ label: "Servicing Santa Cruz Couny and areas", value: "250,000 people" },
	{ label: "Customers calling per day", value: "22 people" },
	{ label: "Discounts given to the elderly and veterans last month", value: "$21,465" },
];
const values = [
	{
		name: "Be world-class",
		description: "We strive for excellence in every aspect of our work, from the quality of our services to the professionalism and skill of our team. Our goal is to set the benchmark for outstanding plumbing and septic solutions in our community and beyond.",
	},
	{
		name: "Share everything you know",
		description: "Knowledge is power, and we believe in empowering our customers by sharing our expertise, tips, and advice. We aim to educate and inform our clients, enabling them to make informed decisions about their plumbing and septic needs.",
	},
	{
		name: "Always learning",
		description: "We are dedicated to continuous learning and improvement, staying updated on the latest industry advancements and techniques. By investing in our team's growth and development, we ensure that we provide the most effective and innovative solutions for our customers.",
	},
	{
		name: "Be supportive",
		description: "We take pride in offering empathetic and attentive customer service, understanding that each client's needs are unique. Our team is always ready to listen, offer guidance, and provide tailored solutions that address specific plumbing and septic challenges.",
	},
	{
		name: "Take responsibility",
		description: "We hold ourselves accountable for the quality and impact of our work, taking full responsibility for the outcomes of our services. We are committed to addressing any concerns and making things right for our customers, ensuring their satisfaction and trust.",
	},
	{
		name: "Enjoy downtime",
		description: "We understand the importance of work-life balance, both for our team and our customers. By delivering efficient and reliable services, we help our clients enjoy the comfort and convenience of their homes without worrying about plumbing and septic issues.",
	},
];
const team = [
	{
		name: "Byron Wade",
		role: "Owner / CEO",
		imageUrl: "/team/byron.jpg",
	},
	{
		name: "Dave Clark",
		role: "Co-Owner / CFO",
		imageUrl: "/team/byron.jpg",
	},
	{
		name: "Hayley Woods",
		role: "Office Admin",
		imageUrl: "/team/byron.jpg",
	},
	{
		name: "Lizzy Clark",
		role: "CSR",
		imageUrl: "/team/byron.jpg",
	},
	{
		name: "Corey Mcclemans",
		role: "Project Manager / Sales",
		imageUrl: "/team/byron.jpg",
	},
];

export default function Example() {
	return (
		<section className="mb-44">
			<div className="relative">
				<div className="overflow-hidden">
					<div className="mx-auto max-w-7xl px-6 pb-32 pt-16 sm:pt-60 lg:px-8 lg:pt-16">
						<div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
							<div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
								<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Our team is offering a new customer service.</h1>
								<p className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
									At our plumbing and septic business, we are proud to offer exceptional customer service. We believe in going above and beyond to meet the needs of our valued clients. Our team is dedicated to providing you with the highest quality service, and we work tirelessly to ensure that you are completely satisfied with our work. We understand that plumbing and septic issues can be stressful, which is why we strive to make the process as easy and stress-free as
									possible. Whether you need routine maintenance or emergency repairs, you can count on us to be there when you need us.
								</p>
							</div>
							<div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
								<div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
									<div className="relative">
										<Image src="/teamGeneric1.png" width={1000} height={1000} alt="Generic plumbing image" className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg" />
										<div className="pointer-events-none absolute inset-0 rounded" />
									</div>
								</div>
								<div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
									<div className="relative">
										<Image src="/teamGeneric2.png" width={1000} height={1000} alt="Generic plumbing image" className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg" />
										<div className="pointer-events-none absolute inset-0 rounded" />
									</div>
									<div className="relative">
										<Image src="/walterwhite.png" width={1000} height={1000} alt="Generic plumbing image" className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg" />
										<div className="pointer-events-none absolute inset-0 rounded" />
									</div>
								</div>
								<div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
									<div className="relative">
										<Image src="/plumbers_talking.png" width={1000} height={1000} alt="Generic plumbing image" className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg" />
										<div className="pointer-events-none absolute inset-0 rounded" />
									</div>
									<div className="relative">
										<Image src="/customerservice.png" width={1000} height={1000} alt="Generic plumbing image" className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg" />
										<div className="pointer-events-none absolute inset-0 rounded" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Content section */}
			<div className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">
				<div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our mission</h2>
					<div className="mt-6 flex flex-col gap-y-20 gap-x-8 lg:flex-row">
						<div className="lg:w-full lg:max-w-2xl lg:flex-auto">
							<p className="text-xl leading-8 text-gray-600">At Wade&apos;s Plumbing & Septic, our mission is to provide exceptional, reliable, and affordable plumbing and septic services to our local community. We are committed to delivering the highest level of customer service, emphasizing professionalism, integrity, and personalized solutions for every client.</p>
							<div className="mt-10 max-w-xl text-base leading-7 text-gray-700">
								<p>As a proud local company, we strive to build lasting relationships with our customers and contribute positively to the well-being and sustainability of our community. By continuously enhancing our skills, utilizing the latest technologies, and prioritizing safety, we aim to exceed customer expectations and set new standards for excellence in the plumbing and septic industry.</p>
								<p className="mt-10">Our dedicated team at Wade&apos;s Plumbing & Septic is passionate about serving you and ensuring that your plumbing and septic systems remain in optimal condition, so you can enjoy the comfort and convenience of your home or business with confidence and peace of mind.</p>
							</div>
						</div>
						<div className="lg:flex lg:flex-auto lg:justify-center">
							<dl className="w-64 space-y-8 xl:w-80">
								{stats.map((stat, index) => (
									<div key={index} className="flex flex-col-reverse gap-y-4">
										<dt className="text-base leading-7 text-gray-600">{stat.label}</dt>
										<dd className="text-5xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
									</div>
								))}
							</dl>
						</div>
					</div>
				</div>
			</div>

			{/* Image section */}
			<div className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
				<Image src="/team.jpg" alt="Wades Plumbing & Septic team photo" width={1216} height={486} className="aspect-[5/2] w-full object-cover xl:rounded-3xl" />
			</div>

			{/* Values section */}
			<div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
				<div className="mx-auto max-w-2xl lg:mx-0">
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our values</h2>
					<p className="mt-6 text-lg leading-8 text-gray-600">We are driven by a strong commitment to our core values, which shape our approach to delivering exceptional plumbing and septic services.</p>
				</div>
				<dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
					{values.map((value, index) => (
						<div key={index}>
							<dt className="font-semibold text-gray-900">{value.name}</dt>
							<dd className="mt-1 text-gray-600">{value.description}</dd>
						</div>
					))}
				</dl>
			</div>

			{/* Team section */}
			<div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-48 lg:px-8">
				<div className="mx-auto max-w-2xl lg:mx-0">
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our team</h2>
					<p className="mt-6 text-xl leading-8 text-gray-600">
						At Wade&apos;s Plumbing & Septic, our greatest asset is our dedicated and skilled team of professionals. We take pride in the exceptional talent, experience, and passion that each of our team members brings to their work. Our team consists of licensed and certified plumbers, septic specialists, and support staff, all of whom share a common goal: to provide the highest level of customer service and plumbing solutions for our valued clients.
					</p>
					<div className="mt-10 max-w-xl text-base leading-7 text-gray-700">
						<p>
							Our team members are not only experts in their respective fields, but they are also committed to continuous learning and professional development. This ensures that we stay at the forefront of industry advancements and best practices, enabling us to deliver cutting-edge solutions to our customers. Furthermore, our team is characterized by their friendly, approachable demeanor and strong work ethic, fostering a positive and collaborative work environment that
							translates to exceptional results for our clients. At Wade&apos;s Plumbing & Septic, we are proud of our team and the outstanding work they do for our community.
						</p>
					</div>
				</div>
				<ul role="list" className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-y-16 gap-x-8 text-center sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-5 xl:grid-cols-5">
					{team.map((person, index) => (
						<li key={index}>
							<Image src={person.imageUrl} width={96} height={96} alt="Photo of Byron Wade" className="mx-auto h-24 w-24 rounded-full" />
							<h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900">{person.name}</h3>
							<p className="text-sm leading-6 text-gray-600">{person.role}</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
