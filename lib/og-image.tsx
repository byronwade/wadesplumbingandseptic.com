import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"
import sharp from "sharp"

import { OG_HEIGHT, OG_WIDTH, sanitizeOgImagePath } from "@/lib/og"
import { siteConfig } from "@/lib/site"

export type OgRenderOptions = {
	title: string
	eyebrow?: string
	/** Site-relative /images/… path for the right-rail photo. */
	image?: string | null
}

const INK = "#12100e"
const INK_SOFT = "#1c1915"
const COPPER = "#c4783a"
const COPPER_BRIGHT = "#e0a35c"
const PAPER = "#f4f0e8"
const MUTED = "#b8aea0"

async function loadOgAsset(filename: string) {
	return readFile(join(process.cwd(), "assets/og", filename))
}

export async function loadOgFonts() {
	const [archivo, manropeBold, manropeMedium] = await Promise.all([
		loadOgAsset("Archivo-ExtraBold.woff"),
		loadOgAsset("Manrope-Bold.woff"),
		loadOgAsset("Manrope-Medium.woff"),
	])

	return [
		{
			name: "Archivo",
			data: archivo,
			weight: 800 as const,
			style: "normal" as const,
		},
		{
			name: "Manrope",
			data: manropeBold,
			weight: 700 as const,
			style: "normal" as const,
		},
		{
			name: "Manrope",
			data: manropeMedium,
			weight: 500 as const,
			style: "normal" as const,
		},
	]
}

export async function loadOgMarkDataUrl() {
	const mark = await loadOgAsset("wades-mark.png")
	return `data:image/png;base64,${mark.toString("base64")}`
}

/** Load a public image as PNG bytes for Satori's ArrayBuffer img src. */
export async function loadPublicPhotoBuffer(
	image: string | null | undefined,
): Promise<ArrayBuffer | null> {
	const path = sanitizeOgImagePath(image ?? undefined)
	if (!path) return null

	try {
		const file = await readFile(join(process.cwd(), "public", path))
		const png = await sharp(file)
			.rotate()
			.resize(720, OG_HEIGHT, { fit: "cover", position: "center" })
			.png({ compressionLevel: 8 })
			.toBuffer()
		return png.buffer.slice(
			png.byteOffset,
			png.byteOffset + png.byteLength,
		) as ArrayBuffer
	} catch {
		return null
	}
}

function titleFontSize(title: string) {
	if (title.length > 90) return 44
	if (title.length > 60) return 52
	if (title.length > 36) return 58
	return 68
}

export async function renderOgImage({
	title,
	eyebrow,
	image,
}: OgRenderOptions) {
	const [fonts, markSrc, photoBuffer] = await Promise.all([
		loadOgFonts(),
		loadOgMarkDataUrl(),
		loadPublicPhotoBuffer(image),
	])

	const displayTitle = title.trim() || siteConfig.name
	const displayEyebrow = (eyebrow?.trim() || "Santa Cruz County").toUpperCase()
	const size = titleFontSize(displayTitle)
	const hasPhoto = Boolean(photoBuffer)

	return new ImageResponse(
		(
			<div
				style={{
					width: OG_WIDTH,
					height: OG_HEIGHT,
					display: "flex",
					position: "relative",
					backgroundColor: INK,
					color: PAPER,
					fontFamily: "Manrope",
				}}
			>
				{/* Base wash */}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: OG_WIDTH,
						height: OG_HEIGHT,
						display: "flex",
						backgroundImage: hasPhoto
							? `linear-gradient(90deg, ${INK} 0%, ${INK} 48%, ${INK_SOFT} 100%)`
							: `linear-gradient(135deg, ${INK} 0%, ${INK_SOFT} 55%, #2a2018 100%)`,
					}}
				/>

				{hasPhoto ? (
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 480,
							width: 720,
							height: OG_HEIGHT,
							display: "flex",
						}}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							alt=""
							height={OG_HEIGHT}
							src={photoBuffer as unknown as string}
							width={720}
						/>
						<div
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								width: 720,
								height: OG_HEIGHT,
								display: "flex",
								backgroundImage: `linear-gradient(90deg, ${INK} 0%, rgba(18,16,14,0.88) 22%, rgba(18,16,14,0.35) 58%, rgba(18,16,14,0.12) 100%)`,
							}}
						/>
					</div>
				) : (
					<div
						style={{
							position: "absolute",
							top: 40,
							left: 760,
							width: 420,
							height: 420,
							display: "flex",
							opacity: 0.14,
						}}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img alt="" height={420} src={markSrc} width={420} />
					</div>
				)}

				{/* Copper spine */}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: OG_WIDTH,
						height: 8,
						display: "flex",
						backgroundImage: `linear-gradient(90deg, ${COPPER_BRIGHT}, ${COPPER} 40%, #8a4f24)`,
					}}
				/>

				{/* Content */}
				<div
					style={{
						position: "relative",
						display: "flex",
						flexDirection: "column",
						width: hasPhoto ? 720 : OG_WIDTH,
						height: OG_HEIGHT,
						paddingTop: 48,
						paddingBottom: 40,
						paddingLeft: 56,
						paddingRight: 48,
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							alt=""
							height={72}
							src={markSrc}
							style={{
								width: 72,
								height: 72,
								borderRadius: 36,
								border: `2px solid ${COPPER}`,
							}}
							width={72}
						/>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								marginLeft: 18,
							}}
						>
							<div
								style={{
									display: "flex",
									fontFamily: "Archivo",
									fontSize: 28,
									fontWeight: 800,
									letterSpacing: "-0.02em",
									lineHeight: 1,
									color: PAPER,
								}}
							>
								{"Wade's"}
							</div>
							<div
								style={{
									display: "flex",
									marginTop: 4,
									fontFamily: "Manrope",
									fontSize: 14,
									fontWeight: 700,
									letterSpacing: "0.16em",
									textTransform: "uppercase",
									color: COPPER_BRIGHT,
								}}
							>
								Plumbing & Septic
							</div>
						</div>
					</div>

					<div
						style={{
							display: "flex",
							marginTop: 40,
							fontFamily: "Manrope",
							fontSize: 15,
							fontWeight: 700,
							letterSpacing: "0.18em",
							color: COPPER_BRIGHT,
						}}
					>
						{displayEyebrow}
					</div>

					<div
						style={{
							display: "flex",
							marginTop: 14,
							fontFamily: "Archivo",
							fontSize: size,
							fontWeight: 800,
							letterSpacing: "-0.035em",
							lineHeight: 1.05,
							color: PAPER,
							width: hasPhoto ? 620 : 1040,
						}}
					>
						{displayTitle}
					</div>

					{/* Conversion CTA: opengraph.xyz flags cards without one. */}
					<div
						style={{
							display: "flex",
							marginTop: 28,
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								backgroundColor: COPPER,
								color: PAPER,
								fontFamily: "Manrope",
								fontSize: 22,
								fontWeight: 700,
								paddingTop: 14,
								paddingBottom: 14,
								paddingLeft: 22,
								paddingRight: 22,
								borderRadius: 8,
							}}
						>
							{`Call now · ${siteConfig.phone}`}
						</div>
					</div>

					<div style={{ display: "flex", flexGrow: 1 }} />

					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							borderTop: "1px solid rgba(196,120,58,0.45)",
							paddingTop: 18,
							width: hasPhoto ? 620 : 1040,
						}}
					>
						<div
							style={{
								display: "flex",
								fontFamily: "Manrope",
								fontSize: 16,
								fontWeight: 500,
								color: MUTED,
							}}
						>
							Santa Cruz County, CA
						</div>
						<div
							style={{
								display: "flex",
								fontFamily: "Manrope",
								fontSize: 14,
								fontWeight: 700,
								letterSpacing: "0.12em",
								textTransform: "uppercase",
								color: MUTED,
							}}
						>
							CSLB #{siteConfig.licenseNumber}
						</div>
					</div>
				</div>
			</div>
		),
		{
			width: OG_WIDTH,
			height: OG_HEIGHT,
			fonts,
		},
	)
}
