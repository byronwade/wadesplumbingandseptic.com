export const confirmedHours =
	"Monday to Friday, 9:00 AM to 5:00 PM. Closed Saturday and Sunday"

export const confirmedPricing =
	"Flat-rate pricing, quoted on site before work begins."

/**
 * Wade's installs septic systems alongside engineers and does not pump tanks
 * (owner confirmed October 20, 2026). Educational advice such as "most tanks
 * need pumping every 3 to 5 years" and sump, well or effluent pumps are fine;
 * these shapes read as Wade's offering or performing the pumping.
 */
const septicPumpingOffer = [
	/septic-tank-cleaning-and-pumping|(?:service-offerings|santa-cruz)\/septic-pumping(?![\w-])/,
	/\bSeptic (?:Tank )?Pumping\b/,
	/\bpumping\s+(?:services?|coordination|visits?|trucks?)\b/i,
	/\bpump[- ]?(?:trucks?|outs?\s+services?)\b/i,
	/\bpumping\s+and\s+cleaning\b|\bcleaning\s+and\s+pumping\b/i,
	/\b(?:we(?:'ve|’ve| have| will|'ll|’ll)?|our (?:team|crews?|technicians|experts)(?: at [^,.]+?)?)\s+(?:also\s+|can\s+|will\s+)?(?:(?:inspect your tank,\s+)?pump(?:s|ed)?|pump it)\b/i,
	/\bschedule\s+(?:your\s+|regular\s+|a\s+)?(?:septic\s+)?(?:tank\s+)?pumping\b/i,
	// Service-list bullets such as "- Routine tank pumping sized to your home".
	/^[ \t]*[-*][ \t]+(?:(?:routine|scheduled|regular)\s+)?(?:(?:septic\s+)?tank\s+|septic\s+)?pumping\b/im,
]

/** Public copy rules confirmed by the owner on October 19, 2026. */
export function businessFactIssues(text: string): string[] {
	const issues: string[] = []
	if (/\$\s*\d|\b\d[\d,.]*\s*(?:dollars|USD)\b/i.test(text)) {
		issues.push("numeric monetary amount")
	}
	if (/\bprice\s*range\b|\bprices?\s+(?:range|ranging)\b/i.test(text)) {
		issues.push("price range")
	}
	if (
		/\bemergenc(?:y|ies)\b|24\s*\/\s*7|after[ -]hours|\burgent\b/i.test(text)
	) {
		issues.push("unavailable service claim")
	}
	if (
		/\b4\.9\b|\b5[ -]star\b|★|\bsince 2021\b|California\s*(?:&|and)\s*Georgia/i.test(
			text,
		)
	) {
		issues.push("unverified rating or trust claim")
	}
	const unbolded = text.replace(/\*\*|__/g, "")
	if (septicPumpingOffer.some((pattern) => pattern.test(unbolded))) {
		issues.push("septic pumping offer")
	}
	for (const rawLine of text.split("\n")) {
		const line = rawLine.replace(/\*\*|__/g, "")
		if (
			!/\b(?:Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?|weekends?|business hours|office hours)\b/i.test(
				line,
			)
		)
			continue
		const times = [
			...line.matchAll(/\b(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m\.?\b/gi),
		]
		const ranges = [
			...line.matchAll(
				/\b(\d{1,2})(?::(\d{2}))?\s*(?:[ap]\.?m\.?)?\s*(?:to|through|[-–])\s*(\d{1,2})(?::(\d{2}))?\s*(?:[ap]\.?m\.?)?/gi,
			),
		]
		if (
			times.length === 0 &&
			ranges.length === 0 &&
			!/\b(?:hours|open|available|availability|closed)\b/i.test(line)
		)
			continue
		if (
			times.some(
				([, hour, minute, period]) =>
					!(
						Number(minute ?? 0) === 0 &&
						((Number(hour) === 9 && period.toLowerCase() === "a") ||
							(Number(hour) === 5 && period.toLowerCase() === "p"))
					),
			)
		)
			issues.push("hours outside 9:00 AM to 5:00 PM")
		if (
			ranges.some(
				([, start, startMinute, end, endMinute]) =>
					Number(start) !== 9 ||
					![5, 17].includes(Number(end)) ||
					Number(startMinute ?? 0) !== 0 ||
					Number(endMinute ?? 0) !== 0,
			)
		) {
			issues.push("hours outside 9:00 AM to 5:00 PM")
		}
		const day = "(?:Sat(?:urday)?|Sun(?:day)?|weekends?)"
		const closedDays = new RegExp(
			`(?:closed\\s+(?:on\\s+)?${day}(?:\\s*(?:and|,|&)\\s*${day})?|${day}(?:\\s*(?:and|,|&)\\s*${day})?\\s*:?\\s*closed)`,
			"gi",
		)
		if (
			/\b(?:Sat(?:urday)?|Sun(?:day)?|weekends?)\b/i.test(
				line.replace(closedDays, ""),
			)
		) {
			issues.push("weekend availability without a closed notice")
		}
	}
	return [...new Set(issues)]
}
