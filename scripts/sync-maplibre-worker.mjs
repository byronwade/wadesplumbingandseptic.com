import { copyFileSync, mkdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "node_modules", "maplibre-gl", "dist")
const outDir = path.join(root, "public", "maplibre-gl")

mkdirSync(outDir, { recursive: true })

for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
	copyFileSync(path.join(dist, file), path.join(outDir, file))
}

console.log("Synced MapLibre worker assets to public/maplibre-gl/")
