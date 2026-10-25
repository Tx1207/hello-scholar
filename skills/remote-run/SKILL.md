---
name: remote-run
description: Set up and verify remote execution when the AI tool runs on a networked local machine and the code must run on a GPU server reached over SSH, such as an offline server. Deploys code with Git, installs run, log, stop, pull, and delete scripts, writes the project's remote execution rules, and runs acceptance checks on the real server. Use when the user asks to set up or repair remote execution for a project.
---

# Remote Run

Keep the AI tool on the local machine and use the server only to execute code. Code is deployed one way with Git over SSH, commands run over SSH, and output, Tracebacks, and exit codes come back so the AI can fix and rerun without the user copying anything. Long jobs run in tmux on the server, so SSH drops and tool timeouts do not kill them.

## Confirm the facts first

Ask for what cannot be checked: the SSH alias, the project path on the server, the conda `bin/activate` path and environment name, and where data, checkpoints, and outputs live. Check what can be checked: key-based login with `ssh -o BatchMode=yes <alias> hostname`, Git, `tmux`, and `rsync` on the server, a server bash of 4.4 or later, and that the local project is a Git repository. The local project is the source of truth; code is never edited on the server.

Do not edit `~/.ssh/config`, install packages on the server, or change server settings yourself. When login needs a key or connection reuse, show the user the config block to add, including `ControlMaster auto`, `ControlPersist`, and `ServerAliveInterval`. If the server is offline by policy, do not propose a reverse tunnel; when the reason is unknown, ask before suggesting one.

## Install the scripts

Copy the files in `assets/scripts/remote/` into the project's `scripts/remote/`, keep the `.sh` files executable, commit them, and fill in [remote.env](assets/scripts/remote/remote.env). Before filling it in, survey both sides read-only: list the server's top-level entries with their sizes and the local top-level entries, including Git-ignored and large directories. Recommend `REMOTE_SERVER_DIRS` for directories that hold server data and outputs, normally `data artifacts tmp` plus older output directories such as `outputs/`, `checkpoints/`, or `wandb/`, and `REMOTE_LOCAL_EXCLUDES` for directories that must stay local, such as `.venv/` or `node_modules/`. Show the recommendation as a table and let the user confirm it; follow the layout recorded in Architecture. Keep data, weights, and outputs untracked in Git.

`REMOTE_DIR` on the server becomes a Git work tree. Each sync pushes one commit to `refs/remote-run/deploy` and checks it out there: `HEAD` when the local tree is clean, otherwise a temporary commit of the working tree that never touches local branches or the index. Git changes only tracked files, so untracked server files such as data, weights, logs, and outputs are never modified or deleted, while code removed or renamed locally is removed or renamed on the server. Temporary commits leave out `REMOTE_SERVER_DIRS`, `REMOTE_LOCAL_EXCLUDES`, and files matching `REMOTE_PROTECTED_PATTERNS`, which defaults to weight formats such as `*.pt` and `*.safetensors`. Sync stops without changing server code when a modified tracked server file, or an untracked server file at a path the commit adds, differs from what it deploys; server edits and untracked copies that already match, such as results pulled and committed locally, are accepted. Submodule contents are not deployed; sync says so when the project has submodules.

The first deployment into a non-empty directory that is not yet a Git work tree, the usual case for an existing project, only previews: it counts files that already match and lists files that differ and would be overwritten, then exits with code 3 without creating anything. Show that preview to the user, and pass `--confirm-first-sync` only after they approve it; the overwritten server copies are backed up under `tmp/remote-run-backup/` first.

| Script | Purpose |
| --- | --- |
| `sync.sh` | Deploy the local commit or working tree with Git and print the deployed commit; `--dry-run` previews the changes; the first deployment into a non-empty, non-Git directory needs `--confirm-first-sync`. |
| `run.sh` | Sync, then run in the foreground, or in tmux with `--bg --name NAME`; refuses deletion and move commands; `--run RUN_ID` writes a formal Run's one research execution to `runs/<run-id>/logs/`, and `--run RUN_ID --startup` logs repeatable startup checks there as `startup-NN`. |
| `logs.sh` | Job state, the job log with the deployed commit and exit line, recent stdout and stderr, GPU use. |
| `stop.sh` | Stop a background job and note it in the job log. |
| `pull.sh` | Copy `runs/<run-id>/results/` back so the Record can cite the values. |
| `delete.sh` | Remove explicitly named untracked server leftovers, with `--recursive` for a directory; refuses wildcards, paths outside the project, protected directories, weight files, directories containing weight files, and paths tracked by the deployed code. |

Jobs run in the deployed work tree, and every job log names the deployed commit: a real commit for a research execution, which `run.sh` starts only from a committed local tree, and a temporary commit for startup checks and ordinary jobs on uncommitted code. A running job is not isolated from later syncs, so avoid editing files it still reads, such as configs or evaluation scripts it calls at the end. stdout and stderr are kept in separate files, as record-experiment requires, and a formal Run's research execution starts only once; startup checks before it are numbered and repeatable, matching the planned-Record rule in record-experiment. tmux names are matched exactly, so a job named `train` never collides with `train-long`.

## Write the project's rules

Append [assets/remote-rules.md](assets/remote-rules.md) or [assets/remote-rules.zh_CN.md](assets/remote-rules.zh_CN.md) to the project's AGENTS.md and CLAUDE.md outside the hello-scholar managed block, with the real alias filled in. Every command the AI runs depends on these rules, so they must load on every turn; this skill is not loaded during an ordinary run.

If the user wants the AI's shell limited to these scripts, suggest a permission rule for their tool; do not change tool settings without their approval.

## Verify on the real server

Use commands that finish in seconds and report the actual result of each check:

1. Key login returns the hostname without a prompt.
2. For an existing directory, the first deployment previews and changes nothing; after confirmation, differing server copies are backed up and server-only files remain. Later, a file removed or renamed locally is removed or renamed on the server, while data, weights, and other untracked files stay untouched.
3. Uncommitted work deploys as a temporary commit while the local branch, index, and status stay unchanged; local-only directories and weight files are left out.
4. A sync onto a modified tracked server file, or onto a differing untracked server file, stops without changing server code.
5. A foreground GPU check prints `True` with exit 0, and a failing script shows its full Traceback locally with a nonzero exit.
6. A background job returns at once, keeps running after the SSH command ends, and `logs.sh` shows progress and a final `[exit 0 ...]`; a second job with the same name is refused, and `stop.sh` ends a running job.
7. A research execution is refused while the local tree has uncommitted changes; after a commit it starts and its job log names that commit. Startup checks repeat as `startup-01`, `startup-02`, and both a second execution and later startup checks for the same Run are refused.
8. `delete.sh` removes a named untracked leftover while refusing a path under `data/` or `runs/`, a weight file, a directory containing one, and tracked code; `run.sh rm ...` is refused.

Remove the test files and tmux sessions afterward. Report a failed check with its output and the likely fix; do not change the server to make it pass.
