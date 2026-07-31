import js from "@eslint/js";
import globals from "globals";

export default [
	{
		ignores: [".eve/**", ".output/**", ".vercel/**", "node_modules/**"],
	},
	{
		files: ["**/*.mjs"],
		...js.configs.recommended,
		languageOptions: {
			globals: globals.node,
		},
		rules: {
			"no-console": "off",
		},
	},
];
