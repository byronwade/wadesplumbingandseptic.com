#!/usr/bin/env python3
"""Convert WordPress phpMyAdmin CSV exports into Wade's Markdown content files.

Expected CSV files in --input-dir (default: wp-export/):
  posts.csv
  attachments.csv
  postmeta.csv
  terms.csv
  term_taxonomy.csv
  term_relationships.csv
  yoast_indexable.csv

Notes:
  - posts.csv from phpMyAdmin may omit post_name; slugs are recovered from
    Yoast permalinks, then slugified titles as a fallback.
  - Known WordPress slug renames (see next.config.ts redirects) are written
    to the canonical Markdown filenames the site actually serves.
  - Empty WordPress bodies never overwrite an existing non-empty Markdown file.
  - Use --overwrite to replace content/ with published WordPress copy.
  - Use --outdir tmp/wp-markdown-import to dump a full review copy.

Examples:
  python3 scripts/migrate-from-wordpress-csv.py --dry-run --overwrite
  python3 scripts/migrate-from-wordpress-csv.py --overwrite
  python3 scripts/migrate-from-wordpress-csv.py --outdir tmp/wp-markdown-import --status publish
  python3 scripts/migrate-from-wordpress-csv.py --only-missing
"""

from __future__ import annotations

import argparse
import csv
import html as html_lib
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import urlparse

try:
	import html2text
	from bs4 import BeautifulSoup
except ImportError:
	print(
		"Missing deps. Install with:\n  pip3 install html2text beautifulsoup4",
		file=sys.stderr,
	)
	raise

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"

# WordPress post_type -> (collection root under content/, optional subdir)
TYPE_MAP: dict[str, tuple[str, str | None]] = {
	"post": ("posts", None),
	"service": ("services", None),
	"page": ("pages", None),
	"landing_page": ("pages", None),  # /lp/:slug redirects to /:slug
	"marketing_page": ("pages", None),
	"service_area": ("pages", "service-area"),
	"career": ("pages", "careers"),
}

SKIP_SLUGS = {
	# App routes / special pages — not Markdown content docs
	"",
	"home",
	"services",
	"expert-tips",
	"service-areas",
}

# WordPress slug -> canonical content slug (matches next.config.ts redirects)
SLUG_ALIASES: dict[str, str] = {
	"hydro-jetting-for-drain-clearing": "hydro-jetting",
	"storm-drain-clearing": "storm-drain-cleaning",
	"shower-head-replacement": "shower-installation-and-repair",
	"septic-pumping": "septic-tank-cleaning-and-pumping",
	"septic-installation": "septic-system-installation",
	"commercial-repairs": "commercial-plumbing-maintenance",
	"navigating-the-maze-how-to-locate-trustworthy-plumbing-services-nearby": (
		"how-to-locate-trustworthy-plumbing-services-nearby"
	),
}

# Prefer the site's short category names for services
SERVICE_CATEGORY_PRIORITY = ("Commercial", "Septic", "Plumbing")

# Minimum HTML length required before overwriting an existing file
MIN_OVERWRITE_HTML_CHARS = 80

POST_CATEGORY_HINTS = [
	(r"septic", "Septic Maintenance"),
	(r"toilet|drain|clog|plumber|pipe|water heater|hydro|faucet|leak", "Plumbing Tips"),
	(r"diy|install", "DIY Projects"),
	(r"santa cruz|geography|flood|fire", "Santa Cruz Plumbing"),
]


def read_csv(path: Path) -> list[dict[str, str]]:
	with path.open(newline="", encoding="utf-8-sig") as fh:
		return list(csv.DictReader(fh))


def nullish(value: str | None) -> str | None:
	if value is None:
		return None
	text = value.strip()
	if not text or text.upper() == "NULL":
		return None
	return text


def slugify(text: str) -> str:
	text = html_lib.unescape(text).lower()
	text = re.sub(r"[^a-z0-9]+", "-", text)
	return text.strip("-")


def unescape(text: str | None) -> str:
	return html_lib.unescape(nullish(text) or "").strip()


def strip_jsonld_blocks(text: str) -> str:
	"""Remove embedded schema.org JSON objects from converted Markdown."""
	pattern = re.compile(
		r"\{\s*(?:\n\s*)?\"@context\"\s*:\s*\"https?://schema\.org\"",
		re.I,
	)
	while True:
		match = pattern.search(text)
		if not match:
			return text
		start = match.start()
		depth = 0
		in_string = False
		escape = False
		end = None
		for index in range(start, len(text)):
			ch = text[index]
			if in_string:
				if escape:
					escape = False
				elif ch == "\\":
					escape = True
				elif ch == '"':
					in_string = False
				continue
			if ch == '"':
				in_string = True
			elif ch == "{":
				depth += 1
			elif ch == "}":
				depth -= 1
				if depth == 0:
					end = index + 1
					break
		if end is None:
			# Truncated JSON blob — drop through the next markdown heading or EOF
			rest = text[start:]
			heading = re.search(r"\n##\s+", rest)
			if heading:
				text = text[:start] + rest[heading.start() + 1 :]
			else:
				text = text[:start].rstrip() + "\n"
			continue
		text = text[:start] + text[end:]


def html_to_markdown(fragment: str) -> str:
	# Strip Gutenberg block comments before conversion
	fragment = re.sub(r"<!--\s*/?wp:[\s\S]*?-->", "", fragment)

	soup = BeautifulSoup(fragment, "html.parser")
	for tag in soup(["script", "style", "noscript", "iframe", "form", "svg"]):
		tag.decompose()

	# Some posts paste FAQ JSON-LD as visible page content
	for tag in soup.find_all(["p", "div", "pre", "code"]):
		text = tag.get_text(" ", strip=True)
		if '"@context"' in text and "schema.org" in text:
			tag.decompose()

	# Normalize styled CTA anchors so html2text doesn't leave raw HTML behind
	for anchor in soup.find_all("a"):
		href = (anchor.get("href") or "").strip()
		label = anchor.get_text(" ", strip=True) or href
		if not href:
			anchor.unwrap()
			continue
		# Drop inline style/class noise; keep a clean link node
		anchor.attrs = {"href": href}
		anchor.clear()
		anchor.append(label)

	converter = html2text.HTML2Text()
	converter.body_width = 0
	converter.ignore_images = True
	converter.ignore_emphasis = False
	converter.protect_links = False
	converter.wrap_links = False

	md = converter.handle(str(soup))
	md = re.sub(r"https?://(?:www\.)?wadesplumbingandseptic\.com", "", md)
	md = re.sub(r"https?://wadesplumbingandsepticcom\.local", "", md)
	# html2text sometimes emits ](<url>) — normalize to ](url)
	md = re.sub(r"\]\(<([^>]+)>\)", r"](\1)", md)
	# Convert any residual HTML anchors
	md = re.sub(
		r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
		lambda match: f"[{re.sub('<[^>]+>', '', match.group(2)).strip() or match.group(1)}]({match.group(1)})",
		md,
		flags=re.I | re.S,
	)
	# Drop truncated/broken leftover tags from malformed WP HTML
	md = re.sub(r"</?(?:a|div|span|section|button)[^>\n]*?>", "", md, flags=re.I)
	md = re.sub(r"</?(?:a|div|span|section|button)[^>\n]*$", "", md, flags=re.I | re.M)
	md = strip_jsonld_blocks(md)
	md = re.sub(r"\n{3,}", "\n\n", md)
	junk_patterns = [
		r"### Send a message[\s\S]*$",
		r"Leave blank[\s\S]*$",
		r"By submitting this form[\s\S]*$",
		r"## Table of Contents[\s\S]*?(?=## |\Z)",
		r"\* \* \*\n+",
	]
	for pattern in junk_patterns:
		md = re.sub(pattern, "\n\n", md, flags=re.I)
	return md.strip() + "\n"


def first_paragraph_description(markdown: str, limit: int = 160) -> str:
	for block in re.split(r"\n\s*\n", markdown.strip()):
		line = block.strip()
		if not line or line.startswith("#") or line.startswith("!") or line.startswith("["):
			continue
		line = re.sub(r"[*_`]", "", line)
		line = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", line)
		line = re.sub(r"\s+", " ", line).strip()
		if len(line) < 40:
			continue
		if len(line) <= limit:
			return line
		cut = line[: limit - 1].rsplit(" ", 1)[0]
		return cut.rstrip(".,;:") + "…"
	return ""


def guess_post_category(title: str, tags: list[str]) -> str:
	hay = " ".join([title, *tags]).lower()
	for pattern, label in POST_CATEGORY_HINTS:
		if re.search(pattern, hay):
			return label
	return "Plumbing Tips"


def pick_service_category(names: list[str]) -> str | None:
	normalized = {n.strip(): n.strip() for n in names}
	for preferred in SERVICE_CATEGORY_PRIORITY:
		if preferred in normalized:
			return preferred
	# Map longer WP names onto short site categories
	for name in names:
		lower = name.lower()
		if "commercial" in lower:
			return "Commercial"
		if "septic" in lower:
			return "Septic"
		if "plumbing" in lower:
			return "Plumbing"
	return names[0] if names else None


def write_markdown(path: Path, frontmatter: dict, body: str) -> None:
	path.parent.mkdir(parents=True, exist_ok=True)
	clean = {k: v for k, v in frontmatter.items() if v is not None and v != "" and v != []}
	try:
		import yaml  # type: ignore

		class LiteralDumper(yaml.SafeDumper):
			pass

		def str_representer(dumper: yaml.SafeDumper, data: str):
			if "\n" in data:
				return dumper.represent_scalar("tag:yaml.org,2002:str", data, style="|")
			return dumper.represent_scalar("tag:yaml.org,2002:str", data)

		LiteralDumper.add_representer(str, str_representer)
		fm_text = yaml.dump(
			clean,
			Dumper=LiteralDumper,
			default_flow_style=False,
			allow_unicode=True,
			sort_keys=False,
		).rstrip()
		path.write_text(f"---\n{fm_text}\n---\n\n{body.rstrip()}\n", encoding="utf-8")
		return
	except Exception:  # noqa: BLE001
		pass

	lines = ["---"]
	for key, value in clean.items():
		if isinstance(value, list):
			lines.append(f"{key}:")
			for item in value:
				if isinstance(item, dict):
					lines.append(f"  - src: {item.get('src', '')}")
					for nested_key in ("alt", "width", "height", "caption"):
						if nested_key in item and item[nested_key] is not None:
							lines.append(f"    {nested_key}: {item[nested_key]}")
				else:
					item_text = str(item)
					if any(ch in item_text for ch in [":", "#", '"']):
						lines.append(f'  - "{item_text.replace(chr(34), chr(92) + chr(34))}"')
					else:
						lines.append(f"  - {item_text}")
		elif isinstance(value, bool):
			lines.append(f"{key}: {'true' if value else 'false'}")
		elif isinstance(value, int):
			lines.append(f"{key}: {value}")
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


def load_export(input_dir: Path) -> dict:
	required = [
		"posts.csv",
		"attachments.csv",
		"postmeta.csv",
		"terms.csv",
		"term_taxonomy.csv",
		"term_relationships.csv",
		"yoast_indexable.csv",
	]
	missing = [name for name in required if not (input_dir / name).exists()]
	if missing:
		raise SystemExit(
			f"Missing CSV files in {input_dir}: {', '.join(missing)}\n"
			"Unzip the phpMyAdmin export into that directory first."
		)

	posts = read_csv(input_dir / "posts.csv")
	attachments = {row["ID"]: row for row in read_csv(input_dir / "attachments.csv")}
	postmeta_rows = read_csv(input_dir / "postmeta.csv")
	terms = {row["term_id"]: row for row in read_csv(input_dir / "terms.csv")}
	taxonomies = {row["term_taxonomy_id"]: row for row in read_csv(input_dir / "term_taxonomy.csv")}
	relationships = read_csv(input_dir / "term_relationships.csv")
	yoast_rows = read_csv(input_dir / "yoast_indexable.csv")

	meta: dict[str, dict[str, str]] = defaultdict(dict)
	for row in postmeta_rows:
		key = nullish(row.get("meta_key"))
		if key:
			meta[row["post_id"]][key] = row.get("meta_value") or ""

	terms_by_post: dict[str, list[tuple[str, str, str]]] = defaultdict(list)
	for row in relationships:
		tt = taxonomies.get(row["term_taxonomy_id"])
		if not tt:
			continue
		term = terms.get(tt["term_id"])
		if not term:
			continue
		terms_by_post[row["post_id"]].append(
			(tt["taxonomy"], unescape(term["name"]), term["slug"])
		)

	yoast_by_id: dict[str, dict[str, str]] = {}
	for row in yoast_rows:
		if row.get("object_type") == "post":
			yoast_by_id[row["object_id"]] = row

	return {
		"posts": posts,
		"attachments": attachments,
		"meta": meta,
		"terms_by_post": terms_by_post,
		"yoast_by_id": yoast_by_id,
	}


def resolve_slug(post: dict[str, str], yoast: dict[str, str] | None) -> str:
	# Prefer explicit post_name if the export included it
	for key in ("post_name", "slug"):
		value = nullish(post.get(key))
		if value:
			return value

	# Some exports mislabeled post_name as parent_slug
	parent_slug = nullish(post.get("parent_slug"))
	if parent_slug and re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", parent_slug):
		return parent_slug

	permalink = nullish(yoast.get("permalink") if yoast else None)
	if permalink:
		path = urlparse(permalink).path.strip("/")
		# Ignore ugly draft permalinks like /?p=123
		if path and "p=" not in permalink.split("?", 1)[-1]:
			return path.split("/")[-1]

	return slugify(unescape(post.get("post_title") or "untitled"))


def resolve_destination(
	post_type: str,
	slug: str,
	content_root: Path,
) -> Path | None:
	mapping = TYPE_MAP.get(post_type)
	if not mapping:
		return None
	collection, subdir = mapping
	if slug in SKIP_SLUGS:
		return None
	canonical_slug = SLUG_ALIASES.get(slug, slug)
	parts = [collection]
	if subdir:
		parts.append(subdir)
	parts.append(f"{canonical_slug}.md")
	return content_root.joinpath(*parts)


def read_existing_frontmatter(path: Path) -> dict:
	"""Pull selected fields from an existing Markdown file to preserve site assets."""
	if not path.exists():
		return {}
	text = path.read_text(encoding="utf-8")
	if not text.startswith("---"):
		return {}
	end = text.find("\n---", 3)
	if end < 0:
		return {}
	block = text[3:end].strip()
	keep_keys = {
		"image",
		"imageAlt",
		"featured",
		"gallery",
		"order",
		"eyebrow",
		"noindex",
	}
	try:
		import yaml  # type: ignore

		parsed = yaml.safe_load(block) or {}
		if isinstance(parsed, dict):
			return {k: parsed[k] for k in keep_keys if k in parsed and parsed[k] is not None}
	except Exception:  # noqa: BLE001
		pass

	# Scalar-only fallback if PyYAML is unavailable
	preserved: dict = {}
	for line in block.splitlines():
		if ":" not in line or line.startswith(" ") or line.startswith("-"):
			continue
		key, raw = line.split(":", 1)
		key = key.strip()
		raw = raw.strip().strip('"')
		if key not in keep_keys or key == "gallery" or raw == "":
			continue
		if key in ("featured", "noindex"):
			preserved[key] = raw.lower() == "true"
		elif key == "order":
			try:
				preserved[key] = int(raw)
			except ValueError:
				pass
		else:
			preserved[key] = raw
	return preserved


def build_frontmatter(
	post: dict[str, str],
	post_type: str,
	slug: str,
	yoast: dict[str, str] | None,
	terms: list[tuple[str, str, str]],
	description: str,
	order: int | None,
) -> dict:
	title = unescape(post.get("post_title")) or slug.replace("-", " ").title()
	fm: dict = {
		"title": title,
		"description": description,
	}

	if post_type == "post":
		categories = [name for tax, name, _ in terms if tax == "category" and name.lower() != "uncategorized"]
		tags = [name for tax, name, _ in terms if tax == "post_tag"]
		fm["category"] = categories[0] if categories else guess_post_category(title, tags)
		fm["date"] = (nullish(post.get("post_date")) or "2025-05-11")[:10]
		if tags:
			fm["tags"] = tags[:12]
	elif post_type == "service":
		service_cats = [name for tax, name, _ in terms if tax == "service_category"]
		fm["category"] = pick_service_category(service_cats) or "Plumbing"
		if order is not None:
			fm["order"] = order
	elif post_type == "service_area":
		# Eyebrow = city name before comma when possible
		eyebrow = title.split(",")[0].strip() if "," in title else title
		fm["eyebrow"] = eyebrow
		if order is not None:
			fm["order"] = order
	elif post_type == "career":
		fm["eyebrow"] = "Careers"
	elif post_type in ("landing_page", "marketing_page", "page"):
		if order is not None:
			fm["order"] = order

	# Optional image from featured attachment guid filename — path may not exist yet
	# Left unset unless we can map into /images/; avoids CI warnings for missing files.
	_ = yoast  # reserved for future OG image mapping
	return fm


def migrate(args: argparse.Namespace) -> int:
	input_dir = Path(args.input_dir)
	if not input_dir.is_absolute():
		input_dir = ROOT / input_dir

	data = load_export(input_dir)
	content_root = Path(args.outdir) if args.outdir else CONTENT
	if args.outdir and not content_root.is_absolute():
		content_root = ROOT / content_root

	status_filter = {s.strip() for s in args.status.split(",") if s.strip()}
	type_filter = {t.strip() for t in args.types.split(",") if t.strip()} if args.types else set(TYPE_MAP)

	# Stable order values for services / areas
	order_counters: dict[str, int] = defaultdict(lambda: 10)

	stats: Counter[str] = Counter()
	actions: list[str] = []

	posts = sorted(
		data["posts"],
		key=lambda p: (p.get("post_type") or "", p.get("post_date") or "", p.get("ID") or ""),
	)

	for post in posts:
		post_type = post.get("post_type") or ""
		status = post.get("post_status") or ""
		if post_type not in type_filter:
			continue
		if status not in status_filter:
			continue

		yoast = data["yoast_by_id"].get(post["ID"])
		wp_slug = resolve_slug(post, yoast)
		slug = SLUG_ALIASES.get(wp_slug, wp_slug)
		dest = resolve_destination(post_type, wp_slug, content_root)
		if dest is None:
			stats["skipped"] += 1
			actions.append(f"SKIP  {post_type:14} {wp_slug or '(empty-slug)'}")
			continue

		# When writing into real content/, also check the canonical path for only-missing
		canonical = resolve_destination(post_type, wp_slug, CONTENT)
		exists = canonical.exists() if canonical else False
		if args.only_missing and exists and not args.outdir:
			stats["exists"] += 1
			actions.append(f"KEEP  {post_type:14} {slug}")
			continue
		if args.only_missing and args.outdir and dest.exists():
			stats["exists"] += 1
			continue
		if exists and not args.overwrite and not args.outdir:
			stats["exists"] += 1
			actions.append(f"KEEP  {post_type:14} {slug}")
			continue

		raw_html = post.get("post_content") or ""
		html_len = len(raw_html.strip())
		body = html_to_markdown(raw_html) if html_len else ""

		# Never wipe a good local page with an empty WordPress body
		if exists and html_len < MIN_OVERWRITE_HTML_CHARS and not args.outdir:
			stats["kept_empty_wp"] += 1
			actions.append(f"KEEP  {post_type:14} {slug} (empty WP body)")
			continue

		yoast_desc = nullish(yoast.get("description") if yoast else None)
		meta_desc = nullish(data["meta"].get(post["ID"], {}).get("_yoast_wpseo_metadesc"))
		excerpt = unescape(post.get("post_excerpt"))
		description = unescape(yoast_desc or meta_desc or excerpt) or first_paragraph_description(body)
		if not description:
			description = unescape(post.get("post_title")) or slug.replace("-", " ")

		terms = data["terms_by_post"].get(post["ID"], [])
		existing_fm = read_existing_frontmatter(canonical) if canonical else {}
		order = existing_fm.get("order")
		if order is None and post_type in (
			"service",
			"service_area",
			"page",
			"landing_page",
			"marketing_page",
		):
			order = order_counters[post_type]
			order_counters[post_type] += 10

		fm = build_frontmatter(post, post_type, slug, yoast, terms, description, order)
		# Preserve local media / presentation fields WordPress CSVs don't carry well
		for key in ("image", "imageAlt", "featured", "gallery", "eyebrow", "noindex"):
			if key in existing_fm and key not in fm:
				fm[key] = existing_fm[key]
			elif key in existing_fm and key == "eyebrow" and post_type != "service_area":
				fm[key] = existing_fm[key]
		if "eyebrow" in existing_fm and post_type in ("career", "page", "landing_page"):
			fm["eyebrow"] = existing_fm["eyebrow"]
		if "featured" in existing_fm:
			fm["featured"] = existing_fm["featured"]
		if "image" in existing_fm:
			fm["image"] = existing_fm["image"]
		if "imageAlt" in existing_fm:
			fm["imageAlt"] = existing_fm["imageAlt"]
		if "gallery" in existing_fm:
			fm["gallery"] = existing_fm["gallery"]
		if "noindex" in existing_fm:
			fm["noindex"] = existing_fm["noindex"]

		alias_note = f" (from {wp_slug})" if wp_slug != slug else ""
		rel = dest.relative_to(ROOT) if dest.is_relative_to(ROOT) else dest
		if args.dry_run:
			stats["would_write"] += 1
			actions.append(f"WRITE {post_type:14} {rel} ({len(body)} chars){alias_note}")
			continue

		write_markdown(dest, fm, body or "_Content pending._\n")
		stats["wrote"] += 1
		actions.append(f"WROTE {post_type:14} {rel}{alias_note}")

	print("WordPress → Markdown migration")
	print(f"  input:  {input_dir}")
	print(f"  output: {content_root}")
	print(f"  status: {', '.join(sorted(status_filter))}")
	print(f"  types:  {', '.join(sorted(type_filter))}")
	print(f"  mode:   {'dry-run' if args.dry_run else 'write'}"
		  f"{', only-missing' if args.only_missing else ''}"
		  f"{', overwrite' if args.overwrite else ''}")
	print()
	for key in ("wrote", "would_write", "exists", "kept_empty_wp", "skipped"):
		if stats[key]:
			print(f"  {key}: {stats[key]}")
	print()

	# Show a useful sample of actions
	show = actions if args.verbose else [a for a in actions if not a.startswith("KEEP ")]
	for line in show[:80]:
		print(line)
	if len(show) > 80:
		print(f"... +{len(show) - 80} more")

	if args.report:
		print("\nPublished slug overlap vs content/:")
		for post_type in sorted(TYPE_MAP):
			wp_slugs = set()
			for post in data["posts"]:
				if post.get("post_type") != post_type or post.get("post_status") != "publish":
					continue
				slug = resolve_slug(post, data["yoast_by_id"].get(post["ID"]))
				if slug and slug not in SKIP_SLUGS:
					wp_slugs.add(slug)
			collection, subdir = TYPE_MAP[post_type]
			scan = CONTENT / collection / (subdir or "")
			md_slugs = {p.stem for p in scan.glob("*.md")} if scan.exists() else set()
			print(
				f"  {post_type:14} wp={len(wp_slugs):3} md={len(md_slugs):3} "
				f"overlap={len(wp_slugs & md_slugs):3} "
				f"only_wp={sorted(wp_slugs - md_slugs)[:5]}"
			)

	return 0


def main() -> int:
	parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
	parser.add_argument(
		"--input-dir",
		default="wp-export",
		help="Directory containing the CSV exports (default: wp-export/)",
	)
	parser.add_argument(
		"--outdir",
		default=None,
		help="Write into this directory instead of content/ (useful for full review dumps)",
	)
	parser.add_argument(
		"--status",
		default="publish",
		help="Comma-separated post_status values (default: publish)",
	)
	parser.add_argument(
		"--types",
		default="",
		help="Comma-separated post_type filter (default: all mapped types)",
	)
	parser.add_argument(
		"--only-missing",
		action="store_true",
		help="Do not overwrite files that already exist in content/",
	)
	parser.add_argument(
		"--overwrite",
		action="store_true",
		help="Overwrite existing Markdown files in content/ (destructive)",
	)
	parser.add_argument("--dry-run", action="store_true", help="Print actions without writing files")
	parser.add_argument("--report", action="store_true", help="Print overlap report vs content/")
	parser.add_argument("--verbose", action="store_true", help="Include KEEP lines in the log")
	return migrate(parser.parse_args())


if __name__ == "__main__":
	raise SystemExit(main())
