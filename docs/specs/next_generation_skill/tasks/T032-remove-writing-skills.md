# T032：删除 `writing-skills`

- Status: `approved`
- PR: `PR 4 - 主 Agent 执行收敛与 Converge`
- Depends On: T029, T031
- Parallel: No。先删除它引用的旧 Debugging/Verification Skill，再移除整个自包含工具集。

## 用户已确认的决定

完整删除仓库内 `writing-skills`。下一代 Skill 的创建或重大修改由已批准的独立 Task、`test/skill-evals/WORKFLOW.md`、Scenario/Red/Implementation/Live Eval 和当前平台可用的系统级 Skill authoring 指南共同约束，不再保留一份 Claude/TodoWrite 特定的 655 行生产 Skill。

## 原 Skill 与新做法比较

原 Skill 包含 Skill 目录/Front Matter/description 写法、搜索优化、字数建议、Graphviz、代码示例、Red-Green-Refactor、压力场景、反合理化和发布 Checklist。它还强制任何 Skill 编辑都先调用 TDD，并包含 Anthropic 文档、心理学材料、渲染脚本和 Claude 示例。

下一代把真正需要的项目合同放到测试而不是生产触发面：

- 每个 Skill 变更的 Why、原 Skill 对比、文件边界和验证写在独立 Task；
- 新增/重大修改必须有 Scenario -> Red Baseline -> Implementation -> Live Eval；
- `test/skill-evals/WORKFLOW.md` 是唯一项目评测流程；
- TDD 不因“正在改 Skill”自动启动，只有用户或 Approved Task 明确指定时启动；
- 平台提供的 authoring 指南可按当次请求读取，不复制进本仓库产品 Skill。

## 文件边界

### Delete

- `skills/superpowers-skills/writing-skills/SKILL.md`
- `skills/superpowers-skills/writing-skills/SKILL.zh_CN.md`
- `skills/superpowers-skills/writing-skills/anthropic-best-practices.md`
- `skills/superpowers-skills/writing-skills/testing-skills-with-subagents.md`
- `skills/superpowers-skills/writing-skills/persuasion-principles.md`
- `skills/superpowers-skills/writing-skills/graphviz-conventions.dot`
- `skills/superpowers-skills/writing-skills/render-graphs.js`
- `skills/superpowers-skills/writing-skills/examples/CLAUDE_MD_TESTING.md`

目录及空 `examples/` 一并删除。

### Add

- `test/test_no_writing_skills_skill.py`

### Must Not Modify

- `test/skill-evals/WORKFLOW.md`
- `test-driven-development`（T036-T038 单独收窄触发）
- 其他生产 Skill、AGENTS、README、`src/`
- shared Skill catalog（T065 统一更新）

## 实施与验证

1. 删除整个目录，不把 authoring 文档搬到 `docs/` 或新 Skill，也不保留渲染脚本为无 owner 工具。
2. 新测试断言 8 个文件、目录和 Skill discovery entry 不存在。
3. 正向断言 `test/skill-evals/WORKFLOW.md` 仍定义 Red Baseline、Implementer、Reviewer、Scorecard 和失败处理；这证明项目内 Skill 质量流程没有一起丢失。
4. 运行 `python3 -m unittest test/test_no_writing_skills_skill.py test/test_skill_eval_contract.py` 和 `npm test`。

## 完成标准

- `writing-skills` 的生产入口、references、示例和工具全部消失。
- 项目 Skill 评测只有 `test/skill-evals/WORKFLOW.md` 一个 owner。
- 没有新增 Skill、迁移文档副本或自动 TDD 触发。
