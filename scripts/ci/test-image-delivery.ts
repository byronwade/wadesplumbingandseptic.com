import assert from "node:assert/strict"
import nextConfig from "../../next.config"

const images = nextConfig.images

assert.ok(
	images && typeof images === "object",
	"Next image configuration is required",
)
assert.equal(
	images.unoptimized,
	true,
	"Vercel Services must serve local images directly until its Next image optimizer route is available",
)

console.log("Image delivery policy passes: local images bypass /_next/image.")
