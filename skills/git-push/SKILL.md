---
name: git-push
description: 使用 Conventional Commits 格式将变更提交并 push 到 GitHub 远程仓库。
tags: [Git, GitHub, Push, Development, Workflow]
---

# Git Push

提交未提交变更，并 push 到远程 GitHub 仓库。处理完整流程：stage、commit 和 push。

## 操作说明

1. **检查 Git 状态**
   - 运行 `git status`
   - 展示所有未提交变更

2. **分析变更**
   - 审阅已变更文件
   - 判断 commit type（feat/fix/docs/refactor/test/chore）
   - 判断 scope（受影响模块 / 组件）

3. **创建 Commit Message**
   遵循 Conventional Commits 格式：
   ```text
   <type>(<scope>): <subject>

   <body>

   <footer>
   ```

   Types：
   - `feat`：新功能
   - `fix`：Bug 修复
   - `docs`：文档更新
   - `refactor`：代码重构
   - `perf`：性能优化
   - `test`：测试相关
   - `chore`：其他变更

4. **暂存并提交**
   - 对受影响文件运行 `git add`
   - 使用格式化 message 创建 commit
   - 在 footer 中包含 `Co-Authored-By: Claude <noreply@anthropic.com>`

5. **Push 到远端**
   - 运行 `git push`
   - 如果被拒绝，先 pull with rebase：
     ```bash
     git pull --rebase origin $(git branch --show-current)
     git push
     ```

6. **验证成功**
   - 展示 commit SHA
   - 展示远程分支状态

## 选项

- `--amend`：修改上一个 commit，而不是创建新 commit
- `--no-verify`：跳过 pre-commit hooks
- 可直接提供 `<type>(<scope>): <message>` 格式的自定义 commit message

## 集成

该 skill 使用与 `git-commit` 相同的 Conventional Commits 格式，但聚焦完整流程：stage、commit 和 push。
