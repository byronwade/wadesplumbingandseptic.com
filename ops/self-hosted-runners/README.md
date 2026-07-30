# Self-hosted GitHub Actions runners

This repo intentionally **does not use GitHub-hosted runners**
(`ubuntu-latest`, `windows-latest`, `macos-*`).

All workflows in `.github/workflows/` target local runner labels:

| Pool    | Labels                                          | Used by                                 |
| ------- | ----------------------------------------------- | --------------------------------------- |
| CI      | `self-hosted, linux, x64, wades, wades-ci`      | lint, typecheck, format, build, content |
| Quality | `self-hosted, linux, x64, wades, wades-quality` | lighthouse, shadscan, npm audit         |

## Quick start (Docker fleet)

Requirements: Docker + Compose plugin, and a GitHub token that can register
repo runners.

```bash
cd ops/self-hosted-runners
cp .env.example .env
# edit .env → set ACCESS_TOKEN (recommended) or RUNNER_TOKEN
./up.sh
```

Default fleet: **2 CI + 2 quality** runners (`CI_REPLICAS` / `QUALITY_REPLICAS`).

Stop:

```bash
./down.sh
```

Confirm online runners:

`https://github.com/byronwade/wades-plumbing-and-septic/settings/actions/runners`

## Native install (no Docker)

```bash
# Get a registration token from the GitHub UI, then:
./install-native.sh --token "$RUNNER_TOKEN" --name wades-ci-1 --labels wades-ci
./install-native.sh --token "$RUNNER_TOKEN" --name wades-quality-1 --labels wades-quality
```

## Security notes

- Prefer **private repo + trusted contributors** for self-hosted runners.
- Docker runners mount the host Docker socket - treat them as privileged.
- `EPHEMERAL=true` (default) deregisters after each job to reduce sticky state.
- Never commit `.env` or registration tokens.

## Workflow map

- `.github/workflows/ci.yml` - parallel lint / typecheck / format / build
- `.github/workflows/content.yml` - markdown frontmatter + content integrity
- `.github/workflows/quality.yml` - shadscan, Lighthouse budgets, npm audit
- `.github/workflows/runner-health.yml` - scheduled pool ping every 6 hours

## Policy

`scripts/ci/assert-self-hosted-only.mjs` fails if any workflow introduces a
GitHub-hosted `runs-on` label.
