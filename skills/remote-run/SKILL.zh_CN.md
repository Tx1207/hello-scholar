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

把 `assets/scripts/remote/` 中的文件复制到项目的 `scripts/remote/`，保持 `.sh` 文件可执行，并填好 [remote.env](assets/scripts/remote/remote.env)。`REMOTE_SERVER_DIRS` 要列出所有只存在于服务器上的顶层目录，通常是 `data artifacts tmp`，已有项目还要加上旧的输出目录；以 Architecture 中记录的布局为准。同步从不发送或删除这些目录，任务在 `runs/` 下写入的文件也不会被同步删掉。

| 脚本 | 用途 |
| --- | --- |
| `sync.sh` | 把本地代码镜像到服务器；只在服务器上的目录和 Run 产出从不被删除。 |
| `run.sh` | 先同步，再在前台运行，或用 `--bg --name NAME` 在 tmux 中运行；`--run RUN_ID` 把正式 Run 唯一一次正式执行的日志写到 `runs/<run-id>/logs/`；`--run RUN_ID --startup` 把可反复运行的启动检查记在同一目录，编号为 `startup-NN`。 |
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
2. 运行 `sync.sh` 后，服务器代码与本地一致，本地删除的文件在服务器上也消失，只在服务器上的目录和 `runs/` 下的文件保留。
3. 前台 GPU 检查输出 `True`，退出码为 0。
4. 运行一个会报错的脚本，本地能看到完整 Traceback，退出码非 0。
5. 后台任务立即返回，SSH 命令结束后仍在运行，`logs.sh` 能看到进度和最后的 `[exit 0 ...]`。
6. 同名的第二个任务被拒绝，名称是另一个任务前缀扩展的任务仍能启动，`stop.sh` 能停止运行中的任务。
7. 本地有未提交改动时，正式执行被拒绝；提交后可以启动，任务日志记录该提交。
8. 用 `--run <id> --startup` 跑的启动检查依次记为 `startup-01`、`startup-02`；随后正式执行只能启动一次，同一 Run 的第二次正式执行和之后的启动检查都会被拒绝。

验收后删除测试文件和 tmux 会话。检查失败时报告输出和可能的修复办法；不要为了让检查通过而修改服务器。
