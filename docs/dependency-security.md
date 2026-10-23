# Dependency security review

Reviewed October 22, 2026. Recheck by October 29, 2026, or whenever dependencies,
ESLint configuration, or the advisory change, whichever comes first.

## Run the native audits

Use Node 22 or newer and the root `package-lock.json`:

```bash
npm ci
npm run audit:dependencies
npm run audit:production
npm explain braces
```

Both audit scripts use npm's native report and exit status. They fail on high or
critical findings, registry errors, and other npm failures. Neither suppresses
advisories. The production audit omits development dependencies, so it does not
replace the full audit or cover all build and lint tools. These root commands do
not audit the independently installed Eve sidecar.

On the reviewed lockfile, the full audit exits 1 with five high findings and the
production audit exits 0 with zero findings. This review does not fix the advisory
or declare the dependency tree vulnerability-free.

## One advisory, five affected packages

[GHSA-vfj7-8cjw-p6xm / CVE-2026-93687](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
affects `braces` through 3.0.3. Deeply nested, attacker-controlled brace patterns
can exhaust the stack in its recursive walkers. The advisory lists no patched
version. The [upstream report](https://github.com/micromatch/braces/issues/70)
is still open at review time.

The installed dependency chain is:

```text
eslint-config-next@16.3.0-preview.10 (root devDependency)
  @next/eslint-plugin-next@16.3.0-preview.10
    fast-glob@3.3.1
      micromatch@4.0.8
        braces@3.0.3
```

npm reports `braces` and the four packages above it as high findings. These are
five affected package entries propagated from the same advisory, rather than
five independent advisories. All five lockfile entries have `dev: true`.

## Exposure and decision

The installed Next lint plugin uses `fast-glob` in `dist/utils/get-root-dirs.js`
to expand `settings.next.rootDir` patterns from ESLint configuration. The current
root `eslint.config.mjs` supplies no such pattern; the helper defaults to
`context.cwd`. The package is imported by lint tooling, but this identified glob
call is conditional on a configured root pattern. Root application code and
build scripts do not directly import the affected packages. An observed full
root lint run passed with zero calls to `fast-glob`. No public-request
input into this lint configuration was found. The zero-finding production audit
supports the dependency classification; it is not a proof about every bundled
library or every possible execution path.

Defer remediation of this specific development-tool advisory until the next
review. Continue running lint only with trusted repository configuration. Review
any new `settings.next.rootDir` value before execution, and do not pass external
patterns to the affected dependency. Treat newly reachable, new, or changed
findings as a fresh security decision.

Registry checks found `braces@3.0.3` is still the newest release. Next lint plugin
versions `16.3.0-preview.10`, `16.4.2` (latest), and `16.5.0-canary.24` all retain
`fast-glob@3.3.1`. Updating within those lines does not remove this dependency.
npm proposes `eslint-config-next@14.2.35` as a forced major downgrade; this is not
a compatible security patch for the current Next 16 configuration. No forced
downgrade, unreviewed fork, package override, or audit exclusion was applied.

When upstream publishes a fix, inspect its changelog and dependency tree, update
only what is necessary, rerun both audits and the five required local acceptance
commands, and replace this dated assessment. Remove the deferral once resolved.
