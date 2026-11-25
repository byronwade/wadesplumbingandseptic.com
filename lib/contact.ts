import { siteConfig } from "@/lib/site"

/** Public path that serves the downloadable / openable vCard. */
export const VCARD_PATH = "/contact.vcf" as const

export const contactInfo = {
	displayName: siteConfig.name,
	phoneDisplay: siteConfig.phone,
	phoneE164: siteConfig.phoneE164,
	phoneHref: siteConfig.phoneHref,
	email: siteConfig.email,
	emailHref: `mailto:${siteConfig.email}`,
	hours: siteConfig.hours,
	address: siteConfig.address,
	url: siteConfig.url,
	licenses: siteConfig.licenses,
	licenseNumber: siteConfig.licenseNumber,
	/** PNG mark embeds cleanly in vCards across iOS and Android. */
	photoPath: "/images/brand/apple-touch-icon.png",
	vcardPath: VCARD_PATH,
} as const

const sitePhoneDigits = contactInfo.phoneE164.replace(/\D/g, "")

function phoneDigits(value: string) {
	return value.replace(/\D/g, "")
}

function normalizedPhoneDigits(value: string) {
	const digits = phoneDigits(value)
	return digits.length === 10 ? `1${digits}` : digits
}

/** True when the value is Wade's published number, in any common writing. */
export function isSitePhoneNumber(value: string) {
	return normalizedPhoneDigits(value) === sitePhoneDigits
}

/**
 * react-markdown's default URL transform drops `tel:` (it is not in the
 * allowed protocol list). Rewrite recognized business numbers to the
 * canonical `tel:+18312254344` href used everywhere else.
 */
export function canonicalTelHref(href: string) {
	if (!href.toLowerCase().startsWith("tel:")) return null
	return isSitePhoneNumber(href.slice(4)) ? contactInfo.phoneHref : null
}
