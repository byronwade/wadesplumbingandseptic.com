"use client";
import { useForm, ValidationError } from "@formspree/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function JobForm() {
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
			<div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
				<div>
					<label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">
						First name
					</label>
					<div className="mt-2.5">
						<input placeholder="Mario" required type="text" name="first-name" id="first-name" autoComplete="given-name" className="block w-full rounded border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 text-base sm:leading-6" />
					</div>
					<ValidationError prefix="First Name" field="first-name" errors={state.errors} />
				</div>
				<div>
					<label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">
						Last name
					</label>
					<div className="mt-2.5">
						<input placeholder="Mario" required type="text" name="last-name" id="last-name" autoComplete="family-name" className="block w-full rounded border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 text-base sm:leading-6" />
					</div>
					<ValidationError prefix="Last Name" field="last-name" errors={state.errors} />
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
					<label htmlFor="address" className="block text-sm font-semibold leading-6 text-gray-900">
						Address
					</label>
					<div className="mt-2.5">
						<input placeholder="Mashroom Kingdom" autoComplete="street-address" required id="address" name="address" type="text" className="block w-full rounded border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 text-base sm:leading-6" />
					</div>
					<ValidationError prefix="Address" field="address" errors={state.errors} />
				</div>
				<div className="sm:col-span-2">
					<label htmlFor="resume" className="block text-sm font-semibold leading-6 text-gray-900">
						Resume
					</label>
					<div className="mt-2 sm:col-span-2 sm:mt-0">
						<div className="flex justify-center rounded border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
							<div className="space-y-1 text-center">
								<svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
									<path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								<div className="flex text-sm text-gray-600 items-center">
									<label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-brand-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2 hover:text-brand-500">
										<span>Upload a file</span>
										<input id="file-upload" name="file-upload" type="file" className="sr-only" />
									</label>
									<p className="pl-1">or drag and drop</p>
								</div>
								<p className="text-xs text-gray-500">PDF, DOC, PNG up to 10MB</p>
							</div>
						</div>
					</div>
					<ValidationError prefix="resume" field="resume" errors={state.errors} />
				</div>
				<div className="sm:col-span-2">
					<label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
						Message
					</label>
					<div className="mt-2.5">
						<textarea placeholder="Tell us why you would be a good fit..." required id="message" name="message" rows={4} className="block w-full rounded border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 text-base sm:leading-6" defaultValue={""} />
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
