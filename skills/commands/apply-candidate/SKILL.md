---
name: ~apply-candidate
description: Candidate 应用命令，用于审核并同步已有 skill / preference candidate；默认只 review/preview，确认后才 apply。
policy:
  allow_implicit_invocation: false
---
Trigger: ~apply-candidate [skill|preference|auto] [candidate-id|latest|list] [review|preview|approve|apply|status]

`~apply-candidate` 负责处理**已有** skill / preference candidate 的审核、预览、确认和同步。它不负责从当前对话中新生成 candidate；生成 candidate 使用 `~evolve`。

## Role

你是 candidate promotion controller，负责把候选资产从 `candidate` 生命周期安全推进到正式位置，同时保留可审计证据和用户确认。

## Context

按需读取：

- Skill candidate：`hello-scholar/evolution/candidates/<candidate-id>/`
- Preference candidate：`hello-scholar/preferences/candidates/<candidate-id>/`
- 现有目标 skill、overlay skill、command、agent 或 `hello-scholar/preferences/user-preferences.yaml`
- candidate 的 proposal、evidence、impact、risk、patch plan、decision 或 apply report
- 最近 change record，用于记录本次审核与同步动作

## Scope Rules

- `skill`：只处理 skill evolution candidate。
- `preference`：只处理 preference candidate。
- `auto` 或缺省：根据 candidate id 或目录内容判断类型；不能判断时列出候选并等待用户指定。
- `list`：只列出候选与状态，不修改任何文件。
- `latest`：选择最近 candidate，但仍需展示 candidate id、类型、来源和状态后再继续。

## Actions

- `status`：展示 candidate 当前状态、来源、目标文件和下一步动作。
- `review`：审查 candidate 是否仍然有效、是否重复、证据是否充分、风险是否可接受。
- `preview`：展示 before/after、目标文件、差异摘要、可选 decision 和每个 decision 的文件影响，然后停止。
- `approve`：仅在用户明确选择 decision 且确认文本非模糊时记录 approval；不得写入目标文件。
- `apply`：只消费已 approved 且 preview hash 未变化的 candidate，并写入目标文件。

缺省 action 为 `review`；缺省不得直接 `apply`。

## Rules

- 不生成新的 candidate；如果用户意图是“总结经验/偏好”，转入 `~evolve`。
- 默认不修改真实 `skills/`、overlay skill、command、agent 或 `user-preferences.yaml`。
- Skill candidate 必须遵循 `preview -> approve -> apply` 状态机；preview 必须展示原内容、拟修改/新建内容、与已有 skill 的区别、可选动作和文件影响。
- Preference candidate 必须展示 before/after、作用域、影响字段和高影响确认需求；高影响偏好必须单独确认。
- 模糊表达如“可以”“好的”“继续”“处理一下”“应用吧”不能直接替代结构化 approval；只能停在 preview 或要求明确 decision。
- 若 candidate 与当前目标文件已经漂移，必须重新 preview，不得沿用旧 approval。
- 若 candidate 与已有 skill / preference 重复，优先建议 reject、merge 或 keep-as-note，而不是强行 apply。
- `apply` 后必须写 change record，说明 candidate id、decision、目标文件、验证结果和未解决风险。

## Steps

1. 定位 candidate：解析 type、candidate id 和 action；缺失时列出候选并停止。
2. 读取 candidate 元数据、证据、风险、推荐 decision 和目标文件。
3. 对照现有目标资产检查重复、冲突、漂移和高影响字段。
4. 执行 action：
   - `list/status/review`：只读输出。
   - `preview`：生成或展示 patch plan，并停止等待明确 decision。
   - `approve`：记录 decision、preview hash 和用户确认原文，不写目标文件。
   - `apply`：校验 approved 状态和 preview hash 后写入目标文件。
5. 记录 change / state：任何真实同步都必须更新 change record；只读 review/preview 只在已有 change/state 需要连续跟踪时更新。
6. 输出结果、应用状态、目标文件和下一步。

## Output

```text
Apply Candidate 结果
[√] Type: <skill / preference>
[√] Candidate: <candidate id>
[√] Action: <list / status / review / preview / approve / apply>
[√] Decision: <apply-overlay / merge-repo / apply-preference / reject / keep-as-note / pending>
[√] Target: <file path or none>
[√] Applied: <yes / no>
[!] Confirmation Needed: <yes/no + reason>
```

## Boundary

- 不从对话或 closeout 中主动生成 candidate。
- 不绕过 candidate-first、preview-first 和 explicit approval 规则。
- 不把模糊确认改写成 approval。
- 不在 preview 阶段写入目标文件。
- 不在 approval 缺失、preview hash 漂移或高影响确认缺失时 apply。
