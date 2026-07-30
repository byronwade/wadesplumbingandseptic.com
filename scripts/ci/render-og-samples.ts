import { writeFileSync, mkdirSync } from "node:fs"

import { renderOgImage } from "../../lib/og-image"

async function main() {
	mkdirSync("/opt/cursor/artifacts/og", { recursive: true })

	const samples = [
		{
			name: "service-drain.png",
			title: "Drain Cleaning",
			eyebrow: "Plumbing",
			image: "/images/work/precision-valve-installation.webp",
		},
		{
			name: "home.png",
			title: "Santa Cruz Plumbing & Septic",
			eyebrow: "Family owned · Local crew",
			image: "/images/locations/santa-cruz-redwoods.webp",
		},
		{
			name: "tip.png",
			title: "How to Prevent Frozen Pipes This Winter",
			eyebrow: "Plumbing Tips",
			image: "/images/team/byron-working.webp",
		},
		{
			name: "no-photo.png",
			title: "Contact Us",
			eyebrow: "Call or text",
		},
	] as const

	for (const sample of samples) {
		try {
			const response = await renderOgImage({
				title: sample.title,
				eyebrow: sample.eyebrow,
				image: "image" in sample ? sample.image : null,
			})
			const buffer = Buffer.from(await response.arrayBuffer())
			writeFileSync(`/opt/cursor/artifacts/og/${sample.name}`, buffer)
			console.log(`ok ${sample.name} (${buffer.length} bytes)`)
		} catch (error) {
			console.error(`FAIL ${sample.name}`, error)
			process.exitCode = 1
		}
	}
}

main()
