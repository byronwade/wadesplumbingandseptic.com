"use client"

import { useId, useRef, useState, type FormEvent } from "react"

import { CallButton } from "@/components/call-button"
import { Check, CircleHelp, Loader2 } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import {
	parseQuoteRequest,
	quoteSuccessCopy,
	quoteUnavailableCopy,
	type QuoteField,
	type QuoteTownOption,
} from "@/lib/quote-request"
import { cn } from "@/lib/utils"

type FormStatus = "idle" | "submitting" | "success" | "error"

const fieldClass =
	"field-input mt-2 block w-full disabled:cursor-not-allowed disabled:opacity-60"

function fieldFromForm(form: HTMLFormElement): Record<string, string> {
	const data = new FormData(form)
	const payload: Record<string, string> = {}
	for (const [key, value] of data.entries()) {
		if (typeof value === "string") payload[key] = value
	}
	return payload
}

export function QuoteForm({
	towns,
	initialError = null,
}: {
	towns: QuoteTownOption[]
	initialError?: string | null
}) {
	const formId = useId()
	const successRef = useRef<HTMLHeadingElement>(null)
	const [status, setStatus] = useState<FormStatus>("idle")
	const [errors, setErrors] = useState<Partial<Record<QuoteField, string>>>({})
	const [formError, setFormError] = useState<string | null>(initialError)

	const nameId = `${formId}-name`
	const phoneId = `${formId}-phone`
	const emailId = `${formId}-email`
	const townId = `${formId}-town`
	const messageId = `${formId}-message`
	const honeyId = `${formId}-website`

	function describedBy(id: string, field: QuoteField) {
		return errors[field] ? `${id}-error` : undefined
	}

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (status === "submitting") return

		const payload = fieldFromForm(event.currentTarget)
		const parsed = parseQuoteRequest(payload, towns)
		if (!parsed.ok) {
			setStatus("idle")
			setErrors(parsed.errors)
			setFormError("Please fix the highlighted fields and try again.")
			return
		}

		setErrors({})
		setFormError(null)
		setStatus("submitting")

		try {
			const response = await fetch("/api/quote", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			})
			const body: unknown = await response.json().catch(() => null)
			const payloadBody =
				body && typeof body === "object"
					? (body as Record<string, unknown>)
					: {}

			if (response.status === 400 && payloadBody.errors) {
				setErrors(payloadBody.errors as Partial<Record<QuoteField, string>>)
				setFormError("Please fix the highlighted fields and try again.")
				setStatus("idle")
				return
			}

			if (!response.ok) {
				setFormError(
					typeof payloadBody.error === "string"
						? payloadBody.error
						: quoteUnavailableCopy,
				)
				setStatus("error")
				return
			}

			setStatus("success")
			queueMicrotask(() => successRef.current?.focus())
		} catch {
			setFormError(quoteUnavailableCopy)
			setStatus("error")
		}
	}

	if (status === "success") {
		return (
			<div
				className="border-border bg-card rounded-xl border p-5 shadow-[var(--shadow-panel)] sm:p-7"
				role="status"
			>
				<p className="text-primary text-xs font-medium">Request received</p>
				<h3 className="type-subtitle mt-2" ref={successRef} tabIndex={-1}>
					{quoteSuccessCopy.title}
				</h3>
				<p className="text-muted-foreground mt-3 text-[0.9375rem] leading-relaxed">
					<Check
						aria-hidden="true"
						className="text-primary mr-2 inline size-4 align-text-bottom"
					/>
					{quoteSuccessCopy.body}
				</p>
				<div className="mt-6">
					<CallButton
						className="w-full sm:w-auto"
						desktopLabel={`Call ${contactInfo.phoneDisplay}`}
						size="lg"
					/>
				</div>
			</div>
		)
	}

	return (
		<form
			action="/api/quote"
			className="border-border bg-card relative rounded-xl border p-5 shadow-[var(--shadow-panel)] sm:p-7"
			method="post"
			noValidate
			onSubmit={onSubmit}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden"
			>
				<label htmlFor={honeyId}>Company website</label>
				<input
					autoComplete="off"
					id={honeyId}
					name="website"
					tabIndex={-1}
					type="text"
				/>
			</div>

			{formError ? (
				<p
					className="border-destructive/40 bg-destructive/10 text-destructive mb-5 flex gap-2 rounded-md border px-3 py-3 text-sm"
					role="alert"
				>
					<CircleHelp aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
					<span>{formError}</span>
				</p>
			) : null}

			<div className="grid gap-5">
				<div>
					<label className="text-sm font-semibold" htmlFor={nameId}>
						Name
					</label>
					<input
						autoComplete="name"
						aria-describedby={describedBy(nameId, "name")}
						aria-invalid={errors.name ? true : undefined}
						className={fieldClass}
						id={nameId}
						maxLength={80}
						name="name"
						required
						type="text"
					/>
					{errors.name ? (
						<p
							className="text-destructive mt-1.5 text-sm"
							id={`${nameId}-error`}
						>
							{errors.name}
						</p>
					) : null}
				</div>

				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
					<div>
						<label className="text-sm font-semibold" htmlFor={phoneId}>
							Phone
						</label>
						<input
							autoComplete="tel"
							aria-describedby={describedBy(phoneId, "phone")}
							aria-invalid={errors.phone ? true : undefined}
							className={fieldClass}
							id={phoneId}
							inputMode="tel"
							maxLength={32}
							name="phone"
							required
							type="tel"
						/>
						{errors.phone ? (
							<p
								className="text-destructive mt-1.5 text-sm"
								id={`${phoneId}-error`}
							>
								{errors.phone}
							</p>
						) : null}
					</div>
					<div>
						<label className="text-sm font-semibold" htmlFor={emailId}>
							Email{" "}
							<span className="text-muted-foreground font-normal">
								(optional)
							</span>
						</label>
						<input
							autoComplete="email"
							aria-describedby={describedBy(emailId, "email")}
							aria-invalid={errors.email ? true : undefined}
							className={fieldClass}
							id={emailId}
							maxLength={120}
							name="email"
							type="email"
						/>
						{errors.email ? (
							<p
								className="text-destructive mt-1.5 text-sm"
								id={`${emailId}-error`}
							>
								{errors.email}
							</p>
						) : null}
					</div>
				</div>

				<div>
					<label className="text-sm font-semibold" htmlFor={townId}>
						Town{" "}
						<span className="text-muted-foreground font-normal">
							(optional)
						</span>
					</label>
					<select
						className={fieldClass}
						defaultValue=""
						id={townId}
						name="town"
					>
						<option value="">Choose a town</option>
						{towns.map((town) => (
							<option key={town.slug} value={town.slug}>
								{town.name}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="text-sm font-semibold" htmlFor={messageId}>
						What is going on?
					</label>
					<textarea
						aria-describedby={
							errors.message ? `${messageId}-error` : `${messageId}-hint`
						}
						aria-invalid={errors.message ? true : undefined}
						className={cn(fieldClass, "min-h-32 py-3")}
						id={messageId}
						maxLength={1000}
						name="message"
						required
						rows={5}
					/>
					{errors.message ? (
						<p
							className="text-destructive mt-1.5 text-sm"
							id={`${messageId}-error`}
						>
							{errors.message}
						</p>
					) : (
						<p
							className="text-muted-foreground mt-1.5 text-sm"
							id={`${messageId}-hint`}
						>
							A short note is enough: leak, backup, water heater, septic alarm,
							or a new system.
						</p>
					)}
				</div>
			</div>

			<div className="mt-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
				<Button
					className="w-full sm:w-auto"
					disabled={status === "submitting"}
					size="lg"
					type="submit"
					wrap
				>
					{status === "submitting" ? (
						<>
							<Loader2 aria-hidden="true" className="animate-spin" />
							Sending
						</>
					) : (
						"Get a Free Quote"
					)}
				</Button>
				<p className="text-muted-foreground text-sm leading-snug">
					Quotes are free. Flat-rate pricing, quoted on site before work begins.
				</p>
			</div>
		</form>
	)
}
