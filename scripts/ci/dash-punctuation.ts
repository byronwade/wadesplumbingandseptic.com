import ts from "typescript"

/**
 * Dash punctuation is banned in user-facing copy (see AGENTS.md). Markdown is
 * checked by validate-content.mjs; this guard covers UI strings in app/,
 * components/ and lib/, generated text such as llms.txt and JSON-LD, and
 * GeoJSON labels.
 */

const EM_DASH = /—|&mdash;|&#8212;|&#x2014;/i
const EN_DASH = /–|&ndash;|&#8211;|&#x2013;/i
/** "word - word": a hyphen with spaces on both sides inside one line. */
const SPACED_HYPHEN = /(?<=\S)[ \t]+-[ \t]+(?=\S)/

/**
 * Stand-in for an interpolated value, so `${a} - ${b}` and `{a} - {b}` read
 * as the aside they render as.
 */
const SLOT = ""

export function dashIssues(text: string): string[] {
	const issues: string[] = []
	if (EM_DASH.test(text)) issues.push("em dash")
	if (EN_DASH.test(text)) issues.push("en dash")
	if (SPACED_HYPHEN.test(text)) issues.push('spaced hyphen aside (" - ")')
	return issues
}

/** A literal that is only a spaced hyphen joins two pieces of copy with it. */
function isSeparator(text: string) {
	return /^[ \t]+-[ \t]+$/.test(text)
}

/** Strings that are code rather than copy: regex sources and log messages. */
function isCodeString(node: ts.Node) {
	let parent = node.parent
	while (
		parent &&
		(ts.isBinaryExpression(parent) ||
			ts.isTemplateSpan(parent) ||
			ts.isTemplateExpression(parent) ||
			ts.isParenthesizedExpression(parent))
	)
		parent = parent.parent
	if (!parent) return false
	if (ts.isNewExpression(parent) || ts.isCallExpression(parent)) {
		const callee = parent.expression.getText()
		if (/^RegExp$/.test(callee)) return true
		if (/^console\.\w+$/.test(callee)) return true
	}
	return false
}

/** Visible text of a JSX element, with expressions held as slots. */
function jsxText(node: ts.Node): string {
	if (ts.isJsxText(node)) {
		if (node.containsOnlyTriviaWhiteSpaces) return ""
		// JSX joins wrapped lines with one space and trims line edges.
		return node.text
			.split(/\r?\n/)
			.map((line, index, lines) => {
				let next = line
				if (index > 0) next = next.trimStart()
				if (index < lines.length - 1) next = next.trimEnd()
				return next
			})
			.filter((line) => line.length > 0)
			.join(" ")
	}
	if (ts.isJsxExpression(node)) {
		if (!node.expression) return ""
		if (ts.isStringLiteralLike(node.expression)) return node.expression.text
		return SLOT
	}
	if (ts.isJsxElement(node) || ts.isJsxFragment(node))
		return node.children.map(jsxText).join("")
	if (ts.isJsxSelfClosingElement(node)) return SLOT
	return ""
}

/** Inspect string literals and JSX text without reading comments or code. */
export function sourceDashIssues(source: string, file: string): string[] {
	const errors: string[] = []
	const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true)
	function report(issues: string[], node: ts.Node) {
		const line =
			tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1
		for (const issue of issues) errors.push(`${file}:${line}: ${issue}`)
	}
	function visit(node: ts.Node) {
		if (ts.isJsxElement(node) || ts.isJsxFragment(node))
			report(dashIssues(jsxText(node)), node)
		if (
			(ts.isStringLiteralLike(node) ||
				ts.isTemplateHead(node) ||
				ts.isTemplateMiddle(node) ||
				ts.isTemplateTail(node)) &&
			!ts.isImportDeclaration(node.parent) &&
			!ts.isExportDeclaration(node.parent) &&
			!isCodeString(node)
		) {
			const text =
				ts.isTemplateHead(node) || ts.isTemplateMiddle(node)
					? `${ts.isTemplateMiddle(node) ? SLOT : ""}${node.text}${SLOT}`
					: ts.isTemplateTail(node)
						? `${SLOT}${node.text}`
						: node.text
			const issues = dashIssues(text)
			if (ts.isStringLiteral(node) && isSeparator(node.text))
				issues.push('spaced hyphen separator (" - ")')
			report(issues, node)
		}
		ts.forEachChild(node, visit)
	}
	visit(tree)
	return [...new Set(errors)]
}

/** Every string value inside parsed JSON (GeoJSON names, labels, notes). */
export function jsonDashIssues(value: unknown, where = "$"): string[] {
	if (typeof value === "string")
		return dashIssues(value).map((issue) => `${where}: ${issue}`)
	if (Array.isArray(value))
		return value.flatMap((item, index) =>
			jsonDashIssues(item, `${where}[${index}]`),
		)
	if (value && typeof value === "object")
		return Object.entries(value).flatMap(([key, item]) =>
			jsonDashIssues(item, `${where}.${key}`),
		)
	return []
}
