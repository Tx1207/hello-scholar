# 参考：Manus 上下文工程原则

这个 skill 基于 Manus 的上下文工程原则。Manus 是一家 AI agent 公司，于 2025 年 12 月被 Meta 以 20 亿美元收购。

## 6 条 Manus 原则

### 1. 文件系统即外部记忆

> "Markdown is my 'working memory' on disk."

**问题：** 上下文窗口有上限。把所有内容都塞进上下文会降低性能并增加成本。

**解决方案：** 把文件系统当作无限记忆：
- 将大内容存入文件
- 上下文里只保留路径
- agent 需要时再“查阅”信息
- 压缩必须是 **可逆的**

### 2. 通过重复操控注意力

**问题：** 大约 50 次 tool calls 之后，模型会忘记原始目标（“lost in the middle”）。

**解决方案：** 保持一个在执行中会被 **反复重读** 的 `task_plan.md`：
```text
Start of context: [Original goal - far away, forgotten]
...many tool calls...
End of context: [Recently read task_plan.md - gets ATTENTION!]
```

在每次决策前重读计划文件，目标就会重新出现在注意力窗口中。

### 3. 保留失败痕迹

> "Error recovery is one of the clearest signals of TRUE agentic behavior."

**问题：** 直觉会让人隐藏错误、悄悄重试。这会浪费 tokens，也会丢失学习过程。

**解决方案：** 把失败动作保留在计划文件中：
```markdown
## Errors Encountered
- [2025-01-03] FileNotFoundError: config.json not found -> Created default config
- [2025-01-03] API timeout -> Retried with exponential backoff, succeeded
```

模型在看到这些失败时，会更新它对任务的内部理解。

### 4. 避免 Few-Shot 过拟合

> "Uniformity breeds fragility."

**问题：** 重复的 action-observation 模式会导致漂移和幻觉。

**解决方案：** 引入受控变化：
- 轻微变化表达方式
- 不要盲目复制粘贴模式
- 在重复任务中主动重新校准

### 5. 用稳定前缀优化缓存

**问题：** Agents 是输入密集型的（100:1 比例）。每个 token 都有成本。

**解决方案：** 为 cache hits 设计结构：
- 把静态内容放在最前面
- 使用 append-only 上下文（永不修改历史）
- 使用一致的序列化方式

### 6. Append-Only 上下文

**问题：** 修改之前的消息会让 KV-cache 失效。

**解决方案：** 永远不要修改历史消息，只追加新信息。

## Agent 循环

Manus 以连续循环方式工作：

```text
1. Analyze -> 2. Think -> 3. Select Tool -> 4. Execute -> 5. Observe -> 6. Iterate -> 7. Deliver
```

### 循环中的文件操作

| 操作 | 使用时机 |
|------|----------|
| `write` | 新文件或完整重写 |
| `append` | 增量追加 sections |
| `edit` | 更新具体部分（checkboxes、status） |
| `read` | 在决策前回看 |

## Manus 统计

| 指标 | 数值 |
|------|------|
| 每个任务平均 tool calls | ~50 |
| 输入输出比例 | 100:1 |
| 收购价格 | $2 billion |
| 达到 $100M 收入时间 | 8 个月 |

## 关键引述

> "If the model improvement is the rising tide, we want Manus to be the boat, not the piling stuck on the seafloor."

> "For complex tasks, I save notes, code, and findings to files so I can reference them as I work."

> "I used file.edit to update checkboxes in my plan as I progressed, rather than rewriting the whole file."

## 来源

基于 Manus 官方上下文工程文档：
https://manus.im/de/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus
