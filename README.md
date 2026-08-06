# hello-scholar

hello-scholar 是一套面向科研和工程协作的 Agent Skills 与项目规则集合。

它把当前系统事实、设计、实施、实验和验证串成一套文档驱动的工作方式：你直接说明目标和约束，Agent 根据任务性质选择合适路径，并将需要长期保留的事实写入明确的 owner 文档。

## 目录

- [项目特点和优势](#项目特点和优势)
- [正常使用：与 Agent 协作](#正常使用与-agent-协作)
- [核心文档和目录](#核心文档和目录)
- [Skills 在工作流中的位置](#skills-在工作流中的位置)
- [Current Architecture 如何维护](#current-architecture-如何维护)
- [安装 CLI](#安装-cli)
- [卸载 CLI](#卸载-cli)
- [使用 CLI](#使用-cli)
- [迁移已有文档](#迁移已有文档)
- [卸载项目内安装内容](#卸载项目内安装内容)
- [指令块](#指令块)
- [link 和 copy 的区别](#link-和-copy-的区别)
- [Skill 发现规则](#skill-发现规则)
- [User Preferences](#user-preferences)
- [参考来源](#参考来源)
- [开发](#开发)
- [设计文档](#设计文档)

## 项目特点和优势

- **从目标开始**：不需要记住或手动串联全部 Skill；直接说明要完成的工作、约束和已有材料即可。
- **文档驱动闭环**：用 Current Architecture、Spec、Plan、Tasks、Record 保存不同类型的长期事实，避免把设计、实施计划和实验结论混在一起。
- **简单任务保持轻量**：局部 Bug、文案、格式或单测不必为了流程完整而创建一套文档。
- **审批边界清楚**：设计、计划、任务、正式实验和 Architecture 更新各自有独立确认门，不会因一次对话自动扩散写入。
- **同时支持 Codex / Claude Code**：分别写入 `AGENTS.md` 和 `CLAUDE.md` 的 hello-scholar 管理块。
- **统一维护或项目内定制**：`link` 适合统一维护一套 Skills，`copy` 适合让项目拥有独立副本。

## 正常使用：与 Agent 协作

安装后，直接告诉 Agent 你要达成的目标、不可改变的约束，以及已经存在的设计、代码或实验材料。例如：

```text
修复登录页提交失败后按钮一直处于 loading 状态，并补充回归测试。
```

```text
为训练任务增加断点续训能力。checkpoint 目录结构不能改变；请先讨论设计，不要开始实现。
```

Agent 会根据任务走不同路径，而不是要求你逐个执行 Skill。

### 简单修改：Fast Path

局部 Bug、文案、格式、单个测试、无外部行为变化的内部重构，以及临时调试，通常直接走：

```text
Code → Test → Git
```

这类工作不创建或修改 Spec、Plan、Tasks、Record、Architecture。

### 新能力或重要改动：设计优先

新能力、公共接口变化、模块职责调整、数据或配置迁移，以及高风险改动，通常先形成可审阅设计：

```text
Current Architecture
        ↓
Spec → Plan → Tasks
        ↓
主 Agent 直接实施
        ↓
Tests / Record（按需）
        ↓
Converge + Fresh Evidence
        ↓
Architecture Maintenance（条件触发）
```

这不是每次都必须经过的硬编码链，而是复杂工作中各类事实的正确归属：

1. 先读取相关 Current Architecture，理解当前已实现的系统和约束。
2. 形成或更新 Spec，明确目标、边界、行为、取舍和验收条件；接受 Spec 后再继续实施设计。
3. 基于 Accepted Spec 编写 Plan；用户审核并批准 Plan 后，才能生成 Tasks。
4. 将 Plan 拆成可独立验证的 Tasks；用户审核并批准 Tasks 后，再明确要求开始实施。
5. 主 Agent 按 Tasks 的依赖直接执行、验证并更新真实代码；没有额外的“执行计划”包装 Skill。
6. 需要正式实验事实时建立 Record；普通单元测试不需要创建 Run Record。
7. 在 Bundle 末端或你明确要求时，用 Converge 审计实现是否收敛到 Spec，并取得当前工作树上的 Fresh Evidence。
8. 只有当前系统的结构性事实确实变化时，才考虑独立维护 Current Architecture。

### 低风险探索：实验优先

对于参数扫描、可丢弃的模型或 Prompt 对比、快速可行性验证等隔离探索，可以先实验再决定是否形成正式设计：

```text
Quick Experiment → Record → Analyze → Spec / Plan / Tasks
```

探索必须有时间和成本边界，不能修改生产数据、执行不可逆操作、改变公共 API 或持久化格式，也不能直接进入正式生产路径。正式、昂贵、长时间、不可逆，或用于验收 Spec 的实验，应在启动前建立 Run Record。

### 已有文档的维护

当你希望检查文档健康状态、重建导航 Index、更新 Current Architecture，或只读盘点旧材料时，可以直接说明目的。例如：

```text
检查当前项目的 hello-scholar 文档状态，不要修改文件。
```

```text
基于已完成的 Bundle 和当前代码，先提出 Current Architecture 更新 Proposal，不要直接写文件。
```

## 核心文档和目录

hello-scholar 用五类核心文档保存长期项目事实；每类文档只有一个职责。

| 文档 | 保存什么 | 位置 |
| --- | --- | --- |
| Current Architecture | 当前已经实现并正式采用的系统 | `hello-scholar/architecture.md` |
| Spec | 目标设计、边界、行为和验收条件 | `hello-scholar/specs/<topic>/SPEC-.../spec.md` |
| Plan | 已接受设计的高层技术实施策略 | 同一 Bundle 的 `plan.md` |
| Tasks | 已批准 Plan 的可执行任务、依赖和验证 | 同一 Bundle 的 `tasks.md` |
| Record | 正式实验、Benchmark、Eval 或训练的可复现事实与结论 | `runs/<run-id>/record.md` |

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

`hello-scholar/handoffs/` 用于按需交接会话上下文；它不是五类核心文档的一部分，也不进入 Spec 或 Run Index。

每次文档事务只修改它自己的语义：Spec 改动不连带重写 Plan，Plan 改动不连带重写 Tasks，实验事实不连带改写设计。当 Spec Revision 变化后，Plan 或 Tasks 显示为 `Stale` 是正常状态；继续实施时再由相应 owner 同步它们。

`INDEX.md` 是派生导航文件，只能由 CLI 生成，不能由 Agent 或用户手工维护：

```bash
hello-scholar docs check
hello-scholar docs sync
```

- `hello-scholar docs check` 只读检查文档状态。
- `hello-scholar docs sync` 只生成或更新派生的 `INDEX.md`。

## Skills 在工作流中的位置

以下是正常项目工作流中各项能力的分工。它们描述 Agent 在什么阶段负责什么，而不是用户必须背诵的命令列表。

| 阶段 | Skill / Owner | 作用 |
| --- | --- | --- |
| 路由 | `using-helloscholar` | 判断当前工作适合 Fast Path、设计、实施、实验还是文档维护。 |
| 设计讨论 | `brainstorming` | 澄清目标、约束、风险、接口、数据流和验收条件；在实现前停止。 |
| Spec 身份 | `manage-specs` | 判断更新已有 Spec、创建独立 Spec、创建 Successor Spec，或请求人工分类。 |
| 实施计划 | `writing-plans` | 从 Accepted Spec 形成高层技术实施策略，不重新打开已确定的重大设计选择。 |
| 任务拆分 | `generating-tasks` | 将 Approved Plan 拆成可独立执行、可验证的 Tasks。 |
| 实施 | 主 Agent | 直接读取 Architecture、Spec、Plan、Tasks 和相关代码/测试，按依赖执行 Tasks。 |
| 正式运行 | `record-experiment` | 建立、补全或更新正式实验、Benchmark、Eval、训练等 Run Record。 |
| 收敛审计 | `converge-to-spec` | 追溯 Spec → Plan → Tasks → 代码、测试、Record，判断 Bundle 是否准备好完成证据。 |
| 文档维护 | `docs-maintenance` | 检查文档、生成 Index、维护 Current Architecture，或恢复可审阅的文档状态。 |

下列能力只在你明确需要时加入，不是每次开发的固定步骤：

| Skill | 适用场景 |
| --- | --- |
| `takeoff` | 从更高层重新判断目标、问题边界、方向和取舍。 |
| `grilling` | 从反对者视角挑战方案、假设、反例和代价。 |
| `crash-audit` | 审计当前答案、Spec、Plan 或决策中的不确定性、遗漏和盲点。 |
| `landing` | 把较大的方向压缩成可验证、可止损、可推进的最小范围。 |
| `test-driven-development` | 你或 Approved Task 明确要求完整 Red–Green–Refactor。 |
| `using-git-worktrees` | 你或 Approved Task 明确要求隔离 Worktree。 |
| `handoff` | 会话中断、上下文切换或需要交给另一位 Agent / 协作者。 |

例如，在形成设计后，你可以说：

```text
请对当前 Spec 和 Plan 做 crash-audit，重点检查数据迁移、失败恢复和验收条件是否遗漏。
```

或者：

```text
请 grilling 一下这个方案：假设吞吐量增长十倍，哪些前提会失效？
```

## Current Architecture 如何维护

`hello-scholar/architecture.md` 描述的是**当前已经实现并正式采用的系统事实**，不是未来设计草案。

开始较大改动前，Agent 会读取与任务相关的 Architecture 内容，理解当前模块职责、运行流程、技术选择、产物位置和约束。它只记录已经实现、验证并正式采用的内容；Draft Spec、未完成 Plan、未采用 Prototype 和聊天中的未来设想都不应提前写入。

Architecture 由 `docs-maintenance` 的 `architecture` 模式维护，遵循独立事务：

```text
当前代码 + Git + 已完成 Bundle + 有效 Record
        ↓
Architecture Proposal
        ↓
用户审核当前文件 Hash 与 Proposal
        ↓
批准后仅更新 hello-scholar/architecture.md
```

Proposal 阶段不会写文件。Agent 会说明事实来源、各章节的 Add / Change / Keep、需要移除的旧表述、未解决事实和预期写入范围。只有你明确批准该 Proposal 及其当前 Architecture Hash 后，Agent 才会更新 `hello-scholar/architecture.md`。

因此，Architecture 不会因为一个 Task、一次 Commit 或一次普通测试自动更新；它不阻塞日常开发，也不会与 Spec、Plan、Tasks 或 Record 自动同步改写。

## 安装 CLI

从本仓库目录安装到全局：

```bash
npm install -g .
```

也可以在本仓库内直接运行：

```bash
node bin/hello-scholar.js help
```

## 卸载 CLI

卸载全局安装的 `hello-scholar` 命令：

```bash
npm uninstall -g hello-scholar
```

这只会移除全局 CLI，不会清理已经写入各项目的 `AGENTS.md`、`CLAUDE.md` 或 Skill 目录。需要清理项目内安装内容时，先在对应项目里运行下方的 `hello-scholar uninstall ...` 命令。

## 使用 CLI

查看帮助：

```bash
hello-scholar help
```

在当前项目安装 Codex 支持：

```bash
hello-scholar install codex
```

安装后会写入：

```text
<project-root>/AGENTS.md
<project-root>/.agents/skills/<skill-name>
```

在当前项目安装 Claude Code 支持：

```bash
hello-scholar install claude
```

安装后会写入：

```text
<project-root>/CLAUDE.md
<project-root>/.claude/skills/<skill-name>
```

检查或重建已安装项目的文档导航：

```bash
hello-scholar docs check
hello-scholar docs sync
```

默认 Skill 安装模式是软链接：

```bash
hello-scholar install codex --mode link
```

如果希望把 Skills 深拷贝到当前项目：

```bash
hello-scholar install codex --mode copy
hello-scholar install claude --mode copy
```

## 迁移已有文档

当前版本没有 `docs migrate` 命令。已有项目中的旧文档，包括历史 `hello-scholar/memory/...` 路径下的材料，必须先只读盘点并提出 Mapping Proposal；在你批准具体映射前，Agent 不应自动移动、删除、双写或创建迁移脚本。

可以将下面这段发送给 Claude Code 或 Codex：

```text
请先运行 `npm root -g`，并读取其输出目录下的 `hello-scholar/docs/migration/document-model-v2.md`。如果文件不存在，请停止并报告，不要猜测其他路径。
读取后，严格按该文件的 Document Model v2 流程迁移当前项目文档：先只读盘点并输出逐项 Mapping Proposal，等待我批准后仅执行获批行；不要自动移动、删除、双写或创建迁移脚本。当前版本没有 `docs migrate` 命令。对于文件夹数量过多的情况，询问用户是否使用subagent加速处理。
完成前必须确认每个获批目标位于 canonical v2 path，相关 `legacy-path` notices 已消失或在 Mapping Proposal 中明确获批保留。
```

该指令会从全局 npm 安装目录读取迁移说明，不会将 hello-scholar 源文件复制到项目文件夹。

完整迁移边界见：[Document Model v2 迁移说明](docs/migration/document-model-v2.md)。

## 卸载项目内安装内容

卸载 Codex 支持：

```bash
hello-scholar uninstall codex
```

卸载 Claude Code 支持：

```bash
hello-scholar uninstall claude
```

卸载只会删除：

- `AGENTS.md` / `CLAUDE.md` 里的 hello-scholar 标记块；
- 能证明由当前 hello-scholar checkout 拥有的 Skill 目录。

它不会删除用户自己写的 `AGENTS.md` / `CLAUDE.md` 内容，也不会删除没有 hello-scholar 所有权标记的同名 Skill 目录。marker 或软链接仍指向另一个、已搬迁的 checkout 时，自动清理会保守跳过；请人工核对后处理。

无论何种安装模式，卸载都不会删除你的 `hello-scholar/architecture.md`、Spec Bundle、Handoff 或根目录 `runs/`。

## 指令块

hello-scholar 不覆盖已有 `AGENTS.md` 或 `CLAUDE.md`。

安装时会把内容插入到文件顶部：

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

重复安装时，如果检测到对应工具的 hello-scholar 块，会先提醒备份块内手动修改；只有输入 `yes` 才会继续替换，不会重复插入。

卸载时只删除对应工具的 hello-scholar 块。

## link 和 copy 的区别

`link` 模式：

- 目标项目里的 Skill 目录是软链接。
- 修改源仓库里的 Skill，所有项目都会看到更新。
- 也可以直接在目标项目的 Skill 路径里编辑；因为软链接指向源仓库，改动会落到 hello-scholar 源 Skill 上。
- 适合希望统一维护一套 Skills 的情况。

`copy` 模式：

- 目标项目获得一份独立 Skill 拷贝。
- 可以在当前项目里修改，不影响 hello-scholar 源仓库。
- 每个 copied Skill 会写入 `.hello-scholar-install.json`，用于卸载时识别所有权。

## Skill 发现规则

本仓库扫描：

```text
skills/*/SKILL.md
```

当前 Skill 使用扁平目录结构：

```text
skills/<skill-name>/SKILL.md
```

每个 Skill 以 `SKILL.md` Front Matter 中的 `name` 作为安装目录名。正常项目使用时，应优先依据上文的工作流和任务性质与 Agent 协作，而不是将目录中的每项 Skill 当作必须手动执行的流水线。

## User Preferences

可以在项目的 `AGENTS.md` 或 `CLAUDE.md` 中通过 `User Preferences` 写入项目统一设置。它不只用于默认语言，也适合记录测试命令、依赖偏好、文档位置、输出格式和项目约束等长期约定。

例如：

```markdown
## User Preferences

- Language preference: user-readable documents written by skills should use Chinese by default; keep code symbols, paths, commands, file names, enum values, tool names, and technical terms as written.
- Test preference: after code changes, run `npm test` unless the task explicitly narrows the verification scope.
- Dependency preference: prefer existing project utilities and standard library capabilities before adding new dependencies.
- Documentation preference: use `hello-scholar/architecture.md`, `hello-scholar/specs/`, `hello-scholar/handoffs/`, and root-level `runs/`; do not hand-edit generated `INDEX.md` files.
- Project convention: keep changes surgical and avoid unrelated refactors.
```

安装后的 file-writing Skills 会根据这个默认语言选择对应模板；例如默认中文时优先使用 `*.zh_CN.md` 模板。

## 参考来源

hello-scholar 的设计参考了以下项目和规范：

- OpenAI Codex 官方文档：`AGENTS.md`、`.agents/skills`、Codex Skills 和 symlink Skill 发现规则。
- Anthropic Claude Code 官方文档：`CLAUDE.md`、`.claude/skills` 和 Claude Code 的项目级安装方式。
- [`Auto-claude-code-research-in-sleep`](https://github.com/wanshuiyin/Auto-claude-code-research-in-sleep)：科研自动化、实验、论文、知识库和 review 类 Skill 的组织方式。
- [`hai-stack`](https://github.com/hylarucoder/hai-stack)：高层判断、落地压力测试、架构审查和文档审计类 Skill 的组织方式。
- [`mattpocock/skills`](https://github.com/mattpocock/skills)：工程工作流、handoff、问题拆分和项目协作类 Skill 的组织方式。
- [`andrej-karpathy-skills`](https://github.com/multica-ai/andrej-karpathy-skills)：短 prompt、强约束原则和轻量规则表达方式。
- [`superpowers`](https://github.com/obra/superpowers) Skills：brainstorming、TDD、计划、执行、调试、review、验证和交接等工作流 Skill 的结构。
- 本仓库 [`docs/need_skills/`](docs/need_skills/)：记录候选 Skill 的筛选、最小 Skill 集和合并取舍。

## 开发

运行测试：

```bash
npm test
```

`npm test` 会同时运行：

- Node CLI 测试；
- 现有 Python unittest。

## 设计文档

下一代文档驱动框架的设计资料见：

```text
docs/specs/next_generation_skill/hello-scholar文档驱动 AI 科研开发框架 PRD.md
docs/specs/next_generation_skill/hello-scholar文档驱动 AI 科研开发框架执行plan.md
docs/migration/document-model-v2.md
```

CLI 安装器的实现计划见：

```text
docs/plan/hello-scholar-cli-install-plan.md
```
