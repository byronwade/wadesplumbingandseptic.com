import Image from "next/image"

import type { ContentImage } from "@/lib/content"

export function ContentGallery({
	images,
	variant = "grid",
}: {
	images: ContentImage[]
	/** `rail` matches the home project gallery band. */
	variant?: "grid" | "rail"
}) {
	if (variant === "rail") {
		return (
			<section className="surface-hero section-y overflow-hidden">
				<div className="container-shell">
					<div className="section-head-row reveal">
						<div className="section-head max-w-2xl">
							<p className="spec-label">Project gallery</p>
							<h2 className="type-title text-on-dark">
								Work from the Wade&apos;s team
							</h2>
							<p className="type-lead text-on-dark-muted">
								Photos from jobs across Santa Cruz County: installs, repairs,
								controls, and field conditions that shape the recommendation.
							</p>
						</div>
					</div>

					<ul
						aria-label="Project photos"
						className="snap-rail reveal mt-[var(--space-block)]"
						tabIndex={0}
					>
						{images.map((image) => (
							<li key={image.src}>
								<figure className="surface-float overflow-hidden rounded-lg">
									<div className="bg-muted relative aspect-4/3">
										<Image
											alt={
												image.alt?.trim() ||
												image.caption?.trim() ||
												"Wade's Plumbing & Septic project photo"
											}
											className="object-cover"
											fill
											quality={75}
											sizes="(min-width: 640px) 30vw, 76vw"
											src={image.src}
										/>
									</div>
									{image.caption ? (
										<figcaption className="text-on-dark-muted px-4 py-3 text-sm font-semibold">
											{image.caption}
										</figcaption>
									) : null}
								</figure>
							</li>
						))}
					</ul>
				</div>
			</section>
		)
	}

	return (
		<figure className="mb-[var(--space-block)] grid grid-cols-1 gap-[var(--space-grid)] sm:grid-cols-2">
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
