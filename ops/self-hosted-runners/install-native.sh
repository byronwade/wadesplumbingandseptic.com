#!/usr/bin/env bash
# Install a native (non-Docker) GitHub Actions runner on Linux x64.
# Usage:
#   ./install-native.sh --token <REGISTRATION_TOKEN> --name wades-ci-1 --labels wades-ci
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/byronwade/wades-plumbing-and-septic}"
RUNNER_VERSION="${RUNNER_VERSION:-2.325.0}"
INSTALL_ROOT="${INSTALL_ROOT:-$HOME/actions-runners}"
TOKEN=""
NAME=""
LABELS="wades-ci"

while [[ $# -gt 0 ]]; do
	case "$1" in
		--token)
			TOKEN="$2"
			shift 2
			;;
		--name)
			NAME="$2"
			shift 2
			;;
		--labels)
			LABELS="$2"
			shift 2
			;;
		--repo)
			REPO_URL="$2"
			shift 2
			;;
		*)
			echo "Unknown arg: $1" >&2
			exit 1
			;;
	esac
done

if [[ -z "$TOKEN" || -z "$NAME" ]]; then
	echo "Usage: $0 --token <TOKEN> --name <RUNNER_NAME> [--labels wades-ci|wades-quality]" >&2
	exit 1
fi

DIR="${INSTALL_ROOT}/${NAME}"
mkdir -p "$DIR"
cd "$DIR"

if [[ ! -f ./config.sh ]]; then
	ARCHIVE="actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz"
	curl -fsSL -o "$ARCHIVE" \
		"https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz"
	tar xzf "$ARCHIVE"
	rm -f "$ARCHIVE"
fi

./config.sh --unattended \
	--url "$REPO_URL" \
	--token "$TOKEN" \
	--name "$NAME" \
	--labels "self-hosted,linux,x64,wades,${LABELS}" \
	--work "_work" \
	--replace

echo "Configured ${NAME}. Start with:"
echo "  cd ${DIR} && ./run.sh"
echo "Or install as a service:"
echo "  cd ${DIR} && sudo ./svc.sh install && sudo ./svc.sh start"
