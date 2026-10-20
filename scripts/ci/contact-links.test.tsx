import assert from "node:assert/strict"
import test from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { CallButton } from "../../components/call-button"
import { MobileCallBar } from "../../components/mobile-call-bar"
import {
	ProtectedContactLink,
	ProtectedEmailText,
	ProtectedPhoneText,
} from "../../components/protected-contact"
import { contactInfo } from "../../lib/contact"
import { siteConfig } from "../../lib/site"

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

function classOf(html: string) {
	return html.match(/class="([^"]*)"/)?.[1].split(" ") ?? []
}

test("call buttons wrap a long label instead of cutting off the number", () => {
	const html = renderToStaticMarkup(
		createElement(CallButton, {
			desktopLabel: `Call ${contactInfo.phoneDisplay}`,
			size: "lg",
		}),
	)
	const classes = classOf(html)
	assert.ok(html.includes(`>Call ${contactInfo.phoneDisplay}</span>`), html)
	assert.ok(!html.includes("truncate"), html)
	for (const cls of ["h-auto", "min-h-12", "whitespace-normal"]) {
		assert.ok(classes.includes(cls), `${cls} missing: ${html}`)
	}
	for (const cls of ["h-12", "whitespace-nowrap"]) {
		assert.ok(!classes.includes(cls), `${cls} left in: ${html}`)
	}
})

test("header call buttons can keep their fixed one-line size", () => {
	const classes = classOf(
		renderToStaticMarkup(
			createElement(CallButton, {
				desktopLabel: contactInfo.phoneDisplay,
				size: "sm",
				wrap: false,
			}),
		),
	)
	assert.ok(classes.includes("h-9"), classes.join(" "))
	assert.ok(classes.includes("whitespace-nowrap"), classes.join(" "))
	assert.ok(!classes.includes("min-h-9"), classes.join(" "))
})

test("mobile call bar keeps the number and full hours in its HTML", () => {
	const html = renderToStaticMarkup(createElement(MobileCallBar))
	assert.ok(html.includes(`href="${siteConfig.phoneHref}"`), html)
	assert.ok(html.includes(`Call ${siteConfig.phone}`), html)
	assert.ok(html.includes(siteConfig.hours), html)
})
