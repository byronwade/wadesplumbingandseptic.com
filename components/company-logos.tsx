import type { SVGProps } from "react"

import { FacebookIcon } from "@/components/ui/svgs/facebookIcon"
import { InstagramIcon } from "@/components/ui/svgs/instagramIcon"
import { Linkedin } from "@/components/ui/svgs/linkedin"

export type CompanyLogoProps = SVGProps<SVGSVGElement>

/** SVGL company logos installed via `npx shadcn@latest add @svgl/<name>`. */
export const companyLogos = {
	facebook: FacebookIcon,
	instagram: InstagramIcon,
	linkedin: Linkedin,
} as const

export type CompanyLogoName = keyof typeof companyLogos

export function CompanyLogo({
	name,
	className,
	...props
}: CompanyLogoProps & { name: CompanyLogoName }) {
	const Icon = companyLogos[name]
	return <Icon aria-hidden="true" className={className} {...props} />
}
