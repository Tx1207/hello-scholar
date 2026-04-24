# 高级工作流模式

用于复杂工作流的多步骤 command 序列、组合方式和状态协调模式。

## 概览

高级工作流会把多个 commands 组合起来，在多次调用之间维护状态，并形成更复杂的自动化流程。核心思想是：用简单 commands 作为 building blocks，拼成复杂功能。

## 多步骤 Command 模式

### 顺序式工作流 Command

适合引导用户按步骤完成流程：

```markdown
---
description: 完整 PR review 工作流
argument-hint: [pr-number]
allowed-tools: Bash(gh:*), Read, Grep
---

# PR Review Workflow for #$1

## Step 1: 获取 PR 详情
!`gh pr view $1 --json title,body,author,files`

## Step 2: 审查文件
Files changed: !`gh pr diff $1 --name-only`

For each file:
- 检查代码质量
- 确认测试是否存在
- 审查文档

## Step 3: 运行检查
Test status: !`gh pr checks $1`

Verify:
- 所有测试通过
- 没有 merge conflicts
- CI/CD 成功

## Step 4: 给出反馈

Summarize:
- 发现的问题（critical/minor）
- 改进建议
- 是否建议 approve
```

关键点：
- 用编号步骤保证清晰度
- 用 Bash 获取上下文
- 在关键节点让用户决策
- 明确给出下一步

### 带状态的工作流

在多次 command 调用之间保存状态：

```markdown
---
description: 初始化部署工作流
allowed-tools: Write, Bash(git:*)
---

# Initialize Deployment

当前分支: !`git branch --show-current`
最新提交: !`git log -1 --format=%H`

把状态写入 `.codex/deployment-state.local.md`

State saved. Run `/deploy-test` to continue.
```

后续 command 读取同一个 state file 继续执行。这种模式适合：
- 长流程
- 需要中断恢复
- 多阶段安全检查

### 条件分支工作流

根据环境、分支或检查结果动态分支：

```markdown
---
description: 智能部署工作流
argument-hint: [environment]
allowed-tools: Bash(git:*), Bash(npm:*), Read
---

# Deploy to $1

## Pre-flight Checks

Branch: !`git branch --show-current`
Status: !`git status --short`

- main/master: 需要额外批准
- feature branch: 给出目标提醒
- hotfix: 走快速流程

- 如果测试失败：停止
- production: 增加额外校验
- staging: 标准流程
- dev: 最少检查
```

## Command 组合模式

### Command Chaining

一个 command 只负责 orchestrate，真正动作交给其他 commands：

```markdown
1. Format code: /format-code
2. Run linter: /lint-code
3. Run tests: /test-all
4. Generate coverage: /coverage-report
5. Create review summary: /review-summary
```

原则：
- 子 commands 保持单一职责
- 组合 command 负责调度和汇总

### Pipeline Pattern

后一个 command 消费前一个 command 的输出，例如先跑 `/test-all`，再跑 `/analyze-test-failures`，对失败按类型、影响和修复成本排序。

### Parallel Execution Pattern

当任务互不依赖时，并行执行多个检查：
- 代码质量
- 安全扫描
- 依赖审计
- 性能 profiling

最后汇总所有结果。

## 工作流状态管理

### 使用 `.local.md` 文件

推荐把工作流状态写入插件专用 `.local.md` 文件，例如：

```markdown
.codex/plugin-name-workflow.local.md
```

可存：
- 当前 workflow 名称
- 当前 stage
- 开始时间
- 环境
- 分支和 commit
- 已完成步骤
- 待完成步骤

### 工作流恢复

当流程中断时，可以通过 state file 提供恢复选项：

1. 从上一步继续
2. 从头重来
3. 中止并清理

## 工作流协调模式

### Cross-Command Communication

commands 可以通过 marker file 彼此通信，例如：

```markdown
.codex/feature-complete.flag
```

其他 commands 检测到这个 flag 后，就知道某个 feature 已完成，可继续：
- integration testing
- docs generation
- release notes

### Workflow Locking

为避免并发执行同一流程，可使用 lock file：

```markdown
.codex/deployment.lock
```

开始流程前先检查 lock；完成或中止时再清理 lock。

## 高级参数处理

### 带默认值的可选参数

```markdown
Environment: ${1:-staging}
Version: ${2:-latest}
```

### 参数校验

```markdown
valid_envs="dev staging production"
if ! echo "$valid_envs" | grep -w "$1" > /dev/null; then
  ERROR: Invalid environment
fi
```

### 参数转换

支持 shorthand：
- `d/dev -> development`
- `s/stg -> staging`
- `p/prod -> production`

## 工作流中的错误处理

### Graceful Failure

每一步失败时都应：
- 立即停止后续危险操作
- 清楚说明失败原因
- 提供可选恢复路径

### Rollback on Failure

部署类工作流应在执行前保存可回滚状态；失败时自动 rollback，并告诉用户如何查看日志。

### Checkpoint Recovery

每完成一个阶段就记录 checkpoint。失败后可从最近成功 checkpoint 恢复，而不必整条链路重跑。

## 最佳实践

### Workflow Design

1. 用编号步骤展示清晰进度
2. 状态显式持久化，不依赖隐式上下文
3. 在关键节点保留用户控制权
4. 提前设计恢复路径
5. 告诉用户“已完成什么、还差什么”

### Command Composition

1. 每个 command 保持单一职责
2. commands 要容易组合
3. 输入输出风格尽量一致
4. 尽量松耦合，不依赖彼此内部实现

### State Management

1. 用 `.local.md` 保存持久状态
2. 原子更新 state file
3. 读取前先校验格式
4. 及时清理陈旧状态
5. 文档里说明 state file 结构

### Error Handling

1. 尽早发现错误
2. 错误信息要明确
3. 给出恢复建议
4. 保留恢复所需状态
5. 支持 rollback

## 完整示例：部署工作流

一个完整部署工作流通常拆成 4 个 commands：

1. `/deployment-init`
   - 初始化 state
2. `/deployment-validate`
   - 运行分支、测试、构建校验
3. `/deployment-execute`
   - 执行部署并更新状态
4. `/deployment-cleanup`
   - 删除 state file，完成收尾

这种拆分方式能同时实现：
- 顺序执行
- 状态恢复
- 清晰职责边界
- 更容易测试
