import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"
import sharp from "sharp"

import { OG_HEIGHT, OG_WIDTH, sanitizeOgImagePath } from "@/lib/og"
import { siteConfig } from "@/lib/site"

export type OgRenderOptions = {
	title: string
	eyebrow?: string
	/** Site-relative /images/… path for the full-bleed photo. */
	image?: string | null
}

const INK = "#0c0b0a"
const COPPER = "#c4783a"
const COPPER_BRIGHT = "#e0a35c"
const PAPER = "#f7f7f5"
const MUTED = "#c4b8a8"

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
			.resize(OG_WIDTH, OG_HEIGHT, { fit: "cover", position: "center" })
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
	if (title.length > 90) return 46
	if (title.length > 60) return 54
	if (title.length > 36) return 62
	return 72
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
				{hasPhoto ? (
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: OG_WIDTH,
							height: OG_HEIGHT,
							display: "flex",
						}}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							alt=""
							height={OG_HEIGHT}
							src={photoBuffer as unknown as string}
							width={OG_WIDTH}
						/>
					</div>
				) : null}

				{/* Full-bleed scrim: photo reads edge-to-edge; type stays legible. */}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: OG_WIDTH,
						height: OG_HEIGHT,
						display: "flex",
						backgroundImage: hasPhoto
							? `linear-gradient(105deg, rgba(12,11,10,0.96) 0%, rgba(12,11,10,0.88) 38%, rgba(12,11,10,0.45) 62%, rgba(12,11,10,0.2) 100%)`
							: `linear-gradient(145deg, #14110e 0%, ${INK} 48%, #1a1510 100%)`,
					}}
				/>

				{!hasPhoto ? (
					<div
						style={{
							position: "absolute",
							top: 80,
							right: 40,
							width: 360,
							height: 360,
							display: "flex",
							opacity: 0.1,
						}}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img alt="" height={360} src={markSrc} width={360} />
					</div>
				) : null}

				{/* Content column */}
				<div
					style={{
						position: "relative",
						display: "flex",
						flexDirection: "column",
						width: OG_WIDTH,
						height: OG_HEIGHT,
						paddingTop: 44,
						paddingBottom: 36,
						paddingLeft: 56,
						paddingRight: 56,
					}}
				>
					{/* Wordmark — mark sits plain, no circular badge frame */}
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
							height={64}
							src={markSrc}
							style={{ width: 64, height: 64 }}
							width={64}
						/>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								marginLeft: 16,
							}}
						>
							<div
								style={{
									display: "flex",
									fontFamily: "Archivo",
									fontSize: 34,
									fontWeight: 800,
									letterSpacing: "-0.03em",
									lineHeight: 1,
									color: PAPER,
								}}
							>
								{"Wade's"}
							</div>
							<div
								style={{
									display: "flex",
									marginTop: 6,
									fontFamily: "Manrope",
									fontSize: 13,
									fontWeight: 700,
									letterSpacing: "0.2em",
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
							marginTop: 48,
							fontFamily: "Manrope",
							fontSize: 14,
							fontWeight: 700,
							letterSpacing: "0.2em",
							color: COPPER_BRIGHT,
						}}
					>
						{displayEyebrow}
					</div>

					<div
						style={{
							display: "flex",
							marginTop: 12,
							fontFamily: "Archivo",
							fontSize: size,
							fontWeight: 800,
							letterSpacing: "-0.04em",
							lineHeight: 0.98,
							color: PAPER,
							width: 700,
						}}
					>
						{displayTitle}
					</div>

					<div
						style={{
							display: "flex",
							marginTop: 32,
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
								paddingTop: 16,
								paddingBottom: 16,
								paddingLeft: 26,
								paddingRight: 26,
								borderRadius: 4,
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
							borderTop: "2px solid rgba(196,120,58,0.55)",
							paddingTop: 18,
							width: 700,
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
								letterSpacing: "0.14em",
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
