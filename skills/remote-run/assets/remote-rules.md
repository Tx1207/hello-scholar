## Remote Execution

The local copy and the server copy `<alias>:<path>` are Git work trees of this project on the same branch. Changes move between them only as commits, through `scripts/remote/sync.sh` on the local copy, and only by fast-forward.

On the local copy:

- Run `scripts/remote/sync.sh pull` before editing. When the server needs a change, commit it in the project's commit convention, then run `scripts/remote/sync.sh push`. `sync.sh status` shows the commits each side lacks, uncommitted server files, and the server's tmux jobs.
- Do not change server files or run jobs on the server; the server agent runs them. Reading server logs and files over `ssh` is fine.
- When sync stops because the server has uncommitted changes, tell the user, so the server agent commits them. When both sides have new commits, rebase the local commits with `git rebase refs/remote-run/server`, rerun the affected checks, and push; on a conflict, stop and show it to the user.

On the server:

- Edit, run, and debug here; the local copy's `sync.sh` brings in its changes. Stay on the checked-out branch, and do not push, pull, fetch, reset, rebase, or amend existing commits.
- Before ending a turn, commit your changes in the project's commit convention, so the local copy can pull them; uncommitted changes block sync in both directions.
- Run anything that may take more than a few minutes in tmux, with stdout and stderr in separate files and the exit code at the end, for example `tmux new -d -s <name> '<command> > <dir>/stdout.log 2> <dir>/stderr.log; echo "[exit $? at $(date)]" >> <dir>/job.log'`. For a formal Run, `<dir>` is `runs/<run-id>/logs`; follow `record-experiment` for startup checks, commit before the research execution, and record `git rev-parse HEAD` as its code version. Check a long job at intervals matched to its expected length.
- Never delete or move data, weights, checkpoints, or Run outputs; the user removes them. Keep them out of Git.
- Commit a Run's Record and its small results in `runs/<run-id>/results/`. Logs and `artifacts/<run-id>/` stay untracked on the server, and the Record cites them by path.

On both sides, while a long job runs, do not change files it still reads, such as its configs or the evaluation script it calls at the end; a push updates them under the running job. Copy them under a new name instead.
