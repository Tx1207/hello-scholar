#!/usr/bin/env bash
# Copy a Run's small outputs back to the local project: scripts/remote/pull.sh <run-id> [subdir]
# The default subdir is results/. Large artifacts stay on the server; the Record cites their paths.
set -euo pipefail
cd "$(dirname "$0")/../.."
source scripts/remote/remote.env
run=${1:?usage: pull.sh <run-id> [subdir]}
sub=${2:-results}
mkdir -p "runs/$run/$sub"
rsync -az --no-owner --no-group "$REMOTE_HOST:$REMOTE_DIR/runs/$run/$sub/" "runs/$run/$sub/"
echo "pulled runs/$run/$sub"
