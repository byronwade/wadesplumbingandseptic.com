import ts from "typescript"

import { businessFactIssues } from "./business-facts"

/** Inspect public literals and static JSX without mistaking code for copy. */
export function sourceBusinessFactIssues(
	source: string,
	file: string,
): string[] {
	const errors: string[] = []
	const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true)
	function check(text: string, node: ts.Node) {
		const line =
			tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1
		for (const issue of businessFactIssues(text))
			errors.push(`${file}:${line}: ${issue}`)
	}
	function jsxText(node: ts.Node): string {
		if (ts.isJsxText(node) || ts.isStringLiteralLike(node)) return node.text
		if (ts.isJsxExpression(node))
			return node.expression ? jsxText(node.expression) : ""
		if (ts.isJsxElement(node) || ts.isJsxFragment(node))
			return node.children.map(jsxText).join("")
		return ""
	}
	function visit(node: ts.Node) {
		if (ts.isJsxElement(node) || ts.isJsxFragment(node))
			check(jsxText(node), node)
		if (
			ts.isPropertyAssignment(node) &&
			/^(?:priceRange|price|lowPrice|highPrice|aggregateRating|reviewCount|ratingValue)$/.test(
				node.name.getText(tree).replaceAll('"', "").replaceAll("'", ""),
			)
		) {
			errors.push(`${file}: unverified price or rating schema property`)
		}
		if (
			ts.isStringLiteralLike(node) ||
			ts.isTemplateHead(node) ||
			ts.isTemplateMiddle(node) ||
			ts.isTemplateTail(node)
		) {
			// Existing image filenames are URLs, not service claims. A $1 token
			// is permitted only as a replacement for a real regex capture group.
			const parent = node.parent
			const replacement =
				ts.isCallExpression(parent) &&
				ts.isPropertyAccessExpression(parent.expression) &&
				/^(?:replace|replaceAll)$/.test(parent.expression.name.text) &&
				parent.arguments[1] === node &&
				/^\$[1-9]$/.test(node.text) &&
				parent.arguments[0] &&
				ts.isRegularExpressionLiteral(parent.arguments[0]) &&
				(parent.arguments[0].text.match(/(?<!\\)\((?!\?)/g)?.length ?? 0) >=
					Number(node.text.slice(1))
			if (!replacement && !/^\/?images\//.test(node.text))
				check(node.text, node)
		}
		ts.forEachChild(node, visit)
	}
	visit(tree)
	return [...new Set(errors)]
}
