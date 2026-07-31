import { buildBusinessVCard } from "@/lib/vcard"

/**
 * Virtual business card for Wade's Plumbing & Septic.
 * Opening this on a phone typically launches Add Contact with phone, email,
 * address, website, and logo already filled in (iOS, Android, and desktop).
 */
export function GET() {
	const body = buildBusinessVCard()

	return new Response(body, {
		headers: {
			"Content-Type": "text/vcard; charset=utf-8",
			"Content-Disposition": 'inline; filename="Wades-Plumbing-and-Septic.vcf"',
			"Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
		},
	})
}
