## Remote Execution

- Edit code locally; it runs on `<alias>`. Reach the server only through `scripts/remote/*.sh`, never with direct `ssh`.
- Tasks expected to finish within 5 minutes, such as unit tests, small debugging runs, and data checks: `scripts/remote/run.sh <command>`.
- Training, evaluation, and anything that may run longer: `scripts/remote/run.sh --bg --name <name> <command>`. For a formal Run, create the planned Record first, run its startup checks with `--run <run-id> --startup` (repeatable, logged as `startup-NN` in that Run), then commit the pending changes in the project's commit convention and start the one research execution with `--bg --run <run-id>`; `run.sh` refuses a research execution on uncommitted code.
- Check progress with `scripts/remote/logs.sh <name>` at intervals matched to the job's expected length, not in a tight loop.
- `[exit N ...]` with N other than 0 in the job log is a failure: read stderr and fix the cause. Startup checks are simply rerun. A failed research execution closes that Run as `failed`; an authorized retry is a new Run whose `derived_from` points to it and resumes from completed stages.
- Copy a Run's small results in `runs/<run-id>/results/` back with `scripts/remote/pull.sh <run-id>` before writing them into the Record. Logs in `runs/<run-id>/logs/` and checkpoints in `artifacts/<run-id>/` stay on the server; the Record cites them as `<alias>:<path>` and keeps the output of the `run.sh` that started the job.
- While a long job runs, do not edit files it still reads, such as its configs or the evaluation script it calls at the end; copy them under a new name instead.
- Stop a job with `scripts/remote/stop.sh <name>`.
- Do not read or print raw data from the server-only directories listed in `REMOTE_SERVER_DIRS` in `scripts/remote/remote.env`, such as `data/`; anything printed is sent to the model provider.
