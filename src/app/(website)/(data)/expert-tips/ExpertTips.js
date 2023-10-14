import Link from "next/link";
import Image from "next/image";
import { ArrowLongRightIcon } from "@heroicons/react/20/solid";

export default async function ExpertTips({ tips, itemsPerPage }) {
	return (
		<div className="grid gird-col-1 md:grid-cols-2 lg:grid-col-3 xl:grid-cols-4 auto-rows-auto gap-6 mt-10 items-stretch w-full">
			{tips.length > 0 ? (
				tips.slice(0, itemsPerPage).map((tip, index) => {
					if (index % 7 === 0) {
						return (
							<Link href={`/expert-tips/${tip.slug}`} key={index} className="max-h-90 w-full relative group col-spane-1 row-span-1 xl:col-span-2 xl:row-span-2">
								<div className="z-20">
									<p className="z-20 md:p-10 p-6 text-xs font-medium leading-3 text-white absolute top-0 right-0">12 April 2021</p>
									<div className="z-20 absolute bottom-0 left-0 md:p-10 p-6">
										<h2 className="text-xl font-semibold 5 text-white">{tip.title}</h2>
										<span className="group-hover:underline focus:outline-none focus:underline flex items-center mt-4 cursor-pointer text-white hover:text-gray-200 hover:underline">
											<p className="pr-2 text-sm font-medium leading-none">
												Read in {tip.readingtime} min <ArrowLongRightIcon className="inline-block self-center ml-3 w-4 h-4" />
											</p>
										</span>
									</div>
								</div>
								<Image placeholder="blur" blurDataURL={tip?.featuredImage?.sourceurl ? tip.featuredImage.sourceurl : "/placeholder.webp"} width={500} height={500} src={tip?.featuredImage?.sourceurl ? tip.featuredImage.sourceurl : "/placeholder.webp"} className="brightness-75 z-10 h-full w-full object-cover object-center rounded" alt={tip?.featuredImage?.alttext ? tip.featuredImage.alttext : "placeholder text"} />
							</Link>
						);
					} else {
						return (
							<Link href={`/expert-tips/${tip.slug}`} key={tip.id} className="max-h-45 w-full relative group row-span-1">
								<div className="z-20">
									<p className="z-20 p-6 text-xs font-medium leading-3 text-white absolute top-0 right-0">12 April 2021</p>
									<div className="z-20 absolute bottom-0 left-0 p-6">
										<h2 className="text-xl font-semibold 5 text-white">{tip.title}</h2>
										<span className="group-hover:underline focus:outline-none focus:underline flex items-center mt-4 cursor-pointer text-white hover:text-gray-200 hover:underline">
											<p className="pr-2 text-sm font-medium leading-none">
												Read in {tip.readingtime} min <ArrowLongRightIcon className="inline-block self-center ml-3 w-4 h-4" />
											</p>
										</span>
									</div>
								</div>
								<Image placeholder="blur" blurDataURL={tip?.featuredImage?.sourceurl ? tip.featuredImage.sourceurl : "/placeholder.webp"} width={500} height={500} src={tip?.featuredImage?.sourceurl ? tip.featuredImage.sourceurl : "/placeholder.webp"} className="brightness-75 z-10 h-full w-full object-cover object-center rounded" alt={tip?.featuredImage?.alttext ? tip.featuredImage.alttext : "placeholder text"} />
							</Link>
						);
					}
				})
			) : (
				<div className="col-span-full text-center py-10">No data</div>
			)}
		</div>
	);
}
