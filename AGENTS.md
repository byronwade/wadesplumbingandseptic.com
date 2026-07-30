# Agent instructions

Rules for coding agents working in this repository.

## Typography: no em dashes

**Never use the em dash character (Unicode U+2014) in any content.**

This includes:

- Markdown under `content/` (pages, posts, services)
- UI copy in `app/`, `components/`, and `lib/`
- Meta descriptions, titles, alt text, and JSON-LD strings
- README and other docs meant for humans
- Generated GeoJSON / data strings shown to users

Use a normal hyphen with spaces (` - `), a comma, a colon, or a new sentence instead.

Also avoid HTML entities that render as an em dash (`&mdash;`, `&#8212;`).

CI validates markdown under `content/` and fails if an em dash is present.
