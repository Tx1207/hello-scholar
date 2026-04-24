---
name: build-fixer
description: 使用 mypy、ruff 和 pytest 以安全的一次一个错误方式，增量修复 Python 类型与 lint 错误。
tags: [Python, Linting, Type Checking, Testing, Development]
---

# Build Fixer

以增量方式修复 Python 类型和 lint 错误，每次只处理一个错误以保证安全。

## 操作说明

1. **运行检查**
   - `mypy src/`（类型检查）
   - `ruff check .`（lint）
   - `pytest`（测试）

2. **解析错误输出**
   - 按文件分组错误
   - 按严重程度排序（先 errors，再 warnings）

3. **对每个错误**
   - 展示错误上下文（前后各 5 行）
   - 清楚解释问题
   - 提出修复方案
   - 应用修复
   - 重新运行相关检查
   - 验证错误已解决

4. **停止条件**
   - 修复引入了新错误
   - 同一错误尝试 3 次后仍存在
   - 用户要求暂停

5. **展示摘要**
   ```text
   Build Fix Summary
   =================
   Errors fixed: X
   Errors remaining: Y
   New errors introduced: Z
   ```

## 安全规则

- 一次只修一个错误，降低风险
- 每次修复后都重新运行检查
- 如果修复引入新错误，回滚该修复
- 未经验证，绝不批量应用修复
