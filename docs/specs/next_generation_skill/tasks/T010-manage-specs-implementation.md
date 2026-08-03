# T010：实现 `manage-specs` Skill

- Status: `approved`
- PR: `PR 2 - Spec Bundle 与 Manage Specs`
- Depends On: T008, T009
- Parallel: No。需要已有 Red Baseline 和可用的 docs CLI。

## 目标

新增一个专门管理 Spec 身份的 Skill。它在写文件前查找已有设计，只做四种明确分类，并保证同一设计使用同一 Spec ID/Bundle。它不自己批准 Spec，不连带生成 Plan/Tasks，不做通用语义相似度引擎。

## 与原有 Skill 的关系

| 现状 | 新设计 |
|---|---|
| `brainstorming` 直接写日期命名的单文件 Spec | `brainstorming` 先调用 `manage-specs`，由它决定修改原 Bundle 或建新 Bundle |
| Spec 模板只有 Goal/Requirements/Design 等简化段落 | `manage-specs/assets/` 持有 PRD 规定的 Front Matter、七个核心章节和按风险出现的条件章节 |
| 没有稳定 ID、Revision 或替代关系管理者 | 本 Skill 是唯一的 Spec 身份与 Revision 流程 owner |

原 `brainstorming` 的提问、方案、设计审批能力不移到本 Skill；那些由 T013 保留。

## Skill 编写预设计门

写文件前完整读取 `/xsb/.codex/skills/.system/skill-creator/SKILL.md`、`/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md` 和 `/xsb/hello-scholar/.agents/skills/writing-great-skills/GLOSSARY.md`，并用它们检查本 Task：

`/xsb/hello-scholar/.agents/` 是被仓库忽略的原 checkout authoring 资产，不会自动出现在新 Worktree；路径缺失时停止并报告，不得改读待淘汰的 `writing-skills` 或凭记忆继续。

- `manage-specs` 保持 model-invoked，因为 `brainstorming` 和 Router 需要主动到达它；description 只保留“Spec 身份分类”这一真实触发，不复制四类流程。
- 四种分类是四个明确 branch，leading word 使用 `classification`；每个 branch 都以“给出唯一分类、证据和下一步确认门”为可检查完成条件。
- ID、Front Matter、七个核心章节和条件章节规则属于 disclosed reference，留在 `assets/`；所有 branch 都需要的用户确认和单文档边界留在 `SKILL.md`。
- 保留原 Brainstorm 的设计判断 owner，不在新 Skill 沉积提问、实现或通用相似度能力；逐句删除 duplication、no-op 和只有禁止没有正向动作的表述。

## 文件边界

### Add

- `skills/hello-scholar/manage-specs/SKILL.md`
- `skills/hello-scholar/manage-specs/SKILL.zh_CN.md`
- `skills/hello-scholar/manage-specs/assets/spec-template.md`
- `skills/hello-scholar/manage-specs/assets/spec-template.zh_CN.md`
- `test/test_manage_specs_skill.py`

### Must Not Modify

- `skills/superpowers-skills/brainstorming/`（由 T013 处理调用方和旧模板）
- `src/`
- `AGENTS.md`、`README.md`

## Skill 必须实现的流程

1. 确认项目根目录，运行 `hello-scholar docs sync` 刷新派生 Index。如果有结构错误，停止并报告，不绕过验证直接写 Spec。
2. 读全局 Index、目标 Topic Index 和标题/问题/目标可能相关的 Spec 正文。不默认读取全部历史文档。
3. 只输出 `Update Existing Spec`、`Create Independent Spec`、`Create Successor Spec`、`Need Human Classification` 之一，同时用人话列出候选 Spec 和判断理由。
4. `Update Existing Spec`：保持 ID、Topic 和 Bundle 路径。语义变化时 Revision +1，更新 `updated`，并在 `Revision History` 记录这次变化；只改格式/错别字时不增 Revision。
5. `Create Independent Spec`：必须既代表不同问题或真正独立能力，又能独立批准、实施、验证并停止/回滚。只满足其中一个弱条件时不能创建；写入前必须等用户明确确认。
6. `Create Successor Spec`：只在新设计根本替代原设计时使用，写入前确认，同时维护新 Spec `supersedes` 和旧 Spec `superseded_by`，不制造环。这里同时更新新旧两份 `spec.md` 是“同一类核心文档关系维护”的显式事务例外；不能顺带修改 Plan、Tasks 或 Architecture。
7. `Need Human Classification`：独立生命周期证据不完整、多个候选 Spec 同样合理或其他本地事实无法消歧时使用；只列边界并等待用户，不猜测、不先写文件。
8. 新 Spec ID 使用全局现有 ID 数字最大值 +1，至少三位补零，不重用空洞或已被 superseded/rejected 的 ID。Topic 和目录 slug 使用小写 kebab-case，不带 `new/final/latest/v2`。
9. 同一问题的多个候选方案写进同一 Spec 的“候选方案与决定”，不创建多个 Bundle。
10. 一次只语义修改一类核心文档。普通 Update/Independent 只改一份 `spec.md`；Successor 可按第 6 条同时维护新旧 Spec 的关系。任何分支都不连带改 `plan.md`、`tasks.md` 或 `architecture.md`；这些文档变成 Stale 是延迟同步的正常结果。
11. 写入后运行 `hello-scholar docs check` 和 `hello-scholar docs sync`，只允许程序重建 Index。
12. 新 Spec 默认 `status: draft`。只有用户明确批准该 Spec 时才能改为 `accepted`，Skill 不能把“用户想讨论”视为批准。

## 模板合同

- Front Matter 字段、Spec `type` / `status` 枚举与 PRD 一致。
- 正文固定包含 PRD 的七个核心章节：价值与当前决定、问题与当前事实、目标与非目标、目标设计、接口/数据与不变量、实施边界、验收与验证；只有存在材料性内容时才增加候选方案与权衡、迁移与清理、回滚、证据或 Revision History 等条件章节，不能生成空标题。
- 中英文模板字段和结构对齐，可读文本按项目默认语言选择，路径、枚举和 ID 保持原样。

## 测试

- `test/test_manage_specs_skill.py` 静态检查中英文 Skill 的四种分类、用户确认门、ID 分配、单文档事务、docs check/sync 和禁止旧路径。
- 检查两个模板的 Front Matter 可由 T004 解析，并含全部正文章节，不含 `TBD` / `TODO` 这类会泄漏到用户文档的占位值。
- 运行 `python3 -m unittest test/test_manage_specs_skill.py`、`npm test`。

## 完成标准

- T009 的四类场景都有明确的 Skill 行为可供后续 Live Eval。
- 模板和 Skill 是自包含的中英文实现，不依赖聊天中的隐式决策。
- 没有修改 Brainstorming，没有自动批准或自动迁移文档。
