import Image from "next/image";
import { truncateString } from "@/lib/truncate";
import Link from "next/link";
import ContactForm from "../forms/ContactForm";

export default function Sidebar({ data, pathname }) {
	return (
		<aside className="hidden xl:block" aria-labelledby="sidebar-label">
			<div className="xl:w-[336px]">
				<h3 id="sidebar-label" className="sr-only">
					Sidebar
				</h3>
				<div className="mb-8">
					<ContactForm />
				</div>
				<div className="mb-12">
					<h4 className="mb-4 text-sm font-bold text-gray-900 uppercase dark:text-white">Latest Tips</h4>
					{data?.slice(0, 3).map((post, index) => (
						<Link href={`${pathname}/${post.slug}`} key={index} className="flex items-start mb-6">
							<span className="shrink-0">
								<Image sizes={post?.featuredImage?.sizes} width={96} height={96} src={post?.featuredImage?.sourceurl ? post.featuredImage.sourceurl : "/placeholder.webp"} alt={post?.featuredImage?.alttext ? post.featuredImage.alttext : "/placeholder.webp"} className="w-24 h-24 max-w-full mr-4 rounded" />
							</span>
							<div>
								<h5 className="mb-2 text-lg font-bold leading-tight text-gray-900 dark:text-white">{post.title}</h5>
								<div className="mb-2 font-light text-gray-500 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: truncateString(post.excerpt, 40) }} />
								<span className="inline-flex items-center font-medium underline underline-offset-4 text-brand-800 dark:text-brand-500 hover:no-underline">Read in {post.readingtime} minutes</span>
							</div>
						</Link>
					))}
				</div>
			</div>
		</aside>
	);
}
