import { readFileSync } from "node:fs"
import path from "node:path"

import { contactInfo } from "@/lib/contact"
import { siteConfig } from "@/lib/site"

/** RFC 6350 line folding (75 octets; continuation lines start with a space). */
function foldLine(line: string): string {
	const max = 75
	if (line.length <= max) return line

	let out = line.slice(0, max)
	let rest = line.slice(max)
	while (rest.length > 0) {
		out += `\r\n ${rest.slice(0, max - 1)}`
		rest = rest.slice(max - 1)
	}
	return out
}

function escapeText(value: string): string {
	return value
		.replace(/\\/g, "\\\\")
		.replace(/\n/g, "\\n")
		.replace(/,/g, "\\,")
		.replace(/;/g, "\\;")
}

function loadPhotoBase64(): string | null {
	try {
		const absolute = path.join(process.cwd(), "public", contactInfo.photoPath)
		return readFileSync(absolute).toString("base64")
	} catch {
		return null
	}
}

/**
 * Build a vCard 3.0 payload with wide device support (iOS, Android, desktop).
 * PHOTO is embedded as PNG base64 so offline save still includes the logo.
 */
export function buildBusinessVCard(): string {
	const photo = loadPhotoBase64()
	const { address } = contactInfo

	const lines = [
		"BEGIN:VCARD",
		"VERSION:3.0",
		`N:${escapeText("Plumbing & Septic")};${escapeText("Wade's")};;;`,
		`FN:${escapeText(contactInfo.displayName)}`,
		`ORG:${escapeText(contactInfo.displayName)}`,
		"TITLE:Plumbing and Septic Service",
		`TEL;TYPE=WORK,VOICE,PREF:${contactInfo.phoneE164}`,
		`TEL;TYPE=CELL,VOICE:${contactInfo.phoneE164}`,
		`EMAIL;TYPE=INTERNET,WORK,PREF:${contactInfo.email}`,
		`ADR;TYPE=WORK:;;${escapeText(address.street)};${escapeText(address.city)};${escapeText(address.region)};${escapeText(address.postalCode)};USA`,
		`LABEL;TYPE=WORK:${escapeText(address.display)}`,
		`URL;TYPE=WORK:${siteConfig.url}`,
		`NOTE:${escapeText(`${contactInfo.licenses}. Hours: ${contactInfo.hours}. ${siteConfig.serviceArea}.`)}`,
		`UID:urn:uuid:wades-plumbing-${contactInfo.licenseNumber}`,
		// Fixed revision keeps the route cacheable; bump when contact fields change.
		"REV:20260730T120000Z",
	]

	if (photo) {
		lines.push(foldLine(`PHOTO;ENCODING=b;TYPE=PNG:${photo}`))
	} else {
		lines.push(`PHOTO;VALUE=URI:${siteConfig.url}${contactInfo.photoPath}`)
	}

	lines.push("END:VCARD")
	return `${lines.join("\r\n")}\r\n`
}
