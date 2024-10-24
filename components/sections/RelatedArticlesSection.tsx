import Image from "next/image";
import Link from "next/link";
import { truncateString } from "@/lib/truncate";
import { getTips } from "@/actions/getTips";

export default async function RelatedArticlesSection({ pathname }) {
	const { tips: relatedTips } = await getTips({ page: 1 });
	const truncatedPosts = relatedTips?.slice(0, 4);

	if (!truncatedPosts || truncatedPosts.length === 0) {
		return null;
	}

	return (
		<section className="py-8 bg-white lg:py-24 dark:bg-gray-900">
			<div className="container px-4 mx-auto">
				<h2 className="mb-6 text-2xl font-bold text-gray-900 lg:mb-8 dark:text-white">Related articles</h2>
				<div className="grid gap-6 lg:gap-12 md:grid-cols-2">
					{truncatedPosts?.map((post, index) => (
						<Link key={index} href={`${pathname}/${post.slug}`}>
							<article className="flex flex-col xl:flex-row">
								<div className="relative w-full h-40 mb-2 mr-5 xl:mb-0">
									<Image sizes={post?.featuredImage?.[0]?.sizes} fill src={post?.featuredImage?.[0]?.sourceurl || "/placeholder.webp"} alt={post?.featuredImage?.[0]?.alttext || "placeholder image"} className="object-cover object-center w-full rounded" />
								</div>
								<div className="flex flex-col justify-center">
									<h2 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
										<span>{post.title}</span>
									</h2>
									<div className="max-w-sm mb-4 font-light text-gray-500 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: truncateString(post?.excerpt, 100) }} />
									<span className="inline-flex items-center font-medium underline underline-offset-4 text-brand-800 dark:text-brand-500 hover:no-underline">Read in {post.readingtime} minutes</span>
								</div>
							</article>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
