import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

export default defineConfig([
	...nextVitals,
	...nextTypescript,
	// public/maplibre-gl/* is the vendored, minified MapLibre worker bundle synced
	// by scripts/sync-maplibre-worker.mjs. Linting it produced ~1k warnings and
	// failed the --max-warnings=0 gate.
	globalIgnores([
		".next/**",
		"out/**",
		"next-env.d.ts",
		"public/maplibre-gl/**",
	]),
	{
		// mapcn-generated MapLibre wrapper updates callback refs during render.
		files: ["components/ui/map.tsx"],
		rules: {
			"react-hooks/refs": "off",
			"react-hooks/set-state-in-effect": "off",
		},
	},
])
