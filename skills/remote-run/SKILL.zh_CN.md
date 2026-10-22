---
name: remote-run
description: AI 工具运行在联网的本地机器上、代码必须在通过 SSH 访问的 GPU 服务器（例如离线服务器）上运行时，搭建并验证远程执行。安装同步、运行、日志、停止和拉回结果的脚本，写入项目的远程执行规则，并在真实服务器上跑验收。用于用户要求为项目搭建或修复远程执行时。
---

# Remote Run

AI 工具留在本地机器上，服务器只负责执行代码。代码用 rsync 单向推送，命令通过 SSH 运行，输出、Traceback 和退出码原路返回，AI 可以直接修复后重跑，用户不需要复制粘贴。长任务在服务器的 tmux 中运行，SSH 断开或工具超时都不会杀掉它。

## 先确认事实

无法自行查明的要问用户：SSH 别名、服务器上的项目路径、conda 的 `bin/activate` 路径和环境名，以及数据、checkpoint 和输出放在哪里。能查明的自己检查：用 `ssh -o BatchMode=yes <别名> hostname` 确认免密登录，确认服务器上有 `tmux` 和 `rsync`、服务器 bash 版本不低于 4.4，以及本地的 rsync。

不要自行修改 `~/.ssh/config`、在服务器上安装软件或改服务器设置。登录需要密钥或连接复用时，把要添加的配置块给用户，包括 `ControlMaster auto`、`ControlPersist` 和 `ServerAliveInterval`。服务器断网是出于规定时，不提议反向隧道；原因不明时，先问清再考虑。

## 安装脚本

把 `assets/scripts/remote/` 中的文件复制到项目的 `scripts/remote/`，保持 `.sh` 文件可执行，并填好 [remote.env](assets/scripts/remote/remote.env)。填写前先只读盘点两边：列出服务器上的顶层条目及其大小，以及本地的顶层条目，包括被 Git 忽略的目录和体积大的目录。推荐 `REMOTE_SERVER_DIRS`：只存在于服务器上、或存放数据和输出的目录，通常是 `data artifacts tmp`，加上 `outputs/`、`checkpoints/`、`wandb/` 等旧输出目录；推荐 `REMOTE_LOCAL_EXCLUDES`：必须只留在本地的目录，例如 `.venv/`、`node_modules/`。把推荐整理成表格请用户确认；以 Architecture 中记录的布局为准。

同步先只增加和更新文件、不删除任何东西，并且从不发送 `REMOTE_SERVER_DIRS`、`REMOTE_LOCAL_EXCLUDES` 以及匹配 `REMOTE_PROTECTED_PATTERNS` 的文件（默认是 `*.pt`、`*.safetensors` 等权重格式），因此本地文件永远不会覆盖它们。随后清理过时代码，让服务器上的代码与本地一致：只删除匹配 `REMOTE_CODE_PATTERNS`（如 `*.py`、`*.yaml`）、由之前的同步推送过、而本地已经没有的文件。同步依据服务器 `.remote-run-synced` 中记录的 Git 代码文件清单判断哪些是自己推送的，因此服务器上原有的或在服务器上新建的代码永远不会被删；不在 Git 中的项目不做清理。每删一个文件都会输出，被清空的目录也一并删除，删除经过 `delete.sh`。其余过时路径一律保留并报告数量，`--list-stale` 可以列出，`REMOTE_PRUNE_CODE=0` 可以关闭清理。要删除被保留的路径，向用户提议用 `delete.sh`；它只接受明确指定的路径，并拒绝 `REMOTE_SERVER_DIRS`、`runs/`、`.git`、受保护的文件以及含有受保护文件的目录。`run.sh` 拒绝 `rm`、`mv` 等命令，删除只能走 `delete.sh`；权重、数据和 Run 产物由用户在服务器上自行删除。第一次同步到非空的服务器目录时，只预演会发送的内容（会覆盖服务器上同路径的文件），并以退出码 3 结束。把预演结果给用户看，用户同意后才加 `--confirm-first-sync`。

| 脚本 | 用途 |
| --- | --- |
| `sync.sh` | 把本地代码增加和更新到服务器，再删除之前由同步推送、现已过时的代码文件；其余过时路径保留并报告，`--list-stale` 可以列出；`--dry-run` 只预演；第一次同步到非空目录需要 `--confirm-first-sync`。 |
| `delete.sh` | 删除明确指定的服务器路径，删除目录需加 `--recursive`；拒绝通配符、项目外的路径、受保护的目录、权重文件以及含有权重文件的目录。 |
| `run.sh` | 先同步，再在前台运行，或用 `--bg --name NAME` 在 tmux 中运行；拒绝删除和移动命令；`--run RUN_ID` 把正式 Run 唯一一次正式执行的日志写到 `runs/<run-id>/logs/`；`--run RUN_ID --startup` 把可反复运行的启动检查记在同一目录，编号为 `startup-NN`。 |
| `logs.sh` | 任务状态、带来源提交和退出行的任务日志、最近的 stdout 和 stderr、GPU 使用情况。 |
| `stop.sh` | 停止后台任务，并在任务日志中记一笔。 |
| `pull.sh` | 把 `runs/<run-id>/results/` 拉回本地，供 Record 引用数值。 |

任务在同步后的项目目录中运行。正式执行只能从已提交的本地代码启动，因此任务日志记录的是确切的提交；启动检查和普通任务可以在未提交的代码上运行。运行中的任务不受之后同步的隔离，所以不要修改它还会读取的文件，例如配置或它结束时调用的评测脚本。stdout 和 stderr 分别写入文件，符合 record-experiment 的要求；正式 Run 的正式执行只能启动一次；在此之前的启动检查按编号保存、可反复运行，与 record-experiment 中 planned Record 的规定一致。tmux 名称按精确匹配，名为 `train` 的任务不会和 `train-long` 冲突。

## 写入项目规则

把 [assets/remote-rules.md](assets/remote-rules.md) 或 [assets/remote-rules.zh_CN.md](assets/remote-rules.zh_CN.md) 追加到项目的 AGENTS.md 和 CLAUDE.md 中、hello-scholar 管理块之外，并填入真实的别名。AI 运行的每条命令都依赖这些规则，所以它们必须每轮都加载；日常运行时本 skill 并不会被加载。

用户希望把 AI 的命令限制在这些脚本内时，建议在其工具中加权限规则；未经同意不要修改工具设置。

## 在真实服务器上验证

使用几秒内就能结束的命令，逐项报告实际结果：

1. 免密登录能返回主机名，不出现提示。
2. 第一次同步到非空目录时先预演并停下，不做任何修改；确认后，本地文件同步到服务器，只留在本地的目录不会发送，之前由同步推送、随后在本地删除的代码文件会从服务器删除，只存在于服务器上的代码文件被保留并报告，本地的权重文件不会覆盖服务器上的同名文件，`delete.sh` 能删除指定的过时文件，并拒绝 `data/` 或 `runs/` 下的路径、权重文件和含有权重文件的目录；`run.sh rm ...` 会被拒绝。
3. 前台 GPU 检查输出 `True`，退出码为 0。
4. 运行一个会报错的脚本，本地能看到完整 Traceback，退出码非 0。
5. 后台任务立即返回，SSH 命令结束后仍在运行，`logs.sh` 能看到进度和最后的 `[exit 0 ...]`。
6. 同名的第二个任务被拒绝，名称是另一个任务前缀扩展的任务仍能启动，`stop.sh` 能停止运行中的任务。
7. 本地有未提交改动时，正式执行被拒绝；提交后可以启动，任务日志记录该提交。
8. 用 `--run <id> --startup` 跑的启动检查依次记为 `startup-01`、`startup-02`；随后正式执行只能启动一次，同一 Run 的第二次正式执行和之后的启动检查都会被拒绝。

验收后删除测试文件和 tmux 会话。检查失败时报告输出和可能的修复办法；不要为了让检查通过而修改服务器。
