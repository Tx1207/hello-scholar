# hello-scholar

`hello-scholar` 是一个面向科研代码项目的 Codex runtime。它把日常科研开发中容易散落在聊天记录、终端输出、实验日志和论文草稿里的信息，整理成一套可追踪的工作流：从研究构思、ML 实验开发、结果分析，到论文写作、自审、投稿 Rebuttal 和录用后处理。

它的核心目标不是“多装一些 skills”，而是让 agent 在科研项目里持续回答三个问题：

- 这次修改解决了什么问题？
- 这个实验验证了什么假设？
- 哪些结论、偏好和工作流值得沉淀下来？

## 为什么需要 hello-scholar

科研代码项目和普通软件项目不一样。一次修改可能是代码实现，也可能是一次实验假设、一个 ablation、一个 baseline 修复、一次失败运行，或者一段将来要写进论文的结果分析。

`hello-scholar` 为这种工作方式提供一套默认约定：

- 实质修改要留下 change record。
- 实验相关修改要进入 experiment package。
- 实验运行、证据、指标和分析要集中存放。
- 不同科研阶段使用不同 profile，而不是手动选择大量 skills。
- 可复用工作流沉淀为 skill candidate。
- 稳定的用户偏好沉淀为 preference candidate。

## 核心特性

### 实验开发优先

默认 profile 是 `ml-development`，面向科研代码开发、实验实现、验证、结果分析和下一轮实验规划。

### 集中式 Experiment Package

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

### Profile 驱动的科研生命周期

`hello-scholar` 用 profile 表达科研阶段和支撑工作流。你可以只使用默认 ML 开发 profile，也可以叠加论文写作、自审、rebuttal、Obsidian、Zotero、知识提取或技能进化能力。

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

### Skill 与 Preference Evolution

`hello-scholar` 使用 candidate-first 策略：

- 发现可复用 workflow 时，先生成 skill candidate。
- 发现稳定协作偏好时，先生成 preference candidate。
- candidate 不会自动应用，需要用户明确确认。

这让 agent 可以逐步适应你的科研风格，又不会悄悄改掉全局提示词或 skills。

### Standby / Global 两种安装模式

- `standby`：项目内模式，只影响当前项目。
- `global`：全局模式，影响所有 Codex 项目。

同一个项目下二者不能共存；不同项目的 standby 可以共存。

## 安装

要求：

- Node.js >= 18
- npm
- Codex CLI（安装到 Codex runtime 时需要）

从 npm 安装：

```bash
npm install -g hello-scholar
```

从源码安装：

```bash
npm install
npm run build:catalog
npm install -g .
```

检查安装：

```bash
hello-scholar status
```

## 快速开始

查看 profile：

```bash
hello-scholar profile list
```

使用默认 ML 实验开发能力：

```bash
hello-scholar profile use ml-development
```

叠加 ML 开发与论文写作能力：

```bash
hello-scholar profile use ml-development paper-writing
```

叠加支撑工作流，例如 Obsidian 记忆与技能进化：

```bash
hello-scholar profile use ml-development obsidian-memory skill-evolution
```

安装到当前项目：

```bash
hello-scholar install codex --standby
```

安装到全局 Codex 环境：

```bash
hello-scholar install codex --global
```

查看当前状态：

```bash
hello-scholar status
hello-scholar preferences show
```

清理安装：

```bash
hello-scholar cleanup codex --standby
hello-scholar cleanup codex --global
```

## CLI

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

## Agent 内部命令

在 Codex 会话中，`hello-scholar` 只保留六个高频命令 skill：

```text
~idea     研究构思、比较方案、提出假设
~plan     生成方案包、任务拆解、风险和验收标准
~build    实施代码、配置、文档或实验变更
~verify   跑测试、审查 diff、整理 evidence、检查交付门槛
~analyze  分析实验结果、baseline 对比、failure case 和下一轮实验
~evolve   生成 skill / preference candidate
```

这些不是 npm 子命令，而是 agent 在会话中使用的任务路由。

## 目录约定

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
  experiments/
  plans/
  preferences/
  research/
  state/
```

### 全局共享目录

全局偏好、overlay skills 和 evolution candidates 存放在：

```text
~/plugins/hello-scholar/.hello-scholar/
```

## Skill 组织

真实 skills 按能力域组织，profile 只是 manifest，不复制 skill 本体。

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

## 开发

需求与验收矩阵：[`docs/requirements.md`](docs/requirements.md)。

构建 catalog：

```bash
npm run build:catalog
```

运行测试：

```bash
npm test
```

## License

MIT
