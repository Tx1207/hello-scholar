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
- [ ] **API 契约**：新增或修改接口时，先确定资源模型、请求/响应格式、状态码、分页、限流和版本策略
- [ ] **数据完整性**：schema 变更通过迁移文件，多表写操作使用事务，查询路径考虑索引与 N+1 风险
- [ ] **错误处理**：区分可预期错误和系统故障，只捕获能处理的异常，不暴露堆栈、SQL、路径或敏感信息
- [ ] **性能意识**：先定位 I/O、计算、网络、渲染或数据库瓶颈，再选择缓存、分页、批处理、懒加载或并发控制

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
- 外部调用必须设置超时；重试需要上限、退避和幂等性保护
- CORS、文件上传、请求体大小、排序和过滤参数使用显式白名单

### API / Data / Error / Performance Checklist

- REST 资源用复数名词，HTTP 方法语义准确，状态码能反映真实结果
- 入参用 schema 验证类型、范围、格式和必填项；文件上传限制大小与类型
- 成功响应和错误响应保持统一结构，例如 `{ data, meta? }` 与 `{ error: { code, message, details? } }`
- 列表接口必须分页，并对排序和过滤字段做白名单限制
- 数据迁移可回滚，生产前在 staging 或等价环境验证
- 多表写入使用最小事务范围，失败完整回滚，不留下半完成状态
- 结构化日志包含 level、timestamp、request id 和必要上下文，敏感信息先脱敏
- 禁止空 `catch`、静默降级和无记录回退；降级必须保留可诊断证据
- 对大数据集、循环、数据库查询和渲染路径保留性能边界，避免 N+1 查询和无界内存增长
