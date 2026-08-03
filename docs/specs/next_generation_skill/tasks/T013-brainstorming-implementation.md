# T013：将 `brainstorming` 升级为 Spec Bundle 主流程

- Status: `approved`
- PR: `PR 2 - Spec Bundle 与 Manage Specs`
- Depends On: T010, T012, T050
- Parallel: No。与 T050 修改同一 Skill，必须在 Visual Companion 删除后执行。

## 目标

保留当前 Brainstorming 已验证的对话设计方法，只改变触发范围、Spec 身份/输出合同和完成后路由。这不是重写 Brainstorm Prompt。

## 原 Skill 与新 Skill 对比

### 必须保留

- 先读项目上下文；一次一个问题；2–3 个方案、推荐与权衡。
- 覆盖模块、接口、数据流、错误处理和测试；只有材料性不确定性才一次询问一个问题。
- 批准前不实现；处理大范围分解；避免无关重构；Spec 自审和用户审阅门。

### 必须改变

- Frontmatter `description` 不再声称任何小修改都必须 Brainstorm；它用于新设计、外部行为/接口/模块变化和需要权衡的创造性工作。Fast Path 由 T043 Router 处理。
- 删除“每个项目无论多简单都必须完整 Brainstorm”的隐式路由，但一旦正式进入 Brainstorm，批准前不实现的硬门仍保留。
- 写入前调用 `manage-specs`，不再自己分配日期文件。新输出为 `<project-root>/hello-scholar/specs/<topic-id>/SPEC-NNN-<design-name>/spec.md`。
- 最终路由为：只运行已有代码的实验 -> `record-experiment`；需要实现 -> `writing-plans`；只完成设计 -> 结束。
- T050 已删除 Visual Companion；本 Task 不得重建或用新路径恢复它。

## Skill 编写预设计门

写文件前完整读取 `/xsb/.codex/skills/.system/skill-creator/SKILL.md`、`/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md` 和 `/xsb/hello-scholar/.agents/skills/writing-great-skills/GLOSSARY.md`：

`/xsb/hello-scholar/.agents/` 是被仓库忽略的原 checkout authoring 资产，不会自动出现在新 Worktree；路径缺失时停止并报告，不得改读待淘汰的 `writing-skills` 或凭记忆继续。

- `brainstorming` 保持 model-invoked，因为 Design Path 需要主动到达；description 只描述“需要设计取舍”，不再用泛化词把所有小改动吸入。
- 主步骤保持探索、材料性逐问、方案比较、完整 Spec 自审、整份用户审核、Spec 落盘和终止路由；每步都要有可观察完成条件，避免看到后续 Plan 后提前结束设计。
- `experiment | implementation | design-only` 是三个终止 branch；Spec 身份算法通过 context pointer 交给 `manage-specs`，不在两边重复。
- 删除 Visual sediment、旧路径、无调用方的 reviewer prompt 和 no-op 强制语；保留一次一问、2–3 方案、用户批准和不提前实现。

## 文件边界

### Modify

- `skills/superpowers-skills/brainstorming/SKILL.md`
- `skills/superpowers-skills/brainstorming/SKILL.zh_CN.md`

### Delete

- `skills/superpowers-skills/brainstorming/spec-document-reviewer-prompt.md`
- `skills/superpowers-skills/brainstorming/assets/spec-template.md`
- `skills/superpowers-skills/brainstorming/assets/spec-template.zh_CN.md`

模板的新唯一 owner 是 `skills/hello-scholar/manage-specs/assets/`。删除前必须确认 T010 的中英文完整模板存在。

### Add

- `test/test_brainstorming_skill.py`

### Must Not Modify

- `skills/hello-scholar/manage-specs/`
- 其他 Superpowers Skills
- `src/`

## 具体修改

1. 同步改写中英文 Checklist 和流程图：Explore -> material-question loop -> alternatives -> invoke manage-specs -> write/update complete Spec -> self-review -> whole-file user review -> route。Spec 固定七个核心章节，只有风险确有材料性内容时才加入条件章节。
2. 说明 `manage-specs` 的四种分类输出和用户确认边界，但不在 Brainstorm 里复制它的 ID/Revision 算法；那些由目标 Skill 拥有。
3. 用户批准的设计内容必须填入 `manage-specs` 选择的模板，不创建另一份中间 design doc。
4. Spec 自审检查七个核心章节、必要条件章节、占位、矛盾、范围、歧义和语言，并增加 ID/Revision/路径与分类结果一致性检查；自审完成后才提交一个完整文件给用户审核。
5. 删除无实际调用方的 `spec-document-reviewer-prompt.md`。Spec 自审和用户审阅已由主流程拥有，不保留死的可选 subagent 流程。
6. 保留项目默认语言规则。语言选择说明改为读取 `manage-specs/assets/` 中的对应模板。
7. 不要在 Brainstorm 中手工编辑自动 Index；写 Spec 后按 `manage-specs` 流程运行 docs check/sync。

## 测试

- 静态测试确认中英文 Skill 保留原有核心步骤，含 `manage-specs`、新 Bundle 路径和三路终止。
- 断言 Skill 不含 `hello-scholar/memory/`、日期 Spec、强制唯一 `writing-plans` 终点、Visual Companion 或被删资源引用，并断言 reviewer prompt 已删除。
- 断言 Brainstorm 目录不再保留 Spec 模板，而 `manage-specs/assets/` 有两份完整模板。
- 运行 `python3 -m unittest test/test_brainstorming_skill.py`、T050 的删除守卫测试和 `npm test`。

## 完成标准

- T012 场景有可执行的目标行为，同时原 Brainstorm 核心对话品质没有被删掉。
- Spec 身份/模板只有 `manage-specs` 一个 owner，Brainstorm 只负责设计对话和路由。
- 中英文合同对齐，没有旧路径、Visual Companion 或无调用方 Reviewer Prompt 残留。
