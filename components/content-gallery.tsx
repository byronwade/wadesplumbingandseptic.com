import Image from "next/image"

import type { ContentImage } from "@/lib/content"

export function ContentGallery({ images }: { images: ContentImage[] }) {
	return (
		<figure className="mb-[var(--space-block)] grid gap-[var(--space-grid)] sm:grid-cols-2">
			{images.map((image, index) => (
				<div
					className={
						index === 0 && images.length % 2 ? "sm:col-span-2" : undefined
					}
					key={image.src}
				>
					<div className="bg-muted relative aspect-4/3 overflow-hidden rounded-lg">
						<Image
							alt={
								image.alt?.trim() ||
								image.caption?.trim() ||
								"Wade's Plumbing & Septic project photo"
							}
							className="object-cover"
							fill
							quality={75}
							sizes="(min-width: 640px) 50vw, 100vw"
							src={image.src}
						/>
					</div>
					{image.caption ? (
						<figcaption className="type-meta mt-2.5">
							{image.caption}
						</figcaption>
					) : null}
				</div>
			))}
		</figure>
	)
}
