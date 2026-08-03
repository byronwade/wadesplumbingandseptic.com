function serializeJsonLd(data: unknown) {
	// Escape characters that can break out of a <script> context.
	return JSON.stringify(data)
		.replace(/</g, "\\u003c")
		.replace(/>/g, "\\u003e")
		.replace(/&/g, "\\u0026")
		.replace(/\u2028/g, "\\u2028")
		.replace(/\u2029/g, "\\u2029")
}

export function JsonLd({ data }: { data: unknown }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: serializeJsonLd(data),
			}}
		/>
	)
}
