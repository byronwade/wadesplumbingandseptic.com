import { serviceAreaLocations } from "@/lib/service-areas"

/**
 * Selective city × service spokes for programmatic SEO.
 * Every row must include unique localAngle + commonIssues (enforced by CI).
 * Do not publish city-name find/replace stubs.
 */
export type CityServicePage = {
	citySlug: string
	serviceSlug: string
	serviceTitle: string
	localAngle: string
	commonIssues: [string, string, string, ...string[]]
	permitNote?: string
	nearbySlugs: [string, string, ...string[]]
	faq?: Array<{ question: string; answer: string }>
}

const serviceTitles: Record<string, string> = {
	"drain-cleaning": "Drain Cleaning",
	"hydro-jetting": "Hydro Jetting",
	"septic-tank-cleaning-and-pumping": "Septic Tank Pumping",
	"septic-tank-inspection-and-assessment": "Septic Tank Inspection",
	"engineered-septic-system-installation": "Engineered Septic Systems",
	"water-heater-installation": "Water Heater Installation",
	"tankless-water-heater-installation": "Tankless Water Heater Installation",
	"leak-detection": "Leak Detection",
	"trenchless-sewer-line-replacement": "Trenchless Sewer Line Replacement",
}

export const cityServicePages: CityServicePage[] = [
	{
		citySlug: "felton",
		serviceSlug: "septic-tank-inspection-and-assessment",
		serviceTitle: serviceTitles["septic-tank-inspection-and-assessment"]!,
		localAngle:
			"Felton parcels along Highway 9 and Graham Hill often mix older tanks with redwood roots and steep access. Inspections here focus on riser access, filter condition, and whether the drainfield can still accept effluent on clay and hillside soils.",
		commonIssues: [
			"Missing or buried lids that make pumping hard after storms",
			"Root intrusion near older clay laterals",
			"Uneven distribution on sloped drainfields",
			"Real-estate deadlines needing same-week documentation",
		],
		permitNote:
			"Santa Cruz County Environmental Health may require specific inspection forms for transfers. We document findings in plain language for your agent or lender.",
		nearbySlugs: ["ben-lomond", "mount-hermon", "boulder-creek"],
		faq: [
			{
				question: "Do Felton home sales need a septic inspection?",
				answer:
					"Many lenders and buyers request one. County rules and private contracts vary, so we inspect to practical standards for your parcel and explain what we find before you negotiate repairs.",
			},
		],
	},
	{
		citySlug: "felton",
		serviceSlug: "septic-tank-cleaning-and-pumping",
		serviceTitle: serviceTitles["septic-tank-cleaning-and-pumping"]!,
		localAngle:
			"San Lorenzo Valley homes in Felton often run full-time occupancy on tanks sized decades ago. Pumping intervals depend on household size and whether a garbage disposal or under-sink filter is pushing solids faster than the tank can settle.",
		commonIssues: [
			"Alarms after holiday guests overload the tank",
			"Slow drains house-wide when the tank is due",
			"Difficult truck access on narrow redwood driveways",
			"Filters clogged with lint and grease between pump-outs",
		],
		nearbySlugs: ["ben-lomond", "zayante", "brookdale"],
	},
	{
		citySlug: "boulder-creek",
		serviceSlug: "septic-tank-cleaning-and-pumping",
		serviceTitle: serviceTitles["septic-tank-cleaning-and-pumping"]!,
		localAngle:
			"Boulder Creek's canyon lots and long private roads mean pump trucks need clear staging and accurate lid locations. Many systems sit under leaf litter from dense canopy, so we locate access before guessing with a shovel.",
		commonIssues: [
			"Buried risers under years of forest debris",
			"Seasonal cabins that sit idle then get weekend spikes",
			"Steep grades that limit truck approach",
			"Odors after the first heavy rains of the season",
		],
		nearbySlugs: ["brookdale", "ben-lomond", "bonny-doon"],
	},
	{
		citySlug: "ben-lomond",
		serviceSlug: "engineered-septic-system-installation",
		serviceTitle: serviceTitles["engineered-septic-system-installation"]!,
		localAngle:
			"Ben Lomond hillside and creek-adjacent parcels often fail conventional percolation or setback tests. Engineered and advanced treatment options are how many rebuilds and additions stay viable without a full sewer connection.",
		commonIssues: [
			"Failed perc tests on tight soils",
			"Small usable envelopes between wells, slopes, and structures",
			"Replacement after storm damage or surfacing effluent",
			"Coordination with designers for county plan check",
		],
		permitNote:
			"Expect Santa Cruz County review for engineered designs. We work with your designer or help you understand what the site can support before you invest in plans.",
		nearbySlugs: ["felton", "boulder-creek", "bonny-doon"],
	},
	{
		citySlug: "bonny-doon",
		serviceSlug: "engineered-septic-system-installation",
		serviceTitle: serviceTitles["engineered-septic-system-installation"]!,
		localAngle:
			"Bonny Doon's ridges, shallow soils, and fire rebuild constraints make conventional leach fields uncommon on many parcels. Engineered systems are often the practical path when you are replacing a failed field or building after the CZU fires.",
		commonIssues: [
			"Limited soil depth over rock",
			"Long driveways and staging challenges for equipment",
			"Rebuild timelines tied to permits and power restoration history",
			"Protecting remaining trees while placing treatment components",
		],
		nearbySlugs: ["davenport", "boulder-creek", "ben-lomond"],
	},
	{
		citySlug: "zayante",
		serviceSlug: "septic-tank-inspection-and-assessment",
		serviceTitle: serviceTitles["septic-tank-inspection-and-assessment"]!,
		localAngle:
			"Zayante's winding canyon roads hide older septic systems on irregular lots. Inspections here check for tank integrity, pump function where present, and whether the field is accepting water after wet winters.",
		commonIssues: [
			"Unknown system age with no prior records",
			"Surfacing near the leach area after storms",
			"Electrical issues on pump systems after outages",
			"Access limited by narrow bridges and private roads",
		],
		nearbySlugs: ["felton", "lompico", "mount-hermon"],
	},
	{
		citySlug: "santa-cruz",
		serviceSlug: "drain-cleaning",
		serviceTitle: serviceTitles["drain-cleaning"]!,
		localAngle:
			"Santa Cruz neighborhoods mix older cast-iron laterals near the ocean with newer ABS in hillside tracts. Salt air, restaurant grease downtown, and tree roots in Westside and Seabright yards show up as repeat slow drains if you only snake and never camera.",
		commonIssues: [
			"Kitchen lines packed with grease near older homes",
			"Roots in clay laterals under street trees",
			"Condo and ADU shared lines with unclear ownership",
			"Recurring tub backups after heavy use weekends",
		],
		nearbySlugs: ["live-oak", "twin-lakes", "capitola"],
	},
	{
		citySlug: "santa-cruz",
		serviceSlug: "hydro-jetting",
		serviceTitle: serviceTitles["hydro-jetting"]!,
		localAngle:
			"When Santa Cruz main lines keep clogging after a cable snaking, hydro jetting removes grease and scale that a blade only punches through. We confirm pipe condition with a camera when the line history is unknown.",
		commonIssues: [
			"Restaurant and multi-unit grease accumulation",
			"Scale in older galvanized and cast runs",
			"Partial collapses that need camera confirmation first",
			"Odors from partially blocked vents and laterals",
		],
		nearbySlugs: ["live-oak", "soquel", "capitola"],
	},
	{
		citySlug: "santa-cruz",
		serviceSlug: "water-heater-installation",
		serviceTitle: serviceTitles["water-heater-installation"]!,
		localAngle:
			"Coastal Santa Cruz installs have to account for tight garages, seismic strapping, and permit paths that differ from mountain well homes. We size tank and tankless options for real occupancy, not brochure peak flow.",
		commonIssues: [
			"Rusty tanks in damp garages near the ocean",
			"Undersized units after ADU additions",
			"Venting limits on tankless retrofits",
			"Unexpected heater failures that leave a household without hot water",
		],
		nearbySlugs: ["live-oak", "capitola", "scotts-valley"],
	},
	{
		citySlug: "watsonville",
		serviceSlug: "drain-cleaning",
		serviceTitle: serviceTitles["drain-cleaning"]!,
		localAngle:
			"Watsonville's agricultural edges and older downtown laterals see silt, grease, and root problems that differ from beachside Santa Cruz. We clear the stoppage and tell you if the line needs repair, not another temporary cable pass.",
		commonIssues: [
			"Main line backups affecting multiple fixtures",
			"Outdoor cleanouts buried in landscaping",
			"Grease from home cooking in older kitchen stacks",
			"Storm-related groundwater infiltration on low lots",
		],
		nearbySlugs: ["freedom", "interlaken", "la-selva-beach"],
	},
	{
		citySlug: "watsonville",
		serviceSlug: "water-heater-installation",
		serviceTitle: serviceTitles["water-heater-installation"]!,
		localAngle:
			"South County homes in Watsonville often need straightforward tank replacements done to current code, with clear pricing before the old unit comes out. Hard water in some pockets shortens heater life when anodes and flushing are ignored.",
		commonIssues: [
			"Sediment noise and cold sandwiches at the end of tank life",
			"Leaking pans in laundry closets",
			"Permit and strap updates on older installs",
			"Choosing tank vs tankless for larger households",
		],
		nearbySlugs: ["freedom", "corralitos", "aptos"],
	},
	{
		citySlug: "scotts-valley",
		serviceSlug: "drain-cleaning",
		serviceTitle: serviceTitles["drain-cleaning"]!,
		localAngle:
			"Scotts Valley's mix of HOA tracts and wooded lots means roots and builder-grade laterals show up as slow showers upstairs while kitchen lines still drain. We isolate the branch vs main before recommending jetting or repair.",
		commonIssues: [
			"Upstairs bathroom backups on shared stacks",
			"Roots at the property line lateral",
			"HOA access rules for exterior cleanouts",
			"Recurring clogs after only partial clearing",
		],
		nearbySlugs: ["mount-hermon", "felton", "santa-cruz"],
	},
	{
		citySlug: "scotts-valley",
		serviceSlug: "water-heater-installation",
		serviceTitle: serviceTitles["water-heater-installation"]!,
		localAngle:
			"Many Scotts Valley homes have garage installs with tight clearances and seismic requirements. We replace failed tanks cleanly and discuss tankless only when gas, venting, and electrical really support it.",
		commonIssues: [
			"Age-related tank leaks over vehicles",
			"Pilot and ignition failures on older units",
			"Expansion tank and shutoff upgrades during replacement",
			"Scheduling around remote-work households",
		],
		nearbySlugs: ["santa-cruz", "felton", "capitola"],
	},
	{
		citySlug: "capitola",
		serviceSlug: "drain-cleaning",
		serviceTitle: serviceTitles["drain-cleaning"]!,
		localAngle:
			"Capitola's older beach-adjacent housing and village density mean short laterals, shared cleanouts, and grease from frequent entertaining. Quick clearing matters, but so does knowing when the pipe itself is the problem.",
		commonIssues: [
			"Street-side cleanout access in tight parking",
			"Sand and debris in outdoor drains after windy days",
			"Condo common-line confusion",
			"Slow showers tied to venting as much as clogs",
		],
		nearbySlugs: ["soquel", "aptos", "live-oak"],
	},
	{
		citySlug: "aptos",
		serviceSlug: "hydro-jetting",
		serviceTitle: serviceTitles["hydro-jetting"]!,
		localAngle:
			"Aptos and Rio Del Mar area lines collect grease and roots under mature landscaping. Hydro jetting is often the right step after camera confirmation, especially when snaking only buys a few weeks.",
		commonIssues: [
			"Roots at mid-yard bellies",
			"Grease from long kitchen runs",
			"Soft spots that need repair instead of more cleaning",
			"Odors at cleanouts after incomplete clearing",
		],
		nearbySlugs: ["rio-del-mar", "capitola", "soquel"],
	},
	{
		citySlug: "aptos",
		serviceSlug: "water-heater-installation",
		serviceTitle: serviceTitles["water-heater-installation"]!,
		localAngle:
			"Aptos homes range from coastal bungalows to larger inland properties. We match heater capacity to real hot-water demand and handle code updates so the new unit is safe and serviceable.",
		commonIssues: [
			"Failed tanks in crawlspace or garage installs",
			"Undersized heaters after bathroom remodels",
			"Tankless retrofits with marginal gas supply",
			"Same-week replacements when a tank ruptures",
		],
		nearbySlugs: ["capitola", "rio-del-mar", "watsonville"],
	},
	{
		citySlug: "live-oak",
		serviceSlug: "drain-cleaning",
		serviceTitle: serviceTitles["drain-cleaning"]!,
		localAngle:
			"Live Oak's mid-century housing stock often has original laterals under driveways and mature trees. We clear the clog and tell you if camera evidence points to a repair before you pay for repeated service calls.",
		commonIssues: [
			"Roots under driveway laterals",
			"Kitchen and laundry on long shared branches",
			"Cleanouts paved over during past remodels",
			"Backups that only appear during parties or holidays",
		],
		nearbySlugs: ["santa-cruz", "twin-lakes", "capitola"],
	},
	{
		citySlug: "mount-hermon",
		serviceSlug: "septic-tank-cleaning-and-pumping",
		serviceTitle: serviceTitles["septic-tank-cleaning-and-pumping"]!,
		localAngle:
			"Mount Hermon cabins and full-time homes share steep access and heavy tree cover. Pumping visits go smoother when lids are marked and vehicles can stage without blocking the one-lane approaches common here.",
		commonIssues: [
			"Seasonal occupancy swings",
			"Difficult lid access under decks",
			"Pump systems after power blips",
			"Scheduling around camp and conference traffic",
		],
		nearbySlugs: ["felton", "scotts-valley", "ben-lomond"],
	},
	{
		citySlug: "brookdale",
		serviceSlug: "septic-tank-inspection-and-assessment",
		serviceTitle: serviceTitles["septic-tank-inspection-and-assessment"]!,
		localAngle:
			"Brookdale's small parcels along the San Lorenzo corridor often have compact systems with limited records. Inspections emphasize tank condition, evidence of past surfacing, and whether the field still matches how the home is used today.",
		commonIssues: [
			"No as-built drawings for older tanks",
			"Flood-adjacent concerns after high river years",
			"Filters never serviced between pump-outs",
			"Buyers needing clear pass/fail language",
		],
		nearbySlugs: ["boulder-creek", "ben-lomond", "felton"],
	},
	{
		citySlug: "davenport",
		serviceSlug: "leak-detection",
		serviceTitle: serviceTitles["leak-detection"]!,
		localAngle:
			"Davenport and north coast properties deal with wind, salt, and long supply runs from meters or wells. Hidden leaks waste scarce water and can undermine older foundations if they go unnoticed under decks or crawlspaces.",
		commonIssues: [
			"Unexplained high water use",
			"Damp crawlspaces after wind-driven rain",
			"Irrigation vs domestic line confusion",
			"Corrosion on exposed coastal piping",
		],
		nearbySlugs: ["bonny-doon", "santa-cruz", "boulder-creek"],
	},
	{
		citySlug: "soquel",
		serviceSlug: "trenchless-sewer-line-replacement",
		serviceTitle: serviceTitles["trenchless-sewer-line-replacement"]!,
		localAngle:
			"Soquel yards with mature landscaping and established driveways are poor candidates for open-cut sewer replacement when the pipe path is otherwise repairable. Trenchless options limit disruption when camera inspection shows a continuous host pipe.",
		commonIssues: [
			"Offset joints under driveways",
			"Root intrusion at mid-lot",
			"Preserving hardscape and trees",
			"Coordinating with county or district lateral rules",
		],
		nearbySlugs: ["capitola", "aptos", "live-oak"],
	},
	{
		citySlug: "rio-del-mar",
		serviceSlug: "drain-cleaning",
		serviceTitle: serviceTitles["drain-cleaning"]!,
		localAngle:
			"Rio Del Mar's coastal bluff and village streets combine vacation rentals with full-time homes. Drain calls often follow weekend turnover when grease and wipes hit older lines harder than weekday use.",
		commonIssues: [
			"Vacation rental overload clogs",
			"Sand in exterior drains",
			"Shared laterals on compact lots",
			"Recurring kitchen stoppages",
		],
		nearbySlugs: ["aptos", "la-selva-beach", "capitola"],
	},
	{
		citySlug: "la-selva-beach",
		serviceSlug: "septic-tank-cleaning-and-pumping",
		serviceTitle: serviceTitles["septic-tank-cleaning-and-pumping"]!,
		localAngle:
			"La Selva Beach still has pockets of septic near the coast where sandy soils and vacation use change how fast tanks fill. Pumping schedules should match actual occupancy, not a generic annual postcard.",
		commonIssues: [
			"Seasonal rental spikes",
			"Lids hidden in coastal landscaping",
			"Alarm calls after holiday weekends",
			"Coordinating access on narrow beach streets",
		],
		nearbySlugs: ["aptos", "watsonville", "rio-del-mar"],
	},
	{
		citySlug: "lompico",
		serviceSlug: "septic-tank-inspection-and-assessment",
		serviceTitle: serviceTitles["septic-tank-inspection-and-assessment"]!,
		localAngle:
			"Lompico's remote canyon setting means systems are often older, under-documented, and reached by narrow roads. A good inspection here saves a buyer from discovering a failed field after close of escrow.",
		commonIssues: [
			"Long travel and staging for equipment",
			"Unknown tank materials and baffles",
			"Evidence of past DIY alterations",
			"Wet-weather performance concerns",
		],
		nearbySlugs: ["zayante", "felton", "boulder-creek"],
	},
]

export function cityServicePath(citySlug: string, serviceSlug: string) {
	return `/service-area/${citySlug}/${serviceSlug}`
}

export function getCityServicePage(citySlug: string, serviceSlug: string) {
	return (
		cityServicePages.find(
			(page) => page.citySlug === citySlug && page.serviceSlug === serviceSlug,
		) ?? null
	)
}

export function getCityServiceStaticParams() {
	return cityServicePages.map((page) => ({
		city: page.citySlug,
		service: page.serviceSlug,
	}))
}

export function getCityLocation(citySlug: string) {
	return serviceAreaLocations.find((location) => location.slug === citySlug)
}

export function getNearbyCityLocations(slugs: string[]) {
	return slugs
		.map((slug) => getCityLocation(slug))
		.filter((location): location is NonNullable<typeof location> =>
			Boolean(location),
		)
}
