import { copyFileSync, mkdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "node_modules", "maplibre-gl", "dist")
const { version } = JSON.parse(
	readFileSync(path.join(dist, "..", "package.json"), "utf8"),
)
// Both modules need a fresh path because browsers cache these assets for a year.
const outDir = path.join(root, "public", "maplibre-gl", version)

mkdirSync(outDir, { recursive: true })

for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
	copyFileSync(path.join(dist, file), path.join(outDir, file))
}

console.log(`Synced MapLibre worker assets to public/maplibre-gl/${version}/`)
