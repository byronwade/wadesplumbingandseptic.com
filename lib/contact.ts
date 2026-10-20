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
