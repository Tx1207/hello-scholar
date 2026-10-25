## 远程执行

本地副本和服务器副本 `<别名>:<路径>` 是本项目在同一分支上的两个 Git 工作区。改动只以提交的形式在两边之间移动，通过本地副本上的 `scripts/remote/sync.sh`，而且只做快进。

在本地副本上：

- 开始修改前先运行 `scripts/remote/sync.sh pull`。服务器需要某个改动时，按项目的提交说明规则提交，再运行 `scripts/remote/sync.sh push`。`sync.sh status` 显示两边各自缺少的提交、服务器上未提交的文件，以及服务器上的 tmux 任务。
- 不要修改服务器上的文件，也不要在服务器上运行任务；任务由服务器上的 Agent 运行。通过 `ssh` 查看服务器上的日志和文件没有问题。
- 同步因服务器有未提交的改动而停下时，告诉用户，让服务器上的 Agent 先提交。两边都有新提交时，用 `git rebase refs/remote-run/server` 把本地提交变基上去，重新运行受影响的检查，再推送；出现冲突就停下，把冲突给用户看。

在服务器上：

- 在这里修改、运行和排查；本地副本的改动由它的 `sync.sh` 带过来。留在当前检出的分支上，不要 push、pull、fetch、reset、rebase，也不要修改已有的提交。
- 结束一轮工作前，按项目的提交说明规则提交改动，让本地副本能拉回；未提交的改动会让两个方向的同步都停下。
- 可能超过几分钟的任务放在 tmux 中运行，stdout 和 stderr 分别写入不同文件，最后记下退出码，例如 `tmux new -d -s <任务名> '<命令> > <目录>/stdout.log 2> <目录>/stderr.log; echo "[exit $? at $(date)]" >> <目录>/job.log'`。正式 Run 的 `<目录>` 是 `runs/<run-id>/logs`；启动检查按 `record-experiment` 执行，研究执行前先提交，并把 `git rev-parse HEAD` 记为它的代码版本。长任务按预计时长间隔查看进度。
- 不要删除或移动数据、权重、checkpoint 和 Run 产物，这些由用户自己删除；它们不进 Git。
- 提交 Run 的 Record 和 `runs/<run-id>/results/` 中的小结果。日志和 `artifacts/<run-id>/` 留在服务器上不进 Git，Record 用路径引用它们。

两边共同遵守：长任务运行期间，不要修改它还会读取的文件，例如它的配置或结束时调用的评测脚本；推送会在任务运行中更新这些文件。需要改时复制成新文件再改。
