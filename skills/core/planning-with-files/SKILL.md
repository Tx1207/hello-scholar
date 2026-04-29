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
| `requirements.md` | 记录用户问题、目标、成功标准、约束、非目标和确认问题 | 计划开始时 |
| `plan.md` | 说明接下来怎么做：修改策略、受影响文件、逐项修改、行为变化、风险和验证计划 | 实施前 |
| `tasks.md` | 跟踪具体任务、文件、具体改动、完成标准、验证、依赖和 traceability | 执行过程中 |
| `contract.json` | 可选的机器可读执行契约 | 当验证 / review 规则重要时 |

`tasks.md` 应明确包含：

- `涉及文件`
- `具体改动`
- `完成标准`
- `验证方式`
- `依赖/阻塞`
- `对应计划项`
- `对应 change 记录`

## 修改说明与记录职责

当任务涉及修改规则、prompt、workflow、`AGENTS.md`、`SKILL.md`、agent prompt 或 command skill 时，用户可见修改说明必须回答：

- `我理解的问题`：用户指出的失败模式，以及影响的是用户输出、记录资产还是执行行为。
- `修改目标`：修改后模型必须多做到什么，哪些误解要被显式避免。
- `修改范围`：准备修改哪些文件、section 或 command，哪些相关对象不改。
- `具体修改点`：每一处当前不足、准备加入的规则、插入位置和影响输出。
- `行为变化`：修改后在什么触发条件下会多输出、记录或验证什么。
- `风险与边界`：输出变长、模板机械化、规则冲突等风险，以及哪些场景不强制完整展开。
- `验证方式`：通过 diff review、模板完整性检查、dry-run 或测试证明修改生效。

职责必须分清：

- `plan` 文件回答“接下来怎么做”，不得冒充完成记录。
- `change` 文件回答“实际改了什么”，不得复述未执行计划。
- 每个用户核心需求至少对应一个 plan item；每个 plan item 至少对应一个 task；每个完成 task 必须对应 change record 和验证证据。

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

## 用户问题
[用户原始问题、核心担忧、显式需求与隐含需求]

## 目标
[1-3 条可验证最终状态]

## 成功标准
- [用户可见输出达到什么标准]
- [plan / change 记录达到什么标准]
- [验证或 review 达到什么标准]

## 约束
- [约束]

## 非目标
- [明确排除的工作]

## 需要确认的问题
- [真正影响实现的问题；如可默认继续，写明默认假设]
```

### `plan.md`

```markdown
# 计划：[简短描述]

- Route：`[route]`
- Tier：`[tier]`

## 修改策略
[总体方法，以及为什么不是只增加泛化规则]

## 受影响文件
| 文件 | 相关 section / 模块 | 本次职责 |
|---|---|---|
| `[path]` | [section] | [为什么要改] |

## 逐项修改说明
### PLAN-001 [短标题]
- 当前问题：
- 准备修改：
- 插入位置：
- 新增规则：
- 删除或替换内容：
- 影响的输出：
- 与其他规则的关系：

## 行为变化
- [用户可见回答变化]
- [plan / tasks / change 文件变化]
- [不确定信息处理方式变化]

## 风险与缓解
- [风险]：[缓解方式]

## 验证计划
- [模板完整性检查]
- [traceability 检查]
- [测试、dry-run 或人工 review]

## Traceability
| 用户需求 | Plan Item | Task | Changed File | Verification | Status |
|---|---|---|---|---|---|
```

### `tasks.md`

```markdown
# 任务：[简短描述]

- [ ] 任务 1
  涉及文件：[file list]
  具体改动：[新增字段 / 修改规则 / 删除或替换内容]
  完成标准：[definition of done]
  验证方式：[test / review / evidence]
  依赖/阻塞：[dependency or none]
  对应计划项：[PLAN-001]
  对应 change 记录：[完成后填入]
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
