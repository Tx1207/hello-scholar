# hello-scholar

hello-scholar 是一套安装到 **Claude Code** 或 **Codex** 中的项目协作规则和工作说明（Skills）。它帮助编程 Agent——也就是能在项目中读取代码、修改文件和运行命令的 AI 助手——根据任务复杂度选择合适的工作方式：简单修改直接完成，重要改动先把设计说清楚，正式实验保留可复现记录，并在声称完成前用当前代码和测试验证结果。

它不是新的 AI 模型，也不会替代 Claude Code 或 Codex。你仍然像平时一样描述需求；hello-scholar 负责让 Agent 更稳定地理解项目、控制改动范围，并把需要长期保留的设计和证据写进项目，而不是只留在聊天记录里。

## 快速导航

### 第一次使用

- [你可以用它做什么](#你可以用它做什么)
- [适合谁](#适合谁)
- [三分钟开始使用](#三分钟开始使用)
- [安装后会发生什么](#安装后会发生什么)
- [常见使用示例](#常见使用示例)

### 了解工作方式

- [hello-scholar 如何处理不同任务](#hello-scholar-如何处理不同任务)
- [核心文档分别解决什么问题](#核心文档分别解决什么问题)
- [完整工作流](#完整工作流)
- [Skills 在工作流中的位置](#skills-在工作流中的位置)
- [Current Architecture 如何维护](#current-architecture-如何维护)

### 安装和维护

- [CLI 命令参考](#cli-命令参考)
- [`link` 和 `copy` 的区别](#link-和-copy-的区别)
- [指令块和卸载边界](#指令块和卸载边界)
- [项目偏好](#项目偏好)
- [迁移已有文档](#迁移已有文档)
- [Skill 发现规则](#skill-发现规则)
- [常见问题](#常见问题)
- [开发](#开发)
- [参考来源](#参考来源)
- [设计与迁移资料](#设计与迁移资料)

## 你可以用它做什么

- **直接处理日常修改**：局部 Bug、文案、格式、单个测试和低风险重构不强制创建复杂文档。
- **先设计再实现重要功能**：公共接口、数据格式、模块职责或高风险行为变化会先形成可审阅的设计。
- **保存项目决策**：用不同文档分别记录当前系统、目标设计、实施策略和执行步骤，避免重要决定只留在聊天记录里。
- **记录正式实验**：为训练、Benchmark、Eval 和其他需要保留证据的运行记录命令、输入、环境、结果和结论。
- **减少“说完成但没验证”**：要求 Agent 使用当前工作树中的测试或其他可观察证据支持结论。
- **同时支持 Claude Code 和 Codex**：安装器会为不同工具写入对应的项目规则和 Skill 目录。

## 适合谁

hello-scholar 适合以下情况：

- 你希望 Agent 不只是写代码，还能在多轮协作中保留设计和实施上下文；
- 项目包含科研实验、模型训练、Benchmark 或需要复现的运行；
- 重要功能需要先审核设计，再决定是否实施；
- 你经常遇到 Agent 擅自扩大改动范围、覆盖旧文档或缺少验证的问题；
- 团队同时使用 Claude Code、Codex 或多个 Agent 协作。

如果你只需要一次性的简单问答，不需要项目规则、设计文档或长期记录，可以继续直接使用原来的编程 Agent，不一定需要 hello-scholar。

## 三分钟开始使用

### 1. 准备环境

你需要：

- Node.js 和 npm；
- Claude Code 或 Codex；
- 一个准备使用 hello-scholar 的项目。

如果通过 Git 获取 hello-scholar，还需要安装 Git。

### 2. 安装 hello-scholar CLI

克隆本仓库并安装全局命令：

```bash
git clone https://github.com/Tx1207/hello-scholar.git
cd hello-scholar
npm install -g .
```

确认命令可用：

```bash
hello-scholar help
```

如果你已经在本仓库目录中，也可以不安装全局命令，直接运行：

```bash
node bin/hello-scholar.js help
```

### 3. 安装到你的项目

进入你真正要开发的项目目录，然后选择正在使用的工具。

Claude Code：

```bash
cd /path/to/your-project
hello-scholar install claude
```

Codex：

```bash
cd /path/to/your-project
hello-scholar install codex
```

使用一种工具时只需执行对应命令，不必同时安装两套。如果同一个项目确实同时使用 Claude Code 和 Codex，可以分别安装。

### 4. 发出第一个请求

安装后照常向 Agent 描述目标。你不需要记住或手动调用所有 Skill。

例如，修复一个简单问题：

```text
修复登录页提交失败后按钮一直处于 loading 状态的问题，并补充回归测试。
```

或者先讨论一个重要功能：

```text
为训练任务增加断点续训能力。checkpoint 目录结构不能改变。
请先和我讨论设计，不要开始修改代码。
```

为了得到更稳定的结果，建议在请求中说明：

1. 想达到什么结果；
2. 哪些行为、接口或文件不能改变；
3. 已经存在的设计、代码、测试或实验材料；
4. 希望 Agent 直接修改，还是先停在设计或审核阶段。

## 安装后会发生什么

安装器不会覆盖已有项目规则。它会在对应文件顶部加入一个带明确起止标记的 hello-scholar 管理块，并安装 Skills。

Claude Code：

```text
<project-root>/CLAUDE.md
<project-root>/.claude/skills/<skill-name>
```

Codex：

```text
<project-root>/AGENTS.md
<project-root>/.agents/skills/<skill-name>
```

安装本身不会自动创建 Spec、Plan、Tasks、Architecture 或实验 Record。只有后续任务确实需要时，Agent 才会提出或创建相应文档。

默认使用 `link` 模式，目标项目中的 Skill 会链接到本仓库。使用这种模式后，需要保留当前 hello-scholar 仓库及其路径；移动或删除源仓库会使链接失效。需要让某个项目拥有独立副本，或者不希望它依赖源仓库路径时，可以改用 `copy`：

```bash
hello-scholar install claude --mode copy
hello-scholar install codex --mode copy
```

重复安装时，如果已有对应的 hello-scholar 管理块，CLI 会先提醒你备份块内的手动修改。只有输入 `yes` 才会替换该管理块。

## hello-scholar 如何处理不同任务

### 简单修改：直接完成

局部 Bug、文案、格式、单个测试、无外部行为变化的内部重构和临时调试，通常直接走：

```text
理解问题 → 修改代码 → 运行验证 → 报告结果
```

这类工作通常不创建或修改 Spec、Plan、Tasks、Record 或 Architecture。

### 重要改动：先把设计说清楚

新能力、公共接口变化、模块职责调整、数据或配置迁移，以及高风险改动，通常按下面的顺序推进：

```text
明确目标和边界
      ↓
确认目标设计（Spec）
      ↓
确认实施策略（Plan）
      ↓
拆成可验证步骤（Tasks）
      ↓
实施并测试
```

每个阶段都有独立审核边界。批准设计不等于批准实施；批准 Plan 也不等于立即修改代码。你可以明确要求 Agent 停在任何一步。

### 正式实验：先记录，再运行

训练、正式 Benchmark、Eval、昂贵或长时间运行，以及用于验收的重要实验，通常按下面的方式处理：

```text
记录运行条件 → 执行一次 → 保存原始证据 → 总结结果和决定
```

普通单元测试、静态检查和低风险临时探索不需要为了形式完整而创建实验 Record。

### 已有文档维护

你也可以直接要求 Agent 检查或维护 hello-scholar 文档：

```text
检查当前项目的 hello-scholar 文档状态，不要修改文件。
```

```text
基于已完成的功能和当前代码，提出 Architecture 更新方案，先不要写文件。
```

## 常见使用示例

### 先审核设计，不实施

```text
我们要给检索接口增加批量查询能力。现有单条查询接口不能改变。
先分析设计和兼容性，给我审核，不要开始实现。
```

### 修改已有设计，但保留仍然有效的内容

```text
把现有 Spec 的超时策略改为指数退避。其他已经采用的接口、测试要求和回滚方案继续保留。
请整理成一份完整、独立可读的当前版本，不要追加互相矛盾的补丁说明。
```

### 实施已经批准的任务

```text
继续当前已批准 Tasks 中第一个未完成且没有依赖阻塞的任务。完成验证后更新执行状态。
```

### 运行需要保留证据的实验

```text
这是用于决定是否上线的正式 Benchmark。运行前先记录命令、数据版本、模型、seed、输出路径和停止条件；原始 stdout 和 stderr 需要保留。
```

### 限制改动范围

```text
只修改 API 错误映射和对应测试，不要重构请求客户端，也不要更改公共错误码。
```

## 核心文档分别解决什么问题

复杂工作中，hello-scholar 使用五类核心文档保存不同事实。你不需要在第一次使用前记住它们；Agent 会在需要时说明为什么要创建或修改某一类文档。

| 文档 | 用普通语言来说 | 位置 |
| --- | --- | --- |
| Current Architecture | 项目现在已经实现并正式采用了什么 | `hello-scholar/architecture.md` |
| Spec | 最终要实现什么、哪些边界不能破坏、怎样算完成 | `hello-scholar/specs/<topic>/SPEC-.../spec.md` |
| Plan | 准备如何实现已经接受的设计 | 与 Spec 同一目录的 `plan.md` |
| Tasks | 按什么顺序执行，每一步如何验证 | 与 Spec 同一目录的 `tasks.md` |
| Record | 一次正式实验实际如何运行、得到什么结果 | `runs/<run-id>/record.md` |

一个项目通常按以下结构组织：

```text
<project-root>/
├── AGENTS.md
├── CLAUDE.md
│
├── hello-scholar/
│   ├── architecture.md
│   ├── handoffs/
│   │   └── YYYY-MM-DD-<topic>-handoff.md
│   └── specs/
│       ├── INDEX.md
│       └── <topic>/
│           └── SPEC-001-<design-name>/
│               ├── spec.md
│               ├── plan.md
│               └── tasks.md
│
└── runs/
    ├── INDEX.md
    └── <run-id>/
        ├── record.md
        ├── outputs/
        ├── results/
        ├── logs/
        └── checkpoints/
```

`hello-scholar/handoffs/` 用于按需交接会话上下文，不属于五类核心文档，也不进入 Spec 或 Run Index。

每次文档修改只处理自己的职责：修改 Spec 不会顺便重写 Plan，修改 Plan 不会顺便重写 Tasks，实验结果也不会自动改变设计。当 Spec Revision 变化后，Plan 或 Tasks 显示为 `Stale` 是正常状态，表示它们需要在继续实施前重新核对。

`INDEX.md` 是 CLI 生成的导航文件，不应手工维护：

```bash
hello-scholar docs check
hello-scholar docs sync
```

- `hello-scholar docs check` 只读检查文档状态；
- `hello-scholar docs sync` 生成或更新派生的 `INDEX.md`。

## 完整工作流

对于需要完整设计和实施记录的改动，各类事实通常按下面的关系推进：

```text
Current Architecture
        ↓
Spec → Plan → Tasks
        ↓
主 Agent 实施
        ↓
Tests / Record（按需）
        ↓
收敛检查和当前证据
        ↓
Architecture Maintenance（仅在系统事实变化时）
```

1. Agent 读取相关 Current Architecture、代码和测试，理解当前系统与约束。
2. Spec 明确目标、边界、行为、取舍和验收条件；用户接受当前 Spec 后再规划实施。
3. Plan 基于 Accepted Spec 描述高层技术策略；用户批准后再拆分 Tasks。
4. Tasks 将 Plan 拆成可独立执行、可验证的步骤；用户批准并明确要求实施后才开始执行。
5. 主 Agent 按依赖直接修改真实代码、运行验证并更新任务状态。
6. 需要长期保存正式实验事实时建立 Record；普通测试不创建 Record。
7. 在 Bundle 结束或你明确要求时，检查代码、测试和文档是否真正实现了 Spec。
8. 只有当前系统的结构性事实已经变化并正式采用时，才独立更新 Current Architecture。

低风险、可丢弃的参数扫描、模型或 Prompt 对比和快速可行性验证，可以先探索再决定是否形成正式设计：

```text
Quick Experiment → Analyze → Spec / Plan / Tasks（按需）
```

探索应有时间和成本边界，不应修改生产数据、执行不可逆操作、改变公共 API 或持久化格式。正式、昂贵、长时间或用于验收的实验，应在启动前建立 Record。

## Skills 在工作流中的位置

Skills 是 Agent 在不同阶段使用的工作说明，不是用户必须逐个执行的命令。

| 阶段 | Skill / Owner | 负责什么 |
| --- | --- | --- |
| 任务判断 | `using-helloscholar` | 判断工作适合直接修改、设计、实施、实验还是文档维护。 |
| 设计讨论 | `brainstorming` | 澄清目标、约束、风险、接口、数据流和验收条件。 |
| Spec 归属 | `manage-specs` | 判断应该更新已有 Spec、创建独立 Spec，还是创建替代旧设计的 Successor Spec。 |
| 实施策略 | `writing-plans` | 从 Accepted Spec 形成高层实施策略。 |
| 任务拆分 | `generating-tasks` | 将 Approved Plan 拆成可独立执行和验证的 Tasks。 |
| 实施 | 主 Agent | 按 Tasks 的依赖修改代码并验证结果。 |
| 正式运行 | `record-experiment` | 记录正式实验、Benchmark、Eval 和训练的运行事实。 |
| 完成检查 | `converge-to-spec` | 检查 Spec、Plan、Tasks、代码、测试和 Record 是否一致。 |
| 文档维护 | `docs-maintenance` | 检查文档、生成 Index、维护 Architecture 或恢复可审核状态。 |

以下能力只在你明确需要时使用：

| Skill | 适用场景 |
| --- | --- |
| `takeoff` | 从更高层重新判断目标、问题边界和方向。 |
| `grilling` | 从反对者视角挑战方案、假设、反例和代价。 |
| `crash-audit` | 检查答案、Spec、Plan 或决策中的不确定性和遗漏。 |
| `landing` | 把较大的方向压缩成可验证、可停止的最小范围。 |
| `test-driven-development` | 你或 Approved Task 明确要求完整 Red–Green–Refactor。 |
| `using-git-worktrees` | 你或 Approved Task 明确要求隔离 Worktree。 |
| `handoff` | 会话中断、上下文切换或需要交给其他协作者。 |

## Current Architecture 如何维护

`hello-scholar/architecture.md` 描述**当前已经实现并正式采用的系统事实**，不是未来设计草案。

开始较大改动前，Agent 会读取与任务相关的 Architecture，理解当前模块职责、运行流程、技术选择、产物位置和约束。Draft Spec、未完成 Plan、未采用 Prototype 和聊天中的未来设想不应提前写入 Architecture。

Architecture 更新是一个独立操作：

```text
当前代码 + Git + 已完成 Bundle + 有效 Record
        ↓
Architecture Proposal
        ↓
用户审核当前文件和 Proposal
        ↓
批准后更新 hello-scholar/architecture.md
```

Proposal 阶段不会写文件。Agent 会说明事实来源、需要增加或修改的内容、应删除的旧表述、未解决事实和预计写入范围。只有你明确批准后，Agent 才会更新 Architecture。

因此，Architecture 不会因为一个 Task、一次 Commit 或一次普通测试自动更新，也不会阻塞日常开发。

## CLI 命令参考

查看帮助：

```bash
hello-scholar help
```

安装 Codex 或 Claude Code 支持：

```bash
hello-scholar install codex
hello-scholar install claude
```

指定 Skill 安装方式：

```bash
hello-scholar install codex --mode link
hello-scholar install codex --mode copy
hello-scholar install claude --mode link
hello-scholar install claude --mode copy
```

检查或同步文档导航：

```bash
hello-scholar docs check
hello-scholar docs sync
```

卸载项目内支持：

```bash
hello-scholar uninstall codex
hello-scholar uninstall claude
```

卸载全局 CLI：

```bash
npm uninstall -g hello-scholar
```

卸载全局 CLI 只会移除 `hello-scholar` 命令，不会清理已经写入各项目的规则、Skills 或项目文档。清理项目内安装内容时，应先在对应项目运行 `hello-scholar uninstall ...`。

## `link` 和 `copy` 的区别

### `link`：默认，适合统一更新

- 目标项目中的 Skill 目录是软链接；
- 修改 hello-scholar 源仓库中的 Skill 后，使用同一源仓库链接的项目会看到更新；
- 直接从目标项目的链接路径编辑 Skill，实际也会修改源仓库；
- 适合个人或团队统一维护一套 Skills。

### `copy`：适合项目独立定制

- 目标项目得到一份独立 Skill 副本；
- 项目内修改不会影响 hello-scholar 源仓库；
- 每个副本包含 `.hello-scholar-install.json`，供卸载时确认所有权；
- 适合不同项目需要长期维护不同规则的情况。

不确定时使用默认的 `link`。如果你不希望一个项目中的 Skill 修改影响其他项目，使用 `copy`。

## 指令块和卸载边界

hello-scholar 不会覆盖已有的 `AGENTS.md` 或 `CLAUDE.md`。安装器会在文件顶部加入以下形式的管理块：

```markdown
<!-- HELLO-SCHOLAR:BEGIN codex -->
...
<!-- HELLO-SCHOLAR:END codex -->
```

或：

```markdown
<!-- HELLO-SCHOLAR:BEGIN claude -->
...
<!-- HELLO-SCHOLAR:END claude -->
```

项目内卸载只会删除：

- 对应工具的 hello-scholar 管理块；
- 能证明由当前 hello-scholar checkout 拥有的 Skill 目录。

它不会删除：

- 管理块之外的用户内容；
- 无法证明属于 hello-scholar 的同名 Skill；
- `hello-scholar/architecture.md`；
- Spec Bundle；
- Handoff；
- 根目录 `runs/` 中的实验记录。

如果 marker 或软链接指向另一个、已搬迁的 checkout，自动卸载会保守跳过，需要人工核对。

## 项目偏好

可以在项目的 `AGENTS.md` 或 `CLAUDE.md` 中记录长期偏好，例如当前项目语言、表达方式、测试命令、依赖选择和文档位置。

示例：

```markdown
## 项目偏好

- 当前项目语言：中文
- 语言偏好：用户可以在当前请求或后续消息中指定当前任务使用的语言；未指定时沿用目标文件或项目的主要语言，仍无法确定时使用当前项目语言。代码符号、字段名、路径、命令、文件名和必要技术术语保留原文，但不据此切换正文语言。
- 表达偏好：使用自然、直接、具体的语言，先说明结论和实际影响，再解释原因、证据和下一步；必要的专业术语首次出现时说明它在当前场景中的含义。
- 测试偏好：修改代码后运行 `npm test`，除非当前任务明确缩小验证范围。
- 依赖偏好：新增依赖前优先检查项目已有工具和标准库。
- 文档偏好：使用 `hello-scholar/architecture.md`、`hello-scholar/specs/`、`hello-scholar/handoffs/` 和根目录 `runs/`；不要手工修改生成的 `INDEX.md`。
```

当前任务的临时语言或输出要求可以直接写在请求或后续消息中，不需要写回项目文件。

## 迁移已有文档

当前版本没有 `docs migrate` 命令。已有项目中的旧文档，包括历史 `hello-scholar/memory/...` 路径下的材料，应先只读盘点并提出逐项 Mapping Proposal。用户批准具体映射前，Agent 不应自动移动、删除、双写或创建迁移脚本。

可以将下面的请求发送给 Claude Code 或 Codex：

```text
请先运行 `npm root -g`，并读取其输出目录下的 `hello-scholar/docs/migration/document-model-v2.md`。如果文件不存在，请停止并报告，不要猜测其他路径。
读取后，严格按该文件的 Document Model v2 流程迁移当前项目文档：先只读盘点并输出逐项 Mapping Proposal，等待我批准后仅执行获批行；不要自动移动、删除、双写或创建迁移脚本。当前版本没有 `docs migrate` 命令。文件夹数量过多时，先询问我是否使用 subagent 加速处理。
完成前确认每个获批目标位于 canonical v2 path，相关 `legacy-path` notices 已消失，或已在 Mapping Proposal 中明确获批保留。
```

这段请求会从全局 npm 安装目录读取迁移说明，不会把 hello-scholar 源文件复制到目标项目。

完整边界见：[Document Model v2 迁移说明](docs/migration/document-model-v2.md)。

## Skill 发现规则

本仓库扫描：

```text
skills/*/SKILL.md
```

当前 Skill 使用扁平目录：

```text
skills/<skill-name>/SKILL.md
```

每个 Skill 以 `SKILL.md` Front Matter 中的 `name` 作为安装目录名。正常使用时，应直接向 Agent 描述目标和约束，不要把全部 Skill 当成必须手动执行的固定流水线。

## 常见问题

### 每次修改代码都要写 Spec 吗？

不需要。局部 Bug、文案、格式、单个测试和低风险内部修改通常直接完成。

### 必须记住所有 Skill 名称吗？

不需要。直接描述目标、约束、已有材料和希望停在哪一步即可。

### 可以只讨论设计，不修改代码吗？

可以。在请求中明确写“先讨论设计，不要开始实现”。

### 安装会覆盖已有的 `AGENTS.md` 或 `CLAUDE.md` 吗？

不会。安装器只管理带 hello-scholar 起止标记的内容块，并保留管理块之外的内容。

### 为什么 Agent 有时会要求审核？

设计、实施策略、任务拆分、正式实验和 Architecture 更新会影响不同范围。分别审核可以防止一次同意被误解为允许后续所有操作。

### 为什么 Plan 或 Tasks 显示为 `Stale`？

这表示上游 Spec 已经修改，旧 Plan 或 Tasks 可能不再完全符合当前设计。文件没有丢失，但继续实施前需要重新核对。

### `link` 和 `copy` 应该选哪个？

大多数情况使用默认 `link`。如果项目需要独立修改 Skills，且不希望影响其他项目，使用 `copy`。

### 如何只检查文档而不修改文件？

运行：

```bash
hello-scholar docs check
```

## 开发

运行完整测试：

```bash
npm test
```

`npm test` 会同时运行 Node CLI 测试和 Python unittest。

## 参考来源

hello-scholar 的设计参考了以下项目和规范：

- OpenAI Codex 官方文档：`AGENTS.md`、`.agents/skills`、Codex Skills 和 symlink Skill 发现规则；
- Anthropic Claude Code 官方文档：`CLAUDE.md`、`.claude/skills` 和 Claude Code 的项目级安装方式；
- [`Auto-claude-code-research-in-sleep`](https://github.com/wanshuiyin/Auto-claude-code-research-in-sleep)：科研自动化、实验、论文、知识库和 review 类 Skill 的组织方式；
- [`hai-stack`](https://github.com/hylarucoder/hai-stack)：高层判断、落地压力测试、架构审查和文档审计类 Skill 的组织方式；
- [`mattpocock/skills`](https://github.com/mattpocock/skills)：工程工作流、handoff、问题拆分和项目协作类 Skill 的组织方式；
- [`andrej-karpathy-skills`](https://github.com/multica-ai/andrej-karpathy-skills)：短 Prompt、强约束原则和轻量规则表达方式；
- [`superpowers`](https://github.com/obra/superpowers) Skills：brainstorming、TDD、计划、执行、调试、review、验证和交接等工作流 Skill 的结构；
- 本仓库 [`docs/need_skills/`](docs/need_skills/)：候选 Skill 的筛选、最小 Skill 集和合并取舍。

## 设计与迁移资料

下一代文档驱动框架的设计资料：

```text
docs/specs/next_generation_skill/hello-scholar文档驱动 AI 科研开发框架 PRD.md
docs/specs/next_generation_skill/hello-scholar文档驱动 AI 科研开发框架执行plan.md
docs/migration/document-model-v2.md
```

CLI 安装器的实现计划：

```text
docs/plan/hello-scholar-cli-install-plan.md
```
