#!/usr/bin/env bash
# Two-way Git sync between the local copy and the server copy. Runs on the local machine.
#   scripts/remote/sync.sh init     # first time: make REMOTE_DIR a work tree on the local branch
#   scripts/remote/sync.sh status   # commits each side lacks, uncommitted server files, tmux jobs
#   scripts/remote/sync.sh pull     # fast-forward the local branch to the server's commits
#   scripts/remote/sync.sh push     # fast-forward the server branch to the local commits
# Only commits move, and only by fast-forward. Anything else stops without changing either side:
# exit 2 for local problems, 3 for a server on another branch, 4 for uncommitted server changes,
# 5 when both sides have commits the other lacks.
set -euo pipefail
cd "$(dirname "$0")/../.."
source scripts/remote/remote.env

branch=$(git symbolic-ref --quiet --short HEAD) || { echo "check out a branch first; sync moves the current branch" >&2; exit 2; }
url="$REMOTE_HOST:$REMOTE_DIR"
dir=$(printf '%q' "$REMOTE_DIR")
qbranch=$(printf '%q' "$branch")
server_ref=refs/remote-run/server
incoming=refs/heads/remote-run-incoming

remote() { ssh "$REMOTE_HOST" "cd $dir && $1"; }

# Reads the server's branch and its uncommitted files into srv_branch, srv_tracked, srv_untracked.
read_server() {
  local state
  state=$(remote "git symbolic-ref --quiet --short HEAD || echo '(detached)'; git -c core.quotePath=false status --porcelain")
  srv_branch=$(printf '%s\n' "$state" | head -n 1)
  srv_tracked=$(printf '%s\n' "$state" | tail -n +2 | grep -v '^??' || true)
  srv_untracked=$(printf '%s\n' "$state" | tail -n +2 | grep '^??' || true)
}

require_server_ready() {
  read_server
  if [ "$srv_branch" != "$branch" ]; then
    echo "the server is on $srv_branch, not $branch; run 'sync.sh init' or switch one side" >&2
    exit 3
  fi
  if [ -n "$srv_tracked" ]; then
    printf 'the server has uncommitted changes; the server agent must commit them first:\n%s\n' "$srv_tracked" >&2
    exit 4
  fi
}

# Sets ahead (local commits the server lacks) and behind (server commits the local copy lacks).
compare() {
  git fetch -q "$url" "+refs/heads/$branch:$server_ref"
  set -- $(git rev-list --left-right --count "HEAD...$server_ref")
  ahead=$1
  behind=$2
}

note_untracked() {
  [ -z "$srv_untracked" ] || printf 'untracked on the server, not synced (ignore data and outputs in .gitignore):\n%s\n' "$srv_untracked" >&2
}

case "${1:-}" in
  init)
    state=$(ssh "$REMOTE_HOST" "mkdir -p $dir && cd $dir && { [ -d .git ] || git init -q; } && \
if [ \"\$(git symbolic-ref --quiet --short HEAD)\" = $qbranch ] && git rev-parse -q --verify HEAD >/dev/null; then echo ready; fi")
    if [ "$state" = ready ]; then
      echo "the server is already a work tree on $branch; use status, pull, or push"
      exit 0
    fi
    git push -q "$url" "+HEAD:$incoming"
    # Point the branch at the local commit and reset only the index: no server file is overwritten.
    # Files missing on the server are restored; differing ones stay and are listed below.
    changes=$(remote "if git rev-parse -q --verify refs/heads/$qbranch >/dev/null && ! git merge-base --is-ancestor refs/heads/$qbranch $incoming; then \
git update-ref -d $incoming; echo 'the server branch $branch has commits the local copy lacks; reconcile them before init' >&2; exit 5; fi; \
git update-ref refs/heads/$qbranch $incoming && git symbolic-ref HEAD refs/heads/$qbranch && git update-ref -d $incoming && git reset -q && \
{ [ -z \"\$(git ls-files -d)\" ] || git ls-files -d -z | xargs -0 git checkout -q --; } && git -c core.quotePath=false status --porcelain")
    srv_tracked=$(printf '%s\n' "$changes" | grep -v '^??' || true)
    srv_untracked=$(printf '%s\n' "$changes" | grep '^??' || true)
    note_untracked
    if [ -n "$srv_tracked" ]; then
      printf 'the server is on %s at %s, but these server files differ from it and were left as they are:\n%s\n' \
        "$branch" "$(git rev-parse --short HEAD)" "$srv_tracked" >&2
      echo "keep the server versions by committing them on the server, or restore the commit's with 'git checkout -- <path>' there" >&2
      exit 4
    fi
    echo "the server is on $branch at $(git rev-parse --short HEAD)"
    ;;
  status)
    read_server
    compare
    echo "server branch: $srv_branch"
    echo "$ahead local commit(s) not on the server, $behind server commit(s) not local"
    [ -z "$srv_tracked" ] || printf 'uncommitted on the server:\n%s\n' "$srv_tracked"
    [ -z "$srv_untracked" ] || printf 'untracked on the server:\n%s\n' "$srv_untracked"
    remote "tmux ls 2>/dev/null || echo 'no tmux jobs'"
    ;;
  pull)
    require_server_ready
    compare
    note_untracked
    if [ "$behind" -eq 0 ]; then
      echo "already up to date with the server"
    elif [ "$ahead" -eq 0 ]; then
      git merge -q --ff-only "$server_ref"
      echo "pulled $behind commit(s):"
      git log --oneline -n "$behind"
    else
      echo "local has $ahead commit(s) the server lacks and the server has $behind the local copy lacks; rebase the local ones with 'git rebase $server_ref', then push" >&2
      exit 5
    fi
    ;;
  push)
    if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
      echo "commit the local changes first; push sends commits only" >&2
      exit 2
    fi
    require_server_ready
    compare
    if [ "$behind" -gt 0 ]; then
      echo "the server has $behind commit(s) the local copy lacks; run 'sync.sh pull' first" >&2
      exit 5
    fi
    if [ "$ahead" -eq 0 ]; then
      echo "the server already has $(git rev-parse --short HEAD)"
      exit 0
    fi
    # A non-bare repository refuses pushes to its checked-out branch, so push beside it and fast-forward there.
    git push -q "$url" "+HEAD:$incoming"
    remote "git merge -q --ff-only $incoming; code=\$?; git update-ref -d $incoming; exit \$code"
    echo "pushed $ahead commit(s); the server is at $(git rev-parse --short HEAD)"
    ;;
  *)
    echo "usage: sync.sh init|status|pull|push" >&2
    exit 2
    ;;
esac
