import type { GlossaryTerm } from "@/lib/glossary/types"

export const septicTerms: GlossaryTerm[] = [
	{
		slug: "advanced-treatment-unit",
		term: "Advanced Treatment Unit",
		alsoKnownAs: ["ATU", "Secondary Treatment Unit"],
		shortDefinition:
			"A septic component that treats wastewater beyond primary settling, producing cleaner effluent before it reaches soil dispersal or a treatment discharge point.",
		definition:
			"An advanced treatment unit adds a secondary treatment stage after the septic tank. Aerobic bacteria, filters, or other processes reduce organic matter, pathogens, and sometimes nutrients in the effluent.\n\nThese units are common where standard drain fields cannot meet local water quality goals. They require regular maintenance, electrical power, and monitoring to stay in compliance.",
		localContext:
			"Santa Cruz County often requires advanced treatment along the coast, near creeks, or on small lots with shallow or slow soils. Environmental Health may specify nitrogen-reducing or disinfecting units when a conventional system cannot meet setback or loading limits in places like Aptos, Live Oak, or the San Lorenzo Valley.",
		homeownerTip:
			"Keep your ATU service contract current and respond quickly to alarm or control-panel warnings.",
		relatedServiceSlugs: [
			"engineered-septic-system-installation",
			"septic-tank-maintenance-and-care",
			"septic-tank-system-compliance-and-permitting",
		],
		relatedTermSlugs: [
			"aerobic-treatment-unit",
			"nitrogen-reduction-system",
			"sand-filter-system",
			"effluent",
		],
	},
	{
		slug: "aerobic-treatment-unit",
		term: "Aerobic Treatment Unit",
		alsoKnownAs: ["ATU"],
		shortDefinition:
			"A tank or chamber that uses oxygen-fed bacteria to break down wastewater after primary settling in the septic tank, producing clearer effluent for dispersal.",
		definition:
			"An aerobic treatment unit pumps air into a treatment chamber so aerobic bacteria digest organic waste more thoroughly than in a standard anaerobic tank. The result is clearer effluent with fewer solids and pathogens.\n\nATUs include blowers, diffusers, and often an alarm when airflow or power fails. They are a type of advanced treatment used when site conditions limit a basic drain field.",
		localContext:
			"In Santa Cruz County hillside and coastal parcels, ATUs appear on engineered designs where room for a large leach field is limited or where regulators want extra treatment before effluent reaches sandy or fractured soils near the Monterey Bay.",
		homeownerTip:
			"Listen for the blower running normally and never cover vents or electrical panels that service the unit.",
		relatedServiceSlugs: [
			"engineered-septic-system-installation",
			"septic-tank-troubleshooting-and-diagnostic-services",
			"septic-tank-maintenance-and-care",
		],
		relatedTermSlugs: [
			"advanced-treatment-unit",
			"pump-chamber",
			"septic-alarm-system",
			"effluent-filter",
		],
	},
	{
		slug: "alarm-float-switch",
		term: "Alarm Float Switch",
		alsoKnownAs: ["High-water alarm float"],
		shortDefinition:
			"A float sensor installed in a pump tank or aerobic unit that triggers a visual or audible alarm when effluent rises above a safe operating level.",
		definition:
			"An alarm float switch sits at a set height inside a pump chamber or treatment tank. When effluent rises too high, the float closes a circuit and activates a visual or audible alarm, often at the house or panel.\n\nHigh water usually means a failed pump, clogged line, saturated drain field, or electrical problem. The alarm is a warning to stop heavy water use and call for service before a backup occurs.",
		localContext:
			"Santa Cruz County engineered systems on slopes or in low-lying coastal areas rely on alarms because a pump failure can back up quickly when the drain field is stressed by winter storms or high groundwater.",
		homeownerTip:
			"If your septic alarm sounds, reduce water use immediately and schedule service before resetting the panel.",
		relatedServiceSlugs: [
			"septic-tank-alarm-installation",
			"septic-tank-troubleshooting-and-diagnostic-services",
			"septic-tank-repair-and-replacement",
		],
		relatedTermSlugs: [
			"septic-alarm-system",
			"pump-chamber",
			"hydraulic-overload",
			"lift-station",
		],
	},
	{
		slug: "alternative-septic-system",
		term: "Alternative Septic System",
		alsoKnownAs: ["Non-standard septic system"],
		shortDefinition:
			"Any county-approved onsite wastewater design beyond a basic tank and gravity drain field, including mounds, aerobic units, sand filters, and dosing.",
		definition:
			"Alternative septic systems use engineered components to treat or disperse effluent where conventional trenches are not suitable. Examples include mound systems, pressure dosing, sand filters, and aerobic treatment units.\n\nThese designs follow stricter permitting, construction, and maintenance rules. They are chosen for tight lots, poor soils, high groundwater, or sensitive watersheds.",
		localContext:
			"Santa Cruz County Environmental Health reviews alternative systems throughout the county, especially in the mountains, along creeks, and on coastal bluffs where clay, rock, or shallow depth rule out standard leach lines.",
		homeownerTip:
			"Ask for the approved operation and maintenance manual when you buy a home with a non-conventional system.",
		relatedServiceSlugs: [
			"engineered-septic-system-installation",
			"septic-tank-design-and-engineering",
			"septic-tank-system-compliance-and-permitting",
		],
		relatedTermSlugs: [
			"engineered-septic-system",
			"mound-system",
			"advanced-treatment-unit",
			"conventional-septic-system",
		],
	},
	{
		slug: "baffle",
		term: "Baffle",
		alsoKnownAs: ["Tank baffle", "Tees and baffles"],
		shortDefinition:
			"An internal wall or tee inside a septic tank that directs flow and keeps floating scum and settled sludge from passing through the outlet pipe.",
		definition:
			"Inlet and outlet baffles slow incoming wastewater and block floating scum and settled sludge from passing into the drain field. Concrete, plastic, or PVC tees perform the same job at the pipe connections.\n\nBroken or missing baffles let solids carry over into effluent lines, which clogs filters, distribution boxes, and soil absorption areas. Inspection during pumping is the best time to check baffle condition.",
		localContext:
			"Older tanks in Santa Cruz County, including pre-1980 rural properties in Bonny Doon and the Summit area, often have deteriorated concrete baffles that need repair during routine maintenance.",
		homeownerTip:
			"Request a baffle check every time the tank is pumped and repair damaged tees before they foul the drain field.",
		relatedServiceSlugs: [
			"septic-tank-repair-and-replacement",
			"septic-tank-inspection-and-assessment",
			"septic-tank-cleaning-and-pumping",
		],
		relatedTermSlugs: [
			"septic-tank",
			"effluent-filter",
			"scum-layer",
			"sludge-layer",
		],
	},
	{
		slug: "biomat",
		term: "Biomat",
		alsoKnownAs: ["Biological mat"],
		shortDefinition:
			"A thin biological layer that forms at the soil interface in a drain field and regulates how quickly and evenly septic effluent absorbs into the ground.",
		definition:
			"Biomat is a gel-like layer of microorganisms and fine solids that builds at the bottom of trenches or chambers where effluent meets soil. A healthy biomat slows infiltration enough to treat pathogens and organics.\n\nIf too many solids reach the field, the biomat thickens and the soil stops accepting water. That leads to surfacing effluent, odors, and system failure.",
		localContext:
			"Sandy soils near Capitola and Seacliff can accept effluent quickly, while clayey Santa Cruz Mountain soils form a stronger biomat that fails faster when overloaded or fed excess solids.",
		homeownerTip:
			"Protect the biomat by pumping on schedule and keeping solids out of the drain field with a clean effluent filter.",
		relatedServiceSlugs: [
			"drainfield-repair-and-replacement",
			"septic-tank-leach-field-repair-and-replacement",
			"septic-filter-cleaning-and-replacement",
		],
		relatedTermSlugs: [
			"drain-field",
			"soil-absorption-field",
			"hydraulic-overload",
			"effluent-filter",
		],
	},
	{
		slug: "cesspool",
		term: "Cesspool",
		alsoKnownAs: ["Cess pit"],
		shortDefinition:
			"An older onsite pit that holds raw wastewater with little separation or treatment, unlike a modern septic tank paired with a dedicated drain field.",
		definition:
			"A cesspool is a lined or unlined excavation that collects sewage directly in the ground. Liquids and solids often share the same space, with limited separation and no dedicated soil treatment area.\n\nCesspools are obsolete under modern codes and pose groundwater and surface water risks. Many must be upgraded, abandoned, or replaced with a permitted septic system when properties change use or fail inspection.",
		localContext:
			"Legacy cesspools still appear on older Santa Cruz County parcels, particularly historic coastal cottages and rural cabins. Environmental Health typically requires replacement or formal abandonment during sale, remodel, or failure.",
		homeownerTip:
			"If records mention a cesspool, plan for an inspection and budget for upgrade or abandonment before escrow closes.",
		relatedServiceSlugs: [
			"septic-system-abandonment",
			"septic-system-installation",
			"septic-tank-inspection-and-assessment",
		],
		relatedTermSlugs: [
			"septic-tank",
			"septic-abandonment",
			"conventional-septic-system",
			"soil-absorption-field",
		],
	},
	{
		slug: "chamber-system",
		term: "Chamber System",
		alsoKnownAs: ["Leaching chamber", "Plastic chamber drain field"],
		shortDefinition:
			"A drain field built with open-bottom plastic chambers instead of traditional pipe-and-gravel trenches to store and disperse effluent into native soil.",
		definition:
			"Chamber systems use arched plastic units buried in trenches to hold effluent against the soil bottom. They replace traditional perforated pipe and stone while providing storage and equal contact area.\n\nChambers can shorten installation time and work on some sites with limited aggregate. The soil beneath the chamber still must meet percolation and separation requirements.",
		localContext:
			"Chamber fields are used on Santa Cruz County sites where gravel delivery is difficult or where designers want a larger infiltrative footprint on moderate slopes in Scotts Valley and the San Lorenzo Valley.",
		homeownerTip:
			"Never drive or store heavy equipment over chamber lines, because crushed chambers reduce treatment capacity.",
		relatedServiceSlugs: [
			"septic-system-installation",
			"drainfield-repair-and-replacement",
			"septic-tank-leach-field-repair-and-replacement",
		],
		relatedTermSlugs: [
			"drain-field",
			"trench-drain-field",
			"soil-absorption-field",
			"percolation-test",
		],
	},
	{
		slug: "conventional-septic-system",
		term: "Conventional Septic System",
		alsoKnownAs: ["Standard septic system"],
		shortDefinition:
			"A septic tank paired with a gravity-fed drain field that treats household wastewater through settling in the tank and absorption in the soil.",
		definition:
			"A conventional system sends wastewater to a septic tank where solids settle and scum floats. Clarified effluent flows by gravity to perforated pipes in a drain field, where soil completes treatment.\n\nThese systems work on sites with suitable soil depth, percolation rates, and setbacks from wells and waterways. They remain the baseline design where local codes and site tests allow.",
		localContext:
			"Many inland Santa Cruz County lots with deep, well-drained soils still qualify for conventional systems, while coastal and hillside parcels more often need engineered alternatives.",
		homeownerTip:
			"Pump the tank on the interval your pumper recommends, even when the system seems fine above ground.",
		relatedServiceSlugs: [
			"septic-system-installation",
			"septic-tank-maintenance-and-care",
			"septic-tank-inspection-and-assessment",
		],
		relatedTermSlugs: [
			"septic-tank",
			"drain-field",
			"alternative-septic-system",
			"distribution-box",
		],
	},
	{
		slug: "distribution-box",
		term: "Distribution Box",
		alsoKnownAs: ["D-box", "Drop box"],
		shortDefinition:
			"A small buried vault between the septic tank and leach lines that splits effluent evenly among multiple drain field trenches in a gravity system.",
		definition:
			"The distribution box sits between the outlet pipe and the leach lines. Internal partitions or outlets aim to send equal flow to each trench so one line does not take all the effluent.\n\nA tilted, cracked, or clogged box causes uneven loading, which saturates one trench while others dry out. Leveling and cleaning the box can extend field life when caught early.",
		localContext:
			"On sloped Santa Cruz County lots, distribution boxes can shift over time as soil settles, making periodic inspection worthwhile in areas like the Santa Cruz Mountains and Ben Lomond.",
		homeownerTip:
			"During inspection, confirm the D-box is level and that each outlet carries similar flow.",
		relatedServiceSlugs: [
			"septic-tank-distribution-box-repair-and-replacement",
			"septic-tank-inspection-and-assessment",
			"drainfield-repair-and-replacement",
		],
		relatedTermSlugs: [
			"drain-field",
			"pressure-distribution",
			"dosing-system",
			"conventional-septic-system",
		],
	},
	{
		slug: "dosing-system",
		term: "Dosing System",
		alsoKnownAs: ["Timed dose", "Demand dose"],
		shortDefinition:
			"A pump or siphon that sends effluent to the drain field in controlled batches rather than a continuous trickle, giving soil time to recover.",
		definition:
			"Dosing systems move a set volume of effluent to the field on a timer or after the tank reaches a level. Rest periods between doses let the soil drain and recover, which helps on slow or shallow soils.\n\nThey include a pump chamber, controls, and often an alarm. Proper dose volume and rest time are set during design and should not be changed without engineering review.",
		localContext:
			"Environmental Health may require dosing on Santa Cruz County mounds and pressure systems where continuous flow would overload clay soils or tight coastal lots.",
		homeownerTip:
			"Do not adjust dose timers yourself; incorrect dosing can flood one section of the field.",
		relatedServiceSlugs: [
			"engineered-septic-system-installation",
			"septic-tank-troubleshooting-and-diagnostic-services",
			"septic-tank-repair-and-replacement",
		],
		relatedTermSlugs: [
			"pump-chamber",
			"pressure-distribution",
			"mound-system",
			"alarm-float-switch",
		],
	},
	{
		slug: "drain-field",
		term: "Drain Field",
		alsoKnownAs: ["Leach field", "Soil absorption field"],
		shortDefinition:
			"The underground soil absorption area where clarified septic effluent is released for final biological treatment and safe dispersal below the surface.",
		definition:
			"A drain field is a network of perforated pipes, chambers, or other dispersal media in approved soil. Effluent seeps through the biomat and unsaturated soil, where bacteria remove remaining contaminants.\n\nFields fail when soil becomes saturated, biomat clogs, roots invade lines, or hydraulic overload occurs. Symptoms include wet spots, odors, slow drains, and sewage backing up in the home.",
		localContext:
			"Santa Cruz County drain fields must meet separation from groundwater and bedrock, which is challenging on coastal terraces, fill soils, and steep mountain parcels.",
		homeownerTip:
			"Keep vehicles, patios, and irrigation off the drain field area shown on your septic diagram.",
		relatedServiceSlugs: [
			"drainfield-repair-and-replacement",
			"septic-tank-leach-field-repair-and-replacement",
			"septic-tank-inspection-and-assessment",
		],
		relatedTermSlugs: [
			"leach-field",
			"biomat",
			"soil-absorption-field",
			"hydraulic-overload",
		],
	},
	{
		slug: "effluent",
		term: "Effluent",
		alsoKnownAs: ["Septic effluent", "Tank effluent"],
		shortDefinition:
			"The clarified liquid layer that leaves the septic tank after solids settle, flowing onward to the drain field, pump chamber, or treatment unit.",
		definition:
			"Effluent is the clarified wastewater between the scum layer and sludge in the tank. It still contains dissolved organics, nutrients, and pathogens, so it must be further treated in soil or an advanced unit.\n\nCloudy or greasy effluent signals tank problems, missing baffles, or a full tank. Clean effluent protects downstream filters, pumps, and the drain field.",
		localContext:
			"In Santa Cruz County watersheds that drain to the Monterey Bay National Marine Sanctuary, cleaner effluent from maintained systems helps protect creeks and nearshore water quality.",
		homeownerTip:
			"If effluent looks thick or carries solids during pumping, ask about baffles and filters before problems reach the field.",
		relatedServiceSlugs: [
			"septic-tank-cleaning-and-pumping",
			"septic-filter-cleaning-and-replacement",
			"septic-tank-inspection-and-assessment",
		],
		relatedTermSlugs: [
			"septic-tank",
			"effluent-filter",
			"scum-layer",
			"sludge-layer",
		],
	},
	{
		slug: "effluent-filter",
		term: "Effluent Filter",
		alsoKnownAs: ["Outlet filter", "Tank filter"],
		shortDefinition:
			"A removable screen at the septic tank outlet that blocks suspended solids from entering the drain field, pump chamber, or advanced treatment unit.",
		definition:
			"An effluent filter fits in the outlet tee or chamber to trap particles that escape the tank. Filters reduce biomat clogging and extend drain field life when cleaned on schedule.\n\nNeglected filters clog and can back up the tank or restrict flow to the field. Many counties encourage or require filters on new installations and repairs.",
		localContext:
			"Santa Cruz County often specifies effluent filters on new tanks and upgrades, especially where drain fields are downslope or near sensitive drainage courses.",
		homeownerTip:
			"Have the outlet filter cleaned whenever you pump the tank, or more often if you use a garbage disposal.",
		relatedServiceSlugs: [
			"septic-filter-cleaning-and-replacement",
			"septic-tank-cleaning-and-pumping",
			"septic-tank-maintenance-and-care",
		],
		relatedTermSlugs: ["baffle", "effluent", "biomat", "pump-chamber"],
	},
	{
		slug: "engineered-septic-system",
		term: "Engineered Septic System",
		alsoKnownAs: ["Designed onsite system"],
		shortDefinition:
			"A site-specific septic design stamped by a qualified engineer when standard prescriptive tank and trench layouts are not allowed on the property.",
		definition:
			"Engineered systems include detailed plans for tank sizing, treatment units, pump stations, and dispersal areas based on soil tests and topography. A licensed engineer stamps drawings that Environmental Health reviews before permit issuance.\n\nThese systems are built when lot size, slope, soil, or environmental sensitivity exceeds what a conventional layout can handle.",
		localContext:
			"Steep Santa Cruz County parcels in Felton, Boulder Creek, and the North Coast frequently require engineered designs with mounds, ATUs, or restricted drain fields to satisfy county and regional board requirements.",
		homeownerTip:
			"Keep stamped plans, as-built records, and maintenance logs in one folder for future inspections and property transfers.",
		relatedServiceSlugs: [
			"engineered-septic-system-installation",
			"septic-tank-design-and-engineering",
			"septic-tank-system-compliance-and-permitting",
		],
		relatedTermSlugs: [
			"alternative-septic-system",
			"mound-system",
			"advanced-treatment-unit",
			"environmental-health-permit",
		],
	},
	{
		slug: "environmental-health-permit",
		term: "Environmental Health Permit",
		alsoKnownAs: ["Septic permit", "OWTS permit"],
		shortDefinition:
			"County Environmental Health authorization required to install, repair, or operate an onsite wastewater treatment system under local and state codes.",
		definition:
			"Before construction or major repair, the property owner submits plans, soil data, and fees to county Environmental Health. Inspectors verify site conditions, approve the design, and sign off at key construction stages.\n\nOperating without a permit can block sales, trigger fines, and require costly retrofits. Permits also document tank location, field layout, and system type for future owners.",
		localContext:
			"Santa Cruz County Environmental Health Services reviews septic permits for unincorporated areas and works with city jurisdictions where rules overlap. Coastal development and remodels often trigger permit review even when the tank is not moved.",
		homeownerTip:
			"Start the permit process early on additions or ADUs, because soil testing and review can add weeks to the timeline.",
		relatedServiceSlugs: [
			"septic-tank-system-compliance-and-permitting",
			"septic-tank-design-and-engineering",
			"septic-system-installation",
		],
		relatedTermSlugs: [
			"septic-permit",
			"percolation-test",
			"septic-certification",
			"setback-requirements",
		],
	},
	{
		slug: "graywater-separation",
		term: "Graywater Separation",
		alsoKnownAs: ["Gray water routing"],
		shortDefinition:
			"Plumbing practice that routes lighter household wash water separately from toilet waste so each stream follows the appropriate treatment and permit path.",
		definition:
			"Graywater comes from sinks, showers, and laundry, while blackwater includes toilet flow. Some systems route graywater to separate disposal or irrigation with its own permit, while blackwater stays in the septic tank.\n\nMixing or misrouting flows can overload a tank sized only for partial waste streams. Any separation system must follow state and county rules for filtration, setbacks, and labeling.",
		localContext:
			"Santa Cruz County homeowners exploring laundry-to-landscape or graywater irrigation must coordinate with Environmental Health so separated lines do not bypass required treatment near creeks or coastal zones.",
		homeownerTip:
			"Label indoor and outdoor pipes clearly if graywater is diverted, so future repairs do not cross-connect lines by mistake.",
		relatedServiceSlugs: [
			"septic-tank-design-and-engineering",
			"septic-tank-system-compliance-and-permitting",
			"septic-system-installation",
		],
		relatedTermSlugs: [
			"septic-tank",
			"conventional-septic-system",
			"environmental-health-permit",
			"hydraulic-overload",
		],
	},
	{
		slug: "grease-interceptor",
		term: "Grease Interceptor",
		alsoKnownAs: ["Grease trap", "GRU"],
		shortDefinition:
			"A tank or basin that captures fats, oils, and grease from kitchen drains before they enter a septic tank, protecting tanks and drain fields from clogging.",
		definition:
			"Grease interceptors slow wastewater so floating grease and food solids collect for removal. In septic applications they protect the tank and drain field from clogging and anaerobic upset caused by heavy kitchen waste.\n\nCommercial kitchens and some residential setups require interceptors sized for peak flow. Regular pumping of grease waste is required to keep the interceptor and downstream septic components working.",
		localContext:
			"Santa Cruz County restaurants, vacation rentals, and home-based food businesses near the coast often need grease interceptors tied into septic or sewer service to meet Environmental Health standards.",
		homeownerTip:
			"Scrape dishes before washing and never pour cooking oil down the drain, even if you have an interceptor.",
		relatedServiceSlugs: [
			"commercial-septic-services",
			"septic-tank-cleaning-and-pumping",
			"septic-tank-maintenance-and-care",
		],
		relatedTermSlugs: [
			"septic-tank",
			"hydraulic-overload",
			"effluent-filter",
			"biomat",
		],
	},
	{
		slug: "hydraulic-overload",
		term: "Hydraulic Overload",
		alsoKnownAs: ["Water overload", "Excess hydraulic load"],
		shortDefinition:
			"A condition where more wastewater enters the septic system than the tank and drain field can temporarily store, treat, and absorb into the soil.",
		definition:
			"Hydraulic overload happens from excessive water use, leaky fixtures, roof drains tied to the septic, or undersized components. The tank cannot settle solids properly and the field stays saturated.\n\nSigns include gurgling drains, surfacing effluent, and frequent pump alarms. Fixing leaks and spreading out laundry and bathing often helps until the soil can recover.",
		localContext:
			"Santa Cruz County vacation homes and large family gatherings can temporarily overload systems sized for average daily flow, especially during rainy seasons when soils are already wet.",
		homeownerTip:
			"Fix running toilets and stagger high-water-use tasks to give the drain field time to drain between loads.",
		relatedServiceSlugs: [
			"septic-tank-troubleshooting-and-diagnostic-services",
			"septic-tank-inspection-and-assessment",
			"drainfield-repair-and-replacement",
		],
		relatedTermSlugs: [
			"drain-field",
			"biomat",
			"alarm-float-switch",
			"soil-loading-rate",
		],
	},
	{
		slug: "leach-field",
		term: "Leach Field",
		alsoKnownAs: ["Drain field", "Absorption field"],
		shortDefinition:
			"A soil absorption network of perforated pipes or chambers that receives septic effluent for final treatment, serving the same role as a drain field.",
		definition:
			"A leach field disperses effluent over a wide area so soil microbes treat remaining waste. Trenches are backfilled with gravel or chambers and must stay within approved depth and setback limits.\n\nRoots, compaction, and biomat clogging shorten field life. Locating the field on the site plan helps you avoid planting deep-rooted trees or building over it.",
		localContext:
			"Many Santa Cruz County site plans label leach fields along gentle slopes above seasonal creeks, where setback rules determine trench length and layout.",
		homeownerTip:
			"Plant only shallow-root grass or ground cover over the leach field to prevent root intrusion into pipes.",
		relatedServiceSlugs: [
			"septic-tank-leach-field-repair-and-replacement",
			"drainfield-repair-and-replacement",
			"septic-tank-inspection-and-assessment",
		],
		relatedTermSlugs: [
			"drain-field",
			"trench-drain-field",
			"chamber-system",
			"biomat",
		],
	},
	{
		slug: "lift-station",
		term: "Lift Station",
		alsoKnownAs: ["Septic pump station"],
		shortDefinition:
			"A packaged pump assembly that moves wastewater uphill through a force main when gravity flow to the septic tank or drain field is not possible.",
		definition:
			"A lift station collects sewage in a wet well and pumps it to a higher point in the system. Residential septic lift stations serve basement plumbing, downslope tanks, or long force mains to a mound or treatment unit.\n\nThey depend on floats, pumps, and alarms. Power loss or pump failure can cause backups within hours if water use continues.",
		localContext:
			"Santa Cruz County homes built into hillsides above their drain fields often rely on lift stations along Highway 9 corridors and in the Santa Cruz Mountains.",
		homeownerTip:
			"Know where your lift station panel is and test the alarm monthly if your manual recommends it.",
		relatedServiceSlugs: [
			"septic-tank-repair-and-replacement",
			"septic-tank-alarm-installation",
			"septic-tank-troubleshooting-and-diagnostic-services",
		],
		relatedTermSlugs: [
			"pump-chamber",
			"alarm-float-switch",
			"septic-alarm-system",
			"dosing-system",
		],
	},
	{
		slug: "mound-system",
		term: "Mound System",
		alsoKnownAs: ["Elevated sand mound", "Above-grade drain field"],
		shortDefinition:
			"An engineered bed of sand and fill built above natural grade to treat and disperse effluent when shallow soils or high groundwater prevent buried trenches.",
		definition:
			"A mound system pumps effluent to a constructed sand fill above a prepared base. Treatment occurs as effluent moves through sand and native soil before reaching groundwater.\n\nMounds need pressure dosing, careful shaping, and vegetative cover. They cost more than conventional fields but allow building on sites with limiting conditions.",
		localContext:
			"Santa Cruz County low-lying areas near Watsonville sloughs and coastal terraces with high groundwater often use mounds when standard trenches cannot meet vertical separation.",
		homeownerTip:
			"Keep the mound surface grassed and free of erosion so sand media stays evenly covered.",
		relatedServiceSlugs: [
			"engineered-septic-system-installation",
			"septic-tank-design-and-engineering",
			"drainfield-repair-and-replacement",
		],
		relatedTermSlugs: [
			"dosing-system",
			"pressure-distribution",
			"engineered-septic-system",
			"sand-filter-system",
		],
	},
	{
		slug: "nitrogen-reduction-system",
		term: "Nitrogen Reduction System",
		alsoKnownAs: ["Denitrification unit", "TN reduction system"],
		shortDefinition:
			"Advanced onsite treatment designed to lower nitrogen compounds in septic effluent to protect groundwater, creeks, and sensitive coastal receiving waters.",
		definition:
			"Nitrogen reduction systems use specialized media, recirculation, or biological processes to convert nitrate and ammonia into nitrogen gas. They address nutrient pollution where standard septic tanks leave nitrogen in effluent.\n\nThese units require monitoring, periodic media replacement, and compliance with local nutrient management rules. They are often paired with other treatment or dispersal components.",
		localContext:
			"Santa Cruz County and regional water quality plans focus on nitrogen near the coast and lagoons, so new systems in sensitive areas may require nitrogen-reducing technology verified by Environmental Health.",
		homeownerTip:
			"Budget for scheduled media service on nitrogen units; skipping maintenance can fail compliance tests.",
		relatedServiceSlugs: [
			"engineered-septic-system-installation",
			"septic-tank-system-compliance-and-permitting",
			"septic-tank-maintenance-and-care",
		],
		relatedTermSlugs: [
			"advanced-treatment-unit",
			"aerobic-treatment-unit",
			"effluent",
			"alternative-septic-system",
		],
	},
	{
		slug: "percolation-test",
		term: "Percolation Test",
		alsoKnownAs: ["Perc test", "Soil percolation rate test"],
		shortDefinition:
			"A standardized field test that measures how quickly water moves through undisturbed native soil, used to size and approve a septic drain field.",
		definition:
			"During a percolation test, an inspector soaks and measures water drop in test holes at the proposed field depth. The resulting rate helps determine trench length, system type, and whether an engineered design is needed.\n\nResults vary with season, moisture, and hole preparation. County rules define minimum tests, depths, and who may perform the work.",
		localContext:
			"Santa Cruz County percolation rates differ sharply between sandy beach terraces and tight clay in the mountains, often determining whether a conventional field or mound is feasible on a lot.",
		homeownerTip:
			"Schedule soil testing before finalizing building plans, because a failed perc can change where structures and fields may go.",
		relatedServiceSlugs: [
			"septic-tank-design-and-engineering",
			"septic-tank-system-compliance-and-permitting",
			"septic-system-installation",
		],
		relatedTermSlugs: [
			"soil-loading-rate",
			"environmental-health-permit",
			"drain-field",
			"engineered-septic-system",
		],
	},
	{
		slug: "pressure-distribution",
		term: "Pressure Distribution",
		alsoKnownAs: ["Pressure dosed field", "Low-pressure pipe"],
		shortDefinition:
			"A dispersal method that uses a pump to push effluent through small orifices in drain field pipes so each section of the field receives similar doses.",
		definition:
			"Pressure distribution sends effluent through a manifold and small-orifice pipes so each part of the field receives similar doses. It improves treatment on irregular sites and is common with mounds and ATU dispersal areas.\n\nThe system includes a pump chamber, supply lines, and often a return line or valve assembly. Clogged orifices or failed pumps cause uneven wetting and field stress.",
		localContext:
			"Engineered Santa Cruz County systems on narrow lots along Empire Grade and other ridgelines often use pressure distribution to fit treatment within tight footprints.",
		homeownerTip:
			"Report sputtering fixtures or uneven wet spots on the field promptly; they can signal pressure line problems.",
		relatedServiceSlugs: [
			"engineered-septic-system-installation",
			"septic-tank-troubleshooting-and-diagnostic-services",
			"drainfield-repair-and-replacement",
		],
		relatedTermSlugs: [
			"dosing-system",
			"pump-chamber",
			"mound-system",
			"distribution-box",
		],
	},
	{
		slug: "pump-chamber",
		term: "Pump Chamber",
		alsoKnownAs: ["Pump tank", "Dose tank"],
		shortDefinition:
			"A tank compartment or separate vault that temporarily stores effluent before a pump sends it to a mound, sand filter, or pressurized drain field network.",
		definition:
			"The pump chamber holds effluent until a float or control calls for a dose. Submersible or effluent pumps move waste uphill or through pressurized distribution networks.\n\nChambers include access risers, floats, and alarms. Solids entering the chamber from a missing filter can damage pumps and clog discharge lines.",
		localContext:
			"Upslope homes in the San Lorenzo Valley frequently use pump chambers because tanks sit below bedrooms while drain fields lie farther down the property.",
		homeownerTip:
			"Keep the pump chamber accessible and never flush wipes or grease that can bind floats and burn out pumps.",
		relatedServiceSlugs: [
			"septic-tank-repair-and-replacement",
			"septic-tank-alarm-installation",
			"septic-tank-troubleshooting-and-diagnostic-services",
		],
		relatedTermSlugs: [
			"lift-station",
			"dosing-system",
			"alarm-float-switch",
			"effluent-filter",
		],
	},
	{
		slug: "riser",
		term: "Riser",
		alsoKnownAs: ["Tank riser", "Access riser"],
		shortDefinition:
			"A watertight vertical extension that brings one or more septic tank access lids up to or near the ground surface for safer inspection and pumping.",
		definition:
			"Risers are watertight extensions sealed to tank openings with gaskets and screws. They reduce the need to dig up lids for every service visit and help inspectors verify liquid levels and baffles.\n\nProper risers include secure, child-safe covers rated for traffic where needed. Poor seals allow surface water into the tank, which adds hydraulic load.",
		localContext:
			"Santa Cruz County pumpers recommend risers on many mountain properties where deep burial and rocky soil make locating lids difficult without excavation.",
		homeownerTip:
			"Mark riser locations on your site sketch so service crews can pump without guessing in the yard.",
		relatedServiceSlugs: [
			"septic-tank-riser-installation",
			"septic-tank-cleaning-and-pumping",
			"septic-tank-inspection-and-assessment",
		],
		relatedTermSlugs: [
			"septic-tank",
			"septic-inspection",
			"baffle",
			"effluent-filter",
		],
	},
	{
		slug: "sand-filter-system",
		term: "Sand Filter System",
		alsoKnownAs: ["Intermittent sand filter", "Recirculating sand filter"],
		shortDefinition:
			"An engineered bed of graded sand that biologically filters septic effluent before final soil dispersal when native soil alone cannot meet treatment goals.",
		definition:
			"Sand filter systems pump effluent across a bed of graded sand where biological treatment occurs. Some designs recirculate effluent through the filter to improve quality before it reaches a drain field or approved discharge point.\n\nFilters need periodic resting, monitoring, and media maintenance. They suit difficult sites but require more operator attention than gravity fields.",
		localContext:
			"Santa Cruz County designers specify sand filters where shallow bedrock or poor percolation near the coast leaves few options besides full advanced treatment packages.",
		homeownerTip:
			"Follow the rest-and-dose schedule on your sand filter panel; running pumps continuously can wash out treatment zones.",
		relatedServiceSlugs: [
			"engineered-septic-system-installation",
			"septic-tank-maintenance-and-care",
			"septic-tank-troubleshooting-and-diagnostic-services",
		],
		relatedTermSlugs: [
			"mound-system",
			"advanced-treatment-unit",
			"dosing-system",
			"effluent",
		],
	},
	{
		slug: "scum-layer",
		term: "Scum Layer",
		alsoKnownAs: ["Floating scum", "Top layer"],
		shortDefinition:
			"The floating layer of fats, oils, soap, and lightweight debris at the top of a septic tank that must stay below the outlet baffle during normal operation.",
		definition:
			"The scum layer forms from grease, soap, and buoyant debris in household wastewater. Inlet baffles keep turbulence from breaking up scum, while outlet baffles and filters block it from leaving the tank.\n\nA thick scum layer reduces working volume and can push solids toward the outlet. Regular pumping removes scum before it causes carryover.",
		localContext:
			"Homes in Santa Cruz County with heavy kitchen use or vacation rental turnover often build scum faster, shortening the interval between pumpings.",
		homeownerTip:
			"Wipe grease from pans and avoid garbage disposals if your pumper notes thick scum at each visit.",
		relatedServiceSlugs: [
			"septic-tank-cleaning-and-pumping",
			"septic-tank-maintenance-and-care",
			"septic-tank-inspection-and-assessment",
		],
		relatedTermSlugs: [
			"sludge-layer",
			"effluent",
			"baffle",
			"grease-interceptor",
		],
	},
	{
		slug: "septic-abandonment",
		term: "Septic Abandonment",
		alsoKnownAs: ["Tank abandonment", "Decommissioning"],
		shortDefinition:
			"The permitted process of pumping, cleaning, decommissioning, and documenting closure of an old septic tank or cesspool that will no longer be used.",
		definition:
			"Abandonment follows county steps: pump remaining waste, remove or crush the tank if required, fill with clean material, and document completion for Environmental Health. Connecting to sewer or installing a new system often triggers abandonment of the old tank.\n\nSkipping formal abandonment leaves hidden liabilities on title and can cause collapse or contamination if the tank is forgotten during later excavation.",
		localContext:
			"Santa Cruz County requires abandonment records when properties sewer-connect in Live Oak, Capitola, or other expanding service areas, or when failing cesspools are removed in rural zones.",
		homeownerTip:
			"Request a copy of the abandonment certificate and keep it with your property disclosure packet.",
		relatedServiceSlugs: [
			"septic-system-abandonment",
			"septic-tank-system-compliance-and-permitting",
			"septic-tank-cleaning-and-pumping",
		],
		relatedTermSlugs: [
			"cesspool",
			"septic-certification",
			"environmental-health-permit",
			"septic-tank",
		],
	},
	{
		slug: "septic-alarm-system",
		term: "Septic Alarm System",
		alsoKnownAs: ["Pump alarm", "High-water alarm"],
		shortDefinition:
			"Audible, visual, or wireless warning devices that alert you when a pump tank, aerobic unit, or other treatment component needs immediate service.",
		definition:
			"Septic alarms include indoor panels, outdoor sirens, or wireless alerts tied to float switches and control boxes. They signal high water, air loss, or control faults before sewage backs up into the house.\n\nAlarms should stay silenced only after the cause is fixed. Resetting without service can mask a failing pump or saturated field.",
		localContext:
			"Santa Cruz County engineered installations along the coast often require audible and visual alarms because seasonal groundwater limits drain field recovery time.",
		homeownerTip:
			"Teach everyone in the household what the septic alarm light means and post the service number nearby.",
		relatedServiceSlugs: [
			"septic-tank-alarm-installation",
			"septic-tank-troubleshooting-and-diagnostic-services",
			"septic-tank-repair-and-replacement",
		],
		relatedTermSlugs: [
			"alarm-float-switch",
			"pump-chamber",
			"lift-station",
			"hydraulic-overload",
		],
	},
	{
		slug: "septic-certification",
		term: "Septic Certification",
		alsoKnownAs: ["System certification", "Compliance certification"],
		shortDefinition:
			"Documented county or inspector verification that an onsite system meets local requirements, often required for real estate sales, remodels, or ADU approvals.",
		definition:
			"Certification usually involves locating components, checking for obvious failure, verifying permit records, and sometimes dye testing or tank evaluation. Environmental Health or a qualified inspector issues the report the county accepts.\n\nFailed certification can delay escrow until repairs, upgrades, or permits are completed. Buyers use it to understand system type, age, and remaining capacity.",
		localContext:
			"Santa Cruz County real estate transactions and ADU permits frequently request septic certification, especially when records are missing on older mountain or coastal homes.",
		homeownerTip:
			"Order certification early in a sale so there is time to fix riser access or minor violations before closing.",
		relatedServiceSlugs: [
			"septic-system-certification",
			"septic-tank-inspection-and-assessment",
			"septic-tank-system-compliance-and-permitting",
		],
		relatedTermSlugs: [
			"septic-inspection",
			"environmental-health-permit",
			"septic-abandonment",
			"watertightness-test",
		],
	},
	{
		slug: "septic-inspection",
		term: "Septic Inspection",
		alsoKnownAs: ["OWTS inspection", "Tank and field evaluation"],
		shortDefinition:
			"A structured evaluation of the tank, piping, pumps, and dispersal area to identify failures, maintenance needs, or compliance issues before backups occur.",
		definition:
			"Inspections may include opening lids, measuring sludge and scum, testing alarms and pumps, walking the drain field, and reviewing maintenance history. Dye tests can show if effluent surfaces or enters structures.\n\nRoutine inspection complements pumping; it is not a substitute for cleaning a full tank. Many problems are cheaper to fix when caught early.",
		localContext:
			"Santa Cruz County homeowners on steep or wooded lots benefit from periodic inspections because small leaks or root intrusion can go unnoticed until winter rains saturate the field.",
		homeownerTip:
			"Schedule an inspection if drains slow across multiple fixtures at once, not just one sink.",
		relatedServiceSlugs: [
			"septic-tank-inspection-and-assessment",
			"septic-system-certification",
			"septic-tank-troubleshooting-and-diagnostic-services",
		],
		relatedTermSlugs: [
			"septic-certification",
			"riser",
			"effluent-filter",
			"drain-field",
		],
	},
	{
		slug: "septic-permit",
		term: "Septic Permit",
		alsoKnownAs: ["Construction permit", "OWTS approval"],
		shortDefinition:
			"Official county approval to install, alter, expand, or repair a septic system after plans, soil data, and site conditions pass Environmental Health review.",
		definition:
			"A septic permit ties approved drawings to a specific parcel. Work must match the permitted layout, tank size, and setback distances. Inspections occur before backfill and at final sign-off.\n\nUnpermitted tanks or fields can complicate insurance claims, remodels, and resale. Permits also establish legal system capacity for bedrooms and fixtures.",
		localContext:
			"Santa Cruz County permit files are held by Environmental Health; older paper records on rural parcels sometimes require field verification to match what was built.",
		homeownerTip:
			"Before adding bedrooms or plumbing fixtures, confirm your permitted system capacity with the county or a designer.",
		relatedServiceSlugs: [
			"septic-tank-system-compliance-and-permitting",
			"septic-tank-design-and-engineering",
			"septic-system-installation",
		],
		relatedTermSlugs: [
			"environmental-health-permit",
			"percolation-test",
			"setback-requirements",
			"engineered-septic-system",
		],
	},
	{
		slug: "septic-system-upgrade",
		term: "Septic System Upgrade",
		alsoKnownAs: ["System replacement", "OWTS upgrade"],
		shortDefinition:
			"Replacing or improving an onsite wastewater system to meet current codes, correct failure, eliminate a cesspool, or support added bedrooms and fixtures.",
		definition:
			"Upgrades range from new tanks and risers to full engineered fields, ATUs, or sewer connection. Triggers include failed inspections, remodels, cesspool elimination, or nutrient rules in sensitive areas.\n\nUpgrades require permits, soil evaluation, and often staged construction so the home stays sanitary during the project.",
		localContext:
			"Santa Cruz County upgrade projects are common when aging fields fail during wet winters or when owners add ADUs in Aptos, Soquel, or the mountains without enough reserve drain field area.",
		homeownerTip:
			"Combine upgrade planning with soil tests and house plumbing changes so you only disturb the yard once.",
		relatedServiceSlugs: [
			"septic-tank-system-upgrades",
			"engineered-septic-system-installation",
			"septic-tank-design-and-engineering",
		],
		relatedTermSlugs: [
			"engineered-septic-system",
			"septic-certification",
			"drain-field",
			"alternative-septic-system",
		],
	},
	{
		slug: "septic-tank",
		term: "Septic Tank",
		alsoKnownAs: ["Primary tank", "Settlement tank"],
		shortDefinition:
			"The buried primary tank that separates solids from household wastewater before clarified effluent flows to the drain field or an advanced treatment unit.",
		definition:
			"A septic tank provides primary treatment through settling and flotation. Heavy sludge collects on the bottom, scum floats on top, and effluent exits through an outlet baffle or filter.\n\nTanks are sized by bedroom count and code requirements. Concrete, fiberglass, and plastic tanks all need watertight integrity and regular pumping to prevent solids from leaving the tank.",
		localContext:
			"Santa Cruz County tank installations must respect depth to groundwater and bedrock, which varies from deep sand near the beach to shallow rock on high ridges.",
		homeownerTip:
			"Know your tank location and last pump date; most households need pumping every 3 to 5 years.",
		relatedServiceSlugs: [
			"septic-tank-cleaning-and-pumping",
			"septic-tank-repair-and-replacement",
			"septic-tank-inspection-and-assessment",
		],
		relatedTermSlugs: [
			"effluent",
			"baffle",
			"riser",
			"conventional-septic-system",
		],
	},
	{
		slug: "setback-requirements",
		term: "Setback Requirements",
		alsoKnownAs: ["Separation distances", "OWTS setbacks"],
		shortDefinition:
			"Minimum separation distances between septic tanks, pipes, mounds, and drain fields and wells, buildings, property lines, and waterways required by code.",
		definition:
			"Setbacks keep untreated or partially treated wastewater away from drinking water, buildings, and surface water. They apply to tanks, pipes, mounds, and repair areas measured from edges and invert elevations.\n\nReducing setbacks usually requires engineered justification or impossible on tight lots, which pushes designs toward smaller footprints or alternative treatment.",
		localContext:
			"Santa Cruz County setbacks to creeks and the ocean are especially strict, shaping where fields can go on narrow coastal parcels and canyon homes.",
		homeownerTip:
			"Before planting trees or building sheds, compare your plan to the septic diagram setbacks so you do not encroach on the field.",
		relatedServiceSlugs: [
			"septic-tank-design-and-engineering",
			"septic-tank-system-compliance-and-permitting",
			"septic-system-installation",
		],
		relatedTermSlugs: [
			"environmental-health-permit",
			"percolation-test",
			"drain-field",
			"septic-permit",
		],
	},
	{
		slug: "sludge-layer",
		term: "Sludge Layer",
		alsoKnownAs: ["Bottom sludge", "Settled solids"],
		shortDefinition:
			"The dense layer of settled solids that accumulates on the bottom of a septic tank and must be removed by professional pumping on a regular schedule.",
		definition:
			"Sludge forms from toilet paper, organic matter, and debris that sinks in the tank. As sludge rises, effective volume shrinks and solids can escape toward the outlet.\n\nPumpers measure sludge depth during service. Waiting too long increases the risk of carryover, clogged filters, and drain field failure.",
		localContext:
			"Large households and short-term rentals in Santa Cruz County often accumulate sludge faster than the 3 to 5 year average pumping interval.",
		homeownerTip:
			"Do not rely on additives to dissolve sludge; pumping is the only reliable removal method.",
		relatedServiceSlugs: [
			"septic-tank-cleaning-and-pumping",
			"septic-tank-maintenance-and-care",
			"septic-tank-inspection-and-assessment",
		],
		relatedTermSlugs: [
			"scum-layer",
			"effluent",
			"septic-tank",
			"effluent-filter",
		],
	},
	{
		slug: "soil-absorption-field",
		term: "Soil Absorption Field",
		alsoKnownAs: ["Dispersal field", "Subsurface absorption area"],
		shortDefinition:
			"The approved subsurface soil zone where treated septic effluent is released and remaining pathogens are removed before wastewater reaches groundwater.",
		definition:
			"A soil absorption field is the final treatment step in most septic systems. Effluent moves through unsaturated soil, where microbes break down remaining waste and filter bacteria.\n\nField size depends on daily flow, soil loading rate, and percolation test results. Compaction, paving, or deep roots in this zone reduce treatment capacity.",
		localContext:
			"Santa Cruz County absorption fields must stay above seasonal groundwater, which can rise dramatically in low areas near the Pajaro Valley and coastal flats.",
		homeownerTip:
			"Redirect roof runoff away from the absorption area so storm water does not saturate treatment soil.",
		relatedServiceSlugs: [
			"drainfield-repair-and-replacement",
			"septic-tank-leach-field-repair-and-replacement",
			"septic-tank-inspection-and-assessment",
		],
		relatedTermSlugs: [
			"drain-field",
			"leach-field",
			"biomat",
			"soil-loading-rate",
		],
	},
	{
		slug: "soil-loading-rate",
		term: "Soil Loading Rate",
		alsoKnownAs: ["Hydraulic loading rate", "Application rate"],
		shortDefinition:
			"The daily volume of effluent per square foot of drain field that soil can accept based on texture, percolation rate, and county sizing tables.",
		definition:
			"Designers use soil loading rates to calculate trench length and field area. Faster soils accept higher rates; clay and limiting layers require larger fields or alternative systems.\n\nExceeding the design loading rate through leaks or excess water use leads to surfacing and failure. Loading assumptions are tied to permitted bedroom and fixture counts.",
		localContext:
			"Santa Cruz County soil surveys show wide loading rate variation between marine terrace sands and mountain clays, directly affecting how large a field must be on your lot.",
		homeownerTip:
			"Match household water habits to your permitted design; adding guests or fixtures without review can exceed the rated load.",
		relatedServiceSlugs: [
			"septic-tank-design-and-engineering",
			"septic-tank-system-compliance-and-permitting",
			"septic-tank-inspection-and-assessment",
		],
		relatedTermSlugs: [
			"percolation-test",
			"hydraulic-overload",
			"soil-absorption-field",
			"engineered-septic-system",
		],
	},
	{
		slug: "trench-drain-field",
		term: "Trench Drain Field",
		alsoKnownAs: ["Gravity trench field", "Pipe and gravel field"],
		shortDefinition:
			"Classic gravity leach lines built in excavated trenches with perforated pipe and gravel or approved aggregate to disperse septic effluent into undisturbed soil.",
		definition:
			"Trench fields place perforated pipe on a bed of gravel within excavated trenches. Effluent seeps through pipe holes into gravel and then into soil for treatment.\n\nTrench count, length, and spacing come from soil tests and setback rules. Crushed or silted gravel, collapsed pipe, and biomat clogging are common failure modes on older systems.",
		localContext:
			"Many pre-1990 Santa Cruz County homes use gravity trench fields on moderate slopes where deep, permeable soil was available at installation.",
		homeownerTip:
			"Avoid cutting trenches for irrigation or utilities through the field without locating pipes on the as-built plan first.",
		relatedServiceSlugs: [
			"drainfield-repair-and-replacement",
			"septic-tank-leach-field-repair-and-replacement",
			"septic-system-installation",
		],
		relatedTermSlugs: [
			"chamber-system",
			"leach-field",
			"distribution-box",
			"conventional-septic-system",
		],
	},
	{
		slug: "two-compartment-tank",
		term: "Two-Compartment Tank",
		alsoKnownAs: ["Dual compartment septic tank"],
		shortDefinition:
			"A septic tank divided into two connected chambers so wastewater settles in stages, producing cleaner effluent before it reaches the outlet and drain field.",
		definition:
			"Wastewater enters the first compartment where most settling occurs. Effluent passes through a baffle opening into a second compartment for additional clarification before the outlet.\n\nTwo-compartment tanks are required or preferred in many modern codes because they produce cleaner effluent than single-chamber tanks of similar size.",
		localContext:
			"New Santa Cruz County installations and upgrades often specify two-compartment tanks to meet current state standards and protect sensitive drain fields.",
		homeownerTip:
			"During pumping, confirm both compartments are cleaned; leaving sludge in the first side shortens time until the next service.",
		relatedServiceSlugs: [
			"septic-system-installation",
			"septic-tank-repair-and-replacement",
			"septic-tank-cleaning-and-pumping",
		],
		relatedTermSlugs: [
			"septic-tank",
			"baffle",
			"effluent-filter",
			"conventional-septic-system",
		],
	},
	{
		slug: "watertightness-test",
		term: "Watertightness Test",
		alsoKnownAs: ["Tank water test", "Leak test"],
		shortDefinition:
			"A pre-backfill test that confirms a new or repaired septic tank holds water without leaks that would admit groundwater or release untreated effluent.",
		definition:
			"Inspectors fill or seal the tank and monitor liquid levels for a set time to verify watertight construction. Failed tests require repair of cracks, joints, or pipe penetrations before approval.\n\nWatertight tanks protect groundwater and maintain proper hydraulic retention time for settling. Leaking tanks add storm water load and dilute treatment.",
		localContext:
			"Santa Cruz County Environmental Health may require watertightness testing on new tank installs, especially in high groundwater areas near the coast and river bottoms.",
		homeownerTip:
			"If a new tank test fails, demand repairs and a retest before burying the tank.",
		relatedServiceSlugs: [
			"septic-system-installation",
			"septic-tank-repair-and-replacement",
			"septic-tank-system-compliance-and-permitting",
		],
		relatedTermSlugs: [
			"septic-tank",
			"septic-certification",
			"environmental-health-permit",
			"septic-inspection",
		],
	},
]
