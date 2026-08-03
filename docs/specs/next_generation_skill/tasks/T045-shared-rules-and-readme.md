# T045：同步 AGENTS、README 和下一代公共规则

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T011, T014, T017, T020, T023, T035, T038, T041, T044, T046, T049, T050, T051, T054, T057, T059, T061, T064, T065
- Parallel: No。公共说明必须等所有目标 Skill 的行为和 Live Eval 稳定后再写。

## 目标

把已经验证的下一代文档模型、五路 Router、文件 owner 和用户确认门写入中英文项目规则与 README。公共规则只讲跨 Skill 都需要知道的事实，不复制每个 Skill 的完整工作流。

## 当前文档与目标文档比较

| 当前状态 | 需要变成 |
|---|---|
| AGENTS 主要是通用编码纪律，只含语言偏好 | 保留全部编码纪律，增加精简的文档 owner、Fast Path、生成文件和审批门 |
| README 示例要求所有 Skill 文档写到 `hello-scholar/memory/...` | 改为 Spec Bundle、根目录 Runs 和独立 Handoffs 新路径 |
| README 只介绍 install/uninstall | 增加 `docs check` / `docs sync` 用法和“不自动迁移”的边界 |
| Skill 列表只列分组，不介绍下一代核心能力 | 用人话说明新/升级 Skill 各自负责什么，避免用户把 Plan、Tasks、Record 混用 |

## 文件边界

### Modify

- `AGENTS.md`
- `AGENTS-zh.md`
- `README.md`
- `test/test_agents_preferences.py`

### Add

- `test/test_shared_document_rules.py`

### Must Not Modify

- 任何 Skill
- `src/`
- `package.json`
- 执行 plan、PRD 或当前 Task 文件

## AGENTS 中必须增加的最小公共合同

在不改变现有“Read/Think/Simplicity/Surgical/Verification/Goal-driven/Debugging/Dependencies/Communication”规则和 hello-scholar 最终包装格式的前提下，增加一个简洁章节，说明：

1. **Fast Path**：局部 Bug、文案、格式、单测试、不改行为的内部重构和临时调试，不创建或修改 Spec、Plan、Tasks、Record、Architecture。
2. **五类核心文档 owner**：
   - Current Architecture：`hello-scholar/architecture.md`；
   - Spec/Plan/Tasks：同一 `hello-scholar/specs/<topic>/SPEC-NNN-*/` Bundle；
   - Run Record：`runs/<run-id>/record.md`；
   - Handoff：`hello-scholar/handoffs/`，明确它不是核心文档和 Spec Index 成员。
3. **一次一类语义文档**：Spec 改动不连带重写 Plan，Plan 改动不连带重写 Tasks；Stale 是正常状态，继续实施时再同步。
4. **生成文件**：三个 `INDEX.md` 只能由 `hello-scholar docs sync` 写，Agent/用户不手工编辑。
5. **按需读取**：只读相关 Architecture 章节、目标 Bundle、当前 Run 和相关代码，不默认加载全部历史。
6. **确认门**：新独立 Spec、Accepted Spec、高风险 Plan、正式实验、重要旧实现删除、Completed Spec、大幅 Architecture 变更和迁移，遵守对应 Skill 的用户确认门。
7. **Legacy 边界**：旧路径只读，不自动移动、不双写；链接 T046 已创建的 `docs/migration/document-model-v2.md`，第一阶段只给 Mapping Proposal，用户批准前不移动、合并或删除。
8. **直接执行与完成证据**：Approved/Current Tasks 由当前主 Agent按依赖直接执行，并在当前工作树取得、读完完整验证输出。Converge 只在 Bundle 末端或用户明确要求时作为默认只读检查加入；Architecture 只在用户发起，或用户确认材料性结构变化后用独立事务同步。不要写成每次必经的固定链，不要引用已淘汰执行/Review/Verification Skill，也不要把 Evidence 写成第六类文档。
9. **显式 TDD**：普通 Feature、Bugfix、重构和 Fast Path 不自动调用 TDD；用户或 Approved Task 明确点名后才启动完整 Red-Green-Refactor。

AGENTS 不应内嵌完整 Front Matter、12/15 节模板或每个 Router 流程图；这些由 Skill/模板拥有。

## README 必须修改的内容

1. 在功能/项目特点中用人话介绍正式主链 `Spec -> Plan -> Tasks -> Implementation -> Fresh Evidence`，同时强调简单任务零文档；Record 只在实验需要时加入，Converge 只在末端/显式请求时加入，Architecture 更新是用户发起或确认材料性结构变化后的条件事务。
2. 增加目标项目目录示意，只展示 `hello-scholar/architecture.md`、Spec Bundle、`hello-scholar/handoffs/` 和根目录 `runs/`；不要恢复 `memory/` 中间层。
3. 在 CLI 使用中增加：

   ```text
   hello-scholar docs check
   hello-scholar docs sync
   ```

   说明前者只读，后者只重建派生 Index；没有 `docs migrate`。
4. 更新“当前包含的 skills”，至少解释 `manage-specs`、`generating-tasks`、`converge-to-spec`、`docs-maintenance` 和升级后的 `record-experiment`、`using-helloscholar`；列出 `handoff`、`test-driven-development`、`using-git-worktrees`、`crash-audit`、`takeoff`、`landing` 的按需定位。不得列出 `project-structure` 或九个已淘汰 Skill。
5. 更新 User Preferences 示例，删除 `hello-scholar/memory/...`，改成新路径和“生成 Index 不手改”的偏好。
6. 说明 install/uninstall 会清理能够证明由当前 hello-scholar checkout 拥有的 retired Skill target，但保留无法证明所有权的同名目录。marker/link 仍指向另一个或已搬迁 checkout 时自动清理会保守跳过，需要用户核对后人工处理；不得暗示工具会按名称强删。任何情况下都不删除用户的 Architecture、Spec Bundle、Handoff 或根目录 Runs。
7. 说明旧文档保持只读、当前版本没有自动迁移命令；链接已由 T046 创建的迁移说明并只摘要两阶段门。

## 中英文同步要求

- `AGENTS.md` 和 `AGENTS-zh.md` 结构、规则编号、路径和枚举一致，用户可读文字分别使用英文/中文。
- 现有 User Preferences 的语言规则和最终 wrapper 完整保留，不能被本次文档模型更新覆盖。
- README 当前以中文为主，保持该语言和现有安装说明风格，不顺手重写项目介绍。

## 测试

- `test/test_shared_document_rules.py` 断言中英文规则都包含 Fast Path、四类路径、单文档事务、生成 Index、按需读取和 legacy 只读边界，且不含新的 `hello-scholar/memory/` 写入指导。
- 更新 `test/test_agents_preferences.py` 的 Record 根目录和生成 Index 断言，同时保留语言偏好测试。
- README 静态检查两条 docs CLI、新路径、owned retired target 清理/同名用户目录保护、换 checkout 时保守跳过与人工核对提示、uninstall 保留用户文档、legacy 只读说明和无 `docs migrate` 用法。
- 静态检查 AGENTS/README 的 Execution 是主 Agent直接执行，TDD 是显式触发，并且九个已淘汰 Skill和 `project-structure` 不在当前 Skill 清单或使用说明中。
- 运行 `python3 -m unittest test/test_agents_preferences.py test/test_shared_document_rules.py`、`node --test test/test_cli_install.js` 和 `npm test`。

## 完成标准

- 一个第一次安装的用户只读 AGENTS/README 就能分清核心文档位置和 owner。
- 公共规则简洁，不与各 Skill 形成第二份详细合同。
- 旧 memory 写入建议全部消失，安装/卸载和输出包装旧行为无回归。
