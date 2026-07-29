import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

export default defineConfig([
	...nextVitals,
	...nextTypescript,
	globalIgnores([".next/**", "out/**", "next-env.d.ts"]),
	{
		// mapcn-generated MapLibre wrapper updates callback refs during render.
		files: ["components/ui/map.tsx"],
		rules: {
			"react-hooks/refs": "off",
			"react-hooks/set-state-in-effect": "off",
		},
	},
])
