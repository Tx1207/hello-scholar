# T056：把 `using-git-worktrees` 收窄为按需、显式确认的 Skill

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T055
- Parallel: No。必须先取得 absent value Red 和修改前自动 Plan 前置 Red。

## 目标

保留 Worktree Skill 的全部隔离与安全能力，只收窄入口：用户或 Approved Task 明确要求时直接进入；Agent 因高风险建议时，必须先得到用户同意；普通 Plan/Tasks 不自动加载。Skill 不负责清理，清理仍需单独授权和真实 provenance。

## 原 Skill 与新 Skill 比较

### 完整保留

- 先区分 normal checkout、linked worktree、detached HEAD 和 submodule，已有隔离时不嵌套创建。
- 平台 native worktree tool 优先，只有不可用时才用 `git worktree add`。
- 用户/项目目录偏好、`.worktrees` 优先、project-local ignore 检查。
- 项目 setup 自动检测、baseline test、失败后请求是否继续。
- sandbox 权限阻塞如实报告，不伪装成功。

### 必须改变

- 删除“before executing implementation plans”等自动前置触发；普通 Feature/Plan/Tasks 不因类型进入。
- 保留窄 model invocation，不设置 `disable-model-invocation: true`。description 只覆盖用户明确要求 Worktree、Approved Task 明确写 Worktree Process，以及 Agent提出具体隔离风险后用户明确同意；普通 Plan/Feature 不命中。
- 用户/Task 已明确要求或刚批准建议时，不再重复询问创建同意；未获同意的风险建议不创建。
- 明确退出 Skill 后仍按 AGENTS/Task 实施和验证，不能把 no-worktree 当 no-test。
- Skill 完成条件只到“隔离工作区可用 + baseline 已知”；不实现功能、不 commit、不合并或清理。

## Skill 编写预设计门

写文件前完整读取 `/xsb/.codex/skills/.system/skill-creator/SKILL.md`、`/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md` 和 `/xsb/hello-scholar/.agents/skills/writing-great-skills/GLOSSARY.md`：

`/xsb/hello-scholar/.agents/` 是被仓库忽略的原 checkout authoring 资产，不会自动出现在新 Worktree；路径缺失时停止并报告，不得改读待淘汰的 `writing-skills` 或凭记忆继续。

- 该 Skill 使用窄 model invocation；用户无需记住精确 Skill 名，但必须清楚表达隔离意图，或在 Approved Task 中明确要求。AGENTS/Task可先提出具体风险建议，未获同意不能创建。
- `detect -> choose mechanism -> prepare -> verify` 是线性 steps；每步以可观察 Git 状态/命令作为 completion criterion。
- Quick Reference 和常见错误是 in-skill reference；如果正文仍过长，只把不影响所有 branch 的解释下沉，不能隐藏 existing-isolation/native-tool/ignore/baseline 硬门。
- 清理自动 Plan trigger sediment 和重复禁令，保留 `Detect existing isolation first` 作为 leading word/核心顺序。

## 文件边界

### Modify

- `skills/superpowers-skills/using-git-worktrees/SKILL.md`
- `skills/superpowers-skills/using-git-worktrees/SKILL.zh_CN.md`

### Add

- `test/test_worktree_explicit_trigger.py`

### Must Not Modify

- Router（T043 owner）
- AGENTS、README、其他 Skill、`src/`
- T055 Scenario/Protocol/Proposal/Baseline
- Git cleanup 或 branch finishing 能力

## 实施细节

1. 中英文 Front Matter 保留简短 model-facing description，只列三种明确意图，不加 `disable-model-invocation: true`，不再包含“执行 Plan 前”这类宽触发。
2. 正文最前面增加入口门并区分三种有效授权。未命中时明确返回当前 Task流程，不继续执行后续 Git 命令。
3. Step 0 的“如果没有 preference 就问 consent”改为：只有 Agent 建议路径且尚未得到同意时提问；显式用户请求/Approved Task/刚批准建议均视为已有 consent。
4. 不改变 native/fallback 排序和 submodule guard。创建 project-local Worktree前仍检查 ignored；若需要修改 `.gitignore`，先说明这是额外项目变更并等待用户授权，不自动 commit。
5. baseline tests 失败时停止并问；不把失败吞掉后宣称 Ready。
6. 中英文触发、步骤、退出和完成条件完全一致。

## 测试与验证

1. 先写静态/临时 Git 测试，观察当前自动 Plan description 和缺 explicit gate 失败。
2. 覆盖用户显式、Approved Task、风险建议已批准、普通 Plan、普通 Validation、已有 linked worktree、submodule guard和未授权 `.gitignore` 修改。
3. 锁住 native tool优先、ignored check和 baseline failure stop，不用删除安全规则来通过入口测试。
4. 运行 `python3 -m unittest test/test_worktree_explicit_trigger.py` 和 `npm test`。

## 完成标准

- 普通 Plan/Tasks 不会自动询问或创建 Worktree。
- 三种明确授权都能进入并完成安全隔离准备。
- 已有隔离不嵌套，未授权项目变更/清理不发生。
- 本 Task只修改中英文 Worktree Skill与聚焦测试。
