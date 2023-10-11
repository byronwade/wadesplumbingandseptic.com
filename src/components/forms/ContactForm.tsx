"use client";
import { useForm, ValidationError } from "@formspree/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ContactForm() {
	const pathname = usePathname();
	const [state, handleSubmit] = useForm("xrgvaaqg");
	if (state.succeeded) {
		return (
			<>
				<div>
					<h1 className="text-lg font-bold text-green">Success</h1>
					<p>We will have somone call or email as quickly as possable!</p>
				</div>
			</>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="lg:flex-auto">
			<input type="text" name="pathname" id="pathname" className="hidden" defaultValue={pathname} />
			<div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
				<div>
					<label htmlFor="full-name" className="block text-sm font-semibold leading-6 text-gray-900">
						Full name
					</label>
					<div className="mt-2.5">
						<input placeholder="Mario Mario" required type="text" name="full-name" id="full-name" autoComplete="given-name" className="block w-full rounded border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 text-base sm:leading-6" />
					</div>
					<ValidationError prefix="Full Name" field="full-name" errors={state.errors} />
				</div>
				<div>
					<label htmlFor="phone" className="block text-sm font-semibold leading-6 text-gray-900">
						Phone
					</label>
					<div className="mt-2.5">
						<input placeholder="831-225-4344" required id="phone" name="phone" type="text" className="block w-full rounded border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 text-base sm:leading-6" />
					</div>
					<ValidationError prefix="Phone" field="phone" errors={state.errors} />
				</div>
				<div>
					<label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
						Email
					</label>
					<div className="mt-2.5">
						<input placeholder="support@wadesinc.io" required id="email" name="email" type="text" className="block w-full rounded border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 text-base sm:leading-6" />
					</div>
					<ValidationError prefix="Email" field="email" errors={state.errors} />
				</div>
				<div>
					<label htmlFor="address" className="block text-sm font-semibold leading-6 text-gray-900">
						Address
					</label>
					<div className="mt-2.5">
						<input placeholder="Mashroom Kingdom" autoComplete="street-address" required id="address" name="address" type="text" className="block w-full rounded border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 text-base sm:leading-6" />
					</div>
					<ValidationError prefix="Address" field="address" errors={state.errors} />
				</div>
				<div className="sm:col-span-2">
					<label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
						Message
					</label>
					<div className="mt-2.5">
						<textarea placeholder="Tell us sbout your project..." required id="message" name="message" rows={4} className="block w-full rounded border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 text-base sm:leading-6" defaultValue={""} />
					</div>
					<ValidationError prefix="Message" field="message" errors={state.errors} />
				</div>
				{/* <div className="sm:col-span-2">
					<div className="g-recaptcha" data-sitekey="6LesgyQlAAAAAN02Rvm8CYhtc1NRrKtAZ40hVvnt"></div>
				</div> */}
			</div>
			<div className="mt-4">
				<button disabled={state.submitting} type="submit" className="block w-full rounded bg-brand-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
					Get a Quote
				</button>
			</div>
			<p className="mt-4 text-sm leading-6 text-gray-700">
				By submitting this form, I agree to the{" "}
				<Link href="/about-us/privacy-policy" className="font-medium text-brand-600 dark:text-brand-500 hover:underline">
					privacy policy
				</Link>
				.
			</p>
		</form>
	);
}
