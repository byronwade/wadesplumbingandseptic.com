import SubscriptionForm from "../forms/SubscriptionForm";

export default function NewsletterSection() {
	return (
		<section className="bg-gray-50 dark:bg-gray-800">
			<div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
				<div className="mx-auto max-w-screen-md sm:text-center">
					<h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Sign up for our newsletter</h2>
					<p className="mx-auto mb-8 max-w-2xl font-light text-gray-500 md:mb-12 sm:text-xl dark:text-gray-400">Stay up to date with the roadmap progress, announcements and exclusive discounts feel free to sign up with your email.</p>
					<SubscriptionForm />
				</div>
			</div>
		</section>
	);
}
