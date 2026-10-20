import Image from "next/image"

// Existing SVGL artwork lives in static files so its paths are not repeated in
// every page's HTML and RSC payload. The surrounding link supplies the name.
export const companyLogos = {
	facebook: "/images/brand/social/facebook.svg",
	instagram: "/images/brand/social/instagram.svg",
	linkedin: "/images/brand/social/linkedin.svg",
} as const

export type CompanyLogoName = keyof typeof companyLogos

export type CompanyLogoProps = {
	name: CompanyLogoName
	className?: string
}

export function CompanyLogo({ name, className }: CompanyLogoProps) {
	return (
		<Image
			alt=""
			aria-hidden="true"
			className={className}
			height={20}
			loading="lazy"
			src={companyLogos[name]}
			unoptimized
			width={20}
		/>
	)
}
