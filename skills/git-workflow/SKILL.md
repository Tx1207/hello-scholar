---
name: git-workflow
description: 当用户要求“create git commit”、“manage branches”、“follow git workflow”、“use Conventional Commits”、“handle merge conflicts”，或询问 Git 分支策略、版本控制最佳实践、Pull Request 流程时使用。该 skill 提供面向团队协作的完整 Git workflow 指南。
version: 1.2.0
---

# Git Workflow Standards

本文定义项目的 Git 使用标准，包括 commit message 格式、branch 管理策略、工作流、merge 策略等。遵循这些标准可以提升协作效率、增强可追溯性、支持自动化并减少冲突。

## Commit Message Standards

项目遵循 **Conventional Commits** 规范：

```text
<type>(<scope>): <subject>

<body>

<footer>
```

### Type Reference

| Type | Description | Example |
| :--- | :--- | :--- |
| `feat` | 新功能 | `feat(user): add user export functionality` |
| `fix` | Bug 修复 | `fix(login): fix captcha not refreshing` |
| `docs` | 文档更新 | `docs(api): update API documentation` |
| `refactor` | 重构 | `refactor(utils): refactor utility functions` |
| `perf` | 性能优化 | `perf(list): optimize list performance` |
| `test` | 测试相关 | `test(user): add unit tests` |
| `chore` | 其他变更 | `chore: update dependency versions` |

### Subject Rules

- 用动词开头：`add`、`fix`、`update`、`remove`、`optimize`
- 不超过 50 个字符
- 结尾不加句号

更细的规范和示例见 `references/commit-conventions.md`。

## Branch Management Strategy

### Branch Types

| Branch Type | Naming Convention | Description | Lifecycle |
| :--- | :--- | :--- | :--- |
| master | `master` | 主分支，可发布状态 | 长期存在 |
| develop | `develop` | 开发分支，集成最新代码 | 长期存在 |
| feature | `feature/feature-name` | 功能分支 | 完成后删除 |
| bugfix | `bugfix/issue-description` | Bug 修复分支 | 修复后删除 |
| hotfix | `hotfix/issue-description` | 紧急修复分支 | 修复后删除 |
| release | `release/version-number` | 发布分支 | 发布后删除 |

### Branch Naming Examples

```text
feature/user-management          # 用户管理功能
feature/123-add-export          # 关联 issue 的功能分支
bugfix/login-error              # 登录错误修复
hotfix/security-vulnerability   # 安全漏洞紧急修复
release/v1.0.0                  # 版本发布
```

### Branch Protection Rules

**master 分支：**
- 禁止直接 push
- 必须通过 Pull Request 合并
- 必须通过 CI 检查
- 至少需要一名 reviewer 批准

**develop 分支：**
- 限制直接 push
- 推荐通过 Pull Request 合并
- 必须通过 CI 检查

详细分支策略见 `references/branching-strategies.md`。

## Workflows

### Daily Development Workflow

```bash
# 1. 同步最新代码
git checkout develop
git pull origin develop

# 2. 创建 feature branch
git checkout -b feature/user-management

# 3. 开发并提交
git add .
git commit -m "feat(user): add user list page"

# 4. 推送到远端
git push -u origin feature/user-management

# 5. 创建 Pull Request 并请求 Code Review

# 6. 通过 PR 合并到 develop

# 7. 删除 feature branch
git branch -d feature/user-management
git push origin -d feature/user-management
```

### Hotfix Workflow

```bash
# 1. 从 master 创建修复分支
git checkout master
git pull origin master
git checkout -b hotfix/critical-bug

# 2. 修复并提交
git add .
git commit -m "fix(auth): fix authentication bypass vulnerability"

# 3. 合并到 master
git checkout master
git merge --no-ff hotfix/critical-bug
git tag -a v1.0.1 -m "hotfix: fix authentication bypass vulnerability"
git push origin master --tags

# 4. 回同步到 develop
git checkout develop
git merge --no-ff hotfix/critical-bug
git push origin develop
```

### Release Workflow

```bash
# 1. 创建 release branch
git checkout develop
git checkout -b release/v1.0.0

# 2. 更新版本号和文档

# 3. 提交版本更新
git add .
git commit -m "chore(release): prepare release v1.0.0"

# 4. 合并到 master
git checkout master
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "release: v1.0.0 official release"
git push origin master --tags

# 5. 回同步到 develop
git checkout develop
git merge --no-ff release/v1.0.0
git push origin develop
```

## Merge Strategy

### Merge vs Rebase

| Feature | Merge | Rebase |
| :--- | :--- | :--- |
| History | 保留完整历史 | 线性历史 |
| Use case | 公共分支 | 私有分支 |
| Recommended for | 合并到主分支 | 同步上游代码 |

### Recommendations

- **Feature branch 同步 develop**：使用 `rebase`
- **Feature branch 合并到 develop**：使用 `merge --no-ff`
- **develop 合并到 master**：使用 `merge --no-ff`

```bash
# ✅ 推荐：feature branch 同步 develop
git checkout feature/user-management
git rebase develop

# ✅ 推荐：feature branch 合并到 develop
git checkout develop
git merge --no-ff feature/user-management

# ❌ 不推荐：在公共分支上 rebase
git checkout develop
git rebase feature/xxx  # 危险操作
```

**项目约定：** feature branch 合并时统一使用 `--no-ff`，保留分支历史。

详细 merge 策略见 `references/merge-strategies.md`。

## Conflict Resolution

### Identifying Conflicts

```text
<<<<<<< HEAD
// Current branch code
const name = 'Alice'
=======
// Branch being merged
const name = 'Bob'
>>>>>>> feature/user-management
```

### Resolving Conflicts

```bash
# 1. 查看冲突文件
git status

# 2. 手工编辑文件解决冲突

# 3. 标记为已解决
git add <file>

# 4. 完成 merge / rebase
git commit
# 或
git rebase --continue
```

### Conflict Resolution Strategies

```bash
# 保留当前分支版本
git checkout --ours <file>

# 保留传入分支版本
git checkout --theirs <file>

# 中止 merge / rebase
git merge --abort
git rebase --abort
```

### Preventing Conflicts

1. **定期同步代码** - 每天开工前先拉最新代码
2. **小步提交** - 经常提交小改动
3. **模块化开发** - 不同功能尽量落在不同文件
4. **主动沟通** - 避免多人同时改同一文件

更详细的冲突处理见 `references/conflict-resolution.md`。

## .gitignore Standards

### Basic Rules

```text
# 忽略所有 .log 文件
*.log

# 忽略目录
node_modules/

# 忽略根目录下的目录
/temp/

# 忽略所有目录中的文件
**/.env

# 不忽略特定文件
!.gitkeep
```

### Common .gitignore

```text
node_modules/
dist/
build/
.idea/
.vscode/
.env
.env.local
logs/
*.log
.DS_Store
Thumbs.db
```

更细的模式说明见 `references/gitignore-guide.md`。

## Tag Management

使用 **Semantic Versioning**：

```text
MAJOR.MINOR.PATCH[-PRERELEASE]
```

### Version Change Rules

- **MAJOR**：不兼容 API 变更（`v1.0.0 → v2.0.0`）
- **MINOR**：向后兼容的新功能（`v1.0.0 → v1.1.0`）
- **PATCH**：向后兼容的 bug 修复（`v1.0.0 → v1.0.1`）

### Tag Operations

```bash
# 创建 annotated tag（推荐）
git tag -a v1.0.0 -m "release: v1.0.0 official release"

# 推送 tag
git push origin v1.0.0
git push origin --tags

# 查看 tag
git tag
git show v1.0.0

# 删除 tag
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

## Team Collaboration Standards

### Pull Request Standards

PR 应包含：

```markdown
## Change Description
<!-- 描述本次变更的内容与目的 -->

## Change Type
- [ ] New feature (feat)
- [ ] Bug fix (fix)
- [ ] Code refactoring (refactor)

## Testing Method
<!-- 说明如何验证 -->

## Related Issue
Closes #xxx

## Checklist
- [ ] Code has been self-tested
- [ ] Documentation has been updated
```

### Code Review Standards

Review 重点关注：
- **Code quality**：清晰可读、命名合理、无重复代码
- **Logic correctness**：业务逻辑正确，边界情况有处理
- **Security**：无明显安全漏洞，敏感信息受保护
- **Performance**：无明显性能问题，资源释放合理

详细协作规范见 `references/collaboration.md`。

## 常见问题

### Amending the Last Commit

```bash
# 修改最近一次提交内容（尚未 push）
git add forgotten-file.ts
git commit --amend --no-edit

# 修改最近一次提交说明
git commit --amend -m "new commit message"
```

### Push Rejected

```bash
# 先拉再推
git pull origin master
git push origin master

# 想要更整洁历史时可用 rebase
git pull --rebase origin master
git push origin master
```

### Rollback to Previous Version

```bash
# 重置到指定 commit（丢弃其后提交）
git reset --hard abc123

# 创建反向提交（推荐，保留历史）
git revert abc123
```

### Stash Current Work

```bash
git stash save "work in progress"
git stash list
git stash pop
```

### View File Modification History

```bash
git log -- <file>
git log -p -- <file>
git blame <file>
```

## 最佳实践总结

### Commit Standards

✅ **建议：**
- 遵循 Conventional Commits
- commit message 清楚描述改动
- 一个 commit 只做一类逻辑改动
- 提交前先跑代码检查

❌ **禁止：**
- 模糊的 commit message
- 一个 commit 混入多个无关修改
- 提交敏感信息（密码、key）
- 直接在主分支开发

### Branch Management

✅ **建议：**
- 使用 feature branch 开发
- 定期同步主线代码
- 功能完成后及时删分支
- 用 `--no-ff` 保留历史

❌ **禁止：**
- 直接在主分支开发
- 长期不合并的功能分支
- 不规范的分支命名
- 在公共分支上 rebase

### Code Review

✅ **建议：**
- 所有代码都通过 Pull Request
- 至少一名 reviewer 批准后再合并
- 提供具体、建设性的 review feedback

❌ **禁止：**
- 无 review 直接合并
- 自己 review 自己的代码

## Additional Resources

### Reference Files

更详细的专题指南见：

- **`references/commit-conventions.md`** - commit message 规范与示例
- **`references/branching-strategies.md`** - 完整 branch 管理策略
- **`references/merge-strategies.md`** - merge、rebase 与冲突处理
- **`references/conflict-resolution.md`** - 冲突处理与预防细则
- **`references/advanced-usage.md`** - Git 性能优化、安全、submodule 与高级技巧
- **`references/collaboration.md`** - Pull Request 和 code review 指南
- **`references/gitignore-guide.md`** - `.gitignore` 模式与项目配置

### Example Files

`examples/` 中的可运行示例：
- **`examples/commit-messages.txt`** - 优质 commit message 示例
- **`examples/workflow-commands.sh`** - 常用 workflow 命令片段

## Summary

本文定义了项目的 Git 标准：

1. **Commit Messages** - 遵循 Conventional Commits
2. **Branch Management** - 使用 master / develop / feature / bugfix / hotfix / release 策略
3. **Workflows** - 覆盖日常开发、hotfix 与 release
4. **Merge Strategy** - feature 同步用 rebase，合并用 `merge --no-ff`
5. **Tag Management** - Semantic Versioning + annotated tag
6. **Conflict Resolution** - 定期同步、小步提交、团队沟通

遵循这些标准可以提升协作效率、保证代码质量，并简化版本管理。
