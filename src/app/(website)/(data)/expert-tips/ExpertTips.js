import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "react-feather";

/**
 * Component to display a list of expert tips with pagination.
 * @param {Object} props - The component props.
 * @param {Object[]} props.tips - The list of tips to display.
 * @param {number} props.itemsPerPage - The number of items to display per page.
 * @returns {JSX.Element} The expert tips component.
 */
export default function ExpertTips({ tips, itemsPerPage }) {
	return (
		<div className="grid items-stretch w-full grid-cols-1 gap-6 mt-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto">
			{tips.length > 0 ? (
				tips.slice(0, itemsPerPage).map((tip, index) => (
					<Link href={`/expert-tips/${tip.slug}`} key={tip.id} className={`max-h-90 w-full relative group ${index % 7 === 0 ? "col-span-1 row-span-1 xl:col-span-2 xl:row-span-2" : "max-h-45 row-span-1"}`}>
						<div className="z-20">
							<p className="absolute top-0 right-0 z-20 p-6 text-xs font-medium leading-3 text-white">12 April 2021</p>
							<div className="absolute bottom-0 left-0 z-20 p-6">
								<h2 className="text-xl font-semibold text-white">{tip.title}</h2>
								<span className="flex items-center mt-4 text-white cursor-pointer group-hover:underline focus:outline-none focus:underline hover:text-gray-200 hover:underline">
									Read in {tip.readingtime} min <ArrowRight className="self-center inline-block w-4 h-4 ml-3" />
								</span>
							</div>
						</div>
						<Image placeholder="blur" blurDataURL={tip?.featuredImage?.sourceurl || "/placeholder.webp"} width={500} height={500} src={tip?.featuredImage?.sourceurl || "/placeholder.webp"} className="z-10 object-cover object-center w-full h-full rounded brightness-75" alt={tip?.featuredImage?.alttext || "placeholder text"} />
					</Link>
				))
			) : (
				<div className="py-10 text-center col-span-full">No data</div>
			)}
		</div>
	);
}
