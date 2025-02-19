"use client";

import SubscriptionForm from "../forms/SubscriptionForm";

export default function NewsletterSection() {
	return (
		<section className="bg-gray-50">
			<div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
				<div className="mx-auto max-w-screen-md sm:text-center">
					<h2 className="mb-4 text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">Sign up for our newsletter</h2>
					<p className="mx-auto mb-8 max-w-2xl text-gray-500 md:mb-12 sm:text-xl">Stay up to date with the latest plumbing tips, news, and updates from our team of experts.</p>
					<SubscriptionForm />
				</div>
			</div>
		</section>
	);
}
