"use client";

import Image from "next/image";
import { truncateString } from "@/lib/truncate";
import Link from "next/link";
import ContactForm from "../forms/ContactForm";

interface SidebarProps {
	pathname: string;
	data: {
		categories: any[];
		recentPosts: any[];
		popularPosts: any[];
	};
}

export function Sidebar({ pathname, data }: SidebarProps) {
	const { categories, recentPosts, popularPosts } = data;

	return (
		<aside className="hidden xl:block" aria-labelledby="sidebar-label">
			<div className="xl:w-[336px]">
				<h3 id="sidebar-label" className="sr-only">
					Sidebar
				</h3>
				<div className="mb-8">
					<ContactForm />
				</div>
				{/* Categories */}
				{categories.length > 0 && (
					<div className="mb-8">
						<h4 className="mb-4 text-sm font-bold text-gray-900 uppercase dark:text-white">Categories</h4>
						<ul className="space-y-4">
							{categories.map((category, index) => (
								<li key={index}>
									<Link href={`${pathname}/category/${category.slug}`} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
										{category.name} ({category.count})
									</Link>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Recent Posts */}
				{recentPosts.length > 0 && (
					<div className="mb-8">
						<h4 className="mb-4 text-sm font-bold text-gray-900 uppercase dark:text-white">Recent Posts</h4>
						<ul className="space-y-4">
							{recentPosts.map((post, index) => (
								<li key={index}>
									<Link href={`${pathname}/${post.slug}`} className="block group">
										{post.featuredImage && (
											<div className="relative w-full h-48 mb-3">
												<Image fill src={post.featuredImage[0]?.sourceurl || "/placeholder.webp"} alt={post.featuredImage[0]?.alttext || post.title} className="object-cover rounded" />
											</div>
										)}
										<h5 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-brand-600 dark:text-white">{post.title}</h5>
										<div className="text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: truncateString(post.excerpt, 120) }} />
									</Link>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Popular Posts */}
				{popularPosts.length > 0 && (
					<div className="mb-8">
						<h4 className="mb-4 text-sm font-bold text-gray-900 uppercase dark:text-white">Popular Posts</h4>
						<ul className="space-y-4">
							{popularPosts.map((post, index) => (
								<li key={index}>
									<Link href={`${pathname}/${post.slug}`} className="block group">
										{post.featuredImage && (
											<div className="relative w-full h-48 mb-3">
												<Image fill src={post.featuredImage[0]?.sourceurl || "/placeholder.webp"} alt={post.featuredImage[0]?.alttext || post.title} className="object-cover rounded" />
											</div>
										)}
										<h5 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-brand-600 dark:text-white">{post.title}</h5>
										<div className="text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: truncateString(post.excerpt, 120) }} />
									</Link>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</aside>
	);
}
