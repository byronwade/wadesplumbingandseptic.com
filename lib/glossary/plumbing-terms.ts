import type { GlossaryTerm } from "@/lib/glossary/types"

export const plumbingTerms: GlossaryTerm[] = [
	{
		slug: "abs-pipe",
		term: "ABS Pipe",
		alsoKnownAs: ["Acrylonitrile Butadiene Styrene"],
		shortDefinition:
			"Black plastic drain pipe used in many older drain, waste, and vent systems. Common in Santa Cruz County homes built before widespread PVC adoption.",
		definition:
			"ABS pipe is a rigid thermoplastic used for drain, waste, and vent (DWV) lines. It is joined with solvent cement and handles household wastewater well when installed correctly.\n\nUnlike pressurized supply piping, ABS is rated for gravity drainage. Joints, supports, and transitions to other materials must follow code to prevent leaks and root intrusion.",
		localContext:
			"Santa Cruz County homes from the 1960s through 1980s often have ABS drain lines under slabs and in crawl spaces. Coastal humidity and hillside soil movement can stress joints over time, especially where pipes pass through foundations in Aptos, Capitola, and older Watsonville neighborhoods.",
		homeownerTip:
			"If you see cracked black pipe or recurring drain smells near a wall or slab, have a plumber inspect before a small leak becomes a major repair.",
		relatedServiceSlugs: [
			"pipe-repair-and-replacement",
			"sewer-line-inspection",
			"drain-line-inspection",
		],
		relatedTermSlugs: ["pvc-pipe", "dwv-system", "sewer-line", "cleanout"],
	},
	{
		slug: "anode-rod",
		term: "Anode Rod",
		alsoKnownAs: ["Sacrificial Anode"],
		shortDefinition:
			"A metal rod inside a tank water heater that corrodes first to protect the tank from rust. Replacing it extends heater life in hard coastal water.",
		definition:
			"An anode rod is a magnesium or aluminum rod suspended inside a storage water heater tank. It attracts corrosive elements in the water so the tank lining rusts more slowly.\n\nWhen the rod is consumed, the tank itself begins to corrode. Most manufacturers recommend inspection every few years and replacement when heavily pitted or less than half intact.",
		localContext:
			"Harder well water in the Santa Cruz Mountains and mineral-rich municipal supply along the coast shorten anode rod life. Many hillside homes in Scotts Valley and the San Lorenzo Valley rely on tank heaters in garages or closets where a failed rod shows up as rusty hot water.",
		homeownerTip:
			"Flush your tank annually and ask your plumber to check the anode rod during water heater maintenance.",
		relatedServiceSlugs: [
			"water-heater-installation",
			"water-softener-maintenance",
		],
		relatedTermSlugs: [
			"water-heater",
			"t-and-p-relief-valve",
			"water-softener",
			"hard-water",
		],
	},
	{
		slug: "backflow-preventer",
		term: "Backflow Preventer",
		alsoKnownAs: ["Backflow Device", "BFP"],
		shortDefinition:
			"A valve assembly that stops contaminated water from flowing backward into the clean drinking water supply during pressure drops or cross-connections.",
		definition:
			"A backflow preventer allows water to flow in one direction only. If downstream pressure exceeds supply pressure, the device closes to keep irrigation water, boiler fluid, or other non-potable sources out of your taps.\n\nResidential and commercial properties with irrigation systems, fire sprinklers, or boiler loops often require tested backflow assemblies under county and water district rules.",
		localContext:
			"Santa Cruz County water districts require annual backflow testing for many commercial kitchens, irrigation meters, and multi-unit properties from Santa Cruz to Live Oak. Coastal fog and hillside irrigation zones increase the number of protected connections on older duplexes and vacation rentals.",
		homeownerTip:
			"Never bypass or remove a backflow device to fix low pressure; call a certified tester instead.",
		relatedServiceSlugs: [
			"backflow-prevention-installation",
			"backflow-prevention-testing",
		],
		relatedTermSlugs: [
			"cross-connection",
			"potable-water",
			"prv",
			"check-valve",
		],
	},
	{
		slug: "ball-valve",
		term: "Ball Valve",
		shortDefinition:
			"A quarter-turn shutoff valve with a rotating ball inside. Reliable for main water shutoffs and fixture supply lines in homes and businesses.",
		definition:
			"A ball valve uses a perforated ball to start or stop flow with a 90-degree turn of the handle. Full-port models offer minimal restriction when open, making them popular on main lines and water heater connections.\n\nThey seal well when new and are easier to operate than older gate valves that may seize after years without use.",
		localContext:
			"Many Santa Cruz County homes still have original gate valves on copper mains. Plumbers often upgrade to ball valves during repipes in Felton, Ben Lomond, and mid-century ranch homes where a stuck shutoff delays emergency repairs.",
		homeownerTip:
			"Label your main ball valve and exercise it once a year so it turns freely in an emergency.",
		relatedServiceSlugs: [
			"water-line-repair-and-installation",
			"fixture-installation",
		],
		relatedTermSlugs: [
			"gate-valve",
			"fixture-shutoff-valve",
			"supply-line",
			"water-main",
		],
	},
	{
		slug: "blackwater",
		term: "Blackwater",
		alsoKnownAs: ["Sewage"],
		shortDefinition:
			"Wastewater from toilets and kitchen sinks that may contain pathogens and grease. It must stay separate from clean water and greywater systems.",
		definition:
			"Blackwater is heavily contaminated wastewater that carries human waste, food particles, and grease. It flows through sanitary sewer lines or a private septic system, never through greywater irrigation or storm drains.\n\nProper venting, traps, and cleanouts keep blackwater moving safely away from living spaces. Cross-connections between sewer and storm systems are a serious code violation.",
		localContext:
			"Older Santa Cruz properties near downtown and the Westside sometimes have aging clay sewer laterals that leak blackwater into soil during wet winters. Hillside homes with long sewer runs to the street are more vulnerable to root blockages that push sewage toward cleanouts.",
		homeownerTip:
			"Treat any toilet backup or sewer odor as blackwater: keep kids and pets away until a plumber clears the line.",
		relatedServiceSlugs: [
			"sewer-line-inspection",
			"drain-cleaning",
			"sewer-camera-inspection",
		],
		relatedTermSlugs: [
			"greywater",
			"main-sewer-line",
			"sewer-line",
			"cleanout",
		],
	},
	{
		slug: "check-valve",
		term: "Check Valve",
		shortDefinition:
			"A one-way valve that lets water flow forward but closes to prevent backflow. Used on sump pumps, recirculation loops, and some supply lines.",
		definition:
			"A check valve opens when forward pressure pushes the disc or flap aside, then closes if flow reverses. Sump pumps, well systems, and hot water recirculation lines depend on check valves to stop back-drainage.\n\nA failed check valve can let water return to a sump pit or allow hot water to cool in a loop, wasting energy and causing noise.",
		localContext:
			"Crawl spaces in Capitola and Pleasure Point flood during king tides and heavy storms. Sump pump check valves in low-lying lots prevent discharged water from flowing back into the pit when the pump stops.",
		homeownerTip:
			"If your sump pump runs constantly or you hear thumping in pipes, ask about check valve condition.",
		relatedServiceSlugs: [
			"sump-pump-installation",
			"backflow-prevention-installation",
		],
		relatedTermSlugs: [
			"backflow-preventer",
			"sump-pump",
			"recirculation-pump",
			"supply-line",
		],
	},
	{
		slug: "cleanout",
		term: "Cleanout",
		shortDefinition:
			"A capped access fitting on a drain or sewer line that lets plumbers snake, jet, or camera the pipe without cutting into walls, floors, or landscaping.",
		definition:
			"A cleanout is a threaded or glued fitting with a removable cap, usually placed where the building drain meets the sewer lateral or at changes of direction. It is the primary access point for clearing clogs and inspecting pipe condition.\n\nMissing or buried cleanouts make emergency drain work slower and more expensive. Code often requires cleanouts at the property line and at major bends in the system.",
		localContext:
			"Santa Cruz County hillside homes sometimes have cleanouts buried by landscaping or deck additions in the Santa Cruz Mountains. Coastal properties with raised foundations in Rio Del Mar benefit from exterior cleanouts that stay accessible during winter storms.",
		homeownerTip:
			"Know where your cleanout is and keep the cap area clear of plants and storage.",
		relatedServiceSlugs: [
			"main-line-cleanout-installation",
			"drain-cleaning",
			"sewer-camera-inspection",
		],
		relatedTermSlugs: [
			"main-sewer-line",
			"drain-snake",
			"hydro-jetting",
			"sewer-line",
		],
	},
	{
		slug: "copper-pipe",
		term: "Copper Pipe",
		alsoKnownAs: ["Copper Tubing"],
		shortDefinition:
			"Durable metal supply pipe common in California homes for decades. Handles hot and cold potable water when properly soldered, brazed, or press-fit.",
		definition:
			"Copper pipe comes in rigid Type L and Type M wall thicknesses for water supply, joined with solder, press fittings, or ProPress connectors. It resists UV and high temperature better than many plastics when exposed.\n\nPinhole leaks can develop in aggressive water or where pipes touch dissimilar metals. Repiping projects often replace aging copper with PEX while reusing copper where it remains sound.",
		localContext:
			"Mid-century homes from Seabright to Soquel frequently have copper supply lines in slabs and crawl spaces. Coastal salt air can accelerate corrosion on exterior hose bibs and pool lines in Aptos and La Selva Beach.",
		homeownerTip:
			"Watch for green staining on pipes or small damp spots on ceilings below bathrooms as early pinhole leak signs.",
		relatedServiceSlugs: [
			"pipe-repair-and-replacement",
			"water-line-repair-and-installation",
			"leak-detection",
		],
		relatedTermSlugs: ["pex-pipe", "supply-line", "potable-water", "prv"],
	},
	{
		slug: "cross-connection",
		term: "Cross-Connection",
		shortDefinition:
			"Any plumbing link where non-potable water could enter the drinking supply. Backflow preventers, air gaps, and vacuum breakers eliminate these hazards.",
		definition:
			"A cross-connection exists when a potable water line connects to a source that could contaminate it, such as a garden hose submerged in a pool or a boiler fill line without protection. Pressure drops can pull contaminated water backward into fixtures.\n\nPlumbers eliminate cross-connections with physical air gaps or approved backflow assemblies. Annual testing keeps commercial and irrigation systems compliant.",
		localContext:
			"Vacation rentals and hillside irrigation systems across Santa Cruz County are common cross-connection inspection points. Older Soquel and Live Oak properties with shared wells need careful separation between outdoor hoses and kitchen supply.",
		homeownerTip:
			"Never leave a hose running in a bucket or pool without a vacuum breaker on the hose bib.",
		relatedServiceSlugs: [
			"backflow-prevention-installation",
			"backflow-prevention-testing",
		],
		relatedTermSlugs: [
			"backflow-preventer",
			"potable-water",
			"hose-bib",
			"check-valve",
		],
	},
	{
		slug: "drain-snake",
		term: "Drain Snake",
		alsoKnownAs: ["Drain Auger", "Plumber's Snake"],
		shortDefinition:
			"A flexible cable spun into a drain to break up clogs from hair, grease, or roots. First-line tool before hydro jetting or camera inspection.",
		definition:
			"A drain snake, or auger, feeds a coiled cable through a trap or cleanout to pierce or retrieve blockages. Hand snakes clear nearby fixture clogs; motorized drum machines reach further into branch lines and main drains.\n\nSnaking clears an opening but may not remove grease buildup on pipe walls. Recurring clogs often mean a partial blockage, belly in the pipe, or root intrusion that needs video inspection.",
		localContext:
			"Older Santa Cruz homes with mature redwoods and oaks send roots into clay laterals in the San Lorenzo Valley. Kitchen clogs from grease are common in beach cottages with small diameter drains in Capitola Village.",
		homeownerTip:
			"Avoid chemical drain openers before snaking; they can harm pipes and make professional work less safe.",
		relatedServiceSlugs: ["drain-cleaning", "commercial-drain-cleaning"],
		relatedTermSlugs: [
			"hydro-jetting",
			"cleanout",
			"p-trap",
			"sewer-camera-inspection",
		],
	},
	{
		slug: "dwv-system",
		term: "DWV System",
		alsoKnownAs: ["Drain, Waste, and Vent"],
		shortDefinition:
			"The drain, waste, and vent piping that carries wastewater out of a building while balancing air pressure so traps stay sealed and fixtures drain well.",
		definition:
			"DWV stands for drain, waste, and vent. Drain lines move wastewater by gravity, waste lines carry toilet discharge, and vent pipes admit air so water flows smoothly and sewer gases escape through the roof.\n\nEvery fixture connects to a trap and joins a vented branch before reaching the building drain. Poor venting causes gurgling, slow drains, and siphoned traps that allow odors indoors.",
		localContext:
			"Santa Cruz County remodels in older bungalows often uncover undersized DWV in walls that cannot handle modern fixture loads. Hillside additions in the mountains must extend vent stacks through roofs exposed to wind and redwood debris.",
		homeownerTip:
			"Gurgling from multiple fixtures at once usually points to a vent or main drain issue, not a single clog.",
		relatedServiceSlugs: [
			"drain-line-inspection",
			"pipe-repair-and-replacement",
			"smoke-tests",
		],
		relatedTermSlugs: ["vent-stack", "plumbing-trap", "abs-pipe", "sewer-line"],
	},
	{
		slug: "expansion-tank",
		term: "Expansion Tank",
		shortDefinition:
			"A small tank on the water heater or supply line that absorbs pressure spikes as heated water expands. Required on many closed-loop residential systems.",
		definition:
			"When water heats, it expands. On a closed system with a check valve or pressure reducer, that expansion has nowhere to go without an expansion tank. The tank's internal bladder compresses air to cushion pressure rises.\n\nMissing or waterlogged expansion tanks cause relief valves to drip and can shorten water heater life. They are sized to match heater volume and supply pressure.",
		localContext:
			"Many Santa Cruz County water districts use pressure reducing stations, creating closed systems on hillside streets in Scotts Valley and the Westside. Water heater replacements in garages and interior closets should include expansion tank evaluation.",
		homeownerTip:
			"If your T and P valve drips only when the heater runs, ask about expansion tank condition before replacing the valve.",
		relatedServiceSlugs: [
			"water-heater-installation",
			"water-line-repair-and-installation",
		],
		relatedTermSlugs: [
			"water-heater",
			"t-and-p-relief-valve",
			"prv",
			"check-valve",
		],
	},
	{
		slug: "faucet-aerator",
		term: "Faucet Aerator",
		shortDefinition:
			"A screened fitting on a faucet spout that mixes air into the stream to reduce splash, save water, and keep steady pressure at kitchen and bath sinks.",
		definition:
			"A faucet aerator screws onto the tip of a spout and passes water through a fine mesh. The mesh breaks the flow into many small streams, mixing in air for a steady feel at lower gallon-per-minute rates.\n\nMineral buildup from hard water clogs aerators and reduces flow. Unscrewing and soaking the aerator in vinegar often restores performance without replacing the faucet.",
		localContext:
			"Coastal and mountain homes in Santa Cruz County with harder water see aerators clog faster, especially on well systems in Bonny Doon and the San Lorenzo Valley. Low-flow aerators help drought-conscious households meet local conservation habits.",
		homeownerTip:
			"Clean aerators every few months if your faucet spray feels uneven or weak on both hot and cold.",
		relatedServiceSlugs: ["fixture-installation", "toilet-repair"],
		relatedTermSlugs: [
			"water-softener",
			"potable-water",
			"fixture-shutoff-valve",
			"supply-line",
		],
	},
	{
		slug: "fixture-shutoff-valve",
		term: "Fixture Shutoff Valve",
		alsoKnownAs: ["Angle Stop", "Supply Stop"],
		shortDefinition:
			"The small valve under a sink or behind a toilet that shuts off water to one fixture without turning off the whole house, building, or irrigation line.",
		definition:
			"Fixture shutoff valves, often called angle stops, sit on the supply line between the branch and the fixture connector. Quarter-turn or multi-turn designs allow quick isolation during leaks, faucet swaps, or toilet repairs.\n\nOld compression valves on galvanized or copper stub-outs may leak when exercised after years idle. Replacing stops during fixture upgrades prevents emergency shutoff problems.",
		localContext:
			"Older Santa Cruz cottages often have corroded stops tucked into tight vanity cabinets near the coast. Multi-unit buildings in downtown Santa Cruz benefit from labeled stops so tenants can contain a leak before the main is located.",
		homeownerTip:
			"Gently turn each stop off and on once a year; replace any that drip or will not fully close.",
		relatedServiceSlugs: [
			"fixture-installation",
			"toilet-repair",
			"water-line-repair-and-installation",
		],
		relatedTermSlugs: [
			"ball-valve",
			"supply-line",
			"toilet-flapper",
			"water-line",
		],
	},
	{
		slug: "floor-drain",
		term: "Floor Drain",
		shortDefinition:
			"A drain set flush with the floor to catch water from washers, water heaters, or garage runoff. Must connect to the proper sanitary or storm system.",
		definition:
			"Floor drains use a trap and grate to collect liquid near equipment that may leak or overflow. Laundry rooms, mechanical rooms, and commercial kitchens rely on them to keep spills from spreading.\n\nUnused floor drains can dry out, letting sewer gas enter the room. Regular use or trap primers keep the water seal intact. Misconnected garage drains tied to sanitary lines can overload sewers during storms.",
		localContext:
			"Garage and basement floor drains in Felton and Boulder Creek homes see mud and debris during winter runoff. Coastal garages in Pleasure Point need clear drains when high tides push groundwater toward slab openings.",
		homeownerTip:
			"Pour a bucket of water into rarely used floor drains monthly to maintain the trap seal.",
		relatedServiceSlugs: [
			"drain-cleaning",
			"commercial-drain-cleaning",
			"storm-drain-cleaning",
		],
		relatedTermSlugs: [
			"plumbing-trap",
			"dwv-system",
			"sump-pump",
			"storm-drain",
		],
	},
	{
		slug: "garbage-disposal",
		term: "Garbage Disposal",
		alsoKnownAs: ["Disposal Unit"],
		shortDefinition:
			"A motorized grinder mounted under a kitchen sink that shreds food waste before it enters the drain. Requires adequate water flow and proper use.",
		definition:
			"A garbage disposal spins impellers against a grind ring to break food scraps into particles small enough to pass through the drain. Cold water during operation solidifies grease so it shreds instead of coating pipes.\n\nOverloading, fibrous foods, and lack of flushing cause jams and kitchen clogs. Disposals connect to the sink tailpiece and share a trap with the dishwasher branch.",
		localContext:
			"Santa Cruz County vacation rentals and coastal condos often see disposal misuse from guests unfamiliar with local plumbing limits. Older kitchen drains in Westside Victorians may not tolerate heavy disposal use without frequent cleaning.",
		homeownerTip:
			"Run cold water for several seconds before and after use, and keep grease, bones, and coffee grounds out of the disposal.",
		relatedServiceSlugs: [
			"garbage-disposal-installation",
			"drain-cleaning",
			"fixture-installation",
		],
		relatedTermSlugs: ["drain-snake", "p-trap", "grease-trap", "dwv-system"],
	},
	{
		slug: "gas-line",
		term: "Gas Line",
		shortDefinition:
			"Piping that delivers natural gas or propane to water heaters, ranges, dryers, and fireplaces. Suspected leaks require immediate professional repair.",
		definition:
			"Residential gas lines may be black iron, corrugated stainless, or copper where code allows. Joints are threaded or mechanically coupled and must be pressure tested after any modification.\n\nThe distinct odor of mercaptan signals a leak. Do not operate switches or flames if you smell gas; evacuate and call for repair from a licensed plumber or utility qualified contractor.",
		localContext:
			"Santa Cruz County homes mix older iron gas lines in crawl spaces with newer CSST in remodels across the mountains and beach flats. Earth movement on hillside lots in the Santa Cruz Mountains can stress exposed fittings after storms.",
		homeownerTip:
			"If you smell rotten eggs near a water heater or range, leave the area and call 831.225.4344 for help.",
		relatedServiceSlugs: ["gas-line-repair", "water-heater-installation"],
		relatedTermSlugs: [
			"water-heater",
			"tankless-water-heater",
			"leak-detection",
			"smoke-test",
		],
	},
	{
		slug: "gate-valve",
		term: "Gate Valve",
		shortDefinition:
			"A multi-turn shutoff that raises an internal gate to open flow. Common on older water mains but can seize, leak, or break if left unused for years.",
		definition:
			"A gate valve uses a threaded stem to lift a metal gate out of the water path. Fully open, it offers low resistance, but partially open positions can vibrate and wear the gate.\n\nMineral buildup and disuse cause many older gate valves to break when forced. Plumbers often replace them with ball valves during repipes or water heater work.",
		localContext:
			"Pre-1980 Santa Cruz homes frequently have gate valves on street-side mains in cramped crawl spaces. Corrosion from coastal moisture makes these valves hard to find and operate during after-hours leaks in Live Oak.",
		homeownerTip:
			"If your main shutoff has a round wheel handle, test it carefully; consider upgrading before an emergency.",
		relatedServiceSlugs: [
			"water-line-repair-and-installation",
			"pipe-repair-and-replacement",
		],
		relatedTermSlugs: [
			"ball-valve",
			"water-main",
			"fixture-shutoff-valve",
			"supply-line",
		],
	},
	{
		slug: "grease-trap",
		term: "Grease Trap",
		alsoKnownAs: ["Grease Interceptor"],
		shortDefinition:
			"A tank that captures fats, oils, and grease from commercial kitchen drains before they clog sewer lines, back up floor drains, or trigger code violations.",
		definition:
			"Grease traps slow wastewater so grease floats and solids settle before effluent enters the sanitary sewer. Restaurants, cafes, and food prep businesses maintain traps on a regular pumping schedule.\n\nNeglected grease traps cause foul odors, slow floor drains, and costly main line blockages. Sizing depends on fixture count and local health department requirements.",
		localContext:
			"Santa Cruz County coastal restaurants from the Wharf to Capitola rely on grease traps to protect shared municipal sewers. Health inspections and county hauler schedules keep commercial kitchens compliant through busy summer seasons.",
		homeownerTip:
			"Commercial tenants should log pump-out dates; missed service leads to backups that shut down dining rooms.",
		relatedServiceSlugs: [
			"grease-trap-installation",
			"grease-trap-cleaning",
			"commercial-drain-cleaning",
		],
		relatedTermSlugs: [
			"blackwater",
			"hydro-jetting",
			"floor-drain",
			"main-sewer-line",
		],
	},
	{
		slug: "greywater",
		term: "Greywater",
		alsoKnownAs: ["Gray Water"],
		shortDefinition:
			"Wastewater from showers, tubs, lavatories, and laundry that excludes toilet waste. May be reused for landscape irrigation where local code allows.",
		definition:
			"Greywater is lightly used household water without toilet discharge. California permits certain greywater systems for landscape irrigation when piping, filtration, and setbacks meet health codes.\n\nGreywater must never cross into potable lines or share pumps with blackwater. Kitchen sink waste is often treated as blackwater because of grease and food solids.",
		localContext:
			"Water-conscious homeowners in Santa Cruz, Aptos, and the mountains install laundry-to-landscape systems to irrigate drought-tolerant yards. Permits and backflow protection matter on properties served by municipal water and private wells alike.",
		homeownerTip:
			"Do not route greywater to edible gardens without understanding local permit rules and filtration needs.",
		relatedServiceSlugs: [
			"water-line-repair-and-installation",
			"fixture-installation",
		],
		relatedTermSlugs: [
			"blackwater",
			"potable-water",
			"cross-connection",
			"sewer-line",
		],
	},
	{
		slug: "hard-water",
		term: "Hard Water",
		alsoKnownAs: ["Mineral-Rich Water"],
		shortDefinition:
			"Water with high dissolved calcium and magnesium that leaves scale on fixtures, showerheads, and heating elements while shortening appliance life.",
		definition:
			"Hard water deposits white scale on faucets, showerheads, and heating elements. Over time, scale reduces efficiency in tank and tankless water heaters and clogs aerators.\n\nWater softeners exchange hardness ions for sodium or potassium. Filtration and softening combinations are common where well water serves whole-house supply.",
		localContext:
			"Wells in the Santa Cruz Mountains and Bonny Doon often produce harder water than municipal supply along the coast. Scale buildup shows up quickly on tankless units in hillside homes without treatment.",
		homeownerTip:
			"White crust on showerheads and short hot water cycles are signs to test hardness before replacing the heater.",
		relatedServiceSlugs: [
			"water-softener-maintenance",
			"water-filtration-system-installation",
			"water-heater-installation",
		],
		relatedTermSlugs: [
			"water-softener",
			"anode-rod",
			"water-filtration-system",
			"faucet-aerator",
		],
	},
	{
		slug: "hose-bib",
		term: "Hose Bib",
		alsoKnownAs: ["Outdoor Faucet", "Sillcock"],
		shortDefinition:
			"An exterior water spigot for hoses and irrigation. Should include a vacuum breaker wherever backflow into the potable supply is a concern on the property.",
		definition:
			"A hose bib is a valve body mounted through an exterior wall with a threaded spout for hose connection. Frost-free models place the shutoff seat inside the warmed wall cavity to reduce freeze risk.\n\nMissing vacuum breakers on older bibs create cross-connection risk if a hose ends up submerged. Leaking packing nuts and split vacuum breakers are common repair items.",
		localContext:
			"Santa Cruz County mild winters still see occasional pipe bursts on exposed bibs in mountain cabins above the fog line. Salt air corrodes exterior fittings on ocean-facing homes in Rio Del Mar and Seacliff.",
		homeownerTip:
			"Disconnect hoses in cold snaps and repair dripping hose bibs promptly to avoid hidden wall damage.",
		relatedServiceSlugs: [
			"fixture-installation",
			"water-line-repair-and-installation",
			"backflow-prevention-installation",
		],
		relatedTermSlugs: [
			"cross-connection",
			"backflow-preventer",
			"supply-line",
			"potable-water",
		],
	},
	{
		slug: "hydro-jetting",
		term: "Hydro Jetting",
		alsoKnownAs: ["Water Jetting", "High-Pressure Jetting"],
		shortDefinition:
			"High-pressure water cleaning that scours grease and roots from pipe walls. More thorough than snaking alone for recurring drain and main sewer clogs.",
		definition:
			"Hydro jetting sends pressurized water through a specialized nozzle that propels the hose forward while blasting the pipe interior. It removes grease blankets, scale, and small roots that a cable alone may leave behind.\n\nA camera inspection often precedes jetting to confirm pipe integrity. Fragile or collapsed pipes may need repair instead of jetting at full pressure.",
		localContext:
			"Restaurant rows and older sewer laterals in downtown Santa Cruz and Watsonville benefit from periodic jetting before rainy season. Redwood root masses in mountain sewer lines near Felton respond well when combined with follow-up camera checks.",
		homeownerTip:
			"Ask for video before and after jetting if clogs return every few months; the footage shows whether roots or pipe damage are the real cause.",
		relatedServiceSlugs: [
			"hydro-jetting",
			"commercial-drain-cleaning",
			"sewer-camera-inspection",
		],
		relatedTermSlugs: [
			"drain-snake",
			"sewer-camera-inspection",
			"main-sewer-line",
			"cleanout",
		],
	},
	{
		slug: "leak-detection",
		term: "Leak Detection",
		shortDefinition:
			"Methods to locate hidden water leaks in walls, slabs, and underground lines using acoustic, thermal, or tracer tools before destructive digging.",
		definition:
			"Leak detection combines pressure testing, acoustic listening, infrared imaging, and moisture meters to pinpoint leaks without opening every surface. Slab leaks on copper or PEX under foundations are a common residential target.\n\nEarly detection limits mold, foundation damage, and high water bills. Once located, a plumber can plan a targeted repair or repipe section.",
		localContext:
			"Santa Cruz County slab-on-grade homes from the 1950s and 1960s in Live Oak and Aptos frequently hide pinhole leaks under tile. Hillside properties with long exterior supply runs use leak detection to avoid trenching entire yards.",
		homeownerTip:
			"An unexplained jump on your water bill or warm spot on the floor warrants leak detection before repainting or retiling.",
		relatedServiceSlugs: [
			"leak-detection",
			"pipe-repair-and-replacement",
			"water-line-repair-and-installation",
		],
		relatedTermSlugs: ["copper-pipe", "pex-pipe", "supply-line", "water-main"],
	},
	{
		slug: "main-sewer-line",
		term: "Main Sewer Line",
		alsoKnownAs: ["Building Sewer", "Sewer Lateral"],
		shortDefinition:
			"The buried pipe that carries all building wastewater from the cleanout to the municipal sewer main, private septic tank, or approved disposal point.",
		definition:
			"The main sewer line collects every branch drain and waste line and slopes toward the street or septic tank. Materials include clay, cast iron, ABS, and PVC depending on era and jurisdiction.\n\nBellies, offset joints, and root intrusion cause backups throughout the house. Trenchless methods can rehabilitate some lines without full yard excavation.",
		localContext:
			"Long laterals on wide lots in Soquel and Corralitos cross tree root zones and agricultural drainage. Coastal clay pipes near the ocean shift in sandy soil during wet winters, leading to joint separation.",
		homeownerTip:
			"Multiple fixtures backing up at once usually means the main sewer line, not individual drain clogs.",
		relatedServiceSlugs: [
			"sewer-line-inspection",
			"trenchless-sewer-line-replacement",
			"main-line-cleanout-installation",
		],
		relatedTermSlugs: [
			"sewer-line",
			"cleanout",
			"trenchless-sewer-repair",
			"sewer-camera-inspection",
		],
	},
	{
		slug: "mixing-valve",
		term: "Mixing Valve",
		alsoKnownAs: ["Thermostatic Mixing Valve", "TMV"],
		shortDefinition:
			"A valve that blends hot and cold water to a set temperature. Protects against scalding at showers, tub spouts, and commercial fixture banks.",
		definition:
			"Mixing valves combine hot and cold streams to deliver stable outlet temperature even when supply pressure fluctuates. Thermostatic models react quickly if cold pressure drops, reducing scald risk.\n\nCode often requires them in commercial showers and is recommended for children and elderly households. Cartridges wear out and may need periodic service.",
		localContext:
			"Santa Cruz County hotels, gyms, and senior housing near the coast install thermostatic mixing valves to meet safety standards. Older single-handle showers in beach rentals benefit from upgrades when inconsistent temperature surprises guests.",
		homeownerTip:
			"If shower temperature swings when a toilet flushes, ask about pressure balance or thermostatic mixing valves.",
		relatedServiceSlugs: [
			"shower-installation-and-repair",
			"fixture-installation",
			"water-heater-installation",
		],
		relatedTermSlugs: [
			"shower-valve",
			"water-heater",
			"tankless-water-heater",
			"prv",
		],
	},
	{
		slug: "p-trap",
		term: "P-Trap",
		shortDefinition:
			"A U-shaped pipe under sinks and tubs that holds water to block sewer gas. The standard trap shape used on most modern residential and commercial fixtures.",
		definition:
			"A P-trap forms a water seal between the fixture and the drain system. The standing water blocks methane and other sewer odors from entering the room while allowing wastewater to flow out.\n\nTraps dry out in unused fixtures, leak at slip joints, or clog with hair and debris. They must vent properly or siphon during heavy drainage events.",
		localContext:
			"Guest baths in Santa Cruz vacation homes often dry out P-traps between rentals, causing mysterious odors mistaken for sewer failures. Tight under-sink spaces in older cottages make trap maintenance a common service call.",
		homeownerTip:
			"Run water in guest baths monthly and tighten slip nuts gently if you see slow leaks under the cabinet.",
		relatedServiceSlugs: ["drain-cleaning", "fixture-installation"],
		relatedTermSlugs: [
			"plumbing-trap",
			"dwv-system",
			"garbage-disposal",
			"vent-stack",
		],
	},
	{
		slug: "pex-pipe",
		term: "PEX Pipe",
		alsoKnownAs: ["Cross-Linked Polyethylene"],
		shortDefinition:
			"Flexible plastic supply tubing joined by crimp or expansion fittings. Popular for repipes and long runs with fewer joints than rigid copper pipe.",
		definition:
			"PEX is flexible cross-linked polyethylene rated for hot and cold potable water. It resists freeze damage better than rigid copper in some installations and speeds repipes through attics and crawl spaces.\n\nUV exposure degrades PEX, so outdoor use requires sleeving. Proper fittings and support spacing prevent sagging and noise from water hammer.",
		localContext:
			"Repipe projects across Santa Cruz, Scotts Valley, and Watsonville often switch aging galvanized or pinhole copper to PEX. Hillside crawls with tight access favor PEX loops to water heaters in garages.",
		homeownerTip:
			"Do not leave PEX unprotected in direct sunlight on exterior routes; use insulation and UV shielding.",
		relatedServiceSlugs: [
			"pipe-repair-and-replacement",
			"water-line-repair-and-installation",
		],
		relatedTermSlugs: [
			"copper-pipe",
			"supply-line",
			"water-heater",
			"leak-detection",
		],
	},
	{
		slug: "pipe-bursting",
		term: "Pipe Bursting",
		shortDefinition:
			"A trenchless method that pulls a new pipe through an old sewer line while fracturing the existing pipe outward. Limits yard damage on long laterals.",
		definition:
			"Pipe bursting uses a bursting head larger than the old pipe to break apart the existing line while simultaneously pulling new HDPE pipe into place. Access pits at each end replace full open trenching along the run.\n\nIt works when the old line is collapsed enough to follow the bore path but soil conditions allow expansion. A camera inspection confirms candidacy before work begins.",
		localContext:
			"Wide Santa Cruz County lots with mature landscaping from Aptos hills to Soquel orchards use pipe bursting to avoid tearing out driveways and root zones. Sandy coastal soils sometimes need careful bore planning near utilities.",
		homeownerTip:
			"Compare pipe bursting with lining options; bursting gives a full-diameter new pipe when soil and depth allow.",
		relatedServiceSlugs: [
			"trenchless-sewer-line-replacement",
			"sewer-camera-inspection",
		],
		relatedTermSlugs: [
			"pipe-lining",
			"trenchless-sewer-repair",
			"main-sewer-line",
			"sewer-line",
		],
	},
	{
		slug: "pipe-lining",
		term: "Pipe Lining",
		alsoKnownAs: ["Cured-In-Place Pipe", "CIPP"],
		shortDefinition:
			"A trenchless repair that inserts a resin-coated liner into an existing pipe, then cures it to form a new smooth interior without full excavation.",
		definition:
			"Pipe lining pulls or inverts a flexible tube saturated with epoxy into the damaged sewer. Heat or UV cures the resin, creating a structural liner inside the old pipe.\n\nLining reduces diameter slightly but seals cracks and root entry points. It suits pipes with moderate damage where bursting is unnecessary.",
		localContext:
			"Urban Santa Cruz neighborhoods with shallow utilities and established gardens often choose lining to preserve sidewalks and heritage trees. Clay laterals under established Capitola streets are frequent lining candidates after camera inspection.",
		homeownerTip:
			"Ask whether roots were cut and the line cleaned before lining; prep quality determines how long the repair lasts.",
		relatedServiceSlugs: [
			"trenchless-sewer-line-replacement",
			"sewer-camera-inspection",
			"hydro-jetting",
		],
		relatedTermSlugs: [
			"pipe-bursting",
			"trenchless-sewer-repair",
			"sewer-camera-inspection",
			"main-sewer-line",
		],
	},
	{
		slug: "plumbing-trap",
		term: "Plumbing Trap",
		shortDefinition:
			"A curved pipe section that retains water to seal out sewer gases. Every fixture with a drain requires an approved trap under local plumbing code.",
		definition:
			"Plumbing traps maintain a water barrier between living spaces and the drainage system. P-traps and S-traps are common shapes, with P-traps preferred because they resist siphon better when properly vented.\n\nDouble trapping or missing vents can cause slow drainage and gurgling. Traps must be accessible for cleaning when installed on floor drains and specialty fixtures.",
		localContext:
			"Remodeled Santa Cruz kitchens and bath additions sometimes hide traps inside walls against code, complicating future clog removal. Historic homes may still have outdated trap configurations worth updating during renovation.",
		homeownerTip:
			"Never remove a trap to fix a clog permanently; the water seal is what keeps sewer smell out of the room.",
		relatedServiceSlugs: ["drain-cleaning", "fixture-installation"],
		relatedTermSlugs: ["p-trap", "dwv-system", "vent-stack", "floor-drain"],
	},
	{
		slug: "potable-water",
		term: "Potable Water",
		shortDefinition:
			"Water safe for drinking, cooking, and bathing. Supply lines and fixtures carrying potable water must meet health codes and backflow protection rules.",
		definition:
			"Potable water meets regulatory standards for human consumption. Municipal supply, tested wells, and treated rainwater systems can all be potable when properly filtered and isolated from contamination sources.\n\nOnly approved materials and fittings contact potable paths. Cross-connections and untested backflow devices are the main risks to potable quality inside a building.",
		localContext:
			"Santa Cruz County blends municipal sources, groundwater, and seasonal conservation messaging. Older galvanized supply in beach cottages may affect taste and should be evaluated during kitchen and bath upgrades.",
		homeownerTip:
			"Install hose bib vacuum breakers and keep irrigation plumbing separate from indoor potable lines.",
		relatedServiceSlugs: [
			"water-line-repair-and-installation",
			"water-filtration-system-installation",
			"backflow-prevention-testing",
		],
		relatedTermSlugs: [
			"greywater",
			"blackwater",
			"cross-connection",
			"backflow-preventer",
		],
	},
	{
		slug: "prv",
		term: "PRV",
		alsoKnownAs: ["Pressure Reducing Valve", "Pressure Regulator"],
		shortDefinition:
			"A valve that lowers street water pressure to a safe level for pipes, fixtures, and water heaters. Protects against leaks and appliance damage.",
		definition:
			"A PRV, or pressure reducing valve, throttles incoming supply to a set downstream pressure, often 50 to 60 psi for residential use. High municipal pressure without a PRV stresses flex lines and causes water hammer.\n\nPRVs wear out and may need adjustment or replacement when pressure creeps up or flow drops noticeably at multiple fixtures.",
		localContext:
			"Hillside neighborhoods in Scotts Valley and the Santa Cruz Mountains see higher main pressure than low-lying coastal zones. PRVs in garage supply lines protect tankless heaters sensitive to inlet pressure swings.",
		homeownerTip:
			"If banging pipes or dripping relief valves appear after the city upgrades mains, have your PRV checked.",
		relatedServiceSlugs: [
			"water-line-repair-and-installation",
			"water-heater-installation",
		],
		relatedTermSlugs: [
			"expansion-tank",
			"t-and-p-relief-valve",
			"water-main",
			"supply-line",
		],
	},
	{
		slug: "pvc-pipe",
		term: "PVC Pipe",
		alsoKnownAs: ["Polyvinyl Chloride"],
		shortDefinition:
			"White or gray plastic pipe used for drain, waste, vent, and some cold-water applications. Lightweight and corrosion resistant in drainage systems.",
		definition:
			"PVC pipe for DWV systems uses solvent-welded joints and specific schedules rated for drainage temperatures, not hot supply unless marked otherwise. CPVC variants handle higher temperatures for hot water supply where permitted.\n\nPVC becomes brittle with UV exposure, so exterior runs need protection. Transition couplings join PVC to cast iron, clay, or ABS at repair points.",
		localContext:
			"Remodels and additions across Watsonville and Freedom often tie new PVC drains into older clay street connections. Exterior vent pipes on coastal homes should be painted or sleeved to resist sun damage above the fog line.",
		homeownerTip:
			"Never use drain-grade PVC on hot water supply; confirm pipe labeling matches the intended use.",
		relatedServiceSlugs: [
			"pipe-repair-and-replacement",
			"drain-line-inspection",
		],
		relatedTermSlugs: ["abs-pipe", "dwv-system", "vent-stack", "sewer-line"],
	},
	{
		slug: "recirculation-pump",
		term: "Recirculation Pump",
		alsoKnownAs: ["Hot Water Recirc Pump"],
		shortDefinition:
			"A small pump that keeps hot water moving through a loop so fixtures get hot water quickly without long waits, cold dumps, or wasted gallons.",
		definition:
			"Recirculation pumps mount near the water heater or under remote fixtures and push hot water through a dedicated or crossover return line. Timers and aquastats run the pump only when needed to save energy.\n\nImproper installation can waste energy or affect cold water temperature at certain fixtures. Check valves prevent backflow through the loop.",
		localContext:
			"Large Santa Cruz County homes with long pipe runs from garage heaters to second-floor baths use recirc loops common in mountain construction. Tankless heaters may need compatible pumps and controls to avoid short cycling.",
		homeownerTip:
			"Put recirc pumps on a timer so they run during morning and evening use, not 24 hours a day.",
		relatedServiceSlugs: [
			"water-heater-installation",
			"tankless-water-heater-installation",
		],
		relatedTermSlugs: [
			"water-heater",
			"tankless-water-heater",
			"check-valve",
			"supply-line",
		],
	},
	{
		slug: "sewer-camera-inspection",
		term: "Sewer Camera Inspection",
		alsoKnownAs: ["Video Pipe Inspection", "CCTV Sewer Inspection"],
		shortDefinition:
			"A waterproof camera pushed through drains or sewers to record pipe condition, roots, bellies, and cracks before repair, jetting, or a home sale.",
		definition:
			"Sewer camera inspection feeds a lighted head and lens through a cleanout or drain to capture video of pipe interior. Locators mark depth and position for targeted dig or trenchless repair.\n\nInspections clarify whether snaking, jetting, lining, or replacement is appropriate. Real estate transactions and recurring backups are the most common reasons homeowners schedule them.",
		localContext:
			"Pre-purchase inspections are routine for older Santa Cruz properties with unknown lateral history. Root-filled clay lines in the San Lorenzo Valley show clearly on camera before winter storms accelerate backups.",
		homeownerTip:
			"Request a copy of the inspection video and report if you are buying or selling a home with mature trees nearby.",
		relatedServiceSlugs: [
			"sewer-camera-inspection",
			"video-inspections",
			"sewer-line-inspection",
		],
		relatedTermSlugs: [
			"hydro-jetting",
			"main-sewer-line",
			"pipe-lining",
			"cleanout",
		],
	},
	{
		slug: "sewer-line",
		term: "Sewer Line",
		shortDefinition:
			"Any pipe carrying wastewater to treatment, including interior building drains and the underground lateral that reaches the street main or septic tank.",
		definition:
			"Sewer line is a broad term for piping in the sanitary system. Inside the home, smaller drains feed the building sewer; outside, the lateral connects to the municipal main or septic tank inlet.\n\nMaterial age drives maintenance needs: clay and cast iron are root prone, while PVC and ABS offer smoother interiors when intact.",
		localContext:
			"Santa Cruz County mixes municipal sewer districts and septic transitions at rural edges in Corralitos and Bonny Doon. Coastal sand and mountain clay behave differently, so inspection before purchase is wise on any older lateral.",
		homeownerTip:
			"Know whether your home uses city sewer or septic before calling for backup service; the fix differs.",
		relatedServiceSlugs: [
			"sewer-line-inspection",
			"drain-cleaning",
			"trenchless-sewer-line-replacement",
		],
		relatedTermSlugs: [
			"main-sewer-line",
			"blackwater",
			"sewer-camera-inspection",
			"cleanout",
		],
	},
	{
		slug: "shower-valve",
		term: "Shower Valve",
		shortDefinition:
			"The in-wall valve that mixes hot and cold water and controls flow to the shower head and tub spout. Cartridge or valve body leaks often hide inside the wall.",
		definition:
			"Shower valves include pressure-balance and thermostatic types that regulate temperature and flow behind the finish trim. Cartridges seal against mixing leaks; valve bodies tie into hot and cold supplies before the wall is tiled.\n\nLeaks may show as stains on adjacent walls or low pressure at the head. Access panels or careful tile removal allow service without replacing the entire shower.",
		localContext:
			"Salt air and hard water in coastal Santa Cruz showers shorten cartridge life in ocean-facing condos. Mountain homes with fluctuating well pressure benefit from pressure-balance valves to prevent scalding surprises.",
		homeownerTip:
			"Dripping behind the handle or sudden temperature swings mean the valve needs service, not just a new shower head.",
		relatedServiceSlugs: [
			"shower-installation-and-repair",
			"leak-detection",
			"fixture-installation",
		],
		relatedTermSlugs: [
			"mixing-valve",
			"supply-line",
			"water-heater",
			"hard-water",
		],
	},
	{
		slug: "smoke-test",
		term: "Smoke Test",
		shortDefinition:
			"A diagnostic test that blows non-toxic smoke into drain and vent systems to reveal illegal connections, open pipes, or hidden leaks in walls.",
		definition:
			"Smoke testing pressurizes the DWV system with visible smoke. Smoke escaping from roof vents, wall cracks, or yard soil shows where pipes are open, cracked, or illegally tied to storm drains.\n\nIt helps locate elusive sewer odors when camera and water tests fail. Occupants should be notified because smoke may enter through dry traps if they are not primed.",
		localContext:
			"Commercial kitchens and multi-family buildings in Santa Cruz use smoke tests during remodel inspections. Older hillside homes with DIY additions sometimes reveal vent cuts or cross ties only under smoke testing.",
		homeownerTip:
			"Pour water into floor drains before a scheduled smoke test so smoke does not enter living spaces through dry traps.",
		relatedServiceSlugs: ["smoke-tests", "drain-line-inspection"],
		relatedTermSlugs: [
			"dwv-system",
			"vent-stack",
			"sewer-line",
			"plumbing-trap",
		],
	},
	{
		slug: "storm-drain",
		term: "Storm Drain",
		shortDefinition:
			"Piping and grates that carry rainwater and surface runoff to creeks or storm systems. Must stay separate from sanitary sewer and potable lines.",
		definition:
			"Storm drains collect roof downspout water, yard runoff, and parking lot flow without mixing toilet or kitchen waste. Connecting a sanitary line to storm drainage pollutes waterways and violates environmental codes.\n\nClogged storm grates and underground lines cause yard flooding and garage seepage during heavy rain. Maintenance includes clearing debris and jetting sediment buildup.",
		localContext:
			"Santa Cruz County winter storms overwhelm clogged storm systems in low areas near the San Lorenzo River and coastal flats. Hillside properties must keep hillside drains and culverts clear before atmospheric river events.",
		homeownerTip:
			"Keep leaves and mulch away from exterior drain grates before forecast heavy rain.",
		relatedServiceSlugs: ["storm-drain-cleaning", "commercial-drain-cleaning"],
		relatedTermSlugs: [
			"floor-drain",
			"sump-pump",
			"sewer-line",
			"hydro-jetting",
		],
	},
	{
		slug: "sump-pump",
		term: "Sump Pump",
		shortDefinition:
			"A pump in a pit that removes groundwater before it floods crawl spaces or basements. Needs reliable power, discharge piping, and a check valve.",
		definition:
			"Sump pumps activate when pit water rises to a float switch, sending flow through a discharge pipe away from the foundation. Battery backup units help during power outages in storm season.\n\nFailed check valves, clogged intakes, or undersized pumps leave crawl spaces damp and promote mold. Regular testing before winter is essential.",
		localContext:
			"Low-lying Capitola, Pleasure Point, and Watsonville properties rely on sump pumps where groundwater sits high. Hillside homes with springs in Felton and Ben Lomond add pumps to garage pits and basement storage areas.",
		homeownerTip:
			"Pour water into the pit twice a year to confirm the pump and float switch actually start.",
		relatedServiceSlugs: ["sump-pump-installation", "storm-drain-cleaning"],
		relatedTermSlugs: [
			"check-valve",
			"floor-drain",
			"storm-drain",
			"leak-detection",
		],
	},
	{
		slug: "supply-line",
		term: "Supply Line",
		shortDefinition:
			"Piping that delivers pressurized potable water from the main to fixtures, water heaters, hose bibs, and appliances throughout the home or business.",
		definition:
			"Supply lines branch from the main shutoff through the water meter or pressure reducer to individual fixtures. Materials include copper, PEX, and CPVC sized for fixture demand and peak flow.\n\nFlex supply connectors at toilets and faucets have finite life and should be replaced when corroded or bulging. Whole-house supply failures often trace to one aging segment under a slab.",
		localContext:
			"Santa Cruz repipes often replace galvanized supply in 1940s cottages with PEX homeruns from a manifold. Long supply runs in mountain chalets need insulation where pipes pass through unheated crawl spaces.",
		homeownerTip:
			"Replace braided supply hoses to washing machines and toilets every five to seven years as preventive maintenance.",
		relatedServiceSlugs: [
			"water-line-repair-and-installation",
			"pipe-repair-and-replacement",
			"leak-detection",
		],
		relatedTermSlugs: [
			"copper-pipe",
			"pex-pipe",
			"water-main",
			"fixture-shutoff-valve",
		],
	},
	{
		slug: "t-and-p-relief-valve",
		term: "T&P Relief Valve",
		alsoKnownAs: ["Temperature and Pressure Relief Valve", "T&P Valve"],
		shortDefinition:
			"A safety valve on tank water heaters that opens if temperature or pressure exceeds safe limits. Discharge pipe must route to a visible floor drain or exterior.",
		definition:
			"The T and P relief valve monitors water heater tank conditions. If the thermostat fails or pressure spikes, the valve opens to release hot water and prevent tank rupture.\n\nDischarge piping must be rigid or semi-rigid copper or CPVC, terminate near the floor, and never be capped. Dripping valves may indicate expansion tank issues, excessive pressure, or a failing valve.",
		localContext:
			"Garage and closet water heaters common in Santa Cruz County must have properly routed T and P discharge to avoid scalding hazards near stored goods. Missing expansion tanks on closed systems cause nuisance dripping during heating cycles.",
		homeownerTip:
			"Never cap or plug the pipe from the T and P valve; call a plumber if it drips more than occasionally.",
		relatedServiceSlugs: [
			"water-heater-installation",
			"water-line-repair-and-installation",
		],
		relatedTermSlugs: ["water-heater", "expansion-tank", "prv", "anode-rod"],
	},
	{
		slug: "tankless-water-heater",
		term: "Tankless Water Heater",
		alsoKnownAs: ["On-Demand Water Heater"],
		shortDefinition:
			"A unit that heats water as it flows, without a storage tank. Needs adequate gas or electrical service, venting, and sizing for peak fixture demand.",
		definition:
			"Tankless water heaters use high-output burners or electric elements to heat water on demand. They save space and can reduce standby energy loss compared with tank models when sized correctly.\n\nUndersized units cause temperature fluctuation when multiple fixtures run. Scale from hard water demands regular descaling per manufacturer guidelines.",
		localContext:
			"Space-tight Santa Cruz beach apartments and ADUs favor wall-hung tankless units. Mountain homes on propane must verify gas line size before converting from a tank heater in the garage.",
		homeownerTip:
			"Match tankless capacity to your peak fixture count; a plumber can calculate flow rate before you buy.",
		relatedServiceSlugs: [
			"tankless-water-heater-installation",
			"gas-line-repair",
			"water-heater-installation",
		],
		relatedTermSlugs: [
			"water-heater",
			"gas-line",
			"hard-water",
			"recirculation-pump",
		],
	},
	{
		slug: "toilet-flapper",
		term: "Toilet Flapper",
		shortDefinition:
			"The rubber seal in the tank that lifts to flush and closes to stop fill. A worn flapper causes silent running, phantom fills, and high water bills.",
		definition:
			"The flapper covers the flush valve seat at the tank bottom. When the handle lifts the chain, water rushes into the bowl; the flapper should reseat as the tank refills.\n\nWarped or scaled flappers leak slowly, triggering the fill valve to cycle. Replacement is inexpensive compared with the water waste from an ignored run.",
		localContext:
			"Hard water in Santa Cruz Mountains wells stiffens flappers faster than soft coastal supply. Rental turnovers in downtown Santa Cruz often reveal flapper leaks discovered only after a high utility bill.",
		homeownerTip:
			"Add a few drops of food coloring to the tank; color in the bowl without flushing means the flapper is leaking.",
		relatedServiceSlugs: ["toilet-repair", "fixture-installation"],
		relatedTermSlugs: [
			"fixture-shutoff-valve",
			"potable-water",
			"hard-water",
			"water-heater",
		],
	},
	{
		slug: "trenchless-sewer-repair",
		term: "Trenchless Sewer Repair",
		shortDefinition:
			"Methods to fix or replace buried sewer pipe with minimal digging, including cured-in-place pipe lining and pipe bursting instead of open trenching.",
		definition:
			"Trenchless sewer repair restores function without tearing up entire yards, driveways, or hardscape. Techniques include cured-in-place lining and pipe bursting, chosen after camera inspection and depth review.\n\nNot every pipe qualifies: severe collapse, sharp offsets, or utility conflicts may still require spot excavation. Access pits at cleanouts or easements remain necessary.",
		localContext:
			"Established neighborhoods from West Cliff to the Aptos hills use trenchless options to preserve landscaping and redwood root zones. Coastal easements with limited access favor lining when pipe diameter allows.",
		homeownerTip:
			"Get a written comparison of trenchless versus open replacement for your specific lateral before committing.",
		relatedServiceSlugs: [
			"trenchless-sewer-line-replacement",
			"sewer-camera-inspection",
		],
		relatedTermSlugs: [
			"pipe-lining",
			"pipe-bursting",
			"main-sewer-line",
			"sewer-camera-inspection",
		],
	},
	{
		slug: "vent-stack",
		term: "Vent Stack",
		alsoKnownAs: ["Plumbing Vent", "Stack Vent"],
		shortDefinition:
			"A vertical pipe that vents sewer gases through the roof and admits air so drains flow freely without siphoning traps on sinks, tubs, and floor drains.",
		definition:
			"Vent stacks tie branch vents to a main stack that terminates above the roofline. Air entering the system prevents vacuum that would pull water from traps and allows wastewater to move by gravity.\n\nBlocked vents from debris, paint, or failed flashing cause gurgling and slow drains throughout the house. Roof access is required for inspection and clearing.",
		localContext:
			"Redwood needles and coastal moss clog vent terminations on Santa Cruz Mountain homes. Older flat-roof commercial buildings downtown need periodic vent checks when tenants report uniform drain slowdown.",
		homeownerTip:
			"If every drain gurgles during windy rain, ask about vent blockages before repeatedly snaking fixtures.",
		relatedServiceSlugs: [
			"drain-line-inspection",
			"smoke-tests",
			"pipe-repair-and-replacement",
		],
		relatedTermSlugs: ["dwv-system", "plumbing-trap", "smoke-test", "pvc-pipe"],
	},
	{
		slug: "water-filtration-system",
		term: "Water Filtration System",
		shortDefinition:
			"Filters or treatment units that reduce sediment, chlorine, taste issues, or specific contaminants in drinking, cooking, and bathing water at the tap.",
		definition:
			"Water filtration ranges from sediment cartridges at the main to carbon filters, UV disinfection, and reverse osmosis at the kitchen sink. Selection depends on lab test results and whether supply is municipal or well.\n\nFilters need scheduled cartridge changes; neglected media stops protecting fixtures and may harbor bacteria. Whole-house units install on the supply after the main shutoff.",
		localContext:
			"Well owners in Bonny Doon and the San Lorenzo Valley often pair filtration with softeners for sediment and iron. Municipal customers in Santa Cruz may filter chlorine taste while meeting local conservation goals.",
		homeownerTip:
			"Test your water before buying expensive filtration; target the contaminants you actually have.",
		relatedServiceSlugs: [
			"water-filtration-system-installation",
			"water-softener-maintenance",
		],
		relatedTermSlugs: [
			"water-softener",
			"potable-water",
			"hard-water",
			"supply-line",
		],
	},
	{
		slug: "water-heater",
		term: "Water Heater",
		shortDefinition:
			"Equipment that heats domestic hot water in a storage tank or on demand. Gas, electric, and heat-pump types serve Santa Cruz homes of every size.",
		definition:
			"Water heaters supply hot water to fixtures and appliances through the hot side of the supply system. Tank models store heated volume; tankless units heat flow directly. Anode rods, T and P valves, and expansion tanks protect tank units.\n\nReplacement timing depends on age, rust, noise, and insufficient hot water. Permits, seismic strapping, and venting rules apply to new installations.",
		localContext:
			"Garage and exterior closet heaters are standard in Santa Cruz County tract homes and mountain cabins. Coastal salt air favors regular inspection of burner compartments and vent connectors on gas models.",
		homeownerTip:
			"Flush sediment yearly and plan replacement near the end of the manufacturer warranty period to avoid emergency cold showers.",
		relatedServiceSlugs: [
			"water-heater-installation",
			"tankless-water-heater-installation",
		],
		relatedTermSlugs: [
			"tankless-water-heater",
			"anode-rod",
			"t-and-p-relief-valve",
			"gas-line",
		],
	},
	{
		slug: "water-line",
		term: "Water Line",
		shortDefinition:
			"Any pipe carrying potable or irrigation water, from the utility main connection at the street to individual fixture supplies inside the building.",
		definition:
			"Water lines include the service lateral from the meter, interior distribution, and branches to fixtures. Leaks may appear as wet spots, low pressure, or sound of running water when everything is off.\n\nMaterial choice and depth affect repair method. Spot repairs, reroutes, and full repipes each suit different age and damage patterns.",
		localContext:
			"Santa Cruz County properties mix meter locations at the street, sidewalk, or side yard, especially on hillside driveways in Scotts Valley. Long uninsulated lines in crawl spaces can freeze during rare cold snaps above the fog belt.",
		homeownerTip:
			"Know where your water meter and main shutoff are before a leak; label them for household members.",
		relatedServiceSlugs: [
			"water-line-repair-and-installation",
			"leak-detection",
			"pipe-repair-and-replacement",
		],
		relatedTermSlugs: ["water-main", "supply-line", "copper-pipe", "pex-pipe"],
	},
	{
		slug: "water-main",
		term: "Water Main",
		shortDefinition:
			"The primary pressurized pipe bringing water into a property, often with a meter and main shutoff before interior supply branches split off indoors.",
		definition:
			"The water main is the first owned segment after the utility tap, typically running from the street to the house or from the meter pit to the building. It feeds all interior supply lines and must handle peak demand.\n\nMain breaks show as flooding in yards, sudden pressure loss, or water meter spin with fixtures closed. Shutoff valves on either side of the meter isolate the building during repair.",
		localContext:
			"Older galvanized mains still serve some Santa Cruz and Live Oak homes, prone to internal rust and low flow. Earth movement on hillside lots can stress yard mains where they cross unimproved driveways.",
		homeownerTip:
			"If the meter dial moves with all fixtures off, shut off the main and call for leak detection.",
		relatedServiceSlugs: [
			"water-line-repair-and-installation",
			"leak-detection",
		],
		relatedTermSlugs: ["water-line", "ball-valve", "prv", "supply-line"],
	},
	{
		slug: "water-softener",
		term: "Water Softener",
		shortDefinition:
			"A treatment unit that removes hardness minerals to reduce scale on fixtures and extend water heater life. Requires salt or potassium and periodic service.",
		definition:
			"Water softeners use ion exchange resin to swap calcium and magnesium for sodium or potassium. A control valve regenerates the resin on a schedule based on water use or hardness sensors.\n\nSoftened water feels slicker and reduces soap use, but bypass plumbing may feed outdoor hose bibs to avoid irrigating with salty discharge. Maintenance includes salt refills and occasional resin cleaning.",
		localContext:
			"Well-powered homes in the Santa Cruz Mountains commonly install softeners in garages alongside pressure tanks. Pairing softeners with filtration is typical where iron and manganese accompany hardness.",
		homeownerTip:
			"Check salt level monthly and schedule annual service so the resin bed regenerates on time.",
		relatedServiceSlugs: [
			"water-softener-maintenance",
			"water-filtration-system-installation",
		],
		relatedTermSlugs: [
			"hard-water",
			"water-filtration-system",
			"anode-rod",
			"water-heater",
		],
	},
]
