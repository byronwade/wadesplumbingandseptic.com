import type { PageViewKind } from "@/lib/page-views/types"

function serialize(data: unknown) {
	return JSON.stringify(data)
		.replace(/</g, "\\u003c")
		.replace(/>/g, "\\u003e")
		.replace(/&/g, "\\u0026")
		.replace(/\u2028/g, "\\u2028")
		.replace(/\u2029/g, "\\u2029")
}

/**
 * Idle beacon, no React island. Unique counting is still enforced
 * server-side via an httpOnly cookie; this only reports the page identity.
 */
export function PageViewTracker({
	kind,
	slug,
}: {
	kind: PageViewKind
	slug: string
}) {
	const payload = serialize({ kind, slug })
	return (
		<script
			dangerouslySetInnerHTML={{
				__html: `(function(){var p=${payload};function s(){try{fetch("/api/page-view",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(p),keepalive:!0})}catch(e){}}if("requestIdleCallback"in window)requestIdleCallback(s,{timeout:2000});else setTimeout(s,400)})()`,
			}}
		/>
	)
}
