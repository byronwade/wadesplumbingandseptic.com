#!/usr/bin/env python3
"""Download WordPress media and wire featured images into Markdown frontmatter.

Reads wp-export/*.csv (from the phpMyAdmin export), downloads images from the
live WordPress uploads URL, converts them to WebP under public/images/wordpress/,
and updates content/**/*.md frontmatter image / imageAlt fields.

Examples:
  python3 scripts/migrate-wordpress-images.py --dry-run
  python3 scripts/migrate-wordpress-images.py
  python3 scripts/migrate-wordpress-images.py --all-attachments
"""

from __future__ import annotations

import argparse
import csv
import html as html_lib
import io
import re
import sys
import time
import urllib.error
import urllib.request
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


def to_webp(data: bytes, dest: Path, quality: int = 82) -> None:
	dest.parent.mkdir(parents=True, exist_ok=True)
	image = Image.open(io.BytesIO(data))
	if image.mode in ("P", "RGBA"):
		image = image.convert("RGBA")
	elif image.mode != "RGB":
		image = image.convert("RGB")
	# Flatten transparency onto white for consistent WebP
	if image.mode == "RGBA":
		background = Image.new("RGB", image.size, (255, 255, 255))
		background.paste(image, mask=image.split()[-1])
		image = background
	image.save(dest, format="WEBP", quality=quality, method=6)


def patch_frontmatter(path: Path, image: str, image_alt: str) -> bool:
	text = path.read_text(encoding="utf-8")
	if not text.startswith("---"):
		return False
	end = text.find("\n---", 3)
	if end < 0:
		return False
	fm = text[3:end]
	body = text[end + 4 :]

	if re.search(r"^image:\s*", fm, re.M):
		fm = re.sub(r"^image:\s*.*$", f"image: {image}", fm, count=1, flags=re.M)
	else:
		fm = fm.rstrip() + f"\nimage: {image}\n"

	if re.search(r"^imageAlt:\s*", fm, re.M):
		alt_escaped = image_alt.replace('"', '\\"')
		fm = re.sub(
			r"^imageAlt:\s*.*$",
			f'imageAlt: "{alt_escaped}"',
			fm,
			count=1,
			flags=re.M,
		)
	else:
		alt_escaped = image_alt.replace('"', '\\"')
		fm = fm.rstrip() + f'\nimageAlt: "{alt_escaped}"\n'

	path.write_text(f"---{fm}\n---{body}", encoding="utf-8")
	return True


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

	# Jobs: featured images for publish content, optionally all attachments
	jobs: list[tuple[str, str, Path | None, str]] = []
	# (source_rel_or_url_path, dest_webp_rel, markdown_path|None, alt)

	for post in posts:
		if post.get("post_status") != "publish":
			continue
		post_type = post.get("post_type") or ""
		if post_type not in TYPE_MAP:
			continue
		thumb_id = thumbnails.get(post["ID"])
		if not thumb_id:
			continue
		rel = attached_file.get(thumb_id)
		if not rel:
			guid = nullish(attachments.get(thumb_id, {}).get("guid"))
			if guid and "/uploads/" in guid:
				rel = guid.split("/uploads/", 1)[1]
		if not rel:
			continue

		slug = resolve_slug(post, yoast_rows.get(post["ID"]))
		md_path = markdown_path(post_type, slug or "")
		filename = slugify_filename(Path(rel).name)
		dest_rel = f"/images/wordpress/{filename}.webp"
		alt = unescape(post.get("post_title")) or filename.replace("-", " ")
		jobs.append((rel, dest_rel, md_path if md_path and md_path.exists() else None, alt))

	if args.all_attachments:
		seen_rels = {job[0] for job in jobs}
		for att_id, att in attachments.items():
			rel = attached_file.get(att_id)
			if not rel or rel in seen_rels:
				continue
			if not (att.get("post_mime_type") or "").startswith("image/"):
				continue
			filename = slugify_filename(Path(rel).name)
			dest_rel = f"/images/wordpress/{filename}.webp"
			alt = unescape(att.get("post_title")) or filename.replace("-", " ")
			jobs.append((rel, dest_rel, None, alt))
			seen_rels.add(rel)

	# Dedupe by source file
	deduped: dict[str, tuple[str, str, Path | None, str]] = {}
	for rel, dest_rel, md_path, alt in jobs:
		existing = deduped.get(rel)
		if not existing:
			deduped[rel] = (rel, dest_rel, md_path, alt)
		elif md_path and not existing[2]:
			deduped[rel] = (rel, dest_rel, md_path, alt)

	jobs = list(deduped.values())
	print(f"WordPress image migration — {len(jobs)} download(s)")
	print(f"  export: {EXPORT}")
	print(f"  output: {OUT_DIR}")
	print(f"  mode:   {'dry-run' if args.dry_run else 'write'}")

	downloaded = 0
	updated = 0
	skipped = 0
	failed = 0

	for rel, dest_rel, md_path, alt in jobs:
		dest = ROOT / "public" / dest_rel.lstrip("/")
		url = f"{BASE_UPLOAD}/{rel.lstrip('/')}"

		if dest.exists() and not args.force:
			action = "HAVE"
			skipped += 1
		elif args.dry_run:
			action = "GET "
		else:
			try:
				data = download(url)
				to_webp(data, dest)
				action = "SAVE"
				downloaded += 1
				time.sleep(0.05)
			except Exception as exc:  # noqa: BLE001
				print(f"FAIL  {rel} — {exc}")
				failed += 1
				continue

		md_note = ""
		if md_path:
			if args.dry_run:
				md_note = f" → {md_path.relative_to(ROOT)}"
			else:
				if patch_frontmatter(md_path, dest_rel, alt):
					updated += 1
					md_note = f" → {md_path.relative_to(ROOT)}"
				else:
					md_note = f" (frontmatter skip {md_path.name})"

		print(f"{action}  {dest_rel}{md_note}")

	print()
	print(f"  downloaded: {downloaded}")
	print(f"  already had: {skipped}")
	print(f"  md updated: {updated}")
	print(f"  failed: {failed}")
	return 1 if failed else 0


def main() -> int:
	parser = argparse.ArgumentParser(description=__doc__)
	parser.add_argument("--dry-run", action="store_true")
	parser.add_argument(
		"--all-attachments",
		action="store_true",
		help="Also download attachments that are not featured images",
	)
	parser.add_argument("--force", action="store_true", help="Re-download even if WebP exists")
	return migrate(parser.parse_args())


if __name__ == "__main__":
	raise SystemExit(main())
