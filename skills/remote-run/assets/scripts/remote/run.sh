#!/usr/bin/env bash
# Sync code, then run a command on the server. Runs on the local machine.
#   scripts/remote/run.sh python test.py                        # foreground, short task
#   scripts/remote/run.sh --bg --name train python train.py     # background tmux job
#   scripts/remote/run.sh --run <run-id> --startup python train.py --max-steps 2   # repeatable startup check
#   scripts/remote/run.sh --bg --run <run-id> python train.py   # the Run's one research execution
set -euo pipefail
cd "$(dirname "$0")/../.."
source scripts/remote/remote.env

bg=0
startup=0
name=""
run_id=""
while [ $# -gt 0 ]; do
  case "$1" in
    --bg) bg=1; shift ;;
    --name) name="${2:?--name needs a value}"; shift 2 ;;
    --run) run_id="${2:?--run needs a Run ID}"; shift 2 ;;
    --startup) startup=1; shift ;;
    --) shift; break ;;
    *) break ;;
  esac
done
if [ $# -eq 0 ]; then
  echo "usage: run.sh [--bg] [--name NAME] [--run RUN_ID [--startup]] <command...>" >&2
  exit 2
fi
# Deleting or moving server files goes through delete.sh, which protects weights and data.
# This catches direct use only; a deletion wrapped in another program is not detected.
blocked=0
case "$1" in
  rm|rmdir|mv|shred|unlink) blocked=1 ;;
  sudo) case "${2:-}" in rm|rmdir|mv|shred|unlink) blocked=1 ;; esac ;;
  find) for a in "$@"; do [ "$a" = -delete ] && blocked=1; done ;;
esac
if [ "$blocked" -eq 1 ]; then
  echo "run.sh does not delete or move server files; remove specific paths with scripts/remote/delete.sh" >&2
  exit 2
fi
if [ "$startup" -eq 1 ] && [ -z "$run_id" ]; then
  echo "--startup needs --run RUN_ID: startup checks are logged in that Run's planned Record" >&2
  exit 2
fi
[ -n "$name" ] || name="$run_id"
if [ -z "$name" ]; then
  if [ "$bg" -eq 1 ]; then
    echo "background jobs need --name or --run" >&2
    exit 2
  fi
  name="fg-$(date +%m%d-%H%M%S)"
fi
case "$name" in
  *[!A-Za-z0-9_-]*) echo "job name may contain only letters, digits, _ and -: $name" >&2; exit 2 ;;
esac

# The server copy has no .git, so the job log records which local commit was synced.
if rev=$(git rev-parse --short HEAD 2>/dev/null); then
  dirty=$(git status --porcelain 2>/dev/null)
  [ -z "$dirty" ] || rev="$rev+uncommitted"
else
  rev=unknown
  dirty=""
fi

# A research execution must map to one commit so the Run can be reproduced and its code reused.
if [ -n "$run_id" ] && [ "$startup" -eq 0 ]; then
  if [ "$rev" = unknown ]; then
    echo "a research execution needs the project in Git so the Run records its exact code version" >&2
    exit 2
  fi
  if [ -n "$dirty" ]; then
    echo "commit the pending changes before the research execution of $run_id; startup checks and ordinary jobs may run on uncommitted code" >&2
    exit 2
  fi
fi

bash scripts/remote/sync.sh

dir=$(printf '%q' "$REMOTE_DIR")
job="cd $dir && SOURCE_REV=$(printf '%q' "$rev") RUN_ID=$(printf '%q' "$run_id") STARTUP=$startup bash scripts/remote/_job.sh $(printf '%q' "$name") $(printf '%q ' "$@")"

if [ "$bg" -eq 1 ]; then
  # "=NAME" makes tmux match the session name exactly; a bare name also matches by prefix.
  ssh "$REMOTE_HOST" "if tmux has-session -t $(printf '%q' "=$name") 2>/dev/null; then echo 'job $name is already running' >&2; exit 1; fi; \
tmux new-session -d -s $(printf '%q' "$name") $(printf '%q' "$job") && echo 'started $name in the background; check it with scripts/remote/logs.sh $name'"
else
  ssh "$REMOTE_HOST" "$job"
fi
