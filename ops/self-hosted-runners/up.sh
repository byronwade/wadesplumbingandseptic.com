#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
	echo "Missing .env - copy .env.example to .env and add ACCESS_TOKEN or RUNNER_TOKEN." >&2
	exit 1
fi

# shellcheck disable=SC1091
source .env

if [[ -z "${ACCESS_TOKEN:-}" && -z "${RUNNER_TOKEN:-}" ]]; then
	echo "Set ACCESS_TOKEN or RUNNER_TOKEN in .env" >&2
	exit 1
fi

CI_REPLICAS="${CI_REPLICAS:-2}"
QUALITY_REPLICAS="${QUALITY_REPLICAS:-2}"

echo "Starting self-hosted fleet: ci=${CI_REPLICAS} quality=${QUALITY_REPLICAS}"
docker compose pull
docker compose up -d --scale "runner-ci=${CI_REPLICAS}" --scale "runner-quality=${QUALITY_REPLICAS}" --remove-orphans
docker compose ps
echo
echo "Runners should appear under:"
echo "  ${REPO_URL:-https://github.com/byronwade/wades-plumbing-and-septic}/settings/actions/runners"
echo
echo "Workflows target labels:"
echo "  [self-hosted, linux, x64, wades, wades-ci]"
echo "  [self-hosted, linux, x64, wades, wades-quality]"
