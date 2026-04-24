---
name: planning-with-files
description: 将工作流切换为 Manus 风格的持久化 Markdown 文件，用于规划、进度跟踪和知识存储。适用于复杂任务、多步骤项目、研究任务，或用户提到 planning、organizing work、tracking progress、需要结构化输出时。
version: 0.1.0
---

# 基于文件的规划

像 Manus 一样工作：把持久化 Markdown 文件当作“磁盘上的工作记忆”。

## 快速开始

在任何复杂任务开始前：

1. **在磁盘上创建持久计划**
2. **定义阶段和受影响文件**
3. **每个阶段后更新**：标记 `[x]` 并修改状态
4. **决策前重新阅读**：把目标刷新回注意力窗口

## 推荐的 hello-scholar 模式

对于 hello-scholar 项目，优先在 `hello-scholar/plans/<plan-id>/` 下创建 **plan package**：

| 文件 | 用途 | 更新时机 |
|------|------|----------|
| `requirements.md` | 记录目标、约束和非目标 | 计划开始时 |
| `plan.md` | 说明方法、阶段和风险 | 实施前 |
| `tasks.md` | 跟踪具体任务、文件、完成标准和验证 | 执行过程中 |
| `contract.json` | 可选的机器可读执行契约 | 当验证 / review 规则重要时 |

`tasks.md` 应明确包含：

- `涉及文件`
- `完成标准`
- `验证方式`

## 回退 3 文件模式

对于不使用 hello-scholar 项目资产的通用仓库，旧的三文件模式仍然可接受：

| 文件 | 用途 | 更新时机 |
|------|------|----------|
| `task_plan.md` | 跟踪阶段和进度 | 每个阶段后 |
| `notes.md` | 存储发现和研究结果 | 研究过程中 |
| `[deliverable].md` | 最终交付物 | 完成时 |

## 核心工作流

```text
Loop 1: 创建包含 requirements + plan 的 plan package
Loop 2: 研究 -> 保存 notes/findings -> 更新 tasks.md
Loop 3: 执行 -> 更新 tasks.md + verification notes
Loop 4: 交付最终输出并关闭计划
```

### 循环细节

**每个主要动作前：**
```bash
Read task_plan.md  # Refresh goals in attention window
```

**每个阶段后：**
```bash
Edit task_plan.md  # Mark [x], update status
```

**存储信息时：**
```bash
Write notes.md     # Don't stuff context, store in file
```

## hello-scholar Plan Package 模板

推荐结构：

```text
hello-scholar/
\- plans/
   \- <plan-id>/
      |- requirements.md
      |- plan.md
      |- tasks.md
      \- contract.json
```

### `requirements.md`

```markdown
# 需求：[简短描述]

## 目标
[一句话描述最终状态]

## 约束
- [约束]

## 非目标
- [明确排除的工作]
```

### `tasks.md`

```markdown
# 任务：[简短描述]

- [ ] 任务 1
  涉及文件：[file list]
  完成标准：[definition of done]
  验证方式：[test / review / evidence]
```

## 回退 `task_plan.md` 模板

任何复杂任务都要先创建这个文件：

```markdown
# 任务计划：[简短描述]

## 目标
[一句话描述最终状态]

## 阶段
- [ ] 阶段 1：规划与准备
- [ ] 阶段 2：研究 / 收集信息
- [ ] 阶段 3：执行 / 构建
- [ ] 阶段 4：审查并交付

## 关键问题
1. [需要回答的问题]
2. [需要回答的问题]

## 已做决策
- [决策]：[理由]

## 遇到的错误
- [错误]：[解决方案]

## 状态
**当前处于阶段 X** - [我正在做什么]
```

## `notes.md` 模板

用于研究和发现：

```markdown
# 笔记：[主题]

## 来源

### 来源 1：[名称]
- URL: [link]
- 关键点：
  - [发现]
  - [发现]

## 综合发现

### [类别]
- [发现]
- [发现]
```

## 关键规则

### 1. 始终先创建计划
复杂任务绝不在没有持久计划文件或 plan package 的情况下开始。这是硬性规则。

### 2. 决策前先阅读
在任何重大决策前，读取当前活跃计划文件。这能让目标保持在注意力窗口中。

### 3. 行动后立即更新
完成任一阶段后，立即更新活跃计划文件：
- 用 `[x]` 标记已完成阶段
- 更新 Status section
- 记录遇到的错误

### 4. 存储，不要塞进上下文
大型输出写入文件，不塞进上下文。工作记忆里只保留路径。

### 5. 记录所有错误
每个错误都写入 “遇到的错误” section。这会为未来任务沉淀知识。

## 何时使用该模式

**以下场景使用持久 plan package：**
- 多步骤任务（3+ 步）
- 研究任务
- 构建 / 创建某物
- 跨多次工具调用的任务
- 任何需要组织的工作

**以下场景可跳过：**
- 简单问题
- 单文件编辑
- 快速查找

## 需要避免的反模式

| 不要这样做 | 改为这样做 |
|------------|------------|
| 用 TodoWrite 做持久化 | 创建计划文件或 plan package |
| 只说一次目标然后忘掉 | 每次决策前重新阅读计划 |
| 隐藏错误然后重试 | 把错误记录到计划文件 |
| 把所有东西塞进上下文 | 把大内容存入文件 |
| 直接开始执行 | 先创建计划文件 |

## 高级模式

参见 [reference.md](reference.md)：
- Attention manipulation techniques
- Error recovery patterns
- Manus 的 context optimization

参见 [examples.md](examples.md)：
- 真实任务示例
- 复杂工作流模式
