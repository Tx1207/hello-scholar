#!/usr/bin/env bash
# Show a job's state, job log, recent output, and GPU use: scripts/remote/logs.sh <name> [lines]
set -euo pipefail
cd "$(dirname "$0")/../.."
source scripts/remote/remote.env
name=${1:?usage: logs.sh <name> [lines]}
lines=${2:-50}

ssh "$REMOTE_HOST" "cd $(printf '%q' "$REMOTE_DIR") && name=$(printf '%q' "$name") lines=$(printf '%q' "$lines") bash -s" <<'EOF'
if ls "runs/$name/logs/"*job.log >/dev/null 2>&1; then meta=$(ls -t "runs/$name/logs/"*job.log | head -n 1); else meta="tmp/jobs/$name/job.log"; fi
prefix=${meta%job.log}
if tmux has-session -t "=$name" 2>/dev/null; then echo "[state] running"; else echo "[state] not running"; fi
if [ ! -f "$meta" ]; then echo "no logs for $name"; exit 1; fi
echo "[log] $meta"
cat "$meta"
echo "--- stdout, last $lines lines"; tail -n "$lines" "${prefix}stdout.log"
echo "--- stderr, last $lines lines"; tail -n "$lines" "${prefix}stderr.log"
echo "--- GPU"
nvidia-smi --query-gpu=index,utilization.gpu,memory.used,memory.total --format=csv,noheader 2>/dev/null || echo "nvidia-smi unavailable"
EOF
