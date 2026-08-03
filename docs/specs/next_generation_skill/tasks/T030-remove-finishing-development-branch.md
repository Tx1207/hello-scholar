# T030：删除 `finishing-a-development-branch`

- Status: `approved`
- PR: `PR 4 - 主 Agent 执行收敛与 Converge`
- Depends On: T024, T025
- Parallel: Yes。两个强制消费者删除后即可独立移除。

## 用户已确认的决定

完整删除 `finishing-a-development-branch`。框架不在实现完成后自动弹出固定 Merge/PR/Keep/Discard 菜单，也不自动执行 push、PR、分支删除或 Worktree 清理。用户明确要求这些外部动作时，主 Agent读取实际 Git 状态并按当前授权执行。

## 原 Skill 与新做法比较

原 Skill 先跑测试，再探测普通仓库/命名 Worktree/detached HEAD，提供 3 或 4 个选项，并为 merge、push/PR、保留、discard 和 cleanup 给出命令与确认门。其安全规则仍成立，但属于具体 Git 操作，不是每个 Spec Bundle 的完成定义。

- Bundle 是否完成：`converge-to-spec` + AGENTS 新鲜验证；
- 是否 merge/push/create PR：用户明确请求；
- 是否创建隔离 Worktree：保留的 `using-git-worktrees` 负责检测、同意门和创建；
- 是否清理 Worktree：用户明确要求后，主 Agent根据实际 provenance、Git 状态和破坏性操作规则处理，不归 Worktree Skill 自动执行；
- discard/force delete：必须继续遵守平台和 AGENTS 的 destructive-action 确认，不由自动 Skill触发。

## 文件边界

### Delete

- `skills/superpowers-skills/finishing-a-development-branch/SKILL.md`
- `skills/superpowers-skills/finishing-a-development-branch/SKILL.zh_CN.md`

### Add

- `test/test_no_finishing_development_branch_skill.py`

### Must Not Modify

- `skills/superpowers-skills/using-git-worktrees/`
- Git 分支、Worktree、remote 或 GitHub 状态
- AGENTS、README、`src/`、其他 Skill
- shared tool mapping/catalog（T065 处理）

## 实施与验证

1. 只删除 Skill 文件和空目录；本 Task 不运行 merge、push、PR、branch delete 或 worktree remove。
2. 不创建较短的 `git-finish` 替代 Skill。
3. 测试断言 Skill discovery 不再安装该 name，同时确认 `using-git-worktrees` 中英文 Skill仍存在。
4. 运行 `python3 -m unittest test/test_no_finishing_development_branch_skill.py` 和 `npm test`。

## 完成标准

- Skill 消失，保留 Worktree Skill未受影响。
- 没有任何真实 Git 状态被本删除任务改变。
- 外部发布/合并行为继续需要用户授权。
