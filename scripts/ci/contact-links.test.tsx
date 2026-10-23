import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { CallButton } from "../../components/call-button"
import { CallLabel } from "../../components/call-label"
import { buttonVariants } from "../../components/ui/button"
import { MobileCallBar } from "../../components/mobile-call-bar"
import {
	EmailAddress,
	ProtectedContactLink,
	ProtectedEmailText,
	ProtectedPhoneText,
} from "../../components/protected-contact"
import { contactInfo } from "../../lib/contact"
import { siteConfig } from "../../lib/site"

const wrappableEmail = contactInfo.email.replace("@", "@<wbr/>")

for (const [kind, href, label] of [
	["phone", contactInfo.phoneHref, contactInfo.phoneDisplay],
	["email", contactInfo.emailHref, wrappableEmail],
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

// break-all split the address at any letter ("support@wadesin" / "c.io").
test("the email wraps only after the @, adding no characters", () => {
	const html = renderToStaticMarkup(createElement(EmailAddress))
	assert.equal(html.replaceAll("<wbr/>", ""), contactInfo.email)
	assert.equal(html, wrappableEmail)
	for (const name of [
		"components/contact-cta.tsx",
		"components/home-below-fold.tsx",
		"components/virtual-business-card.tsx",
	]) {
		assert.doesNotMatch(fs.readFileSync(name, "utf8"), /\bbreak-all\b/, name)
	}
})

function classOf(html: string) {
	return html.match(/class="([^"]*)"/)?.[1].split(" ") ?? []
}

const wholeNumber = `<span>${contactInfo.phoneDisplay}</span>`

function visibleText(html: string) {
	return html
		.replace(/<[^>]+>/g, "")
		.replace(/\s+/g, " ")
		.trim()
}

// A flex-sibling icon narrows the label below the number's width at 200%
// text, which is what split "831.225.43 / 44". Inside the label it does not.
function iconIsInsideLabel(html: string) {
	const label = html.indexOf('<span class="min-w-0')
	return label !== -1 && html.indexOf("<svg") > label
}

test("call labels wrap before the phone number, with the icon beside Call", () => {
	const html = renderToStaticMarkup(
		createElement(CallLabel, { icon: createElement("svg") }),
	)
	assert.equal(visibleText(html), `Call ${contactInfo.phoneDisplay}`)
	assert.ok(html.includes(`<svg></svg>Call</span> ${wholeNumber}`), html)
	assert.ok(iconIsInsideLabel(html), html)
})

test("a number-only call label keeps the icon apart from the number", () => {
	const html = renderToStaticMarkup(
		createElement(CallLabel, {
			icon: createElement("svg"),
			label: contactInfo.phoneDisplay,
		}),
	)
	assert.ok(html.includes(`me-2"><svg></svg></span><wbr/>${wholeNumber}`), html)
})

test("call labels without the number render unchanged", () => {
	const html = renderToStaticMarkup(
		createElement(CallLabel, { label: "Call to schedule" }),
	)
	assert.equal(html, `<span class="min-w-0">Call to schedule</span>`)
})

test("call buttons wrap a long label instead of cutting off the number", () => {
	const html = renderToStaticMarkup(
		createElement(CallButton, {
			desktopLabel: `Call ${contactInfo.phoneDisplay}`,
			size: "lg",
		}),
	)
	const classes = classOf(html)
	assert.ok(html.includes(`Call</span> ${wholeNumber}`), html)
	assert.ok(iconIsInsideLabel(html), html)
	assert.ok(
		html.includes(`aria-label="Call ${contactInfo.phoneDisplay}"`),
		html,
	)
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
	assert.ok(html.includes(`Call</span> ${wholeNumber}`), html)
	assert.ok(iconIsInsideLabel(html), html)
	assert.ok(visibleText(html).startsWith(`Call ${siteConfig.phone}`), html)
	assert.ok(html.includes(siteConfig.hours), html)
})

test("wrapping call buttons shed side padding only for enlarged text", () => {
	for (const size of ["lg", "xl"] as const) {
		const classes = buttonVariants({ size, wrap: true }).split(" ")
		assert.ok(
			classes.some((cls) =>
				/^px-\[min\(.*max\(0\.5rem,100vw_-_18rem\)\)\]$/.test(cls),
			),
			`${size}: ${classes.join(" ")}`,
		)
	}
})

// Hand-written "Call {phone}" text beside a flex icon breaks mid-number at
// enlarged text sizes; CallLabel does not.
test("call labels in app and components use CallLabel", () => {
	const offenders: string[] = []
	for (const dir of ["app", "components"]) {
		for (const file of fs.readdirSync(dir, { recursive: true }) as string[]) {
			if (!/\.tsx$/.test(file)) continue
			const source = fs.readFileSync(path.join(dir, file), "utf8")
			if (
				/>\s*Call \{(siteConfig\.phone|contactInfo\.phoneDisplay)\}/.test(
					source,
				)
			) {
				offenders.push(path.join(dir, file))
			}
		}
	}
	assert.deepEqual(offenders, [])
})
