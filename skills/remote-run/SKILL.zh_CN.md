---
name: remote-run
description: 一个 Agent 在本地机器上修改代码、另一个 Agent 在通过 SSH 访问的 GPU 服务器上工作和运行代码时，在项目的本地副本和服务器副本之间搭建双向 Git 同步。安装同步脚本，把两边各自的规则写入项目，并在真实服务器上验证同步。用于用户要求搭建或修复这种本地与服务器协作方式时。
---

# Remote Run

一个 Agent 在本地副本上工作；另一个 Agent（例如 Codex）在服务器副本上修改、运行和排查，紧挨着 GPU 和数据。两份副本都是同一分支上的 Git 工作区。改动只以提交的形式在两边之间移动，通过本地机器上的 `scripts/remote/sync.sh`，而且只做快进。数据、权重、日志和输出在服务器上不进 Git，同步永远不会碰它们。

## 先确认事实

向用户询问 SSH 别名和服务器上的项目路径。用 `ssh -o BatchMode=yes <别名> hostname` 确认免密登录，确认服务器上有 Git，以及本地项目是检出了某个分支的 Git 仓库。不要自行修改 `~/.ssh/config`、安装软件包或更改服务器设置；登录需要密钥或连接复用时，把要添加的配置块给用户看，包括 `ControlMaster auto`、`ControlPersist` 和 `ServerAliveInterval`。服务器上的 Agent 由用户自己配置。

只读地查看两边：服务器上的顶层条目及其大小，以及本地的 `.gitignore`。数据、checkpoint 和输出目录，例如 `data/`、`artifacts/`、`outputs/` 或 `wandb/`，必须在第一次同步前被 Git 忽略。把建议添加的 `.gitignore` 条目列成表格，用户确认后再添加，并遵循 Architecture 中记录的布局。

## 安装脚本

把 `assets/scripts/remote/` 中的文件复制到项目的 `scripts/remote/`，保持 `sync.sh` 可执行，填写 [remote.env](assets/scripts/remote/remote.env)，然后提交。

| 命令 | 作用 |
| --- | --- |
| `sync.sh init` | 第一次使用：把 `REMOTE_DIR` 变成本地分支上的工作区，不覆盖服务器文件。 |
| `sync.sh status` | 两边各自缺少的提交、服务器上未提交的文件，以及服务器上的 tmux 任务。 |
| `sync.sh pull` | 把本地分支快进到服务器的提交。 |
| `sync.sh push` | 把服务器分支快进到本地的提交；要求本地改动已提交。 |

服务器在另一个分支上、服务器上有未提交的跟踪文件改动，或者两边都有对方没有的提交时，`pull` 和 `push` 停下，两边都不改动；`push` 要覆盖服务器上的未跟踪文件时也会停下。接下来怎么做由项目规则告诉本地 Agent：请服务器那边先提交，或者把本地提交变基到 `refs/remote-run/server` 上再推送。服务器上没有被 Git 忽略的未跟踪文件只列出，从不拉回。

对已有目录（包括旧版 remote-run 部署过的目录）执行 `init` 时，把分支指向本地提交，只重置 Git 的暂存区。服务器上缺少的文件会被恢复；内容不同的服务器文件保持原样并列出，由用户决定是在服务器上提交它们，还是恢复成提交中的版本。服务器上已经有这个分支、并且有本地副本没有的提交时，`init` 停下。

## 写入项目规则

把 [assets/remote-rules.md](assets/remote-rules.md) 或 [assets/remote-rules.zh_CN.md](assets/remote-rules.zh_CN.md) 追加到项目的 AGENTS.md 和 CLAUDE.md 中、hello-scholar 管理块之外，填入真实的别名和服务器路径。两份副本通过 Git 共享这些文件，所以每个 Agent 都能读到自己的部分和对方的部分。有旧版 remote-run 的规则时替换掉，并在同一个提交中删除旧的 `scripts/remote/` 脚本。

## 在真实服务器上验证

使用几秒内结束的命令，报告每项检查的实际结果：

1. 免密登录直接返回主机名，没有提示。
2. 对真实目录执行 `init` 不改变任何服务器文件的内容，并列出内容不同的文件（如果有）；之后 `status` 显示两边在同一个提交上。
3. `push` 把搭建用的提交送到服务器工作区；在服务器上用 `git status --ignored` 查看，数据和输出目录显示为已忽略。
4. 在服务器上产生的提交（例如用户或服务器 Agent 的下一个提交）能用 `pull` 拉回。

停下的各种情况由脚本的测试覆盖；只有在用户同意做临时改动时，才在真实服务器上检查它们。检查失败时报告输出和可能的修复办法；不要为了通过检查而改动服务器。
