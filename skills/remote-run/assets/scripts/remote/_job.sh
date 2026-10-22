#!/usr/bin/env bash
# Server-side executor: _job.sh <name> <command...>, started from the project root.
# Writes stdout.log and stderr.log separately, plus job.log with the start line, the synced
# source commit, and a final "[exit N at ...]" line.
# A formal Run (RUN_ID set) logs its one research execution to runs/<RUN_ID>/logs/; with STARTUP=1
# it logs a repeatable startup check to runs/<RUN_ID>/logs/startup-NN.*. Other jobs log to tmp/jobs/<name>/.
# Requires bash 4.4 or later on the server for waiting on the stderr process substitution.
set -o pipefail
name=$1
shift
root=$(pwd)
source scripts/remote/remote.env

kind=job
if [ -n "${RUN_ID:-}" ]; then
  logdir="$root/runs/$RUN_ID/logs"
  mkdir -p "$logdir"
  if [ "${STARTUP:-0}" = 1 ]; then
    # Startup checks belong to the planned Record and may repeat; each keeps its own numbered logs.
    # They precede the research execution, so they stop once it has started; a later check would
    # also hide the real run from logs.sh.
    if [ -e "$logdir/job.log" ]; then
      echo "runs/$RUN_ID has already started its research execution; checks for another execution belong to a new Run." >&2
      exit 3
    fi
    n=1
    while [ -e "$logdir/$(printf 'startup-%02d' "$n").job.log" ]; do n=$((n + 1)); done
    prefix="$logdir/$(printf 'startup-%02d' "$n")."
    kind="startup check"
  else
    # One Run holds one research execution; its evidence is never overwritten.
    if [ -e "$logdir/job.log" ]; then
      echo "runs/$RUN_ID already has a research execution. Use --startup for startup checks; an authorized retry after a failed execution is a new Run with derived_from set to $RUN_ID." >&2
      exit 3
    fi
    prefix="$logdir/"
    kind="research execution"
  fi
else
  logdir="$root/tmp/jobs/$name"
  mkdir -p "$logdir"
  prefix="$logdir/"
fi
out="${prefix}stdout.log"
err="${prefix}stderr.log"
meta="${prefix}job.log"
: > "$out"
: > "$err"

{
  echo "[start $(date '+%F %T')] [$kind] $*"
  echo "[source ${SOURCE_REV:-unknown}] [host $(hostname)] [cwd $root]"
} > "$meta"

if [ -n "${REMOTE_CONDA_ACTIVATE:-}" ]; then
  # Activate directly instead of "conda run", which buffers output.
  source "$REMOTE_CONDA_ACTIVATE" "${REMOTE_ENV:-base}" || { echo "[exit 4 at $(date '+%F %T')] conda activation failed" >> "$meta"; exit 4; }
fi
export PYTHONUNBUFFERED=1

( "$@" 2> >(tee -a "$err" >&2); code=$?; wait $! 2>/dev/null; exit $code ) | tee -a "$out"
code=${PIPESTATUS[0]}
echo "[exit $code at $(date '+%F %T')]" >> "$meta"
exit "$code"
