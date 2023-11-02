import Image from "next/image";
import Modal from "../ui/Modal";
import { truncateString } from "../../helpers/truncate";
import Link from "next/link";

export default function Sidebar({ data, pathname }) {
	return (
		<aside className="hidden xl:block" aria-labelledby="sidebar-label">
			<div className="xl:w-[336px] sticky top-6">
				<h3 id="sidebar-label" className="sr-only">
					Sidebar
				</h3>
				<div className="mb-8">
					<h4 className="mb-2 text-sm font-bold text-gray-900 dark:text-white uppercase">Get updates every morning</h4>
					<p className="mb-4 text-sm font-light text-gray-500 dark:text-gray-400">Get all the stories you need-to-know from the most powerful name in plumbing news delivered first thing every morning to your inbox</p>
					<Modal />
				</div>
				<div className="mb-12">
					<h4 className="mb-4 text-sm font-bold text-gray-900 dark:text-white uppercase">Latest Tips</h4>
					{data?.slice(0, 3).map((post, index) => (
						<Link href={`${pathname}/${post.slug}`} key={index} className="mb-6 flex items-start">
							<span className="shrink-0">
								<Image sizes={post?.featuredImage?.sizes} width={96} height={96} src={post?.featuredImage?.sourceurl ? post.featuredImage.sourceurl : "/placeholder.webp"} alt={post?.featuredImage?.alttext ? post.featuredImage.alttext : "/placeholder.webp"} className="mr-4 max-w-full w-24 h-24 rounded" />
							</span>
							<div>
								<h5 className="mb-2 text-lg font-bold leading-tight dark:text-white text-gray-900">{post.title}</h5>
								<div className="mb-2 font-light text-gray-500 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: truncateString(post.excerpt, 40) }} />
								<span className="inline-flex items-center font-medium underline underline-offset-4 text-brand-800 dark:text-brand-500 hover:no-underline">Read in {post.readingtime} minutes</span>
							</div>
						</Link>
					))}
				</div>
				{/* <div className="hidden md:block">
					<a href="#" className="flex justify-center items-center mb-3 w-full h-48 bg-gray-100 rounded dark:bg-gray-700">
						<svg aria-hidden="true" className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
						</svg>
					</a>
					<p className="mb-2 text-sm font-light text-gray-500 dark:text-gray-400">Students and Teachers, save up to 60% on Flowbite Creative Cloud.</p>
					<p className="text-xs font-light text-gray-400 uppercase dark:text-gray-500">Ads placeholder</p>
				</div> */}
			</div>
		</aside>
	);
}
