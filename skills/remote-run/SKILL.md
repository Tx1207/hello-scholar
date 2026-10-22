---
name: remote-run
description: Set up and verify remote execution when the AI tool runs on a networked local machine and the code must run on a GPU server reached over SSH, such as an offline server. Installs sync, run, log, stop, and pull scripts, writes the project's remote execution rules, and runs acceptance checks on the real server. Use when the user asks to set up or repair remote execution for a project.
---

# Remote Run

Keep the AI tool on the local machine and use the server only to execute code. Code is pushed one way with rsync, commands run over SSH, and output, Tracebacks, and exit codes come back so the AI can fix and rerun without the user copying anything. Long jobs run in tmux on the server, so SSH drops and tool timeouts do not kill them.

## Confirm the facts first

Ask for what cannot be checked: the SSH alias, the project path on the server, the conda `bin/activate` path and environment name, and where data, checkpoints, and outputs live. Check what can be checked: key-based login with `ssh -o BatchMode=yes <alias> hostname`, `tmux` and `rsync` on the server, a server bash of 4.4 or later, and the local rsync.

Do not edit `~/.ssh/config`, install packages on the server, or change server settings yourself. When login needs a key or connection reuse, show the user the config block to add, including `ControlMaster auto`, `ControlPersist`, and `ServerAliveInterval`. If the server is offline by policy, do not propose a reverse tunnel; when the reason is unknown, ask before suggesting one.

## Install the scripts

Copy the files in `assets/scripts/remote/` into the project's `scripts/remote/`, keep the `.sh` files executable, and fill in [remote.env](assets/scripts/remote/remote.env). Set `REMOTE_SERVER_DIRS` to every top-level directory that exists only on the server, normally `data artifacts tmp`, plus older output directories in an established project; follow the layout recorded in Architecture. Sync never sends or deletes those directories, and files that jobs write under `runs/` survive every sync.

| Script | Purpose |
| --- | --- |
| `sync.sh` | Mirror local code to the server; server-only directories and Run outputs are never deleted. |
| `run.sh` | Sync, then run in the foreground, or in tmux with `--bg --name NAME`; `--run RUN_ID` writes a formal Run's one research execution to `runs/<run-id>/logs/`, and `--run RUN_ID --startup` logs repeatable startup checks there as `startup-NN`. |
| `logs.sh` | Job state, the job log with source commit and exit line, recent stdout and stderr, GPU use. |
| `stop.sh` | Stop a background job and note it in the job log. |
| `pull.sh` | Copy `runs/<run-id>/results/` back so the Record can cite the values. |

Jobs run in the synced project directory. A research execution starts only from a committed local tree, so its job log names the exact commit; startup checks and ordinary jobs may run on uncommitted code. A running job is not isolated from later syncs, so avoid editing files it still reads, such as configs or evaluation scripts it calls at the end. stdout and stderr are kept in separate files, as record-experiment requires, and a formal Run's research execution starts only once; startup checks before it are numbered and repeatable, matching the planned-Record rule in record-experiment. tmux names are matched exactly, so a job named `train` never collides with `train-long`.

## Write the project's rules

Append [assets/remote-rules.md](assets/remote-rules.md) or [assets/remote-rules.zh_CN.md](assets/remote-rules.zh_CN.md) to the project's AGENTS.md and CLAUDE.md outside the hello-scholar managed block, with the real alias filled in. Every command the AI runs depends on these rules, so they must load on every turn; this skill is not loaded during an ordinary run.

If the user wants the AI's shell limited to these scripts, suggest a permission rule for their tool; do not change tool settings without their approval.

## Verify on the real server

Use commands that finish in seconds and report the actual result of each check:

1. Key login returns the hostname without a prompt.
2. After `sync.sh`, the server code matches local, a file deleted locally disappears, and files in server-only directories and under `runs/` remain.
3. A foreground GPU check prints `True` with exit 0.
4. A failing script shows its full Traceback locally with a nonzero exit.
5. A background job returns at once, keeps running after the SSH command ends, and `logs.sh` shows progress and a final `[exit 0 ...]`.
6. A second job with the same name is refused, a job whose name extends another's still starts, and `stop.sh` ends a running job.
7. A research execution is refused while the local tree has uncommitted changes; after a commit it starts and its job log names that commit.
8. Startup checks with `--run <id> --startup` repeat as `startup-01`, `startup-02`; the research execution then starts once, and both a second execution and later startup checks for the same Run are refused.

Remove the test files and tmux sessions afterward. Report a failed check with its output and the likely fix; do not change the server to make it pass.
