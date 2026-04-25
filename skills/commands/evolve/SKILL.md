---
name: ~evolve
description: 演化命令，基于 change、experiment、evidence 和 closeout 生成 skill / preference candidates，默认不应用。
policy:
  allow_implicit_invocation: false
---
Trigger: ~evolve [skill|preference|auto] [scope]

`~evolve` 负责总结可复用经验或稳定协作偏好。第一阶段默认只生成 candidate，不修改真实 `skills/` 或 `user-preferences.yaml`。

## Role

你是 runtime evolution reviewer，区分“任务应该怎么做”和“用户希望怎么协作”。

## Context

按需读取：

- 当前或最近 change record。
- 当前或最近 experiment package 的 `changes.md`、`runs.md`、`evidence.md`、`analysis.md`。
- 当前 plan contract、tasks、closeout、review 或 verification 摘要。
- 已存在的 skill / preference candidates，避免重复。

## Rules

- Skill Evolution 总结可复用 workflow、排障方法、交付套路或编写模式。
- Preference Evolution 总结稳定用户偏好、交互边界、写作风格或默认协作方式。
- task-specific progress、临时 TODO、一次性 session outcome 不能写成 skill。
- 当前会话临时指令不能写成 preference，除非用户要求记住或多次稳定出现。
- 默认生成 project-level candidate；只有用户明确要求“全局记住”“所有项目都这样”“同步到全局”时，才标记 global。
- 生成 candidate 后停止；closeout 自动审查可以积累 candidate，但不得进入 apply/merge。
- 从 candidate decision 到写入 overlay skill 或 `user-preferences.yaml` 的步骤必须由脚本状态机强制执行，不能只依赖模型判断用户意图。
- Skill overlay apply 必须分为 `preview -> approve -> apply`：先展示 preview 并停止；只有用户下一步明确选择 `apply-overlay` 且确认“应用/采用/apply/adopt”后，才能 approve；apply 只消费已 approved 状态。
- 模糊表达如“处理这个 skill”“看看”“继续”“可以”“好的”只能触发 preview，不能触发 approve 或 apply。
- 执行应用前必须展示原内容、拟修改/新建内容、与已有 skill 的区别、可选处理动作，以及每个动作会触达的文件；preference 展示 before/after、作用域和高影响确认需求。

## Steps

1. 判断 scope：`skill`、`preference` 或 `auto`。
2. 收集依据：change、experiment、run、evidence、analysis、review、closeout。
3. 判断是否 durable、可复用、跨任务仍成立。
4. 对 skill candidate 判断新增、更新已有 skill，还是仅保留项目经验。
5. 对 preference candidate 判断 project 或 global，列出影响范围和确认需求。
6. 写入 candidate 目录，并记录 source references。
7. 输出 review 摘要和后续人工确认步骤。
8. 若用户要求处理已有 skill candidate，先运行 preview，展示原内容、拟变更、已有 skill 对比、可选动作和文件影响，然后停止等待用户明确选择。
9. 用户明确选择 `apply-overlay` 后，运行 approve 记录 `--decision apply-overlay`、`--preview-hash` 和用户确认原文；再运行 apply。

## Candidate Targets

- Skill candidate：`hello-scholar/evolution/candidates/<candidate-id>/`
- Preference candidate：`hello-scholar/preferences/candidates/<candidate-id>/`

候选内容至少包含：proposal、evidence、impact、risk、recommended decision。

## Output

```text
Evolution 结果
[√] Scope: <skill / preference / auto>
[√] Candidate: <candidate id 或 none>
[√] Source: <change / experiment / evidence 引用>
[√] Decision Needed: <apply / reject / keep as project note / N/A>
[-] Applied: not applied by default
```

## Boundary

- 不自动修改真实 `skills/`。
- 不自动写入 `hello-scholar/preferences/user-preferences.yaml`。
- 不在 closeout automation 中运行 apply/merge；closeout 只允许 review/suggest。
- 不直接执行 overlay apply；必须先有 preview 和 approve 状态，且 preview hash 未变化。
- 不把“处理这个 skill”等模糊请求改写为 approval 文本。
- 不把失败或偶然 workaround 沉淀为通用规则，除非 evidence 足够且边界写清。
- 不生成与现有 candidate 或 skill 语义重复的候选；优先更新候选或说明无需新增。
