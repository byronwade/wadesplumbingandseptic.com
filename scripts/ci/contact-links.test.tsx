import assert from "node:assert/strict"
import test from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import {
	ProtectedContactLink,
	ProtectedEmailText,
	ProtectedPhoneText,
} from "../../components/protected-contact"
import { contactInfo } from "../../lib/contact"

for (const [kind, href, label] of [
	["phone", contactInfo.phoneHref, contactInfo.phoneDisplay],
	["email", contactInfo.emailHref, contactInfo.email],
	["vcard", contactInfo.vcardPath, "Save contact"],
] as const) {
	test(`${kind} links work in server HTML before JavaScript`, () => {
		const html = renderToStaticMarkup(
			createElement(ProtectedContactLink, { kind }),
		)
		assert.ok(html.includes(`href="${href}"`), html)
		assert.ok(html.includes(`>${label}</a>`), html)
	})
}

test("call controls preserve their accessible name and custom content", () => {
	const html = renderToStaticMarkup(
		createElement(
			ProtectedContactLink,
			{
				kind: "phone",
				ariaLabel: `Call ${contactInfo.phoneDisplay}`,
				className: "contact-action",
			},
			createElement("span", null, "Call to schedule"),
		),
	)
	assert.ok(html.includes(`href="${contactInfo.phoneHref}"`), html)
	assert.ok(
		html.includes(`aria-label="Call ${contactInfo.phoneDisplay}"`),
		html,
	)
	assert.ok(html.includes("<span>Call to schedule</span>"), html)
	assert.ok(html.includes('class="contact-action"'), html)
})

test("visible phone and email text are usable links without hydration", () => {
	const phone = renderToStaticMarkup(createElement(ProtectedPhoneText))
	const email = renderToStaticMarkup(createElement(ProtectedEmailText))
	assert.ok(phone.includes(`href="${contactInfo.phoneHref}"`), phone)
	assert.ok(email.includes(`href="${contactInfo.emailHref}"`), email)
	assert.ok(email.includes(`aria-label="Email ${contactInfo.email}"`), email)
})
