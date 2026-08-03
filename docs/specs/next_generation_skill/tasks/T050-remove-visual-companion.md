# T050：整体删除 Brainstorm Visual Companion

- Status: `approved`
- PR: `PR 2 - Spec Bundle 与 Manage Specs`
- Depends On: T012
- Parallel: No。与 T013 修改同一 Skill，必须先完成本 Task。

## 用户已确认的决定

Visual Companion 不迁移到 `hello-scholar/brainstorm/visual/`，而是整体删除。不保留新路径、兼容入口、启停脚本或简化服务器。这项删除不影响 Brainstorm 的文本提问、方案比较、设计批准和 Spec 流程。

## 与原 Skill 比较

- 原 Skill 在 Checklist 的第二步必须为可视化问题单独提议 Visual Companion，并在流程图中有浏览器分支。
- 原 `visual-companion.md` 描述本地网页交互，`scripts/` 中 5 个文件只服务该能力，并且写入旧 `hello-scholar/memory/brainstorm/visual/`。
- 新 Skill 不使用这个分支。如果未来需要可视化设计，应另行设计和审核，不在本 Task 留半套代码。

## Skill 编写 pruning 门

修改 Brainstorm Skill 前完整读取 `/xsb/.codex/skills/.system/skill-creator/SKILL.md`、`/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md` 和 `/xsb/hello-scholar/.agents/skills/writing-great-skills/GLOSSARY.md`。Visual Companion 是已经失去产品 owner 的独立 branch 和 sediment；本 Task 删除其入口、reference、脚本和负向残留，使文本主流程保持单一事实源。删除后检查 Checklist/流程图的每一步仍有连通下一步和完成条件，不用“不要使用 Visual”这类 negation 留下概念激活。

`/xsb/hello-scholar/.agents/` 是被仓库忽略的原 checkout authoring 资产，不会自动出现在新 Worktree；路径缺失时停止并报告，不得改读待淘汰的 `writing-skills` 或凭记忆继续。

## 文件边界

### Modify

- `skills/superpowers-skills/brainstorming/SKILL.md`
- `skills/superpowers-skills/brainstorming/SKILL.zh_CN.md`

### Delete

- `skills/superpowers-skills/brainstorming/visual-companion.md`
- `skills/superpowers-skills/brainstorming/scripts/frame-template.html`
- `skills/superpowers-skills/brainstorming/scripts/helper.js`
- `skills/superpowers-skills/brainstorming/scripts/server.cjs`
- `skills/superpowers-skills/brainstorming/scripts/start-server.sh`
- `skills/superpowers-skills/brainstorming/scripts/stop-server.sh`

### Add

- `test/test_brainstorming_no_visual_companion.py`

### Must Not Modify Or Delete

- `skills/superpowers-skills/brainstorming/assets/spec-template.md`
- `skills/superpowers-skills/brainstorming/assets/spec-template.zh_CN.md`
- `skills/superpowers-skills/brainstorming/spec-document-reviewer-prompt.md`
- Brainstorm 的其他对话设计规则（由 T013 升级）

## 具体修改

1. 从中英文 Checklist 删除“Offer visual companion”步骤，重新编号后续步骤。
2. 从中英文 Graphviz 流程图删除 `Visual questions ahead?`、`Offer Visual Companion` 节点和所有连线；`Explore project context` 直接进入澄清问题。
3. 删除中英文 `## Visual Companion` 整节、单独征求同意的话术、浏览器/终端判定和详细指南链接。
4. 删上述 6 个专用文件。如果 `scripts/` 目录因此为空，不保留空目录占位。
5. 不把这些说明换成“请使用其他可视化 Skill”，因为本次没有选定替代品。

## 测试

- 静态测试扫描 Brainstorm 中英文 Skill，禁止 `Visual Companion`、`visual-companion.md`、`start-server.sh`、`stop-server.sh`、`brainstorm/visual` 和旧 `memory/brainstorm`。
- 断言 6 个删除文件不存在，同时断言中英文 Skill、Spec 模板和 Reviewer Prompt 仍存在。
- 检查 Graphviz 代码块不留孤立节点或连线。
- 运行 `python3 -m unittest test/test_brainstorming_no_visual_companion.py`、`npm test`。

## 完成标准

- Visual Companion 的入口、文档、脚本和路径已全部消失。
- Brainstorm 的文本主流程仍可读且流程图连通。
- 没有新建替代可视化能力，没有修改 T013 才拥有的 Spec Bundle 逻辑。
