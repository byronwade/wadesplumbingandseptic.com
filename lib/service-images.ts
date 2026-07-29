export const serviceCategoryImages = {
	Plumbing: "/images/services/drain-clearing.webp",
	Commercial: "/images/services/commercial-plumbing.webp",
	Septic: "/images/work/engineered-septic-hero.webp",
} as const

export function getServiceImage(category?: string, image?: string) {
	if (image) return image

	return (
		serviceCategoryImages[category as keyof typeof serviceCategoryImages] ??
		"/images/work/precision-valve-installation.webp"
	)
}
