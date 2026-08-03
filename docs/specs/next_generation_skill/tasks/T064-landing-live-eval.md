# T064：用当前 Codex subagent 验证显式 `landing`

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T063
- Parallel: No。两个显式进入场景分别使用 fresh Agent。

## 目标

验证修改后的 Landing 在两种用户明确要求中，都能把大胆方向改写成有价值、有现实边界、可验证且有止损的 Target Shape。它不能因修入口而退化成简短 MVP 建议，也不能在 Takeoff 后自动串联；未明确触发时不进入的边界由 Router、T063 和静态测试负责。

## 文件边界

### Add

- `test/skill-evals/landing-explicit-feasibility/scorecard.json`
- `test/skill-evals/landing-explicit-feasibility/evidence/live/`
- `test/skill-evals/landing-explicit-durable-queue/scorecard.json`
- `test/skill-evals/landing-explicit-durable-queue/evidence/live/`

### Must Not Modify

- `skills/hai-skills/landing/`
- `skills/hai-skills/takeoff/`
- T062 的 Scenario、Protocol、Proposal、Fixture、Baseline
- Router、AGENTS、README 或生产源码

## 执行方法

1. 完整读取 Workflow，确认两份 Proposal/rubric/Hash 当前且 Baseline 是真实 Red；`control-pass` 时停止并交用户复核价值。
2. 每场重建独立 Git 工作区，记录 Base，预检项目事实和当前 Skill copy。用不同 `fork_turns: "none"` Implementer，显式给当前 `landing/SKILL.md` 绝对路径/Hash并要求完整读取。
3. `landing-explicit-feasibility` 核对它读取真实代码/Architecture/容量约束，完成四类价值排序、五项现实检查、用户裁决点、Target Shape、阶段边界、便宜验证和止损；不输出实施顺序。
4. `landing-explicit-durable-queue` 核对它区分公开投递 API、持久格式、幂等键和内部实现，在保留 exactly-once 目标时给出成本、阶段边界、最便宜验证和止损；不写文件或实施步骤。
5. 每场派发不同的 `fork_turns: "none"` Reviewer，只给获批 rubric、原始多轮上下文、项目事实、输出和 final-tree/命令证据。Reviewer 检查入口授权与正文质量是两个独立硬门。
6. 写全部 Hash、不同 Agent ID、Terra 模型、硬门、评分、命令、`criticalPath` 顺序和建议，不写 `timing`。失败时重开 T063/T062，不在 Eval Task改 Skill或题目。
7. 两场 pass 后批量交用户；每场只有用户明确接受当前证据才标记 accepted。

## 与修改前版本比较

- 显式场景的 Value Ranking、Reality Check、Stage Boundary 和 Stop Rule 质量不得低于修改前 Skill。
- 两个显式场景都必须停在方向/可行性层；只把 description 改短但正文仍写自动承接不算通过。
- 当前 Skill 的增益由真实输出和分支证据证明，不靠静态关键词自报。

## 验证与完成

- 两个 Scorecard 通过 T002，硬门全 true，总分和每个维度至少 90，逐维只允许 `0 / 90 / 100`，并由用户最终 accepted。
- 两次都完成获批交互和非计时 `criticalPath`；运行 `python3 -m unittest test/test_landing_explicit_trigger.py` 和 `npm test`，清理临时工作区。
