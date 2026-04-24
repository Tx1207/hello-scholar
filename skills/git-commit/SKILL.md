---
name: git-commit
description: 使用 Conventional Commits 格式暂存并提交变更（仅本地，不 push）。
tags: [Git, Commit, Development, Workflow]
---

# Git Commit

使用 Conventional Commits 格式暂存并提交变更。该 skill 只处理本地 commit，不会 push 到远端。

## 操作说明

1. **检查 Git 状态**
   - 运行 `git status` 查看全部变更
   - 运行 `git diff` 检查修改内容

2. **分析变更**
   - 审阅已变更文件及其内容
   - 判断 commit type 和 scope
   - 起草简洁的 commit message

3. **Commit Type 参考**
   ```text
   feat     - 新功能
   fix      - Bug 修复
   docs     - 仅文档
   style    - 代码风格（格式、分号等）
   refactor - 代码重构（不含新功能/修复）
   perf     - 性能优化
   test     - 新增或更新测试
   chore    - 构建、CI、工具链、依赖
   ```

4. **Commit Message 格式**
   ```text
   <type>(<scope>): <subject>

   <body>

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```
   - Subject：祈使句，不加句号，最长 72 字符
   - Body：解释做了什么以及为什么做（小改动可省略）
   - Scope：受影响模块（data、model、config、trainer、utils、workflow）

5. **暂存并提交**
   - 用 `git add` 暂存相关文件
   - 不要暂存包含 secrets 的文件（`.env`、credentials、tokens）
   - 使用格式化 message 创建 commit
   - 用 `git log --oneline -1` 验证

## 注意事项

- 该 skill 只做本地 commit。如需 push，请使用 `git-push` skill。
- 提交前始终向用户确认 commit message。
- 如果不确定 type 或 scope，先询问用户。
