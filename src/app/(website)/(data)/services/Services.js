import Link from "next/link";
import Image from "next/image";
import { ArrowLongRightIcon } from "@heroicons/react/20/solid";

export default function Services({ services, itemsPerPage }) {
	return (
		<div className="flex mt-10 items-center justify-center w-full">
			<div className="container grid max-w-screen-xl gap-8 lg:grid-cols-2 lg:grid-rows-2">
				{services.length > 0 ? (
					services.slice(0, itemsPerPage).map((service, index) => {
						if (index % 4 === 0) {
							return (
								<Link href={`/services/${service.slug}`} key={service.id} className="max-h-min relative group row-span-2 flex flex-col rounded border border-slate-200 bg-white">
									<div className="h-96 relative">
										<Image placeholder="blur" blurDataURL={service?.featuredImage?.sourceurl ? service.featuredImage.sourceurl : "/placeholder.webp"} fill sizes={service?.featuredImage?.sizes} src={service?.featuredImage?.sourceurl ? service.featuredImage.sourceurl : "/placeholder.webp"} className="w-full object-cover object-center rounded-t" alt={service?.featuredImage?.alttext ? service.featuredImage.alttext : "placeholder text"} />
									</div>
									<div className="p-10">
										<h3 className="text-xl font-medium text-gray-700">{service.title}</h3>
										<div className="mt-2 text-slate-500" dangerouslySetInnerHTML={{ __html: service.excerpt }} />
										<span className="group-hover:underline mt-2 inline-flex text-sky-500">
											Read in {service.readingtime} min <ArrowLongRightIcon className="inline-block self-center ml-3 w-4 h-4" />
										</span>
									</div>
								</Link>
							);
						} else {
							return (
								<Link href={`/services/${service.slug}`} key={service.id} className="group flex rounded border border-slate-200 bg-white">
									<div className="flex-1 p-10">
										<h3 className="text-xl font-medium text-gray-700">{service.title}</h3>
										<div className="mt-2 text-slate-500" dangerouslySetInnerHTML={{ __html: service.excerpt }} />
										<span className="group-hover:underline mt-2 inline-flex text-sky-500">
											Read in {service.readingtime} min <ArrowLongRightIcon className="inline-block self-center ml-3 w-4 h-4" />
										</span>
									</div>
									<div className="relative hidden h-full w-1/3 overflow-hidden lg:block">
										<div className="absolute inset-0">
											<Image placeholder="blur" blurDataURL={service?.featuredImage?.sourceurl ? service.featuredImage.sourceurl : "/placeholder.webp"} fill sizes={service?.featuredImage?.sizes} src={service?.featuredImage?.sourceurl ? service.featuredImage.sourceurl : "/placeholder.webp"} className="w-full object-cover object-center rounded-t" alt={service?.featuredImage?.alttext ? service.featuredImage.alttext : "placeholder text"} />
										</div>
									</div>
								</Link>
							);
						}
					})
				) : (
					<div className="col-span-full text-center py-10">No data</div>
				)}
			</div>
		</div>
	);
}
