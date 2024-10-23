"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import SubscriptionForm from "../forms/SubscriptionForm";

export default function Modal() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button type="button" onClick={() => setOpen(true)} className="text-white bg-brand hover:bg-brand-600 focus:ring-4 focus:ring-brand-300 font-medium rounded text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-brand-600 dark:hover:bg-brand-700 focus:outline-none dark:focus:ring-brand-800 text-center w-full">
				Subscribe
			</button>
			<Transition.Root show={open} as={Fragment}>
				<Dialog as="div" className="relative z-50" onClose={setOpen}>
					<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
							<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
								<Dialog.Panel className="relative transform overflow-hidden rounded bg-white px-4 pt-5 pb-4 text-left shadow transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
									<Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
										Sign up for our newsletter
									</Dialog.Title>
									<div className="mt-6 text-center">
										<SubscriptionForm />
										<button type="button" className="mt-6 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto" onClick={() => setOpen(false)}>
											Close
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
}
