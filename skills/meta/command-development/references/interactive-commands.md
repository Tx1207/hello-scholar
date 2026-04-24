# 交互式 Command 模式

这是一份使用 `AskUserQuestion` tool 构建交互式 command 的完整指南。

## 概览

有些 commands 需要用户输入，但这些输入并不适合简单参数，例如：
- 在多个复杂选项之间做选择
- 从列表中选多个项目
- 做需要解释 trade-off 的决策
- 交互式收集偏好和配置

这时，应在 command 执行过程中使用 **AskUserQuestion**，而不是强行塞进 command arguments。

## 什么时候用 AskUserQuestion

### 应该用 AskUserQuestion 的场景

1. 需要解释的 multiple choice 决策
2. 需要上下文才能选的复杂选项
3. multi-select 场景
4. 配置偏好收集
5. 会根据回答动态变化的交互式工作流

### 应该继续用 arguments 的场景

1. 简单值，如文件路径、数字、名称
2. 用户已经明确知道的输入
3. 需要可脚本化的工作流
4. 追求快速调用，不想中断用户

## AskUserQuestion 基础

### Tool 参数

```typescript
{
  questions: [
    {
      question: "Which authentication method should we use?",
      header: "Auth method",
      multiSelect: false,
      options: [
        {
          label: "OAuth 2.0",
          description: "Industry standard, supports multiple providers"
        },
        {
          label: "JWT",
          description: "Stateless, good for APIs"
        }
      ]
    }
  ]
}
```

关键点：
- 用户总可以选 `"Other"` 自定义输入
- `multiSelect: true` 允许多选
- 每题尽量只有 2-4 个选项
- 一次 tool call 建议问 1-4 个问题

## 交互式 Command 模式

### 基础交互式 Command

典型流程：

1. 用 AskUserQuestion 收集配置
2. 解析回答
3. 生成配置文件
4. 向用户确认并给出下一步

例如可询问：
- 部署平台
- 环境数量
- 要启用的 features（多选）

然后把答案写入 `.codex/plugin-name.local.md`。

### 多阶段交互工作流

适合先问大方向，再按回答继续追问的场景：

1. **Stage 1**：先问基础配置
2. **Stage 2**：如果用户选了 Advanced，再问更细设置
3. **Stage 3**：汇总结果，让用户确认
4. **Stage 4**：根据确认结果执行 setup

## 问题设计

### Question Structure

好的问题应具备：
- 问句清晰，不含糊
- header 简短（建议 12 个字符以内）
- option labels 明确
- descriptions 能解释差异和 trade-off

**好例子：**

```markdown
Question: "Which database should we use for this project?"
Header: "Database"
Options:
  - PostgreSQL (Relational, ACID compliant, best for complex queries)
  - MongoDB (Document store, flexible schema, best for rapid iteration)
  - Redis (In-memory, fast, best for caching and sessions)
```

**坏例子：**

```markdown
Question: "Database?"
Header: "DB"
Options:
  - Option 1
  - Option 2
```

### Option Design 最佳实践

- label 尽量 1-5 个词
- description 说明含义、收益和 trade-off
- 每题 2-4 个选项，避免用户被淹没
- multiSelect 只用于允许同时成立的选项

## 常见模式

### 模式 1：简单确认

适合高风险操作前确认：
- Yes（继续）
- No（取消）

### 模式 2：一次问多个配置问题

适合项目初始化时一次性收集：
- 语言
- 测试框架
- CI/CD 平台
- features（多选）

### 模式 3：条件分支提问

先问复杂度等级：
- Simple
- Standard
- Complex

然后根据选择再问不同问题。

### 模式 4：循环收集多条信息

例如先问 team size，再为每个成员逐个收集 role。

### 模式 5：依赖选择

适合 library / feature 这种可任意组合的多选。

## 最佳实践

### Question Design

1. 问句具体，不模糊
2. header 简洁
3. options 有解释，不只给名字
4. 每次问题数量控制在合理范围
5. 问题顺序要自然

### Error Handling

调用 AskUserQuestion 后，要检查答案是否为空或异常；若失败，应提供手动配置的替代路径。

### Progressive Disclosure

推荐先问一个“Setup type”：
- Quick
- Custom
- Guided

再根据选择决定后续问多少问题。

### Multi-Select 指南

适合多选：
- Logging
- Metrics
- Alerts
- Backups

不适合多选：
- 数据库引擎
- 认证方式
- 部署平台

这些通常是互斥选项。

## 高级模式

### Validation Loop

流程：
1. 先收集配置
2. 校验是否冲突或缺少依赖
3. 若校验失败，再问用户：
   - Fix
   - Override
   - Cancel

### Incremental Configuration Builder

分阶段构建配置：
1. 先收核心设置
2. 保存 partial config
3. 再问依赖前面答案的细节设置
4. 最后统一 review 和确认

### Dynamic Options Based on Context

先检测当前项目上下文：
- 当前语言
- 已有框架
- 可用工具

再生成对应问题。例如：
- TypeScript 项目：问 strict mode、decorators、path mapping
- Python 项目：问 mypy、Black、Pylint

## 实战示例：Multi-Agent Swarm Launch

一个典型交互式 command 可以这样设计：

1. 问需要启动多少 agents
2. 问任务定义方式：
   - File
   - Guided
   - Custom
3. 问 coordination mode：
   - Team Leader
   - Collaborative
   - Autonomous
4. 如果选 Guided，则为每个 agent 继续问：
   - Agent name
   - Task type
   - Dependencies
   - Base branch

最后生成任务文件并继续启动流程。

## 最佳实践

### Question Writing

1. 具体，不要含糊
2. 在描述里解释 trade-offs
3. 问题本身要能独立成立
4. 帮用户做信息充分的决策
5. 文案尽量短

### Option Design

1. label 要有意义
2. description 要说明用途
3. 帮用户理解选择后果
4. 所有选项说明粒度一致
5. 每题控制在 2-4 个选项

### Flow Design

1. 问题顺序自然
2. 后续问题建立在前面答案之上
3. 只问必要问题
4. 相关问题放在一起
5. 告诉用户当前进度

### User Experience

1. 先告诉用户将会发生什么
2. 解释为什么要问这些问题
3. 给出推荐默认项
4. 允许取消或重来
5. 执行前先做最终确认

## 参数和问题混用

推荐做法：
- **arguments**：承载用户已知且简单的输入，如 `project-name`
- **AskUserQuestion**：承载需要解释的复杂选择，如架构模式、技术栈、部署策略

## 排错

**问题没有出现：**
- 检查 `AskUserQuestion` 是否在 `allowed-tools`
- 检查问题格式是否正确
- 检查 options 数量是否合理

**用户难以选择：**
- 检查 label 是否清楚
- 检查 description 是否足够有帮助
- 看看是不是选项过多
- 确认 `multiSelect` 设置是否正确

**流程让人困惑：**
- 减少问题数量
- 把相关问题分组
- 在阶段之间加解释
- 给出流程进度提示

有了 AskUserQuestion，command 就可以从“单次调用”升级成“交互式向导”，在复杂决策里比单纯 arguments 更自然。
