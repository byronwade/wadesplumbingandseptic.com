# Archived scripts

One-time scripts kept for historical reference. Not part of any active
workflow and not wired into `package.json` — their required input
(`wp-export/`, a phpMyAdmin CSV export of the old WordPress site) no longer
exists in the repo.

- `migrate-from-wordpress-csv.py` — converted the WordPress CSV export into
  this site's Markdown content files. Ran once during the initial migration.
- `migrate-wordpress-images.py` — downloaded image attachments referenced by
  that same CSV export. Ran once alongside the script above.
