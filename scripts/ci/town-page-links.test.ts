import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"

import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { CallButton } from "../../components/call-button"
import { ServiceTownLinks } from "../../components/service-town-links"
import { TownPageLinks } from "../../components/town-page-links"
import { coreServiceSlugs, freeQuoteCtaLabel } from "../../lib/public-facts"
import { serviceAreaLocations } from "../../lib/service-areas"
import { siteConfig } from "../../lib/site"
import {
	featuredTownLinks,
	nearbyTownsFor,
	townServiceLinks,
} from "../../lib/town-page-links"

test("every mapped town has a hub page and unique nearby towns from the facts list", () => {
	const slugs = new Set(serviceAreaLocations.map((location) => location.slug))
	const dir = path.join("content", "pages", "service-area")
	for (const location of serviceAreaLocations) {
		const file = path.join(dir, `${location.slug}-ca-plumbing-septic-services.md`)
		assert.ok(fs.existsSync(file), location.href)
		const nearby = nearbyTownsFor(location)
		assert.ok(nearby.length >= 2, location.slug)
		assert.ok(
			nearby.every((item) => slugs.has(item.slug) && item.slug !== location.slug),
			location.slug,
		)
		assert.equal(new Set(nearby.map((item) => item.slug)).size, nearby.length)
	}
})

test("town and service link graphs stay inside the facts-source catalogs", () => {
	const services = townServiceLinks()
	assert.equal(services.length, coreServiceSlugs.length)
	assert.ok(
		services.every((item) => item.href.startsWith("/service-offerings/")),
	)
	const featured = featuredTownLinks()
	assert.ok(featured.length >= 8)
	assert.ok(featured.every((item) => item.featured))
})

test("town hubs render nearby towns, core services, and a free-quote call path", () => {
	const html = renderToStaticMarkup(
		createElement(TownPageLinks, {
			pathname: "/service-area/felton-ca-plumbing-septic-services",
		}),
	)
	assert.ok(html.includes("Services Wade&#x27;s provides in Felton"), html)
	assert.ok(html.includes("/service-offerings/drain-cleaning"), html)
	assert.ok(
		html.includes("/service-offerings/engineered-septic-system-installation"),
		html,
	)
	assert.ok(html.includes("not pumping"), html)
	assert.ok(html.includes(freeQuoteCtaLabel), html)
	assert.ok(html.includes(`href="${siteConfig.phoneHref}"`), html)
	assert.ok(html.includes("/service-area/ben-lomond-ca-plumbing-septic-services"))
	assert.doesNotMatch(html, /Satisfaction guaranteed|Since 2005|Fast response/)
})

test("service pages link featured towns from the facts source", () => {
	const html = renderToStaticMarkup(createElement(ServiceTownLinks))
	assert.ok(html.includes("Towns we serve"), html)
	assert.ok(html.includes("/service-area/santa-cruz-ca-plumbing-septic-services"))
	assert.ok(html.includes("/service-areas"), html)
	assert.ok(html.includes("request a free quote"), html)
})

test("call buttons on conversion paths still dial without JavaScript", () => {
	const html = renderToStaticMarkup(
		createElement(CallButton, {
			desktopLabel: `Call ${siteConfig.phone}`,
			size: "lg",
		}),
	)
	assert.ok(html.includes(`href="${siteConfig.phoneHref}"`), html)
	assert.ok(html.includes(siteConfig.phone), html)
})
