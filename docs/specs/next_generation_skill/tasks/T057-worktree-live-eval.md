# T057：用当前 Codex subagent 验证按需 Worktree

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T056
- Parallel: No。两个场景会改变临时 Git Worktree 状态，必须串行清理后运行。

## 目标

验证当前 Worktree Skill在两种显式请求中都能安全创建并证明 baseline：一个局部修复隔离，一个 Approved Bundle 隔离；同时诚实区分 native tool与 git fallback。普通 Approved Plan 不自动创建 Worktree 的边界由 Router、T056 和静态测试负责。

## 文件边界

### Add

- `test/skill-evals/worktree-explicit-create/scorecard.json`
- `test/skill-evals/worktree-explicit-create/evidence/live/`
- `test/skill-evals/worktree-explicit-bundle-isolation/scorecard.json`
- `test/skill-evals/worktree-explicit-bundle-isolation/evidence/live/`

### Must Not Modify

- `skills/superpowers-skills/using-git-worktrees/`
- T055 的 Scenario、Protocol、Proposal、Fixture 和 Baseline
- 生产仓库 Git 配置、分支或 Worktree

## 执行方法

1. 读取 Workflow，确认两个 Proposal/Hash 仍获用户批准；预检临时根、Git/Node、初始测试和当前 Skill copy，记录各自 `fixtureBaseCommit`。
2. 每场使用不同的 `gpt-5.6-terra`、`fork_turns: "none"` Implementer，显式给当前 Worktree `SKILL.md` 绝对路径/Hash并要求完整读取。
3. `worktree-explicit-create` 核对 normal/submodule/worktree 检测、机制选择、ignored 目录、用户脏文件保护和 baseline test。若平台没有 native tool，证据明确说明为何使用 fallback。
4. `worktree-explicit-bundle-isolation` 还要核对 Accepted Spec、Approved Plan/Tasks、目标 Base 和当前 checkout 并行修改，创建后只报告隔离就绪，不提前实施 Bundle。
5. 每场派发不同的 `fork_turns: "none"` Reviewer，只看获批 rubric、原始交互、Git porcelain前后、命令和 Base-to-final diff。
6. 写当前全部 Hash、不同 Agent ID、Terra 模型、硬门、评分、命令、`criticalPath` 顺序和建议，不写 `timing`；失败重开 T056/T055，不在 Eval Task改 Skill。
7. 两场 pass 后批量交用户审核；只有用户明确接受当前证据才标记 accepted。清理只针对评测创建且 provenance 明确的临时 Worktree。

## 验证与完成

- 两个 Scorecard 通过 T002，硬门全 true，总分和每个维度至少 90，逐维只允许 `0 / 90 / 100`，并由用户最终 accepted。
- `git worktree list --porcelain` 证明评测结束无残留，用户脏文件 Hash 不变。
- 运行 `python3 -m unittest test/test_worktree_explicit_trigger.py` 和 `npm test`。
