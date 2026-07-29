#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"

const WORKFLOWS = path.join(process.cwd(), ".github", "workflows")
const FORBIDDEN =
	/\bruns-on\s*:\s*(?:ubuntu-latest|ubuntu-\d+|windows-latest|windows-\d+|macos-latest|macos-\d+|\[?[^\]]*ubuntu-latest)/i

const files = fs
	.readdirSync(WORKFLOWS)
	.filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"))
	.map((name) => path.join(WORKFLOWS, name))

let failed = false

for (const file of files) {
	const text = fs.readFileSync(file, "utf8")
	const lines = text.split("\n")
	lines.forEach((line, index) => {
		if (line.trimStart().startsWith("#")) return
		if (FORBIDDEN.test(line)) {
			failed = true
			console.error(
				`${path.relative(process.cwd(), file)}:${index + 1}: GitHub-hosted runner label is forbidden`,
			)
			console.error(`  ${line.trim()}`)
		}
	})

	if (!/runs-on:\s*\[self-hosted/.test(text) && /runs-on:/.test(text)) {
		failed = true
		console.error(
			`${path.relative(process.cwd(), file)}: expected runs-on to include self-hosted label list`,
		)
	}
}

if (failed) {
	console.error(
		"\nPolicy: all jobs must use self-hosted runners (labels including self-hosted + wades).",
	)
	process.exit(1)
}

console.log(`Checked ${files.length} workflow files — self-hosted only ✓`)
