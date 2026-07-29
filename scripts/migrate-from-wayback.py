#!/usr/bin/env python3
"""Migrate missing Wade's pages from Wayback Machine into local Markdown."""

from __future__ import annotations

import html as html_lib
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from bs4 import BeautifulSoup
import html2text

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
MISSING = Path("/tmp/wades-missing.json")
UA = "Mozilla/5.0 (compatible; WadesMigrationBot/1.0; +https://wadesplumbingandseptic.com)"

CITY_META = {
	"amesti": ("Amesti", "Santa Cruz County"),
	"aptos": ("Aptos", "Santa Cruz County"),
	"aptos-hills-larkin-valley": ("Aptos Hills-Larkin Valley", "Santa Cruz County"),
	"ben-lomond": ("Ben Lomond", "Santa Cruz County"),
	"bonny-doon": ("Bonny Doon", "Santa Cruz County"),
	"boulder-creek": ("Boulder Creek", "Santa Cruz County"),
	"brookdale": ("Brookdale", "Santa Cruz County"),
	"capitola": ("Capitola", "Santa Cruz County"),
	"corralitos": ("Corralitos", "Santa Cruz County"),
	"davenport": ("Davenport", "Santa Cruz County"),
	"day-valley": ("Day Valley", "Santa Cruz County"),
	"felton": ("Felton", "Santa Cruz County"),
	"freedom": ("Freedom", "Santa Cruz County"),
	"interlaken": ("Interlaken", "Santa Cruz County"),
	"la-selva-beach": ("La Selva Beach", "Santa Cruz County"),
	"las-lomas": ("Las Lomas", "Santa Cruz County"),
	"live-oak": ("Live Oak", "Santa Cruz County"),
	"lompico": ("Lompico", "Santa Cruz County"),
	"los-gatos": ("Los Gatos", "Santa Clara County"),
	"mount-hermon": ("Mount Hermon", "Santa Cruz County"),
	"paradise-park": ("Paradise Park", "Santa Cruz County"),
	"pasatiempo": ("Pasatiempo", "Santa Cruz County"),
	"rio-del-mar": ("Rio Del Mar", "Santa Cruz County"),
	"santa-cruz": ("Santa Cruz", "Santa Cruz County"),
	"saratoga": ("Saratoga", "Santa Clara County"),
	"scotts-valley": ("Scotts Valley", "Santa Cruz County"),
	"soquel": ("Soquel", "Santa Cruz County"),
	"twin-lakes": ("Twin Lakes", "Santa Cruz County"),
	"watsonville": ("Watsonville", "Santa Cruz County"),
	"zayante": ("Zayante", "Santa Cruz County"),
}

POST_CATEGORY_HINTS = [
	(r"septic", "Septic Maintenance"),
	(r"toilet|drain|clog|plumber|pipe|water heater|hydro|faucet|leak", "Plumbing Tips"),
	(r"diy|install", "DIY Projects"),
	(r"santa cruz|geography|flood|fire", "Santa Cruz Plumbing"),
]


def fetch(url: str, timeout: int = 60) -> str:
	req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html,application/xml"})
	with urllib.request.urlopen(req, timeout=timeout) as res:
		return res.read().decode("utf-8", errors="ignore")


def latest_snapshot(path: str) -> str | None:
	query = urllib.parse.urlencode(
		{
			"url": f"wadesplumbingandseptic.com{path}",
			"output": "json",
			"fl": "timestamp",
			"filter": "statuscode:200",
			"limit": "1",
			"from": "20240101",
		}
	)
	try:
		data = json.loads(fetch(f"https://web.archive.org/cdx/search/cdx?{query}", timeout=45))
	except Exception as exc:  # noqa: BLE001
		print(f"  CDX fail {path}: {exc}")
		return None
	if len(data) < 2:
		# try without trailing slash variants already handled by path
		return None
	return data[1][0]


def meta_content(soup: BeautifulSoup, *keys: str) -> str | None:
	for key in keys:
		tag = soup.find("meta", property=key) or soup.find("meta", attrs={"name": key})
		if tag and tag.get("content"):
			return html_lib.unescape(tag["content"]).strip()
	return None


def html_to_markdown(fragment: str) -> str:
	converter = html2text.HTML2Text()
	converter.body_width = 0
	converter.ignore_images = True
	converter.ignore_emphasis = False
	md = converter.handle(fragment)
	md = re.sub(r"https://web\.archive\.org/web/\d+(?:id_)?/", "", md)
	md = re.sub(r"https?://(?:www\.)?wadesplumbingandseptic\.com", "", md)
	md = re.sub(r"\n{3,}", "\n\n", md)
	# Drop contact forms / boilerplate noise
	junk_patterns = [
		r"### Send a message[\s\S]*$",
		r"Leave blank[\s\S]*$",
		r"By submitting this form[\s\S]*$",
		r"## Table of Contents[\s\S]*?(?=## )",
		r"\* \* \*\n+",
	]
	for pattern in junk_patterns:
		md = re.sub(pattern, "\n\n", md, flags=re.I)
	return md.strip() + "\n"


def extract_article(html: str) -> tuple[str, str, str | None, str]:
	soup = BeautifulSoup(html, "lxml")
	for tag in soup(["script", "style", "noscript", "svg", "iframe", "form"]):
		tag.decompose()

	title = meta_content(soup, "og:title") or (soup.title.get_text(strip=True) if soup.title else "")
	title = re.sub(r"\s*\|\s*Wade.*$", "", title, flags=re.I).strip()
	title = re.sub(r"\s*-\s*Wade.*$", "", title, flags=re.I).strip()
	description = meta_content(soup, "og:description", "description") or ""
	published = meta_content(soup, "article:published_time", "article:modified_time")
	date = published[:10] if published else None

	content_el = None
	for selector in (
		"article .entry-content",
		".wp-block-post-content",
		".entry-content",
		"article",
		"main",
	):
		el = soup.select_one(selector)
		if el and len(el.get_text(strip=True)) > 250:
			content_el = el
			break

	if content_el is None:
		return title, description, date, ""

	for junk in content_el.select(
		"nav, aside, .sharedaddy, .wp-block-yoast-seo-breadcrumbs, .related-posts, .toc, #toc_container"
	):
		junk.decompose()

	return title, description, date, html_to_markdown(str(content_el))


def write_markdown(path: Path, frontmatter: dict, body: str) -> None:
	path.parent.mkdir(parents=True, exist_ok=True)
	lines = ["---"]
	for key, value in frontmatter.items():
		if value is None:
			continue
		if isinstance(value, list):
			lines.append(f"{key}:")
			for item in value:
				lines.append(f"  - {item}")
		elif isinstance(value, bool):
			lines.append(f"{key}: {'true' if value else 'false'}")
		else:
			text = str(value).replace('"', '\\"')
			if any(ch in text for ch in [":", "#", '"', "\n"]) or text.startswith("'"):
				lines.append(f'{key}: "{text}"')
			else:
				lines.append(f"{key}: {text}")
	lines.append("---")
	lines.append("")
	lines.append(body.rstrip())
	lines.append("")
	path.write_text("\n".join(lines), encoding="utf-8")
	print(f"  wrote {path.relative_to(ROOT)}")


def guess_category(slug: str, title: str) -> str:
	hay = f"{slug} {title}".lower()
	for pattern, category in POST_CATEGORY_HINTS:
		if re.search(pattern, hay):
			return category
	return "Expert Tips"


def migrate_post(slug: str) -> bool:
	out = CONTENT / "posts" / f"{slug}.md"
	if out.exists():
		print(f"  skip existing {slug}")
		return True

	path = f"/{slug}/"
	ts = latest_snapshot(path) or latest_snapshot(f"/{slug}")
	if not ts:
		print(f"  no snapshot for {slug}")
		return False

	url = f"https://web.archive.org/web/{ts}id_/https://wadesplumbingandseptic.com{path}"
	try:
		html = fetch(url)
	except Exception as exc:  # noqa: BLE001
		print(f"  fetch fail {slug}: {exc}")
		return False

	title, description, date, body = extract_article(html)
	if len(body) < 200:
		print(f"  thin content for {slug} ({len(body)} chars)")
		return False

	# Prefer first meaningful heading-stripped body
	body = re.sub(rf"^#\s+{re.escape(title)}\s*\n+", "", body, flags=re.I)
	write_markdown(
		out,
		{
			"title": title or slug.replace("-", " ").title(),
			"description": description
			or f"Expert plumbing and septic guidance from Wade's Plumbing & Septic about {title}.",
			"category": guess_category(slug, title),
			"date": date or "2025-05-11",
			"image": "/images/work/precision-valve-installation.webp",
			"imageAlt": title or "Wade's Plumbing & Septic expert tip",
			"tags": ["santa cruz county", "homeowner tips"],
		},
		body,
	)
	return True


def city_from_area_slug(slug: str) -> tuple[str, str]:
	base = slug.replace("-ca-plumbing-septic-services", "")
	if base in CITY_META:
		return CITY_META[base]
	name = base.replace("-", " ").title()
	return name, "Santa Cruz County"


def service_area_body(city: str, county: str, archive_body: str) -> str:
	intro = ""
	# Keep a short useful excerpt from archive if present
	clean = re.sub(r"Need help in this area\?[\s\S]*$", "", archive_body, flags=re.I).strip()
	clean = re.sub(r"## Talk to a local expert[\s\S]*$", "", clean, flags=re.I).strip()
	if clean and len(clean) > 80:
		intro = clean + "\n\n"
	else:
		intro = (
			f"Wade's Plumbing & Septic provides licensed plumbing and septic service for homeowners "
			f"and property managers in {city}, {county}, California.\n\n"
		)

	return f"""{intro}## Plumbing services in {city}

Local homes and businesses call Wade's for:

- Leak detection and pipe repair
- Drain cleaning, hydro-jetting, and camera inspections
- Water heater and tankless water heater work
- Fixture, toilet, and shower repairs
- Emergency plumbing response when available

## Septic services in {city}

Depending on the property and system type, we support:

- Septic tank pumping and cleaning
- Inspections, certifications, and troubleshooting
- Filter cleaning, risers, alarms, and maintenance
- Leach field and drainfield evaluation
- Conventional and engineered septic repairs or replacements

## Why local experience matters

{county} properties can involve older piping, steep lots, coastal or hillside soils, private wells, and strict septic permitting. We diagnose first, explain options clearly, and complete work without sales pressure.

## Nearby coverage

Explore all communities on our [service areas page](/service-areas), or call [831.225.4344](tel:+18312254344) for scheduling in {city}.

Related resources: [Santa Cruz plumbing](/santa-cruz), [septic solutions](/septic-solutions), and [expert tips](/expert-tips).
"""


def migrate_service_area(slug: str) -> bool:
	out = CONTENT / "pages" / "service-area" / f"{slug}.md"
	if out.exists():
		print(f"  skip existing {slug}")
		return True

	city, county = city_from_area_slug(slug)
	path = f"/service-area/{slug}/"
	ts = latest_snapshot(path)
	title = f"{city}, CA Plumbing & Septic Services"
	description = f"Need trusted plumbing and septic service in {city}, CA?"
	archive_body = ""

	if ts:
		url = f"https://web.archive.org/web/{ts}id_/https://wadesplumbingandseptic.com{path}"
		try:
			html = fetch(url)
			t, d, _, body = extract_article(html)
			if t:
				title = t
			if d:
				description = d
			archive_body = body
		except Exception as exc:  # noqa: BLE001
			print(f"  archive fetch fail {slug}: {exc}")

	write_markdown(
		out,
		{
			"title": title,
			"description": description,
			"eyebrow": f"{city}, CA",
			"image": "/images/locations/santa-cruz-redwoods.webp",
			"imageAlt": f"Plumbing and septic service coverage in {city}, California",
			"order": 50,
		},
		service_area_body(city, county, archive_body),
	)
	return True


def migrate_career(slug: str) -> bool:
	out = CONTENT / "pages" / "careers" / f"{slug}.md"
	if out.exists():
		return True
	path = f"/careers/{slug}/"
	ts = latest_snapshot(path)
	if not ts:
		print(f"  no snapshot for career {slug}")
		return False
	url = f"https://web.archive.org/web/{ts}id_/https://wadesplumbingandseptic.com{path}"
	try:
		html = fetch(url)
	except Exception as exc:  # noqa: BLE001
		print(f"  fetch fail career {slug}: {exc}")
		return False
	title, description, _, body = extract_article(html)
	if len(body) < 120:
		# fallback structured page
		nice = slug.replace("-", " ").title()
		body = f"""## Open role: {nice}

Wade's Plumbing & Septic is hiring team members who take pride in honest diagnostics, clean workmanship, and respectful customer communication.

## What we look for

- Reliability and clear communication
- Safety-first habits on every job
- Willingness to learn local codes, equipment, and field standards
- Respect for homeowners and job sites

## How to apply

Visit our [careers page](/careers) or call [831.225.4344](tel:+18312254344) and ask about the {nice} opening.
"""
		title = title or nice
		description = description or f"Join Wade's Plumbing & Septic as a {nice}."
	write_markdown(
		out,
		{
			"title": title,
			"description": description,
			"eyebrow": "Careers",
			"image": "/images/team/byron-working.webp",
			"imageAlt": "Wade's Plumbing & Septic field team at work",
		},
		body,
	)
	return True


def migrate_landing(slug: str) -> bool:
	out = CONTENT / "pages" / f"{slug}.md"
	if out.exists():
		return True
	path = f"/lp/{slug}/"
	ts = latest_snapshot(path) or latest_snapshot(f"/{slug}/")
	if not ts:
		print(f"  no snapshot for lp {slug}")
		return False
	url = f"https://web.archive.org/web/{ts}id_/https://wadesplumbingandseptic.com{path}"
	try:
		html = fetch(url)
	except Exception as exc:  # noqa: BLE001
		print(f"  fetch fail lp {slug}: {exc}")
		return False
	title, description, _, body = extract_article(html)
	if len(body) < 150:
		print(f"  thin lp {slug}")
		return False
	write_markdown(
		out,
		{
			"title": title,
			"description": description,
			"eyebrow": "Santa Cruz County",
			"image": "/images/work/engineered-septic-hero.webp",
			"imageAlt": title,
		},
		body,
	)
	return True


def main() -> None:
	missing = json.loads(MISSING.read_text())
	stats = {"posts": 0, "areas": 0, "careers": 0, "lp": 0, "failed": []}

	print(f"Migrating {len(missing['posts'])} posts...")
	for slug in missing["posts"]:
		ok = migrate_post(slug)
		if ok:
			stats["posts"] += 1
		else:
			stats["failed"].append(f"post:{slug}")
		time.sleep(0.6)

	print(f"Migrating {len(missing['service_areas'])} service areas...")
	for slug in missing["service_areas"]:
		ok = migrate_service_area(slug)
		if ok:
			stats["areas"] += 1
		else:
			stats["failed"].append(f"area:{slug}")
		time.sleep(0.35)

	print(f"Migrating {len(missing['careers'])} careers...")
	for slug in missing["careers"]:
		ok = migrate_career(slug)
		if ok:
			stats["careers"] += 1
		else:
			stats["failed"].append(f"career:{slug}")
		time.sleep(0.5)

	print(f"Migrating {len(missing['landing_pages'])} landing pages...")
	for slug in missing["landing_pages"]:
		ok = migrate_landing(slug)
		if ok:
			stats["lp"] += 1
		else:
			stats["failed"].append(f"lp:{slug}")
		time.sleep(0.5)

	print(json.dumps(stats, indent=2))


if __name__ == "__main__":
	main()
