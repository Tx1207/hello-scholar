---
name: checkpoint-manager
description: 通过 git snapshots 创建、验证并列出 workflow checkpoints，用于跟踪开发进度。
tags: [Git, Workflow, Checkpoint, Development]
---

# Checkpoint Manager

创建、验证并列出 workflow checkpoints，以跟踪开发进展。

## 操作

### 创建 Checkpoint

创建 checkpoint 时：

1. 运行快速验证，确保当前状态可接受
2. 使用 checkpoint 名称创建 git stash 或 commit
3. 将 checkpoint 记录到 `hello-scholar/checkpoints.log`：
   ```bash
   mkdir -p hello-scholar
   echo "$(date +%Y-%m-%d-%H:%M) | $CHECKPOINT_NAME | $(git rev-parse --short HEAD)" >> hello-scholar/checkpoints.log
   ```
4. 报告 checkpoint 已创建

### 验证 Checkpoint

与 checkpoint 对比验证时：

1. 从日志读取 checkpoint
2. 比较当前状态与 checkpoint：
   - checkpoint 之后新增的文件
   - checkpoint 之后修改的文件
   - 当前测试通过率 vs 当时测试通过率
   - 当前覆盖率 vs 当时覆盖率
3. 报告：
   ```text
   CHECKPOINT COMPARISON: $NAME
   ============================
   Files changed: X
   Tests: +Y passed / -Z failed
   Coverage: +X% / -Y%
   Build: [PASS/FAIL]
   ```

### 列出 Checkpoints

展示所有 checkpoints：
- 名称
- 时间戳
- Git SHA
- 状态（current、behind、ahead）

## 典型工作流

```text
[Start] --> create "feature-start"
   |
[Implement] --> create "core-done"
   |
[Test] --> verify "core-done"
   |
[Refactor] --> create "refactor-done"
   |
[PR] --> verify "feature-start"
```

## 选项

- `create <name>`：创建命名 checkpoint
- `verify <name>`：基于命名 checkpoint 验证
- `list`：展示所有 checkpoints
- `clear`：移除旧 checkpoints（保留最近 5 个）
