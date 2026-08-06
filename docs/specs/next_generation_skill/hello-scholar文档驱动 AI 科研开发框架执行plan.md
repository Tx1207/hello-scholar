# PLAN\-001：hello\-scholar\-2 文档驱动开发框架升级计划

**状态：** Approved
**目标版本：** `0.2.0`
**目标仓库：** `Tx1207/hello-scholar`
**主要运行环境：** Codex CLI
**适用对象：** 使用 Codex、Claude Code 等 AI 编程工具开展 AI 科研、Agent 开发、模型优化和工程实验的个人或小型团队。

---

## 目标

在尽量保留现有 Skill、Prompt、模板、CLI 安装逻辑和测试体系的前提下，将 hello\-scholar\-2 升级为按任务选择强度的文档驱动框架。正式、需要长期合同的实施闭环为：

```Plain Text
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

`Converge` 只在 Bundle 末端或用户明确要求时加入，默认只读；Architecture 只在用户明确要求，或 Bundle 完成且系统结构发生材料性变化时提醒用户确认后更新。它们不是每个任务的固定前后置。`AGENTS Fresh Evidence` 是当前工作树上实际运行并读完的命令输出，不是第六类核心文档，也不生成独立报告。

五类文档职责如下：

这五类文档分别承担设计、实施、执行、实验和当前状态管理。

本次升级还必须建立一套 **Codex Skill 运行时测试体系**：

> 当前 14 个产品 Skill 是候选集合，每项默认先编写至少两个相互独立的真实项目场景；确认修改前或没有该 Skill 时的实际表现，再决定修改、原样保留或淘汰。真实 Red 才打开实现；`control-pass` 必须停下交用户判断。最后由 Eval 主 Agent 委派全新 Implementer subagent 运行被测 Skill，再委派独立 Reviewer subagent 评估生成文件、代码质量、用户表达和流程合理性。

这里的 Implementer/Reviewer 是测试夹具中的隔离角色，不是产品执行链。产品运行时由当前主 Agent 直接读取并逐项执行 `tasks.md`；主 Agent仍可按平台能力临时委派独立工作，但框架不再要求一 Task 一个 subagent，也不提供专门的执行编排 Skill。

---

# 最终交付结果

升级完成后，目标项目中的文件结构为：

```Plain Text
<project-root>/
├── AGENTS.md
├── CLAUDE.md
│
├── hello-scholar/
│   ├── architecture.md
│   │
│   ├── handoffs/
│   │   └── YYYY-MM-DD-<topic>-handoff.md
│   │
│   └── specs/
│       ├── INDEX.md
│       │
│       └── <topic-id>/
│           ├── INDEX.md
│           │
│           └── SPEC-001-<design-name>/
│               ├── spec.md
│               ├── plan.md
│               └── tasks.md
│
├── src/
├── scripts/
├── configs/
├── prompts/
├── tests/
│
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

明确取消中间层：

```Plain Text
hello-scholar/memory/
```

新路径必须直接使用：

```Plain Text
hello-scholar/architecture.md
hello-scholar/handoffs/
hello-scholar/specs/
runs/
```

其中：

- `hello-scholar/` 保存项目设计、当前架构和用户按需创建的会话 Handoff；Handoff 不是五类核心文档，也不进入自动 Index；

- `runs/` 位于项目根目录，保存实验记录和运行产物；

- 卸载 hello\-scholar Skill 时，不得删除用户的 `hello-scholar/specs/`、`hello-scholar/architecture.md`、`hello-scholar/handoffs/` 或 `runs/`；

- 这些目录按需创建，不在安装时强迫空项目生成全部文档。

---

# 实施范围

## 3\.1 包含

本计划包含：

1. Spec Bundle 文件结构。

2. Spec、Plan、Tasks 和 Record 的固定 Front Matter。

3. Spec ID、Topic 和 Revision 管理。

4. 全局 Spec Index、Topic Index 和 Run Index 自动生成。

5. Plan 与 Spec Revision 的一致性检查。

6. Tasks 与 Spec、Plan Revision 的一致性检查。

7. Tasks 完成度自动计算。

8. Brainstorming 输出逻辑升级。

9. Writing Plans 职责收敛。

10. 新增 Generating Tasks。

11. 主 Agent 直接读取并按依赖执行 `tasks.md`。

12. 新增 Converge 一致性检查。

13. Record 路径迁移到项目根目录 `runs/`。

14. 将文件归属、最小变更和验证纪律保留在 AGENTS 与 Task 合同中，不新增 Project Structure Skill。

15. 新增 Architecture 维护能力。

16. 新增文档检查和索引同步 CLI。

17. 新增 Codex Skill 运行时质量与关键路径测试。

18. 旧文档迁移支持。

19. README、AGENTS 和中英文模板同步更新。

## 3\.2 不包含

本计划不包含：

- 外部数据库；

- Web 文档管理界面；

- 完整 YAML Parser；

- 自动替用户批准 Spec；

- 自动决定实验结论；

- 自动语义合并全部旧 Spec；

- 每次普通测试都创建 Record；

- 每次代码提交都更新 Architecture；

- 将 Live Codex Eval 默认放入普通 `npm test`；

- 重写与本次文档模型无关的 Skill。

## 3\.3 已确认的范围调整

- 不新增 `testing-skills` Skill。Skill 评测流程作为测试资产放在 `test/skill-evals/WORKFLOW.md`。

- Live Eval 只使用当前 Codex 会话可用的 subagent 能力。不调用 `codex exec`、不新增外部 API、不将 Live Eval 接入 `npm test`。

- 删除 Brainstorm Visual Companion 整套附属功能，包括 Skill 中的入口、说明、流程图节点、`visual-companion.md` 和专用启停服务器资源。不迁移到新路径，不保留兼容入口。

- 产品执行链收敛为 `Spec -> Plan -> Tasks -> 主 Agent 逐 Task 直接执行 -> AGENTS 新鲜证据门`。`converge-to-spec` 只在 Bundle 末端或用户明确要求时作为默认只读检查加入；Architecture 只在用户发起或确认材料性结构变化后另行更新。不新增单独执行命令或执行 Skill。

- 删除 `executing-plans`、`subagent-driven-development`、`requesting-code-review`、`receiving-code-review`、`dispatching-parallel-agents`、`systematic-debugging`、`finishing-a-development-branch`、`verification-before-completion` 和 `writing-skills`。删除前把仍有价值且未被现有 AGENTS/Task/测试合同覆盖的规则放到唯一的新 owner；不保留别名、shim 或空壳目录。

- 保留 `test-driven-development`，但它只在用户明确指定，或已批准 Task 明确要求 TDD 时启动。普通 Feature、Bugfix、Fast Path 和 Skill 修改都不会仅因任务类型自动加载它；一旦显式启动，完整 Red-Green-Refactor 合同仍然生效。

- 保留 `using-git-worktrees` 的现有隔离检测与创建能力，不作为每个 Task 的强制前置。用户或 Approved Task 已明确要求时直接使用；Agent 因风险建议隔离时，仍按现有 Skill 在创建前征得用户同意。

- 保留 `crash-audit`、`takeoff`、`landing` 为用户明确调用的可选 Skill，不并入主流程。

- 保留 `handoff` Skill，但将新 handoff 的默认写入路径改为 `hello-scholar/handoffs/YYYY-MM-DD-<topic>-handoff.md`。

- 迁移能力只通过 `docs/migration/document-model-v2.md` 提供：AI 先读取说明并生成映射建议，用户审核后才实际迁移。不新增迁移命令、隐式自动迁移或新旧双写。

- Router 只用一句人话说明所选路径和本轮文档范围，然后默认继续；只有路径所需的材料性事实不确定时才问用户。用户可以在最初请求中要求完整流程，Router 会连续推进 `Spec -> Plan -> Tasks -> Implementation`，但不会跳过每份文档的整份审核和实施授权门。

- 只在决定需要长期合同、会改变公共行为/接口/数据或具有材料性风险时进入 Design。Fast Path 的五类核心文档写入为零。

- Brainstorm 仍一次只问一个真正影响决定的问题，但不逐章节索要确认。决定充分后一次提交完整 Spec；Plan 和 Tasks 也分别整份提交审核。

- 14 个 Skill 是进入 Baseline 的候选集合，不是必须凑齐的最终产品数量。`control-pass` 后若用户因明确偏好选择保留某个 Skill，只能把它视为偏好/非回归对象，不能声称 Baseline 已证明增益。

---

# 当前项目基础与复用策略

hello\-scholar\-2 当前定位是将规则和 Skills 轻量安装进已有项目，支持 Codex 和 Claude Code，并通过扫描 `skills/*/*/SKILL.md` 自动发现 Skill。新 Skill 继续放在现有两级目录结构中即可，不需要重写安装器或 Skill 发现协议。\([GitHub](https://github.com/Tx1207/hello-scholar)\)

当前 CLI 只支持：

```Plain Text
help
install codex|claude
uninstall codex|claude
```

因此本次只在现有 CLI 上增加 `docs check` 和 `docs sync`，保留原有安装、卸载、`link` 和 `copy` 接口与所有权保护。唯一升级收口是：重新安装或卸载时清理能够证明由 hello-scholar 拥有的九个 retired Skill target；无法证明所有权的同名目录继续保留。

当前项目使用 CommonJS，没有生产依赖；测试入口同时运行 Node 测试和 Python `unittest`。第一版继续使用 Node 标准库，不增加 YAML 或文档框架依赖。

当前测试目录已经存在 CLI 测试、Skill 静态测试、Record Experiment 质量门和其他场景质量门。新的测试框架应扩展现有 `test/` 目录，而不是另建独立测试系统。\([GitHub](https://github.com/Tx1207/hello-scholar/tree/main/test)\)

---

# 实施原则

## 5\.1 最大限度保留现有 Prompt

每个现有 Skill 按以下方式处理：

```Plain Text
保留已经有效的流程和约束
移动职责放错位置的 Prompt
只修改路径、输入和输出合同
不重新改写整个 Skill
```

这条原则只适用于最终保留的 Skill。用户已经决定淘汰的 Skill 按完整目录删除；它们与 AGENTS、Task 合同或平台原生能力重复的内容不复制到新的包装 Skill 中。

## 5\.2 保持事实源单一

- 保留 Skill 的名称尽量不变；

- `$brainstorming`、`$writing-plans`、`record-experiment`、`handoff`、`test-driven-development` 和 `using-git-worktrees` 继续可用；

- 已淘汰 Skill 不保留旧名称、兼容入口或重定向；

- 新增 `generating-tasks`，不将 Tasks 继续塞在 Plan 中；

- 旧文档只读兼容，不再双写；

- 新流程只写新路径。

## 5\.3 一次只语义维护一类文档

一次操作只负责一类核心文档：

自动生成的 `INDEX.md` 不算人工语义修改。

创建 Successor Spec 时，经用户确认后同时维护新旧两份 `spec.md` 的替代关系，是“同一类核心文档”的唯一显式例外；它不能扩展为同步 Plan、Tasks 或 Architecture。

## 5\.4 延迟同步

Spec 修改后不自动重写 Plan；Plan 修改后不自动重写 Tasks。

同步状态由程序计算：


$\operatorname{PlanCurrent}
\iff
\operatorname{Plan.spec_revision}
=
\operatorname{Spec.revision}$


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

不一致时显示：

```Plain Text
Plan: Stale
Tasks: Stale
```

只有继续实施时，才分别同步 Plan 和 Tasks。

## 5\.5 简单任务不进入文档流程

以下任务不创建 Spec、Plan、Tasks 或 Record：

- 局部 Bug；

- 文案修改；

- 格式调整；

- 单个测试补充；

- 不改变行为的内部重构；

- 临时调试。

流程仅为：

```Plain Text
Code
→ Test
→ Git
```

---

# 文档模型

## 6\.1 Spec Bundle

同一个设计集中在一个目录：

```Plain Text
hello-scholar/specs/<topic-id>/
└── SPEC-001-<design-name>/
    ├── spec.md
    ├── plan.md
    └── tasks.md
```

不再分别使用全局：

```Plain Text
plans/
tasks/
```

这样用户找到 Spec 时，可以直接找到对应 Plan 和 Tasks。相关文件集中存放也是本框架的核心需求。

---

## 6\.2 Spec Front Matter

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

允许的 `type`：

```Plain Text
research
prototype
capability
system-design
```

允许的 `status`：

```Plain Text
draft
accepted
completed
rejected
withdrawn
superseded
```

Spec 正文固定保留七个核心章节，并把用户价值和当前决定放在最前：

1. `价值与当前决定`；
2. `问题与当前事实`；
3. `目标与非目标`；
4. `目标设计`；
5. `接口、数据与不变量`；
6. `实施边界`；
7. `验收与验证`。

只有确有内容时才增加 `候选方案与权衡`、`迁移与清理`、`回滚`、`证据`、`未决问题` 或 `Revision History`。条件章节不是待填空模板；没有材料性内容时不生成空标题。原 Brainstorm 中模块、数据流、错误处理、测试和范围约束的有效内容继续落入对应章节，不因收窄模板而删除。

---

## 6\.3 Plan Front Matter

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

允许的状态：

```Plain Text
draft
approved
completed
cancelled
```

`Stale` 不写入状态，由程序计算。

---

## 6\.4 Tasks Front Matter

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

允许的整体状态：

```Plain Text
pending
in-progress
completed
cancelled
```

`approval` 独立表示 Task 合同是否经过用户审核，只允许：

```Plain Text
pending-review
approved
```

新建或发生语义修改时，`revision` 加一，`approval` 重置为 `pending-review`，`approved_revision` 重置为 `null`。只有用户明确批准当前 Revision 后，才能写 `approval: approved` 和对应 `approved_revision`。`status` 只表示执行进度，不能替代合同批准，也不能把“合同已批准”解释为本轮实施授权。

单个 Task 使用 Markdown 复选框。

---

## 6\.5 Record Front Matter

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

实验优先时允许暂时使用：

```YAML
spec: null
spec_revision: null
plan_revision: null
```

---

## 6\.6 Architecture Front Matter

```YAML
---
schema: 1
kind: architecture
status: current
applies_to: main
updated: 2026-08-03
---
```

Architecture 只描述当前已实现系统，不描述 Draft、失败实验和未合并 Prototype。

---

# 自动生成文件

以下文件不得由 AI 或用户手工编辑：

```Plain Text
hello-scholar/specs/INDEX.md
hello-scholar/specs/<topic-id>/INDEX.md
runs/INDEX.md
```

顶部统一包含：

```Markdown
<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->
```

## 7\.1 Spec Index

从所有 `spec.md`、`plan.md` 和 `tasks.md` 提取：

```Plain Text
Topic | Spec | Type | Spec Status | Revision | Plan | Tasks | Completion | Summary
```

## 7\.2 Topic Index

只显示当前 Topic 下的 Spec 和关联状态。

```Plain Text
Spec | Type | Spec Status | Revision | Plan | Tasks | Completion | Summary | Relations
```

## 7\.3 Run Index

从根目录 `runs/**/record.md` 提取：

```Plain Text
Run | Status | Spec | Spec Revision | Decision | Summary | Record
```

Index 合同：

- `Plan` 和 `Tasks` 只显示程序计算的 `Missing`、`Current` 或 `Stale`；

- `Completion` 使用 `completed/total (percent%)`，缺少 `tasks.md` 时显示 `-`；

- Spec、Plan、Tasks 和 Record 路径必须是从当前 Index 文件出发的相对 Markdown 链接，不写绝对路径；

- 全局 Spec Index 按 `topic` 升序，再按 Spec ID 的数字部分升序；Topic Index 按 Spec ID 数字部分升序；Run Index 按 `started` 降序，相同时间再按 `run_id` 降序；

- 生成结果使用 LF、固定列顺序和文件末尾换行，相同输入必须产生字节级相同输出。

## 7\.4 原子生成

同步过程必须：

1. 扫描所有源文档；

2. 解析 Front Matter；

3. 验证关系；

4. 在内存中生成全部 Index；

5. 写入临时文件；

6. 计算需要新建、替换和删除的完整 Index 批次；孤儿 Index 只有在首行 generated marker、目标与全部父节点都是普通节点、且当前扫描能证明对应源目录或源文档已经消失时才能进入删除集合；

7. 全部成功后替换正式文件并删除已证明 ownership 的孤儿 Index；

8. 任一错误时回滚本批次的全部新建、替换和删除，保持原 Index 集合不变。

手写 Index、marker 损坏的 Index、symlink/junction Index 或来源无法证明的旧文件一律保留并报错，不能用文件名猜 ownership。

---

# 现有 Skill 升级方案

## 8\.1 `using-helloscholar`

当前 Router 要求只要存在极低可能性就调用 Skill，并倾向所有任务都进入流程。升级后应增加明确路由，避免简单任务被完整工作流拖慢。当前规则确实要求在任何响应前检查 Skill，并以“1% 可能性”为强制触发标准。

新路由：

```Plain Text
Fast Path
    简单 Bug、文案、局部测试、格式调整

Design Path
    新设计、行为变化、接口变化、模块变化

Execution Path
    已有 Spec / Plan / Tasks

Experiment Path
    正式实验、Benchmark、Eval、训练

Maintenance Path
    Index、Architecture、迁移、恢复
```

Router 的用户可见输出只需一句：`本次走 <Path>；本轮会创建/修改 <文档范围或“零核心文档”>。` 说完即继续，不把路由说明变成新的确认门。只有缺失事实会材料性改变路径、写入范围或风险时才逐个询问；不确定但影响轻微时按项目事实选择最小路径。用户说“走完整流程”时，表示可以在同一 Goal 内继续推进后续阶段，不表示预先批准尚未生成的 Spec、Plan、Tasks 或代码实施。

保留：

- 用户指令优先；

- Skill 必须按当前内容读取；

- Process Skill 优先于实现 Skill；

- 子 Agent 跳过 Router。

修改：

- 删除“所有简单问题都必须进入 Brainstorm”的隐含路由；

- 只有设计问题才进入 Brainstorm；

- 普通明确 Bug 由主 Agent 按 AGENTS 的定位、最小修复和验证规则直接处理；只有用户或已批准 Task 明确点名时才调用 `test-driven-development`；

- 当前已有完整 Spec 时，不重复 Brainstorm。

---

## 8\.2 `brainstorming`

当前 Brainstorming 已具备项目探索、一次一个问题、2–3 个方案、用户批准、架构和数据流设计、自审等高价值主流程；这些全部保留。需要修改的是日期命名 Spec 路径和强制进入 Writing Plans 的终止规则。Visual Companion 是可选浏览器附属功能，不属于本次要保留的 Brainstorm 主流程。

### 保留

- 读取项目上下文；

- 一次一个问题；

- 2–3 个方案；

- 推荐方案和权衡；

- 一次只问一个会改变设计的材料性问题；

- 完整 Spec 的一次整份批准门；

- Spec 自审；

- 不写代码；

- 避免无关重构；

- 设计模块、接口、数据流、错误处理和测试。

Brainstorm 不为了填模板而询问已经能从代码、已有文档或用户请求确定的事实。信息足够后，先把用户价值、推荐决定与关键权衡写在完整 Spec 前部，再一次提交整份文档审核；不逐章节等待“继续”。如果身份属于 `Need Human Classification` 或仍有真正改变方案的未知项，明确说明不确定性并向用户询问。

### 修改

旧输出：

```Plain Text
hello-scholar/memory/specs/YYYY-MM-DD-<topic>-design.md
```

新输出：

```Plain Text
hello-scholar/specs/<topic-id>/
└── SPEC-NNN-<design-name>/
    └── spec.md
```

写入前必须先调用 `manage-specs`，判断：

```Plain Text
Update Existing Spec
Create Independent Spec
Create Successor Spec
Need Human Classification
```

批准后路由：

```Plain Text
只需现有代码运行实验
    → record-experiment

需要代码实现
    → writing-plans

只完成设计
    → 结束
```

### 删除

- 从中英文 `SKILL.md` 的 Checklist、流程图和正文中删除 Visual Companion 入口；

- 删除 `visual-companion.md`；

- 删除仅服务于 Visual Companion 的 `scripts/frame-template.html`、`scripts/helper.js`、`scripts/server.cjs`、`scripts/start-server.sh` 和 `scripts/stop-server.sh`；

- 不创建 `hello-scholar/brainstorm/visual/`，不保留启停脚本、路径别名或兼容说明。

---

## 8\.3 `writing-plans`

当前 Writing Plans 同时包含高层实施方案和极细 Tasks：文件结构、2–5 分钟步骤、测试代码、实现代码、命令和 Commit。升级时保留高层 Plan 能力，将任务级内容移动到 `generating-tasks`。

### 保留

- Source\-of\-Truth Gate；

- Spec 优先；

- Scope Boundary；

- 文件结构；

- 模块边界；

- 受影响文件；

- 接口变化；

- 迁移；

- 测试策略；

- 清理；

- 回滚；

- Plan 自审。

### 移出

移动到 `generating-tasks`：

- 2–5 分钟动作；

- 逐步骤代码；

- 测试代码；

- 精确命令和预期输出；

- Task 复选框；

- 每步 Commit；

- Task 级 Spec Coverage；

- No Placeholders。

### 新输出

```Plain Text
<spec-bundle>/plan.md
```

Plan 沿用原 Skill 已有效的 Source-of-Truth、范围、文件、接口、迁移、测试、清理和回滚内容；不为了新格式重写这些流程。形成完整草稿后一次提交整份 Plan 审核，不逐节确认。材料性设计缺口只问一个问题并回到 Spec，普通实现细节由项目事实和现有模式决定。

---

## 8\.4 新增 `generating-tasks`

目录：

```Plain Text
skills/superpowers-skills/generating-tasks/
├── SKILL.md
├── SKILL.zh_CN.md
└── assets/
    ├── tasks-template.md
    └── tasks-template.zh_CN.md
```

职责：

- 读取 Approved Plan；

- 校验 Plan 与 Spec Revision；

- 将 Plan 拆成 Tasks；

- 生成精确路径；

- 定义依赖和并行关系；

- 映射 Spec Acceptance Criteria；

- 定义每个 Task 的 Validation；

- 不重新做架构设计。

Tasks 沿用原 Skill 对精确路径、验证命令、依赖、完成条件和禁止占位内容的有效要求。所有 Task 生成完成后一次提交整份 `tasks.md` 审核；审核前不开始代码实施，批准 Tasks 也不自动等于本轮实施授权。

任务格式：

```Markdown
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
  - 释放后的 Block 可以再次分配。

  Completion:
  - 实现完成；
  - 验证通过；
  - 未修改禁止范围。
```

---

## 8\.5 主 Agent 直接执行 Tasks

不新增执行 Skill，也不保留 `executing-plans` 或 `subagent-driven-development`。当用户批准 `tasks.md` 并要求实施时，当前主 Agent 直接承担 Controller 和 Implementer 职责。

读取顺序：

```Plain Text
hello-scholar/architecture.md
→ spec.md
→ plan.md
→ tasks.md
→ 相关代码和测试
```

执行前必须通过：

```Plain Text
Plan Current
Tasks Current
```

如果 Stale，立即停止。

---

主 Agent 必须：

1. 先核对 Spec Accepted、Plan Approved、Plan/Tasks Current；

2. 按依赖顺序读取一个完整 Task，只修改该 Task 的文件边界；

3. 执行 Task 指定的 Validation，核对 Completion 和真实 diff 后再勾选；

4. 遇到设计缺失回到 Spec，遇到实施方案失效回到 Plan，不在执行中默默重设计；

5. 所有必需 Task 完成后先按 AGENTS 的通用验证规则取得并读完当前、完整的命令证据。只有用户明确要求，或当前 Bundle 已到末端时才运行 `converge-to-spec`；它默认只读并报告偏差。若完成的 Bundle 造成系统结构、关键模块职责、公共运行流程或持久位置发生材料性变化，提醒用户是否更新 Architecture；用户确认后再提交语义更新。没有材料性架构变化时，不把 Architecture 当成完成门。

主 Agent 可以在任务真正独立且平台允许时临时使用 subagent，也可以请求一次只读审查，但这是通用工具选择，不是产品合同、强制双审查或新的 Skill 依赖。Skill Eval 中的 Implementer/Reviewer 仍按第 10 节保持隔离。

---

## 8\.6 淘汰重复的执行、评审和流程包装 Skill

完整删除：

```Plain Text
executing-plans
subagent-driven-development
requesting-code-review
receiving-code-review
dispatching-parallel-agents
systematic-debugging
finishing-a-development-branch
verification-before-completion
writing-skills
```

删除后的职责承接：

| 原能力 | 新 owner |
|---|---|
| 读取计划、顺序执行、阻塞时停止 | `tasks.md` 合同 + 主 Agent + AGENTS Goal-Driven Execution |
| 每 Task 独立上下文和 Review | 主 Agent 按需使用平台 subagent/review；框架不强制 |
| 收发 Review 的技术判断 | AGENTS Read/Think/Verification/Communication；用户仍可直接要求 review |
| 并行 Agent 判断 | 平台原生能力，由主 Agent根据依赖和文件冲突决定 |
| 根因定位 | AGENTS Debugging |
| 分支合并、PR、清理菜单 | 用户明确要求时由主 Agent使用 Git/平台工具执行 |
| 新鲜完成证据 | AGENTS Verification 与 Goal-Driven Execution |
| Skill 编写 | 已批准 Task + 显式读取 `/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md` 与同目录 `GLOSSARY.md` |
| Skill 评测 | 用户先批准 Scenario/rubric + `test/skill-evals/WORKFLOW.md` + 当前 Codex subagent |

每个 Skill 单独删除并配套引用扫描，便于审核和回滚。最终安装清单和静态测试必须证明这些目录与活跃引用都不存在。

现有安装器只遍历当前仍可发现的 Skill，无法自然清理已删除源目录对应的旧 copy/link target。T051 在不恢复 retired Skill、不增加别名的前提下，用精确旧名称、copy ownership marker 和 link 目标路径清理受管安装；用户同名目录和项目文档不得删除。

---

## 8\.7 `record-experiment`

现有 Skill 的实验身份、命令、配置、Git 状态、失败记录和结论规则全部保留。

路径修改为：

```Plain Text
<project-root>/runs/<run-id>/record.md
```

产物：

```Plain Text
<project-root>/runs/<run-id>/outputs/
<project-root>/runs/<run-id>/results/
<project-root>/runs/<run-id>/logs/
<project-root>/runs/<run-id>/checkpoints/
```

禁止：

```Plain Text
hello-scholar/runs/
hello-scholar/memory/runs/
```

一个 Run 只能有：

```Plain Text
record.md
```

不得再创建：

```Plain Text
run.json
README.md
report.md
summary.md
final-report.md
```

记录时机的最终合同：

- 正式、昂贵、长时间、不可逆、生产数据相关或用于 Spec 正式验收的实验，必须在启动前创建最小可复现 `record.md`；

- 低风险、隔离且可丢弃的探索实验允许先启动，但必须在关闭会话、形成结论、编写依赖结果的 Spec、启动依赖实验、合并代码或对外分享结论前补齐 Record；

- 运行期间只在状态、路径或关键证据发生实质变化时记录，不做高频轮询式写入；

- 运行结束、失败、中断或放弃后，一次补齐结果、结论和下一步；

- 最小可复现 Record 只让 Run 身份、目的/假设、精确命令/CWD、输入/关键配置/Seed/Git、产物路径、预期/失败信号、停止条件和时间/成本上限进入启动关键路径；背景润色、观察、结论和决定不先阻塞进程；

- 长时间实验启动后，Agent 可以在等待期间补不改变输入和判断标准的 provenance、背景及证据位置；不可逆或生产级运行的真实安全审批仍必须在启动前完成；

- 中英文 Skill、模板、字段说明和测试使用同一合同。当前未完成的 `record-experiment` 修改只视为中间状态，不作为最终行为依据。

---

## 8\.8 新增 `manage-specs`

职责：

1. 扫描 Spec Index；

2. 搜索同 Topic 设计；

3. 判断修改原 Spec 或新建 Spec；

4. 分配唯一 Spec ID；

5. 更新 Revision；

6. 维护替代关系；

7. 运行文档检查；

8. 调用 Index 同步。

它不能自行批准新 Spec。

---

## 8\.9 保留并收窄 `test-driven-development`

当前 Skill 的 Red-Green-Refactor、正确失败原因、最小 Green、保持全绿和测试反模式规则全部保留。只改变触发合同：

- 用户明确调用 `$test-driven-development` 时使用；

- 已批准 `tasks.md` 的当前 Task 明确要求 TDD 时使用；

- 普通 Feature、Bugfix、重构或 Skill 修改不会自动触发；

- Router Fast Path 不自动路由到 TDD；

- 一旦调用，不能把 Red-Green-Refactor 降级为“实现后补测试”。

文件放置继续由现有项目结构、Architecture、Plan/Task 文件边界和 AGENTS 规则共同决定，不新增 `project-structure` Skill。

---

## 8\.10 新增 `converge-to-spec`

检查四类偏差：

```Plain Text
Missing
Partial
Contradictory
Unrequested
```

同时检查：

- Plan 和 Tasks 是否 Current；

- Plan 文件范围；

- Tasks 完成情况；

- 每个 Task 的 Validation/Completion 是否有可审查证据；

- Spec 要求的正式 Benchmark、Eval 和 Record 是否存在；

- 未选择的方案；

- 旧实现；

- 旧配置；

- 旧测试；

- 旧 Feature Flag；

- 兼容层；

- 未使用依赖；

- 未使用文件。

只在两种情况下运行：用户明确要求；或一个 Bundle 的必需 Tasks 和验证已经完成，需要做末端一致性检查。默认只报告，不修改代码、文档或 Task 状态。

需要修复时，先把偏差和建议动作交给用户。只有用户批准更新当前 Tasks Revision 后，才在 `tasks.md` 中追加 Convergence Tasks；Converge 自己不写入。

Converge 负责判断 Bundle 是否达到 `Convergence Ready`，不替代 AGENTS 的新鲜命令证据，也不要求提前写 Architecture。`Architecture Synced` 仅在用户要求更新，或用户确认本次材料性结构变化需要更新时才进入闭环；其他 Bundle 以 `Convergence Ready + AGENTS Fresh Evidence` 完成，不制造无变化的 Architecture 写入。

---

## 8\.11 新增 `docs-maintenance`

提供：

```Plain Text
check
index
architecture
recover
```

### `check`

只检查，不写文件。

### `index`

运行确定性索引生成。

### `architecture`

只修改：

```Plain Text
hello-scholar/architecture.md
```

该模式只在用户明确要求时执行；或一个 Bundle 完成且代码证据显示系统结构发生材料性变化时，由 Agent 先提醒用户并等待确认。普通 Task、Commit、Run、无行为重构和无结构变化的 Bundle 不自动进入该模式。

### `recover`

重建 Index，发现孤立文档和 Stale 关系，生成 Architecture 恢复草稿，但不覆盖正式文件。

---

## 8\.12 支撑型 Skill 的路径收口

### `handoff`

保留对话交接能力、中英文模板选择、去重和脱敏规则。新默认路径为：

```Plain Text
hello-scholar/handoffs/YYYY-MM-DD-<topic>-handoff.md
```

Handoff 不是 Spec Bundle 的组成部分，不进入 Spec Index，也不创建新的 Index。

## 8\.13 其他保留 Skill

- `using-git-worktrees`：保留现有隔离检测、用户同意门、原生工具优先和 Git fallback，只收窄宽泛的 Plan 自动前置入口。用户或已批准 Task 点名时调用；风险确实需要隔离时可以建议，但创建前仍先征得同意。该 Skill 不声称负责清理；用户明确要求清理时，主 Agent按真实 Worktree provenance、Git 状态和破坏性操作规则处理。

- `crash-audit`：保留为用户明确要求时的盲点检查。

- `takeoff`、`landing`：保留为用户明确要求时的目标放大和可行性收敛工具。Takeoff 删除宽泛主动触发，Landing 删除 Takeoff 后自动承接；两者都不自动并入 Brainstorm/Plan。

---

# 源码升级

## 9\.1 新增模块

```Plain Text
src/frontmatter.js
src/document-discovery.js
src/document-validation.js
src/index-generator.js
src/docs.js
```

### `frontmatter.js`

解析受限 YAML：

- 字符串；

- 整数；

- 布尔值；

- `null`；

- 单行数组；

- LF 和 CRLF。

不支持：

- 嵌套对象；

- 多行 YAML；

- Anchor；

- 自定义 Tag。

### `document-discovery.js`

扫描：

```Plain Text
hello-scholar/specs/**/spec.md
hello-scholar/specs/**/plan.md
hello-scholar/specs/**/tasks.md
hello-scholar/architecture.md
runs/**/record.md
```

不得递归扫描：

```Plain Text
runs/**/outputs/
runs/**/results/
runs/**/logs/
runs/**/checkpoints/
```

核心文档、三类 Index 以及从项目根目录到这些目标的每一级父目录都必须是普通文件或普通目录。发现 symlink/junction 时，即使它最终仍指向项目内，也要报告错误且不读取或写入目标。已经明确剪枝的 Run 产物目录 `outputs/`、`results/`、`logs/`、`checkpoints/` 不属于核心文档父路径，可以链接到外部存储；扫描器只识别名称并立即剪枝，不能跟随。

### `document-validation.js`

校验：

- Spec ID 唯一；

- Topic 与目录一致；

- Revision 合法；

- Plan 引用存在；

- Tasks 引用存在；

- Plan Stale；

- Tasks Stale；

- Record 引用；

- 替代关系；

- 一个 Run 只有一个 Record；

- 根目录 `runs/` 位置；

- Tasks 完成度。

### `index-generator.js`

生成三个 Index。

### `docs.js`

提供 `check` 和 `sync`。

---

## 9\.2 CLI 修改

新增：

```Bash
hello-scholar docs check
hello-scholar docs sync
```

帮助：

```Plain Text
Usage:
  hello-scholar help
  hello-scholar install codex|claude [--mode link|copy]
  hello-scholar uninstall codex|claude
  hello-scholar docs check
  hello-scholar docs sync
```

不改变原有安装和卸载接口。

---

## 9\.3 Package Scripts

新增：

```JSON
{
  "scripts": {
    "test": "node test/run-all.js",
    "test:js": "node --test test/test_*.js",
    "test:py": "python3 -m unittest discover -s test",
    "docs:check": "node bin/hello-scholar.js docs check",
    "docs:sync": "node bin/hello-scholar.js docs sync"
  }
}
```

---

# Codex Skill 运行时测试

当前可用的真实运行面是 Codex 会话内的 subagent，没有可依赖的额外 API。因此本测试体系分为两层：

- 当前 Codex 主 Agent 按 `test/skill-evals/WORKFLOW.md` 手动编排真实 subagent Live Eval；

- `npm test` 只校验场景、Protocol、Baseline、Scorecard、Hash 和本地确定性行为，不启动 Codex，不调用外部 API。

当前 14 个候选产品 Skill 全部进入运行时测试清单。每个 Skill 默认至少两个相互独立的真实项目场景；高风险或多分支 Skill 可以增加，不能用一个场景或关键词静态检查代替。Baseline 后的最终保留数量允许减少。九个已决定淘汰的 Skill 只做删除与回归守卫。

当前 subagent 对外部临时项目中的 Skill 不保证名称发现。评测因此明确区分：

- `activation-probe`：只有平台能观察 catalog 时才测试名称/description 触发；
- `instruction-eval`：Eval 主 Agent把临时副本的绝对 `SKILL.md` 路径和 Hash 交给 subagent，验证实际指令行为，不冒充自动激活证据。

## 10\.1 强制开发顺序

每个新增或修改的 Skill，以及每个保留 Skill 的运行时验收，必须按以下顺序进行：

```Plain Text
Two or More Real-project Scenarios
→ Protocol
→ User Reviews Scenario and Quality Rubric
→ Red Baseline
→ Read writing-great-skills and Target Skill
→ Skill Implementation
→ Current-session Codex Subagent Execution
→ Deterministic Validation
→ Independent Review
→ Quality Score
→ Critical-path Review
→ User Acceptance
```

写入或编辑任何生产 Skill 前，实施者必须完整读取：

```Plain Text
/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md
/xsb/hello-scholar/.agents/skills/writing-great-skills/GLOSSARY.md
```

`.agents/` 被当前仓库忽略，不会自动出现在后续新 Worktree。实施者即使位于隔离 Worktree，也必须从上述原 checkout 绝对路径读取这两份文件；任一文件缺失时停止 Skill 编写并报告，不能改读待淘汰的 `writing-skills` 或凭记忆补规则。

随后针对目标 Skill 明确：调用类型与分支、description 的实际触发价值、信息层级/context pointer、每步可检查完成条件、需要保留的原行为，以及要删除的 duplication、sediment、sprawl、no-op 和负向 steering。这个 authoring gate 不新增产品 Skill，也不替代每个 Task 对原 Skill 的具体比较。

## 10\.2 场景文件

```Plain Text
# Proposal 阶段
test/skill-evals/<scenario-id>/
├── scenario.md
├── protocol.json
├── proposal-approval.json
└── fixture/

# 用户批准当前 Proposal/Hash 并真实运行 Baseline 后，在同一目录增加
baseline.json
evidence/baseline/

# 实现后真实运行 Live Eval，才在同一目录增加
scorecard.json
evidence/live/
```

Proposal 阶段没有 Baseline、Scorecard 或 evidence 是合法状态，不创建占位 JSON。Framework E2E v2 的第 2/3 次 Scorecard 使用 T047 明确的具名文件和独立 evidence 目录；普通产品 case 仍只有一份标准 `scorecard.json`。

### `scenario.md`

必须是完整、可执行、接近真实项目的调用例子，至少包括：

- 项目背景；

- 初始目录；

- 用户目标；

- 必须调用的 Skill；

- Eval 编排所需的 Implementer/Reviewer subagent；

- 允许修改范围；

- 禁止修改范围；

- 预期文件；

- 禁止文件；

- 必须执行的验证命令；

- 质量要求；

- runner 的资源停止条件；它只保护运行，不是 Skill 质量门。

同一产品 Skill 默认至少有两个不同真实项目。Fixture 必须具有项目规则、Git 状态、可运行代码/测试和会改变 Skill 判断的真实文件；空目录、纯关键词、把标准答案直接写进用户 Prompt 或只检查文本命中都不算真实项目场景。项目规则可以公开真实事实和 Accepted 外部合同，但不能为了 Eval 直接给出目标 Skill 分支、标准分类、未来回复或用户可读答案；项目测试只检查公开的可观察合同，rubric 和 hard rejects 保持 evaluator-only。

### `protocol.json`

示例：

```JSON
{
  "protocolVersion": 3,
  "scenarioId": "manage-specs-existing-design",
  "projectId": "sample-retrieval-service",
  "primarySkill": "manage-specs",
  "caseId": "existing-design",
  "countsTowardProductSkill": true,
  "targetSkills": ["manage-specs"],
  "skillSources": {
    "manage-specs": "skills/hello-scholar/manage-specs"
  },
  "skillExpectations": {
    "manage-specs": {
      "baselineLoad": "absent",
      "liveLoad": "current-explicit-file",
      "branch": "enter"
    }
  },
  "activationProbe": {
    "observable": false
  },
  "instructionEval": {
    "claimsAutomaticActivation": false
  },
  "promptProjection": {
    "rawScenarioVisibleToImplementer": false,
    "rawProtocolVisibleToImplementer": false,
    "futureRoundsVisibleToImplementer": false
  },
  "agents": {
    "implementers": 1,
    "reviewers": 1,
    "model": "claude-sonnet-5",
    "forkTurns": "none"
  },
  "fixture": {
    "baseCommitRule": "copy fixture, run initial checks, initialize Git, commit all Fixture files, verify a clean tree, and record the Base commit",
    "evidenceStates": [
      "committed",
      "index",
      "working-tree",
      "untracked",
      "final-hashes"
    ]
  },
  "rubric": {
    "dimensions": [
      {
        "id": "spec-identity-decision",
        "weight": 100,
        "critical": true,
        "minimum": 90,
        "criterion": "Use current project evidence to choose the correct Spec identity path without writing or implementing before the required approval."
      }
    ],
    "minimumTotal": 90,
    "hardRejects": [
      "creates or edits a Spec before the required user approval",
      "reads evaluator-only files or modifies implementation code"
    ],
    "scoreAnchors": {
      "0": "A material requirement is missing, contradicted, out of scope, or unsupported by saved evidence.",
      "90": "All material requirements pass; only a minor presentation or organization issue remains.",
      "100": "Every observable requirement has direct evidence and no defect."
    }
  },
  "userValueRubric": {
    "path": "test/skill-evals/user-value-rubric.json",
    "sha256": "<user-approved-current-sha256>"
  },
  "criticalPath": "Read the current owner facts and produce the first reviewable result without an avoidable stop.",
  "commands": [
    "node <hello-scholar-repo>/bin/hello-scholar.js docs check"
  ],
  "paths": {
    "allow": ["hello-scholar/specs/"],
    "deny": ["src/", "test/"]
  },
  "artifacts": {
    "expected": ["hello-scholar/specs/<topic>/<spec>/spec.md"],
    "forbidden": ["src/", "hello-scholar/memory/"]
  },
  "interaction": {
    "firstPromptIncludesFutureReplies": false,
    "rounds": [
      {
        "sender": "user",
        "stopCondition": "the original request is delivered",
        "contentRole": "current-request",
        "messageSource": "scenario.original-user-request"
      }
    ]
  }
}
```

上例只说明字段结构，不代表任何当前 Proposal，也不提供可沿用的 Hash、场景内容或关键路径决定。实际值必须来自当前 case，并由用户批准当前 Scenario、Protocol、Fixture 和共享 rubric Hash。

`projectId` 表示真实项目身份，不是场景别名。同一产品 Skill 的发布计数必须覆盖至少两个不同 `projectId`；复制同一个 Fixture、只改请求或给副本换 ID 仍算同一项目。静态校验负责拒绝重复 `projectId`，用户批准 Proposal 和最终证据审核负责确认两个项目在代码、测试、规则和影响判断的状态上确实不同。

Protocol 的质量维度、criterion、权重、`0 / 90 / 100` 评分锚点、硬否决项和 `criticalPath` 只是 Proposal。Eval 主 Agent必须先把同一 Skill 的场景与 rubric 作为一个批次咨询用户；只有用户明确批准 Proposal ID、当前 Scenario/Protocol/Fixture Hash、共享 rubric Hash 和关键路径合同后，才能启动任何 Baseline/Live Agent、写运行证据、派发 Reviewer 或进行语义评分。任何语义变化都生成新 Proposal 并重新咨询，AI 不能自行写入 approved。

每个 Protocol v3 还绑定 `test/skill-evals/user-value-rubric.json` 的当前 Hash。场景业务 rubric 与共享用户价值 rubric 分开评分；后者固定检查 value visibility、audience fit、information design、actionability 和 signal-to-noise。任一维度低于 90 都不能靠另一组高分补回。Protocol v1 历史证据不回填新字段。

---

## 10\.3 Red Baseline

Skill 实现前，必须按 Protocol 的 `baselineLoad: absent | pre-change-explicit-file`，在目标 Skill 有意不存在或使用修改前不可变副本时运行对照。`liveLoad` 固定为 `current-explicit-file`，只在实现后的 Live Eval 使用。

运行 Red 前必须先通过环境预检：Fixture 初始测试、Git、Node、目标 Skill 文件、场景依赖、Sonnet，以及源码仓库的 `node <hello-scholar-repo>/bin/hello-scholar.js` 入口均可用。Loader、PATH、权限、Sonnet 不可用或 Fixture 语法失败是环境阻塞，不是 Skill Red；必须停止并报告，不能静默回退到 Terra、Opus 或其他模型。

预期至少出现一个与目标 Skill 缺失或旧行为直接相关的失败：

- 没有调用目标 Skill；

- 创建错误文件；

- 生成重复 Spec；

- 结构不正确；

- 验证失败；

- 得分低于门槛。

如果没有目标 Skill 也能满足全部行为硬门、业务评分、用户价值评分和关键路径合同，必须保存诚实的 `control-pass`，暂停该 Skill 的后续验收并把证据交给用户重新判断独立价值。不得伪造 Red 或为了失败人为加入无关难度；`control-pass` 不计入产品 Skill 的两个 accepted case，也不能进入发布门。若用户因明确偏好决定继续保留，只能运行当前 Skill 的 retention/non-regression Eval 或把决定延后到 Baseline 批次审核；没有新的对照证据时不得声称 Skill 带来增益。

新 Skill 的 Baseline 在目标 Skill 不存在时运行；重大修改 Skill 的 Baseline 使用修改前版本运行。`baseline.json` 必须记录场景 Hash、被测 Skill 版本或“不存在”、执行时间、实际失败点和原始证据位置。

建议使用独立 Commit：

```Plain Text
Commit A
    Scenario + Protocol + Red Baseline

Commit B
    Skill Implementation
```

---

## 10\.4 运行方式

运行者必须完整读取 `test/skill-evals/WORKFLOW.md`，然后在当前 Codex 会话内：

1. 从 `fixture/` 创建一个隔离的临时 Git 工作区；

2. 按当前运行阶段准备 Skill snapshot：Baseline 遵循每项 `baselineLoad`，Live 遵循固定的 `liveLoad: current-explicit-file`；显式副本解析绝对 `SKILL.md` 路径与 Hash，`absent` 只允许出现在 Baseline。CLI 使用当前源码仓库的绝对 `node .../bin/hello-scholar.js` 入口，不依赖全局命令；

3. 用 dispatch selector `model: "sonnet"`、`fork_turns: "none"` 创建全新 Implementer subagent，只给临时工作目录、当前轮逐字消息、项目规则、读取禁区、Skill 绝对路径/Hash 和 runner 资源停止条件；完整 Scenario/Protocol、rubric、hard rejects、Expected artifacts 与未来回复保持 evaluator-only。该 Implementer 代表被测产品中的主 Agent，直接执行 Tasks，不继承当前对话或嵌套每 Task 实现 subagent；runner 停止条件只表示运行是否完成，不参与 Skill 质量评分；持久化 Protocol、Baseline 和 Scorecard 记录 canonical `claude-sonnet-5`，而不记录 selector；

4. 主 Agent 检查实际 diff、文件位置和验证命令，不直接信任 Implementer 的完成声明；

5. 用 dispatch selector `model: "sonnet"`、`fork_turns: "none"` 委派不同 Reviewer，在运行后给它用户已批准 rubric、Scenario、Protocol、完整实际交互、diff、产物和验证证据，不给实现思路或主 Agent 疑点；Reviewer 的 Agent ID 必须不同于 Implementer；

6. 记录 Implementer/Reviewer 的 Agent ID、canonical `claude-sonnet-5` 模型、评审结论，以及必要的 runner 诊断；每条 v3 命令按 Protocol 的数量与顺序保存原模板、只替换 `<...>` 占位符后的真实命令、退出码和证据，每轮交互保存获批消息 Hash、实际 Prompt Hash、停点顺序和 Prompt 隔离证据，再生成 `scorecard.json`；

7. 需要审批回复的场景必须把逐字消息写入 Protocol 并受 Hash 约束；Eval 主 Agent到真实停点后才按回合使用 `followup_task`，不能在第一轮 Prompt 中提前给出未来回复；

8. 将 Reviewer 建议和证据摘要交给用户，只有用户明确接受后 Scorecard 才能进入 `accepted`；随后删除临时工作区，但保留已脱敏证据。

禁止为此新增 `codex exec` Runner、API Client、隐式网络调用或 `skills/**/testing-skills/`。

---

## 10\.5 质量门

### 硬门槛

必须全部通过：

- 每个 `skillExpectations` 的 Baseline/Live 加载状态分别与 `baselineLoad`、`liveLoad` 一致，显式文件模式只证明指令行为，不伪造平台调用遥测；

- 每个目标 Skill 的实际业务分支与 `branch: enter | exit | optional` 一致；文件被读取不自动等于进入该 Skill；

- Implementer 子 Agent 被创建；

- Reviewer 子 Agent 被创建；

- 预期文件存在；

- 禁止文件不存在；

- 文件位置正确；

- 验证命令退出码为 `0`；

- 未修改禁止路径；

- 未创建无关顶级目录；

- 未生成第二套实现；

- 未产生根目录垃圾文件；

- `runs/` 位于项目根目录；

- Git Diff 不包含无关改动。

- Scenario 和质量 rubric 的当前 Hash 已由用户批准；

- 共享用户价值 rubric 的当前 Hash 已由 Protocol 绑定并包含在用户审核范围；

Scorecard 还必须包含：

- `scenarioSha256`；

- 每个目标 Skill 的目录 Hash；

- Implementer 和 Reviewer 的 Agent ID；

- 每个硬门槛的布尔结果与证据；

- 确定性验证命令、退出码和证据；

- Reviewer 每个维度的离散评分、证据理由与最终 `pass` / `fail` 结论。

- 用户最终 `pending | accepted | rejected` 决定；Reviewer 的 pass 不能自动替用户 accepted。

### 语义评分

要求：

\[

\\text\{Overall Score\} \\ge 90

\]

所有维度：

\[

\\text\{Dimension Score\} \\ge 90, \quad \\text\{Score\} \in \{0, 90, 100\}

\]

`quality.behavior` 使用场景业务维度，`quality.userValue` 使用共享五维；两组分别计算总分，并为每一维保存理由和带 Hash 的证据。Skill 源文件 authoring gate、两组运行质量、关键路径、相对 Baseline 增益和用户 accepted 是独立层，不能平均。

---

## 10\.6 关键路径与流程效率

每个 Protocol v3 用一句具体的 `criticalPath` 描述从请求到有效结果所需的最短合理流程。它不含分钟或毫秒阈值，Reviewer 通过以下已受 Hash 绑定的事实判断：

- 业务 rubric 是否把真正的首个有效动作和完成结果写成可观察条件；
- hard rejects 是否拒绝重复确认、提前写非关键文档、错误分支和无意义停点；
- 多轮 stop condition 是否只保留真实用户决定、安全门和材料性未知项；
- 正式实验是否先有最小可复现 Record，再 exactly-once 启动；
- 非关键背景、整理和终态结论是否按合同延后；
- 命令、产物、交互顺序和完整树证据是否支持上述判断。

Protocol v3 不保存 `speed`、`speedLimits`；Baseline/Scorecard 不保存 `timing`，`failureKind` 也没有 `skill-efficiency`。runner 可以使用 watchdog 防止无限运行，并可把耗时留作诊断，但 watchdog 触发只表示本次运行没有完成，不能自动判定 Skill 质量失败。

Framework E2E 仍按 PR 7 连续运行三次，用三次独立行为证据观察稳定性，不计算用时中位数或回归比率。

普通 `npm test` 不直接调用 Live Codex，不依赖网络，只检查已提交 Baseline/Scorecard 是否自洽、Hash 当前和证据合法。合法 `fail` 可以保留用于修复，不因结果本身让普通测试失败。T048 的发布合同另行检查：

- 存在；

- 对应当前 Skill Hash；

- 对应当前 Scenario Hash；

- 当前候选 Skill 中，只有用户最终决定保留的 Skill 才要求每项至少两个真实项目 accepted case；

- 所有 case 质量通过且用户 accepted；

- 每项 `criticalPath` 与有序行为证据完整，且不存在 v3 墙钟质量字段。

`npm test` 不尝试判断当前会话是否可创建 subagent；Live Eval 是按需执行并由人审核的评测流程。

---

# 历史 v1 首个完整 E2E 测试场景（只读）

本节记录 PR 0 当时用于取得真实 Red 的 Protocol v1 输入，不是后续 Live Eval 的运行入口。`framework-e2e-paged-cache` 的 Scenario、Protocol、Approval、Fixture、Baseline 和 evidence 按原字节与 Hash 保留；需要继续评测时只使用 T071 新建的 `framework-e2e-paged-cache-v2` Proposal，并由 T082 在用户批准当前 Batch 后取得新的 v2 Red。

场景名称：

```Plain Text
framework-e2e-paged-cache
```

初始项目：

```Plain Text
fixture/
├── AGENTS.md
├── hello-scholar/
│   ├── architecture.md
│   └── specs/
│       └── kv-cache-acceleration/
│           └── SPEC-001-paged-cache/
│               └── spec.md
├── src/
│   └── kv_cache/
│       └── contiguous_allocator.py
├── scripts/
│   └── benchmark_cache.py
├── tests/
│   └── test_contiguous_allocator.py
└── runs/
```

历史 v1 请求当时要求：

1. 调用 `$writing-plans` 创建 `plan.md`；

2. 调用 `$generating-tasks` 创建 `tasks.md`；

3. Eval 主 Agent 不直接实现，而是委派一个 Implementer under test；

4. 该 Implementer 作为产品主 Agent，直接按 `tasks.md` 实施，不调用已淘汰的执行 Skill或嵌套每 Task subagent；

5. 实现 Paged Block Allocator；

6. 保持外部入口兼容；

7. 删除旧正式执行路径；

8. 测试放 `tests/`；

9. Benchmark 脚本放 `scripts/`；

10. Record 放项目根目录 `runs/<run-id>/record.md`；

11. 原始输出放 `outputs/`；

12. 指标放 `results/`；

13. 不得创建 `hello-scholar/runs/`；

14. 不得创建 `*_new`、`*_final`、`*_v2`；

15. 运行完整测试和 Benchmark；

16. Eval 主 Agent在实现完成后委派只读 Reviewer 子 Agent；该 Reviewer 是评测隔离角色，不是产品完成的强制依赖；

17. 返回 Agent ID、文件变化、验证结果和风险。

---

# 分阶段实施

## PR 0：Skill Eval Workflow 与静态证据门

### 目标

先建立一套适配当前 Codex subagent 能力的 Skill 测试流程，再开发新 Skill。

### 新增

```Plain Text
test/skill-evals/WORKFLOW.md
test/skill-evals/framework-e2e-paged-cache/
test/skill-evals/framework-e2e-paged-cache-v2/
test/skill-evals/user-value-rubric.json
test/skill_eval_contract.py
test/test_skill_eval_contract.py
```

### Tasks

1. 写当前 Codex 会话内的 subagent 评测流程。

2. 定义 Scenario、Protocol、Baseline 和 Scorecard 合同。

3. 实现 Scorecard 和 Hash 的本地确定性校验。

4. 写 Framework E2E `scenario.md` 和 `protocol.json`。

5. 在下一代 Skills 尚未存在时，用当前会话的全新 subagent 运行对照并记录 `baseline.json`；预期是 Red，若意外全绿则记录 `control-pass` 并停在人审门。

6. 确认静态测试不启动 Codex、不调用外部 API。

7. 升级 Protocol v2：安全投影、逐字多轮消息、共享用户价值门和非计时关键路径合同；历史 v1 保持只读。

8. 为历史 Framework E2E 建立独立 v2 后继 Proposal，用户批准前不运行新 Baseline。

9. 用户批准当前 Proposal Batch 后，由独立 T082 运行 Framework v2 Baseline；`control-pass` 立即停在人审门。

### 完成条件

- Framework 对照明确暴露下一代能力缺口；若得到 `control-pass`，不得继续实施，先由用户重新判断升级场景和独立价值；

- Workflow 能指导当前 Codex 主 Agent 创建隔离的 Implementer 和 Reviewer subagent；

- 业务质量、用户价值和关键路径分别有独立证据；

- `npm test` 只做本地确定性校验，不产生 Live Codex 成本；

- 仓库中不存在 `testing-skills` Skill、`codex exec` Runner 或额外 API 客户端。

---

## PR 1：文档解析、校验和 Index

### 新增

```Plain Text
src/frontmatter.js
src/document-discovery.js
src/document-validation.js
src/index-generator.js
src/docs.js

test/test_frontmatter.js
test/test_document_discovery.js
test/test_document_validation.js
test/test_index_generator.js
test/test_cli_docs.js
```

### 修改

```Plain Text
src/cli.js
src/fs-ops.js
package.json
```

### 完成条件

- 可解析五类文档；

- 正确扫描 `hello-scholar/specs/`；

- 正确扫描根目录 `runs/`；

- 可检测错误的 `hello-scholar/memory/` 路径；

- 可检测 Stale Plan 和 Tasks；

- 可生成三个 Index；

- 原子更新；

- 原 CLI 测试全部通过。

---

## PR 2：Spec Bundle 与 Manage Specs

### 新增

```Plain Text
skills/hello-scholar/manage-specs/
```

### 修改

```Plain Text
skills/superpowers-skills/brainstorming/
```

### 删除

```Plain Text
skills/superpowers-skills/brainstorming/assets/spec-template.md
skills/superpowers-skills/brainstorming/assets/spec-template.zh_CN.md
skills/superpowers-skills/brainstorming/visual-companion.md
skills/superpowers-skills/brainstorming/scripts/frame-template.html
skills/superpowers-skills/brainstorming/scripts/helper.js
skills/superpowers-skills/brainstorming/scripts/server.cjs
skills/superpowers-skills/brainstorming/scripts/start-server.sh
skills/superpowers-skills/brainstorming/scripts/stop-server.sh
```

### Skill 测试场景

必须覆盖：

- 已存在相似 Spec；

- 只修改 Revision；

- 同一问题多个方案；

- 真正独立的新 Spec；

- 自动更新 Index；

- 不生成日期文件。

### 完成条件

- Brainstorm 不再写日期命名 Spec；

- Brainstorm 不再提供或引用 Visual Companion；

- 同一设计修改原 Spec；

- 新设计才创建 Bundle；

- 用户批准门保留；

- Runtime Skill 的业务质量、用户价值和关键路径合同通过。

---

## PR 3：Plan 与 Tasks 拆分

### 新增

```Plain Text
skills/superpowers-skills/generating-tasks/
```

### 修改

```Plain Text
skills/superpowers-skills/writing-plans/
```

### 完成条件

- Plan 只保存实施策略；

- Tasks 独立存储；

- 现有任务级 Prompt 被移动而不是删除；

- Plan 引用 Spec Revision；

- Tasks 引用 Plan Revision；

- Stale 可检测；

- Tasks 完成度可统计；

- 两个 Skill 均通过 Runtime Eval。

---

## PR 4：主 Agent 执行收敛与 Converge

### 新增

```Plain Text
skills/hello-scholar/converge-to-spec/
```

### 删除

```Plain Text
skills/superpowers-skills/executing-plans/
skills/superpowers-skills/subagent-driven-development/
skills/superpowers-skills/requesting-code-review/
skills/superpowers-skills/receiving-code-review/
skills/superpowers-skills/dispatching-parallel-agents/
skills/superpowers-skills/systematic-debugging/
skills/superpowers-skills/finishing-a-development-branch/
skills/superpowers-skills/verification-before-completion/
skills/superpowers-skills/writing-skills/
```

### 完成条件

- 实施读取 Architecture、Spec、Plan、Tasks；

- Stale 时停止；

- Tasks 由当前主 Agent按依赖逐项直接执行；

- Subagent 和独立 Review 只作为主 Agent按需使用的平台能力，不是产品必需链；

- Missing、Partial、Contradictory、Unrequested 可检测；

- 未选方案和旧实现可发现；

- Converge 检查 Tasks Completion、正式 Record 和 Bundle 完成就绪；

- AGENTS 的新鲜证据门继续生效，不再依赖单独 Verification Skill；

- 九个淘汰 Skill 的目录及其 owner-local 直接引用均删除；共享 catalog、Router 和公共文档中的最终清理分别由 PR 6 的 T051、T043 和 T045 完成，并由 PR 7 的 T052 统一守卫；

- Runtime Eval 通过。

---

## PR 5：根目录 Runs 与 Record

### 修改

```Plain Text
skills/hello-scholar/record-experiment/
```

根目录 Run 的发现、校验和 Index 能力已经由 PR 1 建立。PR 5 只改 Record Skill、模板和对应测试，不重复打开 docs 内核文件。

### 完成条件

- `runs/` 位于项目根目录；

- 一个 Run 一份 `record.md`；

- 不生成 `run.json`；

- 不生成重复报告；

- 失败和负结果保留；

- Run Index 自动生成；

- 原 Record 核心 Prompt 保留；

- 正式运行在最小可复现 Record 后立即启动，完整说明不阻塞进程；

- 合格探索不等待完整 Record，长时间运行期间补非关键上下文，终态一次收口；

- Runtime Eval 通过。

---

## PR 6：Architecture、显式 TDD 与 Routing

### 新增

```Plain Text
skills/hello-scholar/docs-maintenance/
docs/migration/document-model-v2.md
test/test_migration_guide.py
test/test_current_skill_catalog.py
test/test_tdd_explicit_trigger.py
test/test_worktree_explicit_trigger.py
test/test_takeoff_explicit_trigger.py
test/test_landing_explicit_trigger.py
```

### 修改

```Plain Text
AGENTS.md
AGENTS-zh.md
README.md
skills/superpowers-skills/using-helloscholar/
skills/superpowers-skills/test-driven-development/
skills/superpowers-skills/using-git-worktrees/
skills/productivity-skills/handoff/
skills/hai-skills/takeoff/
skills/hai-skills/landing/
docs/need_skills/need-skill.md
docs/need_skills/minimum-skill-record.md
docs/need_skills/reference-skill.md
src/install.js
src/fs-ops.js
test/test_cli_install.js
```

### 完成条件

- 简单任务零文档；

- 代码、脚本、测试和产物位置继续服从 Architecture、Plan/Task 文件边界和 AGENTS，不引入新的结构 Skill；

- Architecture 位于 `hello-scholar/architecture.md`；

- Handoff 位于 `hello-scholar/handoffs/`，不写入 `hello-scholar/memory/`；

- `crash-audit`、`takeoff`、`landing` 每项至少两个真实项目 Scenario；Takeoff 从宽泛主动触发收窄为用户清楚表达的放大目标意图，Landing 不再自动承接 Takeoff；

- Architecture 只描述已实现系统；

- Index 不手工编辑；

- 路由支持 Fast、Design、Execution、Experiment、Maintenance；

- Fast 和普通 Feature/Bugfix 不自动调用 TDD；用户或已批准 Task 明确点名时，TDD 的完整 Red-Green-Refactor 生效；

- Execution 路由进入主 Agent直接执行当前 Tasks；

- 重新 install/uninstall 能清理旧版 owned retired Skill target，并保留 unowned 同名目录和用户文档；

- Baseline 审核前，当前 catalog 和三份平台 tool reference 把 14 个名称明确标为候选 Skill；Baseline 后按用户保留/淘汰决定生成唯一最终清单，不为了凑数量保留无独立价值的 Skill；

- 迁移说明已经生成并通过专属静态合同，Router/AGENTS/README 只链接其两阶段门；

- Runtime Eval 通过。

---

## PR 7：Legacy 迁移与完整闭环

### 新增

```Plain Text
test/test_framework_e2e_scorecard.py
test/test_legacy_path_contract.py
```

PR 7 消费 PR 6 已生成的 `docs/migration/document-model-v2.md`，不在最终阶段临时补写迁移规则。

### 迁移

旧 Spec：

```Plain Text
hello-scholar/memory/specs/YYYY-MM-DD-*.md
```

迁移到：

```Plain Text
hello-scholar/specs/<topic-id>/SPEC-NNN-*/
```

旧 Plan：

```Plain Text
hello-scholar/memory/plans/*.md
```

迁移到对应 Spec Bundle。

旧 Record：

```Plain Text
hello-scholar/memory/experiment-records/runs/<run-id>.md
```

迁移到：

```Plain Text
runs/<run-id>/record.md
```

旧 Handoff：

```Plain Text
hello-scholar/memory/handoffs/YYYY-MM-DD-<topic>-handoff.md
```

迁移到：

```Plain Text
hello-scholar/handoffs/YYYY-MM-DD-<topic>-handoff.md
```

### 规则

- 不进行机械一对一 Spec 迁移；

- 同一问题的文件合并为 Revision；

- 候选方案合并进同一 Spec；

- 无法确认关系时保留旧文件并报告；

- AI 必须先读取迁移说明，只输出源文件、目标文件、合并/保留决定和不确定项的映射建议；

- 用户明确审核通过映射后才能复制、移动、合并或删除旧文件；

- 不增加 `docs migrate`、独立迁移脚本或其他自动执行入口；

- 不双写新旧路径；

- Git 保留历史。

- 已存在的 Brainstorm Visual Companion 产物不自动迁移；保留还是删除由用户在迁移审核时决定。

### 最终完成条件

按 `test/skill-evals/WORKFLOW.md` 在当前 Codex 会话内正式运行三次 Framework E2E。每次都使用新的隔离工作区、全新 Implementer subagent 和全新 Reviewer subagent，不得用前一次的上下文或产物污染后续运行。

必须满足：

- 三次硬门槛全部通过；

- 质量中位分达到阈值；

- 关键维度无低分；

- 三次都按获批 `criticalPath` 证明必要动作顺序、真实停点、正式 Benchmark exactly-once 启动和非关键工作延后，没有 v3 墙钟质量门；

- 所有 Run 均在根目录；

- Spec、Plan、Tasks、Record、Architecture 关系正确；

- `npm test` 全部通过；

- Install、Uninstall、Link、Copy 无回归。

- 没有任何 Live Eval 命令被 `npm test` 或默认 package script 启动。

---

# Change Map

## 13\.1 新增

```Plain Text
src/frontmatter.js
src/document-discovery.js
src/document-validation.js
src/index-generator.js
src/docs.js

skills/hello-scholar/manage-specs/
skills/hello-scholar/converge-to-spec/
skills/hello-scholar/docs-maintenance/
skills/superpowers-skills/generating-tasks/

test/skill-evals/WORKFLOW.md
test/skill-evals/
test/skill_eval_contract.py
test/test_frontmatter.js
test/test_document_discovery.js
test/test_document_validation.js
test/test_index_generator.js
test/test_cli_docs.js
test/test_skill_eval_contract.py
test/test_framework_e2e_scorecard.py
test/test_legacy_path_contract.py
test/test_migration_guide.py
test/test_current_skill_catalog.py
test/test_tdd_explicit_trigger.py
test/test_worktree_explicit_trigger.py
test/test_takeoff_explicit_trigger.py
test/test_landing_explicit_trigger.py

docs/migration/document-model-v2.md
```

## 13\.2 修改

```Plain Text
src/cli.js
src/fs-ops.js
src/install.js
package.json

AGENTS.md
AGENTS-zh.md
README.md

skills/superpowers-skills/using-helloscholar/
skills/superpowers-skills/brainstorming/
skills/superpowers-skills/writing-plans/
skills/superpowers-skills/test-driven-development/
skills/superpowers-skills/using-git-worktrees/
skills/hello-scholar/record-experiment/
skills/productivity-skills/handoff/
skills/hai-skills/takeoff/
skills/hai-skills/landing/

docs/need_skills/need-skill.md
docs/need_skills/minimum-skill-record.md
docs/need_skills/reference-skill.md
```

## 13\.3 删除

```Plain Text
skills/superpowers-skills/brainstorming/assets/spec-template.md
skills/superpowers-skills/brainstorming/assets/spec-template.zh_CN.md
skills/superpowers-skills/brainstorming/visual-companion.md
skills/superpowers-skills/brainstorming/scripts/frame-template.html
skills/superpowers-skills/brainstorming/scripts/helper.js
skills/superpowers-skills/brainstorming/scripts/server.cjs
skills/superpowers-skills/brainstorming/scripts/start-server.sh
skills/superpowers-skills/brainstorming/scripts/stop-server.sh

skills/hello-scholar/record-experiment/assets/index-template.md
skills/hello-scholar/record-experiment/assets/index-template.zh_CN.md

skills/superpowers-skills/executing-plans/
skills/superpowers-skills/subagent-driven-development/
skills/superpowers-skills/requesting-code-review/
skills/superpowers-skills/receiving-code-review/
skills/superpowers-skills/dispatching-parallel-agents/
skills/superpowers-skills/systematic-debugging/
skills/superpowers-skills/finishing-a-development-branch/
skills/superpowers-skills/verification-before-completion/
skills/superpowers-skills/writing-skills/
```

## 13\.4 原则上不修改

```Plain Text
src/project-root.js
src/instruction-blocks.js
src/skill-discovery.js

skills/hello-scholar/crash-audit/
```

---

# 回滚策略

每个 PR 必须独立可回滚。

## 文档工具回滚

回滚 CLI 和解析模块，不删除用户已经生成的文档。

## Skill 回滚

恢复上一版 Skill Prompt；新文档保留，用户仍可手工读取。

## Record 路径回滚

不得自动把根目录 `runs/` 移回 `hello-scholar/`。只恢复 Skill 行为，现有运行记录保持原位。

## 迁移回滚

迁移使用 Git Rename 或 Copy \+ 用户确认；不在同一提交中不可逆删除未经确认的旧文档。

---

# 最终验收标准

## 文档结构

* [ ] 不存在新的 `hello-scholar/memory/` 写入。

* [ ] Architecture 位于 `hello-scholar/architecture.md`。

* [ ] Spec Bundle 位于 `hello-scholar/specs/`。

* [ ] Runs 位于项目根目录。

* [ ] 一个 Run 只有一个 `record.md`。

* [ ] Handoff 位于 `hello-scholar/handoffs/`。

* [ ] Topic 导航统一使用 `INDEX.md`。

## Spec、Plan、Tasks

* [ ] 同一设计只有一个 Bundle。

* [ ] Spec 使用稳定 ID 和 Revision。

* [ ] Plan 引用 Spec Revision。

* [ ] Tasks 引用 Spec 和 Plan Revision。

* [ ] Plan 和 Tasks 的 Stale 状态自动计算。

* [ ] Tasks 完成度自动计算。

* [ ] 多个候选方案不会生成多个相似 Spec。

## 现有 Prompt 复用

* [ ] Brainstorm 主流程保留。

* [ ] Brainstorm Visual Companion 的入口和专用资源已删除。

* [ ] Writing Plans 的真源、范围和结构规则保留。

* [ ] 任务级 Prompt 被移动至 Generating Tasks。

* [ ] 主 Agent 能从 Current Bundle 逐 Task 直接实施，无专用执行 Skill 依赖。

* [ ] 九个淘汰 Skill 的目录、模板和活跃引用已删除。

* [ ] Record Experiment 的证据和失败记录规则保留。

* [ ] Converge 只在 Bundle 末端或用户明确要求时运行，默认只读；AGENTS 承担新鲜命令证据。

* [ ] TDD 只在用户或已批准 Task 明确点名时启动，启动后完整纪律保留。

* [ ] `using-git-worktrees`、`crash-audit`、`takeoff`、`landing` 保留为按需 Skill。

## Skill 测试

* [ ] 每个新增 Skill 先有完整 Scenario。

* [ ] 每个 Baseline 如实记录 `fail | control-pass`；只有与目标 Skill 缺失或旧行为直接相关的真实 `fail` 才打开实施门，`control-pass` 停在人审门且不计入发布 case。

* [ ] 每个 case 都满足用户批准的 `skillExpectations`：Baseline snapshot 匹配 `baselineLoad`，Live snapshot 匹配固定的 `liveLoad: current-explicit-file` 和当前 Skill Hash，`enter | exit | optional` 业务分支独立成立；显式读取文件不等于业务进入，也不冒充平台自动激活。

* [ ] Codex 必须创建 Implementer 子 Agent。

* [ ] Codex 必须创建独立 Reviewer 子 Agent。

* [ ] 硬门槛全部通过。

* [ ] 场景业务评分和共享用户价值评分分别达到阈值，每维有理由和证据。

* [ ] 每个 v3 Protocol 有具体 `criticalPath`，业务 rubric、hard rejects、交互顺序、命令和产物证据共同证明流程合理；墙钟数据和 watchdog 不参与质量 pass/fail。

* [ ] Scorecard 关联当前 Skill 和 Scenario Hash。

* [ ] 普通 `npm test` 不产生 Live Codex 成本。

* [ ] Live Eval 只由当前 Codex 会话的 subagent 流程执行，不调用 `codex exec` 或额外 API。

## 工程质量

* [ ] 简单任务不创建文档。

* [ ] 一次语义操作只维护一类核心文档。

* [ ] Index 全部由程序生成。

* [ ] Architecture 不阻塞日常开发。

* [ ] Architecture 只由用户发起，或在 Bundle 完成且系统结构发生材料性变化时提醒用户确认后更新。

* [ ] 未选方案、旧实现和旧配置可以被发现。

* [ ] `npm test` 全部通过。

* [ ] 安装和卸载逻辑无回归。

* [ ] 迁移必须先生成映射建议并经用户审核，不存在自动迁移命令。

---

# 实施顺序

```Plain Text
PR 0
Skill Eval Workflow 与静态证据门
        ↓
PR 1
Front Matter、文档扫描、校验、Index
        ↓
PR 2
Spec Bundle、Manage Specs、Brainstorm
        ↓
PR 3
Writing Plans 与 Generating Tasks
        ↓
PR 4
主 Agent Direct Execution、Skill 删除与 Converge
        ↓
PR 5
Root Runs 与 Record
        ↓
PR 6
Explicit TDD、Architecture、Routing
        ↓
PR 7
Legacy Migration 与 Framework E2E
```

该顺序先建立测试底座，再逐步修改 Skill，确保每个新能力都能用当前 Codex 会话中的真实 subagent 场景验证，而不是只依赖 Prompt 文本检查或不可用的外部 API。
