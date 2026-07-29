#!/usr/bin/env python3
"""One-shot content cleanup + interlinking pass for Wade's markdown library."""

from __future__ import annotations

import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"

LP_REMAP = {
	"/lp/contact-call-first/": "/contact",
	"/lp/contact-call-first": "/contact",
	"/lp/failed-septic-repair-replacement-santa-cruz-county/": (
		"/service-offerings/septic-tank-repair-and-replacement"
	),
	"/lp/failed-septic-repair-replacement-santa-cruz-county": (
		"/service-offerings/septic-tank-repair-and-replacement"
	),
	"/lp/plumbing-repair-services-santa-cruz-county/": (
		"/service-offerings/pipe-repair-and-replacement"
	),
	"/lp/plumbing-repair-services-santa-cruz-county": (
		"/service-offerings/pipe-repair-and-replacement"
	),
	"/lp/engineered-septic-systems-santa-cruz-county/": (
		"/service-offerings/alternative-septic-system-installation"
	),
	"/lp/engineered-septic-systems-santa-cruz-county": (
		"/service-offerings/alternative-septic-system-installation"
	),
	"/lp/septic-replacement-santa-cruz/": (
		"/service-offerings/septic-system-installation"
	),
	"/lp/septic-replacement-santa-cruz": (
		"/service-offerings/septic-system-installation"
	),
	"/lp/emergency-plumber-santa-cruz-county/": "/contact",
	"/lp/emergency-plumber-santa-cruz-county": "/contact",
	"/lp/water-main-sewer-line-repair-santa-cruz-county/": (
		"/service-offerings/trenchless-sewer-line-replacement"
	),
	"/lp/water-main-sewer-line-repair-santa-cruz-county": (
		"/service-offerings/trenchless-sewer-line-replacement"
	),
}

# Tip slug → service offering slugs to surface
TIP_SERVICE_LINKS: dict[str, list[tuple[str, str]]] = {
	"the-benefits-of-hydro-jetting": [
		("Hydro jetting", "/service-offerings/hydro-jetting"),
		("Drain cleaning", "/service-offerings/drain-cleaning"),
	],
	"6-signs-you-have-a-hidden-water-leak": [
		("Leak detection", "/service-offerings/leak-detection"),
		("Pipe repair", "/service-offerings/pipe-repair-and-replacement"),
	],
	"signs-your-drain-field-needs-professional-repair": [
		(
			"Drainfield repair",
			"/service-offerings/drainfield-repair-and-replacement",
		),
		(
			"Leach field repair",
			"/service-offerings/septic-tank-leach-field-repair-and-replacement",
		),
	],
	"why-is-dirty-water-backing-up-into-your-shower": [
		("Hydro jetting", "/service-offerings/hydro-jetting"),
		("Sewer camera inspection", "/service-offerings/sewer-camera-inspection"),
	],
	"water-softeners-vs-whole-house-filtration-systems-which-is-right-for-your-home": [
		("Water softener maintenance", "/service-offerings/water-softener-maintenance"),
		(
			"Water filtration installation",
			"/service-offerings/water-filtration-system-installation",
		),
	],
	"what-is-hard-water-why-does-it-matter-for-your-home": [
		("Water softener maintenance", "/service-offerings/water-softener-maintenance"),
		(
			"Water filtration installation",
			"/service-offerings/water-filtration-system-installation",
		),
	],
	"salt-water-softeners-vs-water-conditioners-which-is-right-for-you": [
		("Water softener maintenance", "/service-offerings/water-softener-maintenance"),
	],
	"efficient-water-filtration-santa-cruz": [
		(
			"Water filtration installation",
			"/service-offerings/water-filtration-system-installation",
		),
	],
	"santa-cruz-toilet-running-solutions": [
		("Toilet repair", "/service-offerings/toilet-repair"),
	],
	"5-types-of-toilets-how-to-choose-the-right-one-for-your-home": [
		("Toilet repair", "/service-offerings/toilet-repair"),
		("Fixture installation", "/service-offerings/fixture-installation"),
	],
	"how-to-install-a-toilet-flange-in-8-easy-steps": [
		("Toilet repair", "/service-offerings/toilet-repair"),
	],
	"slow-drains-solutions-santa-cruz": [
		("Drain cleaning", "/service-offerings/drain-cleaning"),
		("Hydro jetting", "/service-offerings/hydro-jetting"),
	],
	"how-to-handle-a-clogged-drain-or-sewer-line": [
		("Drain cleaning", "/service-offerings/drain-cleaning"),
		("Hydro jetting", "/service-offerings/hydro-jetting"),
	],
	"how-to-properly-clear-a-clogged-drain-a-step-by-step-guide": [
		("Drain cleaning", "/service-offerings/drain-cleaning"),
	],
	"should-you-repair-or-replace-your-water-heater": [
		("Water heater installation", "/service-offerings/water-heater-installation"),
		(
			"Tankless water heater installation",
			"/service-offerings/tankless-water-heater-installation",
		),
	],
	"shower-valve-replacement-why-it-matters-for-your-water-temperature-and-pressure": [
		(
			"Shower installation and repair",
			"/service-offerings/shower-installation-and-repair",
		),
	],
	"how-to-install-a-new-bathroom-faucet-a-weekend-diy-project": [
		("Fixture installation", "/service-offerings/fixture-installation"),
	],
	"how-to-prevent-frozen-pipes-this-winter": [
		("Pipe repair", "/service-offerings/pipe-repair-and-replacement"),
		("Leak detection", "/service-offerings/leak-detection"),
	],
	"pipe-leak-solutions-santa-cruz-septic": [
		("Leak detection", "/service-offerings/leak-detection"),
		("Pipe repair", "/service-offerings/pipe-repair-and-replacement"),
	],
	"sewer-line-repair-essentials-santa-cruz": [
		(
			"Trenchless sewer line replacement",
			"/service-offerings/trenchless-sewer-line-replacement",
		),
		("Sewer camera inspection", "/service-offerings/sewer-camera-inspection"),
	],
	"understanding-the-cost-of-septic-pumping-in-santa-cruz-county": [
		(
			"Septic tank cleaning and pumping",
			"/service-offerings/septic-tank-cleaning-and-pumping",
		),
	],
	"how-to-maintain-your-septic-tank-for-long-term-performance": [
		(
			"Septic tank cleaning and pumping",
			"/service-offerings/septic-tank-cleaning-and-pumping",
		),
		(
			"Septic tank maintenance",
			"/service-offerings/septic-tank-maintenance-and-care",
		),
	],
	"the-complete-guide-to-septic-system-maintenance": [
		(
			"Septic tank cleaning and pumping",
			"/service-offerings/septic-tank-cleaning-and-pumping",
		),
		(
			"Septic tank inspection",
			"/service-offerings/septic-tank-inspection-and-assessment",
		),
	],
	"proper-care-and-maintenance-of-your-septic-tank-a-comprehensive-guide": [
		(
			"Septic tank cleaning and pumping",
			"/service-offerings/septic-tank-cleaning-and-pumping",
		),
	],
	"what-you-need-to-know-about-engineered-septic-systems": [
		(
			"Alternative septic system installation",
			"/service-offerings/alternative-septic-system-installation",
		),
		(
			"Septic design and engineering",
			"/service-offerings/septic-tank-design-and-engineering",
		),
	],
	"new-septic-installations-santa-cruz": [
		(
			"Septic system installation",
			"/service-offerings/septic-system-installation",
		),
	],
	"a-homeowners-guide-to-new-septic-systems-in-santa-cruz-county": [
		(
			"Septic system installation",
			"/service-offerings/septic-system-installation",
		),
		(
			"Alternative septic system installation",
			"/service-offerings/alternative-septic-system-installation",
		),
	],
	"septic-leach-field-repairs-santa-cruz": [
		(
			"Leach field repair",
			"/service-offerings/septic-tank-leach-field-repair-and-replacement",
		),
	],
	"septic-pumping-essentials-santa-cruz": [
		(
			"Septic tank cleaning and pumping",
			"/service-offerings/septic-tank-cleaning-and-pumping",
		),
	],
	"why-you-should-never-ignore-septic-system-warning-signs": [
		(
			"Septic tank troubleshooting",
			"/service-offerings/septic-tank-troubleshooting-and-diagnostic-services",
		),
		(
			"Septic tank cleaning and pumping",
			"/service-offerings/septic-tank-cleaning-and-pumping",
		),
	],
	"septic-trouble-signs-santa-cruz": [
		(
			"Septic tank troubleshooting",
			"/service-offerings/septic-tank-troubleshooting-and-diagnostic-services",
		),
		(
			"Septic tank cleaning and pumping",
			"/service-offerings/septic-tank-cleaning-and-pumping",
		),
	],
	"emergency-septic-solutions-santa-cruz": [
		(
			"Septic tank repair",
			"/service-offerings/septic-tank-repair-and-replacement",
		),
		(
			"Septic tank troubleshooting",
			"/service-offerings/septic-tank-troubleshooting-and-diagnostic-services",
		),
	],
	"from-clogs-to-catastrophes-a-plumbers-guide-to-home-emergencies": [
		("Drain cleaning", "/service-offerings/drain-cleaning"),
		("Leak detection", "/service-offerings/leak-detection"),
		("Contact Wade's", "/contact"),
	],
	"how-to-avoid-common-holiday-plumbing-disasters": [
		("Drain cleaning", "/service-offerings/drain-cleaning"),
		("Toilet repair", "/service-offerings/toilet-repair"),
	],
	"how-to-locate-trustworthy-plumbing-services-nearby": [
		("Browse all services", "/services"),
		("Contact Wade's", "/contact"),
	],
	"plumbing-maintenance-and-repairs-in-santa-cruz-county-ca": [
		(
			"Commercial plumbing maintenance",
			"/service-offerings/commercial-plumbing-maintenance",
		),
		("Drain cleaning", "/service-offerings/drain-cleaning"),
		("Leak detection", "/service-offerings/leak-detection"),
	],
	"plumbing-terms-every-homeowner-should-know": [
		("Browse all services", "/services"),
		("Expert tips", "/expert-tips"),
	],
	"septic-system-challenges-santa-cruz-fire": [
		(
			"Septic tank inspection",
			"/service-offerings/septic-tank-inspection-and-assessment",
		),
		(
			"Septic tank cleaning and pumping",
			"/service-offerings/septic-tank-cleaning-and-pumping",
		),
	],
	"should-you-call-a-plumber-or-fix-it-yourself": [
		("Browse all services", "/services"),
		("Contact Wade's", "/contact"),
	],
	"the-importance-of-regular-plumbing-maintenance": [
		("Drain cleaning", "/service-offerings/drain-cleaning"),
		("Water heater installation", "/service-offerings/water-heater-installation"),
		("Leak detection", "/service-offerings/leak-detection"),
	],
	"the-ultimate-guide-to-plumbing-maintenance-repairs-and-upgrades": [
		("Drain cleaning", "/service-offerings/drain-cleaning"),
		("Pipe repair", "/service-offerings/pipe-repair-and-replacement"),
		("Water heater installation", "/service-offerings/water-heater-installation"),
	],
}

# Keyword fallbacks for posts without explicit mapping
KEYWORD_SERVICES: list[tuple[re.Pattern[str], list[tuple[str, str]]]] = [
	(
		re.compile(r"septic|leach|drain.?field|pumping", re.I),
		[
			(
				"Septic tank cleaning and pumping",
				"/service-offerings/septic-tank-cleaning-and-pumping",
			),
			(
				"Septic tank maintenance",
				"/service-offerings/septic-tank-maintenance-and-care",
			),
		],
	),
	(
		re.compile(r"hydro|jetting|clog|drain", re.I),
		[
			("Drain cleaning", "/service-offerings/drain-cleaning"),
			("Hydro jetting", "/service-offerings/hydro-jetting"),
		],
	),
	(
		re.compile(r"leak|pipe|frozen", re.I),
		[
			("Leak detection", "/service-offerings/leak-detection"),
			("Pipe repair", "/service-offerings/pipe-repair-and-replacement"),
		],
	),
	(
		re.compile(r"water.?heater|tankless", re.I),
		[
			("Water heater installation", "/service-offerings/water-heater-installation"),
		],
	),
	(
		re.compile(r"toilet", re.I),
		[("Toilet repair", "/service-offerings/toilet-repair")],
	),
	(
		re.compile(r"commercial", re.I),
		[
			(
				"Commercial plumbing maintenance",
				"/service-offerings/commercial-plumbing-maintenance",
			),
		],
	),
]

SERVICE_TIP_LINKS: dict[str, list[tuple[str, str]]] = {
	"septic-tank-cleaning-and-pumping": [
		(
			"How to maintain your septic tank",
			"/how-to-maintain-your-septic-tank-for-long-term-performance",
		),
		(
			"Septic pumping costs in Santa Cruz County",
			"/understanding-the-cost-of-septic-pumping-in-santa-cruz-county",
		),
	],
	"hydro-jetting": [
		("Benefits of hydro jetting", "/the-benefits-of-hydro-jetting"),
		("Slow drain solutions", "/slow-drains-solutions-santa-cruz"),
	],
	"drain-cleaning": [
		("Slow drain solutions", "/slow-drains-solutions-santa-cruz"),
		(
			"How to clear a clogged drain",
			"/how-to-properly-clear-a-clogged-drain-a-step-by-step-guide",
		),
	],
	"leak-detection": [
		("6 signs of a hidden water leak", "/6-signs-you-have-a-hidden-water-leak"),
	],
	"toilet-repair": [
		("Santa Cruz toilet running solutions", "/santa-cruz-toilet-running-solutions"),
		(
			"How to choose the right toilet",
			"/5-types-of-toilets-how-to-choose-the-right-one-for-your-home",
		),
	],
	"water-heater-installation": [
		(
			"Repair or replace your water heater?",
			"/should-you-repair-or-replace-your-water-heater",
		),
	],
	"alternative-septic-system-installation": [
		(
			"Engineered septic systems explained",
			"/what-you-need-to-know-about-engineered-septic-systems",
		),
	],
	"septic-system-installation": [
		(
			"Homeowner guide to new septic systems",
			"/a-homeowners-guide-to-new-septic-systems-in-santa-cruz-county",
		),
	],
	"septic-tank-leach-field-repair-and-replacement": [
		("Septic leach field repairs", "/septic-leach-field-repairs-santa-cruz"),
		(
			"Signs your drain field needs repair",
			"/signs-your-drain-field-needs-professional-repair",
		),
	],
	"trenchless-sewer-line-replacement": [
		("Sewer line repair essentials", "/sewer-line-repair-essentials-santa-cruz"),
	],
	"commercial-drain-cleaning": [
		(
			"How to handle a clogged drain or sewer line",
			"/how-to-handle-a-clogged-drain-or-sewer-line",
		),
		("Benefits of hydro jetting", "/the-benefits-of-hydro-jetting"),
	],
	"commercial-plumbing-maintenance": [
		(
			"Regular plumbing maintenance",
			"/the-importance-of-regular-plumbing-maintenance",
		),
		(
			"When to call a professional plumber",
			"/5-signs-you-need-to-call-a-professional-plumber",
		),
	],
	"commercial-septic-services": [
		(
			"Complete septic maintenance guide",
			"/the-complete-guide-to-septic-system-maintenance",
		),
		(
			"Septic pumping costs in Santa Cruz County",
			"/understanding-the-cost-of-septic-pumping-in-santa-cruz-county",
		),
	],
	"grease-trap-cleaning": [
		(
			"How to handle a clogged drain or sewer line",
			"/how-to-handle-a-clogged-drain-or-sewer-line",
		),
	],
	"grease-trap-installation": [
		(
			"How to handle a clogged drain or sewer line",
			"/how-to-handle-a-clogged-drain-or-sewer-line",
		),
	],
	"drain-line-inspection": [
		(
			"How to handle a clogged drain or sewer line",
			"/how-to-handle-a-clogged-drain-or-sewer-line",
		),
		("Slow drain solutions", "/slow-drains-solutions-santa-cruz"),
	],
	"septic-tank-design-and-engineering": [
		(
			"Engineered septic systems explained",
			"/what-you-need-to-know-about-engineered-septic-systems",
		),
		(
			"Homeowner guide to new septic systems",
			"/a-homeowners-guide-to-new-septic-systems-in-santa-cruz-county",
		),
	],
	"septic-tank-maintenance-and-care": [
		(
			"How to maintain your septic tank",
			"/how-to-maintain-your-septic-tank-for-long-term-performance",
		),
		(
			"Proper septic tank care guide",
			"/proper-care-and-maintenance-of-your-septic-tank-a-comprehensive-guide",
		),
	],
	"septic-tank-system-compliance-and-permitting": [
		(
			"Homeowner guide to new septic systems",
			"/a-homeowners-guide-to-new-septic-systems-in-santa-cruz-county",
		),
	],
	"septic-tank-system-upgrades": [
		(
			"Engineered septic systems explained",
			"/what-you-need-to-know-about-engineered-septic-systems",
		),
		(
			"Complete septic maintenance guide",
			"/the-complete-guide-to-septic-system-maintenance",
		),
	],
	"septic-tank-troubleshooting-and-diagnostic-services": [
		(
			"Septic warning signs",
			"/why-you-should-never-ignore-septic-system-warning-signs",
		),
		("Septic trouble signs", "/septic-trouble-signs-santa-cruz"),
	],
}

CITY_NOTES: dict[str, str] = {
	"Aptos": "coastal neighborhoods, older sewer laterals, and hillside septic lots",
	"Watsonville": "agricultural-adjacent properties, hard water, and mixed city/county systems",
	"Felton": "San Lorenzo Valley soils, tree-root pressure on lines, and private septic systems",
	"Scotts Valley": "newer subdivisions alongside older hillside homes with septic or lateral needs",
	"Capitola": "compact coastal lots, older plumbing, and busy vacation-rental turnovers",
	"Soquel": "creek-adjacent parcels, mature trees, and a mix of sewer and septic properties",
	"Live Oak": "dense residential streets, aging laterals, and frequent drain-cleaning calls",
	"Boulder Creek": "mountain roads, steep lots, and septic systems that need seasonal attention",
	"Ben Lomond": "valley and hillside properties with roots, rain, and septic maintenance needs",
	"Santa Cruz": "city and unincorporated neighborhoods with both sewer laterals and septic systems",
	"Corralitos": "rural acreage, private wells, and conventional or engineered septic systems",
	"Freedom": "residential pockets near Watsonville with mixed plumbing ages and drain issues",
	"Interlaken": "rural residential roads and septic systems that need reliable pumping schedules",
	"La Selva Beach": "coastal bluff homes, sandy soils, and moisture-sensitive drainfields",
	"Rio Del Mar": "beach-area homes with older laterals and vacation-home plumbing demand",
	"Pasatiempo": "established hillside homes with premium fixtures and private infrastructure",
	"Mount Hermon": "wooded lots, seasonal occupancy changes, and septic systems under trees",
	"Zayante": "remote mountain parcels where septic reliability and access matter",
	"Lompico": "narrow roads, forested lots, and septic systems exposed to heavy rainfall",
	"Brookdale": "San Lorenzo Valley homes with mature landscaping and root-prone lines",
	"Bonny Doon": "rural mountain properties, private wells, and engineered septic challenges",
	"Day Valley": "rural acreage east of Aptos with larger septic systems and long laterals",
	"Amesti": "south-county residential areas with septic maintenance and drain service needs",
	"Las Lomas": "rural south-county homes relying on septic tanks and private wells",
	"Paradise Park": "river-adjacent homes where backups and moisture around systems matter",
	"Twin Lakes": "coastal residential streets with older plumbing and high occupancy turnover",
	"Aptos Hills Larkin Valley": "rural Aptos hills parcels with septic systems and steep access",
}


def split_doc(text: str) -> tuple[dict, str] | None:
	if not text.startswith("---"):
		return None
	end = text.find("\n---", 3)
	if end < 0:
		return None
	data = yaml.safe_load(text[3:end]) or {}
	if not isinstance(data, dict):
		return None
	return data, text[end + 4 :].lstrip("\n")


def write_doc(path: Path, data: dict, body: str) -> None:
	dumped = yaml.safe_dump(
		data,
		sort_keys=False,
		allow_unicode=True,
		default_flow_style=False,
		width=1000,
	)
	path.write_text(f"---\n{dumped}---\n\n{body.lstrip()}", encoding="utf-8")


def clean_toc_noise(text: str) -> str:
	text = re.sub(
		r"In This Guide\s*\d*\s*min read\d*\.?",
		"",
		text,
		flags=re.I,
	)
	text = re.sub(
		r"Estimated reading time:\s*\d+\s*minutes?\.?",
		"",
		text,
		flags=re.I,
	)
	text = re.sub(
		r"In This Guide\s*\d*\.?",
		"",
		text,
		flags=re.I,
	)
	# Collapse mashed TOC enumerations left in descriptions
	text = re.sub(
		r"(?:Did You Know\?|Quick Answer for Santa Cruz Homeowners)\d*\.?",
		"",
		text,
		flags=re.I,
	)
	text = re.sub(r"\d+\.(?=[A-Z])", ". ", text)
	text = re.sub(r"\s{2,}", " ", text).strip()
	return text


REAL_TEL = "tel:+18312254344"


def clean_cta_artifacts(body: str) -> str:
	"""Normalize mashed WP CTAs, fake phone numbers, and broken quote links."""
	# Mashed "Get a Free Quote/Upgrade ...testimonials..." into one link
	body = re.sub(
		r"\[Get a Free[^\]]{8,}\]\((?:/contact/?|/contact-us/?)\)",
		"[Get a free quote](/contact)",
		body,
		flags=re.I,
	)
	body = re.sub(
		r"\[Get Upgrade[^\]]*\]\((?:/contact/?|/contact-us/?)\)",
		"[Get a free quote](/contact)",
		body,
		flags=re.I,
	)
	# Broken unclosed Get a Free Quote markdown
	body = re.sub(
		r"\[Get a Free Quote\s*(?=\n|$)",
		"[Get a free quote](/contact)\n",
		body,
		flags=re.I,
	)
	# Call Us NowGet a Free Quote (no markdown)
	body = re.sub(
		r"Call Us Now\s*Get a Free Quote",
		"[Call us](tel:+18312254344) · [Get a free quote](/contact)",
		body,
		flags=re.I,
	)
	body = re.sub(
		r"Call Us\s*Get a Free Quote",
		"[Call us](tel:+18312254344) · [Get a free quote](/contact)",
		body,
		flags=re.I,
	)
	# Normalize all tel: links to the public business number
	body = re.sub(r"\]\(tel:[^)]+\)", f"]({REAL_TEL})", body, flags=re.I)
	# Trailing broken HTML crumbs
	body = re.sub(r"\s*</\s*", " ", body)
	body = re.sub(r"\s*/>\s*", " ", body)
	return body


def strip_body_toc(body: str) -> str:
	body = re.sub(
		r"^In This Guide\d*.*$",
		"",
		body,
		flags=re.I | re.M,
	)
	body = re.sub(
		r"^\*\*?Estimated reading time:\*\*?\s*\d+\s*minutes?\.?\s*$",
		"",
		body,
		flags=re.I | re.M,
	)
	body = re.sub(
		r"^## In This Guide\s*$",
		"",
		body,
		flags=re.I | re.M,
	)
	body = re.sub(r"Get a Free QuoteExplore Our Services", "", body)
	body = re.sub(r"<h2 class=\"wp-block-heading\"[^>]*>?", "## ", body)
	body = re.sub(r"</h2>", "", body)
	body = re.sub(r"<[^>]+>", "", body)
	body = re.sub(r"^(\d+)\\\.\s*", r"\1. ", body, flags=re.M)
	body = re.sub(r"^  \* ", "- ", body, flags=re.M)
	body = clean_cta_artifacts(body)
	body = re.sub(r"\n{3,}", "\n\n", body)
	return body.strip() + "\n"


def description_from_body(body: str, fallback: str, limit: int = 155) -> str:
	for block in re.split(r"\n\s*\n", body):
		line = block.strip()
		if not line or line.startswith("#") or line.startswith("!") or line.startswith("-"):
			continue
		line = re.sub(r"[*_`]", "", line)
		line = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", line)
		line = re.sub(r"\s+", " ", line).strip()
		if len(line) < 40:
			continue
		if len(line) <= limit:
			return line
		cut = line[: limit - 1].rsplit(" ", 1)[0]
		return cut.rstrip(".,;:") + "."
	cleaned = clean_toc_noise(fallback)
	if cleaned and not cleaned.endswith("…") and "In This Guide" not in cleaned:
		return cleaned[:limit]
	return "Licensed plumbing and septic guidance from Wade's Plumbing & Septic in Santa Cruz County."


def remap_lp_links(body: str) -> str:
	def repl(match: re.Match[str]) -> str:
		href = match.group(1)
		target = LP_REMAP.get(href) or LP_REMAP.get(href.rstrip("/"))
		if not target and href.startswith("/lp/"):
			slug = href[len("/lp/") :].strip("/")
			target = f"/{slug}"
		return f"]({target or href})"

	return re.sub(r"\]\((/lp/[^)]+)\)", repl, body)


def ensure_related_block(body: str, heading: str, links: list[tuple[str, str]]) -> str:
	if not links:
		return body
	missing = [(label, href) for label, href in links if href not in body]
	if not missing:
		return body
	if heading in body:
		# Append only missing bullets under an existing related section is messy;
		# skip if the section heading already exists.
		return body

	block = heading + "\n\n" + "\n".join(f"- [{label}]({href})" for label, href in missing)
	return body.rstrip() + "\n\n" + block + "\n"


def services_for_post(slug: str, title: str, body: str) -> list[tuple[str, str]]:
	if slug in TIP_SERVICE_LINKS:
		return TIP_SERVICE_LINKS[slug]
	hay = f"{title}\n{body[:1500]}"
	for pattern, links in KEYWORD_SERVICES:
		if pattern.search(hay):
			return links
	return [
		("Browse all services", "/services"),
		("Contact Wade's", "/contact"),
	]


AREA_SERVICE_LINKS: list[tuple[str, str]] = [
	("Leak detection", "/service-offerings/leak-detection"),
	("Drain cleaning", "/service-offerings/drain-cleaning"),
	("Hydro jetting", "/service-offerings/hydro-jetting"),
	("Water heater installation", "/service-offerings/water-heater-installation"),
	(
		"Septic tank cleaning and pumping",
		"/service-offerings/septic-tank-cleaning-and-pumping",
	),
	(
		"Septic tank inspection",
		"/service-offerings/septic-tank-inspection-and-assessment",
	),
]

AREA_TIP_LINKS: list[tuple[str, str]] = [
	("Expert tips", "/expert-tips"),
	("Septic pumping essentials", "/septic-pumping-essentials-santa-cruz"),
	("Slow drain solutions", "/slow-drains-solutions-santa-cruz"),
]


def city_label_from_path(path: Path, data: dict) -> str:
	raw = str(data.get("eyebrow") or path.stem.split("-ca-")[0])
	raw = raw.replace(", CA", "").replace(", ca", "").strip()
	raw = raw.replace("-", " ")
	return " ".join(
		w.upper() if w.lower() == "ca" else w.capitalize() for w in raw.split()
	)


def enrich_existing_service_area(path: Path, data: dict, body: str) -> None:
	"""Add service/tip links to longer area pages without wiping local copy."""
	replacements = [
		(
			r"(?i)\bLeak detection and pipe repair\b",
			"[Leak detection](/service-offerings/leak-detection) and [pipe repair](/service-offerings/pipe-repair-and-replacement)",
		),
		(
			r"(?i)\bDrain cleaning, hydro-jetting, and camera inspections\b",
			"[Drain cleaning](/service-offerings/drain-cleaning), [hydro-jetting](/service-offerings/hydro-jetting), and [camera inspections](/service-offerings/sewer-camera-inspection)",
		),
		(
			r"(?i)\bWater heater and tankless water heater work\b",
			"[Water heater](/service-offerings/water-heater-installation) and [tankless water heater](/service-offerings/tankless-water-heater-installation) work",
		),
		(
			r"(?i)\bSeptic tank pumping and cleaning\b",
			"[Septic tank pumping and cleaning](/service-offerings/septic-tank-cleaning-and-pumping)",
		),
		(
			r"(?i)\bLeach field and drainfield evaluation\b",
			"[Leach field and drainfield evaluation](/service-offerings/septic-tank-leach-field-repair-and-replacement)",
		),
		(
			r"(?i)\bConventional and engineered septic repairs or replacements\b",
			"Conventional and [engineered septic](/service-offerings/alternative-septic-system-installation) repairs or replacements",
		),
	]
	for pattern, repl in replacements:
		body = re.sub(pattern, repl, body, count=1)

	body = ensure_related_block(body, "## Related services", AREA_SERVICE_LINKS)
	body = ensure_related_block(body, "## Related expert tips", AREA_TIP_LINKS)

	desc = str(data.get("description") or "")
	if len(desc) < 80 or desc.endswith("…") or desc.endswith("..."):
		city = city_label_from_path(path, data)
		data["description"] = (
			f"Licensed plumbing and septic service in {city}, CA from Wade's Plumbing & Septic — "
			f"drain cleaning, leak repair, water heaters, septic pumping, and inspections."
		)
	write_doc(path, data, body)


def expand_service_area(path: Path) -> None:
	parsed = split_doc(path.read_text(encoding="utf-8"))
	if not parsed:
		return
	data, body = parsed
	words = len(re.findall(r"\w+", body))
	if words >= 100:
		if "/service-offerings/" in body:
			return
		enrich_existing_service_area(path, data, body)
		return

	city = city_label_from_path(path, data)
	note = CITY_NOTES.get(
		city,
		"local homes, older plumbing, and septic systems that need reliable care",
	)

	data["title"] = f"{city}, CA Plumbing & Septic Services"
	data["description"] = (
		f"Licensed plumbing and septic service in {city}, CA from Wade's Plumbing & Septic — "
		f"drain cleaning, leak repair, water heaters, septic pumping, and inspections."
	)
	data["eyebrow"] = city
	data.setdefault("image", "/images/locations/santa-cruz-redwoods.webp")
	data.setdefault(
		"imageAlt",
		f"Plumbing and septic service coverage in {city}, California",
	)

	body = f"""Wade's Plumbing & Septic provides licensed plumbing and septic service for homeowners and property managers in {city}, Santa Cruz County, California. Properties here often involve {note}.

## Plumbing services in {city}

Local homes and businesses call Wade's for:

- [Leak detection](/service-offerings/leak-detection) and [pipe repair](/service-offerings/pipe-repair-and-replacement)
- [Drain cleaning](/service-offerings/drain-cleaning), [hydro-jetting](/service-offerings/hydro-jetting), and [camera inspections](/service-offerings/sewer-camera-inspection)
- [Water heater](/service-offerings/water-heater-installation) and [tankless water heater](/service-offerings/tankless-water-heater-installation) work
- [Toilet](/service-offerings/toilet-repair), shower, and fixture repairs
- Priority repair scheduling when available

## Septic services in {city}

Depending on the property and system type, we support:

- [Septic tank pumping and cleaning](/service-offerings/septic-tank-cleaning-and-pumping)
- [Inspections](/service-offerings/septic-tank-inspection-and-assessment), certifications, and troubleshooting
- Filter cleaning, risers, alarms, and [maintenance](/service-offerings/septic-tank-maintenance-and-care)
- [Leach field and drainfield evaluation](/service-offerings/septic-tank-leach-field-repair-and-replacement)
- Conventional and [engineered septic](/service-offerings/alternative-septic-system-installation) repairs or replacements

## Why local experience matters

Santa Cruz County properties can involve older piping, steep lots, coastal or hillside soils, private wells, and strict septic permitting. We diagnose first, explain options clearly, and complete work without sales pressure.

## Nearby coverage

Explore all communities on our [service areas page](/service-areas), or call [831.225.4344](tel:+18312254344) for scheduling in {city}.

Related resources: [expert tips](/expert-tips), [septic pumping essentials](/septic-pumping-essentials-santa-cruz), and [slow drain solutions](/slow-drains-solutions-santa-cruz).
"""
	write_doc(path, data, body)


def sanitize_big_guide(path: Path) -> None:
	parsed = split_doc(path.read_text(encoding="utf-8"))
	if not parsed:
		return
	data, body = parsed
	# Cut citation spam / smashed URL dump
	cut = re.search(r"\n##?\s*Citations\b", body, flags=re.I)
	if not cut:
		cut = re.search(r"\nCitations\n", body)
	if cut:
		head = body[: cut.start()].rstrip()
		# Keep FAQ if it appears after citations
		faq = re.search(r"\n## Frequently Asked Questions[\s\S]*$", body, flags=re.I)
		tail = faq.group(0).strip() if faq else ""
		body = head + ("\n\n" + tail if tail else "") + "\n"

	body = strip_body_toc(body)
	body = remap_lp_links(body)
	if "/service-offerings/septic-system-installation" not in body:
		body = ensure_related_block(
			body,
			"## Related services",
			[
				(
					"Septic system installation",
					"/service-offerings/septic-system-installation",
				),
				(
					"Alternative / engineered septic installation",
					"/service-offerings/alternative-septic-system-installation",
				),
				(
					"Septic design and engineering",
					"/service-offerings/septic-tank-design-and-engineering",
				),
			],
		)
	data["description"] = (
		"Homeowner guide to new and advanced septic systems in Santa Cruz County — "
		"permits, system types, maintenance, and when to call a licensed pro."
	)
	write_doc(path, data, body)


def process_markdown(path: Path) -> None:
	text = path.read_text(encoding="utf-8")
	parsed = split_doc(text)
	if not parsed:
		return
	data, body = parsed
	original = (data.copy(), body)

	body = strip_body_toc(body)
	body = remap_lp_links(body)
	body = body.replace("/contact-us", "/contact")

	desc = str(data.get("description") or "")
	if (
		"In This Guide" in desc
		or "min read" in desc.lower()
		or desc.endswith("…")
		or desc.endswith("...")
		or "Did You Know" in desc
	):
		data["description"] = description_from_body(body, desc)

	rel = path.relative_to(CONTENT).as_posix()
	if rel.startswith("posts/"):
		slug = path.stem
		links = services_for_post(slug, str(data.get("title") or slug), body)
		body = ensure_related_block(body, "## Related services", links)

	if rel.startswith("services/"):
		slug = path.stem
		if slug in SERVICE_TIP_LINKS:
			body = ensure_related_block(
				body,
				"## Related expert tips",
				SERVICE_TIP_LINKS[slug],
			)
		elif "Related expert tips" not in body:
			category = str(data.get("category") or "")
			if category == "Septic":
				body = ensure_related_block(
					body,
					"## Related expert tips",
					[
						(
							"Complete septic maintenance guide",
							"/the-complete-guide-to-septic-system-maintenance",
						),
						(
							"Septic warning signs",
							"/why-you-should-never-ignore-septic-system-warning-signs",
						),
					],
				)
			elif category in {"Plumbing", "Commercial"}:
				body = ensure_related_block(
					body,
					"## Related expert tips",
					[
						(
							"Regular plumbing maintenance",
							"/the-importance-of-regular-plumbing-maintenance",
						),
						(
							"When to call a professional plumber",
							"/5-signs-you-need-to-call-a-professional-plumber",
						),
					],
				)

	if (data, body) != original:
		write_doc(path, data, body)


def consolidate_duplicates() -> list[tuple[str, str]]:
	"""Delete weaker duplicates; return redirect pairs (from_slug, to_slug)."""
	redirects: list[tuple[str, str]] = []
	posts = CONTENT / "posts"

	# Keep longer seasonal guide
	weak = posts / "seasonal-septic-maintenance-santa-cruz.md"
	strong = posts / "septic-system-seasonal-maintenance-santa-cruz.md"
	if weak.exists() and strong.exists():
		weak.unlink()
		redirects.append(
			("seasonal-septic-maintenance-santa-cruz", "septic-system-seasonal-maintenance-santa-cruz")
		)

	# Keep canonical components slug; drop -2 after merging unique outbound links note
	dup = posts / "septic-system-components-santa-cruz-2.md"
	main = posts / "septic-system-components-santa-cruz.md"
	if dup.exists() and main.exists():
		dup.unlink()
		redirects.append(
			("septic-system-components-santa-cruz-2", "septic-system-components-santa-cruz")
		)

	# Local failure-sign cannibalization → keep trouble-signs (more links), drop urgent
	urgent = posts / "urgent-septic-failure-signs-santa-cruz.md"
	trouble = posts / "septic-trouble-signs-santa-cruz.md"
	if urgent.exists() and trouble.exists():
		urgent.unlink()
		redirects.append(
			("urgent-septic-failure-signs-santa-cruz", "septic-trouble-signs-santa-cruz")
		)

	return redirects


def patch_next_redirects(pairs: list[tuple[str, str]]) -> None:
	if not pairs:
		return
	config = ROOT / "next.config.ts"
	text = config.read_text(encoding="utf-8")
	entries: list[str] = []
	for src, dest in pairs:
		for source in (f"/{src}", f"/expert-tips/{src}"):
			destination = f"/{dest}"
			if f'source: "{source}"' in text:
				continue
			entries.append(
				"\t\t\t{\n"
				f'\t\t\t\tsource: "{source}",\n'
				f'\t\t\t\tdestination: "{destination}",\n'
				"\t\t\t\tpermanent: true,\n"
				"\t\t\t},"
			)
	if not entries:
		return
	needle = '\t\t\t{\n\t\t\t\tsource: "/lp/:slug",'
	if needle not in text:
		raise SystemExit("Could not find /lp redirect anchor in next.config.ts")
	text = text.replace(needle, "\n".join(entries) + "\n" + needle, 1)
	config.write_text(text, encoding="utf-8")


def main() -> None:
	# 1) Expand thin service areas / enrich longer ones missing service links
	for path in sorted((CONTENT / "pages" / "service-area").glob("*.md")):
		expand_service_area(path)

	# 2) Sanitize big guide before generic pass
	big = CONTENT / "posts" / "a-homeowners-guide-to-new-septic-systems-in-santa-cruz-county.md"
	if big.exists():
		sanitize_big_guide(big)

	# 3) Fix known mashed source dumps
	pipe_leak = CONTENT / "posts" / "pipe-leak-solutions-santa-cruz-septic.md"
	if pipe_leak.exists():
		text = pipe_leak.read_text(encoding="utf-8")
		text = re.sub(
			r"- \[Google News Article on Septic Systems[\s\S]*?\]\(https://news\.google\.com[^)]+\)\s*",
			"- [Service areas](/service-areas)\n",
			text,
			count=1,
		)
		pipe_leak.write_text(text, encoding="utf-8")

	# 4) Generic cleanup + interlinking
	for path in sorted(CONTENT.rglob("*.md")):
		process_markdown(path)

	# Keep curated big-guide description after generic pass
	if big.exists():
		parsed = split_doc(big.read_text(encoding="utf-8"))
		if parsed:
			data, body = parsed
			data["description"] = (
				"Homeowner guide to new and advanced septic systems in Santa Cruz County — "
				"permits, system types, maintenance, and when to call a licensed pro."
			)
			write_doc(big, data, body)

	# 5) Consolidate duplicates + redirects
	redirects = consolidate_duplicates()
	patch_next_redirects(redirects)

	print(f"Updated content under {CONTENT}")
	print(f"Duplicate redirects added: {len(redirects)}")
	for src, dest in redirects:
		print(f"  /{src} -> /{dest}")


if __name__ == "__main__":
	main()
