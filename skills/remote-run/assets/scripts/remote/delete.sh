#!/usr/bin/env bash
# Delete specific paths on the server: scripts/remote/delete.sh [--recursive] <path>...
# For untracked leftovers only: code tracked by Git is removed by deleting it locally and syncing.
# Each path is relative to the project root on the server and is named explicitly; there are no
# wildcards or defaults. Refused, to protect weights, data, and Run evidence: paths under
# REMOTE_SERVER_DIRS, runs/, or .git; files matching REMOTE_PROTECTED_PATTERNS; directories that
# contain such a file; and paths tracked by the deployed commit. The user removes those directly.
set -euo pipefail
cd "$(dirname "$0")/../.."
source scripts/remote/remote.env

recursive=0
if [ "${1:-}" = --recursive ]; then
  recursive=1
  shift
fi
if [ $# -eq 0 ]; then
  echo "usage: delete.sh [--recursive] <path>..." >&2
  exit 2
fi

patterns=${REMOTE_PROTECTED_PATTERNS:-}
paths=()
for p in "$@"; do
  while [ "${p#./}" != "$p" ]; do p=${p#./}; done
  p=${p%/}
  case "$p" in
    ""|.|/*|..|../*|*/../*|*/..) echo "refusing '$p': give a path inside the project, relative to its root" >&2; exit 2 ;;
    -*) echo "refusing '$p': put --recursive first; paths may not start with -" >&2; exit 2 ;;
    *[\*\?\[]*) echo "refusing '$p': name each path explicitly, without wildcards" >&2; exit 2 ;;
  esac
  top=${p%%/*}
  case " $REMOTE_SERVER_DIRS runs .git " in
    *" $top "*) echo "refusing '$p': $top is protected; delete it on the server yourself if it must go" >&2; exit 2 ;;
  esac
  base=${p##*/}
  set -f
  for pattern in $patterns; do
    case "$base" in
      $pattern) set +f; echo "refusing '$p': it matches protected pattern $pattern; delete weights on the server yourself" >&2; exit 2 ;;
    esac
  done
  set +f
  paths+=("$p")
done

ssh "$REMOTE_HOST" "cd $(printf '%q' "$REMOTE_DIR") && recursive=$recursive patterns=$(printf '%q' "$patterns") bash -s -- $(printf '%q ' "${paths[@]}")" <<'EOF'
status=0
for p in "$@"; do
  # Deleting tracked code here would leave the server tree modified and block the next sync.
  if [ -d .git ] && [ -n "$(git ls-files -- "$p")" ]; then
    echo "skipped $p: it is tracked by the deployed code; delete it locally and sync instead" >&2
    status=1
    continue
  fi
  # Check for a link first so a link to a directory is removed without touching its target.
  if [ -L "$p" ] || [ -f "$p" ]; then
    rm -- "$p" && echo "removed $p"
  elif [ -d "$p" ]; then
    if [ "$recursive" != 1 ]; then
      echo "skipped $p: it is a directory; pass --recursive to delete it" >&2
      status=1
      continue
    fi
    # A directory holding any protected file is left for the user to inspect and remove.
    set -f
    names=()
    for pattern in $patterns; do
      names+=(-o -name "$pattern")
    done
    set +f
    protected=""
    if [ ${#names[@]} -gt 0 ]; then
      protected=$(find "$p" -type f \( "${names[@]:1}" \) -print -quit)
    fi
    if [ -n "$protected" ]; then
      echo "skipped $p: it contains protected file $protected; delete it on the server yourself" >&2
      status=1
    else
      rm -r -- "$p" && echo "removed directory $p"
    fi
  else
    echo "skipped $p: not found" >&2
    status=1
  fi
done
exit $status
EOF
