#!/usr/bin/env bash
# Push local code to the server. Server-only directories and anything the server wrote under
# runs/ are never deleted. Runs on the local machine; compatible with bash 3.2 and openrsync.
set -euo pipefail
cd "$(dirname "$0")/../.."
source scripts/remote/remote.env

excludes=(--exclude '.git/' --exclude '__pycache__/' --exclude '/runs/')
for d in $REMOTE_SERVER_DIRS; do
  excludes+=(--exclude "/$d/")
done

ssh "$REMOTE_HOST" "mkdir -p $(printf '%q' "$REMOTE_DIR")"

# Code mirrors the local tree. Excluded paths are neither sent nor deleted; never add
# --delete-excluded, which would delete the server-only directories. --no-owner and --no-group
# keep a root login on the server from storing the local user ID as the file owner.
rsync -az --no-owner --no-group --delete "${excludes[@]}" ./ "$REMOTE_HOST:$REMOTE_DIR/"

# Run Records are added or updated without --delete, so logs and results that jobs wrote
# on the server under runs/ survive every sync.
if [ -d runs ]; then
  rsync -az --no-owner --no-group --exclude '*/logs/' runs/ "$REMOTE_HOST:$REMOTE_DIR/runs/"
fi
