import Image from "next/image"

import type { ContentImage } from "@/lib/content"

export function ContentGallery({ images }: { images: ContentImage[] }) {
	return (
		<figure className="mb-10 grid gap-4 sm:grid-cols-2">
			{images.map((image, index) => (
				<div
					className={index === 0 && images.length % 2 ? "sm:col-span-2" : ""}
					key={image.src}
				>
					<div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
						<Image
							alt={image.alt}
							className="object-cover"
							fill
							quality={75}
							sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
							src={image.src}
						/>
					</div>
					{image.caption ? (
						<figcaption className="text-muted-foreground mt-2 text-sm">
							{image.caption}
						</figcaption>
					) : null}
				</div>
			))}
		</figure>
	)
}
