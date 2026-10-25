#!/usr/bin/env bash
# Deploy local code to the server with Git: scripts/remote/sync.sh [--dry-run] [--confirm-first-sync]
# Runs on the local machine; needs Git on both sides and works with bash 3.2.
# REMOTE_DIR on the server is a Git work tree. Each sync pushes one commit to refs/remote-run/deploy
# and checks it out there: HEAD when the local tree is clean, otherwise a temporary commit of the
# working tree that never touches local branches or the index.
# Git changes only tracked files, so untracked server files such as data, weights, and outputs are
# never modified or deleted, while files the previous deployment tracked and this one drops are
# removed. A checkout that would overwrite an untracked server file stops instead, and so does a
# sync onto modified tracked files.
# REMOTE_SERVER_DIRS, REMOTE_LOCAL_EXCLUDES, and REMOTE_PROTECTED_PATTERNS stay out of the
# temporary commit. On success the deployed commit is printed on stdout; messages go to stderr.
set -euo pipefail
cd "$(dirname "$0")/../.."
source scripts/remote/remote.env

dry_run=0
confirm=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) dry_run=1 ;;
    --confirm-first-sync) confirm=1 ;;
    *) echo "usage: sync.sh [--dry-run] [--confirm-first-sync]" >&2; exit 2 ;;
  esac
done

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "remote-run deploys with Git: run 'git init' and commit the project first" >&2
  exit 2
fi
if [ -n "$(git submodule status 2>/dev/null)" ]; then
  echo "note: submodule contents are not deployed; the server needs its own copy of each submodule" >&2
fi

# Choose the commit to deploy.
head=$(git rev-parse --verify -q HEAD || true)
if [ -n "$head" ] && [ -z "$(git status --porcelain)" ]; then
  commit=$head
  label=$(git rev-parse --short "$head")
else
  # Stage the working tree into a throwaway copy of the index so local branches and the real
  # index stay untouched. Copying the index keeps Git's file-status cache and avoids rehashing.
  pathspec=(.)
  set -f
  for d in $REMOTE_SERVER_DIRS; do
    pathspec+=(":(exclude,top)$d")
  done
  for d in ${REMOTE_LOCAL_EXCLUDES:-}; do
    pathspec+=(":(exclude,glob)**/$d/**")
  done
  for pattern in ${REMOTE_PROTECTED_PATTERNS:-}; do
    pathspec+=(":(exclude,glob)**/$pattern")
  done
  set +f
  tmp_index=$(mktemp "${TMPDIR:-/tmp}/remote-run-index.XXXXXX")
  trap 'rm -f "$tmp_index"' EXIT
  real_index=$(git rev-parse --git-path index)
  if [ -f "$real_index" ]; then
    cp "$real_index" "$tmp_index"
  else
    rm -f "$tmp_index"
  fi
  GIT_INDEX_FILE=$tmp_index git add -A -- "${pathspec[@]}"
  tree=$(GIT_INDEX_FILE=$tmp_index git write-tree)
  if [ -n "$head" ] && [ "$tree" = "$(git rev-parse "$head^{tree}")" ]; then
    commit=$head
    label=$(git rev-parse --short "$head")
  elif [ -n "$head" ]; then
    commit=$(git commit-tree "$tree" -p "$head" -m "remote-run working tree")
    label="$(git rev-parse --short "$commit") (working tree on $(git rev-parse --short "$head"))"
  else
    commit=$(git commit-tree "$tree" -m "remote-run working tree")
    label="$(git rev-parse --short "$commit") (working tree, no commits yet)"
  fi
fi

dir=$(printf '%q' "$REMOTE_DIR")

# One SSH call describes the target: a Git work tree (with any modified tracked files), an empty
# or missing directory, or a non-empty directory that is not yet a Git work tree.
state=$(ssh "$REMOTE_HOST" "dir=$dir bash -s" <<'EOF'
if [ -d "$dir/.git" ]; then
  cd "$dir" || exit 1
  echo git
  git rev-parse --verify -q HEAD || echo none
  git status --porcelain --untracked-files=no
elif [ -d "$dir" ] && [ -n "$(ls -A "$dir")" ]; then
  echo plain
else
  echo empty
fi
exit 0
EOF
)
kind=$(printf '%s\n' "$state" | sed -n 1p)

case "$kind" in
  git)
    server_head=$(printf '%s\n' "$state" | sed -n 2p)
    modified=$(printf '%s\n' "$state" | sed -n '3,$p')
    if [ -n "$modified" ]; then
      echo "the server has modified tracked files; deploying would overwrite them, so nothing was changed:" >&2
      printf '%s\n' "$modified" >&2
      echo "copy wanted changes into the local project, then discard them on the server yourself" >&2
      exit 4
    fi
    if [ "$dry_run" -eq 1 ]; then
      if [ "$server_head" != none ] && git cat-file -e "$server_head^{commit}" 2>/dev/null; then
        echo "would deploy $label; changes against the server's current code:" >&2
        git diff --stat "$server_head" "$commit" >&2
      else
        echo "would deploy $label onto server code this repository does not know" >&2
      fi
      exit 0
    fi
    ;;
  plain)
    # Compare every file of the commit with the server copy at the same path; git hash-object
    # works outside a repository, so this preview creates nothing on the server.
    # Regular files only (modes 100644 and 100755); links and submodules are not compared.
    compare='while IFS=" " read -r sha path; do
  if [ -f "$path" ] && [ ! -L "$path" ]; then
    if [ "$(git hash-object -- "$path")" = "$sha" ]; then echo "same $path"; else echo "differs $path"; fi
  fi
done'
    comparison=$(git -c core.quotePath=false ls-tree -r "$commit" \
      | awk -F '\t' '{split($1, a, " "); if (a[1] == "100644" || a[1] == "100755") print a[3] " " $2}' \
      | ssh "$REMOTE_HOST" "cd $dir && bash -c $(printf '%q' "$compare")")
    differs=$(printf '%s\n' "$comparison" | sed -n 's/^differs //p')
    same_count=$(printf '%s\n' "$comparison" | grep -c '^same ' || true)
    if [ "$confirm" -eq 0 ] || [ "$dry_run" -eq 1 ]; then
      echo "first deployment into non-empty $REMOTE_HOST:$REMOTE_DIR, which is not a Git work tree; nothing was changed." >&2
      echo "$same_count file(s) already match. Files that differ and would be overwritten (each is backed up first):" >&2
      if [ -n "$differs" ]; then printf '%s\n' "$differs" | sed 's/^/  /' >&2; else echo "  none" >&2; fi
      echo "untracked server files, such as data and weights, are never touched. Rerun with --confirm-first-sync to deploy." >&2
      exit 3
    fi
    ;;
  empty)
    if [ "$dry_run" -eq 1 ]; then
      echo "would create $REMOTE_HOST:$REMOTE_DIR and deploy $label" >&2
      exit 0
    fi
    ;;
  *)
    echo "could not read the state of $REMOTE_HOST:$REMOTE_DIR" >&2
    exit 1
    ;;
esac

if [ "$kind" != git ]; then
  ssh "$REMOTE_HOST" "mkdir -p $dir && cd $dir && git init -q"
fi
git push -q -f "$REMOTE_HOST:$REMOTE_DIR" "$commit:refs/remote-run/deploy"

# Git refuses to check out over an untracked file even when its content is identical, which happens
# when results pulled and committed locally already sit on the server. Compare each untracked server
# file the new commit would replace: identical ones are safe to replace; differing ones stop the
# deployment, unless the user confirmed a first deployment, which backs them up first.
conflicts='git ls-tree -r --name-only "$commit" | sort > "$tmp_new"
git ls-files | sort > "$tmp_cur"
comm -23 "$tmp_new" "$tmp_cur" | while IFS= read -r path; do
  if [ -L "$path" ] || [ -d "$path" ]; then echo "$path"
  elif [ -f "$path" ] && [ "$(git hash-object -- "$path")" != "$(git rev-parse "$commit:$path")" ]; then echo "$path"
  fi
done
rm -f "$tmp_new" "$tmp_cur"'
replaced=$(ssh "$REMOTE_HOST" "cd $dir && commit=$commit tmp_new=\$(mktemp) tmp_cur=\$(mktemp) bash -c $(printf '%q' "$conflicts")")
if [ -n "$replaced" ]; then
  if [ "$kind" != plain ]; then
    echo "deployment stopped before changing server code: these untracked server files differ from the files this commit adds:" >&2
    printf '%s\n' "$replaced" | sed 's/^/  /' >&2
    echo "keep the server versions by copying them into the local project, or move or delete them on the server, then sync again" >&2
    exit 5
  fi
  backup="tmp/remote-run-backup/$(date +%Y%m%d-%H%M%S)"
  save='while IFS= read -r p; do mkdir -p "$backup/$(dirname "$p")" && cp -pR -- "$p" "$backup/$p"; done'
  printf '%s\n' "$replaced" | ssh "$REMOTE_HOST" "cd $dir && backup=$(printf '%q' "$backup") bash -c $(printf '%q' "$save")"
  echo "backed up overwritten files to $REMOTE_DIR/$backup" >&2
fi
# Modified tracked files were refused above and differing untracked files handled, so -f now only
# replaces identical untracked copies.
ssh "$REMOTE_HOST" "cd $dir && git checkout -q -f --detach $commit"
echo "$label"
