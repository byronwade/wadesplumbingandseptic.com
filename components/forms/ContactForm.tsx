'use client'

import { useForm, ValidationError } from '@formspree/react'
import { track } from '@vercel/analytics/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function ContactForm() {
  const pathname = usePathname()
  const [state, handleSubmit] = useForm('xrgvaaqg')
  const [formData, setFormData] = useState({
    'full-name': '',
    phone: '',
    email: '',
    address: '',
    message: ''
  })

  if (state.succeeded) {
    return (
      <div className="p-4 text-center bg-green-100 rounded-md">
        <h2 className="text-lg font-bold text-green-700">Success</h2>
        <p className="text-green-600">We will have someone call or email as quickly as possible!</p>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
		<form onSubmit={handleSubmit} className="lg:flex-auto" suppressHydrationWarning>
			<input type="text" name="pathname" id="pathname" className="hidden" defaultValue={pathname} />
			<div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
				<div>
					<label htmlFor="full-name" className="block text-sm font-semibold leading-6 text-gray-900">
						Full name
					</label>
					<div className="mt-2.5">
						<input placeholder="Mario Mario" required type="text" name="full-name" id="full-name" autoComplete="given-name" className="block w-full rounded border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 text-base sm:leading-6" value={formData["full-name"]} onChange={handleChange} />
					</div>
					<ValidationError prefix="Full Name" field="full-name" errors={state.errors} />
				</div>
				<div>
					<label htmlFor="phone" className="block text-sm font-semibold leading-6 text-gray-900">
						Phone
					</label>
					<div className="mt-2.5">
						<input autoComplete="tel" placeholder="831-225-4344" required id="phone" name="phone" type="tel" className="block w-full rounded border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 text-base sm:leading-6" value={formData.phone} onChange={handleChange} />
					</div>
					<ValidationError prefix="Phone" field="phone" errors={state.errors} />
				</div>
				<div>
					<label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
						Email
					</label>
					<div className="mt-2.5">
						<input autoComplete="email" placeholder="support@wadesinc.io" required id="email" name="email" type="email" className="block w-full rounded border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 text-base sm:leading-6" value={formData.email} onChange={handleChange} />
					</div>
					<ValidationError prefix="Email" field="email" errors={state.errors} />
				</div>
				<div>
					<label htmlFor="address" className="block text-sm font-semibold leading-6 text-gray-900">
						Address
					</label>
					<div className="mt-2.5">
						<input placeholder="Mushroom Kingdom" autoComplete="street-address" required id="address" name="address" type="text" className="block w-full rounded border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 text-base sm:leading-6" value={formData.address} onChange={handleChange} />
					</div>
					<ValidationError prefix="Address" field="address" errors={state.errors} />
				</div>
				<div className="sm:col-span-2">
					<label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
						Message
					</label>
					<div className="mt-2.5">
						<textarea placeholder="Tell us about your project..." required id="message" name="message" rows={4} className="block w-full rounded border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 text-base sm:leading-6" value={formData.message} onChange={handleChange} />
					</div>
					<ValidationError prefix="Message" field="message" errors={state.errors} />
				</div>
			</div>
			<div className="mt-4">
				<button
					onClick={() => {
						track("Form Submit");
					}}
					disabled={state.submitting}
					type="submit"
					className="block w-full rounded bg-brand-700 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
				>
					Get a Quote
				</button>
			</div>
			<p className="mt-4 text-sm leading-6 text-gray-700">
				By submitting this form, I agree to the{" "}
				<Link href="/about-us/privacy-policy" className="font-medium text-brand-700 dark:text-brand-500 hover:underline">
					privacy policy
				</Link>
				.
			</p>
		</form>
  );
}