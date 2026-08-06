export function JsonLd({ data }: { data: unknown }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				// Escape "<" so a "</script" substring in any string value can't
				// prematurely close this tag; < round-trips through JSON
				// parsing unchanged, so schema consumers see identical data.
				__html: JSON.stringify(data).replace(/</g, "\\u003c"),
			}}
		/>
	)
}
