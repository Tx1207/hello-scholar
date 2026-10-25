---
name: remote-run
description: Set up two-way Git sync between a local copy of a project and its copy on a GPU server reached over SSH, when one agent edits on the local machine and another agent works and runs code on the server. Installs a sync script, writes each side's rules into the project, and verifies the sync on the real server. Use when the user asks to set up or repair this local and server arrangement.
---

# Remote Run

One agent works on the local copy; another, such as Codex, edits, runs, and debugs on the server copy, next to the GPUs and data. Both copies are Git work trees on the same branch. Changes move between them only as commits, through `scripts/remote/sync.sh` on the local machine, and only by fast-forward. Data, weights, logs, and outputs stay untracked on the server, so sync never touches them.

## Confirm the facts first

Ask for the SSH alias and the project path on the server. Check key login with `ssh -o BatchMode=yes <alias> hostname`, Git on the server, and that the local project is a Git repository with a branch checked out. Do not edit `~/.ssh/config`, install packages, or change server settings yourself; when login needs a key or connection reuse, show the user the config block to add, including `ControlMaster auto`, `ControlPersist`, and `ServerAliveInterval`. Setting up the server agent is the user's job.

Survey both sides read-only: the server's top-level entries with their sizes, and the local `.gitignore`. Directories for data, checkpoints, and outputs, such as `data/`, `artifacts/`, `outputs/`, or `wandb/`, must be ignored by Git before the first sync. Recommend the `.gitignore` lines as a table, add them after the user confirms, and follow the layout recorded in Architecture.

## Install the script

Copy the files in `assets/scripts/remote/` into the project's `scripts/remote/`, keep `sync.sh` executable, fill in [remote.env](assets/scripts/remote/remote.env), and commit them.

| Command | Effect |
| --- | --- |
| `sync.sh init` | First time: make `REMOTE_DIR` a work tree on the local branch without overwriting server files. |
| `sync.sh status` | Commits each side lacks, uncommitted server files, and the server's tmux jobs. |
| `sync.sh pull` | Fast-forward the local branch to the server's commits. |
| `sync.sh push` | Fast-forward the server branch to the local commits; needs a committed local tree. |

`pull` and `push` stop without changing either side when the server is on another branch, when it has uncommitted changes to tracked files, or when both sides have commits the other lacks; a push also stops when it would overwrite an untracked server file. The project's rules tell the local agent what to do next: ask for a commit on the server, or rebase its local commits onto `refs/remote-run/server` and push. Untracked server files that Git does not ignore are listed, never pulled.

`init` on an existing directory, including one deployed by the older remote-run, points the branch at the local commit and resets only Git's index. Files missing on the server are restored; server files that differ stay as they are and are listed, and the user decides whether to commit them on the server or restore the commit's version. When the server already has the branch with commits the local copy lacks, `init` stops.

## Write the project's rules

Append [assets/remote-rules.md](assets/remote-rules.md) or [assets/remote-rules.zh_CN.md](assets/remote-rules.zh_CN.md) to the project's AGENTS.md and CLAUDE.md outside the hello-scholar managed block, with the real alias and server path filled in. Both copies share these files through Git, so each agent reads its own part and the other's. Replace an older remote-run section, and remove the older `scripts/remote/` scripts in the same commit.

## Verify on the real server

Use commands that finish in seconds and report the actual result of each check:

1. Key login returns the hostname without a prompt.
2. `init` on the real directory changes no server file's content and lists any differing files; afterward `status` shows both sides at the same commit.
3. `push` delivers the setup commit to the server's work tree, and data and output directories show as ignored there with `git status --ignored`.
4. A commit made on the server, such as the user's or the server agent's next one, comes back with `pull`.

The stopping cases are covered by the script's tests; check them on the real server only with a temporary change the user agrees to. Report a failed check with its output and the likely fix; do not change the server to make it pass.
