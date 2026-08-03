# T026：删除 `requesting-code-review`

- Status: `approved`
- PR: `PR 4 - 主 Agent 执行收敛与 Converge`
- Depends On: T020, T025
- Parallel: Yes。T020 已确认 Writing Plans 无旧依赖，T025 已删除唯一强制模板消费者。

## 用户已确认的决定

完整删除 `requesting-code-review` 和 `code-reviewer.md`。不再强制每个 Task、重大功能或合并前都通过这个 Skill 派发 reviewer。用户仍可直接要求代码审查，主 Agent也可按风险临时委派只读 Reviewer。

## 原 Skill 与新做法比较

原 Skill 提供 Review 时机、BASE/HEAD SHA、隔离 Reviewer Prompt、Critical/Important/Minor 处理和“不要盲信审查”的入口。它的必需消费者是已删除的 `subagent-driven-development`，其余价值已有 owner：

- 用户说“review”时，主 Agent按代码审查请求直接检查真实 diff、测试和需求，不需要额外触发包装 Skill；
- AGENTS 的 Read/Think/Verification/Communication 要求验证反馈、说明证据和风险；
- T001 的 Eval Reviewer 仍是独立 Agent，但使用 Scenario/Protocol，而不是 `code-reviewer.md`；
- Converge 检查完整 Bundle 是否偏离合同，不等于通用代码风格 Review。

## 文件边界

### Delete

- `skills/superpowers-skills/requesting-code-review/SKILL.md`
- `skills/superpowers-skills/requesting-code-review/SKILL.zh_CN.md`
- `skills/superpowers-skills/requesting-code-review/code-reviewer.md`

目录为空后删除目录本身。

### Add

- `test/test_no_requesting_code_review_skill.py`

### Must Not Modify

- `test/skill-evals/WORKFLOW.md`
- `skills/hello-scholar/converge-to-spec/`
- AGENTS、README、`src/`、其他 Skill
- 共享 Skill catalog（T065 统一更新）

## 实施细节

1. 删除三个文件，不移动 Reviewer 模板、不保留 `reviewing-code` 别名。
2. 不把 Review 重新变成主流程硬门；Task 只有在自身 Validation/Completion 或用户明确要求时才需要特定 Review 证据。
3. 测试断言目录和 Skill discovery 条目不存在，同时确认 `test/skill-evals/WORKFLOW.md` 仍包含独立 Eval Reviewer，避免把产品删除误扩成取消测试隔离。

## 验证与完成

- 运行 `python3 -m unittest test/test_no_requesting_code_review_skill.py` 和 `npm test`。
- Skill 不再安装，Reviewer 模板没有复制到其他目录。
- 用户/主 Agent仍可使用平台通用 subagent 做按需审查，但仓库不宣称这是必需产品链。
