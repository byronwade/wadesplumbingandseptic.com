import { freeQuotePath, weekdayHoursPhrase } from "@/lib/public-facts"
import {
	coverageDependsOnAddress,
	type ServiceAreaLocation,
} from "@/lib/service-areas"
import { siteConfig } from "@/lib/site"

export type AnswerFirstInput = {
	work: string
	place: string
	includeSepticNote?: boolean
	/** Santa Clara foothill towns: coverage is address-dependent. */
	confirmAddress?: boolean
}

type FaqPair = { question: string; answer: string }

export function serviceWorkLabel(title: string) {
	return title.replace(/\s+in Santa Cruz County.*$/i, "").trim()
}

export function isSepticWork(value: string) {
	return /\bseptic\b/i.test(value)
}

function openingSentence({
	work,
	place,
	confirmAddress = false,
}: Pick<AnswerFirstInput, "work" | "place" | "confirmAddress">) {
	if (confirmAddress) {
		return `${siteConfig.name} provides ${work} for selected addresses in ${place}, near the Santa Cruz County line, not full-town coverage. Call with the property address to confirm.`
	}
	return `${siteConfig.name} provides ${work} in ${place}.`
}

export function answerFirstPlain({
	work,
	place,
	includeSepticNote = false,
	confirmAddress = false,
}: AnswerFirstInput) {
	const septic = includeSepticNote
		? " Septic work is system installation with engineers, not tank pumping."
		: ""
	return `${openingSentence({ work, place, confirmAddress })}${septic} Quotes are free. Call ${siteConfig.phone} ${weekdayHoursPhrase()} (closed Saturday and Sunday), or request a free quote.`
}

function joinIssues(issues: string[]) {
	const safe = issues
		.map((issue) => issue.replace(/\.$/, "").trim())
		.filter(
			(issue) =>
				!/\bsame-week\b|\bprompt\b|\bimmediate(?:ly)?\b|\bpumping\b|\bpumped\b/i.test(
					issue,
				),
		)
		.slice(0, 3)
	if (safe.length === 0) return "the local conditions described on this page"
	if (safe.length === 1) return safe[0]
	if (safe.length === 2) return `${safe[0]} and ${safe[1]}`
	return `${safe[0]}, ${safe[1]}, and ${safe[2]}`
}

function firstSentence(value: string) {
	const match = value.match(/^.+?[.](?=\s|$)/)
	return (match?.[0] ?? value).trim()
}

export function defaultCityServiceFaqs(
	serviceTitle: string,
	location: ServiceAreaLocation,
	localAngle: string,
	commonIssues: string[],
): FaqPair[] {
	const service = serviceTitle.toLowerCase()
	const town = location.name
	const servesTown = coverageDependsOnAddress(location)
		? `Selected ${town} addresses near the Santa Cruz County line, not the whole town. Call ${siteConfig.phone} with the property address to confirm coverage.`
		: `Yes. Wade's Plumbing & Septic provides ${service} for ${town} homes in ${location.county}.`
	return [
		{
			question: `Does Wade's Plumbing & Septic provide ${service} in ${town}?`,
			answer: `${servesTown} ${firstSentence(localAngle)} Quotes are free. Call ${siteConfig.phone} ${weekdayHoursPhrase()} (closed Saturday and Sunday), or request a free quote at ${siteConfig.url}${freeQuotePath}.`,
		},
		{
			question: "How do I get a free quote?",
			answer: `Call ${siteConfig.phone} ${weekdayHoursPhrase()} (closed Saturday and Sunday), or request a free quote at ${siteConfig.url}${freeQuotePath}. Quotes are free. ${siteConfig.pricing}`,
		},
		{
			question: `What ${service} issues come up in ${town}?`,
			answer: `${town} homeowners often call about ${joinIssues(commonIssues)}. We inspect first and quote a flat rate on site before work begins.`,
		},
	]
}

export function cityServiceFaqs(
	serviceTitle: string,
	location: ServiceAreaLocation,
	localAngle: string,
	commonIssues: string[],
	authored: FaqPair[] = [],
): FaqPair[] {
	const required = defaultCityServiceFaqs(
		serviceTitle,
		location,
		localAngle,
		commonIssues,
	)
	const merged: FaqPair[] = [required[0]!, required[1]!]
	for (const item of authored) {
		if (merged.some((entry) => entry.question === item.question)) continue
		merged.push(item)
	}
	if (merged.length < 3) merged.push(required[2]!)
	return merged
}
