import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "react-feather";

/**
 * Component to display a list of services with pagination.
 * @param {Object} props - The component props.
 * @param {Object[]} props.services - The list of services to display.
 * @param {number} props.itemsPerPage - The number of items to display per page.
 * @returns {JSX.Element} The services component.
 */
export default function Services({ services, itemsPerPage }) {
	return (
		<div className="flex items-center justify-center w-full mt-10">
			<div className="container grid max-w-screen-xl gap-8 lg:grid-cols-2 lg:grid-rows-2">
				{services.length > 0 ? (
					services.slice(0, itemsPerPage).map((service, index) => (
						<Link href={`/services/${service.slug}`} key={service.id} className={`max-h-min relative group flex flex-col rounded border border-slate-200 bg-white ${index % 4 === 0 ? "row-span-2" : ""}`}>
							<div className="relative h-96">
								<Image placeholder="blur" blurDataURL={service?.featuredImage?.sourceurl || "/placeholder.webp"} fill sizes={service?.featuredImage?.sizes} src={service?.featuredImage?.sourceurl || "/placeholder.webp"} className="object-cover object-center w-full rounded-t" alt={service?.featuredImage?.alttext || "placeholder text"} />
							</div>
							<div className="p-10">
								<h3 className="text-xl font-medium text-gray-700">{service.title}</h3>
								<div className="mt-2 text-slate-500" dangerouslySetInnerHTML={{ __html: service.excerpt }} />
								<span className="inline-flex mt-2 group-hover:underline text-sky-500">
									Read in {service.readingtime} min <ArrowRight className="self-center inline-block w-4 h-4 ml-3" />
								</span>
							</div>
						</Link>
					))
				) : (
					<div className="py-10 text-center col-span-full">No data</div>
				)}
			</div>
		</div>
	);
}
