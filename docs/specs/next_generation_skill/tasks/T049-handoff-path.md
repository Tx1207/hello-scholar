# T049：保留 `handoff` 并将新写入路径移出 `memory/`

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T034, T053
- Parallel: Yes。T034 完成后可与其他 PR 6 新 Skill 开发并行；依赖 T034 是为了避免同时修改共享语言写文件测试。

## 用户已确认的决定

`handoff` 保留，不合并进 Spec、Tasks 或 Router。只把新 Handoff 默认路径从 `hello-scholar/memory/handoffs/` 改为 `hello-scholar/handoffs/`，并同步现有测试。旧 Handoff 的实际移动由 T046 迁移说明处理，本 Task 不迁移数据。

## 与原 Skill 比较

### 完整保留

- 把当前对话压缩为下一位 Agent 可继续使用的文档。
- 根据仓库语言偏好选择中英文模板。
- 不重复已有 PRD/Plan/ADR/Issue/Commit/Diff，改为引用路径。
- 敏感信息脱敏。
- 用户参数用于描述下一会话重点。
- 中英文 Handoff 模板的章节和内容。

### 唯一行为变化

| 原路径 | 新路径 |
|---|---|
| `hello-scholar/memory/handoffs/YYYY-MM-DD-<topic>-handoff.md` | `hello-scholar/handoffs/YYYY-MM-DD-<topic>-handoff.md` |

Handoff 不是五类核心文档，不进入 Spec Index 或 Run Index，不需要 Front Matter，也不新增独立 Handoff Index。

## Skill 编写预设计门

写文件前完整读取 `/xsb/.codex/skills/.system/skill-creator/SKILL.md`、`/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md` 和 `/xsb/hello-scholar/.agents/skills/writing-great-skills/GLOSSARY.md`：

`/xsb/hello-scholar/.agents/` 是被仓库忽略的原 checkout authoring 资产，不会自动出现在新 Worktree；路径缺失时停止并报告，不得改读待淘汰的 `writing-skills` 或凭记忆继续。

- `handoff` 保留窄 model invocation；description 只覆盖用户明确要求保存会话交接、为下一位 Agent准备接续上下文等意图，不设置 `disable-model-invocation: true`，也不从普通总结或长对话自动推断。
- leading word 是 `handoff`，单一 branch 的完成条件是下一位 Agent 能从一份脱敏、去重且有路径引用的文件继续工作。
- 模板继续作为 disclosed reference；SKILL.md 只保留触发、信息选择、目标路径和完成条件。
- 本 Task 只替换路径并清理旧路径 sediment，不重写已有效的压缩、引用、语言和脱敏规则。

## 与真实项目 Eval 的关系

路径替换仍保留静态测试，但用户要求每个保留 Skill 默认至少两个真实项目 subagent 场景。T053 先建立 Handoff 场景和 Red Baseline，本 Task 实现路径与 authoring 变更，T054 再做 Live Eval；三者职责不混写。

## 文件边界

### Modify

- `skills/productivity-skills/handoff/SKILL.md`
- `skills/productivity-skills/handoff/SKILL.zh_CN.md`
- `test/test_skill_written_file_language.py`

### Add

- `test/test_handoff_path.py`

### Must Not Modify

- `skills/productivity-skills/handoff/assets/handoff-template.md`
- `skills/productivity-skills/handoff/assets/handoff-template.zh_CN.md`
- 其他 Skill、AGENTS、README、`src/`

## 具体修改

1. 精准替换中英文 Skill 的保存路径，保留“当前项目或 Worktree 根目录”语义。
2. 增加一句边界说明：Handoff 不属于 Spec Bundle，不进入自动 Index；不要为了 Handoff 创建 `hello-scholar/memory/`。
3. 不增加旧路径 fallback、双写、symlink 或自动扫描/搬运旧 Handoff。
4. 更新语言写文件测试中 `handoff` case 的 `output_root` 为 `hello-scholar/handoffs`；路径之外的语言、protected terms、模板和 marker 断言不变。
5. 新路径测试断言中英文 Skill 只含新目标路径，旧路径不存在，模板 bytes 在修改前后不变。

## 测试

- 先写 `test/test_handoff_path.py` 的旧路径失败断言并观察 Red，再修改 Skill。
- 运行 `python3 -m unittest test/test_handoff_path.py test/test_skill_written_file_language.py`。
- 运行 `npm test`，确认 install/copy 能继续发现 Handoff Skill。

## 完成标准

- 新 Handoff 只写 `hello-scholar/handoffs/`，旧文档保持原位等待人工审核迁移。
- Handoff 原有压缩、引用、脱敏和语言能力无变化。
- 模板和其他 Skill 未被修改，没有新 Index 或兼容层。
