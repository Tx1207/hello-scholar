---
name: using-git-worktrees
description: 仅当用户明确要求 Git worktree、Approved Task 明确要求 Worktree Process，或用户明确批准 Agent 提出的具体隔离风险建议时使用 Worktree 隔离。
---

# 使用 Git Worktrees

## 入口门

仅在下列任一明确授权存在时进入：

1. **用户明确请求：** 用户清楚要求 Git worktree 或隔离工作区。
2. **Approved Task 要求：** Approved Task 明确写明使用 **Worktree Process**。
3. **已批准的风险建议：** Agent 说明具体隔离风险，例如会修改用户有未提交内容的 checkout 或被并行工作使用的分支，且用户明确批准该建议。

普通 Plan、Task、Feature 和 Validation 工作留在当前 Task 流程中。若均不适用，返回当前 Task 流程，不运行后续 Git 命令。不要仅因工作看似实现任务就询问或创建 worktree。

对于尚未获批的具体风险建议，说明具体风险并询问是否准备隔离 worktree。等待明确回答。批准会激活第 3 种授权；拒绝则返回当前 Task 流程且不创建。

用户明确请求、Approved Task 要求和已批准的风险建议都已经提供创建同意。不要向这些路径重复询问同一同意。

获得授权后，准备隔离 Git 工作区。**核心顺序：** Detect existing isolation first -> choose mechanism -> prepare -> verify。

## 范围与退出

此 Skill 在隔离工作区可用且其 baseline 状态已知时结束。它不实现功能、不 commit、不合并、不清理或移除 worktree。

退出此 Skill 后，按当前 AGENTS 和 Task 要求继续实施及验证。没有 worktree、拒绝隔离或创建被阻塞，都不免除必需测试。清理需要单独的明确授权，以及工作区和分支的真实 provenance。

## 第 0 步：检测已有隔离

仅在入口门已授权隔离后执行本步骤。创建任何内容前，记录仓库拓扑和源 checkout 状态：

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
SUPERPROJECT=$(git rev-parse --show-superproject-working-tree 2>/dev/null || true)
git status --short
git worktree list --porcelain
```

**Submodule guard：** `GIT_DIR != GIT_COMMON` 在 submodule 内也可能为真。若 `SUPERPROJECT` 非空，将当前仓库视为普通 checkout；不要只凭该比较推断已有 linked worktree。

- 若 `GIT_DIR != GIT_COMMON` 且 `SUPERPROJECT` 为空，当前目录已是 linked worktree。报告其绝对路径和分支，或将 detached HEAD 报告为外部管理。不要创建嵌套 worktree；继续第 2 步。
- 否则，报告这是普通 checkout，并继续第 1 步。

**完成条件：** 已记录 normal checkout、linked worktree、detached HEAD 或 submodule 结果；保留源 checkout 状态以便创建后比较。

## 第 1 步：选择机制

若第 0 步已发现 linked worktree，跳过本步骤。

### 1a. 原生 Worktree Tool

若平台确实提供原生 worktree tool，例如 `EnterWorktree`、`WorktreeCreate`、`/worktree` 命令或受支持的 worktree flag，优先使用它。入口门已经提供创建同意；不要重复询问同一问题。

让原生工具管理其受管路径和分支设置。不要在原生工具可用时使用 `git worktree add`，否则会创建 harness 无法管理的状态。

**完成条件：** 已记录原生工具生成的绝对路径和分支，然后继续第 2 步。

### 1b. Git Worktree Fallback

仅在没有原生 worktree tool 时使用此 fallback。按以下顺序选择目录：

1. 用户、当前 Task 或项目指令明确要求的目录。
2. 已有 `.worktrees/`（两个本地目录都存在时优先）。
3. 已有 `worktrees/`。
4. 已有 legacy 全局目录 `~/.config/superpowers/worktrees/<project>/`。
5. 其他情况，项目根目录下的 `.worktrees/`。

对于项目本地目录，创建前验证所选目录本身已被 ignored：

```bash
git check-ignore -q "$LOCATION"
```

若检查失败，说明向 `.gitignore` 添加该目录是额外的项目变更，并等待明确授权。不要自动编辑 `.gitignore` 或 commit。获得授权编辑后，重新运行 ignored 检查。全局目录不需要此仓库检查。

ignore 门通过后，从仓库根目录创建并检查 fallback worktree：

```bash
REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"
mkdir -p "$LOCATION"
git worktree add "$LOCATION/$BRANCH_NAME" -b "$BRANCH_NAME"
git worktree list --porcelain
git -C "$LOCATION/$BRANCH_NAME" rev-parse --show-toplevel
git -C "$LOCATION/$BRANCH_NAME" branch --show-current
```

若 `git worktree add` 被 sandbox 权限或其他错误阻塞，如实报告具体阻塞，不要声称隔离已就绪。返回当前 Task 流程，并在原地工作前等待指示。

**完成条件：** 所选机制报告绝对隔离路径和分支；对于 fallback，`git worktree list --porcelain` 和新 worktree 的 Git 命令确认已注册工作区。

## 第 2 步：准备隔离工作区

仅在 linked、原生创建或 fallback 创建的工作区中工作。确认其路径和 Git 状态，并与第 0 步记录的源 checkout 对比。不要 stage、覆盖或 commit 源 checkout 变更。

仅根据项目事实自动检测必要 setup：

```bash
# Node.js
if [ -f package.json ]; then npm install; fi

# Rust
if [ -f Cargo.toml ]; then cargo build; fi

# Python
if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
if [ -f pyproject.toml ]; then poetry install; fi

# Go
if [ -f go.mod ]; then go mod download; fi
```

若 setup 失败，报告命令和结果，然后询问是调查还是继续。不要将失败的 setup 表述为已就绪。

**完成条件：** 已知隔离工作区路径、分支状态、源 checkout 保留情况以及所有适用 setup 结果。

## 第 3 步：验证 Baseline

从隔离工作区运行项目适用的 baseline 命令，例如：

```bash
npm test / cargo test / pytest / go test ./...
```

若 baseline tests fail，停止，报告失败命令和结果，并询问是调查还是继续。不要声称工作区已就绪。若无法识别项目 baseline，报告该状态，并在宣布完成前询问。

**完成条件：** baseline 结果已明确知晓。只有隔离路径可用且 baseline 通过时，才能声明工作区 ready。

## 快速参考

| 情况 | 操作 |
|---|---|
| 用户明确要求隔离 | 进入；不重复询问创建同意 |
| Approved Task 明确要求 Worktree Process | 进入；不重复询问创建同意 |
| 具体风险尚未获批 | 说明风险、询问并等待，不创建 |
| 普通 Plan、Task、Feature 或 Validation | 留在当前 Task 流程；不从本 Skill 运行 Git 命令 |
| 已在 linked worktree | 保留它；跳过创建 |
| linked worktree 中为 detached HEAD | 报告外部管理状态；跳过创建 |
| 在 submodule 中 | 分类隔离前应用 submodule guard |
| 原生 tool 可用 | 在 Git fallback 前使用它 |
| 项目本地 fallback | 验证所选目录已 ignored |
| ignore 检查失败 | 为 `.gitignore` 变更请求单独授权 |
| sandbox 阻塞创建 | 报告阻塞；不声称 ready |
| baseline 失败 | 停止、报告并询问 |

## 常见错误

### 将任务形态视为同意

- **问题：** 因 Plan 或 feature 看起来是实现工作就开始隔离。
- **修复：** 要求一种入口门授权；具体风险必须先获明确批准。

### 对抗运行框架

- **问题：** 原生 worktree tool 可用时使用 `git worktree add`。
- **修复：** 先选择原生工具，只有它不可用时才用 fallback。

### 嵌套或误判隔离

- **问题：** 在 linked worktree 内再建 worktree，或将 submodule 混同为 worktree。
- **修复：** 先运行第 0 步，包括 superproject guard。

### 绕过 ignore 门

- **问题：** 未证明所选项目本地目录已 ignored 就创建 worktree。
- **修复：** 运行 `git check-ignore -q "$LOCATION"`；任何 `.gitignore` 编辑前获得单独授权。

### 隐藏未知 baseline

- **问题：** setup、sandbox 或 baseline 失败后仍报告 ready。
- **修复：** 报告观察到的命令结果，并停止等待指示。
