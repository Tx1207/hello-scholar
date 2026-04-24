---
name: daily-coding
description: 用于涉及编写或修改源码的日常编码任务。
version: 1.0.0
tags: [Coding, Daily, Checklist]
---

# 日常编码检查清单

一个最小化的编码质量保障清单，用于确保每次代码修改都遵循最佳实践。

## 何时使用

在以下场景使用该 skill：
- 实现新功能
- 添加代码或修改现有代码
- 用户提出类似 “write a...”、“implement...”、“add...” 或 “modify...” 的请求
- 任何涉及 Edit 或 Write 工具的编码任务

## 何时不使用

不要在以下场景使用该 skill：
- 没有修改意图的纯阅读或理解任务
- 已被 `bug-detective`、`architecture-design` 或 `tdd-guide` 等专门 skills 覆盖的工作
- 仅配置变更
- 仅文档写作

## 核心清单

### 开始前

- [ ] **先读后改**：修改前必须先用 Read 工具读取目标文件
- [ ] **理解上下文**：确认已理解现有代码逻辑和设计意图

### 编码过程中

- [ ] **最小改动**：只改必要内容，不做过度工程，不添加无关功能
- [ ] **类型安全**：Python 添加类型标注，TypeScript 避免 `any`
- [ ] **安全检查**：避免命令注入、XSS、SQL injection 等漏洞

### 完成后

- [ ] **验证执行**：确保代码能正确运行且没有语法错误
- [ ] **清理现场**：移除 `print` / `console.log` 调试语句和临时文件
- [ ] **简要总结**：告知用户修改了什么以及影响范围

## 快速参考

### 常见错误避免

```python
# Don't
def process(data=[]):  # Mutable default argument
    pass

# Should
def process(data: list | None = None):
    data = data or []
```

```python
# Don't
except:  # Bare except
    pass

# Should
except ValueError as e:
    logger.error(f"Processing failed: {e}")
    raise
```

### 安全检查点

- 用户输入必须被校验或转义
- 使用 `pathlib` 处理文件路径，避免 path traversal
- 绝不硬编码敏感信息（API keys、passwords）
