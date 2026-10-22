#!/usr/bin/env bash
# Push local code to the server: scripts/remote/sync.sh [--dry-run] [--list-stale] [--confirm-first-sync]
# Runs on the local machine; compatible with bash 3.2 and openrsync.
# Step 1 adds and updates files and never deletes. REMOTE_SERVER_DIRS, REMOTE_LOCAL_EXCLUDES, and
# REMOTE_PROTECTED_PATTERNS (weights) are never sent, so a local file can never overwrite them.
# Step 2 removes stale code: a file of REMOTE_CODE_PATTERNS that an earlier sync pushed (listed in
# the server's .remote-run-synced manifest) and that no longer exists locally. Removal goes
# through delete.sh, which re-checks every protection. Any other stale path is kept and reported.
# The first sync into a non-empty server directory only previews, until --confirm-first-sync.
set -euo pipefail
cd "$(dirname "$0")/../.."
source scripts/remote/remote.env

dry_run=0
list_stale=0
confirm=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) dry_run=1 ;;
    --list-stale) list_stale=1 ;;
    --confirm-first-sync) confirm=1 ;;
    *) echo "usage: sync.sh [--dry-run] [--list-stale] [--confirm-first-sync]" >&2; exit 2 ;;
  esac
done

marker=.remote-run-synced
dir=$(printf '%q' "$REMOTE_DIR")

# One SSH call: was this target synced before, does it hold anything, and which code files the
# last sync pushed (the manifest stored in the marker).
state=$(ssh "$REMOTE_HOST" "dir=$dir bash -s" <<'EOF'
mkdir -p "$dir" && cd "$dir" || exit 1
if [ -e .remote-run-synced ]; then echo synced; else echo new; fi
if [ -n "$(ls -A)" ]; then echo nonempty; else echo empty; fi
if [ -f .remote-run-synced ]; then cat .remote-run-synced; fi
EOF
)
target_state=$(printf '%s\n' "$state" | sed -n 1p)
target_content=$(printf '%s\n' "$state" | sed -n 2p)
previous_manifest=$(printf '%s\n' "$state" | sed -n '3,$p')

# Patterns without a trailing slash also match a directory that is a symlink on the server.
excludes=(--exclude '.git/' --exclude '__pycache__/' --exclude '/runs/' --exclude "/$marker")
for d in $REMOTE_SERVER_DIRS; do
  excludes+=(--exclude "/$d")
done
for d in ${REMOTE_LOCAL_EXCLUDES:-}; do
  excludes+=(--exclude "$d/")
done
# Expand pattern lists without letting the shell match them against local file names.
set -f
for pattern in ${REMOTE_PROTECTED_PATTERNS:-}; do
  excludes+=(--exclude "$pattern")
done
set +f

first_preview=0
if [ "$target_state" = new ] && [ "$target_content" = nonempty ] && [ "$confirm" -eq 0 ]; then
  first_preview=1
  dry_run=1
fi

opts=(-az --no-owner --no-group)
if [ "$dry_run" -eq 1 ]; then
  opts+=(-n -v)
fi

# Step 1: no --delete; files on the server that are missing locally stay where they are.
rsync "${opts[@]}" "${excludes[@]}" ./ "$REMOTE_HOST:$REMOTE_DIR/"
if [ -d runs ]; then
  rsync "${opts[@]}" --exclude '*/logs/' runs/ "$REMOTE_HOST:$REMOTE_DIR/runs/"
fi

if [ "$first_preview" -eq 1 ]; then
  echo "first sync into non-empty $REMOTE_HOST:$REMOTE_DIR: nothing was changed. The preview above lists files that would be sent, overwriting server copies with the same path; rerun with --confirm-first-sync after checking it." >&2
  exit 3
fi

matches() {
  # matches <name> <pattern list>: true when the file name matches one of the patterns.
  local name=$1 pattern
  set -f
  for pattern in $2; do
    case "$name" in
      $pattern) set +f; return 0 ;;
    esac
  done
  set +f
  return 1
}

# Stale paths come from a deletion preview (-n), which changes nothing.
stale=$(rsync -az -n -v --delete "${excludes[@]}" ./ "$REMOTE_HOST:$REMOTE_DIR/" | sed -n 's/^deleting //p')
prune_files=()
prune_dirs=()
kept=()
while IFS= read -r path; do
  [ -n "$path" ] || continue
  rel=${path%/}
  top=${rel%%/*}
  if [ "${REMOTE_PRUNE_CODE:-1}" = 1 ] && { [ "$rel" = "$top" ] || [ -d "$top" ]; }; then
    if [ "$path" != "$rel" ]; then
      [ "$rel" != "$top" ] && prune_dirs+=("$rel") && continue
    elif matches "${rel##*/}" "${REMOTE_CODE_PATTERNS:-}" \
        && ! matches "${rel##*/}" "${REMOTE_PROTECTED_PATTERNS:-}" \
        && printf '%s\n' "$previous_manifest" | grep -Fxq -- "$rel"; then
      prune_files+=("$rel")
      continue
    fi
  fi
  kept+=("$path")
done <<< "$stale"

if [ ${#prune_files[@]} -gt 0 ]; then
  if [ "$dry_run" -eq 1 ]; then
    printf 'would remove stale code %s\n' "${prune_files[@]}"
  elif ! bash scripts/remote/delete.sh "${prune_files[@]}" | sed 's/^removed /removed stale code /'; then
    echo "some stale code files were not removed; see the messages above" >&2
  fi
fi
# Directories emptied by the removal go too; rmdir leaves any directory that still holds files.
if [ "$dry_run" -eq 0 ] && [ ${#prune_dirs[@]} -gt 0 ]; then
  printf '%s\n' "${prune_dirs[@]}" | sort -r | ssh "$REMOTE_HOST" "cd $dir && while IFS= read -r d; do rmdir -- \"\$d\" 2>/dev/null && echo \"removed empty directory \$d\"; done; true"
fi

if [ ${#kept[@]} -gt 0 ]; then
  if [ "$list_stale" -eq 1 ]; then
    echo "on the server but not in the local tree (kept):"
    printf '%s\n' "${kept[@]}"
  else
    echo "${#kept[@]} path(s) on the server are not in the local tree and were kept; list them with scripts/remote/sync.sh --list-stale, remove specific ones with scripts/remote/delete.sh" >&2
  fi
fi

# Record which code files this sync pushed, so a later sync can tell stale code it may remove
# from files that came from elsewhere.
if [ "$dry_run" -eq 0 ]; then
  manifest=""
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    while IFS= read -r f; do
      [ -n "$f" ] && [ -f "$f" ] && matches "${f##*/}" "${REMOTE_CODE_PATTERNS:-}" && manifest="$manifest$f
"
    done <<< "$(git ls-files -co --exclude-standard)"
  fi
  printf '%s' "$manifest" | ssh "$REMOTE_HOST" "cat > $dir/$marker"
fi
