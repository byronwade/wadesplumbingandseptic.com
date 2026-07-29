#!/usr/bin/env python3
"""Download WordPress media as WebP and wire it into Markdown content.

Reads wp-export/*.csv, downloads image attachments from the live WordPress
uploads CDN, converts them to WebP under public/images/wordpress/, then:

  1. Sets frontmatter `image` / `imageAlt` from WP featured/OG images
  2. Smart-assigns unused topical media where featured images are missing
  3. Builds `gallery` from attachments parented to a post/page
  4. Injects contextual inline Markdown images into post bodies

Examples:
  python3 scripts/migrate-wordpress-images.py --dry-run
  python3 scripts/migrate-wordpress-images.py
  python3 scripts/migrate-wordpress-images.py --skip-download
"""

from __future__ import annotations

import argparse
import csv
import html as html_lib
import io
import re
import sys
import time
import urllib.request
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlparse

try:
	from PIL import Image
except ImportError:
	print("Install Pillow: pip3 install pillow", file=sys.stderr)
	raise

ROOT = Path(__file__).resolve().parents[1]
EXPORT = ROOT / "wp-export"
CONTENT = ROOT / "content"
OUT_DIR = ROOT / "public" / "images" / "wordpress"
BASE_UPLOAD = "https://wadesplumbingandseptic.com/wp-content/uploads"
UA = "Mozilla/5.0 (compatible; WadesImageMigration/1.0)"

TYPE_MAP = {
	"post": ("posts", None),
	"service": ("services", None),
	"page": ("pages", None),
	"landing_page": ("pages", None),
	"marketing_page": ("pages", None),
	"service_area": ("pages", "service-area"),
	"career": ("pages", "careers"),
}

SLUG_ALIASES = {
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

REPLACEABLE_IMAGES = {
	"/images/work/precision-valve-installation.webp",
	"/images/team/byron-working.webp",
	"/images/team/wades-team.webp",
	"/images/locations/santa-cruz-redwoods.webp",
	"/images/locations/river-and-redwoods.webp",
}

SKIP_STEM_RE = re.compile(
	r"^(wadeslogo|cropped-wadeslogo|"
	r"\d{10,}|[0-9a-f]{8}-[0-9a-f]{4}-|"
	r".*bolivia.*|.*ocean-view.*|.*sun-hat.*|.*flower-field.*)$",
	re.I,
)

# Explicit topic → preferred local images (ordered). Includes WP + curated.
TOPIC_POOLS: dict[str, list[tuple[str, str]]] = {
	"toilet": [
		(
			"/images/wordpress/close-up-of-a-modern-dual-flush-toilet-with-a-chrome-button-highlighting-clean-and-contemporary-design-1847bb.webp",
			"Modern dual-flush toilet",
		),
		(
			"/images/wordpress/cozy-rustic-bathroom-with-wooden-design-featuring-toilet-and-sink-under-warm-natural-light-053d81.webp",
			"Bathroom with toilet and sink",
		),
	],
	"faucet": [
		(
			"/images/wordpress/a-detailed-view-of-a-sleek-chrome-shower-faucet-in-a-clean-bathroom-setting-7921d7.webp",
			"Chrome bathroom faucet",
		),
		(
			"/images/wordpress/close-up-of-water-flowing-from-a-faucet-into-a-bathroom-sink-8aeca7.webp",
			"Water flowing from a bathroom faucet",
		),
	],
	"shower": [
		(
			"/images/wordpress/a-detailed-view-of-a-sleek-chrome-shower-faucet-in-a-clean-bathroom-setting-7921d7.webp",
			"Chrome shower faucet",
		),
		(
			"/images/wordpress/close-up-of-water-flowing-from-a-faucet-into-a-bathroom-sink-8aeca7.webp",
			"Bathroom water fixture",
		),
	],
	"drain": [
		("/images/work/drain-cleaning-equipment.webp", "Professional drain cleaning equipment"),
		("/images/services/drain-clearing.webp", "Drain clearing service"),
		(
			"/images/wordpress/close-up-of-a-storm-drain-covered-with-leaves-and-debris-during-rainfall-5ed9d8.webp",
			"Storm drain covered with debris",
		),
		(
			"/images/wordpress/detailed-image-of-a-chrome-sink-drain-showcasing-water-droplets-and-a-metallic-finish-6a140e.webp",
			"Chrome sink drain close-up",
		),
		(
			"/images/wordpress/a-metal-drainpipe-set-against-a-red-and-beige-striped-textured-wall-352284.webp",
			"Metal drainpipe",
		),
		(
			"/images/wordpress/close-up-photo-of-a-weathered-drain-cover-embossed-with-san-francisco-showcasing-urban-texture-and-detail-725488.webp",
			"Weathered drain cover",
		),
	],
	"leak": [
		(
			"/images/wordpress/a-detailed-view-of-a-leaking-water-pipe-in-a-lush-green-garden-setting-b8ce2d.webp",
			"Leaking water pipe outdoors",
		),
		("/images/work/precision-valve-installation.webp", "Precision valve and pipe work"),
		(
			"/images/wordpress/rusty-outdoor-plumbing-pipes-with-pressure-gauges-and-warning-signs-on-a-wall-70277e.webp",
			"Outdoor plumbing pipes with gauges",
		),
	],
	"water-heater": [
		("/images/work/water-heater-installation.webp", "Water heater installation"),
		("/images/work/tankless-water-heater-installation.webp", "Tankless water heater installation"),
		("/images/services/water-heater-service.webp", "Water heater service"),
	],
	"hydro": [
		("/images/work/drain-cleaning-equipment.webp", "Hydro-jetting and drain equipment"),
		("/images/services/drain-clearing.webp", "High-pressure drain clearing"),
		(
			"/images/wordpress/close-up-view-of-an-industrial-plumbing-system-featuring-a-pressure-gauge-and-steel-pipes-040c6c.webp",
			"Industrial plumbing with pressure gauge",
		),
	],
	"septic": [
		("/images/work/engineered-septic-hero.webp", "Engineered septic system installation"),
		("/images/work/multi-tank-excavation.webp", "Multi-tank septic excavation"),
		("/images/work/completed-multi-tank.webp", "Completed multi-tank septic system"),
		("/images/work/advanced-septic-control-panel.webp", "Advanced septic control panel"),
		("/images/services/septic-pumping-illustration.webp", "Septic pumping service"),
		("/images/work/engineered-retaining-wall.webp", "Engineered septic site work"),
		(
			"/images/wordpress/four-beige-tanks-in-an-outdoor-water-treatment-setup-with-blue-piping-195954.webp",
			"Outdoor water treatment tanks",
		),
		(
			"/images/wordpress/ai-engineered-septic-systems-santa-cruz-county-612317.webp",
			"Engineered septic systems in Santa Cruz County",
		),
		(
			"/images/wordpress/ai-engineered-septic-systems-santa-cruz-county-612d82.webp",
			"Santa Cruz County engineered septic system",
		),
		(
			"/images/wordpress/ai-engineered-septic-systems-santa-cruz-county-e7ee4c.webp",
			"Advanced septic system design",
		),
		(
			"/images/wordpress/a-large-machine-is-in-the-background-behind-a-fence-6b3089.webp",
			"Septic installation equipment on site",
		),
		(
			"/images/wordpress/reflective-lake-scene-with-warning-sign-about-treated-wastewater-near-mountainous-landscape-67a3c8.webp",
			"Treated wastewater warning near waterway",
		),
		(
			"/images/wordpress/stacked-concrete-pipes-in-an-outdoor-storage-area-surrounded-by-grass-ebc75f.webp",
			"Stacked concrete pipes for underground systems",
		),
	],
	"filter": [
		(
			"/images/wordpress/four-beige-tanks-in-an-outdoor-water-treatment-setup-with-blue-piping-195954.webp",
			"Water treatment tank system",
		),
		("/images/work/tankless-water-heater-installation.webp", "Whole-home water equipment"),
	],
	"commercial": [
		("/images/work/commercial-plumbing-installation.webp", "Commercial plumbing installation"),
		("/images/services/commercial-plumbing.webp", "Commercial plumbing service"),
		(
			"/images/wordpress/industrial-building-facade-with-large-machinery-components-and-pipes-visible-314393.webp",
			"Industrial building with machinery and pipes",
		),
		(
			"/images/wordpress/close-up-view-of-an-industrial-plumbing-system-featuring-a-pressure-gauge-and-steel-pipes-040c6c.webp",
			"Industrial plumbing system",
		),
	],
	"sewer": [
		(
			"/images/wordpress/stacked-concrete-pipes-in-an-outdoor-storage-area-surrounded-by-grass-ebc75f.webp",
			"Concrete sewer and drain pipes",
		),
		(
			"/images/wordpress/stacked-concrete-pipes-in-an-outdoor-storage-area-surrounded-by-grass-ebc75f-1.webp",
			"Stacked concrete pipes ready for installation",
		),
		("/images/work/drain-cleaning-equipment.webp", "Sewer and drain service equipment"),
		(
			"/images/wordpress/water-pipe-system-in-a-park-with-surrounding-greenery-and-autumn-leaves-7552d7.webp",
			"Outdoor water pipe system",
		),
	],
	"emergency": [
		(
			"/images/wordpress/rusty-outdoor-plumbing-pipes-with-pressure-gauges-and-warning-signs-on-a-wall-70277e-2.webp",
			"Plumbing emergency warning signs",
		),
		(
			"/images/wordpress/close-up-of-a-warning-sign-against-swimming-due-to-deep-holes-surrounded-by-dry-branches-4f88d9.webp",
			"Hazard warning sign",
		),
		(
			"/images/wordpress/close-up-of-a-triangular-warning-sign-indicating-a-slippery-surface-fixed-to-a-wooden-post-f97ba2.webp",
			"Warning sign on a wooden post",
		),
	],
	"plumb": [
		("/images/work/precision-valve-installation.webp", "Precision plumbing valve installation"),
		("/images/work/new-construction-rough-in.webp", "New construction plumbing rough-in"),
		(
			"/images/wordpress/close-up-of-a-plumbers-hands-installing-steel-pipes-indoors-showcasing-skilled-manual-work-5c43ba.webp",
			"Plumber installing steel pipes",
		),
		(
			"/images/wordpress/detailed-view-of-a-pressure-gauge-attached-to-a-red-industrial-pipe-measuring-psi-and-kpa-fab4a1.webp",
			"Pressure gauge on an industrial pipe",
		),
		(
			"/images/wordpress/water-pipe-system-in-a-park-with-surrounding-greenery-and-autumn-leaves-7552d7.webp",
			"Outdoor plumbing pipe system",
		),
	],
}

TOPIC_DETECT: list[tuple[re.Pattern[str], str]] = [
	(re.compile(r"toilet|flange", re.I), "toilet"),
	(re.compile(r"faucet|sink(?!ing)", re.I), "faucet"),
	(re.compile(r"shower", re.I), "shower"),
	(re.compile(r"hydro|jetting", re.I), "hydro"),
	(re.compile(r"drain|clog", re.I), "drain"),
	(re.compile(r"leak|frozen.?pipe", re.I), "leak"),
	(re.compile(r"water.?heater|tankless", re.I), "water-heater"),
	(re.compile(r"softener|filtration|hard.?water|filter", re.I), "filter"),
	(re.compile(r"commercial|grease|backflow", re.I), "commercial"),
	(re.compile(r"sewer|trenchless|camera|video.?inspect|smoke.?test|main.?line", re.I), "sewer"),
	(re.compile(r"septic|leach|drain.?field|pumping|engineered septic", re.I), "septic"),
	(re.compile(r"emergency|warning|failure|trouble|urgent", re.I), "emergency"),
	(re.compile(r"plumb|pipe|maintenance|repair|fixture|gas.?line|sump", re.I), "plumb"),
]


def read_csv(name: str) -> list[dict[str, str]]:
	with (EXPORT / name).open(newline="", encoding="utf-8-sig") as fh:
		return list(csv.DictReader(fh))


def nullish(value: str | None) -> str | None:
	if value is None:
		return None
	text = value.strip()
	if not text or text.upper() == "NULL":
		return None
	return text


def unescape(text: str | None) -> str:
	return html_lib.unescape(nullish(text) or "").strip()


def slugify_filename(name: str) -> str:
	stem = Path(name).stem.lower()
	stem = re.sub(r"-scaled$", "", stem)
	stem = re.sub(r"[^a-z0-9]+", "-", stem).strip("-")
	return stem or "image"


def humanize_stem(stem: str) -> str:
	text = re.sub(r"-[0-9a-f]{4,}$", "", stem)
	text = re.sub(r"[-_]+", " ", text).strip()
	text = re.sub(r"\bimg\b|\bimagejpeg\b", "", text, flags=re.I).strip()
	return text[:1].upper() + text[1:] if text else "Plumbing service photo"


def is_junk_alt(alt: str) -> bool:
	return bool(re.fullmatch(r"(image|img[_\-]?\d+.*|imagejpeg.*|[a-z0-9-]{0,40})", alt, re.I)) and (
		len(alt) < 24 or bool(re.match(r"^(img|image)", alt, re.I))
	)


def resolve_slug(post: dict[str, str], yoast: dict[str, str] | None) -> str | None:
	permalink = nullish(yoast.get("permalink") if yoast else None)
	if permalink:
		path = urlparse(permalink).path.strip("/")
		if path and "p=" not in permalink.split("?", 1)[-1]:
			slug = path.split("/")[-1]
			return SLUG_ALIASES.get(slug, slug)
	title = unescape(post.get("post_title"))
	if not title:
		return None
	slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
	return SLUG_ALIASES.get(slug, slug)


def markdown_path(post_type: str, slug: str) -> Path | None:
	mapping = TYPE_MAP.get(post_type)
	if not mapping or not slug:
		return None
	collection, subdir = mapping
	parts = [collection]
	if subdir:
		parts.append(subdir)
	parts.append(f"{slug}.md")
	return CONTENT.joinpath(*parts)


def download(url: str) -> bytes:
	req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "image/*,*/*"})
	with urllib.request.urlopen(req, timeout=60) as res:
		return res.read()


def to_webp(data: bytes, dest: Path, quality: int = 82) -> tuple[int, int]:
	dest.parent.mkdir(parents=True, exist_ok=True)
	image = Image.open(io.BytesIO(data))
	if image.mode in ("P", "RGBA"):
		image = image.convert("RGBA")
	elif image.mode != "RGB":
		image = image.convert("RGB")
	if image.mode == "RGBA":
		background = Image.new("RGB", image.size, (255, 255, 255))
		background.paste(image, mask=image.split()[-1])
		image = background
	max_edge = 2000
	if max(image.size) > max_edge:
		image.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
	image.save(dest, format="WEBP", quality=quality, method=6)
	return image.size


def image_size(path: Path) -> tuple[int, int]:
	with Image.open(path) as image:
		return image.size


def rel_from_upload_url(url: str | None) -> str | None:
	value = nullish(url)
	if not value or "/uploads/" not in value:
		return None
	return value.split("/uploads/", 1)[1].split("?", 1)[0]


def webp_rel_for_source(rel: str) -> str:
	return f"/images/wordpress/{slugify_filename(Path(rel).name)}.webp"


def detect_topics(haystack: str) -> list[str]:
	topics: list[str] = []
	for pattern, topic in TOPIC_DETECT:
		if pattern.search(haystack) and topic not in topics:
			topics.append(topic)
	if not topics:
		topics.append("plumb")
	return topics


def local_exists(rel: str) -> bool:
	return (ROOT / "public" / rel.lstrip("/")).exists()


def read_fm_body(path: Path) -> tuple[str, str] | None:
	text = path.read_text(encoding="utf-8")
	if not text.startswith("---"):
		return None
	end = text.find("\n---", 3)
	if end < 0:
		return None
	return text[3:end], text[end + 4 :]


def fm_get(fm: str, key: str) -> str | None:
	match = re.search(rf"^{re.escape(key)}:\s*(.*)$", fm, re.M)
	if not match:
		return None
	value = match.group(1).strip()
	if (value.startswith('"') and value.endswith('"')) or (
		value.startswith("'") and value.endswith("'")
	):
		value = value[1:-1]
	return value


def set_fm_value(fm: str, key: str, value: str, quoted: bool = False) -> str:
	rendered = f'{key}: "{value}"' if quoted else f"{key}: {value}"
	if re.search(rf"^{re.escape(key)}:\s*", fm, re.M):
		return re.sub(rf"^{re.escape(key)}:\s*.*$", rendered, fm, count=1, flags=re.M)
	return fm.rstrip() + f"\n{rendered}\n"


def set_gallery(fm: str, gallery: list[dict]) -> str:
	block_lines = ["gallery:"]
	for item in gallery:
		block_lines.append(f"- src: {item['src']}")
		alt = str(item["alt"]).replace('"', '\\"')
		block_lines.append(f'  alt: "{alt}"')
		block_lines.append(f"  width: {item['width']}")
		block_lines.append(f"  height: {item['height']}")
		if item.get("caption"):
			cap = str(item["caption"]).replace('"', '\\"')
			block_lines.append(f'  caption: "{cap}"')
	block = "\n".join(block_lines) + "\n"

	if re.search(r"^gallery:\s*$", fm, re.M) or re.search(r"^gallery:\s*\n\s*-", fm, re.M):
		# Replace existing gallery block through next top-level key or end
		return re.sub(
			r"^gallery:\n(?:[ \t]+.*\n|(?:-[ \t].*\n(?:[ \t]+.*\n)*))*",
			block,
			fm,
			count=1,
			flags=re.M,
		)
	return fm.rstrip() + "\n" + block


def body_has_images(body: str) -> bool:
	return bool(re.search(r"!\[[^\]]*\]\([^)]+\)", body) or re.search(r"<img\b", body, re.I))


def inject_inline_images(body: str, images: list[tuple[str, str]]) -> str:
	if not images or body_has_images(body):
		return body

	blocks = re.split(r"\n\s*\n", body.strip())
	if len(blocks) < 2:
		return body

	inserts = images[:2]
	first_idx = 0
	for i, block in enumerate(blocks):
		stripped = block.strip()
		if not stripped or stripped.startswith("#") or stripped.startswith("!"):
			continue
		first_idx = i
		break

	blocks.insert(first_idx + 1, f"![{inserts[0][1]}]({inserts[0][0]})")

	if len(inserts) > 1 and len(blocks) > 6:
		mid = len(blocks) // 2
		insert_at = mid
		for i in range(mid, min(len(blocks) - 1, mid + 8)):
			if blocks[i].lstrip().startswith("#") or re.match(r"^\d+\\?\.", blocks[i].lstrip()):
				insert_at = i + 1
				break
		blocks.insert(insert_at, f"![{inserts[1][1]}]({inserts[1][0]})")

	return "\n\n".join(blocks).strip() + "\n"


def build_media_index(
	attachments: dict[str, dict[str, str]],
	attached_file: dict[str, str],
) -> list[dict[str, str]]:
	media: list[dict[str, str]] = []
	for att_id, att in attachments.items():
		if not (att.get("post_mime_type") or "").startswith("image/"):
			continue
		rel = attached_file.get(att_id)
		if not rel:
			guid = nullish(att.get("guid"))
			if guid and "/uploads/" in guid:
				rel = guid.split("/uploads/", 1)[1]
		if not rel:
			continue
		dest_rel = webp_rel_for_source(rel)
		stem = Path(dest_rel).stem
		if SKIP_STEM_RE.search(stem):
			continue
		alt = unescape(att.get("post_title")) or humanize_stem(stem)
		if is_junk_alt(alt):
			alt = humanize_stem(stem)
		media.append(
			{
				"id": att_id,
				"rel": rel,
				"dest": dest_rel,
				"stem": stem,
				"alt": alt,
				"parent": nullish(att.get("post_parent")) or "0",
			}
		)
	return media


class ImagePicker:
	def __init__(self) -> None:
		self.used: set[str] = set()
		self.counts: dict[str, int] = defaultdict(int)

	def mark(self, rel: str) -> None:
		self.used.add(rel)
		self.counts[rel] += 1

	def pick(
		self,
		topics: list[str],
		*,
		allow_reuse_after: int = 2,
		exclude: set[str] | None = None,
	) -> tuple[str, str] | None:
		exclude = exclude or set()
		# Pass 1: unused in topic pools
		for topic in topics + ["plumb"]:
			for rel, alt in TOPIC_POOLS.get(topic, []):
				if rel in exclude or not local_exists(rel):
					continue
				if rel not in self.used:
					return rel, alt
		# Pass 2: least-used in topic pools
		candidates: list[tuple[int, str, str]] = []
		for topic in topics + ["plumb"]:
			for rel, alt in TOPIC_POOLS.get(topic, []):
				if rel in exclude or not local_exists(rel):
					continue
				if self.counts[rel] >= allow_reuse_after and len(TOPIC_POOLS.get(topic, [])) > 1:
					continue
				candidates.append((self.counts[rel], rel, alt))
		if candidates:
			candidates.sort(key=lambda row: (row[0], row[1]))
			return candidates[0][1], candidates[0][2]
		# Pass 3: reuse topical pool images even if already used (prefer least-used)
		fallback: list[tuple[int, str, str]] = []
		for topic in topics + ["plumb"]:
			for rel, alt in TOPIC_POOLS.get(topic, []):
				if rel in exclude or not local_exists(rel):
					continue
				fallback.append((self.counts[rel], rel, alt))
		if fallback:
			fallback.sort(key=lambda row: (row[0], row[1]))
			return fallback[0][1], fallback[0][2]
		# Pass 4: descriptive unused WP media only (skip camera-roll img_####)
		for path in sorted(OUT_DIR.glob("*.webp")):
			if SKIP_STEM_RE.search(path.stem):
				continue
			if re.match(r"^img[-_]?\d+", path.stem, re.I):
				continue
			rel = f"/images/wordpress/{path.name}"
			if rel in exclude or rel in self.used:
				continue
			return rel, humanize_stem(path.stem)
		return None


def migrate(args: argparse.Namespace) -> int:
	if not (EXPORT / "posts.csv").exists():
		raise SystemExit(f"Missing {EXPORT}/posts.csv — unzip the phpMyAdmin export first")

	posts = read_csv("posts.csv")
	meta_rows = read_csv("postmeta.csv")
	attachments = {row["ID"]: row for row in read_csv("attachments.csv")}
	yoast_rows = {
		row["object_id"]: row
		for row in read_csv("yoast_indexable.csv")
		if row.get("object_type") == "post"
	}
	attached_file = {
		row["post_id"]: row["meta_value"]
		for row in meta_rows
		if row.get("meta_key") == "_wp_attached_file" and row.get("meta_value")
	}
	thumbnails = {
		row["post_id"]: row["meta_value"]
		for row in meta_rows
		if row.get("meta_key") == "_thumbnail_id" and row.get("meta_value")
	}

	media = build_media_index(attachments, attached_file)
	media_by_id = {m["id"]: m for m in media}
	by_parent: dict[str, list[dict[str, str]]] = defaultdict(list)
	for item in media:
		if item["parent"] not in ("0", None):
			by_parent[item["parent"]].append(item)

	unique_jobs: list[tuple[str, str]] = []
	seen_dest: set[str] = set()
	for item in media:
		if item["dest"] in seen_dest:
			continue
		seen_dest.add(item["dest"])
		unique_jobs.append((item["rel"], item["dest"]))

	print(f"WordPress image migration — {len(unique_jobs)} media file(s)")
	print(f"  export: {EXPORT}")
	print(f"  output: {OUT_DIR}")
	print(f"  mode:   {'dry-run' if args.dry_run else 'write'}")

	downloaded = skipped = failed = 0
	sizes: dict[str, tuple[int, int]] = {}

	if not args.skip_download:
		for rel, dest_rel in unique_jobs:
			dest = ROOT / "public" / dest_rel.lstrip("/")
			if dest.exists() and not args.force:
				skipped += 1
				try:
					sizes[dest_rel] = image_size(dest)
				except Exception:  # noqa: BLE001
					pass
				continue
			if args.dry_run:
				print(f"GET   {dest_rel}")
				continue
			try:
				data = download(f"{BASE_UPLOAD}/{rel.lstrip('/')}")
				sizes[dest_rel] = to_webp(data, dest)
				downloaded += 1
				print(f"SAVE  {dest_rel}")
				time.sleep(0.03)
			except Exception as exc:  # noqa: BLE001
				print(f"FAIL  {rel} — {exc}")
				failed += 1
	else:
		for _, dest_rel in unique_jobs:
			dest = ROOT / "public" / dest_rel.lstrip("/")
			if dest.exists():
				skipped += 1
				try:
					sizes[dest_rel] = image_size(dest)
				except Exception:  # noqa: BLE001
					pass

	picker = ImagePicker()
	# Preserve intentionally curated non-replaceable images
	for path in CONTENT.rglob("*.md"):
		parsed = read_fm_body(path)
		if not parsed:
			continue
		fm, _ = parsed
		image = fm_get(fm, "image")
		if image and image not in REPLACEABLE_IMAGES:
			picker.mark(image)

	updated = galleries_set = injected = 0

	# Map WP posts first (featured / gallery / inline)
	for post in posts:
		if post.get("post_status") != "publish":
			continue
		post_type = post.get("post_type") or ""
		if post_type not in TYPE_MAP:
			continue

		slug = resolve_slug(post, yoast_rows.get(post["ID"]))
		md_path = markdown_path(post_type, slug or "")
		if not md_path or not md_path.exists():
			continue

		parsed = read_fm_body(md_path)
		if not parsed:
			continue
		fm, body = parsed
		title = unescape(post.get("post_title")) or fm_get(fm, "title") or slug or md_path.stem
		current_image = fm_get(fm, "image")
		topics = detect_topics(" ".join([title, slug or "", body[:500]]))
		changed = False

		# Featured from WP thumbnail / OG
		featured: str | None = None
		featured_alt = title
		thumb_id = thumbnails.get(post["ID"])
		if thumb_id and thumb_id in media_by_id:
			featured = media_by_id[thumb_id]["dest"]
			alt = media_by_id[thumb_id]["alt"]
			featured_alt = title if is_junk_alt(alt) else alt
		else:
			og_rel = rel_from_upload_url(
				nullish((yoast_rows.get(post["ID"]) or {}).get("open_graph_image"))
			)
			if og_rel:
				candidate = webp_rel_for_source(og_rel)
				if local_exists(candidate):
					featured = candidate
					featured_alt = title

		# Prefer WP featured/OG for posts & services. Leave curated campaign/landing
		# pages alone unless they have no image at all.
		apply_featured = bool(featured and local_exists(featured)) and (
			post_type in {"post", "service"}
			or not current_image
		)
		if apply_featured and featured:
			if current_image != featured:
				fm = set_fm_value(fm, "image", featured)
				fm = set_fm_value(fm, "imageAlt", featured_alt, quoted=True)
				changed = True
			picker.mark(featured)
			current_image = featured
		elif post_type in {"post", "service"} and (
			not current_image or current_image in REPLACEABLE_IMAGES
		):
			picked = picker.pick(topics)
			if picked:
				fm = set_fm_value(fm, "image", picked[0])
				fm = set_fm_value(fm, "imageAlt", picked[1], quoted=True)
				picker.mark(picked[0])
				current_image = picked[0]
				changed = True

		# Gallery from parented attachments (only if none already)
		if not re.search(r"^gallery:\s*", fm, re.M):
			gallery_items = []
			for item in by_parent.get(post["ID"], []):
				if item["dest"] == current_image or not local_exists(item["dest"]):
					continue
				width, height = sizes.get(item["dest"]) or image_size(
					ROOT / "public" / item["dest"].lstrip("/")
				)
				alt = title if is_junk_alt(item["alt"]) else item["alt"]
				gallery_items.append(
					{"src": item["dest"], "alt": alt, "width": width, "height": height}
				)
				picker.mark(item["dest"])
			if gallery_items:
				fm = set_gallery(fm, gallery_items)
				galleries_set += 1
				changed = True

		# Inline images for posts
		if post_type == "post":
			inline: list[tuple[str, str]] = []
			exclude = {current_image} if current_image else set()
			for _ in range(2):
				picked = picker.pick(topics, allow_reuse_after=4, exclude=exclude)
				if not picked:
					break
				inline.append(picked)
				exclude.add(picked[0])
				picker.mark(picked[0])
			new_body = inject_inline_images(body, inline)
			if new_body != body:
				body = new_body
				injected += 1
				changed = True

		if changed:
			updated += 1
			if args.dry_run:
				print(f"PATCH {md_path.relative_to(ROOT)} → {fm_get(fm, 'image')}")
			else:
				md_path.write_text(f"---{fm}\n---{body}", encoding="utf-8")
				print(f"WRITE {md_path.relative_to(ROOT)} → {fm_get(fm, 'image')}")

	# Services still missing an image entirely
	for path in sorted((CONTENT / "services").glob("*.md")):
		parsed = read_fm_body(path)
		if not parsed:
			continue
		fm, body = parsed
		current = fm_get(fm, "image")
		if current:
			continue
		title = fm_get(fm, "title") or path.stem
		topics = detect_topics(f"{title} {path.stem}")
		picked = picker.pick(topics, allow_reuse_after=3)
		if not picked:
			continue
		fm = set_fm_value(fm, "image", picked[0])
		fm = set_fm_value(fm, "imageAlt", picked[1], quoted=True)
		picker.mark(picked[0])
		updated += 1
		if args.dry_run:
			print(f"PATCH {path.relative_to(ROOT)} → {picked[0]}")
		else:
			path.write_text(f"---{fm}\n---{body}", encoding="utf-8")
			print(f"WRITE {path.relative_to(ROOT)} → {picked[0]}")

	# Posts still on generic placeholders
	for path in sorted((CONTENT / "posts").glob("*.md")):
		parsed = read_fm_body(path)
		if not parsed:
			continue
		fm, body = parsed
		current = fm_get(fm, "image")
		title = fm_get(fm, "title") or path.stem
		topics = detect_topics(f"{title} {path.stem} {body[:400]}")
		changed = False

		if not current or current in REPLACEABLE_IMAGES:
			picked = picker.pick(topics, allow_reuse_after=3)
			if picked:
				fm = set_fm_value(fm, "image", picked[0])
				fm = set_fm_value(fm, "imageAlt", picked[1], quoted=True)
				picker.mark(picked[0])
				current = picked[0]
				changed = True

		if not body_has_images(body):
			inline = []
			exclude = {current} if current else set()
			for _ in range(2):
				picked = picker.pick(topics, allow_reuse_after=5, exclude=exclude)
				if not picked:
					break
				inline.append(picked)
				exclude.add(picked[0])
				picker.mark(picked[0])
			new_body = inject_inline_images(body, inline)
			if new_body != body:
				body = new_body
				injected += 1
				changed = True

		if changed:
			updated += 1
			if args.dry_run:
				print(f"PATCH {path.relative_to(ROOT)} → {fm_get(fm, 'image')}")
			else:
				path.write_text(f"---{fm}\n---{body}", encoding="utf-8")
				print(f"WRITE {path.relative_to(ROOT)} → {fm_get(fm, 'image')}")

	print()
	print(f"  downloaded: {downloaded}")
	print(f"  already had: {skipped}")
	print(f"  content updated: {updated}")
	print(f"  galleries set: {galleries_set}")
	print(f"  posts with inline images: {injected}")
	print(f"  failed downloads: {failed}")
	return 1 if failed else 0


def main() -> int:
	parser = argparse.ArgumentParser(description=__doc__)
	parser.add_argument("--dry-run", action="store_true")
	parser.add_argument("--all-attachments", action="store_true", help="Deprecated no-op")
	parser.add_argument("--force", action="store_true", help="Re-download even if WebP exists")
	parser.add_argument(
		"--skip-download",
		action="store_true",
		help="Only remap Markdown using already-downloaded WebP files",
	)
	return migrate(parser.parse_args())


if __name__ == "__main__":
	raise SystemExit(main())
