"use client";

import { Sidebar } from "@/components/sections/Sidebar";
import { RelatedArticlesSection } from "@/components/sections/RelatedArticlesSection";
import NewsletterSection from "@/components/sections/NewsletterSection";

interface ClientComponentsProps {
	pathname: string;
	sidebarContent: any;
	relatedArticles: any;
}

export default function ClientComponents({ pathname, sidebarContent, relatedArticles }: ClientComponentsProps) {
	return (
		<>
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-wrap -mx-4">
					<div className="w-full lg:w-2/3 px-4">{/* Main content will be rendered by the parent */}</div>
					<div className="w-full mt-8 lg:w-1/3 lg:pl-8">
						<div className="sticky top-4">
							<Sidebar pathname={pathname} data={sidebarContent} />
						</div>
					</div>
				</div>
			</div>
			<RelatedArticlesSection pathname={pathname} data={relatedArticles} />
			<NewsletterSection />
		</>
	);
}
