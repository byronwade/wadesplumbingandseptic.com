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
	"septic-tank-inspection-and-assessment": "Septic Tank Inspection",
	"engineered-septic-system-installation": "Engineered Septic Systems",
	"water-heater-installation": "Water Heater Installation",
	"tankless-water-heater-installation": "Tankless Water Heater Installation",
	"leak-detection": "Leak Detection",
	"septic-tank-maintenance-and-care": "Septic Care and Maintenance",
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
	{
		citySlug: "ben-lomond",
		serviceSlug: "septic-tank-maintenance-and-care",
		serviceTitle: serviceTitles["septic-tank-maintenance-and-care"]!,
		localAngle:
			"Ben Lomond is our home base, and much of town sits on small lots close to the San Lorenzo River. Many homes started as summer cabins with tanks sized for weekend use, then became full-time houses. The San Lorenzo River watershed has the highest density of septic systems of any comparable area in California, according to County Environmental Health, so routine care here protects both your system and the river.",
		commonIssues: [
			"Former cabins running full-time households on small, older tanks",
			"Buried lids with no riser, so nobody has checked the tank in years",
			"Effluent filters that clog and back up into the house",
			"Leach fields close to the river that stay wet through winter",
		],
		permitNote:
			"Since July 1, 2023, Santa Cruz County requires a septic tank inspection report and a seller and buyer disclosure when rural property on septic is sold (County Code 7.38.216). The pumping report must be less than 12 months old at close of escrow and include a leach field flow test of at least 250 gallons. Lid, riser, filter and pump fixes are minor maintenance and do not need a county permit. A failing tank or field must be repaired under a permit from County Environmental Health.",
		nearbySlugs: ["felton", "boulder-creek", "brookdale"],
		faq: [
			{
				question: "How often should a septic tank in Ben Lomond be pumped?",
				answer:
					"Santa Cruz County Environmental Health recommends pumping every 5 to 10 years, depending on how many people live in the home, water use, and whether you have a garbage disposal. A converted cabin with a small tank and a full household usually lands on the shorter end. Pumping must be done by a county registered liquid waste hauler. We do not pump tanks, but we can check the tank, filter and lids and tell you whether it is due.",
			},
			{
				question:
					"What does the county require when I sell a Ben Lomond home on septic?",
				answer:
					"Since July 1, 2023, the seller needs a septic tank inspection report and a disclosure form signed by seller and buyer before close of escrow. The pumping report must be less than 12 months old and include a flow test of the leach field using at least 250 gallons. Homes on public sewer, systems installed under permit in the last 5 years, and systems repaired under permit in the last 3 years are exempt. Starting early gives you time to fix lids, risers or filters before the report.",
			},
			{
				question: "Do I need a permit to fix my septic system?",
				answer:
					"Not for minor maintenance. County Environmental Health lists lids, risers, tees, sewer tightlines, pumps, valves and electrical parts as work that does not need a permit. Replacing a failed tank or leach field does need a permit. We hold California C-36 plumbing and C-42 sanitation licenses, which are among the license types the county accepts for septic installers.",
			},
			{
				question: "When should I call about my Ben Lomond septic system?",
				answer:
					"Call if drains run slow throughout the house, toilets gurgle, you smell sewage outside, or the ground over the tank or field stays soggy when it has not rained. Call before listing the home too, so small problems are fixed before the sale inspection.",
			},
		],
	},
	{
		citySlug: "felton",
		serviceSlug: "septic-tank-maintenance-and-care",
		serviceTitle: serviceTitles["septic-tank-maintenance-and-care"]!,
		localAngle:
			"Felton mixes homes on the flats near the San Lorenzo River with hillside lots up Zayante, Lompico and Felton Empire roads. On the flats the worry is a wet field in winter. On the hills it is roots, slope, and a tank nobody can find. Simple habits like keeping roof water off the leach field and planting only shallow roots over it go a long way here.",
		commonIssues: [
			"Roof and driveway runoff draining onto the leach field",
			"Redwood and oak roots reaching tanks and lines",
			"Older tanks with no records of where the lid or field is",
			"Driveways, decks or hot tubs built over part of the field",
		],
		permitNote:
			"Since July 1, 2023, Santa Cruz County requires a septic tank inspection report and a seller and buyer disclosure when rural property on septic is sold (County Code 7.38.216). The pumping report must be less than 12 months old at close of escrow and include a leach field flow test of at least 250 gallons. Repairs to a failing system need a County Environmental Health permit. On slopes over 30 percent, the county also requires a technical report for a new field or expansion area.",
		nearbySlugs: ["ben-lomond", "zayante", "mount-hermon"],
		faq: [
			{
				question: "What should I keep off my leach field in Felton?",
				answer:
					"County Environmental Health says not to drive over, build over or dig into the leach field. That means no vehicles, sheds, ponds, pools, hot tubs, paving or concrete. Plant grass or shallow rooted plants on top, keep deep rooted trees away, and send roof and yard drains away from the field.",
			},
			{
				question: "How often does a Felton septic tank need pumping?",
				answer:
					"The county recommends pumping every 5 to 10 years, based on household size, water use and whether you run a garbage disposal. Only a county registered liquid waste hauler may pump a tank. We do not pump, but we inspect tanks, clean and replace effluent filters, and add risers so the next pumping is easier.",
			},
			{
				question: "Can I add a room or ADU to a Felton home on septic?",
				answer:
					"It depends on what your system was permitted for. The county allows a one time addition under 500 square feet with no new bedrooms under repair standards. More bedrooms, more than 500 added square feet, or an extra unit usually means upgrade standards, and slopes over 30 percent need a technical report. Check your permitted system before you design the addition.",
			},
			{
				question: "What are the signs a Felton septic system is failing?",
				answer:
					"Watch for slow drains all through the house, gurgling, sewage smells outdoors, wet or unusually green patches over the field in dry weather, and backups after heavy water use like laundry days. Any of these is worth a call before it turns into a field replacement.",
			},
		],
	},
	{
		citySlug: "boulder-creek",
		serviceSlug: "septic-tank-maintenance-and-care",
		serviceTitle: serviceTitles["septic-tank-maintenance-and-care"]!,
		localAngle:
			"Boulder Creek homes sit under tall redwoods on steep, wooded lots, and many are a long drive up Highway 236, Bear Creek Road or Big Basin Way. Many of these systems rely on pumps and alarms to move effluent to the field, so winter storms and power outages often show up as septic problems.",
		commonIssues: [
			"Pump and alarm problems after storms and power outages",
			"Redwood roots in tanks, lines and distribution boxes",
			"Steep access that makes lids hard to reach",
			"Leach fields saturated by heavy winter rain",
		],
		permitNote:
			"Since July 1, 2023, Santa Cruz County requires a septic tank inspection report and a seller and buyer disclosure when rural property on septic is sold (County Code 7.38.216). The pumping report must be less than 12 months old at close of escrow and include a leach field flow test of at least 250 gallons. Fixing pumps, valves, lids, risers and electrical parts is minor maintenance with no county permit needed. A failing tank or field must be fixed under a County Environmental Health permit.",
		nearbySlugs: ["brookdale", "ben-lomond", "lompico"],
		faq: [
			{
				question:
					"My septic alarm is going off in Boulder Creek. What should I do?",
				answer:
					"An alarm usually means the liquid level in the pump tank is higher than it should be, often because the pump or its power failed. Cut water use right away, no laundry, dishwasher or long showers, and call us. We troubleshoot pumps, floats, alarms and wiring, which the county treats as minor maintenance that does not need a permit.",
			},
			{
				question: "How often should a Boulder Creek septic tank be pumped?",
				answer:
					"County Environmental Health recommends every 5 to 10 years depending on occupancy, water use and garbage disposal use. Systems with pumps benefit from a look at the pump chamber and alarm at the same time. Pumping itself must be done by a county registered liquid waste hauler. We do not pump tanks.",
			},
			{
				question: "Do redwood roots damage septic systems?",
				answer:
					"They can. Roots find their way into lids, joints, distribution boxes and leach lines, especially on older systems. The county advises keeping trees and deep rooted plants off the leach field and planting grass or shallow rooted plants instead. If drains slow down year after year, a camera inspection of the lines can show whether roots are the cause.",
			},
			{
				question:
					"What septic paperwork is needed to sell a home in Boulder Creek?",
				answer:
					"Since July 1, 2023, the seller needs a septic tank inspection report and a disclosure form before close of escrow, with a pumping report less than 12 months old that includes a leach field flow test of at least 250 gallons. If the home has an enhanced treatment system, the buyer must also get a service provider inspection report from the last 6 months.",
			},
		],
	},
	{
		citySlug: "bonny-doon",
		serviceSlug: "septic-tank-maintenance-and-care",
		serviceTitle: serviceTitles["septic-tank-maintenance-and-care"]!,
		localAngle:
			"Most Bonny Doon homes pair a private well with a septic system on the same parcel, so keeping the two apart and healthy is the whole job. Many properties were rebuilt after the 2020 CZU fire with newer or enhanced systems, while others still run on original tanks that need care to keep working.",
		commonIssues: [
			"Older tanks on parcels that were never rebuilt after the fires",
			"Enhanced treatment systems that need regular service contracts",
			"Long driveways and gates that limit truck access",
			"Fire rebuild crews and equipment driving over leach fields",
		],
		permitNote:
			"Since July 1, 2023, Santa Cruz County requires a septic tank inspection report and a seller and buyer disclosure when rural property on septic is sold (County Code 7.38.216). The pumping report must be less than 12 months old at close of escrow and include a leach field flow test of at least 250 gallons. Since September 1, 2025, rural sales on a private well also need a well yield and water quality test and a disclosure filed with the county.",
		nearbySlugs: ["davenport", "ben-lomond", "felton"],
		faq: [
			{
				question: "What does an enhanced septic system in Bonny Doon need?",
				answer:
					"County Environmental Health requires owners of enhanced treatment systems to contract with an approved Onsite System Service Provider for regular inspection and maintenance. The county sets how often and what gets checked. When the home sells, the buyer must receive a service provider inspection report from the 6 months before close of escrow.",
			},
			{
				question: "How do I protect my well and septic system together?",
				answer:
					"Keep vehicles, buildings, pools and paving off the leach field, send roof and yard drains away from it, and keep chemicals, paint and grease out of your drains. Use less water where you can, which the county notes can extend the life of the system. Pump the tank on schedule so solids do not reach the field.",
			},
			{
				question: "How often should I pump my Bonny Doon septic tank?",
				answer:
					"The county recommends every 5 to 10 years depending on household size and water use. Only a county registered liquid waste hauler can pump a tank, so plan for truck access down long driveways and through gates. We do not pump tanks, but we can inspect the tank and filter and install risers to make pumping simpler.",
			},
			{
				question:
					"What is required to sell a Bonny Doon home on septic and a well?",
				answer:
					"For the septic system, a tank inspection report and seller and buyer disclosure are due before close of escrow, with a pumping report under 12 months old that includes a leach field flow test of at least 250 gallons. Since September 1, 2025, the seller must also test the well for yield and water quality and send a disclosure to the buyer and the county.",
			},
		],
	},
	{
		citySlug: "scotts-valley",
		serviceSlug: "septic-tank-maintenance-and-care",
		serviceTitle: serviceTitles["septic-tank-maintenance-and-care"]!,
		localAngle:
			"Much of central Scotts Valley is on sewer, but many homes in the surrounding hills still rely on septic. Those are often larger family homes where an added bedroom, a remodel or a new ADU can outgrow what the system was permitted for. Knowing your permitted system before you build saves a redesign later.",
		commonIssues: [
			"Remodels and ADUs that outgrow the permitted system",
			"Not knowing whether the home is on sewer or septic",
			"Garbage disposals adding solids to older tanks",
			"Home sales needing septic reports on a short timeline",
		],
		permitNote:
			"Since July 1, 2023, Santa Cruz County requires a septic tank inspection report and a seller and buyer disclosure when rural property on septic is sold (County Code 7.38.216). The pumping report must be less than 12 months old at close of escrow and include a leach field flow test of at least 250 gallons. Homes on public sewer are exempt. Work that adds bedrooms or more than 500 square feet usually falls under the county's upgrade standards.",
		nearbySlugs: ["felton", "mount-hermon", "pasatiempo"],
		faq: [
			{
				question: "Is my Scotts Valley home on sewer or septic?",
				answer:
					"Check your sewer bill or property tax bill first, and look for a tank lid or riser in the yard. County Environmental Health also keeps septic permit records you can look up online. If you are still unsure, we can locate the tank or the sewer connection for you.",
			},
			{
				question: "Can I add an ADU to a Scotts Valley home on septic?",
				answer:
					"Possibly, but it usually means more than the existing system. The county treats an additional tank or system for an accessory dwelling unit, extra bedrooms, or more than 500 added square feet as an upgrade, which must meet current standards. Repair standards only cover a one time addition under 500 square feet with no new bedrooms.",
			},
			{
				question: "How often should a Scotts Valley septic tank be pumped?",
				answer:
					"Santa Cruz County recommends every 5 to 10 years. Homes with a garbage disposal or a large household should plan on the shorter end. A county registered liquid waste hauler must do the pumping. We do not pump tanks, but we inspect tanks and filters and fix lids, risers and baffles.",
			},
			{
				question:
					"What septic report is needed to sell a Scotts Valley home on septic?",
				answer:
					"Since July 1, 2023, the seller needs a septic tank inspection report and a disclosure form before close of escrow, and the pumping report must be under 12 months old with a leach field flow test of at least 250 gallons. If the report finds a failure, it must be repaired under a county permit within 90 days of closing.",
			},
		],
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

/**
 * The city × service spokes for one city hub page, by the hub's pathname.
 * The hub links to them so they are reachable from the site, not only the
 * sitemap.
 */
export function getCityServiceLinksForHub(hubPathname: string) {
	const location = serviceAreaLocations.find(
		(item) => item.href === hubPathname,
	)
	if (!location) return []

	return cityServicePages
		.filter((page) => page.citySlug === location.slug)
		.map((page) => ({
			title: page.serviceTitle,
			href: cityServicePath(page.citySlug, page.serviceSlug),
			cityName: location.name,
		}))
}

/** The city spokes for one service page, so the service links to them. */
export function getCityServiceLinksForService(serviceSlug: string) {
	return cityServicePages
		.filter((page) => page.serviceSlug === serviceSlug)
		.flatMap((page) => {
			const location = getCityLocation(page.citySlug)
			return location
				? [
						{
							cityName: location.name,
							href: cityServicePath(page.citySlug, page.serviceSlug),
							title: page.serviceTitle,
						},
					]
				: []
		})
}
