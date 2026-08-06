# Agent instructions

This file governs AI-assisted work in this repository. Keep it concise, current, and enforceable. Put package-specific facts in the nearest nested `AGENTS.md`; do not repeat root rules.

## Mission

Complete the requested change while leaving its affected dependency cone healthier than before.

Success means:

- requested behavior is correct and verified;
- existing concepts are reused before new ones are created;
- architecture, security, accessibility, maintainability, and measured performance do not regress;
- relevant duplication, dead code, and accidental complexity are reduced;
- recurring objective failures become mechanical checks;
- unrelated repository-wide rewrites do not enter the task.

Optimize for the fewest necessary concepts and the lowest future change cost, not merely fewer lines, files, or abstractions.

## Authority

Apply instructions in this order:

1. User request and acceptance criteria.
2. Closest applicable nested `AGENTS.md`.
3. This file.
4. Architecture decisions, public contracts, security requirements, and repository documentation.
5. Existing conventions, only when they do not degrade code health.

Report meaningful conflicts. Never preserve a bad pattern solely because it already exists.

## Required Workflow

For every nontrivial task:

1. Frame the behavior, constraints, non-goals, and verification target.
2. Reconnoiter the relevant code before editing.
3. Decide whether to reuse, configure, extend, extract, or create.
4. Implement the smallest coherent solution.
5. Recursively clean the task-related dependency cone until it converges.
6. Verify with deterministic checks and full-diff review.
7. Report decisions, checks, cleanup, and remaining findings truthfully.

Before implementation, provide a compact decision record for substantial work:

```text
Target and acceptance criteria:
Existing candidates inspected:
Reuse/extend/extract/create decision:
Expected dependency cone:
Verification plan:
```

## Reconnaissance Before Creation

Expand inspection progressively:

1. Read nearest instructions, manifests, architecture notes, tests, and CI configuration.
2. Inspect target symbols, direct callers, dependencies, data contracts, and owners.
3. Search repository-wide for exact and semantic equivalents.
4. Inspect comparable completed features and tests.
5. Inspect history when intent or ownership is unclear.
6. Run a narrow baseline check before risky work.

Before creating any component, hook, service, utility, formatter, validator, schema, type, client, state container, query, or abstraction, search for:

- equivalent names, inputs, outputs, invariants, and side effects;
- shared-package exports and internal package APIs;
- copies or near-copies in other applications;
- platform, language, framework, or existing-dependency capabilities;
- deprecated implementations whose callers should be migrated;
- tests that reveal the intended contract.

No exact name match does not mean no equivalent exists. Search by behavior and domain meaning.

## Reuse Decision Ladder

Choose the first sound option:

1. Reuse unchanged when semantics and lifecycle match.
2. Configure or compose through existing props, slots, callbacks, adapters, or children.
3. Extend coherently when the behavior belongs to the same concept and does not create unrelated flags or invalid states.
4. Extract shared behavior when multiple implementations express one stable concept with a clear owner.
5. Create new only when existing concepts differ materially or extension would confuse ownership and evolution.

New code requires a brief reason earlier options were rejected.

A shared abstraction must have one stable responsibility, a clear owner, a simpler interface than the behavior it hides, and lower change amplification than separate implementations. Do not merge incidental similarity. Do not copy a shared concept merely because presentation differs; prefer composition around one canonical primitive.

Do not add wrappers that only rename an API or forward arguments without enforcing a meaningful invariant.

## Bounded Recursive Cleanup

"Leave it better" applies to the task-related dependency cone, not the whole repository.

Seed a queue with each changed file, symbol, contract, and test. For each item:

1. Inspect direct callers and dependencies.
2. Search for semantic duplicates and competing sources of truth.
3. Find dead paths, obsolete compatibility code, boundary violations, and defects exposed by the change.
4. Classify each finding as fix now, migrate atomically, or record.
5. Enqueue only items directly affected by an accepted fix or migration.
6. Repeat until no task-related violation remains.

Fix now when the issue:

- is introduced, exposed, or made riskier by the task;
- is in code already being changed;
- is a correctness, security, data-integrity, accessibility, or measured-performance defect;
- is a duplicate or competing implementation of the same concept;
- is dead code or an obsolete export revealed by migration;
- blocks correct architecture or complete caller migration;
- is small, safe, and verifiable.

Migrate atomically when:

- a contract, schema, shared primitive, or boundary must change;
- every current caller can be updated and verified together;
- parallel old and new paths would create drift.

When the user or repository explicitly identifies the product as pre-production, internal backward compatibility is not a default requirement: use the better contract, migrate every caller, and delete the obsolete path. Persisted data, public APIs, external integrations, migration history, and user-visible behavior remain protected unless explicitly authorized otherwise.

Record instead of fixing when the issue is:

- unrelated to the request or its dependency/contract chain;
- speculative, subjective, or unsupported by evidence;
- a broad migration without a safe verification path;
- likely to create a mixed-purpose diff;
- dependent on a separate product or architecture decision.

Stop when acceptance criteria are met, affected callers are migrated, task-related duplicates and obsolete paths are gone, checks pass, and the next change would be unrelated or disproportionately risky.

Each recursion must reduce a concrete cost: duplication, coupling, obscurity, invalid states, dead code, unsafe operations, failing checks, or measured resource use. Moving, renaming, formatting, or abstracting without reducing such a cost is not cleanup.

## Architecture Invariants

- Organize around stable responsibilities and hidden change-prone decisions, not execution order.
- Prefer narrow, capable interfaces over shallow abstractions.
- Maintain high cohesion, low coupling, explicit ownership, one-way dependencies, and no cycles.
- Keep domain rules in their domain; generic UI/shared packages must not become dumping grounds.
- Keep application workflows out of generic primitives.
- Keep side effects at explicit boundaries; prefer deterministic domain logic where practical.
- Maintain one source of truth for every invariant; derive values instead of synchronizing duplicated state.
- Do not bypass layers or import through backdoors for convenience.
- Avoid indiscriminate barrel exports and leaked implementation details.
- Do not add packages, layers, services, events, factories, or configuration for hypothetical future use.
- Enforce important architecture with dependency or structural checks rather than diagrams alone.

## Simplicity and Code Quality

- Prefer language, platform, framework, and existing-library capabilities over custom machinery.
- Prefer direct readable flow over clever compression and needless indirection.
- Do not equate shorter code with faster or better code.
- Do not duplicate constants, business rules, schemas, formatting, validation, or error handling.
- Avoid catch-all utils, helpers, and common modules without cohesive ownership.
- Make invalid states unrepresentable when practical.
- Do not use `any`, unsafe casts, suppressions, ignored promises, swallowed errors, or disabled rules as shortcuts.
- Comments explain intent, tradeoffs, and invariants, not obvious syntax.
- Delete replaced implementations, dead exports, abandoned files, commented-out code, and temporary shims.
- Modify generated code through its source or generator.
- Before adding a dependency, check repository/platform alternatives and evaluate maintenance, security, runtime cost, bundle size, and overlap.

## TypeScript and React

When applicable:

- preserve strict inference and validate untrusted data at boundaries;
- derive render values instead of storing synchronized state;
- use effects only to synchronize with external systems;
- do not memoize without a demonstrated identity or performance need;
- keep server-capable work off the client when supported;
- use canonical formatting, class-name, schema, data-access, and error primitives;
- preserve accessibility, keyboard behavior, stable identity, hydration safety, and deterministic rendering.

## Performance Protocol

Performance claims require evidence:

1. Establish a representative baseline.
2. Measure or profile one level below the visible symptom.
3. Identify the dominant bottleneck.
4. Change the smallest responsible design or implementation.
5. Repeat the same measurement.
6. Preserve a benchmark or budget when regression risk matters.

Prioritize algorithms, database/query behavior, network trips, serialization, caching, client JavaScript, rendering, allocations, concurrency, and hot-path I/O before cosmetic micro-optimization. Do not claim speed from fewer lines, different syntax, or a newer library without representative measurement.

## Correctness, Testing, and Safety

- Test observable behavior and public contracts, not private arrangement.
- Before risky refactoring, identify or add characterization tests.
- A bug fix should include a regression test that fails for the defect when practical.
- Cover success, failure, boundary, authorization, and concurrency cases as relevant.
- Prefer result/state assertions over brittle interaction assertions and excessive mocking.
- Keep tests deterministic and readable; test code may repeat setup when abstraction would hide the scenario.
- Run checks from narrowest to broadest: affected tests, package tests, type check, lint/static analysis, integration/end-to-end, then build/repository checks as risk requires.
- Never weaken a valid test merely to pass a change.
- Validate and normalize data at trust boundaries.
- Enforce authorization on the trusted side.
- Use parameterized data access and context-appropriate escaping.
- Keep secrets out of source, logs, client bundles, fixtures, and errors.
- Centralize risky operations behind safe typed abstractions.
- Prefer allowlists, least privilege, and structural prevention of vulnerability classes.

## Mechanical Prevention and Ratchets

When an objective failure can recur, add the smallest reliable sensor:

- type invariant;
- formatter, linter, or AST rule;
- forbidden-import or dependency-boundary check;
- exact/near-duplicate detector;
- dead-file/export check;
- contract, regression, property, or architecture test;
- secret, dependency, or static-security scan;
- bundle, latency, query-count, memory, or throughput budget.

Sensors should be deterministic where possible, actionable, low-noise, and fast enough for their execution stage. Messages must explain how to correct violations.

For existing debt, record a baseline, block new violations, and reduce the baseline when touched. Do not introduce a noisy repository-wide gate that will be ignored. Prefer safe autofixes when semantics are unambiguous.

## Verification Gate

Before completion:

- review the full diff;
- verify every acceptance criterion and non-goal;
- confirm existing candidates were reused or explicitly rejected;
- search again for duplicate helpers, components, services, schemas, and sources of truth;
- migrate every affected caller, import, export, test, and contract;
- remove dead and obsolete code;
- verify package, dependency, and client/server boundaries;
- run checks appropriate to the risk;
- compare before/after measurements for performance claims;
- confirm no unrelated cleanup entered the diff;
- run `git diff --check` or the repository equivalent;
- state any unrun check and why.

Never call a solution "best," "optimal," "safe," or "fully verified" without evidence.

## Required Final Report

- Decision: chosen design and why.
- Reused: existing concepts used.
- Created or extended: what changed and why reuse unchanged was insufficient.
- Recursive cleanup: duplicates, dead paths, or debt removed in the dependency cone.
- Mechanical prevention: sensors added or the highest-value next sensor.
- Verification: exact checks and results.
- Remaining findings: relevant issues intentionally kept out of this change.

## Never

- create before searching;
- copy-paste implementations across applications by default;
- reimplement an existing canonical helper locally;
- force unrelated concepts together merely to satisfy DRY;
- create wrappers with no invariant or meaningful simplification;
- preserve obsolete internal paths solely for pre-production compatibility;
- perform an unbounded cleanup rewrite during a focused task;
- optimize without measurement;
- broaden public exports for convenience;
- suppress types, lint, tests, security findings, or errors without a justified exception;
- leave old and new implementations competing after migration;
- mistake passing AI-generated tests for proof that the requested behavior is correct.

## Repository-Specific Rules

Cross-cutting rules that apply everywhere in this repository, not to one package. Package-specific facts belong in the nearest nested `AGENTS.md` (`content/AGENTS.md`, `seo/AGENTS.md`, `automation/seo-agent/AGENTS.md`) instead of here.

### Typography: no dash punctuation

**Never use dashes as punctuation in user-facing copy.**

Banned characters and patterns:

- Em dash (Unicode U+2014), including `&mdash;` and `&#8212;`
- En dash (Unicode U+2013), including `&ndash;` and `&#8211;`
- Spaced hyphen asides: `-` (space, hyphen, space) used like a dash

This includes:

- Markdown under `content/` (pages, posts, services)
- UI copy in `app/`, `components/`, and `lib/`
- Meta descriptions, titles, alt text, and JSON-LD strings
- GeoJSON / data strings shown to users

#### Use real punctuation instead

| Instead of                          | Prefer                                        |
| ----------------------------------- | --------------------------------------------- |
| `work - steep slopes - that is`     | `work (steep slopes), that is`                |
| `property - and most of it`         | `property, and most of it`                    |
| `suddenly - they build`             | `suddenly. They build`                        |
| `Call to Schedule - 831…`           | `Call to Schedule: 831…`                      |
| `Monday - Friday` / `Monday–Friday` | `Monday to Friday` or `Monday through Friday` |
| `9am - 5pm` / `9am–5pm`             | `9am to 5pm`                                  |
| `3–5 years`                         | `3 to 5 years`                                |
| `"Great work!" - Sarah, Aptos`      | `"Great work!" (Sarah, Aptos)`                |

#### Still allowed

- Compound words and hyphenated modifiers with **no spaces**: `family-owned`, `well-fed`, `drain-field`
- Markdown list markers: `- item`
- Frontmatter fences: `---`
- Mathematical minus in code: `a - b`

CI validates markdown under `content/` and fails if banned dash punctuation is present.

### Optimization & health-check tooling

Use these to find dead code, architecture smells, and render-performance problems before writing new abstractions by hand; they are audit tools, not authorities, so triage their output through the same Reuse Decision Ladder and Bounded Recursive Cleanup rules above rather than acting on every line automatically.

| Tool                                                             | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Command                       |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| [Knip](https://knip.dev)                                         | Unused files, exports, and dependencies across the whole module graph (catches cross-file dead code ESLint can't see)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `npm run knip`                |
| [Biome](https://biomejs.dev) + [Ultracite](https://ultracite.ai) | Fast secondary lint check only. `biome.json` extends Ultracite's `core`/`react`/`next` rule presets for stricter, AI-aware linting, with `formatter`/`assist` explicitly disabled for every language block (top-level `formatter.enabled: false` alone is not enough — Ultracite's presets re-enable per-language formatters that would otherwise override it). ESLint + Prettier remain canonical for formatting and the primary lint gate; this is extra signal, not a replacement. **Never run `ultracite init`/`ultracite fix` against this repo** — `init` unconditionally deletes `prettier`/`.prettierrc.json`/`eslint.config.mjs` and rewrites `package.json` as part of switching to its own toolchain, even when passed an invalid `--linter` value that later makes the command crash. If Ultracite's rules ever need retuning, hand-edit `biome.json`'s `extends`/rule-override blocks instead. `nursery.useSortedClasses` and `style.useBlockStatements` are turned off: the former duplicates `prettier-plugin-tailwindcss`, the latter fights this codebase's pervasive braceless single-statement `if` convention | `npm run biome`               |
| [vercel-doctor](https://github.com/Aniket-508/vercel-doctor)     | Scans this Next.js app for patterns that inflate the Vercel bill (long function duration, uncached routes, unoptimized images, expensive cron jobs) plus dead code                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `npm run audit:vercel-doctor` |
| [react-doctor](https://github.com/millionco/react-doctor)        | 60+ rule health scan across React state/effects, performance, architecture, bundle size, security, correctness, and accessibility. Installed as a devDependency with an advisory-only GitHub Actions check on PRs (`.github/workflows/react-doctor.yml`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `npm run doctor`              |
| [shadscan](https://www.shadscan.com)                             | Deterministic, read-only UI-fundamentals audit for shadcn/ui apps (command menus, focus states, form feedback, a11y, mobile behavior)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `npm run audit:shadscan`      |
| [React Scan](https://react-scan.million.dev)                     | Flags unnecessary re-renders at runtime. Needs a live app; run `npm run dev` in one terminal, then this in another                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `npm run audit:react-scan`    |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
