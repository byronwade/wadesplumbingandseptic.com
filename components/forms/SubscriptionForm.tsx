"use client";

import { useState } from "react";
import { track } from "@vercel/analytics/react";

export default function SubscriptionForm() {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStatus("loading");

		try {
			track("Newsletter Subscription");
			const response = await fetch("/api/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			if (!response.ok) throw new Error("Subscription failed");

			setStatus("success");
			setMessage("Thank you for subscribing!");
			setEmail("");
		} catch (error) {
			setStatus("error");
			setMessage("Failed to subscribe. Please try again.");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mt-4">
			<div className="flex items-center max-w-md gap-x-4">
				<div className="relative flex-auto min-w-0">
					<label htmlFor="email" className="sr-only">
						Email address
					</label>
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
							<path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
						</svg>
					</div>
					<input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6" placeholder="Enter your email" required disabled={status === "loading"} />
				</div>
				<button type="submit" disabled={status === "loading"} className="flex-none rounded-md bg-brand-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50">
					{status === "loading" ? "Subscribing..." : "Subscribe"}
				</button>
			</div>
			{message && <p className={`mt-2 text-sm ${status === "success" ? "text-green-600" : "text-red-600"}`}>{message}</p>}
		</form>
	);
}
