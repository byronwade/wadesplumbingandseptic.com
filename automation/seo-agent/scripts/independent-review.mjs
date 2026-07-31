import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { reviewReadiness } from "../src/independent-review.mjs";

const repoRoot = resolve(import.meta.dirname, "../../..");
const parse = (path) =>
	JSON.parse(readFileSync(resolve(repoRoot, path), "utf8"));
const review = reviewReadiness({
	technicalSeo: parse("seo/manifests/technical-seo.json"),
	integrationInventory: parse("seo/manifests/integration-inventory.json"),
	rootConfig: readFileSync(
		resolve(
			repoRoot,
			["next.config.ts", "next.config.mjs", "next.config.js"].find((path) =>
				existsSync(resolve(repoRoot, path)),
			),
		),
		"utf8",
	),
});

console.log(JSON.stringify(review));
