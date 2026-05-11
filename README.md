# hello-scholar

![hello-scholar banner](images/hello-scholar-banner.png)

`hello-scholar` 是一个面向科研代码项目的 Codex runtime。它把日常科研开发中容易散落在聊天记录、终端输出、实验日志和论文草稿里的信息，整理成一套可追踪的工作流：从研究构思、ML 实验开发、结果分析，到论文写作、自审、投稿 Rebuttal 和录用后处理。

它的核心目标不是“多装一些 skills”，而是让 agent 在科研项目里持续回答三个问题：

- 这次修改解决了什么问题？
- 这个实验验证了什么假设？
- 哪些结论、偏好和工作流值得沉淀下来？

## 目录

- [快速理解](#快速理解)
- [快速开始](#快速开始)
- [工作流总览](#工作流总览)
- [核心概念](#核心概念)
- [安装](#安装)
- [CLI 与 Agent 命令](#cli-与-agent-命令)
- [目录约定](#目录约定)
- [Skill 组织](#skill-组织)
- [参考项目](#参考项目)
- [License](#license)

## 快速理解

科研代码项目和普通软件项目不一样。一次修改可能是代码实现，也可能是一次实验假设、一个 ablation、一个 baseline 修复、一次失败运行，或者一段将来要写进论文的结果分析。

`hello-scholar` 为这种工作方式提供一套默认约定：

- 实质修改要留下 change record。
- 实验相关修改要进入 experiment package。
- 实验运行、证据、指标和分析要集中存放。
- 不同科研阶段使用不同 profile，而不是手动选择大量 skills。
- 可复用工作流沉淀为 skill candidate。
- 稳定的用户偏好沉淀为 preference candidate。

适合使用它的项目：

- 需要频繁修改模型、loss、数据处理、训练流程、评估脚本或实验配置。
- 需要把 dry run、small run、full run、ablation、failure case 和 baseline 对比串起来。
- 需要让 Codex 在长期科研协作中记住项目状态，但不希望它自动改全局 prompt 或偏好。
- 需要把实验证据、结果分析和论文材料保持可追溯。

它不是新的训练框架，也不替代 MLflow、Weights & Biases 或论文管理工具；它更像是 Codex 会话中的科研 workflow layer，负责把 agent 的计划、修改、验证、实验证据和经验沉淀连接起来。

## 快速开始

从源码安装：

```bash
npm install
npm run build:catalog
npm install -g .
```

选择安装 profile：

```bash
hello-scholar profile list
```

安装到当前项目or安装到全局：

```bash
hello-scholar install codex --standby
```

```bash
hello-scholar install codex --global
```

查看当前状态：

```bash
hello-scholar status
hello-scholar preferences show
```

在 Codex 会话中使用内部命令：

```text
~plan     生成方案包、任务拆解、风险和验收标准
~build    实施代码、配置、文档或实验变更
~verify   跑测试、审查 diff、整理 evidence、检查交付门槛
~analyze  分析实验结果、baseline 对比、failure case 和下一轮实验
```

## 工作流总览

一次典型科研开发任务会沿着下面的路径推进：

```text
用户请求
  -> 清晰度判断与 ROUTE / TIER
  -> 按需生成 plan package
  -> 修改代码、配置、文档或实验设置
  -> 写入 change record 或 experiment package
  -> 运行验证并记录 evidence
  -> 分析结果、同步 state、沉淀 candidate
```

常见产物对应关系：

| 你在做什么 | hello-scholar 记录在哪里 | 作用 |
|---|---|---|
| 普通代码、配置或文档修改 | `hello-scholar/changes/` | 说明实际改了什么、影响哪些文件、如何验证。 |
| 新实验或实验相关修改 | `hello-scholar/experiments/EXP-*/` | 集中保存 hypothesis、run、metrics、evidence、analysis 和 artifacts。 |
| 复杂任务规划 | `hello-scholar/plans/PLAN-*/` | 保存 requirements、plan、tasks 和 contract，后续验证可追溯。 |
| 当前会话和项目状态 | `hello-scholar/state/` | 记录 active change、active experiment、下一步和阻塞项。 |
| 可复用经验或偏好 | `hello-scholar/evolution/`、`hello-scholar/preferences/candidates/` | 先形成 candidate，经用户确认后才应用。 |

## 核心概念

### Profile 驱动的能力选择

默认 profile 是 `ml-development`，面向科研代码开发、实验实现、验证、结果分析和下一轮实验规划。你也可以叠加论文写作、自审、rebuttal、Obsidian、Zotero、知识提取或技能进化能力。

| Profile | 阶段 | 适用场景 |
|---|---|---|
| `research-ideation` | 研究构思 | 研究问题、假设、方法方向、文献切入点、初步实验设想。 |
| `ml-development` | ML 实验开发 | 科研代码开发、实验实现、验证、实验分析、baseline 和 ablation。 |
| `paper-writing` | 论文写作 | 方法、实验、结果章节写作，引用和结构整理。 |
| `paper-self-review` | 论文自审 | 从 reviewer 视角检查 novelty、technical correctness 和 empirical evidence。 |
| `submission-rebuttal` | 投稿与 Rebuttal | 投稿材料、审稿意见拆解、response 策略和 rebuttal 写作。 |
| `post-acceptance` | 录用后处理 | camera-ready、slides、poster、project page 和传播材料。 |

支撑型 profile 不改变科研生命周期主线，只用于激活可选能力集合：

| Profile | 类型 | 适用场景 |
|---|---|---|
| `knowledge-extraction` | 支撑工作流 | 从论文、Kaggle、代码和实验材料中提取可复用知识。 |
| `obsidian-memory` | 支撑工作流 | 维护 Obsidian 项目记忆、实验日志、研究日志、Canvas 和知识图谱。 |
| `zotero-integration` | 支撑工作流 | 连接 Zotero 与 Obsidian 文献工作流，支持引用整理和知识同步。 |
| `skill-evolution` | 支撑工作流 | 总结协作经验，审查、改进和沉淀 skills、agents 与 commands。 |

### Change Record

只要任务会影响项目内容、代码、实验、配置、文档或 workflow，就应创建或更新 change record。它回答的是“实际发生了什么”，而不是复述计划。

典型记录包括：

- 用户请求与意图摘要。
- 受影响文件和文件级变更。
- 可观察的行为变化。
- 决策记录、验证结果和未解决问题。
- 与 plan、task、experiment 或 evidence 的 traceability。

### Experiment Package

实验相关事实集中保存在：

```text
hello-scholar/experiments/EXP-YYYYMMDD-HHMMSS-short-name/
```

典型内容包括：

- `experiment.yaml`：实验元数据、hypothesis、lineage、配置、指标和跟踪信息。
- `changes.md`：与实验相关的实质修改。
- `runs.md`：dry run、unit test、small run、full run、ablation 等运行记录。
- `evidence.md`：验证证据、指标、日志摘要和人工检查结论。
- `analysis.md`：结果解释、baseline 对比、failure case 和下一轮实验。
- `artifacts.json`：产物路径索引。

### Skill 与 Preference Evolution

`hello-scholar` 使用 candidate-first 策略：

- 发现可复用 workflow 时，先生成 skill candidate。
- 发现稳定协作偏好时，先生成 preference candidate。
- candidate 不会自动应用。

这让 agent 可以逐步适应你的科研风格，又不会悄悄改掉全局提示词或 skills。

自进化应用规则：

`hello-scholar` 可以在任务结束时自动审查并积累 skill / preference candidate。

但 candidate 不会自动应用。

只有用户看过 preview 并明确选择后，AI 才能继续。skill overlay apply 使用脚本强制的三步状态机：

1. `preview`：展示原内容、将要修改或新建的内容、和已有 skill 的区别、可选动作，以及每个动作会处理哪些文件。
2. `approve`：只记录用户明确选择，例如 `apply-overlay`；“处理这个 skill”“继续”“可以”等模糊表达不会通过。
3. `apply`：只在 preview hash 未变化且 candidate 已 approved 时写入 overlay skill 并刷新 runtime selection。

示例：

```bash
node scripts/evolution/skill-evolution-apply.mjs preview --candidate-id skill-evo-...
node scripts/evolution/skill-evolution-apply.mjs approve --candidate-id skill-evo-... --decision apply-overlay --preview-hash <hash> --user-confirmation "确认应用 skill-evo-... 到 overlay skill"
node scripts/evolution/skill-evolution-apply.mjs apply --candidate-id skill-evo-...
```

Preference apply 仍需要展示 before/after、作用域和高影响确认需求后再写入 `user-preferences.yaml`。

### 交互与收尾规则

主代理在每轮进入 ROUTE / TIER 前，会对用户请求做 0-5 的清晰度判断。该评分只作为内部路由依据，默认不会写进用户可见回复；只有在需求不够清楚、确实需要用户补充或确认时，才说明清晰度不足并提问。判断不会只看最后一句话，而会结合对话上下文、项目文件、当前状态、已有计划、active change / experiment、可采用的低风险默认值，以及是否可以先做只读探索来降低不确定性。

当评分低于阈值，或歧义会影响不可逆修改、实验设计、prompt / workflow 修改、外部副作用或高成本执行时，主代理会先提出聚焦的澄清问题，并用 `❓等待输入` 作为最终收尾状态。若缺口不影响主路径，agent 会继续执行并说明采用的合理假设。

`hello-scholar` 的包装输出只用于本轮最终收尾消息。工具调用前说明、执行中的进度更新、流式可见文本，以及任何发出后仍会继续执行的回复，都保持自然输出，避免把中间状态误判为完成态。最终收尾格式会标注本轮实际使用的主要 skill / agent；未使用时填写 `none`。

### Standby / Global 两种安装模式

- `standby`：项目内模式，只影响当前项目。
- `global`：全局模式，影响所有 Codex 项目。

同一个项目下二者不能共存；不同项目的 standby 可以共存。

## 安装

要求：

- Node.js >= 18
- npm
- Codex CLI（安装到 Codex runtime 时需要）

从 npm 安装暂不可用，当前推荐源码安装：

```bash
npm install
npm run build:catalog
npm install -g .
```

检查安装：

```bash
hello-scholar status
```

清理安装：

```bash
hello-scholar cleanup codex --standby
hello-scholar cleanup codex --global
```

## CLI 与 Agent 命令

### CLI

`hello-scholar` 的 CLI 故意保持很小，只保留日常需要记住的入口：

```bash
hello-scholar help
hello-scholar install codex [--standby|--global]
hello-scholar cleanup codex [--standby|--global]
hello-scholar profile list
hello-scholar profile use <profile-id> [...profile-id]
hello-scholar preferences show
hello-scholar status [--standby|--global]
```

`profile list` 在交互式终端中会进入 profile 选择；在非交互环境中打印列表。

常用 profile 组合：

```bash
hello-scholar profile use ml-development
hello-scholar profile use ml-development paper-writing
hello-scholar profile use ml-development obsidian-memory skill-evolution
```

安装范围：

```bash
hello-scholar install codex --standby
hello-scholar install codex --global
```

### Agent 内部命令

在 Codex 会话中，`hello-scholar` 只保留七个高频命令 skill：

```text
~idea     研究构思、比较方案、提出假设
~plan     生成方案包、任务拆解、风险和验收标准
~build    实施代码、配置、文档或实验变更
~verify   跑测试、审查 diff、整理 evidence、检查交付门槛
~analyze  分析实验结果、baseline 对比、failure case 和下一轮实验
~evolve   生成 skill / preference candidate
~apply-candidate  审核并同步已有 skill / preference candidate
```

这些不是 npm 子命令，而是 agent 在会话中使用的任务路由。

## 目录约定

### 仓库主要目录

```text
catalog/       profile、skill、agent 的机器可读索引。
skills/        各能力域的 SKILL.md，本体按职责组织。
agents/        可委派的子代理定义。
scripts/       CLI、catalog、runtime state、change、experiment 和 evolution 逻辑。
templates/     change、plan、evidence、state、candidate 等项目资产模板。
test/          Node test runner 测试。
docs/          需求、验收矩阵和设计文档。
```

### 运行态目录

`.hello-scholar/` 是安装态目录，用于存放当前项目激活的 runtime、skills、agents、scripts 和 templates。

```text
.hello-scholar/
  modules.json
  install-state.json
  skills/
  agents/
  scripts/
  templates/
```

### 项目资产目录

`hello-scholar/` 是长期项目资产目录，适合纳入版本管理。

```text
hello-scholar/
  changes/
  evolution/
  experiments/
  plans/
  preferences/
  research/
  state/
```

其中 `research/` 是从 experiment packages 生成的研究状态视图，不是实验事实主存储。

### 全局共享目录

全局偏好、overlay skills 和 evolution candidates 存放在：

```text
~/plugins/hello-scholar/.hello-scholar/
```

## Skill 组织

真实 skills 按能力域组织，profile 只是 manifest，不复制 skill 本体。读者通常先看 `catalog/profiles.json` 理解 profile，再按 profile 中引用的 skill 路径阅读具体 `SKILL.md`。

```text
skills/
  commands/
  core/
  research/
  development/
  writing/
  review/
  submission/
  post-acceptance/
  memory/
  meta/
  profiles/
```

## 参考项目

`hello-scholar` 的设计参考了以下项目，并在其基础上聚焦 Codex runtime 下的科研代码、实验记录和 skill / preference evolution 工作流。

1. [HelloAGENTS](https://github.com/hellowind777/helloagents)
   - 面向 AI coding CLIs 的 workflow layer，强调 skills、project knowledge、delivery checks、安全配置写入和可恢复执行。
   - `hello-scholar` 借鉴了其命令路由、最终收尾格式、交付检查和持续执行理念。

2. [Claude Scholar](https://github.com/Galaxy-Dawn/claude-scholar)
   - 面向学术研究与软件开发的半自动研究助手，覆盖文献、编码、实验、报告、写作和项目知识管理。
   - `hello-scholar` 借鉴了其科研生命周期划分、以研究者决策为中心的边界，以及实验/写作/发表阶段的 workflow 组织方式。

## License

MIT
