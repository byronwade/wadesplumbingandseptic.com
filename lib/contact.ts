import { siteConfig } from "@/lib/site"

/** Public path that serves the downloadable / openable vCard. */
export const VCARD_PATH = "/contact.vcf" as const

export const contactInfo = {
	displayName: siteConfig.name,
	phoneDisplay: siteConfig.phone,
	phoneE164: siteConfig.phoneHref.replace(/^tel:/, ""),
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

/**
 * Encode contact strings so raw HTML / view-source does not contain contiguous
 * mailto:/tel: targets. Client components decode with the matching helper.
 * This is deterrent-level protection (naive scrapers), not cryptography.
 */
export function encodeContactValue(value: string): string {
	const key = 37
	const bytes = Array.from(
		value,
		(char, index) => (char.charCodeAt(0) ^ (key + (index % 17))) & 255,
	)
	if (typeof Buffer !== "undefined") {
		return Buffer.from(bytes).toString("base64")
	}
	let binary = ""
	for (const byte of bytes) binary += String.fromCharCode(byte)
	return btoa(binary)
}

export function decodeContactValue(encoded: string): string {
	let bytes: number[]
	if (typeof Buffer === "undefined") {
		const binary = atob(encoded)
		bytes = Array.from(binary, (char) => char.charCodeAt(0))
	} else {
		bytes = Array.from(Buffer.from(encoded, "base64"))
	}
	const key = 37
	return bytes
		.map((byte, index) =>
			String.fromCharCode(byte ^ ((key + (index % 17)) & 255)),
		)
		.join("")
}

/** Pre-encoded payloads shipped to the client (no plaintext tel:/mailto: hrefs). */
export const contactEncoded = {
	phoneDisplay: encodeContactValue(contactInfo.phoneDisplay),
	phoneHref: encodeContactValue(contactInfo.phoneHref),
	email: encodeContactValue(contactInfo.email),
	emailHref: encodeContactValue(contactInfo.emailHref),
	vcardPath: encodeContactValue(contactInfo.vcardPath),
} as const
