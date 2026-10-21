import type { IconProps as PhosphorIconProps } from "@phosphor-icons/react"
import { createElement, type ReactElement } from "react"

import { duotoneIcons, type DuotoneIconName } from "@/components/icon-data"

/*
 * One icon vocabulary for the whole site: Phosphor, duotone.
 *
 * Drawn from components/icon-data.ts rather than imported from
 * @phosphor-icons/react. Every Phosphor icon module carries all six weights,
 * and because client components (header, call button) use these icons, all
 * six sets of paths for every icon shipped to every page: about 144 KB of
 * JavaScript, of which only the duotone paths were ever drawn. The data file
 * is generated from the installed package by scripts/generate-icon-data.mjs,
 * and CI fails if it falls out of date.
 *
 * The <svg> matches what Phosphor renders (same attributes, same order), so
 * the markup is unchanged. The weight is fixed here rather than passed at
 * every call site, so no page can drift onto a different one; a `weight`
 * prop is accepted for type compatibility and ignored.
 *
 * Sizing still comes from Tailwind `size-*`: the <svg> carries
 * width/height="1em" as HTML attributes, and a CSS width/height always beats
 * an attribute.
 */
export type IconProps = PhosphorIconProps
export type IconComponent = (props: IconProps) => ReactElement

function duotone(name: DuotoneIconName): IconComponent {
	const shapes = duotoneIcons[name].map(([tag, attributes], index) =>
		createElement(tag, { key: index, ...attributes }),
	)

	function DuotoneIcon({
		alt,
		color = "currentColor",
		size = "1em",
		mirrored = false,
		weight: _weight,
		children,
		...props
	}: IconProps) {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={size}
				height={size}
				fill={color}
				viewBox="0 0 256 256"
				transform={mirrored ? "scale(-1, 1)" : undefined}
				{...props}
			>
				{alt ? <title>{alt}</title> : null}
				{children}
				{shapes}
			</svg>
		)
	}
	DuotoneIcon.displayName = `Duotone(${name})`
	return DuotoneIcon
}

export const ArrowLeft = duotone("ArrowLeft")
export const ArrowRight = duotone("ArrowRight")
export const ArrowUpRight = duotone("ArrowUpRight")
export const BookOpen = duotone("BookOpen")
export const Briefcase = duotone("Briefcase")
export const Check = duotone("Check")
export const Clock = duotone("Clock")
export const Eye = duotone("Eye")
export const FileText = duotone("FileText")
export const Gauge = duotone("Gauge")
export const Hash = duotone("Hash")
export const IdentificationCard = duotone("IdentificationCard")
export const MapPin = duotone("MapPin")
export const Minus = duotone("Minus")
export const Phone = duotone("Phone")
export const Plus = duotone("Plus")
export const ShieldCheck = duotone("ShieldCheck")
export const Siren = duotone("Siren")
export const Star = duotone("Star")
export const Users = duotone("Users")
export const Wallet = duotone("Wallet")
export const Wrench = duotone("Wrench")
export const X = duotone("X")

/* Mapped to the closest Phosphor concept, keeping the call-site name. */
export const BadgeCheck = duotone("SealCheck")
export const Building2 = duotone("Buildings")
export const CalendarDays = duotone("CalendarDots")
export const ChevronDown = duotone("CaretDown")
export const ChevronRight = duotone("CaretRight")
export const CircleHelp = duotone("Question")
export const CornerDownLeft = duotone("ArrowElbowDownLeft")
export const Droplets = duotone("Drop")
export const Home = duotone("House")
export const Loader2 = duotone("CircleNotch")
export const Locate = duotone("Crosshair")
export const Mail = duotone("Envelope")
export const Maximize = duotone("CornersOut")
export const MapPinned = duotone("MapTrifold")
export const Menu = duotone("List")
export const RotateCcw = duotone("ArrowCounterClockwise")
export const Search = duotone("MagnifyingGlass")
export const Sparkles = duotone("Sparkle")
