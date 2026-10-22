#!/usr/bin/env bash
# Stop a background job and note it in its job log: scripts/remote/stop.sh <name>
set -euo pipefail
cd "$(dirname "$0")/../.."
source scripts/remote/remote.env
name=${1:?usage: stop.sh <name>}

ssh "$REMOTE_HOST" "cd $(printf '%q' "$REMOTE_DIR") && name=$(printf '%q' "$name") bash -s" <<'EOF'
if ! tmux has-session -t "=$name" 2>/dev/null; then echo "job $name is not running"; exit 1; fi
tmux kill-session -t "=$name"
if ls "runs/$name/logs/"*job.log >/dev/null 2>&1; then meta=$(ls -t "runs/$name/logs/"*job.log | head -n 1); else meta="tmp/jobs/$name/job.log"; fi
[ -f "$meta" ] && echo "[stopped by stop.sh at $(date '+%F %T')]" >> "$meta"
echo "stopped $name"
EOF
