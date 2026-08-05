---
schema: 1
kind: record
run_id: 20260803-1514-generating-tasks-v3-feature-policy-baseline
title: generating-tasks v3 功能策略 Baseline 评测
status: completed
spec: null
spec_revision: null
plan_revision: null
started: 2026-08-03T15:28:52Z
completed: 2026-08-03T16:10:40Z
decision: revise-generating-tasks
summary: Sonnet v3 功能策略 Baseline 已完成并确认真实 skill-behavior Red：缺少 generating-tasks 时，Tasks 文档使用错误 approval 值、缺少逐 Task 合同字段，且 docs check 退出 1；生产 Skill 已进入定向修订验证。
---

# generating-tasks v3 功能策略 Baseline 评测

## 1. 目的

- 目的: 在不加载 `generating-tasks` Skill 的隔离 Fixture 中，取得该功能策略 Tasks 生成请求的真实 Baseline 证据。

## 2. 假设

- 假设: 缺少专用 Skill 时，通用 Agent 的输出可能无法满足已批准的 Tasks 文档、覆盖、依赖、验证和范围合同；结果必须由独立 Reviewer 根据真实交互与产物判定。

## 3. 实验变量

- 变量: Skill snapshot 为 `absent`；Implementer 和 Reviewer 均为新的 `claude-sonnet-5` Agent，且 `forkTurns: none`。

## 4. 控制条件

- 控制条件: 仅复制 `test/skill-evals/generating-tasks-v3-feature-policy/fixture` 到新的临时目录；保留获批 Scenario、Protocol、Fixture 和共享 rubric 的当前 Hash；Implementer 不读取 Scenario、Protocol、rubric、Task Packet、生产 Skill 或其他 Eval 证据。

## 5. 执行信息

- 精确命令: `env -C /tmp/hello-scholar-eval-generating-tasks-v3-feature-policy-baseline-4ea23bb3 PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests`；`env -C /tmp/hello-scholar-eval-generating-tasks-v3-feature-policy-baseline-4ea23bb3 node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js docs sync`；`env -C /tmp/hello-scholar-eval-generating-tasks-v3-feature-policy-baseline-4ea23bb3 node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js docs check`；随后由一名新 `claude-sonnet-5` Implementer 接收原始用户请求，结束后由不同的新 `claude-sonnet-5` Reviewer 审阅真实证据。
- 工作目录: `/tmp/hello-scholar-eval-generating-tasks-v3-feature-policy-baseline-4ea23bb3`。
- 脚本 / 入口: Python unittest；`/xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js`；Claude Code direct collaboration。
- 配置: Proposal `proposal-generating-tasks-v3-feature-policy-sonnet`；Scenario SHA-256 `b0d3541a632f212fa545ffe56cc1b9059f2c7ed48f6cb8b9536582d4ac31f816`；Protocol SHA-256 `932c163d7ce551f30b08a4b027bed96fb4edbab8884f04f16a7f1621447f02f1`；Fixture SHA-256 `552900ceea3fd669cf55a785143a6e1cc583645a28863365ab74afc286f21315`。
- CLI 覆盖参数: `PYTHONDONTWRITEBYTECODE=1` 与 `-B` 仅用于 Python 命令。
- 随机种子: 不适用。
- 数据版本 / 划分: Fixture 内的固定 Spec、Plan、源码和测试；无外部数据集。
- 预处理: 复制 Fixture；运行 docs sync、初始测试和 docs check；初始化 Git 并提交干净 Base。
- 输入产物: 获批 Batch `generating-tasks-sonnet-v3-proposals-batch-v1`，Batch SHA-256 `4f39d2a323c6e262850c9ffb76a54c25caaed06213d39ca0c4790a822bc82c0e`；共享 rubric SHA-256 `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`。
- 上游 Run ID: 无。
- 派生产物: Baseline JSON、环境、Prompt、交互、命令、树和 Reviewer 证据。
- Model / checkpoint: `claude-sonnet-5`；无 checkpoint。
- 评估 / 生成设置: 一轮原始用户请求；Skill snapshot `absent`；Implementer 与 Reviewer ID 必须不同。
- Git 分支: `codex/next-generation-skill`。
- Git 提交: `14b8865d0cd6913b144a4e38a2afa2fee8c5a4af`。
- Git 工作区状态: 启动前存在未提交的 Eval-contract hardening、Proposal approval、Run Record 和 `test/__pycache__/` 变更；这些不进入隔离 Fixture。
- Backend: 本地 Claude Code direct collaboration。
- 机器 / GPU: 本地 Linux 环境；GPU 不适用。
- Python / 环境: Node `v24.18.0`；Python `3.10.12`；Git `2.34.1`。
- 预期信号: 环境预检通过后，保存一份由真实交互、命令、完整树和独立 Reviewer 支持的 `fail` 或 `control-pass` Baseline。
- 失败信号: Fixture 复制、初始测试、docs check、Git Base、Sonnet 可用性或 Agent 交付任一项失败时停止为环境阻塞，不写质量结论。
- 停止规则: 不在预检前派发 Agent；每次仅一个正式 Eval Agent；`control-pass` 立即停止该场景，只有真实 `fail` 才开放定向实现与新的 Live Eval。

## 6. 产物位置

- 预期日志路径: `test/skill-evals/generating-tasks-v3-feature-policy/evidence/baseline/v3-20260803/` 下的 `environment.md`、`prompt-round-0.md`、`interaction.md`、`commands.md`、`tree.md` 与 `reviewer.md`。
- 预期结果路径: `test/skill-evals/generating-tasks-v3-feature-policy/baseline.json`。
- 预期 checkpoint 路径: 不适用。
- Dashboard / tracking URL: 不适用。

## 7. 执行事件

| 时间 | 事件 | 观察 | 处理 |
|---|---|---|---|
| 2026-08-03T15:14:32Z | 创建事前 Record | 已核对获批 Batch 与运行身份 | 等待隔离预检通过后启动 |
| 2026-08-03T15:28:52Z | 启动 Baseline Implementer | 独立 Fixture Base、初始测试和 docs check 均已通过 | 等待真实最终回复后再启动不同 ID 的 Reviewer |
| 2026-08-03T16:10:40Z | 完成独立 Reviewer | Reviewer 基于真实交互、命令和完整树建议 `skill-behavior` `fail`；合同验证器确认 Baseline 有效且为 Red | 仅围绕 metadata 与逐 Task 字段缺口修订生产 Skill |

## 8. 关键结果

- 指标: 业务质量 75/100；用户价值 92/100；必需 `docs check` 退出 1。
- 结果文件: `test/skill-evals/generating-tasks-v3-feature-policy/baseline.json`，SHA-256 `3ff2b9f4e59b9880eb64616cac0213caaa665074c7029a4cb64973127a781323`。
- 最佳 checkpoint: 不适用。

## 9. 观察

- 观察: Implementer 仅新增目标 Bundle 的 `tasks.md`，但写入 `approval: pending` 而非 `pending-review`，且未为每个顶层 Task 明确保留所需字段；Python 测试通过而 docs check 失败。
- 失败证据: `test/skill-evals/generating-tasks-v3-feature-policy/evidence/baseline/v3-20260803/reviewer.md` 和 `commands.raw.log`。
- 有效性说明: 本 Record 在任何 Implementer 或 Reviewer 启动前创建；真实 Baseline 由不同 Sonnet Implementer/Reviewer、完整交互、命令和树证据支持，且合同验证器确认有效。

## 10. 结论

- 结论: `generating-tasks` 缺失时未能稳定产生符合 Tasks 生命周期和独立字段合同的文档；这是 skill-behavior Red，不是环境阻塞。
- 注意事项: 不得用历史 Terra 证据、主 Agent 判断或环境问题代替这次 Sonnet v3 运行。

## 11. 决定

- 决定: revise-generating-tasks。

## 12. 后续行动

- 后续行动: 验证针对性 Skill 修订，然后在新的隔离工作区和全新 Sonnet Agent 中运行 Live Eval；迁移 Baseline 仍按独立场景流程继续。
