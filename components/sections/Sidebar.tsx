import Image from "next/image";
import { truncateString } from "@/lib/truncate";
import Link from "next/link";
import ContactForm from "../forms/ContactForm";
import { getTips } from "@/actions/getTips";

export default async function Sidebar({ pathname }: { pathname: string }) {
	const { tips } = await getTips({ page: 1 });

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
					{tips?.slice(0, 3).map((post, index) => (
						<div key={index} className="mb-6">
							<Image sizes={post?.featuredImage?.[0]?.sizes} width={336} height={189} src={post?.featuredImage?.[0]?.sourceurl || "/placeholder.webp"} alt={post?.featuredImage?.[0]?.alttext || "placeholder image"} className="w-full h-auto max-w-full mb-4 rounded" />
							<Link href={`${pathname}/${post.slug}`} className="block">
								<h5 className="mb-2 text-lg font-bold leading-tight text-gray-900 dark:text-white">{post.title}</h5>
								<div className="mb-2 font-light text-gray-500 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: truncateString(post.excerpt, 40) }} />
								<span className="inline-flex items-center font-medium underline underline-offset-4 text-brand-800 dark:text-brand-500 hover:no-underline">Read in {post.readingtime} minutes</span>
							</Link>
						</div>
					))}
				</div>
			</div>
		</aside>
	);
}
