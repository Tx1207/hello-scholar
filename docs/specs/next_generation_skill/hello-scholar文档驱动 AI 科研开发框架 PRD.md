# hello\-scholar\-2 文档驱动 AI 科研开发框架 PRD

**版本：** v0\.5
**状态：** Accepted
**产品名称：** Spec–Plan–Tasks–Record–Architecture Framework
**适用范围：** 使用 Codex、Claude Code 等 AI 编程工具进行 AI 科研、Agent 开发、模型优化和工程实验的个人或小型团队
**目标仓库：** `Tx1207/hello-scholar-2`

---

## 1\. 产品定义

hello\-scholar\-2 需要提供一套以文件为长期项目记忆、以 AI 为主要执行者、以 Git 和实验结果为事实依据的开发框架。

框架保留五类核心文档：

```Plain Text
Spec           目标设计
Plan           技术实施方案
Tasks          可执行工作
Record         实验事实与结论
Architecture   当前已实现系统
```

这五类文档分别承担设计、实施、执行、实验和当前状态管理。

需要长期合同的正式实施主链为：

```Plain Text
Brainstorm
        ↓
Spec
        ↓
Plan
        ↓
Tasks
        ↓
Implementation
        ↓
Tests / Record
        ↓
AGENTS Fresh Evidence
```

Fast Path 不进入这条文档链。`Converge` 只在 Bundle 末端或用户明确要求时运行，默认只读；Architecture 只由用户发起，或在 Bundle 完成且系统结构发生材料性变化时提醒用户确认后更新。`AGENTS Fresh Evidence` 表示主 Agent在当前工作树上实际运行并读完的验证输出，不增加新的核心文档或报告文件。

可表示为：

$\boxed{
S
\rightarrow
P
\rightarrow
T
\rightarrow
I
\rightarrow
R
\rightarrow
V
}
$

其中：

- \(S\)：目标设计；

- \(P\)：技术实施方案；

- \(T\)：可执行任务；

- \(I\)：代码实现；

- \(R\)：实验与运行记录；

- \(V\)：当前工作树上的新鲜验证证据。

相关 Architecture 章节可以作为输入上下文，但不是缺失时的阻塞门。末端 Converge 记为可选 \(C?\)；Architecture 更新记为条件动作 \(A_{t+1}?\)，只在用户发起，或用户确认已完成 Bundle 的材料性结构变化后执行。

---

# 2\. 产品背景

使用 Codex、Claude Code 等 AI 工具进行长期项目开发时，主要存在以下问题：

1. 设计只存在于聊天记录中，切换会话后上下文丢失。

2. 同一个问题反复生成多份相似 Spec，用户无法判断应当阅读哪一份。

3. AI 会把代码、脚本、配置、输出和结果放到错误目录。

4. 一个问题存在多个方案时，AI 可能把多个方案同时实现进正式代码。

5. AI 更擅长增加代码，不会主动删除旧实现、旧配置和临时兼容逻辑。

6. 复杂设计直接交给 AI 后，实施过程容易漏步骤或扩大范围。

7. 实验命令、参数、配置、结果和结论散落在终端和对话中。

8. 项目缺少一份能够直接说明当前结构和当前技术选择的 Architecture。

9. Spec、Plan、Tasks、Index 和 Architecture 如果每次同步修改，会明显拖慢开发。

10. AI 每次读取大量历史文件，也会降低处理速度和上下文质量。

本产品必须同时解决两个相反的问题：

```Plain Text
文档不足
    → AI 缺少稳定上下文，项目无法恢复

文档过多
    → AI 写入和读取成本过高，开发速度下降
```

因此，产品不能要求所有任务都进入完整流程，而应根据工作类型和风险选择文档强度。

---

# 3\. 产品目标

## 3\.1 核心目标

系统应当支持：

1. 用户通过一份人类可读的 Spec 表达完整设计。

2. AI 根据 Accepted Spec 生成技术实施 Plan。

3. AI 根据 Approved Plan 生成可执行 Tasks。

4. AI 按 Tasks 实施，并逐项验证。

5. 正式实验使用人类可读的 Record 保存过程和结论。

6. Architecture 始终描述当前已经实现并采用的系统。

7. 同一设计的细节变化修改原 Spec，而不是不断新建相似文件。

8. 一个 Topic 下的所有 Spec 可以通过自动索引快速定位。

9. Plan 和 Tasks 是否过期由 Revision 自动判断。

10. Index 由程序生成，不要求 AI 手工同步。

11. 一次文档语义操作原则上只修改一份核心文档。

12. 低风险科研探索允许先实验、后补 Record。

13. 简单 Bug 修复和局部调整不创建任何长期文档。

14. AI 默认只读取当前任务相关文件，避免全量扫描历史资料。

15. 文档缺失或长期未维护时，可以根据代码、Git 和已有文档恢复索引与 Architecture 草稿。

---

## 3\.2 流程效率目标

开发阶段优先让 AI 尽早进入真正推动任务的动作，并把不影响决定、安全或可复现性的文档工作移出关键路径。质量高于墙钟速度；减少文档数量只是手段，流程顺序和停点合理才是目标。

文档系统应满足：

$\text{Document Cost}
<
\text{Recoverable Knowledge Value}$

具体要求：

- 简单任务新增文档数为 \(0\)；

- 同一设计只有一个 Spec；

- 一次实验只有一份 Record；

- 一次语义操作不同时修改多份核心文档；

- Index 由代码统一生成；

- Architecture 可以在里程碑后集中更新；

- Spec、Plan、Tasks 允许延迟同步；

- 探索实验允许在受控条件下后补记录。

- 正式实验只让最小可复现 Record 和真实安全门阻塞启动；完整背景、观察和结论不在启动关键路径；

- 长时间实验运行期间可以补充不改变输入、配置和判断标准的非关键文档；

- 每个 Skill Eval 用场景专属 `criticalPath`、业务 rubric、hard rejects、交互顺序、命令和产物证据检查流程；

- 不使用分钟或毫秒作为 Skill 质量 pass/fail；runner watchdog 只保护资源，不替代质量判断；

- 业务质量、用户价值、流程合理性、相对 Baseline 增益和用户决定不能互相平均抵消。

---

# 4\. 非目标

第一版不做以下事情：

- 不替代 Git、Pull Request、Issue 和 CI。

- 不要求每次代码修改都创建 Spec。

- 不要求每次 Spec 修改都立即同步 Plan 和 Tasks。

- 不要求每个 Task 完成后立即更新 Architecture。

- 不为每个候选方案创建独立 Spec。

- 不保存 AI 的完整推理过程。

- 不创建每日进度日志。

- 核心闭环不自动创建额外 Audit、Handoff 或聊天总结文件；用户明确要求会话交接时，保留的 `handoff` Skill 可以单独写入 `hello-scholar/handoffs/`。

- 不创建 `run.json`。

- 不为同一次 Run 创建 `README.md`、`report.md` 或其他重复说明文档。

- 不自动批准重大设计。

- 不自动决定实验结论。

- 不引入数据库或外部文档平台。

- 不保证只依赖 Markdown 就能恢复完整代码；当前代码事实仍以代码和 Git 为准。

- 不要求用户一次性改造现有项目目录。

---

# 5\. 目标用户

## 5\.1 个人 AI 研究者

典型任务：

- KV Cache 加速；

- 模型量化；

- 推理性能优化；

- Prompt 和模型对比；

- 长上下文研究；

- Agent 行为评测；

- Prototype 和参数扫描。

核心需求：

- 设计不能只存在于聊天中；

- 实验可以快速启动；

- 实验必须能够复现；

- 失败和负结果也能保留；

- 不想维护大量重复文件；

- 能快速看清当前采用的技术路线。

---

## 5\.2 AI 工程开发者

典型任务：

- Agent、RAG 和模型应用开发；

- 接口和数据结构修改；

- 模块重构；

- 兼容迁移；

- 工具、CLI 和运行流程开发。

核心需求：

- AI 严格遵循 Spec；

- Plan 能限制实现范围；

- Tasks 能防止遗漏步骤；

- 文件放在正确目录；

- 多个候选方案不能一起进入生产代码；

- 旧实现、旧配置和旧入口可以被清理；

- 当前 Architecture 与代码一致。

---

## 5\.3 小型团队

核心需求：

- 设计和实验不依赖某个人的聊天记录；

- 多个开发者或 Agent 可以使用同一份 Tasks；

- 工作可以跨会话恢复；

- 文档之间能够相互追溯；

- 文档维护可以按阶段集中处理，而不是要求实时同步所有文件。

---

# 6\. 核心设计原则

## 6\.1 五类文档职责单一

```Plain Text
Spec
    定义目标设计

Plan
    定义技术实施方案

Tasks
    定义可执行工作

Record
    定义实验事实和结论

Architecture
    定义当前系统状态
```

不得在多个文件中完整复制同一内容。

例如：

- Spec 不复制 Tasks；

- Plan 不复制整份 Spec；

- Tasks 不重新解释设计理由；

- Record 不复制全部结果文件；

- Architecture 不复制完整 Spec。

---

## 6\.2 同一设计集中存放

同一个设计的 Spec、Plan 和 Tasks 必须放在同一个目录：

```Plain Text
SPEC-001-<design-name>/
├── spec.md
├── plan.md
└── tasks.md
```

用户只需找到一个 Spec 目录，就能找到该设计的所有实施信息。

---

## 6\.3 同一设计只有一个 Spec

只要以下内容没有发生根本变化，就修改原 Spec：

- 要解决的问题；

- 设计目标；

- 核心能力边界；

- 主要验收标准。

以下变化直接修改原 Spec：

- 调整参数；

- 修改设计细节；

- 增加评价指标；

- 补充候选方案；

- 补充异常处理；

- 修改尚未稳定的接口；

- 修改实验矩阵；

- 增加验收条件。

禁止创建：

```Plain Text
spec-new.md
spec-final.md
spec-latest.md
spec-v2-final.md
2026-08-01-new-design.md
```

同一设计的变化使用：

```Plain Text
稳定 Spec ID
+
Revision
+
Git History
```

管理。

---

## 6\.4 多个候选方案写在同一 Spec

如果多个方案回答的是同一个问题，必须集中写入同一 Spec：

```Plain Text
Option A：Contiguous Allocation
Option B：Paged Allocation
Option C：Segmented Allocation
```

不得为三个候选方案分别创建三个 Spec。

不同方案的实际实验使用不同 Record 表达。

---

## 6\.5 单文档语义事务

一次文档语义操作原则上只修改一份核心文档：

$\left|
\operatorname{CoreDocumentsEdited}(o)
\right|
\le 1$

示例：

以下操作不计入该限制：

- 修改代码和测试；

- 自动生成 Index；

- 更新由程序计算的状态展示。

- 创建 Successor Spec 时，同一次经过用户确认的关系维护需要同时更新新旧两份 `spec.md`。这是同一类核心文档的显式例外，只允许维护 `supersedes` / `superseded_by` 及其必要 Revision 事实，不能借机同步 Plan、Tasks 或 Architecture。

不得要求 AI 在一次操作中同时语义修改：

```Plain Text
spec.md
plan.md
tasks.md
architecture.md
```

---

## 6\.6 延迟同步

Spec 修改后，不立即要求修改 Plan 和 Tasks。

系统通过 Revision 自动判断同步状态：


$\operatorname{PlanCurrent}
\iff
\operatorname{Plan.spec_revision}
 =
\operatorname{Spec.revision}
$

$\operatorname{TasksCurrent}
\iff
\operatorname{Tasks.spec_revision}
 =
\operatorname{Spec.revision}
\land
\operatorname{Tasks.plan_revision}
 =
\operatorname{Plan.revision}
$

如果不一致，系统显示：

```Plain Text
Plan: Stale
Tasks: Stale
```

但不自动修改原文件。

只有继续实施前，才分别执行：

```Plain Text
同步 Plan
同步 Tasks
```

---

## 6\.7 Architecture 只描述当前现实

Architecture 只能描述：

- 已经实现；

- 已经验证；

- 已经合并或正式采用；

- 当前代码中真实存在；

的系统状态。

以下内容不得提前进入 Architecture：

- Draft Spec；

- 尚未实现的 Accepted Spec；

- 未完成 Plan；

- 未完成 Tasks；

- Prototype 分支；

- 失败实验；

- 未采用的候选方案。

---

## 6\.8 支持实验优先

AI 科研并非所有问题都适合先写完整 Spec。

系统必须同时支持：

### 设计优先

```Plain Text
Architecture
→ Spec
→ Plan
→ Tasks
→ Implementation
→ Record
```

### 实验优先

```Plain Text
Check Exploration Boundary
→ Quick Experiment
→ Complete Record Before Decision Boundary
→ Result
→ Spec
→ Plan
→ Tasks
```

实验优先必须受风险条件限制，不得用于不可逆或生产级变化。

---

# 7\. 文件架构

```Plain Text
<project-root>/
├── AGENTS.md
├── CLAUDE.md
├── hello-scholar/
│   ├── architecture.md
│   ├── handoffs/
│   │   └── YYYY-MM-DD-<topic>-handoff.md
│   └── specs/
│       ├── INDEX.md
│       └── <topic-id>/
│           ├── INDEX.md
│           └── SPEC-001-<design-name>/
│               ├── spec.md
│               ├── plan.md
│               └── tasks.md
└── runs/
    ├── INDEX.md
    │
    └── <run-id>/
        ├── record.md
        ├── outputs/
        ├── results/
        ├── logs/
        └── checkpoints/
```

说明：

- `architecture.md`：当前系统状态；

- `handoffs/`：用户按需创建的会话交接文件；它不是五类核心文档，不进入自动 Index；

- `spec.md`：目标设计；

- `plan.md`：技术实施方案；

- `tasks.md`：执行清单；

- `record.md`：实验记录；

- 所有 `INDEX.md`：程序自动生成；

- 不使用 Topic `README.md`；

- 不创建 `run.json`；

- 不为 Run 创建第二份说明文档。

核心文档、自动 Index 以及从项目根目录到这些目标的每一级父目录必须是普通文件或普通目录。文档工具不得跟随 symlink/junction，即使链接仍指向项目内；应报告错误并保持目标不变。Run 的 `outputs/`、`results/`、`logs/`、`checkpoints/` 是明确剪枝的运行产物目录，可以链接到外部存储，文档工具只识别并跳过这些节点，不读取或写入链接目标。

---

# 8\. 核心对象

## 8\.1 Topic

Topic 是长期稳定的研究或设计方向。

示例：

```Plain Text
kv-cache-acceleration
agent-memory
retrieval-quality
model-routing
long-context
```

命名规则：

- 使用小写；

- 使用 `kebab-case`；

- 不带版本号；

- 不使用 `new`、`final`、`latest`；

- 不把单次实验参数作为 Topic；

- 不因内部实现调整而改变 Topic。

---

## 8\.2 Spec

Spec 是一项独立设计的稳定身份。

Spec 类型：

### Spec 固定元数据

```YAML
---
schema: 1
kind: spec

id: SPEC-001
title: Paged Cache Feasibility
topic: kv-cache-acceleration
type: research

status: accepted
revision: 3

summary: 验证 Paged KV Cache 在动态批处理场景中的可行性

created: 2026-07-20
updated: 2026-08-01

supersedes: []
superseded_by: null
---
```

Spec ID 使用 `SPEC-` 加至少三位十进制数字，例如 `SPEC-001`；超过 `SPEC-999` 后继续使用 `SPEC-1000`，不截断、不回绕，也不重用历史空洞。

### Spec 状态

```Plain Text
draft
accepted
completed
rejected
withdrawn
superseded
```

### Spec 正文要求

`spec.md` 必须包含：

```Markdown
# <Spec Title>

## 1. 价值与当前决定

先说明用户得到什么价值、当前推荐或已接受的决定，以及为什么值得现在处理。

## 2. 问题与当前事实

说明当前代码、行为、约束和证据；把事实与尚未验证的假设分开。

## 3. 目标与非目标

说明必须达到的结果，以及本次明确不解决的范围。

## 4. 目标设计

描述目标结构、组件职责、数据流、生命周期和错误处理。

## 5. 接口、数据与不变量

定义输入、输出、公共接口、数据格式、兼容要求及必须持续成立的约束。

## 6. 实施边界

列出允许修改与不得触碰的模块、行为和依赖。

## 7. 验收与验证

使用可观察、可测试的条件定义完成标准，以及测试、Benchmark、Eval 或正式实验要求。
```

以下章节只在确有材料性内容时加入，不生成空标题：

- `候选方案与权衡`：存在两个以上真实可选方向时；
- `迁移与清理`：存在调用方、数据、配置、旧实现或兼容路径时；
- `回滚`：变化有发布、迁移或不可逆风险时；
- `证据`：存在相关 Run Record 或外部事实时；
- `未决问题`：仍需用户决定或外部验证时；
- `Revision History`：初版之后发生语义 Revision 时。

这不是删除原 Brainstorm 的设计能力。模块、接口、数据流、错误处理、测试、清理和回滚仍保留，只是放入七个稳定核心章节或真正需要的条件章节，让读者先看到价值与决定，不必穿过固定 15 节才能理解文档。

---

## 8\.3 Plan

Plan 是对某个 Accepted Spec Revision 的技术实施方案。

### Plan 固定元数据

```YAML
---
schema: 1
kind: plan

spec: SPEC-001
spec_revision: 3

revision: 2
status: approved

title: Paged Cache Prototype Implementation
summary: 实现 Paged Cache 原型和基准评测入口

created: 2026-08-01
updated: 2026-08-02
---
```

### Plan 状态

```Plain Text
draft
approved
completed
cancelled
```

Plan 是否过期由程序计算，不需要在状态中写 `needs-sync`。

### Plan 正文要求

```Markdown
# <Plan Title>

## 1. 实施目标

说明完成本 Plan 后形成什么可验证结果。

## 2. 范围

### Included

列出本 Plan 包含的工作。

### Excluded

列出本 Plan 明确不包含的工作。

## 3. 技术实施方案

说明如何将 Spec 转换为代码和系统变化。

## 4. 受影响模块

列出受影响模块、职责和依赖变化。

## 5. 文件变更范围

### Add

新增文件或目录。

### Modify

修改文件或目录。

### Move or Migrate

移动或迁移内容。

### Delete

完成后删除的内容。

### Must Not Touch

不得修改的内容。

## 6. 接口变化

说明新增、修改或废弃的接口。

## 7. 实施阶段

说明阶段顺序和每阶段产物。

## 8. 测试与实验策略

说明单元测试、集成测试、Benchmark 和正式 Run。

## 9. 迁移顺序

说明调用方、数据、配置和部署迁移顺序。

## 10. 清理要求

说明旧代码、旧配置、旧测试和兼容路径的清理方式。

## 11. 回滚

说明如何恢复至实施前状态。

## 12. Tasks 生成规则

说明 Tasks 如何拆分、哪些可以并行、哪些必须串行。
```

Plan 不得重新选择 Spec 已经确定的设计。

如果 Plan 需要作出新的重大设计决定，必须停止并要求修改 Spec。

---

## 8\.4 Tasks

Tasks 是从 Approved Plan 生成的可执行工作清单。

### Tasks 固定元数据

```YAML
---
schema: 1
kind: tasks

spec: SPEC-001
spec_revision: 3

plan_revision: 2
revision: 4
approval: approved
approved_revision: 4
status: in-progress

created: 2026-08-02
updated: 2026-08-03
---
```

### Tasks 状态

```Plain Text
pending
in-progress
completed
cancelled
```

单个 Task 使用 Markdown 复选框和可选状态说明。

Tasks 合同审批与执行状态分开：

- `revision` 是 Tasks 的语义 Revision；
- `approval` 只允许 `pending-review | approved`；
- `approved_revision` 在未批准时为 `null`，批准后必须等于当前 `revision`；
- `status` 只表示执行进度，不代表合同获批，也不代表用户已经授权本轮实施。

新建或语义修改 `tasks.md` 时必须增加 `revision` 并把审批重置为 `pending-review`。只有用户明确批准当前 Revision 后才能恢复 `approved`。

### Task 正式格式

```Markdown
# Tasks

## Phase 1：Benchmark Infrastructure

- [ ] T001：实现 Block Allocator

  Spec Coverage:
  - AC-1
  - AC-2

  Depends On:
  - None

  Parallel:
  - No

  Files:
  - `src/cache/block_allocator.py`
  - `tests/cache/test_block_allocator.py`

  Work:
  - 实现 Block 分配与回收；
  - 保持 Scheduler 生命周期规则不变。

  Validation:
  - 单元测试通过；
  - 不产生重复 Block；
  - 已释放 Block 可以再次分配。

  Completion:
  - 代码已实现；
  - 测试已通过；
  - 未修改禁止范围。
```

每个 Task 必须：

- 有唯一编号；

- 可以独立理解；

- 可以独立执行；

- 可以独立验证；

- 不要求重新设计；

- 指向具体模块或文件；

- 对应一个或多个 Spec 验收标准；

- 明确依赖与并行关系。

顶层 Task 复选框的 ID 使用至少三位数字，并同时允许中英文文档常见的 `T001：...` 与 `T001: ...` 分隔形式；解析器不得因项目正文语言不同漏算完成度。

---

## 8\.5 Record

Record 是一次正式实验、Benchmark、Eval、训练或重要探索运行的人类可读记录。

### Record 固定元数据

```YAML
---
schema: 1
kind: record

run_id: 20260801-1430-paged-cache
title: Paged Cache Block Size Comparison

status: completed

spec: SPEC-001
spec_revision: 3
plan_revision: 2

started: 2026-08-01T14:30:00+08:00
completed: 2026-08-01T16:42:00+08:00

decision: adopt
summary: Block Size 16 在当前请求分布下取得最佳综合表现
---
```

实验优先时允许暂时为空：

```YAML
spec: null
spec_revision: null
plan_revision: null
```

### Record 状态

```Plain Text
planned
running
completed
failed
interrupted
cancelled
```

### Record 正文要求

```Markdown
# <Run Title>

## 1. 目的

说明本次运行要回答的问题。

## 2. 假设

说明实验前的预期。

## 3. 实验变量

列出被改变的变量。

## 4. 控制条件

列出保持不变的模型、数据、硬件、配置和 Seed。

## 5. 执行信息

### Working Directory

记录工作目录。

### Command

记录实际执行命令。

### Git State

记录 Branch、Commit 和未提交状态。

### Model and Configuration

记录模型、配置文件和关键参数。

### Dataset and Seed

记录数据版本和 Seed。

## 6. 产物位置

- Outputs: `outputs/`
- Results: `results/`
- Logs: `logs/`
- Checkpoints: `checkpoints/`

## 7. 执行事件

记录开始、结束、中断、重试和失败事件。

## 8. 关键结果

摘录关键指标，并引用 `results/` 中的文件。

## 9. 观察

记录异常、失败样本、波动和实验限制。

## 10. 结论

区分事实、推断和未解决问题。

## 11. 决定

明确采用、拒绝、继续研究或保持当前方案。

## 12. 后续行动

列出需要修改的 Spec、后续实验和工程工作。
```

一个 Run 只能有一份人类可读说明文件：

```Plain Text
record.md
```

不得同时创建：

```Plain Text
run.json
README.md
report.md
summary.md
final-report.md
```

---

## 8\.6 Architecture

Architecture 是当前代码库已经实现并正式采用的系统状态。

### Architecture 固定元数据

```YAML
---
schema: 1
kind: architecture

status: current
applies_to: main
updated: 2026-08-03
---
```

### Architecture 正文要求

```Markdown
# Current Architecture

## 1. 系统目标

说明当前项目解决的问题。

## 2. 项目结构

说明主要目录及其职责。

## 3. 当前模块

列出模块、路径、职责和依赖。

## 4. 当前技术选择

列出当前实际采用的技术方案及来源 Spec。

## 5. 关键运行流程

描述当前实际执行的数据流和调用流程。

## 6. 文件和运行产物位置

说明代码、脚本、配置、输出、结果、日志和 Checkpoint 的位置。

## 7. 当前约束

说明当前性能、兼容性、安全和依赖约束。

## 8. 技术债

列出当前仍存在但尚未解决的问题。

## 9. 设计来源

列出形成当前架构的 Completed Spec。
```

Architecture 不维护 `v1/v2` 文件。

历史状态由 Git 保存。

---

# 9\. 自动生成文件

以下文件由程序生成，不允许人工或 AI 手工编辑：

```Plain Text
hello-scholar/specs/INDEX.md
hello-scholar/specs/<topic-id>/INDEX.md
runs/INDEX.md
```

生成文件顶部必须包含：

```Markdown
<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->
```

---

## 9\.1 全局 Spec Index

至少展示：

- Topic；

- Spec ID 与相对链接；

- Type、Spec Status 和 Revision；

- Plan 的 `Missing | Current | Stale` 状态；

- Tasks 的 `Missing | Current | Stale` 状态和完成度；

- Summary。

---

## 9\.2 Topic Index

只展示当前 Topic 下的 Spec：

- Spec ID；

- Type；

- Status；

- Revision；

- Plan 状态；

- Tasks 状态和完成度；

- Summary；

- Spec 之间的显式关系。

---

## 9\.3 Run Index

至少展示：

- Run ID；

- Status；

- Related Spec；

- Spec Revision；

- Decision；

- Summary；

- Record Path。

---

## 9\.4 生成要求

索引生成必须：

1. 扫描所有源文档；

2. 解析 YAML Front Matter；

3. 验证字段和引用；

4. 自动计算 Plan、Tasks 同步状态；

5. 自动统计 Tasks 完成度；

6. 在内存中生成全部 Index；

7. 写入临时文件；

8. 计算本轮全部新建、替换和孤儿删除；孤儿 Index 只有在 generated marker、目标及父节点均为普通节点、且源目录或源文档消失都可证明时才允许删除；

9. 全部成功后按一个 all-or-rollback 批次更新；

10. 任一错误发生时恢复本轮替换和删除、移除本轮新建，保持原 Index 集合不变。

手写、marker 损坏、symlink/junction 或 ownership 不确定的 `INDEX.md` 必须保留并报错，不能把文件名当作删除许可。

---

# 10\. 工作流

## 10\.1 零文档快速路径

适用于：

- 局部 Bug；

- 文案修改；

- 格式调整；

- 单个测试补充；

- 不改变外部行为的内部重构；

- 临时调试。

流程：

```Plain Text
Code
→ Test
→ Git
```

不创建或修改 Spec、Plan、Tasks、Record 和 Architecture。

---

## 10\.2 设计优先路径

适用于：

- 新能力；

- 公共接口变化；

- 模块职责变化；

- 系统设计修改；

- 数据或配置迁移；

- 高风险任务。

流程：

```Plain Text
Read Relevant Architecture if Present
→ Create or Update Spec
→ Review Complete Spec
→ Accept Spec
→ Create or Sync Plan
→ Review Complete Plan
→ Approve Plan
→ Create or Sync Tasks
→ Review Complete Tasks
→ Execute Tasks
→ Tests / Record
→ AGENTS Fresh Evidence
→ Converge at Bundle End or on Explicit Request
→ Offer Architecture Maintenance only for Material Structural Change
```

每一步是独立事务，不要求一次同时更新全部文档。Brainstorm 只逐个询问会改变决定的材料性问题；信息充分后一次提交完整 Spec。Plan 和 Tasks 也分别整份审核，不逐节确认。用户可以要求“走完整流程”，让 Router 在同一个 Goal 中继续推进后续阶段，但这不会跳过三份文档的整份审核和单独的实施授权。

---

## 10\.3 实验优先路径

适用于：

- 参数扫描；

- 快速模型或 Prompt 对比；

- 可丢弃 Prototype；

- 低成本可行性实验；

- 尚不足以形成正式设计的问题。

流程：

```Plain Text
Check Exploration Boundary
→ Quick Experiment
→ Create or Complete Record
→ Analyze Result
→ Create or Update Spec
→ Plan
→ Tasks
```

### 实验优先允许条件

必须同时满足：

- 不修改生产数据；

- 不执行不可逆操作；

- 不改变公共 API；

- 不改变持久化格式；

- 有明确时间和成本上限；

- 实验代码和产物与正式生产路径隔离；可以使用现有隔离 Branch、临时目录或 Worktree，但不因进入探索路径自动创建 Worktree；

- 实验结果不会直接进入正式生产路径。

### 补录时限

探索实验允许先运行，但必须在以下任一事件前完成 `record.md`：

- 关闭当前工作会话；

- 使用实验结果作出设计决定；

- 合并实验代码；

- 编写依赖该结果的 Spec；

- 启动下一轮依赖该结果的实验；

- 向其他人分享结论。

正式、昂贵、长时间、不可逆、生产数据相关或用于 Spec 正式验收的实验仍必须在运行前创建 Record。

正式实验的“运行前创建”只要求足以复现和安全启动的最小内容：Run 身份、目的/假设、精确命令与 CWD、输入/关键配置/Seed/Git、产物路径、预期/失败信号、停止条件和时间/成本上限。信息齐全后应启动；完整背景和终态字段不先阻塞机器运行。

长时间运行开始后，可以利用等待时间补充不影响本次运行的 provenance、背景和证据位置。运行期间只记录状态、路径或关键证据的实质变化，不做高频轮询式写入；结束、失败、中断或取消后一次补齐结果、结论、决定和下一步。

---

## 10\.4 Spec 修改路径

```Plain Text
修改 spec.md
→ Revision +1
→ 程序显示 Plan Stale
→ 需要继续实施时同步 plan.md
→ Plan Revision +1
→ 程序显示 Tasks Stale
→ 需要继续实施时同步 tasks.md
```

不得在同一次语义操作中同时修改三份文档。

---

## 10\.5 实施路径

```Plain Text
Read Relevant Architecture if Present
→ Read Spec
→ Read Current Plan
→ Read Current Tasks
→ Execute Tasks by Dependency
→ Validate Each Task
→ Update tasks.md
→ AGENTS Fresh Evidence
→ Converge at Bundle End or on Explicit Request
→ Architecture only after User Confirmation when Materially Changed
```

当前主 Agent 直接按 `tasks.md` 的依赖、Files、Validation 和 Completion 执行，不需要先调用专门的执行 Skill，也不要求每个 Task 再派发一个实现 subagent。平台 subagent 和只读 Review 可以由主 Agent按任务独立性与风险临时使用，但不是框架完成条件。

`test-driven-development` 只在用户明确指定，或当前已批准 Task 明确要求 TDD 时启用。没有显式触发时，主 Agent仍必须遵守 Task Validation 和项目 AGENTS 的测试/证据规则；显式触发后必须完整执行 Red-Green-Refactor。

实施过程中通常只更新：

```Plain Text
tasks.md
```

如果发现关键设计缺失，停止实施并返回 Spec。

如果发现技术实施方案不成立，停止实施并返回 Plan。

---

## 10\.6 Architecture 维护路径

Architecture 不要求在每个 Task、Commit、Run 或普通 Bundle 后更新。

只有以下两类入口可以执行 Architecture 维护：

- 用户明确要求查看、恢复或更新当前 Architecture；
- 一个 Bundle 已完成，并且当前代码证据显示系统结构、关键模块职责、公共运行流程或持久位置发生材料性变化。此时 Agent 只提醒用户并说明拟更新范围，用户确认后才写。

功能合并、里程碑、发布前检查或“可能过期”本身都不是自动写入许可。若没有材料性结构变化，保持现有 Architecture 不动。

维护输入：

```Plain Text
当前代码和目录
Git
Completed Spec
Completed Plan
Completed Tasks
有效 Record
现有 Architecture
```

输出只修改：

```Plain Text
hello-scholar/architecture.md
```

---

# 11\. 功能需求

## 11\.1 Spec 管理

### FR\-SPEC\-001：创建前检索

创建新 Spec 前必须：

1. 读取全局 Spec Index；

2. 读取 Topic Index；

3. 搜索问题、目标和设计相似的 Spec；

4. 读取可能相关的 Spec；

5. 输出以下判断之一：

```Plain Text
Update Existing Spec
Create Independent Spec
Create Successor Spec
Need Human Classification
```

不得默认创建新 Spec。

### FR\-SPEC\-002：Revision 管理

同一设计修改必须：

- 保持 Spec ID；

- 保持目录；

- 更新 Revision；

- 更新 `updated`；

- 增加 Revision History；

- 重新生成 Index。

格式和错别字修改不增加 Revision。

### FR\-SPEC\-003：候选方案集中

同一问题的候选方案必须写入同一 Spec。

### FR\-SPEC\-004：新 Spec 条件

`Create Independent Spec` 必须同时满足两层条件：

- 它代表与现有 Spec 不同的问题或一项真正独立的能力；

- 它可以独立批准、独立实施、独立验证，并能独立停止或回滚。

只有其中一个弱信号时返回 `Need Human Classification`，不能因为“看起来可以单独测试”就制造新 Bundle。根本替代现有设计不属于 Independent 分支，应使用 `Create Successor Spec` 并维护明确的替代关系。

### FR\-SPEC\-005：材料性询问与整份审核

Brainstorm 只逐个询问会改变价值、设计、边界或外部合同的材料性问题；能从代码和现有文档确认的事实不反问用户。信息充分后一次提交包含七个核心章节和必要条件章节的完整 Spec，由用户整份审核；不逐章节索要确认。

---

## 11\.2 Plan 管理

### FR\-PLAN\-001：从 Accepted Spec 生成

Plan 必须引用：

```Plain Text
Spec ID
Spec Revision
```

### FR\-PLAN\-002：Plan 内容完整

Plan 必须包含：

- 技术实施方案；

- 受影响模块；

- 文件变更范围；

- 接口变化；

- 实施阶段；

- 测试与实验策略；

- 迁移顺序；

- 清理要求；

- 回滚方式；

- Tasks 生成规则。

### FR\-PLAN\-003：不得重新设计

如果 Plan 需要作出 Spec 没有明确的重要设计选择，必须停止并要求修订 Spec。

### FR\-PLAN\-004：Stale 自动检测

当：

\[

\\text\{plan\.spec\_revision\}

\\neq

\\text\{spec\.revision\}

\]

系统必须显示：

```Plain Text
Plan: Stale
```

但不得自动重写 Plan。

### FR\-PLAN\-005：整份审核

Plan 复用现有 Skill 的真源、范围、文件、接口、迁移、测试、清理和回滚规则，完成后一次提交整份审核。只有材料性设计缺口才逐个询问并回到 Spec，不把每一节变成确认门。

---

## 11\.3 Tasks 管理

### FR\-TASK\-001：从 Approved Plan 生成

Tasks 必须引用：

```Plain Text
Spec ID
Spec Revision
Plan Revision
```

### FR\-TASK\-002：任务可执行

每个 Task 必须：

- 有唯一编号；

- 有明确目标；

- 有 Spec 验收映射；

- 有文件或模块范围；

- 有前置依赖；

- 有并行标记；

- 有工作内容；

- 有验证方式；

- 有完成条件。

### FR\-TASK\-003：任务粒度

Task 必须能够独立理解、执行和验证。

不得把一个大型功能只写成一个 Task。

### FR\-TASK\-004：依赖管理

Tasks 必须明确：

- 前置任务；

- 可并行任务；

- 阻塞原因；

- 所属阶段；

- 对应验收标准。

### FR\-TASK\-005：Stale 自动检测

当 Spec Revision 或 Plan Revision 不匹配时，系统必须显示：

```Plain Text
Tasks: Stale
```

但不得自动重写 Tasks。

### FR\-TASK\-006：完成度自动统计

Tasks 完成度从 Markdown 复选框自动计算：

$\text{Completion Rate}=

\frac{\text{Completed Required Tasks}}
{\text{Total Required Tasks}}
$

### FR\-TASK\-007：整份审核与实施授权分离

Tasks 全部生成后一次提交整份 `tasks.md` 审核。批准当前 Tasks Revision 只表示执行合同有效，不自动授权当前回合开始实施；实施授权仍由用户单独给出。用户要求完整流程时可以在同一 Goal 继续到该停点，但不能提前批准尚未生成的 Tasks。

---

## 11\.4 AI 实施

### FR\-IMPL\-001：读取顺序

AI 实施前必须读取：

```Plain Text
Relevant Architecture if present
→ Spec
→ Plan
→ Tasks
→ Related Code and Tests
```

### FR\-IMPL\-002：逐任务实施

当前主 Agent 必须按 Tasks 的依赖顺序直接执行。框架不要求专用执行 Skill，也不把 subagent 委派或固定双 Review 作为每个 Task 的强制步骤。

每完成一个 Task：

1. 运行该 Task 的 Validation；

2. 确认 Completion 条件；

3. 更新复选框；

4. 检查是否偏离 Spec 和 Plan；

5. 再进入下一个 Task。

### FR\-IMPL\-003：禁止扩大范围

AI 不得：

- 增加 Spec 未批准的能力；

- 实现多个候选方案；

- 创建 Plan 未定义的新顶级模块；

- 修改 `Must Not Touch` 范围；

- 保留无退出计划的兼容代码；

- 跳过旧代码删除任务；

- 为未来可能需求增加未批准抽象。

### FR\-IMPL\-004：设计缺失时停止

出现以下情况必须停止：

- Spec 与 Plan 冲突；

- Plan 无法满足 Spec；

- Task 需要新的重大设计；

- 发现新的跨模块约束；

- 实施要求改变已批准接口；

- 当前 Architecture 与实施前提不一致。

---

## 11\.5 Record 管理

### FR\-RECORD\-001：正式实验

以下运行必须在执行前创建 Record：

- 正式实验；

- Benchmark；

- Release Eval；

- 训练；

- 昂贵或长时间任务；

- 不可逆运行；

- 生产数据相关运行；

- 用于正式验收 Spec 的运行。

启动前 Record 只要求最小可复现与安全字段齐全，不要求预写观察、结果、结论或润色完整说明。不可逆、生产数据和其他高风险操作的真实安全审批仍必须完成，不能用“最小 Record”绕过。

### FR\-RECORD\-002：探索实验补录

满足实验优先条件时，可以先运行后补 Record。

探索条件必须先由项目事实验证；条件全绿后不因完整文档写作延迟启动。到达补录边界仍无 Record 时，后续决定、Spec、依赖实验、合并和对外结论必须停止。

### FR\-RECORD\-003：一个 Run 一份 Record

一个 Run 只能存在：

```Plain Text
record.md
```

不得创建：

```Plain Text
run.json
README.md
report.md
summary.md
final-report.md
```

### FR\-RECORD\-004：失败和负结果

失败、无效、中断以及不支持假设的实验必须保留 Record。

### FR\-RECORD\-005：结果分工

`results/` 保存：

- 指标；

- 表格；

- 图表；

- 失败样本；

- 其他结果文件。

`record.md` 保存：

- 关键结果摘要；

- 观察；

- 结论；

- 工程决定；

- 后续行动。

---

## 11\.6 Converge

### FR\-CONV\-001：Spec 一致性

系统必须检查：

```Plain Text
Missing
Partial
Contradictory
Unrequested
```

分别表示：

- Spec 要求但未实现；

- 只实现了一部分；

- 实现与 Spec 冲突；

- 实现了 Spec 未要求的内容。

### FR\-CONV\-002：Plan 一致性

必须检查：

- 实际文件修改是否符合 Plan；

- 实施顺序是否满足依赖；

- 接口变化是否符合 Plan；

- 迁移是否完成；

- 清理是否完成；

- 回滚路径是否仍然可行。

### FR\-CONV\-003：Tasks 完成性

所有必需 Tasks 必须完成。

被跳过的 Task 必须说明原因，并确认不影响 Spec 验收。

### FR\-CONV\-004：旧代码清理

必须检查：

- 旧实现；

- 旧入口；

- 旧配置；

- 旧测试；

- 旧 Feature Flag；

- 临时兼容逻辑；

- 未使用依赖；

- 未使用文件；

- 未被选择的候选实现。

### FR\-CONV\-005：收敛就绪与框架完成

Converge 先判断 Bundle 是否达到 `Convergence Ready`：

$\boxed{
\text{Convergence Ready}
 =
\text{Spec Accepted Criteria Pass}
\land
\text{Plan Complete}
\land
\text{Tasks Complete}
\land
\text{Tests/Record Complete}
\land
\text{Cleanup Complete}
}$

Converge 只在 Bundle 末端或用户明确要求时执行，并且默认只读。达到 `Convergence Ready` 后，主 Agent 在当前工作树取得并读完 `AGENTS Fresh Evidence`；若用户要求更新 Architecture，或完成的 Bundle 造成材料性结构变化，则先提醒用户并提交 Architecture 语义 Proposal，批准后才写入当前事实。

$\boxed{
\text{Bundle Done}
 =
\text{Tasks and Acceptance Complete}
\land
\text{AGENTS Fresh Evidence Current}
\land
\text{Converge Pass if Invoked}
\land
\text{Architecture Synced if Confirmed Required}
}$

不得为了让 Converge 提前返回通过而先写 Architecture，也不得用旧命令输出代替当前工作树的新鲜证据。没有材料性结构变化时，Architecture 未修改不是失败。

### FR\-CONV\-006：入口与写入边界

Converge 只在用户明确要求，或当前 Bundle 的必需 Tasks 和验证已完成时运行。默认输出只读偏差报告，不修改代码、核心文档或 Task 状态；需要追加 Convergence Tasks 时，先由用户批准新的 Tasks Revision。

---

## 11\.7 Architecture 管理

### FR\-ARCH\-001：单一当前架构

第一版只维护：

```Plain Text
hello-scholar/architecture.md
```

### FR\-ARCH\-002：独立维护

Architecture 更新是独立文档事务，不与 Spec、Plan、Tasks 或 Record 同时语义修改。

### FR\-ARCH\-003：事实来源

Architecture 必须同时参考：

- 当前代码；

- Git；

- Completed Spec；

- Completed Plan；

- Completed Tasks；

- 有效 Record。

### FR\-ARCH\-004：禁止提前写入

未实现设计不得进入 Architecture。

### FR\-ARCH\-005：设计追溯

Architecture 中的重要技术选择应引用来源 Spec。

### FR\-ARCH\-006：恢复草稿

Architecture 缺失时，系统可以生成恢复草稿。

恢复草稿必须标记：

```Plain Text
Needs Human Review
```

不得自动当作正式 Architecture。

### FR\-ARCH\-007：条件触发

Architecture 写入只允许由用户明确发起，或在 Bundle 完成且系统结构发生材料性变化时，由 Agent 提醒用户确认后发起。材料性变化至少涉及项目结构、关键模块职责、公共运行流程或持久位置之一；普通实现、测试、Commit、Run 和无结构变化的 Bundle 不触发写入。

---

## 11\.8 Index 管理

### FR\-INDEX\-001：自动生成

以下文件由程序自动生成：

```Plain Text
hello-scholar/specs/INDEX.md
hello-scholar/specs/<topic-id>/INDEX.md
runs/INDEX.md
```

### FR\-INDEX\-002：固定元数据

Index 必须从 YAML Front Matter 和 Tasks 复选框生成。

### FR\-INDEX\-003：原子更新

任一源文档解析失败时，不得部分更新 Index。可证明由程序生成且已经失去对应源的孤儿 Index 删除，必须与新建和替换处于同一个可回滚批次；ownership 不确定时保留并报错。

### FR\-INDEX\-004：禁止人工编辑

AI 和用户不得手工修改自动生成的 Index。

核心文档、Index 和父路径上的 symlink/junction 必须拒绝；明确剪枝的 Run 产物目录可以链接到外部存储，但文档工具不得跟随。

---

# 12\. Skill 框架

下一代 Skill 只保留有独立判断价值的 owner。当前 14 个名称是进入 Baseline 的候选集合，不是必须凑齐的最终数量。正式文档实施主流程为：

```Plain Text
using-helloscholar
→ brainstorming / manage-specs
→ writing-plans
→ generating-tasks
→ 主 Agent直接执行 Tasks
→ record-experiment（需要正式运行时）
→ converge-to-spec（Bundle 末端或用户明确要求，默认只读）
→ docs-maintenance architecture（用户确认需要时）
```

各 owner：

- `using-helloscholar`：Fast、Design、Execution、Experiment、Maintenance 路由；

- `brainstorming` 与 `manage-specs`：设计对话和 Spec 身份；

- `writing-plans` 与 `generating-tasks`：分别生成高层 Plan 和独立 Tasks；

- `record-experiment`：正式实验事前记录和合格探索补录；

- `converge-to-spec`：Bundle 一致性、清理和完成就绪；

- `docs-maintenance`：Check、Index、Architecture 和 Recover；

- `handoff`：可选会话交接，不属于五类核心文档；

- `test-driven-development`：用户或 Approved Task 明确要求时使用；

- `using-git-worktrees`：用户或 Approved Task 明确要求时使用；Agent 因风险建议隔离时，创建前仍按 Skill 获得用户同意；

- `crash-audit`、`takeoff`、`landing`：只在用户明确调用时使用。

Task 实施、根因定位、新鲜验证、代码审查判断、并行委派和 Git 收尾由主 Agent遵循项目 AGENTS 与平台能力完成，不再各包一层强制 Skill。

运行时分为两组：

- 可由请求和项目事实自动到达：`using-helloscholar`、`brainstorming`、`manage-specs`、`writing-plans`、`generating-tasks`、`record-experiment`、`converge-to-spec`、`docs-maintenance`；自动到达只表示满足对应业务条件，不表示八个 Skill 要串行全跑。
- 只在用户明确意图或已批准 Task 明确点名时到达：`handoff`、`test-driven-development`、`using-git-worktrees`、`crash-audit`、`takeoff`、`landing`。

Router 面向用户只说一句所选路径和本轮核心文档范围，然后默认继续。只有不确定信息会材料性改变路径、写入范围、安全或外部合同时才逐个询问；能从代码和现有文档确认的事实不反问用户。用户可以要求完整流程，表示同一 Goal 连续推进后续阶段，不表示预先批准未来产物。

## 12.1 Skill 编写质量门

任何新增或修改生产 Skill 的 Task，在写入前必须完整读取：

```Plain Text
/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md
/xsb/hello-scholar/.agents/skills/writing-great-skills/GLOSSARY.md
```

`.agents/` 被当前仓库忽略，不会自动进入新 Worktree。实施者无论从哪个隔离 Worktree 写 Skill，都必须读取上述原 checkout 的绝对路径；任一文件缺失时停止并报告，不得改读待淘汰的 `writing-skills` 或依靠记忆继续。

实施者必须结合目标 Skill 和原版本明确调用方式、真实触发分支、信息层级、context pointer、步骤完成条件和要保留的行为；同时清理 duplication、sediment、sprawl、no-op 和不必要的 negation。该 authoring Skill 只服务本仓库 Skill 编写，不加入最终产品 Skill 清单。

Skill 源文件质量、场景业务行为、用户价值表达、关键路径合理性、相对 Baseline 增益和用户最终裁决是六个独立质量层。任一层失败都不能靠其他层平均分补回。

## 12.2 Skill 真实项目评测

当前 14 个候选产品 Skill 每项默认至少两个不同真实项目场景。Protocol 必须记录稳定的 `projectId`；复制同一 Fixture、只改请求或给副本换 ID 仍属于同一项目。场景必须包含项目规则、Git、可运行代码/测试和会影响判断的真实状态，并由当前 Codex 会话的全新 Sonnet subagent 实际执行。实际 dispatch 使用 `model: "sonnet"`；Protocol、Baseline 和 Scorecard 必须分别记录 canonical `claude-sonnet-5`，Implementer/Reviewer 的 Agent ID 必须不同且都使用 `forkTurns: none`。项目规则只提供真实项目事实和已经存在的外部合同，不得替目标 Skill 直接选择分支、给出标准分类、泄漏未来回复或写好用户答案；真实项目测试继续可运行，rubric、hard rejects 和表达质量判断只给 Reviewer。九个已决定淘汰的 Skill 只验证删除与引用清理。

评测分开记录：

- 平台能观察 catalog 时，`activation-probe` 检查名称/description 触发；
- 始终可执行的 `instruction-eval` 把临时 Skill 副本的绝对 `SKILL.md` 路径交给 `fork_turns: none` subagent；它验证指令行为，不声称证明自动激活。

每个 Protocol v3 的 `skillExpectations` 都要把阶段和业务分支分开：`baselineLoad` 只允许 `absent | pre-change-explicit-file`，`liveLoad` 固定为 `current-explicit-file`，`branch` 使用 `enter | exit | optional`。Baseline 和 Live 的实际 snapshot 分别匹配对应字段；读取 Skill 不自动等于进入业务分支。

AI 在启动任何 Baseline 或 Live Agent、写运行证据或判断输出好坏之前，必须向用户提交场景和质量 rubric Proposal，说明 Proposal ID、当前 Scenario/Protocol/Fixture Hash、共享 rubric Hash、每个维度的 criterion、权重、固定 `0 / 90 / 100` 评分锚点、90 分门、否决项和 `criticalPath`。只有用户明确批准当前整组合同后才能运行；发生语义变化必须重新咨询。完整 Scenario/Protocol 是 evaluator-only，Implementer 只收到当前轮逐字消息、隔离目录、Skill snapshot 和安全边界；未来回复写入 Protocol 受 Hash 约束，并只在真实停点发送。Reviewer 只能给建议，最终 accepted 由用户决定。

Protocol v3 的运行记录必须逐项绑定获批命令模板和只替换占位符后的真实命令，并逐轮绑定消息 Hash、实际 Prompt Hash、前一停点和 Prompt 隔离证据。`pass` 或 `control-pass` 完成全部获批轮次；`fail` 只能保存从首轮开始的真实连续前缀。Fixture 中即使被目录 Hash 忽略的 runtime cache 也不得成为隐形 Proposal 输入。

所有 Protocol v3 还必须绑定同一份用户价值 rubric Hash，分别检查：结果价值是否先被看见、语言是否匹配用户、信息是否容易扫描且文档可独立使用、决定/未知项/owner/下一步或停点是否明确、以及信噪比是否合格。业务 rubric 和用户价值 rubric 分开评分，各维及各组总分都不得低于 90。

如果未加载目标 Skill 的对照运行仍满足全部行为硬门，必须如实记录 `control-pass` 并暂停该 Skill 的验收。不得为了制造 Red 人为加难题；`control-pass` 也不等于 Skill 通过或 accepted，必须比较当前 Skill 是否仍带来可见增益，再由用户决定保留、改场景或淘汰。

用户可以在 `control-pass` 后因明确偏好选择保留某个显式 Skill，但系统必须如实写成偏好保留，不能声称对照已经证明增益。需要验证当前 Skill 不会降低质量时，运行 retention/non-regression Eval；也可以把决定留到整个 Baseline Batch 审核时统一处理。

评测不依赖全局 CLI：使用当前源码仓库的绝对 `node <repo>/bin/hello-scholar.js`。Loader、PATH、依赖、Fixture 初始失败或 Sonnet 不可用是环境阻塞，不能记录为 Skill Red；必须停止并报告，不能静默回退到 Terra、Opus 或其他模型，也不能把替代模型输出或 selector 写成同一合同的证据。

---

# 13\. Skill 触发规则

## 13\.1 自动触发

仅允许满足以下条件的 Skill 自动触发：

\[

\\text\{ReadOnly\}

\\land

\\text\{LowCost\}

\\land

\\text\{Reversible\}

\]

可以自动触发：

- 搜索相关 Spec；

- 判断是否应更新现有 Spec；

- 检查 Plan 是否 Stale；

- 检查 Tasks 是否 Stale；

- 检查文件位置；

- 统计 Tasks 完成度；

- 检查 Index 是否过期；

- Bundle 末端执行只读 Converge。

Architecture 漂移可以只读提示，但不能自动写入。Design 也不是“有任何行为变化就自动建文档”：只有决定需要长期合同、会改变公共接口/数据/模块职责，或具有材料性风险时才进入；路径不确定且会改变这些结果时可以询问用户。

`test-driven-development` 不属于自动触发项；普通 Feature、Bugfix、重构和 Fast Path 只触发项目常规验证。

---

## 13\.2 需要明确确认

以下操作必须有用户明确意图：

- 创建独立新 Spec；

- 将 Spec 标记为 Accepted；

- 根本替代旧 Spec；

- 批准高风险 Plan；

- 启动正式实验；

- 删除重要旧实现；

- 将 Spec 标记为 Completed；

- 大幅更新 Architecture；

- 执行不可逆迁移。

- 启动 `test-driven-development`，除非已批准的当前 Task 已明确要求 TDD。

- 启动 `crash-audit`、`takeoff` 或 `landing`；它们只响应用户本轮清楚表达的对应意图，不因普通回答、保守方案、Takeoff 上下文或风险词自动串联。

- 创建 Git Worktree，除非用户已有明确偏好或当前 Approved Task 已要求隔离；Agent 因风险提出 Worktree 时必须先获得同意。

- 清理 Git Worktree；必须先确认准确 provenance、Git 状态和用户授权，不能因实现完成自动删除。

---

# 14\. 文档维护 Skill

`docs-maintenance` 提供四种模式。

## 14\.1 `check`

只检查，不写文件：

- Front Matter；

- Spec ID 唯一性；

- 引用关系；

- Plan 和 Tasks 是否 Stale；

- Tasks 完成度；

- Record 完整性；

- Index 是否过期；

- Architecture 是否可能漂移。

---

## 14\.2 `index`

确定性生成：

```Plain Text
hello-scholar/specs/INDEX.md
hello-scholar/specs/<topic-id>/INDEX.md
runs/INDEX.md
```

允许一次更新多个 Index，因为这些文件完全由程序生成，不包含 AI 的设计判断。

---

## 14\.3 `architecture`

只修改：

```Plain Text
hello-scholar/architecture.md
```

该模式只在用户明确要求时执行；或一个 Bundle 已完成且出现材料性结构变化时，由 Agent 先说明证据和拟更新范围，提醒用户确认后执行。没有确认时保持只读，普通 Task、Commit、Run、无行为重构和无结构变化的 Bundle 不自动写 Architecture。

步骤：

1. 读取当前代码和目录；

2. 读取 Git 状态；

3. 读取 Completed Spec；

4. 读取 Completed Plan 和 Tasks；

5. 读取有效 Record；

6. 对比现有 Architecture；

7. 更新受影响章节。

重大语义变化需要用户审阅。

---

## 14\.4 `recover`

用于文档损坏或长期未维护：

- 重建所有 Index；

- 找出孤立 Spec；

- 找出 Stale Plan；

- 找出 Stale Tasks；

- 找出无关联 Run；

- 生成 Architecture 恢复草稿；

- 不自动覆盖已有核心文档。

---

# 15\. 非功能需求

## 15\.1 开发效率

### NFR\-EFF\-001：简单任务零文档

简单任务不得自动创建或修改核心文档。

### NFR\-EFF\-002：单文档事务

一次文档事务最多语义修改一份核心文档。

唯一显式例外是用户批准创建 Successor Spec 后，为维护同类文档关系而同时更新新旧 `spec.md`；该事务不得扩展到其他核心文档类型。

### NFR\-EFF\-003：延迟同步

Spec、Plan、Tasks 不要求同时更新。

### NFR\-EFF\-004：Index 自动维护

所有 Index 由程序生成。

### NFR\-EFF\-005：Architecture 延迟维护

Architecture 更新不得阻塞正常开发和实验。

### NFR\-EFF\-006：实验补录

低风险探索允许先实验后补 Record。

### NFR\-EFF\-007：按需读取

AI 默认只读取：

```Plain Text
相关 Architecture 章节
目标 Spec
对应 Plan
对应 Tasks
当前 Record
相关代码和测试
```

不得默认读取所有历史文档。

### NFR\-EFF\-008：Skill Eval 成本边界

每个产品 Skill 默认至少两个真实项目 Live Eval，但普通 `npm test` 只校验本地证据，不启动 subagent、网络或额外 API。合法 fail 证据可保留用于修复，最终发布才要求全部 case 经用户 accepted。

### NFR\-EFF\-009：关键路径合理性

每个 Protocol v3 必须声明一句具体、可观察且不含时间上限的 `criticalPath`。业务 rubric、hard rejects、交互 stop condition、获批命令、产物和完整树证据共同证明：

- 已经能推进任务时不会停在纯状态话术或重复确认；
- 用户决定、项目合同、安全风险和材料性未知项仍保留为必要停点；
- 正式实验的最小可复现 Record 先于启动，非关键说明延后；
- 长任务等待期间可以补非关键上下文，但不改输入和判断标准；
- 终态结果一次收口，不高频制造记录工作。

Protocol v3 不保存 `speed` 或 `speedLimits`，Baseline/Scorecard 不保存 `timing`。runner watchdog 只保护资源；触发表示运行未完成，不能直接判 Skill 质量失败。

---

## 15\.2 可读性

- 核心文档使用 Markdown；

- 元数据使用固定 YAML Front Matter；

- 状态、ID 和 Revision 位于文件顶部；

- 文档不依赖聊天记录；

- Index 只提供导航和状态汇总；

- 文档语言应直接、明确、可执行。

- 回答和文档先呈现当前结果、决定或价值，不让过程叙述把它埋住；

- 技术深度和术语匹配目标用户，正式文档脱离当前聊天仍能使用；

- 决定、未知项、owner、下一动作或刻意停点明确；

- 不保留样板话、重复结论、评测内部叙述和无关细节。

---

## 15\.3 可追溯性

- Plan 引用 Spec Revision；

- Tasks 引用 Spec 和 Plan Revision；

- Record 尽可能引用 Spec 和 Plan Revision；

- Architecture 引用来源 Spec；

- Git 保存文档和代码的全部修订历史。

---

## 15\.4 确定性

程序必须验证：

- Spec ID 唯一；

- Topic 与路径一致；

- Revision 为正整数；

- 状态属于允许值；

- 引用文件存在；

- 替代关系没有循环；

- Plan 与 Spec Revision 是否一致；

- Tasks 与 Spec、Plan Revision 是否一致；

- 一个 Run 只有一份 Record；

- Index 与源文档一致。

---

## 15\.5 安全性

Record 不得保存：

- API Key；

- Token；

- 密码；

- 私有凭证；

- 未脱敏敏感数据。

不可逆、高成本、生产数据相关或生产级操作不能进入实验后补录路径。

---

# 16\. MVP 范围

第一阶段必须完成：

1. Spec Bundle 目录结构。

2. `spec.md` Front Matter 和模板。

3. `plan.md` Front Matter 和模板。

4. `tasks.md` Front Matter 和模板。

5. `record.md` Front Matter 和模板。

6. `architecture.md` 模板。

7. 稳定 Spec ID、Topic 和 Revision。

8. 创建新 Spec 前检索。

9. 同一设计修改原 Spec。

10. Plan Stale 自动检测。

11. Tasks Stale 自动检测。

12. Tasks 完成度自动统计。

13. 全局 Spec Index。

14. Topic Index。

15. Run Index。

16. Brainstorm 输出 Spec。

17. Plan 从 Spec 生成。

18. Tasks 从 Plan 生成。

19. Tasks 驱动实施。

20. 正式实验前 Record。

21. 探索实验后补 Record。

22. Converge 一致性检查。

23. 旧实现和额外实现检查。

24. 单文件 Current Architecture。

25. `docs-maintenance check`。

26. `docs-maintenance index`。

27. `docs-maintenance architecture`。

28. `docs-maintenance recover`。

29. 简单任务零文档路径。

---

# 17\. 后续能力

MVP 完成后，可以增加：

- 基于文本相似度发现重复 Spec；

- 自动从 Shell 历史补录实验命令；

- 自动从 Git Diff 提示 Architecture 变化；

- 与 GitHub Issue 和 Pull Request 集成；

- CI 中检查 Stale Plan 和 Tasks；

- 多 Agent 并行任务分配；

- 大型项目的多文件 Architecture；

- Spec、Plan、Tasks 的 Web 导航界面；

- Run 指标聚合与趋势对比。

---

# 18\. 产品验收标准

## 18\.1 Spec

* [ ] 创建前搜索已有 Spec。

* [ ] 同一设计修改原 Spec。

* [ ] 多个候选方案位于同一 Spec。

* [ ] Spec 使用稳定 ID 和 Revision。

* [ ] Spec 与 Plan、Tasks 位于同一目录。

* [ ] Spec Index 可以快速定位设计。

## 18\.2 Plan

* [ ] Plan 引用 Spec Revision。

* [ ] Plan 包含模块、文件、接口、迁移、验证、清理和回滚。

* [ ] Plan 不重新决定 Spec 已确定的设计。

* [ ] Spec 修改后 Plan 自动显示 Stale。

* [ ] Spec 修改时不要求立即同步 Plan。

## 18\.3 Tasks

* [ ] Tasks 引用 Spec 和 Plan Revision。

* [ ] 每个 Task 可以独立执行和验证。

* [ ] Tasks 包含依赖、文件、验证和完成条件。

* [ ] Plan 修改后 Tasks 自动显示 Stale。

* [ ] Tasks 完成度由程序自动统计。

## 18\.4 Record

* [ ] 正式实验有完整 Record。

* [ ] 低风险探索允许后补 Record。

* [ ] 一个 Run 只有一份 `record.md`。

* [ ] 不生成 `run.json`。

* [ ] 不生成重复说明文档。

* [ ] 失败和负结果被保留。

* [ ] Record 保存结论和工程决定。

## 18\.5 Architecture

* [ ] Architecture 只描述当前已实现系统。

* [ ] Architecture 独立维护，不阻塞日常开发。

* [ ] 当前模块和技术选择可以快速查看。

* [ ] 重要设计能够追溯到 Spec。

* [ ] Architecture 缺失时可以生成恢复草稿。

## 18\.6 Index

* [ ] 全局 Spec Index 自动生成。

* [ ] Topic Index 自动生成。

* [ ] Run Index 自动生成。

* [ ] AI 不手工修改 Index。

* [ ] 生成过程具备原子性。

* [ ] 源文档错误时不部分更新 Index。

## 18\.7 开发速度

* [ ] 简单任务新增文档数为 \(0\)。

* [ ] 一次语义操作最多修改一份核心文档。

* [ ] Spec、Plan、Tasks 支持延迟同步。

* [ ] Architecture 不阻塞正常实施。

* [ ] AI 不默认加载全部历史文档。

* [ ] 探索实验不因完整前置文档而被阻塞。

* [ ] 正式实验在最小可复现 Record 完成后即可启动，完整说明不阻塞机器运行。

* [ ] 长时间实验运行期间补非关键文档，结束后一次补终态，不做高频记录。

* [ ] 每个 Protocol v3 的 `criticalPath` 由业务 rubric、hard rejects、交互顺序、命令和产物证据支持，不使用墙钟质量门。

## 18.8 Skill 质量

* [ ] 当前 14 个候选 Skill 每项默认至少两个真实项目场景；最终保留数量由 Baseline 证据和用户决定。

* [ ] 每个场景由当前 Codex 会话的 Sonnet、`fork_turns: none` Implementer 和独立 Reviewer 实跑；实际 dispatch 使用 `model: "sonnet"`，Protocol、Baseline、Scorecard 都记录 canonical `claude-sonnet-5` 且两个 Agent ID 不同，Sonnet 不可用即停止，不回退。

* [ ] Skill 编写前使用 `writing-great-skills` 检查调用、信息层级、完成条件和 pruning。

* [ ] 场景业务评分和共享用户价值评分分别达到 90，任一维度不被平均抵消。

* [ ] 输出能让目标用户快速看出价值，语言贴近用户，正式文档可独立使用且下一步明确。

* [ ] 用户在任何 Baseline/Live Agent 运行前批准 Proposal ID、Scenario/Protocol/Fixture、rubric 和 `criticalPath` 的当前 Hash，并对最终 accepted 作决定。

* [ ] 显式文件评测与自动激活探针分开，不伪造调用遥测。

* [ ] 普通 `npm test` 不启动 Agent、网络或额外 API。

---

# 19\. 成功指标

- 简单任务新增或语义修改的五类核心文档数为 `0`；

- 所有文档驱动实施都能从一个 Current Bundle 找到唯一 Spec、Plan 和 Tasks；

- 所有必需 Task 在勾选前都有对应 Validation 和 Completion 证据；

- 所有正式实验在启动前已有 `runs/<run-id>/record.md`，合格探索在规定边界前补齐；

- 正式实验的非关键文档不占用启动关键路径，启动前后顺序由获批 `criticalPath` 和真实命令/产物证据证明；

- 三类 Index 对相同输入字节级稳定，第二次同步不改变 bytes、file mode 或纳秒 mtime，错误输入不会产生部分更新；

- Framework E2E 连续三次通过业务、用户价值和关键路径合同，普通 `npm test` 不启动 Agent、网络或额外 API；

- 最终由用户决定保留的 Skill 每项至少两个真实项目 accepted case，全部使用当前 Hash、用户批准的业务/用户价值/关键路径合同；

- 活跃入口不写 `hello-scholar/memory/`，迁移只在用户审核 Mapping Proposal 后执行；

- 主 Agent可以直接执行 Tasks，安装结果不存在已淘汰执行/评审包装 Skill；

- TDD 在未显式指定的普通任务中不启动，在显式场景中完整执行 Red-Green-Refactor。

---

# 20\. 最终产品模型

核心开发链保持为：

\[

\\boxed\{

\\text\{Spec\}

\\rightarrow

\\text\{Plan\}

\\rightarrow

\\text\{Tasks\}

\\rightarrow

\\text\{Implementation\}

\\rightarrow

\\text\{Record\}

\\rightarrow

\\text\{Fresh Evidence\}

\}

\]

上式表示需要长期合同的正式路径；Fast Path 为零核心文档。Converge 只在 Bundle 末端或用户明确要求时加入，Architecture 只在用户发起或确认材料性结构变化后加入，它们不再是每次任务的固定节点。`AGENTS Fresh Evidence` 不是持久文档。

文档维护采用独立事务：

```Plain Text
设计事务
    只修改 Spec

计划事务
    只修改 Plan

任务事务
    只修改 Tasks

实验事务
    只修改 Record

架构事务
    只修改 Architecture

索引事务
    由程序生成全部 INDEX
```

最终原则：

> **保留 Spec、Plan、Tasks、Record、Architecture 的清晰职责，但只在任务价值需要时进入对应流程。用整份审核、单文档事务、Revision 检查、自动 Index、延迟同步和非计时关键路径减少无意义流程；受控低风险探索可以先启动并在规定边界前补 Record，正式和高风险实验只让最小可复现 Record 与真实安全门阻塞启动。质量优先，流程为质量服务。**
