import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
	buildLinkGraph,
	buildRedirectManifest,
	buildRouteMap,
	buildTechnicalSeoReport,
	collectPageInventory,
} from "../src/inventory.mjs";

const root = resolve(import.meta.dirname, "../../..");
const inventory = collectPageInventory({ repoRoot: root });
const graph = buildLinkGraph({ repoRoot: root, inventory });
const routeMap = buildRouteMap({ repoRoot: root, inventory });
const technicalSeo = buildTechnicalSeoReport({ repoRoot: root, inventory });
const redirects = buildRedirectManifest({ repoRoot: root });
mkdirSync(resolve(root, "seo/manifests"), { recursive: true });
writeFileSync(
	resolve(root, "seo/manifests/pages.json"),
	JSON.stringify(inventory, null, 2) + "\n",
);
writeFileSync(
	resolve(root, "seo/manifests/link-graph.json"),
	JSON.stringify(graph, null, 2) + "\n",
);
writeFileSync(
	resolve(root, "seo/manifests/route-map.json"),
	JSON.stringify(routeMap, null, 2) + "\n",
);
writeFileSync(
	resolve(root, "seo/manifests/technical-seo.json"),
	JSON.stringify(technicalSeo, null, 2) + "\n",
);
writeFileSync(
	resolve(root, "seo/manifests/redirects.json"),
	JSON.stringify(redirects, null, 2) + "\n",
);
console.log(
	`Generated repository inventory (${inventory.pages.length} pages, ${routeMap.routes.filter((route) => route.kind === "DYNAMIC_RUNTIME_DATA").length} dynamic route patterns, ${graph.edges.length} links, ${technicalSeo.findings.length} technical findings).`,
);
