#!/usr/bin/env bash
# Optional local dry-run using nektos/act against the self-hosted workflows.
# This does not register GitHub runners; it executes job steps locally in Docker.
set -euo pipefail

if ! command -v act >/dev/null; then
	echo "Install act first: https://github.com/nektos/act" >&2
	exit 1
fi

WORKFLOW="${1:-ci.yml}"
EVENT="${2:-push}"

# Map the self-hosted label set onto the local act runner platform.
exec act "$EVENT" \
	-W ".github/workflows/${WORKFLOW}" \
	-P "self-hosted=catthehacker/ubuntu:act-22.04" \
	-P "linux=catthehacker/ubuntu:act-22.04" \
	-P "x64=catthehacker/ubuntu:act-22.04" \
	-P "wades=catthehacker/ubuntu:act-22.04" \
	-P "wades-ci=catthehacker/ubuntu:act-22.04" \
	-P "wades-quality=catthehacker/ubuntu:act-22.04" \
	--container-architecture linux/amd64
