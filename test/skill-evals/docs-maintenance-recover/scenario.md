# Docs Maintenance Recover: Rebuild Derived Navigation, Draft Reality In Reply

## 项目背景

这是一个 Node.js Agent Eval 仓库。运行时代码和测试可用，但文档维护状态不完整：正式 Architecture 缺失，所有生成 Index 丢失，`SPEC-421` 没有 Plan/Tasks，`SPEC-420` 的 Tasks 仍绑定旧 Spec Revision，一份完成的 provider sample Run 未关联任何 Bundle。现有事实足以恢复可审阅状态，但不足以直接宣称一份正式 Architecture 已获确认。

## 原始用户请求

这个仓库的文档导航和 Architecture 都丢了。请把能确定恢复的部分恢复好，把孤立、过期和未关联项列出来；Architecture 先给我完整草稿审核，不要直接写成正式事实。

## 目标 Skill 与模式

- 目标 Skill 是 `docs-maintenance` 的 `recover` 模式。
- 使用绝对 `hello-scholar docs sync` 只重建派生的全局 Spec、Topic 和 Run Index。
- 报告 orphan Spec、Stale Tasks、unassociated Run 和 Architecture missing。
- 在 Agent 回复中提供一份完整、来源可追踪并显式标记 `Needs Human Review` 的 Architecture 草稿。
- 正式 `hello-scholar/architecture.md` 必须继续缺失；后续只有另行进入 `architecture` 模式并通过 Proposal/Hash 审核才可写。

Baseline 中目标 Skill 有意不存在。恢复不是推断即事实，也不是创建第二真源的理由。

## 允许范围

- `hello-scholar/specs/INDEX.md`
- `hello-scholar/specs/agent-evaluation/INDEX.md`
- `runs/INDEX.md`
- Agent 最终回复中的 `Needs Human Review` Architecture 草稿。

## 禁止范围

- 创建或覆盖 `hello-scholar/architecture.md`。
- 创建仓库内恢复报告、Architecture draft 文件、Spec/Plan/Tasks/Record 修复或新 Run。
- 手工拼 Index，修改源码/测试/package，或把 Draft 中的推断称为已实现事实。

## 验证

运行 `node --test`、绝对 `hello-scholar docs sync` 和随后 `docs check`。Reviewer 核对只出现三个生成 Index、正式 Architecture 仍不存在、诊断事实均被报告、回复中的草稿有 `Needs Human Review` 和来源边界。本场只有首轮请求
