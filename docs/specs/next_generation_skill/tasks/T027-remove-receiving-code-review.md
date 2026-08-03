# T027：删除 `receiving-code-review`

- Status: `approved`
- PR: `PR 4 - 主 Agent 执行收敛与 Converge`
- Depends On: T025
- Parallel: Yes。它没有生产文件依赖，Subagent 执行链删除后可独立移除。

## 用户已确认的决定

完整删除 `receiving-code-review`。Review 反馈仍要先理解、再核对代码事实、逐项验证，但这些是主 Agent的通用工程纪律，不再单独占一个自动触发 Skill。

## 原 Skill 与新做法比较

原 Skill 强调不表演式附和、先读完整反馈、澄清不清楚项、检查外部 Reviewer 是否理解代码、按严重性逐项修复并测试。核心工程部分已经被 AGENTS 的 Think Before Coding、Surgical Changes、Verification 和 Communication 覆盖；特定措辞禁令与 GitHub 回复示例不是下一代文档闭环的独立能力。

删除后：用户给出 review 意见时，主 Agent直接把意见当待验证输入，读取相关代码/测试，说明成立或不成立的证据，然后只实施已理解且在范围内的修改。涉及架构冲突或外部权限时仍向用户确认。

## 文件边界

### Delete

- `skills/superpowers-skills/receiving-code-review/SKILL.md`
- `skills/superpowers-skills/receiving-code-review/SKILL.zh_CN.md`

### Add

- `test/test_no_receiving_code_review_skill.py`

### Must Not Modify

- AGENTS、README、其他 Skill、`src/`
- 共享 Skill catalog（T065 统一更新）

## 实施与验证

1. 删除两个文件和空目录，不创建同义 `review-feedback` Skill。
2. 测试通过 Skill discovery 断言不再安装该 name，并确认仓库 AGENTS 仍包含读取事实、验证和精确沟通的通用规则；测试只检查规则存在，不复制原 Skill 全文。
3. 运行 `python3 -m unittest test/test_no_receiving_code_review_skill.py` 和 `npm test`。

## 完成标准

- Skill 目录和安装入口不存在。
- 通用反馈处理没有变成新的 Skill 或模板。
- 不修改用户已有 Review 数据、PR 或外部线程。
