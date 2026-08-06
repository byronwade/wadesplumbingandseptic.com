import type { ComponentProps, ReactElement } from "react"
import {
	ArrowCounterClockwise,
	ArrowElbowDownLeft,
	ArrowLeft as PhArrowLeft,
	ArrowRight as PhArrowRight,
	ArrowUpRight as PhArrowUpRight,
	BookOpen as PhBookOpen,
	Briefcase as PhBriefcase,
	Buildings,
	CalendarDots,
	CaretDown,
	CaretRight,
	Check as PhCheck,
	CircleNotch,
	Clock as PhClock,
	CornersOut,
	Crosshair,
	Drop,
	Envelope,
	Eye as PhEye,
	FileText as PhFileText,
	Gauge as PhGauge,
	Hash as PhHash,
	House,
	IdentificationCard as PhIdentificationCard,
	List,
	MagnifyingGlass,
	MapPin as PhMapPin,
	Minus as PhMinus,
	Phone as PhPhone,
	Plus as PhPlus,
	Question,
	SealCheck,
	ShieldCheck as PhShieldCheck,
	Siren as PhSiren,
	Sparkle,
	Star as PhStar,
	Users as PhUsers,
	Wallet as PhWallet,
	Wrench as PhWrench,
	X as PhX,
} from "@phosphor-icons/react/dist/ssr"

/*
 * One icon vocabulary for the whole site: Phosphor, duotone.
 *
 * Imported from the /ssr entrypoint because these render inside Server
 * Components. The default CSR build resolves its weight through IconContext,
 * which a Server Component cannot consume, so icons would silently fall back to
 * regular weight. Baking the weight in here rather than passing `weight` at
 * every call site means no page can drift onto a different one.
 *
 * Sizing still comes from Tailwind `size-*`: Phosphor emits width/height="1em"
 * as HTML attributes, and a CSS width/height always beats an attribute.
 */
type PhosphorIcon = typeof PhPhone
export type IconProps = ComponentProps<PhosphorIcon>
export type IconComponent = (props: IconProps) => ReactElement

function duotone(Icon: PhosphorIcon, name: string): IconComponent {
	function DuotoneIcon(props: IconProps) {
		return <Icon weight="duotone" {...props} />
	}
	DuotoneIcon.displayName = `Duotone(${name})`
	return DuotoneIcon
}

export const ArrowLeft = duotone(PhArrowLeft, "ArrowLeft")
export const ArrowRight = duotone(PhArrowRight, "ArrowRight")
export const ArrowUpRight = duotone(PhArrowUpRight, "ArrowUpRight")
export const BookOpen = duotone(PhBookOpen, "BookOpen")
export const Briefcase = duotone(PhBriefcase, "Briefcase")
export const Check = duotone(PhCheck, "Check")
export const Clock = duotone(PhClock, "Clock")
export const Eye = duotone(PhEye, "Eye")
export const FileText = duotone(PhFileText, "FileText")
export const Gauge = duotone(PhGauge, "Gauge")
export const Hash = duotone(PhHash, "Hash")
export const IdentificationCard = duotone(
	PhIdentificationCard,
	"IdentificationCard",
)
export const MapPin = duotone(PhMapPin, "MapPin")
export const Minus = duotone(PhMinus, "Minus")
export const Phone = duotone(PhPhone, "Phone")
export const Plus = duotone(PhPlus, "Plus")
export const ShieldCheck = duotone(PhShieldCheck, "ShieldCheck")
export const Siren = duotone(PhSiren, "Siren")
export const Star = duotone(PhStar, "Star")
export const Users = duotone(PhUsers, "Users")
export const Wallet = duotone(PhWallet, "Wallet")
export const Wrench = duotone(PhWrench, "Wrench")
export const X = duotone(PhX, "X")

/* Mapped to the closest Phosphor concept, keeping the call-site name. */
export const BadgeCheck = duotone(SealCheck, "SealCheck")
export const Building2 = duotone(Buildings, "Buildings")
export const CalendarDays = duotone(CalendarDots, "CalendarDots")
export const ChevronDown = duotone(CaretDown, "CaretDown")
export const ChevronRight = duotone(CaretRight, "CaretRight")
export const CircleHelp = duotone(Question, "Question")
export const CornerDownLeft = duotone(ArrowElbowDownLeft, "ArrowElbowDownLeft")
export const Droplets = duotone(Drop, "Drop")
export const Home = duotone(House, "House")
export const Loader2 = duotone(CircleNotch, "CircleNotch")
export const Locate = duotone(Crosshair, "Crosshair")
export const Mail = duotone(Envelope, "Envelope")
export const Maximize = duotone(CornersOut, "CornersOut")
export const Menu = duotone(List, "List")
export const RotateCcw = duotone(ArrowCounterClockwise, "ArrowCounterClockwise")
export const Search = duotone(MagnifyingGlass, "MagnifyingGlass")
export const Sparkles = duotone(Sparkle, "Sparkle")
